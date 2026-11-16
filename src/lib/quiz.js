import { shuffle } from '../data/gen.js'

export const QUIZ_SIZE = 5 // questions posées à chaque passage d'une leçon

// Tire les questions du quiz dans la banque de la leçon.
// Une entrée de la banque peut être une question, ou une fonction qui fabrique une question
// (chiffres aléatoires) : on refait donc la leçon sans connaître les réponses.
export function drawQuiz(bank, size = QUIZ_SIZE) {
  return shuffle(bank)
    .slice(0, size)
    .map((entry) => (typeof entry === 'function' ? entry() : entry))
}
