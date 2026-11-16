// Programme des cours.
// Chaque module est dans son propre fichier. Pour ajouter une leçon, copie une leçon
// existante dans le fichier du module et modifie-la.
//
// Une leçon = { id, title, minutes, cards: [...], quiz: [...] }
// Types de cartes :
//   { type: 'text', title, body }                  — texte ; **gras** autorisé, \n\n = nouveau paragraphe
//   { type: 'list', title, items: [[terme, définition], …] }
//   { type: 'formula', title, formula, legend: [[symbole, sens], …], example? }
//   { type: 'example', title, body }               — encadré « Exemple »
//   { type: 'key', points: [...] }                 — encadré « À retenir »
// Question de quiz = { q, choices: [...], answer: index de la bonne réponse (0 = la 1re), explain }

import bases from './bases.js'
import transport from './transport.js'
import stocks from './stocks.js'
import entrepot from './entrepot.js'
import achats from './achats.js'
import prevision from './prevision.js'
import kpi from './kpi.js'
import outils from './outils.js'

export const MODULES = [bases, transport, stocks, entrepot, achats, prevision, kpi, outils]

// Toutes les leçons à la suite, dans l'ordre du programme
export const ALL_LESSONS = MODULES.flatMap((module) =>
  module.lessons.map((lesson) => ({ ...lesson, key: `${module.id}/${lesson.id}`, module })),
)

export function findLesson(moduleId, lessonId) {
  return ALL_LESSONS.find((l) => l.key === `${moduleId}/${lessonId}`) ?? null
}
