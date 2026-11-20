// Badges : la liste, les conditions et le calcul. Aucune dépendance au navigateur (testé par `npm run verify`).
//
// Principe : on ne « compte » rien au fil de l'eau. À chaque changement des données, on recalcule des statistiques
// à partir des tables de la base locale (computeStats), puis on regarde quels badges sont gagnés (earnedBadges).
// Un badge gagné est enregistré UNE FOIS dans la table `badges` sous la forme { id, at } (at = date d'obtention en ms) :
// c'est tout ce qu'il faut sauvegarder, synchroniser et fusionner (on garde le plus ancien `at`, voir mergeBadge).
import { addDays, dayKey } from './dates.js'

// Mêmes valeurs que src/lib/progress.js (vérifié par `npm run verify`)
export const DAILY_GOAL = 50
export const XP_PER_LEVEL = 100

export const BADGE_CATEGORIES = [
  { id: 'serie', label: 'Séries de jours' },
  { id: 'xp', label: 'XP et niveaux' },
  { id: 'cours', label: 'Cours' },
  { id: 'anglais', label: 'Anglais' },
  { id: 'revisions', label: 'Révisions' },
  { id: 'atelier', label: 'Atelier' },
  { id: 'defi', label: 'Défi du jour' },
  { id: 'entretien', label: 'Entretien' },
  { id: 'actu', label: 'Actu et favoris' },
]

// ───── Statistiques ─────
const noon = (dateKey) => new Date(`${dateKey}T12:00:00`).getTime()
const isDay = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s)

// Plus longue série de jours d'affilée dans une liste de jours "AAAA-MM-JJ" + date à laquelle chaque longueur a été atteinte
export function runs(dayKeys) {
  const days = [...new Set(dayKeys)].filter(isDay).sort()
  let best = 0
  let run = 0
  let prev = null
  const reachedAt = {} // longueur → première date où elle a été atteinte
  for (const d of days) {
    run = prev && dayKey(addDays(new Date(`${prev}T12:00:00`), 1)) === d ? run + 1 : 1
    if (run > best) {
      best = run
      reachedAt[run] = noon(d)
    }
    prev = d
  }
  return { best, reachedAt }
}

