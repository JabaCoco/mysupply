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
import { MODULES, ALL_LESSONS, findLesson } from '../src/data/courses/index.js'
import { MODULE_COLORS, MODULE_ICONS } from '../src/pages/cours/moduleStyle.js'
import { FORMULAS, FORMULA_LIST, generateExercises, checkNumber } from '../src/data/atelier/formulas.js'
import { EXCEL_CHALLENGES, buildCells } from '../src/data/atelier/excel.js'
import { CASES } from '../src/data/atelier/cases.js'
import { UNITS, ALL_EN_LESSONS, ALL_WORDS } from '../src/data/anglais/units.js'
import { buildExercises, checkOrder, checkTyped } from '../src/lib/englishExercises.js'
import { evaluateFormula, canonicalName } from '../src/lib/excel/evaluate.js'
import { functionsUsed, parseFormula } from '../src/lib/excel/parser.js'
import { unitStyle } from '../src/pages/anglais/unitStyle.js'

// Modules dont chaque leçon doit avoir une banque d'au moins 8 questions (on l'élargit lot après lot)
const ENFORCE_BANK = new Set(['bases', 'transport', 'stocks', 'entrepot', 'achats', 'prevision', 'production'])
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
if (longestPct > 40) {
  warn('Quiz', `la bonne réponse est la plus longue dans ${longestPct} % des questions (biais à corriger, objectif < 35 %)`)
  const worst = Object.entries(longestByLesson).filter(([, [n, t]]) => n / t > 0.5).map(([k, [n, t]]) => `${k} (${n}/${t})`)
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
