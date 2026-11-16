import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db.js'
import { ALL_LESSONS, MODULES } from '../data/courses/index.js'
import { addXp } from './progress.js'

export const XP_LESSON = 10 // pour une première leçon terminée
export const XP_PER_CORRECT = 5 // par bonne réponse au quiz (première fois)
export const XP_REPLAY = 5 // quand on refait une leçon déjà terminée

// Enregistre la fin d'une leçon et donne les XP. Renvoie le nombre d'XP gagnés.
export async function completeLesson(key, score, total) {
  return db.transaction('rw', db.lessons, db.activity, async () => {
    const previous = await db.lessons.get(key)
    const xp = previous ? XP_REPLAY : XP_LESSON + score * XP_PER_CORRECT
    await db.lessons.put({
      id: key,
      bestScore: Math.max(score, previous?.bestScore ?? 0),
      total,
      attempts: (previous?.attempts ?? 0) + 1,
      completedAt: Date.now(),
    })
    await addXp(xp)
    return xp
  })
}

// Mémorise la dernière leçon ouverte (pour la carte "Reprendre" de l'accueil)
export function setLastLesson(key) {
  return db.meta.put({ key: 'lastLesson', value: key })
}

// Choisit la leçon à proposer : la dernière ouverte si elle n'est pas finie,
// sinon la suivante non terminée dans l'ordre du programme.
function pickNext(done, lastKey) {
  const lastIndex = ALL_LESSONS.findIndex((l) => l.key === lastKey)
  if (lastIndex >= 0 && !done.has(lastKey)) return ALL_LESSONS[lastIndex]
  const ordered = [...ALL_LESSONS.slice(lastIndex + 1), ...ALL_LESSONS.slice(0, lastIndex + 1)]
  return ordered.find((l) => !done.has(l.key)) ?? null
}

// Hook React : progression complète dans les cours, mise à jour en direct
export function useCourseProgress() {
  const data = useLiveQuery(async () => ({
    rows: await db.lessons.toArray(),
    last: (await db.meta.get('lastLesson'))?.value ?? null,
  }), [])
  if (!data) return null

  const byKey = new Map(data.rows.map((r) => [r.id, r]))
  const done = new Set(byKey.keys())
  const modules = MODULES.map((module) => {
    const count = module.lessons.filter((l) => done.has(`${module.id}/${l.id}`)).length
    return { id: module.id, done: count, total: module.lessons.length }
  })

  return {
    byKey,
    done,
    modules: Object.fromEntries(modules.map((m) => [m.id, m])),
    doneCount: done.size,
    total: ALL_LESSONS.length,
    next: pickNext(done, data.last),
  }
}
