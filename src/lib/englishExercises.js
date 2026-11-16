// Fabrique les exercices d'une leçon d'anglais, selon son niveau.
// Types : choice (QCM, écoute, phrase à trous), pairs (associer), order (remettre dans l'ordre),
//         type (écrire le mot), speak (prononcer au micro).
import { ALL_EN_LESSONS } from '../data/anglais/units.js'
import { canSpeak, levenshtein, normalize } from './speech.js'

const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const ALL_ITEMS = ALL_EN_LESSONS.flatMap((l) => l.items)
const WORDS = ALL_ITEMS.filter((i) => i.ex)
const PHRASES = ALL_ITEMS.filter((i) => !i.ex)

// 3 mauvaises réponses différentes de la bonne, prises d'abord dans la leçon puis ailleurs
function distractors(correct, key, lessonItems, pool, n = 3) {
  const seen = new Set([correct[key].toLowerCase()])
  const out = []
  for (const item of [...shuffle(lessonItems), ...shuffle(pool)]) {
    const value = item[key]
    if (!seen.has(value.toLowerCase())) {
      seen.add(value.toLowerCase())
      out.push(value)
    }
    if (out.length === n) break
  }
  return out
}

function choice(prompt, display, correctValue, wrongs, extra = {}) {
  const choices = shuffle([correctValue, ...wrongs])
  return { type: 'choice', prompt, display, choices, answer: choices.indexOf(correctValue), solution: correctValue, ...extra }
}

const tokens = (sentence) => sentence.replace(/[.?!]$/, '').split(' ')

// ---------- Fabriques par type ----------
const make = {
  enFr: (item, items) => choice('Que veut dire ce mot ?', { big: item.en, speak: item.en }, item.fr, distractors(item, 'fr', items, WORDS)),
  frEn: (item, items) => choice('Comment dit-on en anglais ?', { big: item.fr }, item.en, distractors(item, 'en', items, WORDS), { speakAfter: item.en }),
  listen: (item, items, pool) =>
    choice('Écoute et choisis ce que tu entends', { listen: item.en }, item.en, distractors(item, 'en', items, pool), { sub: item.fr }),
  fill: (item, items) => {
    // Phrase à trous : pour un mot, on cache le mot dans sa phrase d'exemple ; pour une phrase, le mot clé
    const sentence = item.ex ?? item.en
    const hidden = item.ex ? item.en : item.blank
    const regex = new RegExp(`\\b${hidden.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
    if (!regex.test(sentence)) return null
    const others = item.ex ? distractors(item, 'en', items, WORDS) : shuffle(PHRASES.filter((p) => p.blank !== hidden).map((p) => p.blank)).slice(0, 3)
    return choice('Complète la phrase', { sentence: sentence.replace(regex, '_____'), sub: item.ex ? item.exFr : item.fr }, hidden, others, { speakAfter: sentence })
  },
  order: (item, items, pool, level) => {
    const en = item.ex ?? item.en
    const fr = item.ex ? item.exFr : item.fr
    const answer = tokens(en)
    if (answer.length < 4) return null
    // À partir du niveau 2, 2 mots en trop pour corser
    const extra =
      level >= 2
        ? shuffle(pool.flatMap((p) => tokens(p.ex ?? p.en)).filter((w) => !answer.map((a) => a.toLowerCase()).includes(w.toLowerCase()))).slice(0, 2)
        : []
    return { type: 'order', prompt: 'Traduis en remettant les mots dans l’ordre', fr, answer, tiles: shuffle([...answer, ...new Set(extra)]), solution: en }
  },
  type: (item) =>
    item.ex
      ? { type: 'type', prompt: 'Écris en anglais', fr: item.fr, answers: [item.en, ...(item.alt ?? [])], solution: item.en }
      : { type: 'type', prompt: 'Écris le mot manquant', fr: item.fr, sentence: item.en.replace(new RegExp(`\\b${item.blank}\\b`, 'i'), '_____'), answers: [item.blank], solution: item.blank },
  speak: (item) => ({ type: 'speak', prompt: 'Prononce à voix haute', text: item.ex ? item.en : item.en, fr: item.fr, solution: item.en }),
  pairs: (items) => ({ type: 'pairs', prompt: 'Associe les paires', pairs: shuffle(items).slice(0, 5).map((i) => ({ en: i.en, fr: i.fr })) }),
}

// Composition d'une leçon selon le niveau (environ 10 exercices)
const PLANS = {
  1: ['pairs', 'enFr', 'frEn', 'listen', 'enFr', 'order', 'frEn', 'type', 'listen', 'speak'],
  2: ['pairs', 'enFr', 'fill', 'order', 'listen', 'type', 'frEn', 'order', 'type', 'speak'],
  3: ['fill', 'order', 'listen', 'fill', 'speak', 'order', 'type', 'fill', 'order', 'speak'],
}

export function buildExercises(lesson) {
  const items = lesson.items
  const pool = lesson.level === 3 ? PHRASES : WORDS
  // Pour chaque type d'exercice, on évite de réutiliser le même mot / la même phrase
  const usedByKind = {}
  const usage = new Map(items.map((i) => [i, 0])) // pour répartir les éléments entre les types
  function candidates(kind) {
    const used = (usedByKind[kind] ??= new Set())
    const fresh = items.filter((i) => !used.has(i))
    return shuffle(fresh.length ? fresh : items).sort((a, b) => usage.get(a) - usage.get(b))
  }

  const exercises = []
  for (let kind of PLANS[lesson.level]) {
    // Sans synthèse vocale, l'écoute devient un QCM classique
    if (kind === 'listen' && !canSpeak()) kind = lesson.level === 3 ? 'fill' : 'enFr'
    if (kind === 'pairs') {
      exercises.push(make.pairs(items))
      continue
    }
    for (const item of candidates(kind)) {
      const exercise = make[kind](item, items, pool, lesson.level)
      if (exercise) {
        exercises.push(exercise)
        usedByKind[kind].add(item)
        usage.set(item, usage.get(item) + 1)
        break
      }
    }
  }
  // Le premier exercice reste "pairs" (niveau 1-2) ; les autres sont mélangés
  const [first, ...rest] = exercises
  return lesson.level === 3 ? shuffle(exercises) : [first, ...shuffle(rest)]
}

// Vérifie un mot tapé : majuscules et ponctuation ignorées, une faute de frappe tolérée sur les mots longs
export function checkTyped(input, answers) {
  const said = normalize(input).replace(/^to /, '')
  for (const answer of answers) {
    const goal = normalize(answer).replace(/^to /, '')
    if (said === goal) return { ok: true }
    if (goal.length >= 5 && levenshtein(said, goal) <= 1) return { ok: true, typo: answer }
  }
  return { ok: false }
}

// Phrase remise dans l'ordre : on compare mot à mot, sans tenir compte des majuscules
export const checkOrder = (picked, answer) => picked.length === answer.length && picked.every((w, i) => w.toLowerCase() === answer[i].toLowerCase())
