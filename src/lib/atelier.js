import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db.js'
import { addXp } from './progress.js'
import { dayKey } from './dates.js'
import { reportDaily } from './dailyChallenge.js'

export const XP_EXCEL = 15 // défi réussi sans regarder la solution
export const XP_EXCEL_WITH_SOLUTION = 5
export const XP_EXERCISE = 5 // exercice de calcul réussi
export const XP_CASE = 10 // étude de cas terminée (+ bonus selon le score)
export const XP_SIMULATION = 10 // une fois par jour

// Hook React : tout ce qui a été fait dans l'Atelier, sous forme de Map id → données
export function useWorkshop() {
  const rows = useLiveQuery(() => db.workshop.toArray(), [])
  return rows ? new Map(rows.map((r) => [r.id, r])) : null
}

// Défi Excel réussi. Renvoie les XP gagnés (0 si déjà réussi avant).
export async function completeExcel(id, usedSolution) {
  await reportDaily('excel', id)
  return db.transaction('rw', db.workshop, db.activity, async () => {
    const key = `excel/${id}`
    if (await db.workshop.get(key)) return 0
    const xp = usedSolution ? XP_EXCEL_WITH_SOLUTION : XP_EXCEL
    await db.workshop.put({ id: key, completedAt: Date.now() })
    await addXp(xp)
    return xp
  })
}

// Exercice de calcul terminé. Renvoie les XP gagnés.
export async function recordExercise(formulaId, correct) {
  if (correct) await reportDaily('calcul', formulaId)
  return db.transaction('rw', db.workshop, db.activity, async () => {
    const key = `calc/${formulaId}`
    const previous = await db.workshop.get(key)
    await db.workshop.put({
      id: key,
      solved: (previous?.solved ?? 0) + (correct ? 1 : 0),
      attempts: (previous?.attempts ?? 0) + 1,
    })
    if (!correct) return 0
    await addXp(XP_EXERCISE)
    return XP_EXERCISE
  })
}

// Étude de cas terminée. Première fois : 10 XP + 5 XP par tranche de 25 % du score.
export async function completeCase(id, score, max) {
  await reportDaily('cas', id)
  return db.transaction('rw', db.workshop, db.activity, async () => {
    const key = `cas/${id}`
    const previous = await db.workshop.get(key)
    await db.workshop.put({ id: key, bestScore: Math.max(score, previous?.bestScore ?? 0), max, completedAt: Date.now() })
    if (previous) return 0
    const xp = XP_CASE + Math.floor((score / max) * 4) * 5
    await addXp(xp)
    return xp
  })
}

// Partie de simulateur terminée : garde le meilleur résultat, XP une fois par jour
export async function recordSimulation(result) {
  await reportDaily('simulateur', 'simulateur')
  return db.transaction('rw', db.workshop, db.activity, async () => {
    const previous = await db.workshop.get('simulateur')
    const today = dayKey(new Date())
    // Les scénarios changent à chaque partie : on retient le meilleur ÉCART avec la méthode du cours
    const best = previous?.bestGap === undefined || result.gap < previous.bestGap
    await db.workshop.put({
      id: 'simulateur',
      bestGap: best ? result.gap : previous.bestGap,
      bestService: best ? result.service : previous.bestService,
      games: (previous?.games ?? 0) + 1,
      lastXpDay: today,
    })
    if (previous?.lastXpDay === today) return 0
    await addXp(XP_SIMULATION)
    return XP_SIMULATION
  })
}
