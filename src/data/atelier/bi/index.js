// Module « Power Query et Power BI » de l'Atelier : registre des leçons, scénarios, tableaux de bord et questions.
import { sample } from '../../gen.js'
import { PQ_LESSONS } from './lessonsPq.js'
import { BI_LESSONS } from './lessonsBi.js'
import { PQ_SCENARIOS } from './pqScenarios.js'
import { DASHBOARDS } from './dashboards.js'
import { INTERVIEW } from './interview.js'

export { PQ_LESSONS, BI_LESSONS, PQ_SCENARIOS, DASHBOARDS, INTERVIEW }

export const BI_ALL_LESSONS = [...PQ_LESSONS, ...BI_LESSONS]
export const findBiLesson = (id) => BI_ALL_LESSONS.find((l) => l.id === id)
export const BI_SERIES_SIZE = 4 // exercices par série (tirés au hasard dans la banque de la leçon)
export const BI_DAILY_TARGET = 3 // exercices à réussir pour valider une leçon comme défi du jour

// Une série d'exercices neufs (nouvelles données à chaque appel)
export const generateBiExercises = (lessonId) => sample(findBiLesson(lessonId).exercises, BI_SERIES_SIZE).map((make) => make())

// Éléments pouvant devenir « défi du jour » : leçons, scénarios du simulateur, tableaux de bord
export const BI_DAILY_ITEMS = [
  ...BI_ALL_LESSONS.map((l) => ({ id: l.id, kind: 'lesson' })),
  ...PQ_SCENARIOS.map((s) => ({ id: s.id, kind: 'sim' })),
  ...DASHBOARDS.map((d) => ({ id: d.id, kind: 'dash' })),
]
export const biKind = (id) => BI_DAILY_ITEMS.find((i) => i.id === id)?.kind
export const isBiLesson = (id) => biKind(id) === 'lesson'

// Texte et lien d'un élément (pour le défi du jour)
export function describeBiItem(id) {
  const kind = biKind(id)
  if (kind === 'lesson') {
    const l = findBiLesson(id)
    return { kind, title: l.title, label: l.track === 'pq' ? 'Power Query' : 'Power BI', to: `/atelier/bi/cours/${id}?onglet=exercices` }
  }
  if (kind === 'sim') {
    const s = PQ_SCENARIOS.find((x) => x.id === id)
    return { kind, title: s.title, label: 'Simulateur Power Query', to: `/atelier/bi/simulateur/${id}` }
  }
  const d = DASHBOARDS.find((x) => x.id === id)
  return { kind, title: d.title, label: 'Tableau de bord Power BI', to: `/atelier/bi/tableau/${id}` }
}

// Nombre d'éléments déjà faits (pour la tuile de l'Atelier)
export const biDoneCount = (workshop) => BI_DAILY_ITEMS.filter((i) => workshop.has(`bi/${i.id}`)).length
