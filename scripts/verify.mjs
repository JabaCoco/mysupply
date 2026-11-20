// Vérification automatique du contenu : cours, Atelier (formules, Excel, cas) et anglais.
// Lancer : npm run verify      (s'arrête avec un code d'erreur s'il y a un problème)
//
// Ce que le script contrôle :
//  - structure de chaque leçon, carte, question, défi, cas, mot ;
//  - questions à chiffres aléatoires : 150 générations par question, sans erreur ni NaN ;
//  - exercices de formules : 200 séries, réponse attendue acceptée, correction non vide ;
//  - défis Excel : la solution se calcule sans erreur sur 150 tableaux aléatoires ;
//  - études de cas : structure, bonne réponse existante, lien vers une vraie leçon ;
//  - anglais : mots uniques, définitions, phrases à trous valides, 100 générations par leçon.
import fs from 'node:fs'
import { MODULES, ALL_LESSONS, findLesson } from '../src/data/courses/index.js'
import { MODULE_COLORS, MODULE_ICONS } from '../src/pages/cours/moduleStyle.js'
import { FORMULAS, FORMULA_LIST, generateExercises, checkNumber } from '../src/data/atelier/formulas.js'
import { EXCEL_CHALLENGES, buildCells } from '../src/data/atelier/excel.js'
import { CASES } from '../src/data/atelier/cases.js'
import { UNITS, ALL_EN_LESSONS, ALL_WORDS } from '../src/data/anglais/units.js'
import { buildExercises, checkOrder, checkTyped } from '../src/lib/englishExercises.js'
import { generateLoad, suggestPlan, evaluate as evalLoad, emptyPlan, canStack } from '../src/lib/truckLoading.js'
import { generateNegotiation, bestSequence, playSequence, totalCost, scoreNegotiation, initialState, applyLever, LEVERS, MAX_ROUNDS } from '../src/lib/negotiation.js'
import { generateTour, nearestNeighbor, optimalTour, routeLength, crossings, scoreTour, LEVELS } from '../src/lib/tour.js'
import { parseRevisions, cardsOf, hashId, checkNumericAnswer } from '../src/lib/revFormat.js'
import { RV_EXAMPLE, RV_PROMPT } from '../src/lib/revTemplate.js'
import { schedule, pickSession, dueToday, levelOf, INTERVALS, DAILY_LIMIT, NEW_LIMIT } from '../src/lib/revSrs.js'
import { validateBackup, mergeRow, BACKUP_FORMAT } from '../src/lib/revBackup.js'
import { BADGES, BADGE_CATEGORIES, DAILY_GOAL, XP_PER_LEVEL, computeStats, earnedBadges, mergeBadge } from '../src/lib/badgeRules.js'
import { FAV_TYPES, videoFav, articleFav, lessonFav, cardFav, wordFav, atelierFav, clip } from '../src/lib/favoriteItems.js'
import { dayKey } from '../src/lib/dates.js'
import { evaluateFormula, canonicalName } from '../src/lib/excel/evaluate.js'
import { functionsUsed, parseFormula } from '../src/lib/excel/parser.js'
import { unitStyle } from '../src/pages/anglais/unitStyle.js'
import { BI_ALL_LESSONS, PQ_SCENARIOS, DASHBOARDS, INTERVIEW, BI_DAILY_ITEMS, describeBiItem, generateBiExercises, BI_SERIES_SIZE } from '../src/data/atelier/bi/index.js'
import { INTERVIEW_TOPICS } from '../src/data/atelier/bi/interview.js'
import { checkBiNumber } from '../src/data/atelier/bi/helpers.js'
import { makePqGame } from '../src/data/atelier/bi/pqScenarios.js'
import { VISUALS, FAMILIES, series, scoreNeed, needMax, dashboardMax, makeDashboardData } from '../src/data/atelier/bi/dashboards.js'
import * as kpi from '../src/lib/biKpi.js'
import { ERR, isErr, PqError, applyStep, runSteps, parseNumber, stepNames, mCode, describeStep, diffTables, tablesEqual } from '../src/lib/powerQuery.js'

// Modules dont chaque leçon doit avoir une banque d'au moins 8 questions (on l'élargit lot après lot)
const ENFORCE_BANK = new Set(['bases', 'transport', 'stocks', 'entrepot', 'achats', 'prevision', 'production', 'distribution', 'kpi', 'douane', 'outils', 'lean', 'durable', 'risques', 'finance', 'strategie'])
const MIN_BANK = 8
// Calculateurs libres écrits à la main (les autres formules doivent avoir un `calculator` décrit en données)
const HAND_CALCULATORS = new Set(['stock-securite', 'wilson', 'abc', 'rotation', 'otif', 'tco', 'incoterms'])

const errors = []
const warnings = []
const fail = (where, msg) => errors.push(`${where} : ${msg}`)
const warn = (where, msg) => warnings.push(`${where} : ${msg}`)
const BAD_TEXT = /NaN|undefined|\[object|Infinity/

const hasBadText = (value) => BAD_TEXT.test(JSON.stringify(value))

// ---------- Questions de quiz ----------
function checkQuestion(q, where) {
  if (!q || typeof q.q !== 'string' || q.q.trim().length < 8) return fail(where, 'énoncé vide ou trop court')
  if (!Array.isArray(q.choices) || q.choices.length < 3 || q.choices.length > 5) return fail(where, `nombre de choix invalide (${q.choices?.length})`)
  const lower = q.choices.map((c) => String(c).trim().toLowerCase())
  if (lower.some((c) => !c)) fail(where, 'un choix est vide')
  if (new Set(lower).size !== lower.length) fail(where, `choix en double : ${q.choices.join(' | ')}`)
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.choices.length) return fail(where, `index de bonne réponse invalide (${q.answer})`)
  if (typeof q.explain !== 'string' || q.explain.trim().length < 15) fail(where, 'explication absente ou trop courte')
  if (hasBadText(q)) fail(where, `texte suspect (NaN/undefined…) : ${q.q.slice(0, 60)}`)
}

// ---------- Cours ----------
const CARD_TYPES = new Set(['text', 'list', 'formula', 'example', 'key'])
const moduleIds = new Set()
let totalStaticQ = 0
let totalFnQ = 0
let longestIsRight = 0
let staticChecked = 0
const longestByLesson = {}
const longestList = []

for (const m of MODULES) {
  const mw = `Module ${m.id}`
  if (moduleIds.has(m.id)) fail(mw, 'identifiant en double')
  moduleIds.add(m.id)
  if (!m.title || !m.short) fail(mw, 'titre ou nom court manquant')
  if (!MODULE_ICONS[m.icon]) fail(mw, `icône inconnue « ${m.icon} »`)
  if (!MODULE_COLORS[m.color]) fail(mw, `couleur inconnue « ${m.color} »`)
  if (!m.lessons?.length) fail(mw, 'aucune leçon')
  const lessonIds = new Set()

  for (const lesson of m.lessons) {
    const lw = `${m.id}/${lesson.id}`
    if (lessonIds.has(lesson.id)) fail(lw, 'leçon en double')
    lessonIds.add(lesson.id)
    if (!lesson.title || !(lesson.minutes > 0)) fail(lw, 'titre ou durée manquant')
    if (!Array.isArray(lesson.cards) || lesson.cards.length < 4 || lesson.cards.length > 9) fail(lw, `nombre de cartes inhabituel (${lesson.cards?.length})`)
    for (const [i, card] of (lesson.cards ?? []).entries()) {
      const cw = `${lw} carte ${i + 1}`
      if (!CARD_TYPES.has(card.type)) fail(cw, `type inconnu « ${card.type} »`)
      if (card.type === 'text' && (!card.title || !card.body)) fail(cw, 'texte incomplet')
      if (card.type === 'example' && (!card.title || !card.body)) fail(cw, 'exemple incomplet')
      if (card.type === 'list' && (!card.title || !card.items?.length || card.items.some((it) => !Array.isArray(it) || it.length !== 2 || !it[0] || !it[1]))) fail(cw, 'liste mal formée')
      if (card.type === 'formula' && (!card.title || !card.formula || !card.legend?.length)) fail(cw, 'formule incomplète')
      if (card.type === 'key' && (!card.points?.length || card.points.length > 6)) fail(cw, 'encadré « à retenir » invalide')
      if (hasBadText(card)) fail(cw, 'texte suspect (NaN/undefined…)')
    }
    if (lesson.cards?.at(-1)?.type !== 'key') warn(lw, 'la dernière carte n’est pas un « À retenir »')

    const bank = lesson.quiz ?? []
    if (ENFORCE_BANK.has(m.id) && bank.length < MIN_BANK) fail(lw, `banque de ${bank.length} questions (minimum ${MIN_BANK})`)
    if (bank.length < 4) fail(lw, `banque de ${bank.length} questions (minimum 4)`)
    const seenQ = new Set()
    for (const [i, entry] of bank.entries()) {
      const qw = `${lw} question ${i + 1}`
      if (typeof entry === 'function') {
        totalFnQ++
        const stems = new Set()
        for (let k = 0; k < 150; k++) {
          let q
          try {
            q = entry()
          } catch (e) {
            fail(qw, `la fonction plante : ${e.message}`)
            break
          }
          checkQuestion(q, `${qw} (génération ${k})`)
          stems.add(q?.q)
          if (errors.length > 40) break
        }
        if (stems.size < 2) warn(qw, 'les 150 générations donnent le même énoncé (chiffres non variables ?)')
      } else {
        totalStaticQ++
        checkQuestion(entry, qw)
        if (seenQ.has(entry.q)) fail(qw, 'énoncé en double dans la leçon')
        seenQ.add(entry.q)
        const lens = entry.choices?.map((c) => String(c).length) ?? []
        if (lens.length) {
          staticChecked++
          const stat = (longestByLesson[lw] ??= [0, 0])
          stat[1]++
          if (lens[entry.answer] === Math.max(...lens) && lens.filter((l) => l === Math.max(...lens)).length === 1) {
            longestIsRight++
            stat[0]++
            longestList.push(`${lw} q${i + 1}`)
          }
        }
      }
    }
  }
}
const longestPct = staticChecked ? Math.round((longestIsRight / staticChecked) * 100) : 0
console.log(`Quiz : bonne réponse strictement la plus longue dans ${longestPct} % des questions fixes`)
if (longestPct > 25) {
  warn('Quiz', `la bonne réponse est la plus longue dans ${longestPct} % des questions (biais à corriger, objectif ≤ 25 %)`)
  const worst = Object.entries(longestByLesson).filter(([, [n, t]]) => n / t > 0.4).map(([k, [n, t]]) => `${k} (${n}/${t})`)
  if (worst.length) warn('Quiz', `leçons les plus biaisées : ${worst.join(', ')}`)
  if (process.env.SHOW_LONGEST) warn('Quiz', `questions concernées : ${longestList.join(', ')}`)
}