// Statistiques utilisées par les badges.
// data = { activity, lessons, workshop, english, rvLots, rvProgress, seen, favorites } (lignes des tables)
// modules = [{ id, lessons: [{ id }] }] (structure des cours, pour savoir si un module est terminé)
export function computeStats(data, modules, now = Date.now()) {
  const d = { activity: [], lessons: [], workshop: [], english: [], rvLots: [], rvProgress: [], seen: [], favorites: [], ...data }
  // Liste de dates (ms) triée ; une date inconnue (ancienne donnée sans horodatage) vaut « maintenant »
  const times = (list) => list.map((x) => (Number.isFinite(x) ? x : now)).sort((a, b) => a - b)

  // XP, niveau, séries
  const days = [...d.activity].filter((r) => isDay(r.date)).sort((a, b) => a.date.localeCompare(b.date))
  const totalXp = days.reduce((sum, r) => sum + (r.xp ?? 0), 0)
  const xpAt = (threshold) => {
    let sum = 0
    for (const r of days) {
      sum += r.xp ?? 0
      if (sum >= threshold) return noon(r.date)
    }
    return now
  }
  const goalDays = days.filter((r) => (r.xp ?? 0) >= DAILY_GOAL).map((r) => r.date)
  const streak = runs(goalDays)
  const daily = runs(days.filter((r) => r.daily === true).map((r) => r.date))

  // Cours : leçons terminées et modules terminés
  const lessonDone = new Map(d.lessons.map((r) => [r.id, r.completedAt]))
  const moduleTimes = []
  for (const m of modules) {
    if (m.lessons.length && m.lessons.every((l) => lessonDone.has(`${m.id}/${l.id}`))) {
      moduleTimes.push(Math.max(...m.lessons.map((l) => lessonDone.get(`${m.id}/${l.id}`)).map((x) => (Number.isFinite(x) ? x : now))))
    }
  }

  // Révisions : on retrouve le type de chaque carte grâce aux lots
  const typeOf = new Map()
  for (const lot of d.rvLots) for (const it of lot.items ?? []) typeOf.set(`${lot.id}|${it.id}`, it.type)
  const cards = d.rvProgress.filter((r) => r.dir !== 'x' && !String(r.itemId).startsWith('x:') && (r.reps ?? 0) > 0)
  const dayOrNull = (s) => (isDay(s) ? noon(s) : null)
  const flashKeys = new Set()
  const cardKeys = new Set()
  const flashTimes = []
  const cardTimes = []
  for (const r of cards) {
    const key = `${r.lotId}|${r.itemId}`
    if (!cardKeys.has(key)) {
      cardKeys.add(key)
      cardTimes.push(dayOrNull(r.last))
    }
    if (typeOf.get(key) === 'flashcard' && !flashKeys.has(`${key}|${r.dir}`)) {
      flashKeys.add(`${key}|${r.dir}`)
      flashTimes.push(dayOrNull(r.last))
    }
  }

  // Atelier : une activité = au moins une réussite (ou une partie terminée)
  const w = d.workshop
  const byPrefix = (prefix) => w.filter((r) => String(r.id).startsWith(prefix))
  const stamp = (r) => (Number.isFinite(r.completedAt) ? r.completedAt : dayOrNull(r.lastXpDay))
  const single = (id) => w.filter((r) => r.id === id && (r.games ?? 1) > 0).map(stamp)
  const bi = w.filter((r) => String(r.id).startsWith('bi/') && !String(r.id).startsWith('bi/ent/') && ((r.solved ?? 0) > 0 || r.completedAt || (r.bestScore ?? 0) > 0)).map(stamp)

  return {
    totalXp,
    level: Math.floor(totalXp / XP_PER_LEVEL) + 1,
    xpAt,
    maxStreak: streak.best,
    streakAt: streak.reachedAt,
    maxDailyStreak: daily.best,
    dailyAt: daily.reachedAt,
    goalDayCount: goalDays.length,
    firstGoalAt: goalDays.length ? noon(goalDays[0]) : now,
    modulesDone: moduleTimes.length,
    t: {
      lessons: times(d.lessons.map((r) => r.completedAt)),
      modules: times(moduleTimes),
      enLessons: times(d.english.filter((r) => String(r.id).startsWith('lesson/')).map((r) => r.completedAt)),
      enWords: times(d.english.filter((r) => String(r.id).startsWith('word/') && r.status === 'known').map((r) => r.updatedAt)),
      rvLots: times(d.rvLots.map((l) => l.createdAt)),
      rvFlash: times(flashTimes),
      rvCards: times(cardTimes),
      excel: times(byPrefix('excel/').map(stamp)),
      calcul: times(w.filter((r) => String(r.id).startsWith('calc/') && (r.solved ?? 0) > 0).map(stamp)),
      cas: times(byPrefix('cas/').map(stamp)),
      simulateur: times(single('simulateur')),
      biere: times(single('biere')),
      chargement: times(single('chargement')),
      negociation: times(single('negociation')),
      tournee: times(single('tournee')),
      bi: times(bi),
      interview: times(w.filter((r) => String(r.id).startsWith('bi/ent/') && r.status === 'known').map((r) => r.updatedAt)),
      videos: times(d.seen.filter((r) => String(r.id).startsWith('yt:')).map((r) => r.at)),
      favorites: times(d.favorites.filter((f) => f.on).map((f) => f.at)),
    },
  }
}

// ───── Liste des badges ─────
// Chaque badge : id (stable, jamais changé : il est sauvegardé), catégorie, icône (nom Lucide, voir BadgeIcon), titre,
// condition (texte affiché), target (valeur à atteindre), value(stats) (valeur actuelle), at(stats) (date de l'obtention).
const count = (cat, id, icon, title, cond, key, n) => ({ id, cat, icon, title, cond, target: n, value: (s) => s.t[key].length, at: (s) => s.t[key][n - 1] })
const streak = (n, id, icon, title) => ({ id, cat: 'serie', icon, title, cond: `Atteindre l'objectif de ${DAILY_GOAL} XP ${n} jours d'affilée`, target: n, value: (s) => s.maxStreak, at: (s) => s.streakAt[n] })
const dailyStreak = (n, id, icon, title) => ({ id, cat: 'defi', icon, title, cond: `Réussir le défi du jour ${n} jours de suite`, target: n, value: (s) => s.maxDailyStreak, at: (s) => s.dailyAt[n] })
const xp = (n, id, icon, title) => ({ id, cat: 'xp', icon, title, cond: `Cumuler ${n.toLocaleString('fr-FR')} XP`, target: n, value: (s) => s.totalXp, at: (s) => s.xpAt(n) })
const level = (n, id, icon, title) => ({ id, cat: 'xp', icon, title, cond: `Atteindre le niveau ${n} (${((n - 1) * XP_PER_LEVEL).toLocaleString('fr-FR')} XP)`, target: n, value: (s) => s.level, at: (s) => s.xpAt((n - 1) * XP_PER_LEVEL) })
const once = (id, icon, title, cond, key) => count('atelier', id, icon, title, cond, key, 1)

