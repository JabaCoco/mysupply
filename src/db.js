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
