import Dexie from 'dexie'

// Base de données stockée dans le navigateur (IndexedDB), fonctionne hors ligne.
export const db = new Dexie('appli-supply-chain')

db.version(1).stores({
  // Une ligne par jour : { date: '2026-11-15', xp: 30, celebrated: false }
  activity: 'date',
  // Dernière copie de chaque flux RSS, pour l'affichage hors ligne
  feeds: 'id',
  // Petits réglages divers : { key, value }
  meta: 'key',
})

// Version 2 : on retient les vidéos déjà regardées
db.version(2).stores({
  seen: 'id', // { id: 'yt:abc123', at: 1731700000000 }
})

// Version 3 : progression dans les cours
db.version(3).stores({
  // { id: 'transport/incoterms', bestScore: 3, total: 4, completedAt: 1731700000000 }
  lessons: 'id',
})

// Version 4 : progression dans l'Atelier
db.version(4).stores({
  // { id: 'excel/somme' | 'cas/ruptures' | 'simulateur', … }
  workshop: 'id',
})

// Version 5 : anglais
db.version(5).stores({
  // { id: 'lesson/bases/acteurs', bestScore, total } ou { id: 'word/supplier', status: 'known' | 'review' | 'seen' }
  english: 'id',
})

// Version 6 : onglet Révisions
db.version(6).stores({
  // Un lot importé : { id, title, matiere, cours, createdAt, updatedAt, items: [...] }
  rvLots: 'id, matiere, cours',
  // Progression d'une carte : { id: 'lot|contenu|f', lotId, itemId, dir, box, due, reps, lapses, last, xpDay }
  rvProgress: 'id, lotId, due',
})

// Version 7 : badges et favoris (données simples, faciles à sauvegarder, fusionner et synchroniser)
db.version(7).stores({
  // Un badge gagné : { id: 'serie-7', at: 1731700000000 } (at = date d'obtention ; à la fusion on garde la plus ancienne)
  badges: 'id',
  // Un favori : { id: 'video:yt:abc', type, title, sub, to | url, thumb, text, data, at, updatedAt, on }
  // `on: false` = favori retiré (on garde la ligne pour que le retrait se propage aussi à la fusion / synchronisation)
  favorites: 'id, type',
})