// ---------- Formules ----------
for (const f of FORMULA_LIST) {
  const w = `Formule ${f.id}`
  const c = FORMULAS[f.id]
  if (!c) {
    fail(w, 'cours introuvable')
    continue
  }
  if (!c.purpose || !c.formulas?.length || !c.terms?.length || !c.example?.steps?.length || !c.example?.result) fail(w, 'cours incomplet')
  if (c.terms?.some((t) => !Array.isArray(t) || t.length !== 2)) fail(w, 'termes mal formés')
  if (!c.exercises?.length || c.exercises.length < 3) fail(w, `seulement ${c.exercises?.length} exercices`)
  if (!HAND_CALCULATORS.has(f.id)) {
    if (!c.calculator) fail(w, 'calculateur manquant')
    else {
      const num = Object.fromEntries(c.calculator.inputs.map((i) => [i.key, Number(i.value)]))
      for (const out of c.calculator.outputs) if (!Number.isFinite(out.fn(num))) fail(w, `calculateur : « ${out.label} » n'est pas un nombre avec les valeurs par défaut`)
      const lines = c.calculator.steps?.(num) ?? []
      if (lines.some((l) => typeof l !== 'string' || hasBadText(l))) fail(w, 'calculateur : lignes de calcul suspectes')
    }
  }
  const prompts = new Set()
  for (let i = 0; i < 200; i++) {
    for (const ex of generateExercises(f.id)) {
      prompts.add(ex.statement + JSON.stringify(ex.data))
      const bad =
        !ex.statement || !ex.question || !ex.steps?.length || !ex.conclusion ||
        (ex.kind === 'number' && (!Number.isFinite(ex.answer) || checkNumber(String(ex.answer).replace('.', ','), ex) !== true)) ||
        (ex.kind === 'choice' && (!(ex.answer >= 0 && ex.answer < ex.choices.length) || new Set(ex.choices.map((x) => x.toLowerCase())).size !== ex.choices.length || ex.choices.length < 2)) ||
        hasBadText(ex)
      if (bad) fail(w, `exercice invalide : ${JSON.stringify(ex).slice(0, 160)}`)
      if (errors.length > 40) break
    }
    if (errors.length > 40) break
  }
  if (prompts.size < 12) warn(w, `peu de variété (${prompts.size} exercices différents sur 200 séries)`)
}

// ---------- Défis Excel ----------
const excelIds = new Set()
for (const ch of EXCEL_CHALLENGES) {
  const w = `Excel ${ch.id}`
  if (excelIds.has(ch.id)) fail(w, 'identifiant en double')
  excelIds.add(ch.id)
  if (!ch.title || !ch.fn || !ch.instruction || !ch.context || !ch.explain) fail(w, 'champ texte manquant')
  if (![1, 2, 3].includes(ch.level)) fail(w, `niveau invalide ${ch.level}`)
  if (ch.tier !== undefined && !(ch.tier >= 1 && ch.tier <= 6)) fail(w, `tier invalide ${ch.tier}`)
  if (!/^[A-Z]+\d+$/.test(ch.target ?? '')) fail(w, 'cellule cible invalide')
  if (!ch.hints?.length) fail(w, 'aucun indice')
  if (!ch.mustUse?.length) fail(w, 'mustUse vide')
  let used
  try {
    used = new Set([...functionsUsed(parseFormula(ch.solution))].map(canonicalName))
  } catch (e) {
    fail(w, `solution illisible : ${e.message}`)
    continue
  }
  for (const fn of ch.mustUse ?? []) if (!used.has(fn)) fail(w, `la solution n'utilise pas ${fn}`)
  const runs = ch.generate ? 150 : 1
  const results = new Set()
  for (let k = 0; k < runs; k++) {
    const data = ch.generate ? { ...ch, ...ch.generate() } : ch
    if (!data.rows?.length) {
      fail(w, 'pas de tableau')
      break
    }
    const cells = buildCells(data)
    if (cells[ch.target] !== undefined) {
      fail(w, `la cellule cible ${ch.target} n'est pas vide`)
      break
    }
    const r = evaluateFormula(ch.solution, cells)
    if (r.error) {
      fail(w, `la solution donne ${r.error.code} (${r.error.message}) sur des données générées`)
      break
    }
    if (r.value === null || r.value === '' || (typeof r.value === 'number' && !Number.isFinite(r.value))) {
      fail(w, `résultat vide ou invalide : ${r.value}`)
      break
    }
    results.add(JSON.stringify(r.value))
    if (ch.generate && ch.check && !ch.check(data, r.value)) {
      fail(w, `contrôle propre au défi non respecté (résultat ${r.value})`)
      break
    }
  }
  if (ch.generate && results.size < (ch.minResults ?? 5)) warn(w, `les données aléatoires donnent peu de résultats différents (${results.size} sur 150)`)
  if (ch.generate && results.size === 1) fail(w, 'les données aléatoires donnent toujours le même résultat')
}

// ---------- Études de cas ----------
const caseIds = new Set()
for (const c of CASES) {
  const w = `Cas ${c.id}`
  if (caseIds.has(c.id)) fail(w, 'identifiant en double')
  caseIds.add(c.id)
  if (!c.title || !c.role) fail(w, 'titre ou rôle manquant')
  const [mod, les] = (c.lesson ?? '').split('/')
  if (!findLesson(mod, les)) fail(w, `leçon liée introuvable « ${c.lesson} »`)
  const runs = c.generate ? 100 : 1
  for (let k = 0; k < runs; k++) {
    const study = c.generate ? { ...c, ...c.generate() } : c
    if (!study.intro || !study.debrief) fail(w, 'intro ou bilan manquant')
    if (!study.steps?.length || study.steps.length < 3 || study.steps.length > 5) fail(w, `nombre de décisions inhabituel (${study.steps?.length})`)
    for (const [i, s] of (study.steps ?? []).entries()) {
      const sw = `${w} décision ${i + 1}`
      if (!s.situation || !s.better || s.better.length < 40) fail(sw, 'situation ou explication « pourquoi c’est mieux » manquante')
      if (s.choices?.length !== 3) fail(sw, 'il faut 3 choix')
      const pts = s.choices?.map((x) => x.points) ?? []
      if (Math.max(...pts) !== 3 || pts.filter((p) => p === 3).length !== 1) fail(sw, `il faut exactement un choix à 3 points (${pts})`)
      if (!pts.includes(0)) warn(sw, 'aucun choix à 0 point')
      if (s.choices?.some((x) => !x.text || !x.feedback || x.feedback.length < 25)) fail(sw, 'choix ou explication manquant')
      if (hasBadText(s)) fail(sw, 'texte suspect (NaN/undefined…)')
    }
    if (errors.length > 40) break
  }
}

