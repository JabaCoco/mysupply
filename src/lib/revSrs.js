// Répétition espacée (méthode des boîtes de Leitner) : une carte « connue » monte d'une boîte et revient
// de plus en plus tard ; une carte « à revoir » retombe dans la boîte 0 et revient dès le lendemain
// (et une 2e fois pendant la séance), donc beaucoup plus souvent.
import { addDays, dayKey } from './dates.js'

export const INTERVALS = [1, 2, 4, 8, 16, 32, 64] // jours avant la prochaine révision, selon la boîte
export const DAILY_LIMIT = 20 // cartes d'une séance « à réviser »
export const NEW_LIMIT = 10 // dont cartes jamais vues, au maximum

// Nouvel état d'une carte après une réponse. `card` = état précédent (ou null si jamais vue).
export function schedule(card, known, today = new Date()) {
  const base = { reps: (card?.reps ?? 0) + 1, lapses: card?.lapses ?? 0, last: dayKey(today) }
  if (known) {
    const box = Math.min(INTERVALS.length - 1, (card?.box ?? -1) + 1)
    return { ...base, box, due: dayKey(addDays(today, INTERVALS[box])) }
  }
  return { ...base, box: 0, lapses: base.lapses + 1, due: dayKey(addDays(today, 1)) }
}

// Une carte est à réviser si elle n'a jamais été vue, ou si sa date est arrivée
export const isDue = (card, todayKey) => !card || card.due <= todayKey

export function levelOf(card) {
  if (!card) return 'nouvelle'
  if (card.box >= 4) return 'maîtrisée'
  if (card.lapses > 0 && card.box <= 1) return 'à revoir'
  return 'en cours'
}

const shuffle = (a) => {
  const x = [...a]
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[x[i], x[j]] = [x[j], x[i]]
  }
  return x
}

// Choisit les cartes d'une séance : d'abord les cartes dont la date est arrivée (les plus en retard et les plus
// difficiles en premier), puis quelques cartes nouvelles. `cards` = [{ key, progress }] ; renvoie les `key`.
export function pickSession(cards, todayKey, { limit = DAILY_LIMIT, newLimit = NEW_LIMIT } = {}) {
  const due = cards
    .filter((c) => c.progress && c.progress.due <= todayKey)
    .sort((a, b) => (a.progress.due < b.progress.due ? -1 : a.progress.due > b.progress.due ? 1 : b.progress.lapses - a.progress.lapses))
  const fresh = shuffle(cards.filter((c) => !c.progress)).slice(0, newLimit)
  return shuffle([...due, ...fresh].slice(0, limit)).map((c) => c.key)
}

// Nombre de cartes à réviser aujourd'hui avec les limites d'une séance
export function dueToday(cards, todayKey) {
  const due = cards.filter((c) => c.progress && c.progress.due <= todayKey).length
  const fresh = Math.min(NEW_LIMIT, cards.filter((c) => !c.progress).length)
  return Math.min(DAILY_LIMIT, due + fresh)
}
