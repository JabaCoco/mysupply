// Favoris : lecture / écriture dans la table `favorites` (les types et les fabriques sont dans favoriteItems.js).
import { useMemo, useSyncExternalStore } from 'react'
import { liveQuery } from 'dexie'
import { db } from '../db.js'

export * from './favoriteItems.js'

// ───── Écriture ─────
// Ajoute le favori, ou le retire s'il y est déjà. Renvoie true si le contenu est maintenant en favori.
export async function toggleFavorite(item) {
  const now = Date.now()
  return db.transaction('rw', db.favorites, async () => {
    const row = await db.favorites.get(item.id)
    if (row?.on) {
      await db.favorites.put({ ...row, on: false, updatedAt: now })
      return false
    }
    await db.favorites.put({ ...item, at: now, updatedAt: now, on: true })
    return true
  })
}

// ───── Lecture (un seul abonnement à la base pour toute l'appli : léger même avec des centaines de cœurs) ─────
let rows = null // null tant que la base n'a pas répondu
let ids = new Set()
let started = false
const listeners = new Set()

function start() {
  if (started) return
  started = true
  liveQuery(() => db.favorites.toArray()).subscribe({
    next(list) {
      rows = list
      ids = new Set(list.filter((f) => f.on).map((f) => f.id))
      listeners.forEach((l) => l())
    },
    error() {},
  })
}
function subscribe(listener) {
  start()
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// Ensemble des identifiants en favori
export const useFavoriteIds = () => useSyncExternalStore(subscribe, () => ids)

// Liste des favoris (du plus récent au plus ancien) ; null pendant le chargement
export function useFavorites() {
  const all = useSyncExternalStore(subscribe, () => rows)
  return useMemo(() => (all ? all.filter((f) => f.on).sort((a, b) => b.at - a.at) : null), [all])
}