// ---------- Anglais ----------
const unitIds = new Set()
for (const u of UNITS) {
  const w = `Unité ${u.id}`
  if (unitIds.has(u.id)) fail(w, 'identifiant en double')
  unitIds.add(u.id)
  if (!unitStyle(u).Icon) fail(w, `icône inconnue « ${u.icon} »`)
  if (!unitStyle(u).color) fail(w, `couleur inconnue « ${u.color} »`)
  if (!u.lessons?.length) fail(w, 'aucune leçon')
}
const seenWords = new Map()
const seenPhrases = new Set()
for (const l of ALL_EN_LESSONS) {
  const w = `Anglais ${l.key}`
  if (![1, 2, 3].includes(l.level)) fail(w, `niveau invalide ${l.level}`)
  if (l.items.length < 5 || l.items.length > 8) fail(w, `nombre d'éléments inhabituel (${l.items.length})`)
  for (const it of l.items) {
    if (!it.en || !it.fr) fail(w, `élément incomplet : ${JSON.stringify(it).slice(0, 80)}`)
    if (l.level === 3) {
      if (it.ex) fail(w, `« ${it.en} » : une phrase de niveau 3 n'a pas de champ ex`)
      if (!it.blank || !new RegExp(`\\b${it.blank}\\b`, 'i').test(it.en)) fail(w, `phrase « ${it.en} » : le mot à trou « ${it.blank} » n'y figure pas`)
      if (seenPhrases.has(it.en.toLowerCase())) fail(w, `phrase en double « ${it.en} »`)
      seenPhrases.add(it.en.toLowerCase())
    } else {
      if (!it.def || it.def.length < 20) fail(w, `« ${it.en} » : définition manquante`)
      if (it.def && it.def.length > 190) warn(w, `« ${it.en} » : définition longue (${it.def.length})`)
      if (!it.ex || !it.exFr) fail(w, `« ${it.en} » : exemple manquant`)
      if (it.ex && !it.ex.toLowerCase().includes(it.en.toLowerCase().replace(/^to /, ''))) fail(w, `« ${it.en} » : n'apparaît pas dans son exemple « ${it.ex} »`)
      const key = it.en.toLowerCase()
      if (seenWords.has(key)) fail(w, `mot en double « ${it.en} » (déjà dans ${seenWords.get(key)})`)
      seenWords.set(key, l.key)
    }
    if (hasBadText(it)) fail(w, 'texte suspect')
  }
  for (let i = 0; i < 100; i++) {
    const ex = buildExercises(l)
    if (ex.length < 9) fail(w, `seulement ${ex.length} exercices générés`)
    const keys = new Set()
    for (const e of ex) {
      const k = `${e.type}:${e.prompt}:${e.solution ?? ''}`
      if (e.type !== 'pairs' && keys.has(k)) fail(w, `exercice en double : ${k}`)
      keys.add(k)
      const bad =
        (e.type === 'choice' && (e.answer < 0 || e.choices.length < 2 || new Set(e.choices.map((c) => c.toLowerCase())).size !== e.choices.length)) ||
        (e.type === 'order' && (!checkOrder(e.answer, e.answer) || !e.answer.every((x) => e.tiles.includes(x)))) ||
        (e.type === 'type' && !checkTyped(e.solution, e.answers).ok) ||
        (e.type === 'pairs' && e.pairs.length < 4) ||
        hasBadText(e)
      if (bad) fail(w, `exercice invalide : ${JSON.stringify(e).slice(0, 140)}`)
    }
    if (errors.length > 40) break
  }
}

