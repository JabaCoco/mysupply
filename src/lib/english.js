import { useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db.js'
import { ALL_EN_LESSONS, ALL_WORDS, wordId } from '../data/anglais/units.js'
import { addXp } from './progress.js'
import { dayKey } from './dates.js'
import { reportDaily } from './dailyChallenge.js'

export const DAILY_WORDS = 3 // nouveaux mots par jour
export const XP_EN_LESSON = 10 // leçon terminée la 1re fois
export const XP_EN_CORRECT = 2 // par bonne réponse (1re fois)
export const XP_EN_REPLAY = 5
export const XP_DAILY_WORD = 2 // par carte du jour triée

// Face affichée au recto d'une flashcard : 'en' (le mot anglais) ou 'fr' (le mot français).
// Tirée "au hasard", mais stable pour un mot donné un jour donné (elle ne change pas à chaque affichage).
export function cardFace(en, day = dayKey(new Date())) {
  let h = 2166136261
  for (const c of `${day}|${en}`) {
    h ^= c.charCodeAt(0)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 16) & 1 ? 'fr' : 'en'
}

// ---------- Mots du jour ----------
// Chaque jour, 3 mots jamais vus (ni dans une leçon, ni dans une carte du jour), dans l'ordre du parcours.
export async function ensureDailyWords() {
  await db.transaction('rw', db.meta, db.english, async () => {
    const today = dayKey(new Date())
    const current = (await db.meta.get('englishDaily'))?.value
    if (current?.day === today) return
    const statuses = new Set(await db.english.toCollection().primaryKeys())
    const fresh = ALL_WORDS.filter((w) => !statuses.has(wordId(w.en)))
    // Tout est vu : on repioche dans les mots "à revoir"
    const source = fresh.length >= DAILY_WORDS ? fresh : ALL_WORDS
    await db.meta.put({ key: 'englishDaily', value: { day: today, words: source.slice(0, DAILY_WORDS).map((w) => w.en) } })
  })
}

// Marque un mot comme connu / à revoir (+2 XP la première fois qu'on trie une carte du jour)
export async function setWordStatus(en, status, fromDaily = false) {
  return db.transaction('rw', db.english, db.activity, async () => {
    const previous = await db.english.get(wordId(en))
    await db.english.put({ id: wordId(en), status, updatedAt: Date.now() })
    if (fromDaily && (!previous || previous.status === 'seen')) {
      await addXp(XP_DAILY_WORD)
      return XP_DAILY_WORD
    }
    return 0
  })
}

// Fin de leçon : enregistre le score, marque les mots comme "vus", donne les XP
export async function completeEnglishLesson(lesson, score, total) {
  await reportDaily('anglais', lesson.key)
  return db.transaction('rw', db.english, db.activity, async () => {
    const key = `lesson/${lesson.key}`
    const previous = await db.english.get(key)
    await db.english.put({ id: key, bestScore: Math.max(score, previous?.bestScore ?? 0), total, completedAt: Date.now() })
    for (const item of lesson.items.filter((i) => i.ex)) {
      if (!(await db.english.get(wordId(item.en)))) await db.english.put({ id: wordId(item.en), status: 'seen', updatedAt: Date.now() })
    }
    const xp = previous ? XP_EN_REPLAY : XP_EN_LESSON + score * XP_EN_CORRECT
    await addXp(xp)
    return xp
  })
}

// ---------- Hook React : toute la progression d'anglais ----------
export function useEnglish() {
  const data = useLiveQuery(async () => ({
    rows: await db.english.toArray(),
    daily: (await db.meta.get('englishDaily'))?.value ?? null,
    last: (await db.meta.get('lastEnLesson'))?.value ?? null,
  }), [])
  const today = dayKey(new Date())
  const stale = data && data.daily?.day !== today
  useEffect(() => {
    if (stale) ensureDailyWords()
  }, [stale])
  if (!data) return null

  const byId = new Map(data.rows.map((r) => [r.id, r]))
  const done = new Set(ALL_EN_LESSONS.filter((l) => byId.has(`lesson/${l.key}`)).map((l) => l.key))
  const lastIndex = ALL_EN_LESSONS.findIndex((l) => l.key === data.last)
  const next =
    (lastIndex >= 0 && !done.has(data.last) ? ALL_EN_LESSONS[lastIndex] : null) ??
    [...ALL_EN_LESSONS.slice(lastIndex + 1), ...ALL_EN_LESSONS.slice(0, lastIndex + 1)].find((l) => !done.has(l.key)) ??
    null
  const dailyWords = (stale ? [] : (data.daily?.words ?? [])).map((en) => ALL_WORDS.find((w) => w.en === en)).filter(Boolean)
  const learned = ALL_WORDS.filter((w) => byId.has(wordId(w.en))).length

  return {
    byId,
    done,
    next,
    dailyWords,
    learned,
    status: (en) => byId.get(wordId(en))?.status ?? null,
  }
}

export const setLastEnLesson = (key) => db.meta.put({ key: 'lastEnLesson', value: key })
