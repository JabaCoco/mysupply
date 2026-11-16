// Contenus et progression de l'onglet Révisions : enregistrés dans le navigateur (IndexedDB), hors ligne.
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db.js'
import { addXp } from './progress.js'
import { dayKey } from './dates.js'
import { cardsOf, hashId } from './revFormat.js'
import { dueToday, isDue, levelOf, schedule } from './revSrs.js'
import { BACKUP_FORMAT, BACKUP_VERSION, SKIP_TABLES, mergeRow } from './revBackup.js'

export const XP = { known: 2, review: 1, qcmOk: 3, qcmKo: 1, exoOk: 5, exoKo: 1 }

const norm = (s) => String(s).trim().toLowerCase()
export const cardKey = (lotId, itemId, dir) => `${lotId}|${itemId}|${dir}`
export const parseKey = (key) => {
  const [lotId, itemId, dir] = key.split('|')
  return { lotId, itemId, dir }
}

// ---------- Lecture (hooks) ----------
// Tous les lots, toute la progression et les chiffres utiles, mis à jour en direct
export function useRevisions() {
  const lots = useLiveQuery(() => db.rvLots.toArray(), [])
  const rows = useLiveQuery(() => db.rvProgress.toArray(), [])
  if (!lots || !rows) return null
  const progress = new Map(rows.map((r) => [r.id, r]))
  const today = dayKey(new Date())
  const allCards = []
  const byLot = new Map()
  for (const lot of lots) {
    const cards = cardsOf(lot).map((c) => ({ key: cardKey(lot.id, c.itemId, c.dir), progress: progress.get(cardKey(lot.id, c.itemId, c.dir)) }))
    allCards.push(...cards)
    byLot.set(lot.id, {
      cards,
      total: cards.length,
      due: cards.filter((c) => isDue(c.progress, today)).length,
      mastered: cards.filter((c) => levelOf(c.progress) === 'maîtrisée').length,
    })
  }
  return {
    lots,
    progress,
    byLot,
    allCards,
    today,
    summary: {
      lots: lots.length,
      cards: allCards.length,
      due: dueToday(allCards, today),
      mastered: allCards.filter((c) => levelOf(c.progress) === 'maîtrisée').length,
    },
  }
}

// Nombre de cartes à réviser aujourd'hui (tuile de l'accueil) ; null pendant le chargement
export function useDueCount() {
  return useRevisions()?.summary.due ?? null
}

// ---------- Import ----------
export function findSameLot(lots, lot) {
  return lots.find((l) => norm(l.title) === norm(lot.title) && norm(l.matiere) === norm(lot.matiere) && norm(l.cours) === norm(lot.cours))
}

