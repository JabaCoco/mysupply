// Sauvegarde et restauration de toute la progression et des contenus importés (un seul fichier JSON).
// Les fonctions « pures » (validateBackup, mergeRow) sont testées par `npm run verify`.
// Le cache des flux d'actualité (feeds) n'est pas sauvegardé : il se reconstruit tout seul.

export const BACKUP_FORMAT = 'appli-supply-chain-backup'
export const BACKUP_VERSION = 1
export const SKIP_TABLES = ['feeds']
const ITEM_TYPES = ['fiche', 'flashcard', 'qcm', 'qa', 'exercice']

// Numéro de ligne et de colonne d'une position dans le texte
function lineCol(text, pos) {
  const before = text.slice(0, pos)
  const lines = before.split('\n')
  return { line: lines.length, col: lines.at(-1).length + 1 }
}

// Vérifie le texte d'une sauvegarde. `schema` = { nomTable: clé primaire } des tables connues de l'appli.
export function validateBackup(text, schema) {
  const errors = []
  const fail = (line, message) => errors.push({ line, message })
  const src = String(text ?? '').replace(/^﻿/, '')
  if (!src.trim()) return { ok: false, errors: [{ line: 1, message: 'le texte est vide' }], data: null }
  let data
  try {
    data = JSON.parse(src)
  } catch (e) {
    // V8 : « at position 123 » ; Safari : message sans position (on indique alors seulement l'erreur)
    const m = /position (\d+)/.exec(e.message)
    const pos = m ? lineCol(src, Number(m[1])) : null
    return { ok: false, errors: [{ line: pos?.line ?? 1, message: `ce n'est pas un fichier de sauvegarde valide (JSON illisible${pos ? `, colonne ${pos.col}` : ''}) : le fichier est peut-être coupé ou modifié` }], data: null }
  }
  if (!data || data.format !== BACKUP_FORMAT) fail(1, `ce fichier n'est pas une sauvegarde de l'appli (il manque "format": "${BACKUP_FORMAT}")`)
  else if (data.version > BACKUP_VERSION) fail(1, `cette sauvegarde vient d'une version plus récente de l'appli (version ${data.version}) : mets l'appli à jour avant de l'importer`)
  if (!data?.tables || typeof data.tables !== 'object') fail(1, 'la sauvegarde ne contient pas de "tables"')
  if (errors.length) return { ok: false, errors, data: null }
  for (const [name, rows] of Object.entries(data.tables)) {
    if (!(name in schema)) {
      fail(1, `table inconnue « ${name} » : cette sauvegarde ne correspond pas à cette version de l'appli`)
      continue
    }
    if (!Array.isArray(rows)) {
      fail(1, `la table « ${name} » n'est pas une liste`)
      continue
    }
    const key = schema[name]
    rows.forEach((row, i) => {
      if (!row || typeof row !== 'object' || row[key] === undefined || row[key] === null) fail(1, `table « ${name} », ligne ${i + 1} : champ « ${key} » manquant`)
    })
    if (name === 'rvLots')
      rows.forEach((lot, i) => {
        if (!Array.isArray(lot.items) || !lot.title || !lot.matiere) fail(1, `table « rvLots », lot ${i + 1} : titre, matière ou contenus manquants`)
        else if (lot.items.some((it) => !it || !ITEM_TYPES.includes(it.type) || !it.id)) fail(1, `table « rvLots », lot « ${lot.title} » : un contenu est invalide`)
      })
  }
  return { ok: errors.length === 0, errors: errors.slice(0, 30), data: errors.length ? null : data }
}

// Fusion d'une ligne de la sauvegarde avec la ligne locale : renvoie la ligne à garder.
export function mergeRow(table, local, incoming) {
  if (!local) return incoming
  if (table === 'activity') return { ...local, xp: Math.max(local.xp ?? 0, incoming.xp ?? 0), celebrated: Boolean(local.celebrated || incoming.celebrated) }
  if (table === 'rvProgress') return (incoming.last ?? '') > (local.last ?? '') ? incoming : local
  if (table === 'rvLots') return (incoming.updatedAt ?? 0) > (local.updatedAt ?? 0) ? incoming : local
  if (table === 'workshop') return (incoming.bestScore ?? 0) > (local.bestScore ?? 0) || (incoming.games ?? 0) > (local.games ?? 0) ? { ...local, ...incoming } : local
  return local // autres tables : on garde ce qui existe déjà
}
