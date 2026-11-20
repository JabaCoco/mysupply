// Badges : lecture / enregistrement dans la base locale. Les règles sont dans badgeRules.js.
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db.js'
import { MODULES } from '../data/courses/index.js'
import { BADGES, computeStats, earnedBadges } from './badgeRules.js'

// Lit toutes les tables utiles aux badges
export async function loadBadgeData() {
  const [activity, lessons, workshop, english, rvLots, rvProgress, seen, favorites] = await Promise.all([
    db.activity.toArray(),
    db.lessons.toArray(),
    db.workshop.toArray(),
    db.english.toArray(),
    db.rvLots.toArray(),
    db.rvProgress.toArray(),
    db.seen.toArray(),
    db.favorites.toArray(),
  ])
  return { activity, lessons, workshop, english, rvLots, rvProgress, seen, favorites }
}

export const statsOf = (data) => computeStats(data, MODULES)

// Enregistre les badges gagnés qui ne le sont pas encore. Renvoie la liste de ceux qui viennent d'être ajoutés.
export async function unlockBadges(earned) {
  const added = []
  await db.transaction('rw', db.badges, async () => {
    for (const badge of earned) {
      if (await db.badges.get(badge.id)) continue
      await db.badges.add({ id: badge.id, at: badge.at })
      added.push(badge)
    }
  })
  return added
}

// Hook : badges gagnés { Map id → { id, at } } et nombre, mis à jour en direct (null pendant le chargement).
// Les identifiants inconnus (venus d'une version plus récente de l'appli) sont ignorés.
export function useBadges() {
  const rows = useLiveQuery(() => db.badges.toArray(), [])
  if (!rows) return null
  const known = new Set(BADGES.map((b) => b.id))
  const byId = new Map(rows.filter((r) => known.has(r.id)).map((r) => [r.id, r]))
  return { byId, count: byId.size, total: BADGES.length }
}

// Avancement d'un badge non gagné : { value, target } (pour la barre « 7 / 10 »)
export function useBadgeProgress() {
  const data = useLiveQuery(loadBadgeData, [])
  if (!data) return null
  const stats = statsOf(data)
  return Object.fromEntries(BADGES.map((b) => [b.id, Math.min(b.value(stats), b.target)]))
}

export { earnedBadges }
