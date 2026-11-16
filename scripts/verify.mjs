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
import { evaluateFormula, canonicalName } from '../src/lib/excel/evaluate.js'
import { functionsUsed, parseFormula } from '../src/lib/excel/parser.js'
import { unitStyle } from '../src/pages/anglais/unitStyle.js'

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
