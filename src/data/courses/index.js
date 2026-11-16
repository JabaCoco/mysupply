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
// Le quiz est une BANQUE : 5 questions sont tirées au hasard à chaque passage. Une entrée peut aussi être
// une fonction () => question, pour des chiffres aléatoires (voir numQuestion dans src/data/gen.js).
//
// Modules existants enrichis : src/data/courses/ajouts/<module>.js = { lessons: [leçons ajoutées], more: { idLeçon: [questions ajoutées] } }

import bases from './bases.js'
import transport from './transport.js'
import stocks from './stocks.js'
import entrepot from './entrepot.js'
import achats from './achats.js'
import prevision from './prevision.js'
import production from './production.js'
import kpi from './kpi.js'
import outils from './outils.js'
import basesPlus from './ajouts/bases.js'
import transportPlus from './ajouts/transport.js'
import stocksPlus from './ajouts/stocks.js'
import entrepotPlus from './ajouts/entrepot.js'
import achatsPlus from './ajouts/achats.js'
import previsionPlus from './ajouts/prevision.js'

// Ajoute à un module ses leçons et ses questions supplémentaires
function withExtras(module, extra) {
  if (!extra) return module
  return {
    ...module,
    lessons: [
      ...module.lessons.map((lesson) => ({ ...lesson, quiz: [...lesson.quiz, ...(extra.more?.[lesson.id] ?? [])] })),
      ...(extra.lessons ?? []),
    ],
  }
}

export const MODULES = [
  withExtras(bases, basesPlus),
  withExtras(transport, transportPlus),
  withExtras(stocks, stocksPlus),
  withExtras(entrepot, entrepotPlus),
  withExtras(achats, achatsPlus),
  withExtras(prevision, previsionPlus),
  withExtras(production),
  withExtras(kpi),
  withExtras(outils),
]

// Toutes les leçons à la suite, dans l'ordre du programme
export const ALL_LESSONS = MODULES.flatMap((module) =>
  module.lessons.map((lesson) => ({ ...lesson, key: `${module.id}/${lesson.id}`, module })),
)

export function findLesson(moduleId, lessonId) {
  return ALL_LESSONS.find((l) => l.key === `${moduleId}/${lessonId}`) ?? null
}