const uid = () => `l${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

// Enregistre un lot. mode 'remplacer' : met à jour le lot identique (la progression des cartes qui existent toujours est conservée).
export async function saveLot(lot, mode = 'nouveau', existingId = null) {
  const now = Date.now()
  // Demande au navigateur de ne pas effacer nos données (iPhone : sinon Safari peut les supprimer après une longue absence)
  try {
    await navigator.storage?.persist?.()
  } catch {
    // pas grave : la demande est facultative
  }
  if (mode === 'remplacer' && existingId) {
    await db.transaction('rw', db.rvLots, db.rvProgress, async () => {
      const old = await db.rvLots.get(existingId)
      await db.rvLots.put({ ...old, ...lot, id: existingId, updatedAt: now })
      const keep = new Set(cardsOf(lot).map((c) => cardKey(existingId, c.itemId, c.dir)))
      const stale = (await db.rvProgress.where('lotId').equals(existingId).toArray()).filter((r) => !r.itemId.includes(':') && !keep.has(r.id) && !r.id.includes('|x:'))
      await db.rvProgress.bulkDelete(stale.map((r) => r.id))
    })
    return existingId
  }
  const id = uid()
  await db.rvLots.put({ ...lot, id, createdAt: now, updatedAt: now })
  return id
}

export async function renameLot(id, { title, matiere, cours }) {
  await db.rvLots.update(id, { title: title.trim(), matiere: matiere.trim(), cours: cours.trim() || 'Général', updatedAt: Date.now() })
}

export async function deleteLot(id) {
  await db.transaction('rw', db.rvLots, db.rvProgress, async () => {
    await db.rvLots.delete(id)
    await db.rvProgress.where('lotId').equals(id).delete()
  })
}

// ---------- Réponses ----------
// Enregistre la réponse à une carte (flashcard, question-réponse, QCM). Renvoie les XP gagnés (une fois par carte et par jour).
export async function reviewCard(key, known, kind = 'card') {
  const { lotId, itemId, dir } = parseKey(key)
  const today = new Date()
  const todayKey = dayKey(today)
  const xpFull = kind === 'qcm' ? XP.qcmOk : XP.known
  const xpLow = kind === 'qcm' ? XP.qcmKo : XP.review
  return db.transaction('rw', db.rvProgress, db.activity, async () => {
    const card = await db.rvProgress.get(key)
    const next = { id: key, lotId, itemId, dir, ...schedule(card, known, today), xpDay: card?.xpDay }
    let xp = 0
    if (card?.xpDay !== todayKey) {
      xp = known ? xpFull : xpLow
      next.xpDay = todayKey
    }
    await db.rvProgress.put(next)
    if (xp) await addXp(xp)
    return xp
  })
}

// Réponse à une question d'exercice : on garde le dernier résultat, XP une fois par question et par jour
export async function recordExerciseQuestion(lotId, itemId, qid, correct) {
  const key = `${lotId}|${itemId}|x:${qid}`
  const todayKey = dayKey(new Date())
  return db.transaction('rw', db.rvProgress, db.activity, async () => {
    const row = await db.rvProgress.get(key)
    const next = { id: key, lotId, itemId: `x:${itemId}:${qid}`, dir: 'x', box: 0, due: '9999-12-31', reps: (row?.reps ?? 0) + 1, lapses: (row?.lapses ?? 0) + (correct ? 0 : 1), last: todayKey, ok: correct, best: Boolean(row?.best || correct), xpDay: row?.xpDay }
    let xp = 0
    if (row?.xpDay !== todayKey) {
      xp = correct ? XP.exoOk : XP.exoKo
      next.xpDay = todayKey
    }
    await db.rvProgress.put(next)
    if (xp) await addXp(xp)
    return xp
  })
}

// ---------- Sauvegarde complète ----------
export const tableSchema = () => Object.fromEntries(db.tables.filter((t) => !SKIP_TABLES.includes(t.name)).map((t) => [t.name, t.schema.primKey.keyPath]))

export async function buildBackup() {
  const tables = {}
  for (const t of db.tables) if (!SKIP_TABLES.includes(t.name)) tables[t.name] = await t.toArray()
  return JSON.stringify({ format: BACKUP_FORMAT, version: BACKUP_VERSION, exportedAt: new Date().toISOString(), tables })
}

// mode 'remplacer' : le contenu de l'appareil est remplacé par la sauvegarde ;
// mode 'fusionner' : on ajoute ce qui manque et on garde le plus avancé (voir mergeRow).
export async function applyBackup(data, mode) {
  const names = Object.keys(data.tables)
  const stats = {}
  await db.transaction('rw', names.map((n) => db.table(n)), async () => {
    for (const name of names) {
      const table = db.table(name)
      const rows = data.tables[name]
      if (mode === 'remplacer') {
        await table.clear()
        await table.bulkPut(rows)
        stats[name] = rows.length
      } else {
        const keyPath = table.schema.primKey.keyPath
        const locals = await table.bulkGet(rows.map((r) => r[keyPath]))
        const toPut = rows.map((r, i) => mergeRow(name, locals[i], r)).filter((r, i) => r !== locals[i])
        await table.bulkPut(toPut)
        stats[name] = toPut.length
      }
    }
  })
  return stats
}

// Identifiant court pour l'affichage
export const shortHash = (s) => hashId(s).slice(0, 6)
