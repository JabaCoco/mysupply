// Défi du jour de l'Atelier.
// - Le type tourne : Excel → calculateur → étude de cas → simulateur → Excel…
// - Tant que le défi n'est pas terminé, il reste le même (même plusieurs jours).
// - Une fois terminé, il reste affiché "réussi" le jour même, et le lendemain on passe au suivant.
import { useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db.js'
import { dayKey } from './dates.js'
import { EXCEL_CHALLENGES } from '../data/atelier/excel.js'
import { CASES } from '../data/atelier/cases.js'
import { FORMULA_LIST } from '../data/atelier/formulas.js'
import { ALL_EN_LESSONS } from '../data/anglais/units.js'

const TYPES = ['excel', 'calcul', 'cas', 'simulateur', 'anglais']
export const DAILY_CALC_TARGET = 3 // exercices à réussir pour un défi "calculateur"

const ITEMS = {
  excel: EXCEL_CHALLENGES.map((c) => c.id),
  calcul: FORMULA_LIST.map((f) => f.id),
  cas: CASES.map((c) => c.id),
  simulateur: ['simulateur'],
  anglais: ALL_EN_LESSONS.map((l) => l.key),
}
const DONE_KEY = {
  excel: (id) => `excel/${id}`,
  calcul: (id) => `calc/${id}`,
  cas: (id) => `cas/${id}`,
  simulateur: () => 'simulateur',
  anglais: (id) => `lesson/${id}`,
}

// Choisit l'élément : le premier jamais fait, sinon on tourne dans la liste
function pickItem(type, n, done) {
  const items = ITEMS[type]
  return items.find((id) => !done.has(DONE_KEY[type](id))) ?? items[Math.floor(n / TYPES.length) % items.length]
}

// Attribue un nouveau défi si besoin (aucun défi, ou défi terminé un jour précédent)
export async function ensureDaily() {
  await db.transaction('rw', db.meta, db.workshop, db.english, async () => {
    const today = dayKey(new Date())
    const current = (await db.meta.get('daily'))?.value
    if (current && (!current.completedDay || current.completedDay === today)) return
    const n = current ? current.n + 1 : 0
    const type = TYPES[n % TYPES.length]
    const done = new Set([...(await db.workshop.toCollection().primaryKeys()), ...(await db.english.toCollection().primaryKeys())])
    await db.meta.put({
      key: 'daily',
      value: { n, type, id: pickItem(type, n, done), assignedDay: today, completedDay: null, progress: 0 },
    })
  })
}

// À appeler quand une activité est terminée : valide le défi du jour s'il correspond
export async function reportDaily(type, id) {
  await db.transaction('rw', db.meta, async () => {
    const current = (await db.meta.get('daily'))?.value
    if (!current || current.completedDay || current.type !== type || current.id !== id) return
    const progress = current.progress + 1
    const finished = type !== 'calcul' || progress >= DAILY_CALC_TARGET
    await db.meta.put({ key: 'daily', value: { ...current, progress, completedDay: finished ? dayKey(new Date()) : null } })
  })
}

// Textes et lien à afficher pour un défi
export function describeDaily(daily) {
  const done = Boolean(daily.completedDay)
  switch (daily.type) {
    case 'excel': {
      const c = EXCEL_CHALLENGES.find((x) => x.id === daily.id)
      return { label: 'Défi Excel', title: `=${c.fn}`, subtitle: c.title, to: `/atelier/excel/${c.id}`, done, icon: 'excel' }
    }
    case 'calcul': {
      const f = FORMULA_LIST.find((x) => x.id === daily.id)
      return {
        label: 'Exercices de calcul',
        title: f.title,
        subtitle: done ? `${DAILY_CALC_TARGET} exercices réussis` : `Réussis ${DAILY_CALC_TARGET} exercices (${daily.progress}/${DAILY_CALC_TARGET})`,
        to: `/atelier/calculs/${f.id}?onglet=exercices`,
        done,
        icon: 'calcul',
      }
    }
    case 'cas': {
      const c = CASES.find((x) => x.id === daily.id)
      return { label: 'Étude de cas', title: c.title, subtitle: 'Prends les bonnes décisions', to: `/atelier/cas/${c.id}`, done, icon: 'cas' }
    }
    case 'anglais': {
      const l = ALL_EN_LESSONS.find((x) => x.key === daily.id)
      return { label: 'Anglais', title: l.title, subtitle: `Termine la leçon · ${l.unit.title}`, to: `/anglais/${l.key}`, done, icon: 'anglais' }
    }
    default:
      return { label: 'Simulateur', title: 'Gère ton stock 12 semaines', subtitle: 'Termine une partie', to: '/atelier/simulateur', done, icon: 'simulateur' }
  }
}

// Hook React : le défi du jour (attribué automatiquement si besoin)
export function useDailyChallenge() {
  const daily = useLiveQuery(async () => (await db.meta.get('daily'))?.value ?? null, [])
  const stale = daily === null || (daily?.completedDay && daily.completedDay !== dayKey(new Date()))
  useEffect(() => {
    if (stale) ensureDaily()
  }, [stale])
  return daily && !stale ? { ...daily, ...describeDaily(daily) } : null
}