// ---------- Convention du biais de prévision (cours de l'utilisateur) ----------
// Biais (%) = [ Σ (Prévu − Réalisé) / Σ Prévu ] × 100 ; positif = prévisions trop optimistes.
{
  const files = ['src/data/lots/lot06.js', 'src/data/courses/ajouts/prevision.js', 'src/data/courses/prevision.js']
  const banned = [/Biais\s*=\s*moyenne/i, /moyenne de \(prévu/i, /positif\s*=\s*sur-prévision/i, /biais.{0,40}unités par mois/i]
  for (const file of files) {
    const text = fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8')
    for (const re of banned) if (re.test(text)) fail('Biais', `${file} : formulation de l'ancienne convention (${re})`)
  }
  const biaisExcel = EXCEL_CHALLENGES.find((c) => c.id === 'biais-prevision')
  if (!biaisExcel || !/SOMME\(C2:C7\)\*100/.test(biaisExcel.solution)) fail('Biais', "le défi Excel « biais-prevision » doit diviser par la somme des prévisions et multiplier par 100")
  const sheet = FORMULAS['mape-biais']
  for (let i = 0; i < 200 && sheet; i++) {
    for (const ex of generateExercises('mape-biais')) {
      if (!/Biais \(en %/.test(ex.question ?? '')) continue
      const nums = (ex.data ?? []).map((d) => d[1].match(/réel (\d+) · prévu (\d+)/)).filter(Boolean).map((m) => [Number(m[1]), Number(m[2])])
      const sf = nums.reduce((a, n) => a + n[1], 0)
      const sr = nums.reduce((a, n) => a + n[0], 0)
      const expected = ((sf - sr) / sf) * 100
      if (Math.abs(expected - ex.answer) > 1e-6) fail('Biais', `exercice mape-biais : réponse ${ex.answer} au lieu de ${expected}`)
    }
  }
}

// ---------- Atelier « Plan de chargement » ----------
for (let i = 0; i < 500; i++) {
  const load = generateLoad()
  const w = 'chargement #' + i
  const total = load.pallets.reduce((s, p) => s + p.weight, 0)
  if (total > load.payload) fail(w, 'la charge utile est inférieure au poids total')
  if (load.pallets.length > 16) fail(w, 'plus de palettes que de places')
  const good = evalLoad(load, suggestPlan(load))
  if (good.missing || good.overweight || good.conflicts.length) fail(w, 'le plan suggéré est invalide')
  if (good.score < 90) fail(w, 'le plan suggéré devrait valoir au moins 90 (' + good.score + ')')
  const empty = evalLoad(load, emptyPlan())
  if (empty.score >= good.score) fail(w, 'un camion vide ne doit pas valoir autant que le plan suggéré')
  // un plan à l'envers (client A au fond) doit créer des conflits
  const rev = suggestPlan({ ...load, pallets: load.pallets.map((p) => ({ ...p, client: p.client === 'A' ? 'C' : p.client === 'C' ? 'A' : 'B' })) })
  const revEval = evalLoad(load, rev)
  if (new Set(load.pallets.map((p) => p.client)).size === 3 && revEval.conflicts.length === 0) fail(w, "un plan inversé devrait gêner le déchargement")
  if (!canStack({ fragile: false, weight: 500 }, { weight: 400 }) || canStack({ fragile: true, weight: 500 }, { weight: 400 }) || canStack({ fragile: false, weight: 300 }, { weight: 400 })) fail(w, "règle d'empilage incorrecte")
}

// ---------- Atelier « Négociation » ----------
for (let i = 0; i < 40; i++) {
  const s = generateNegotiation()
  const w = 'négociation #' + i
  if (!(s.floor < s.price) || s.floor <= 0) fail(w, 'prix plancher incohérent')
  const best = bestSequence(s)
  if (best.seq.length > MAX_ROUNDS) fail(w, 'trop de leviers dans le meilleur enchaînement')
  if (scoreNegotiation(s, playSequence(s, best.seq)) !== 100) fail(w, 'le meilleur enchaînement doit valoir 100')
  if (scoreNegotiation(s, initialState(s)) !== 0) fail(w, 'ne rien négocier doit valoir 0')
  for (let k = 0; k < 20; k++) {
    const seq = [...LEVERS.map((l) => l.id)].sort(() => Math.random() - 0.5).slice(0, 1 + Math.floor(Math.random() * MAX_ROUNDS))
    const st = playSequence(s, seq)
    const sc = scoreNegotiation(s, st)
    if (!(sc >= 0 && sc <= 100)) fail(w, 'score hors de 0 à 100')
    if (st.price < s.floor - 1e-9) fail(w, 'le prix passe sous le plancher du fournisseur')
    if (totalCost(s, st).total < best.total - 1e-6) fail(w, 'un enchaînement bat le « meilleur »')
    if (st.log.some((m) => !m.reply || m.reply.length < 15)) fail(w, 'réponse du fournisseur vide')
  }
  // un faux devis concurrent (si aucun n'existe) réduit les concessions suivantes
  if (!s.competitor) {
    const a = playSequence(s, ['remise']).price
    const b = playSequence(s, ['concurrent', 'remise']).price
    if (!(b >= a)) fail(w, "le bluff devrait coûter cher sur la remise suivante")
  }
}

// ---------- Atelier « Tournée de livraison » ----------
for (let i = 0; i < 120; i++) {
  const n = Object.values(LEVELS)[i % 3]
  const w = 'tournée #' + i
  const { points } = generateTour(n)
  if (points.length !== n + 1) fail(w, 'nombre de points incorrect')
  const opt = optimalTour(points)
  const nn = nearestNeighbor(points)
  if (new Set(opt).size !== n || new Set(nn).size !== n) fail(w, 'une tournée ne visite pas chaque client une fois')
  const lo = routeLength(points, opt)
  if (routeLength(points, nn) < lo - 1e-9) fail(w, 'le plus proche voisin bat la tournée « optimale »')
  if (crossings(points, opt) !== 0) fail(w, 'la tournée optimale se croise')
  if (scoreTour(points, opt) !== 100) fail(w, 'la tournée optimale doit valoir 100')
  if (Math.abs(routeLength(points, [...opt].reverse()) - lo) > 1e-9) fail(w, 'le sens de la tournée ne doit pas changer sa longueur')
  if (n === 6) {
    // vérification exacte par toutes les permutations
    let bestLen = Infinity
    const perm = (rest, cur) => {
      if (!rest.length) return void (bestLen = Math.min(bestLen, routeLength(points, cur)))
      rest.forEach((x, k) => perm([...rest.slice(0, k), ...rest.slice(k + 1)], [...cur, x]))
    }
    perm(opt.slice().sort((a, b) => a - b), [])
    if (Math.abs(bestLen - lo) > 1e-9) fail(w, "Held-Karp ne donne pas l'optimum exact")
  }
}

// ---------- Onglet Révisions : format d'import, répétition espacée, sauvegarde ----------
{
  const w = 'Révisions'
  // 1) le modèle donné à Claude est lui-même un fichier valide, avec un exemple de chaque type
  const ex = parseRevisions(RV_EXAMPLE)
  if (!ex.ok) fail(w, 'le modèle RV_EXAMPLE est invalide : ' + ex.errors.map((e) => 'ligne ' + e.line + ' ' + e.message).join(' | '))
  else {
    for (const t of ['fiche', 'flashcard', 'qcm', 'qa', 'exercice']) if (ex.counts[t] !== 1) fail(w, 'le modèle doit contenir exactement 1 ' + t)
    if (ex.warnings.length) fail(w, "le modèle ne doit pas produire d'avertissement : " + ex.warnings.map((x) => x.message).join(' | '))
    const exo = ex.lot.items.find((i) => i.type === 'exercice')
    if (!exo.enonce.includes('| Semaine | Ventes |') || exo.questions.length !== 3 || !exo.questions[0].numeric || exo.questions[2].numeric) fail(w, "l'exercice du modèle est mal lu (tableau, questions, types de réponses)")
    if (cardsOf(ex.lot).length !== 4) fail(w, 'flashcard (2 sens) + QCM + Q/R doivent donner 4 cartes')
    if (parseRevisions(RV_EXAMPLE).lot.items.map((i) => i.id).join() !== ex.lot.items.map((i) => i.id).join()) fail(w, 'les identifiants de contenus doivent être stables')
  }
  const fence = '`'.repeat(3)
  const start = RV_PROMPT.indexOf(fence + '\n')
  const end = RV_PROMPT.indexOf(fence, start + 4)
  if (start < 0 || end < 0 || !parseRevisions(RV_PROMPT.slice(start + 4, end)).ok) fail(w, 'le bloc exemple du texte à donner à Claude doit être valide')
  // 2) erreurs : chaque cas doit être signalé à la bonne ligne
  const cases = [
    ['@matiere X\n@fiche A\ntexte', 1, 'lot'],
    ['@lot L\n@fiche A\ntexte', 1, 'matiere'],
    ['@lot L\n@matiere M\n@qcm\nquestion: Q\na) un\nc) trois\nreponse: a\nexplication: e', 6, 'choix'],
    ['@lot L\n@matiere M\n@qcm\nquestion: Q\na) un\nb) deux\nreponse: z\nexplication: e', 7, 'lettre'],
    ['@lot L\n@matiere M\n@flashcard\nrecto: seulement', 3, 'verso'],
    ['@lot L\n@matiere M\n@truc\nx', 3, 'inconnue'],
    ['@lot L\n@matiere M\n@fiche T\ntexte\n| a | b |\n| --- |\n| 1 | 2 |', 6, 'colonne'],
    ['@lot L\n@matiere M\n@exercice E\nenonce: x\nreponse: 3', 5, 'apres une'],
    ['@lot L\n@matiere M\n@qa\nquestion: Q\nreponse: R\nreponse: R2', 6, 'deux fois'],
    ['@lot L\n@matiere M\n@flashcard\nrecto: a\nverso: b\nnote: n\ntolerance: 2', 7, "n'existe pas"],
    ['', 1, 'vide'],
  ]
  for (const [text, line, hint] of cases) {
    const r = parseRevisions(text)
    if (r.ok) fail(w, "une erreur attendue n'est pas détectée (" + hint + ') dans : ' + JSON.stringify(text.slice(0, 40)))
    else if (!r.errors.some((e) => e.line === line)) fail(w, 'erreur ' + hint + ' attendue ligne ' + line + ', obtenu : ' + r.errors.map((e) => e.line + ':' + e.message.slice(0, 30)).join(' | '))
  }
  // un fichier avec retours Windows, BOM et commentaires est accepté
  const win = parseRevisions('﻿// c\r\n@lot L\r\n@matiere M\r\n@flashcard\r\nrecto: a\r\nverso: b\r\n')
  if (!win.ok || win.counts.flashcard !== 1) fail(w, 'les fichiers Windows (retours \\r\\n, BOM) doivent être acceptés')
  const acc = parseRevisions('@lot L\n@matiere M\n@qa\nQuestion: Q ?\nRéponse: R')
  if (!acc.ok) fail(w, 'les clés avec accents/majuscules (Réponse:) doivent être acceptées')
  // réponses numériques
  const q = { value: 280, tolerance: 0.5 }
  if (checkNumericAnswer(q, '280') !== true || checkNumericAnswer(q, '280,4') !== true || checkNumericAnswer(q, '283') !== false || checkNumericAnswer(q, 'abc') !== null) fail(w, 'la vérification des réponses numériques est incorrecte')
  if (hashId('a') === hashId('b')) fail(w, 'hashId')

  // 3) répétition espacée
  const d0 = new Date(2026, 0, 10)
  let card = schedule(null, true, d0)
  if (card.box !== 0 || card.due !== '2026-01-11') fail(w, 'première réussite : boîte 0, retour dans 1 jour')
  for (let i = 1; i < 10; i++) card = schedule(card, true, d0)
  if (card.box !== INTERVALS.length - 1) fail(w, 'la boîte doit plafonner à ' + (INTERVALS.length - 1))
  const miss = schedule({ ...card, lapses: 0 }, false, d0)
  if (miss.box !== 0 || miss.due !== '2026-01-11' || miss.lapses !== 1) fail(w, 'une carte à revoir retombe en boîte 0, retour demain')
  if (levelOf(null) !== 'nouvelle' || levelOf({ box: 5, lapses: 0 }) !== 'maîtrisée' || levelOf({ box: 0, lapses: 2 }) !== 'à revoir') fail(w, 'niveaux de cartes')
  if (!(INTERVALS[0] < INTERVALS[3])) fail(w, 'les intervalles doivent croître')
  const many = Array.from({ length: 80 }, (_, i) => ({ key: 'k' + i, progress: i < 30 ? { due: '2026-01-01', lapses: i % 3 } : i < 60 ? { due: '2099-01-01', lapses: 0 } : null }))
  const sess = pickSession(many, '2026-01-10')
  if (sess.length > DAILY_LIMIT) fail(w, 'séance trop longue')
  if (sess.filter((k) => Number(k.slice(1)) >= 60).length > NEW_LIMIT) fail(w, 'trop de cartes nouvelles dans la séance')
  if (sess.some((k) => Number(k.slice(1)) >= 30 && Number(k.slice(1)) < 60)) fail(w, 'une carte pas encore due est dans la séance')
  if (dueToday(many, '2026-01-10') !== Math.min(DAILY_LIMIT, 30 + NEW_LIMIT)) fail(w, 'décompte des cartes du jour')

  // 4) sauvegarde
  const schema = { rvLots: 'id', rvProgress: 'id', activity: 'date' }
  const good = JSON.stringify({ format: BACKUP_FORMAT, version: 1, exportedAt: new Date().toISOString(), tables: { rvLots: [{ id: 'l1', title: 'T', matiere: 'M', cours: 'C', items: [{ id: 'a', type: 'fiche' }] }], rvProgress: [], activity: [{ date: '2026-01-01', xp: 10 }] } }, null, 1)
  if (!validateBackup(good, schema).ok) fail(w, 'une sauvegarde valide est refusée')
  const badJson = validateBackup(good.slice(0, 120), schema)
  if (badJson.ok || !badJson.errors[0].message.includes('JSON')) fail(w, 'une sauvegarde coupée doit être refusée avec un message clair')
  if (validateBackup('{"format":"autre","tables":{}}', schema).ok) fail(w, 'un mauvais format doit être refusé')
  if (validateBackup(good.replace('rvProgress', 'inconnue'), schema).ok) fail(w, 'une table inconnue doit être refusée')
  if (validateBackup(good.replace('"id": "l1"', '"x": "l1"'), schema).ok) fail(w, 'une ligne sans clé doit être refusée')
  if (mergeRow('activity', { date: 'd', xp: 30 }, { date: 'd', xp: 50 }).xp !== 50 || mergeRow('activity', { date: 'd', xp: 60 }, { date: 'd', xp: 50 }).xp !== 60) fail(w, 'fusion des XP : on garde le plus haut')
  if (mergeRow('rvProgress', { last: '2026-01-02' }, { last: '2026-01-05' }).last !== '2026-01-05') fail(w, 'fusion de la progression : le plus récent gagne')
  if (mergeRow('lessons', { id: 'a', v: 1 }, { id: 'a', v: 2 }).v !== 1) fail(w, 'fusion : ce qui existe déjà est conservé pour les autres tables')
}

// ---------- Power Query et Power BI (Atelier) ----------
{
  const w = 'Power Query / Power BI'
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b)

  // 1) Indicateurs : valeurs refaites à la main
  const liv = [
    { qteCom: 100, qteLiv: 100, retard: 0, cout: 50 },
    { qteCom: 100, qteLiv: 80, retard: 0, cout: 30 },
    { qteCom: 50, qteLiv: 50, retard: 2, cout: 20 },
    { qteCom: 50, qteLiv: 50, retard: 0, cout: 10 },
  ]
  const near = (a, b) => Math.abs(a - b) < 1e-9
  if (!near(kpi.otif(liv), 0.5)) fail(w, 'OTIF : attendu 0,5, obtenu ' + kpi.otif(liv))
  if (!near(kpi.tauxService(liv), 280 / 300)) fail(w, 'taux de service')
  if (!near(kpi.retardMoyen(liv), 0.5)) fail(w, 'retard moyen')
  if (kpi.coutTransport(liv) !== 110 || !near(kpi.coutParUnite(liv), 110 / 280)) fail(w, 'coûts de transport')
  if (kpi.divide(1, 0) !== null || kpi.divide(1, 0, 0) !== 0 || kpi.otif([]) !== null) fail(w, 'DIVIDE : division par zéro')
  const stk = [{ mois: 'Janv', coutVentes: 30000, stock: 60000 }, { mois: 'Janv', coutVentes: 10000, stock: 20000 }, { mois: 'Févr', coutVentes: 20000, stock: 40000 }]
  if (!near(kpi.rotation(stk), 0.5) || !near(kpi.couverture(stk), 60) || !near(kpi.stockMoyen(stk), 60000)) fail(w, 'rotation, couverture ou stock moyen')

  // 1 bis) Vérification des réponses saisies (virgule, point, %, espaces) : exacte à la décimale demandée
  const exNum = { answer: 83.3, tolerance: 0.05 }
  if (checkBiNumber('83,3', exNum) !== true || checkBiNumber('83.33', exNum) !== true || checkBiNumber('83,3 %', exNum) !== true || checkBiNumber('84', exNum) !== false || checkBiNumber('abc', exNum) !== null) fail(w, 'checkBiNumber')
  if (checkBiNumber('402', { answer: 400, tolerance: 0 }) !== false || checkBiNumber('400', { answer: 400, tolerance: 0 }) !== true) fail(w, 'checkBiNumber : une réponse entière doit être exacte (pas de marge relative)')

  // 2) Moteur Power Query : chaque transformation testée sur une petite table
  const T = (names, rows) => ({ cols: names.map((name) => ({ name, type: 'any' })), rows })
  const t0 = T(['A', 'B'], [['x', '1 250,5'], [' y ', 'N/A']])
  if (parseNumber('1 250,50') !== 1250.5 || !isErr(parseNumber('N/A')) || !isErr(parseNumber(''))) fail(w, 'parseNumber')
  const typed = applyStep(t0, { op: 'changeType', col: 'B', type: 'dec' })
  if (typed.rows[0][1] !== 1250.5 || typed.rows[1][1] !== ERR || typed.cols[1].type !== 'dec') fail(w, 'changeType : conversion ou erreur')
  if (!eq(applyStep(t0, { op: 'trim', col: 'A' }).rows.map((r) => r[0]), ['x', 'y'])) fail(w, 'trim')
  const rep = applyStep(t0, { op: 'replace', col: 'B', from: 'N/A', to: '0' })
  if (rep.rows[1][1] !== '0') fail(w, 'replace')
  try {
    applyStep(t0, { op: 'filter', col: 'B', cmp: 'gt', value: 3 })
    fail(w, 'filtrer un texte avec « > » doit produire une erreur')
  } catch (e) {
    if (!(e instanceof PqError)) fail(w, 'filter : mauvaise erreur')
  }
  try {
    applyStep(t0, { op: 'removeCols', cols: ['Z'] })
    fail(w, 'supprimer une colonne inconnue doit produire une erreur')
  } catch (e) {
    if (!(e instanceof PqError)) fail(w, 'removeCols : mauvaise erreur')
  }
  const fl = applyStep(T(['K', 'V'], [['a', 1], [null, 2], ['', 3], ['b', 4]]), { op: 'fillDown', col: 'K' })
  if (!eq(fl.rows.map((r) => r[0]), ['a', 'a', 'a', 'b'])) fail(w, 'fillDown')
  if (applyStep(T(['A', 'B'], [['a', null], [null, null], ['', '']]), { op: 'removeBlankRows' }).rows.length !== 1) fail(w, 'removeBlankRows')
  if (applyStep(T(['A', 'B'], [['a', 1], ['a', 1], ['a', 2]]), { op: 'removeDuplicates' }).rows.length !== 2) fail(w, 'removeDuplicates (toutes colonnes)')
  if (applyStep(T(['A', 'B'], [['a', 1], ['a', 2]]), { op: 'removeDuplicates', cols: ['A'] }).rows.length !== 1) fail(w, 'removeDuplicates (une colonne)')
  const sp = applyStep(T(['R', 'Q'], [['PAL-LYO', '5'], ['CAR', '6']]), { op: 'split', col: 'R', sep: '-', names: ['Art', 'Site'] })
  if (!eq(sp.cols.map((c) => c.name), ['Art', 'Site', 'Q']) || !eq(sp.rows[0], ['PAL', 'LYO', '5']) || !eq(sp.rows[1], ['CAR', null, '6'])) fail(w, 'split')
  const up = applyStep(T(['P', 'J', 'F'], [['a', '1', null], ['b', '2', '3']]), { op: 'unpivot', keep: ['P'], attr: 'M', value: 'V' })
  if (!eq(up.rows, [['a', 'J', '1'], ['b', 'J', '2'], ['b', 'F', '3']])) fail(w, 'unpivot (les cellules vides ne donnent pas de ligne) : ' + JSON.stringify(up.rows))
  const pvSrc = { cols: [{ name: 'P', type: 'any' }, { name: 'M', type: 'any' }, { name: 'V', type: 'int' }], rows: [['a', 'J', 1], ['a', 'F', 2], ['b', 'J', 3], ['a', 'J', 4]] }
  const pv = applyStep(pvSrc, { op: 'pivot', attr: 'M', value: 'V' })
  if (!eq(pv.cols.map((c) => c.name), ['P', 'J', 'F']) || !eq(pv.rows, [['a', 5, 2], ['b', 3, null]])) fail(w, 'pivot : ' + JSON.stringify(pv.rows))
  const calc = applyStep({ cols: [{ name: 'Q', type: 'int' }, { name: 'P', type: 'dec' }], rows: [[3, 2.5]] }, { op: 'addCalc', name: 'T', a: 'Q', b: 'P', sym: '*' })
  if (calc.rows[0][2] !== 7.5) fail(w, 'addCalc')
  const left = T(['id', 'code'], [['1', 'F1'], ['2', 'F2'], ['3', 'F9']])
  const right = T(['code', 'nom'], [['F1', 'A'], ['F2', 'B'], ['F2', 'B2']])
  const mgL = applyStep(left, { op: 'merge', right: 'R', leftKey: 'code', rightKey: 'code', join: 'leftouter', take: ['nom'] }, { R: right })
  const mgI = applyStep(left, { op: 'merge', right: 'R', leftKey: 'code', rightKey: 'code', join: 'inner', take: ['nom'] }, { R: right })
  if (mgL.rows.length !== 4 || mgI.rows.length !== 3 || mgL.rows.at(-1)[2] !== null) fail(w, 'merge : externe gauche = 4 lignes (clé en double + code inconnu), interne = 3')
  const ap = applyStep(T(['A', 'B'], [[1, 2]]), { op: 'append', with: 'O' }, { O: T(['B', 'C'], [[3, 4]]) })
  if (!eq(ap.cols.map((c) => c.name), ['A', 'B', 'C']) || !eq(ap.rows, [[1, 2, null], [null, 3, 4]])) fail(w, 'append (colonnes par nom)')
  const bad = runSteps(t0, [{ op: 'removeCols', cols: ['Z'] }, { op: 'trim', col: 'A' }])
  if (bad.final !== null || bad.results[0].ok || bad.results[1].ok || !bad.results[1].skipped) fail(w, 'runSteps : une étape en erreur doit bloquer les suivantes')
  const nm = stepNames([{ op: 'changeType', col: 'A', type: 'int' }, { op: 'changeType', col: 'B', type: 'int' }])
  if (nm[0] !== 'Type modifié' || nm[1] !== 'Type modifié1') fail(w, 'noms d’étapes uniques')
  const code = mCode([{ op: 'promoteHeaders' }, { op: 'filter', col: 'S', cmp: 'eq', value: 'Livré' }])
  if (!code.includes('Table.PromoteHeaders(Source') || !code.includes('Table.SelectRows(#"En-têtes promus", each [S] = "Livré")') || !code.trim().endsWith('#"Lignes filtrées"')) fail(w, 'mCode : ' + code)
  if (tablesEqual(t0, t0) !== true || tablesEqual(t0, typed) !== false || diffTables(t0, T(['A'], [])).length < 2) fail(w, 'comparaison de tables')

  // 3) Scénarios du simulateur : 150 parties chacun
  const ids = new Set()
  for (const s of PQ_SCENARIOS) {
    const sw = `Simulateur « ${s.id} »`
    if (ids.has(s.id)) fail(sw, 'identifiant en double')
    ids.add(s.id)
    if (!s.title || !s.intro || !s.recall?.length) fail(sw, 'titre, histoire ou rappel manquant')
    let orderSensitive = 0
    for (let n = 0; n < 150; n++) {
      let g
      try {
        g = makePqGame(s)
      } catch (e) {
        fail(sw, 'génération impossible : ' + e.message)
        break
      }
      if (!g.target) { fail(sw, 'les étapes idéales échouent'); break }
      if (g.target.rows.length !== g.expectedRows) { fail(sw, `lignes attendues ${g.expectedRows}, objectif ${g.target.rows.length}`); break }
      if (g.target.rows.some((r) => r.some(isErr)) || hasBadText(g.target)) { fail(sw, 'cellule en erreur ou texte suspect dans l’objectif'); break }
      if (new Set(g.candidates.map((c) => c.id)).size !== g.candidates.length) { fail(sw, 'identifiants de transformations en double'); break }
      const texts = g.candidates.map((c) => describeStep(c.step))
      if (new Set(texts).size !== texts.length || texts.some((t) => !t || hasBadText(t))) { fail(sw, 'libellés de transformations en double ou vides'); break }
      const idealSteps = g.ideal.map((c) => c.step)
      // chaque étape idéale est nécessaire
      for (let k = 0; k < idealSteps.length; k++) {
        const r = runSteps(g.source, idealSteps.filter((_, i) => i !== k), g.tables)
        if (r.final && tablesEqual(r.final, g.target)) { fail(sw, `l’étape « ${describeStep(idealSteps[k])} » est inutile (le résultat est le même sans elle)`); n = 150; break }
      }
      // chaque piège casse le résultat au moins à un endroit (début ou fin) : il ne peut pas être utilisé « gratuitement »
      for (const t of g.traps) {
        const harmless = [[t.step, ...idealSteps], [...idealSteps, t.step]].map((seq) => {
          const r = runSteps(g.source, seq, g.tables)
          return Boolean(r.final) && tablesEqual(r.final, g.target)
        })
        if (harmless.every(Boolean)) { fail(sw, `le piège « ${describeStep(t.step)} » est inoffensif (il ne change jamais le résultat)`); n = 150; break }
      }
      // l'ordre compte : au moins un des autres ordres possibles des étapes idéales casse le résultat
      if (n === 0) {
        const perms = (arr) => (arr.length <= 1 ? [arr] : arr.flatMap((x, i) => perms([...arr.slice(0, i), ...arr.slice(i + 1)]).map((p) => [x, ...p])))
        for (const p of perms(idealSteps)) {
          const r = runSteps(g.source, p, g.tables)
          if (!r.final || !tablesEqual(r.final, g.target)) orderSensitive++
        }
        if (orderSensitive === 0) warn(sw, 'tous les ordres des étapes donnent le même résultat (l’ordre n’est pas testé)')
      }
    }
  }

  // 4) Leçons : cours complets, exercices aléatoires sans erreur
  const lessonIds = new Set()
  let exTotal = 0
  let numTotal = 0
  for (const l of BI_ALL_LESSONS) {
    const lw = `Leçon BI « ${l.id} »`
    if (lessonIds.has(l.id)) fail(lw, 'identifiant en double')
    lessonIds.add(l.id)
    if (!l.title || !l.short || (l.track !== 'pq' && l.track !== 'bi')) fail(lw, 'titre, résumé ou parcours manquant')
    const c = l.course
    if (!c?.purpose || !c.sections?.length || !c.recall?.length) fail(lw, 'cours incomplet (objectif, sections, rappel)')
    if (c.sections.some((s) => !s.title || !s.text)) fail(lw, 'section sans titre ou texte')
    if (hasBadText(c)) fail(lw, 'texte suspect dans le cours')
    if (l.exercises.length < BI_SERIES_SIZE + 1) fail(lw, `banque trop petite (${l.exercises.length} générateurs, il en faut au moins ${BI_SERIES_SIZE + 1})`)
    l.exercises.forEach((make, gi) => {
      const ew = `${lw} exercice ${gi + 1}`
      let longest = 0
      let tested = 0
      for (let n = 0; n < 200; n++) {
        let ex
        try {
          ex = make()
        } catch (e) {
          fail(ew, 'génération impossible : ' + e.message)
          return
        }
        tested++
        exTotal++
        if (!ex.statement?.trim() || !ex.question?.trim()) return fail(ew, 'énoncé ou question vide')
        if (!Array.isArray(ex.steps) || ex.steps.length < 1 || new Set(ex.steps).size !== ex.steps.length) return fail(ew, 'correction vide ou avec deux lignes identiques : ' + JSON.stringify(ex.steps).slice(0, 80))
        if (!ex.conclusion?.trim()) return fail(ew, 'conclusion absente')
        if (hasBadText(ex)) return fail(ew, 'texte suspect (NaN/undefined…) : ' + ex.question.slice(0, 60))
        for (const t of ex.tables) {
          if (!t.cols?.length || !t.rows?.length || t.rows.some((r) => r.length !== t.cols.length)) return fail(ew, 'tableau mal formé')
        }
        if (ex.kind === 'choice') {
          const lower = ex.choices.map((x) => String(x).trim().toLowerCase())
          if (ex.choices.length < 3 || ex.choices.length > 5 || new Set(lower).size !== lower.length || lower.some((x) => !x)) return fail(ew, 'choix invalides ou en double : ' + ex.choices.join(' | '))
          if (!Number.isInteger(ex.answer) || ex.answer < 0 || ex.answer >= ex.choices.length) return fail(ew, 'index de bonne réponse invalide')
          if (ex.choices.every((x, i) => i === ex.answer || x.length < ex.choices[ex.answer].length)) longest++
        } else if (ex.kind === 'number') {
          numTotal++
          if (!Number.isFinite(ex.answer) || ex.answer < 0 || !ex.unit && ex.unit !== '' || !Number.isFinite(ex.tolerance)) return fail(ew, 'réponse numérique invalide : ' + ex.answer)
          if (!Number.isInteger(ex.digits)) return fail(ew, 'décimales invalides')
        } else return fail(ew, 'type d’exercice inconnu : ' + ex.kind)
      }
      if (tested && longest / tested > 0.9) warn(ew, `la bonne réponse est la plus longue dans ${Math.round((longest / tested) * 100)} % des tirages`)
    })
    const series4 = generateBiExercises(l.id)
    if (series4.length !== BI_SERIES_SIZE) fail(lw, 'taille de série incorrecte')
  }

  // 5) Tableaux de bord : attentes valides, scores, aperçus calculables
  const visualIds = new Set(VISUALS.map((v) => v.id))
  const dashIds = new Set()
  for (const d of DASHBOARDS) {
    const dw = `Tableau de bord « ${d.id} »`
    if (dashIds.has(d.id)) fail(dw, 'identifiant en double')
    dashIds.add(d.id)
    const fam = FAMILIES[d.family]
    if (!fam) { fail(dw, 'famille inconnue'); continue }
    if (!d.title || !d.context || d.needs.length < 3) fail(dw, 'titre, contexte ou besoins manquants')
    for (const need of d.needs) {
      const nw = `${dw} besoin ${need.id}`
      if (!visualIds.has(need.visual) || need.ok.some((v) => !visualIds.has(v))) fail(nw, 'visuel inconnu')
      if (need.measure && !fam.measures.some((m) => m.id === need.measure)) fail(nw, 'mesure inconnue : ' + need.measure)
      if (need.dim && !fam.dims.some((x) => x.id === need.dim)) fail(nw, 'axe inconnu : ' + need.dim)
      if (need.visual === 'slicer' && need.measure) fail(nw, 'un segment n’a pas de mesure')
      if (need.visual !== 'slicer' && !need.measure) fail(nw, 'une mesure est attendue')
      if (need.visual === 'card' && need.dim) fail(nw, 'une carte n’a pas d’axe')
      if (!need.ask || !need.why) fail(nw, 'énoncé ou explication manquant')
      const perfect = scoreNeed(need, { visual: need.visual, measure: need.measure, dim: need.dim })
      if (perfect.total !== needMax(need)) fail(nw, `score parfait ${perfect.total} ≠ maximum ${needMax(need)}`)
      const worst = scoreNeed(need, { visual: need.visual === 'card' ? 'line' : 'card', measure: need.measure === 'nb' ? 'otif' : 'nb', dim: need.dim ? null : 'mois' })
      if (worst.total >= needMax(need)) fail(nw, 'une réponse fausse ne doit pas avoir le maximum')
    }
    if (dashboardMax(d) < 6) fail(dw, 'maximum de points suspect')
    for (let n = 0; n < 100; n++) {
      const rows = makeDashboardData(d)
      if (!rows.length) { fail(dw, 'aucune donnée générée'); break }
      let broken = false
      for (const m of fam.measures) {
        for (const dim of [null, ...fam.dims.map((x) => x.id)]) {
          const s = series(rows, d.family, m.id, dim)
          if (!s.length || s.some((p) => !Number.isFinite(p.value))) { fail(dw, `mesure « ${m.id} » par « ${dim} » non calculable`); broken = true; break }
        }
        if (broken) break
      }
      if (broken) break
    }
  }
  for (const f of Object.values(FAMILIES)) for (const m of f.measures) if (!m.dax || !m.note || !m.label) fail(w, `mesure « ${m.id} » sans DAX ou libellé`)

  // 6) Questions d'entretien
  const qids = new Set()
  for (const q of INTERVIEW) {
    const qw = `Question « ${q.id} »`
    if (qids.has(q.id)) fail(qw, 'identifiant en double')
    qids.add(q.id)
    if (!INTERVIEW_TOPICS.includes(q.topic)) fail(qw, 'thème inconnu : ' + q.topic)
    if (!q.question?.trim().endsWith('?') && !q.question?.trim().endsWith('.')) fail(qw, 'question mal terminée')
    if ((q.pitch?.length ?? 0) < 60 || q.pitch.length > 420) fail(qw, `réponse orale de ${q.pitch?.length} caractères (60 à 420 attendus)`)
    if ((q.detail?.length ?? 0) < 150) fail(qw, 'réponse détaillée trop courte')
    if (!Array.isArray(q.points) || q.points.length < 3) fail(qw, 'au moins 3 idées à citer')
    if (hasBadText(q)) fail(qw, 'texte suspect')
  }
  for (const t of INTERVIEW_TOPICS) if (!INTERVIEW.some((q) => q.topic === t)) fail(w, `aucune question pour le thème « ${t} »`)

  // 7) Défi du jour
  const dailyIds = new Set(BI_DAILY_ITEMS.map((i) => i.id))
  if (dailyIds.size !== BI_DAILY_ITEMS.length) fail(w, 'identifiants en double dans le défi du jour')
  for (const i of BI_DAILY_ITEMS) {
    const d = describeBiItem(i.id)
    if (!d.title || !d.label || !d.to.startsWith('/atelier/bi/')) fail(w, `défi du jour « ${i.id} » mal décrit`)
  }
  console.log(`Power Query / Power BI : ${BI_ALL_LESSONS.length} leçons (${exTotal} exercices générés, dont ${numTotal} numériques), ${PQ_SCENARIOS.length} scénarios de simulateur (150 parties chacun), ${DASHBOARDS.length} tableaux de bord, ${INTERVIEW.length} questions d’entretien`)
}

// ---------- Badges et favoris ----------
{
  const w = 'Badges et favoris'
  const NOW = new Date(2026, 10, 20, 15).getTime()
  const day = (n) => dayKey(new Date(2026, 9, 1 + n)) // n-ième jour à partir du 1er octobre 2026
  const earned = (data) => earnedBadges(computeStats(data, MODULES, NOW))
  const ids = (data) => new Set(earned(data).map((b) => b.id))

  // 1) Liste : identifiants uniques, catégories et icônes connues, conditions rédigées
  const bid = new Set(BADGES.map((b) => b.id))
  if (bid.size !== BADGES.length) fail(w, 'identifiants de badges en double')
  if (BADGES.length < 28 || BADGES.length > 40) fail(w, `nombre de badges inattendu : ${BADGES.length}`)
  const cats = new Set(BADGE_CATEGORIES.map((c) => c.id))
  const styleSrc = fs.readFileSync(new URL('../src/pages/badges/badgeStyle.jsx', import.meta.url), 'utf8')
  const iconBlock = styleSrc.slice(styleSrc.indexOf('const ICONS'), styleSrc.indexOf('}', styleSrc.indexOf('const ICONS')))
  for (const b of BADGES) {
    if (!cats.has(b.cat)) fail(w, `badge ${b.id} : catégorie inconnue « ${b.cat} »`)
    if (!new RegExp(`\\b${b.icon}:`).test(iconBlock)) fail(w, `badge ${b.id} : icône « ${b.icon} » absente de badgeStyle.jsx`)
    if (!b.title || !b.cond || !(b.target > 0)) fail(w, `badge ${b.id} : titre, condition ou objectif manquant`)
  }
  for (const c of BADGE_CATEGORIES) if (!BADGES.some((b) => b.cat === c.id)) fail(w, `catégorie sans badge : ${c.id}`)
  // constantes identiques à celles de progress.js
  const progressSrc = fs.readFileSync(new URL('../src/lib/progress.js', import.meta.url), 'utf8')
  if (Number(/DAILY_GOAL = (\d+)/.exec(progressSrc)?.[1]) !== DAILY_GOAL || Number(/XP_PER_LEVEL = (\d+)/.exec(progressSrc)?.[1]) !== XP_PER_LEVEL) fail(w, 'DAILY_GOAL / XP_PER_LEVEL de badgeRules.js différents de progress.js')
  const dbSrc = fs.readFileSync(new URL('../src/db.js', import.meta.url), 'utf8')
  if (!/badges: 'id'/.test(dbSrc) || !/favorites: 'id, type'/.test(dbSrc)) fail(w, 'tables badges / favorites absentes de db.js')

  // 2) Rien de gagné sans données
  if (earned({}).length) fail(w, 'des badges sont gagnés sans aucune donnée')

  // 3) Séries : 3 jours d'affilée = serie-3 ; un trou casse la série ; 49 XP ne comptent pas
  const act = (days, xp = 60) => days.map((n) => ({ date: day(n), xp }))
  let s = ids({ activity: act([0, 1, 2]) })
  if (!s.has('serie-3') || s.has('serie-7') || !s.has('objectif-1')) fail(w, 'série de 3 jours mal détectée')
  if (ids({ activity: act([0, 1, 3, 4]) }).has('serie-3')) fail(w, 'un jour manquant doit casser la série')
  if (ids({ activity: act([0, 1, 2], 49) }).has('serie-3')) fail(w, '49 XP ne doivent pas valider un jour de série')
  const e3 = earned({ activity: act([0, 1, 2]) }).find((b) => b.id === 'serie-3')
  if (e3.at !== new Date(`${day(2)}T12:00:00`).getTime()) fail(w, 'la date du badge de série doit être celle du 3e jour')
  if (!ids({ activity: act(Array.from({ length: 30 }, (_, i) => i)) }).has('serie-30')) fail(w, 'série de 30 jours non détectée')

  // 4) XP et niveaux : seuils exacts (niveau n = (n − 1) × 100 XP)
  const xpData = (total) => ({ activity: [{ date: day(0), xp: total }] })
  if (ids(xpData(99)).has('xp-100') || !ids(xpData(100)).has('xp-100')) fail(w, 'seuil de 100 XP')
  if (ids(xpData(399)).has('niveau-5') || !ids(xpData(400)).has('niveau-5')) fail(w, 'niveau 5 = 400 XP')
  if (ids(xpData(999)).has('xp-1000') || !ids(xpData(1000)).has('xp-1000')) fail(w, 'seuil de 1 000 XP')
  if (!ids(xpData(1900)).has('niveau-20') || ids(xpData(1899)).has('niveau-20')) fail(w, 'niveau 20 = 1 900 XP')

  // 5) Cours : une leçon, 10 leçons, un module entier
  const lessonRows = (mods) => mods.flatMap((m) => m.lessons.map((l) => ({ id: `${m.id}/${l.id}`, completedAt: NOW - 1000 })))
  if (!ids({ lessons: [{ id: 'x/y', completedAt: 5 }] }).has('cours-1')) fail(w, 'première leçon')
  const m0 = MODULES[0]
  const partial = lessonRows([m0]).slice(0, m0.lessons.length - 1)
  if (ids({ lessons: partial }).has('module-1')) fail(w, 'un module incomplet ne doit pas donner le badge')
  if (!ids({ lessons: lessonRows([m0]) }).has('module-1')) fail(w, 'module terminé non détecté')
  if (ids({ lessons: lessonRows(MODULES.slice(0, 4)) }).has('module-5') || !ids({ lessons: lessonRows(MODULES.slice(0, 5)) }).has('module-5')) fail(w, 'cinq modules')

  // 6) Jeu de données complet : tous les badges doivent pouvoir être gagnés, avec une date plausible
  const flash = Array.from({ length: 12 }, (_, i) => ({ id: `f${i}`, type: 'flashcard' }))
  const qa = Array.from({ length: 40 }, (_, i) => ({ id: `q${i}`, type: 'qa' }))
  const lot = { id: 'L1', createdAt: NOW - 5000, items: [...flash, ...qa] }
  const rvProgress = [
    ...flash.flatMap((it) => ['f', 'r'].map((dir) => ({ id: `L1|${it.id}|${dir}`, lotId: 'L1', itemId: it.id, dir, reps: 1, last: day(3) }))),
    ...qa.map((it) => ({ id: `L1|${it.id}|f`, lotId: 'L1', itemId: it.id, dir: 'f', reps: 2, last: day(4) })),
    { id: 'L1|ex|x:1', lotId: 'L1', itemId: 'x:ex:1', dir: 'x', reps: 3, last: day(5) }, // les exercices ne comptent pas comme cartes
  ]
  const full = {
    activity: Array.from({ length: 31 }, (_, i) => ({ date: day(i), xp: 200, daily: true })),
    lessons: lessonRows(MODULES),
    english: [
      ...Array.from({ length: 10 }, (_, i) => ({ id: `lesson/u/${i}`, completedAt: NOW - 2000 })),
      ...Array.from({ length: 20 }, (_, i) => ({ id: `word/w${i}`, status: 'known', updatedAt: NOW - 3000 })),
    ],
    rvLots: [lot],
    rvProgress,
    workshop: [
      { id: 'excel/a', completedAt: NOW - 100 }, { id: 'calc/a', solved: 2, attempts: 3 }, { id: 'cas/a', completedAt: NOW - 100, bestScore: 3, max: 3 },
      { id: 'simulateur', games: 1, lastXpDay: day(6) }, { id: 'biere', games: 1, lastXpDay: day(7) }, { id: 'chargement', games: 2, bestScore: 80, lastXpDay: day(8) },
      { id: 'negociation', games: 1, bestScore: 70, lastXpDay: day(9) }, { id: 'tournee', games: 1, bestScore: 90, lastXpDay: day(10) },
      { id: 'bi/pq-intro', solved: 1, attempts: 1 },
      ...Array.from({ length: 10 }, (_, i) => ({ id: `bi/ent/q${i}`, status: 'known', updatedAt: NOW - 400 })),
    ],
    seen: [{ id: 'yt:abc', at: NOW - 50 }, { id: 'scm:https://x', at: NOW - 40, manual: true }],
    favorites: [{ id: 'video:yt:abc', type: 'video', title: 'T', on: true, at: NOW - 30, updatedAt: NOW - 30 }],
  }
  const all = earned(full)
  const missing = BADGES.filter((b) => !all.some((e) => e.id === b.id))
  if (missing.length) fail(w, `badges impossibles à gagner avec un jeu de données complet : ${missing.map((b) => b.id).join(', ')}`)
  for (const e of all) if (!Number.isFinite(e.at) || e.at > NOW) fail(w, `badge ${e.id} : date d'obtention invalide (${e.at})`)
  // précision : les exercices de révision, les articles « lus » et les favoris retirés ne comptent pas
  const noisy = { rvLots: [lot], rvProgress: [rvProgress.at(-1)], seen: [{ id: 'scm:https://x', at: 1 }], favorites: [{ id: 'a', type: 'card', title: 't', on: false, at: 1, updatedAt: 2 }] }
  const n = ids(noisy)
  if (n.has('rv-flash') || n.has('rv-50') || n.has('video-1') || n.has('favori-1')) fail(w, 'des activités qui ne comptent pas déclenchent des badges')
  if (!n.has('rv-import')) fail(w, 'un lot importé doit donner « Premier lot »')
  if (ids({ workshop: [{ id: 'bi/ent/q1', status: 'review', updatedAt: 1 }] }).has('entretien-1')) fail(w, 'une question « À revoir » ne doit pas compter comme maîtrisée')
  // défi du jour : 3 jours d'affilée
  if (!ids({ activity: [0, 1, 2].map((i) => ({ date: day(i), xp: 0, daily: true })) }).has('defi-3') || ids({ activity: [0, 1, 3].map((i) => ({ date: day(i), xp: 0, daily: true })) }).has('defi-3')) fail(w, 'défi du jour 3 jours de suite')

  // 7) Fusion : badges (plus ancien gagne), favoris (plus récent gagne, retrait pris en compte), activité (`daily` conservé)
  if (mergeBadge({ id: 'a', at: 100 }, { id: 'a', at: 50 }).at !== 50 || mergeBadge({ id: 'a', at: 50 }, { id: 'a', at: 100 }).at !== 50 || mergeBadge(undefined, { id: 'a', at: 7 }).at !== 7) fail(w, 'fusion des badges : on garde le plus ancien')
  if (mergeRow('badges', { id: 'a', at: 100 }, { id: 'a', at: 10 }).at !== 10) fail(w, 'mergeRow badges')
  const fOld = { id: 'f', type: 'word', title: 'x', on: true, at: 1, updatedAt: 10 }
  const fOff = { ...fOld, on: false, updatedAt: 20 }
  if (mergeRow('favorites', fOld, fOff).on !== false || mergeRow('favorites', fOff, fOld).on !== false) fail(w, 'fusion des favoris : un retrait plus récent doit être conservé')
  if (mergeRow('favorites', fOff, { ...fOld, updatedAt: 30 }).on !== true) fail(w, 'fusion des favoris : un nouvel ajout plus récent doit gagner')
  if (!mergeRow('favorites', undefined, fOld).on) fail(w, 'fusion des favoris : un favori absent ici doit être ajouté')
  if (mergeRow('activity', { date: 'd', xp: 10 }, { date: 'd', xp: 5, daily: true }).daily !== true) fail(w, 'fusion de l\'activité : `daily` doit être conservé')
  // sauvegarde : tables badges et favorites acceptées, lignes invalides refusées
  const sch = { badges: 'id', favorites: 'id' }
  const bk = (t) => JSON.stringify({ format: BACKUP_FORMAT, version: 1, exportedAt: new Date().toISOString(), tables: t })
  if (!validateBackup(bk({ badges: [{ id: 'a', at: 5 }], favorites: [fOld] }), sch).ok) fail(w, 'une sauvegarde avec badges et favoris est refusée')
  if (validateBackup(bk({ badges: [{ id: 'a' }] }), sch).ok) fail(w, 'un badge sans date doit être refusé')
  if (validateBackup(bk({ favorites: [{ id: 'f' }] }), sch).ok) fail(w, 'un favori sans type ni titre doit être refusé')
  if (!validateBackup(bk({}), sch).ok) fail(w, 'une ancienne sauvegarde sans badges ni favoris doit rester acceptée')

  // 8) Favoris : identifiants stables, contenu minimal conservé pour l'Actu
  const video = { id: 'yt:abc', kind: 'video', videoId: 'abc', isShort: true, title: 'Titre', link: 'https://youtu.be/abc', thumbnail: 'https://i.ytimg.com/vi/abc/hqdefault.jpg', date: '2026-11-19T10:00:00Z', source: 'Chaîne', lang: 'fr', themes: ['supply'] }
  const vf = videoFav(video)
  if (vf.id !== 'video:yt:abc' || !vf.title || !vf.url || !vf.thumb || vf.data?.videoId !== 'abc' || vf.data?.title !== 'Titre') fail(w, 'un favori vidéo doit garder titre, lien, miniature et de quoi relancer le lecteur')
  const af = articleFav({ id: 'scm:https://x/1', title: 'Art', link: 'https://x/1', source: 'SCM', date: '2026-11-19', themes: ['supply'] })
  if (af.id !== 'article:scm:https://x/1' || !af.url || !af.title) fail(w, 'favori article')
  const cf = cardFav({ id: 'L1', title: 'Lot' }, { id: 'c1', type: 'flashcard', recto: 'Q', verso: 'R' })
  if (cf.id !== 'card:L1|c1' || cf.title !== 'Q' || cf.text !== 'R' || cf.to !== '/revisions/lot/L1') fail(w, 'favori carte de révision')
  if (cardFav({ id: 'L1', title: 'Lot' }, { id: 'c2', type: 'qcm', question: 'Q ?', choices: ['a', 'b'], answer: 1 }).text !== 'b') fail(w, 'favori QCM : la bonne réponse doit être conservée')
  if (clip('x'.repeat(500)).length > 280) fail(w, 'clip')
  if (wordFav({ en: 'supplier', fr: 'fournisseur', def: 'd' }).id !== 'word:supplier' || lessonFav({ key: 'a/b', title: 'T', module: { title: 'M' } }).to !== '/cours/a/b') fail(w, 'favori mot / leçon')
  const types = new Set(FAV_TYPES.map((t) => t.id))
  for (const f of [vf, af, cf, wordFav({ en: 'a', fr: 'b', def: 'c' }), lessonFav({ key: 'a/b', title: 'T' }), atelierFav({ key: 'k', title: 'T', to: '/atelier/x' })]) if (!types.has(f.type)) fail(w, `type de favori inconnu : ${f.type}`)

  console.log(`Badges : ${BADGES.length} badges dans ${BADGE_CATEGORIES.length} catégories (tous gagnables, dates et fusion vérifiées) · Favoris : fabriques, fusion et sauvegarde vérifiées`)
}

// ---------- Compte rendu ----------
const lessons = ALL_LESSONS.length
const bankSizes = ALL_LESSONS.map((l) => l.quiz.length)
console.log('=== Contenu ===')
console.log(`Cours : ${MODULES.length} modules, ${lessons} leçons, banques de ${Math.min(...bankSizes)} à ${Math.max(...bankSizes)} questions (${totalStaticQ} fixes + ${totalFnQ} à chiffres aléatoires)`)
console.log(`Formules : ${FORMULA_LIST.length} · Défis Excel : ${EXCEL_CHALLENGES.length} (${EXCEL_CHALLENGES.filter((c) => c.generate).length} à données aléatoires) · Études de cas : ${CASES.length} (${CASES.filter((c) => c.generate).length} à chiffres aléatoires)`)
console.log(`Anglais : ${UNITS.length} unités, ${ALL_EN_LESSONS.length} leçons, ${ALL_WORDS.length} mots, ${seenPhrases.size} phrases`)
if (warnings.length) {
  console.log(`\n⚠ ${warnings.length} avertissement(s) :`)
  for (const w of warnings.slice(0, 25)) console.log('  -', w)
}
if (errors.length) {
  console.log(`\n❌ ${errors.length} erreur(s) :`)
  for (const e of errors.slice(0, 40)) console.log('  -', e)
  process.exit(1)
}
console.log('\n✅ Aucune erreur')