export const BADGES = [
  // Séries
  streak(3, 'serie-3', 'flame', 'Série de 3'),
  streak(7, 'serie-7', 'flame', 'Semaine en feu'),
  streak(30, 'serie-30', 'flame', 'Un mois sans faillir'),
  // XP et niveaux
  { id: 'objectif-1', cat: 'xp', icon: 'target', title: 'Objectif atteint', cond: `Gagner ${DAILY_GOAL} XP en une seule journée`, target: 1, value: (s) => s.goalDayCount, at: (s) => s.firstGoalAt },
  xp(100, 'xp-100', 'zap', 'Premiers points'),
  xp(1000, 'xp-1000', 'zap', 'Mille points'),
  xp(5000, 'xp-5000', 'zap', 'Machine à XP'),
  level(5, 'niveau-5', 'trending', 'Niveau 5'),
  level(10, 'niveau-10', 'trending', 'Niveau 10'),
  level(20, 'niveau-20', 'crown', 'Niveau 20'),
  // Cours
  count('cours', 'cours-1', 'book', 'Première leçon', 'Terminer une leçon de cours', 'lessons', 1),
  count('cours', 'cours-10', 'book', 'Dix leçons', 'Terminer 10 leçons de cours', 'lessons', 10),
  { id: 'module-1', cat: 'cours', icon: 'graduation', title: 'Premier module', cond: 'Terminer toutes les leçons d\'un module de cours', target: 1, value: (s) => s.modulesDone, at: (s) => s.t.modules[0] },
  { id: 'module-5', cat: 'cours', icon: 'graduation', title: 'Cinq modules', cond: 'Terminer toutes les leçons de 5 modules', target: 5, value: (s) => s.modulesDone, at: (s) => s.t.modules[4] },
  // Anglais
  count('anglais', 'en-1', 'languages', 'Hello!', 'Terminer une leçon d\'anglais', 'enLessons', 1),
  count('anglais', 'en-10', 'languages', 'Anglais en route', 'Terminer 10 leçons d\'anglais', 'enLessons', 10),
  count('anglais', 'en-mots-20', 'spell', 'Vocabulaire', 'Marquer 20 mots « Je connais »', 'enWords', 20),
  // Révisions
  count('revisions', 'rv-import', 'upload', 'Premier lot', 'Importer un lot de révisions', 'rvLots', 1),
  count('revisions', 'rv-flash', 'layers', 'Séance de flashcards', 'Réviser 10 flashcards', 'rvFlash', 10),
  count('revisions', 'rv-50', 'brain', 'Mémoire de fer', 'Réviser 50 cartes différentes (flashcards, questions, QCM)', 'rvCards', 50),
  // Atelier
  once('at-excel', 'table', 'Premier défi Excel', 'Réussir un défi Excel', 'excel'),
  once('at-calcul', 'calculator', 'Calculette', 'Réussir un exercice de formules et calculs', 'calcul'),
  once('at-cas', 'briefcase', 'Décideur', 'Terminer une étude de cas', 'cas'),
  once('at-simulateur', 'package', 'Gestionnaire de stock', 'Terminer une partie du simulateur de stock', 'simulateur'),
  once('at-biere', 'beer', 'Coup de fouet', 'Terminer une partie du jeu de la bière', 'biere'),
  once('at-chargement', 'truck', 'Chef de quai', 'Terminer un plan de chargement', 'chargement'),
  once('at-negociation', 'handshake', 'Négociateur', 'Terminer une négociation avec un fournisseur', 'negociation'),
  once('at-tournee', 'route', 'Chauffeur', 'Terminer une tournée de livraison', 'tournee'),
  once('at-bi', 'chart', 'Data analyste', 'Réussir une activité Power Query ou Power BI (exercice, scénario ou tableau de bord)', 'bi'),
  // Défi du jour
  dailyStreak(3, 'defi-3', 'calendar', 'Trois défis d\'affilée'),
  dailyStreak(7, 'defi-7', 'calendar', 'Défi : la semaine'),
  // Entretien
  count('entretien', 'entretien-1', 'mic', 'Première réponse', 'Maîtriser une question d\'entretien (« Je savais »)', 'interview', 1),
  count('entretien', 'entretien-10', 'mic', 'Prêt pour l\'entretien', 'Maîtriser 10 questions d\'entretien', 'interview', 10),
  // Actu et favoris
  count('actu', 'video-1', 'play', 'Curieux', 'Regarder une vidéo de l\'Actu', 'videos', 1),
  count('actu', 'favori-1', 'heart', 'Coup de cœur', 'Ajouter un favori', 'favorites', 1),
]
// `cat` des badges d'Atelier : count() reçoit toujours la catégorie en premier paramètre

export const findBadge = (id) => BADGES.find((b) => b.id === id)

// Badges gagnés d'après les statistiques : [{ id, at }]
export function earnedBadges(stats) {
  return BADGES.filter((b) => b.value(stats) >= b.target).map((b) => ({ id: b.id, at: b.at(stats) }))
}

// Fusion de deux lignes de la table `badges` (même id) : on garde la date d'obtention la plus ancienne
export function mergeBadge(local, incoming) {
  if (!local) return incoming
  return (incoming.at ?? Infinity) < (local.at ?? Infinity) ? { ...local, at: incoming.at } : local
}
