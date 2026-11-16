import Dexie from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db.js'
import { addDays, dayKey, startOfWeek } from './dates.js'

export const DAILY_GOAL = 50 // XP à gagner chaque jour pour garder sa série
export const XP_PER_LEVEL = 100

// Ajoute des XP à la journée d'aujourd'hui (sera appelé par Cours, Révisions…)
export async function addXp(amount) {
  const date = dayKey(new Date())
  await db.transaction('rw', db.activity, async () => {
    const row = await db.activity.get(date)
    await db.activity.put({
      date,
      xp: (row?.xp ?? 0) + amount,
      celebrated: row?.celebrated ?? false,
    })
  })
}

export async function markCelebrated(date) {
  await db.activity.update(date, { celebrated: true })
}

// DONNÉES DE DÉMO, en attendant que les autres onglets fassent gagner des XP :
// 5 jours d'objectif atteint + 30 XP aujourd'hui. Ajoutées une seule fois.
// À retirer quand Cours et Révisions seront branchés.
export async function seedDemoData() {
  await db.transaction('rw', db.activity, db.meta, async () => {
    if (await db.meta.get('demoSeeded')) return
    const today = new Date()
    const rows = [1, 2, 3, 4, 5].map((n) => ({
      date: dayKey(addDays(today, -n)),
      xp: DAILY_GOAL,
      celebrated: true,
    }))
    rows.push({ date: dayKey(today), xp: 30, celebrated: false })
    // bulkAdd + ignorer les doublons : on n'écrase jamais des XP déjà gagnés
    await db.activity.bulkAdd(rows).catch(Dexie.BulkError, () => {})
    await db.meta.put({ key: 'demoSeeded', value: true })
  })
}

// Nombre de jours d'affilée où l'objectif a été atteint.
// Si aujourd'hui n'est pas encore validé, la série court jusqu'à hier.
function computeStreak(goalDays, today) {
  let cursor = goalDays.has(dayKey(today)) ? today : addDays(today, -1)
  let streak = 0
  while (goalDays.has(dayKey(cursor))) {
    streak++
    cursor = addDays(cursor, -1)
  }
  return streak
}

// Hook React : toutes les infos de progression, mises à jour en direct
export function useProgress() {
  const rows = useLiveQuery(() => db.activity.toArray(), [])
  if (!rows) return null

  const today = new Date()
  const todayKey = dayKey(today)
  const byDate = new Map(rows.map((r) => [r.date, r]))
  const goalDays = new Set(rows.filter((r) => r.xp >= DAILY_GOAL).map((r) => r.date))

  const todayRow = byDate.get(todayKey)
  const todayXp = todayRow?.xp ?? 0
  const totalXp = rows.reduce((sum, r) => sum + r.xp, 0)

  const monday = startOfWeek(today)
  const week = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(monday, i)
    const key = dayKey(date)
    return {
      key,
      date,
      done: goalDays.has(key),
      isToday: key === todayKey,
      isFuture: key > todayKey,
    }
  })

  return {
    todayKey,
    todayXp,
    goalReached: todayXp >= DAILY_GOAL,
    celebrated: todayRow?.celebrated ?? false,
    streak: computeStreak(goalDays, today),
    level: Math.floor(totalXp / XP_PER_LEVEL) + 1,
    week,
  }
}
