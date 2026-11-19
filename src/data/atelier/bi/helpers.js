// Outils pour fabriquer les exercices Power Query / Power BI à données aléatoires.
// Un exercice = { kind: 'choice' | 'number', statement, tables, code, question, choices/answer, steps, conclusion }
import { choiceSet, fmt, int, pick, sample, shuffle } from '../../gen.js'

export { choiceSet, fmt, int, pick, sample, shuffle }

// Question à choix (la bonne réponse est mélangée avec les mauvaises)
export const choice = ({ statement, tables = [], code, question, correct, wrongs, steps, conclusion }) => ({
  kind: 'choice',
  statement,
  tables,
  code,
  question,
  ...choiceSet(correct, wrongs),
  steps,
  conclusion,
})

// Question à réponse numérique (digits = décimales attendues)
export const number = ({ statement, tables = [], code, question, answer, unit = '', digits = 0, steps, conclusion }) => ({
  kind: 'number',
  statement,
  tables,
  code,
  question,
  answer: Number(answer.toFixed(digits)),
  unit,
  digits,
  tolerance: digits ? 0.5 * 10 ** -digits : 0,
  steps,
  conclusion,
})

// Tableau à afficher dans l'énoncé (null → « null », comme dans Power Query)
export const tbl = (cols, rows, title) => ({ title, cols, rows: rows.map((r) => r.map((c) => (c === null || c === undefined ? 'null' : String(c)))) })

// Vérifie une réponse numérique saisie (virgule ou point, espaces et % ignorés)
export function checkBiNumber(input, exercise) {
  const value = Number(String(input).replace(/[\s ]/g, '').replace(',', '.').replace('%', '').replace('€', ''))
  if (!Number.isFinite(value)) return null
  return Math.abs(value - exercise.answer) <= exercise.tolerance + 1e-9
}

export const formatBiAnswer = (ex) => (ex.kind === 'choice' ? ex.choices[ex.answer] : `${fmt(ex.answer, ex.digits)}${ex.unit ? ` ${ex.unit}` : ''}`)

export const SUPPLIERS = ['Nordic Parts', 'Sud Emballages', 'Dupont Logistique', 'Eurofilm', 'Packline']
export const WAREHOUSES = ['Lyon', 'Lille', 'Nantes', 'Marseille']
export const CARRIERS = ['TransEurope', 'Rapido Fret', 'Sud Cargo']

// Livraisons fictives (chaque ligne : une livraison de fournisseur)
export function deliveries(n, { suppliers = sample(SUPPLIERS, 3), warehouses = sample(WAREHOUSES, 3) } = {}) {
  return Array.from({ length: n }, (_, i) => {
    const qteCom = int(20, 200, 10)
    const full = Math.random() < 0.65
    return {
      id: `L${i + 1}`,
      fournisseur: pick(suppliers),
      entrepot: pick(warehouses),
      qteCom,
      qteLiv: full ? qteCom : qteCom - int(10, qteCom - 10, 10),
      retard: Math.random() < 0.55 ? 0 : int(1, 6),
      cout: int(40, 400, 10),
    }
  })
}

export const deliveriesTable = (rows, title = 'Livraisons') =>
  tbl(['N°', 'Fournisseur', 'Entrepôt', 'Qté commandée', 'Qté livrée', 'Retard (j)'], rows.map((r) => [r.id, r.fournisseur, r.entrepot, r.qteCom, r.qteLiv, r.retard]), title)

export const pct = (v, d = 1) => `${fmt(v * 100, d)} %`
