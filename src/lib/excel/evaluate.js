// Calcul d'une formule Excel (version française) sur une petite feuille.
import { parseFormula, FormulaSyntaxError, columnName } from './parser.js'

// Erreurs Excel : #N/A, #VALEUR!, #DIV/0!, #NOM?, #NOMBRE!, #REF!
export class XlError {
  constructor(code, message) {
    this.code = code
    this.message = message
  }
}
const err = (code, message) => new XlError(code, message)
const isErr = (v) => v instanceof XlError

// ---------- Conversions ----------
const flat = (v) => (Array.isArray(v) ? v.flat(Infinity) : [v])

function toNumber(v) {
  if (isErr(v)) throw v
  if (Array.isArray(v)) return toNumber(v.flat(Infinity)[0])
  if (v === null || v === undefined || v === '') return 0
  if (typeof v === 'boolean') return v ? 1 : 0
  if (typeof v === 'number') return v
  const n = Number(String(v).replace(',', '.'))
  if (Number.isNaN(n)) throw err('#VALEUR!', `« ${v} » n'est pas un nombre.`)
  return n
}

function toText(v) {
  if (isErr(v)) throw v
  if (Array.isArray(v)) return toText(v.flat(Infinity)[0])
  if (v === null || v === undefined) return ''
  if (typeof v === 'boolean') return v ? 'VRAI' : 'FAUX'
  if (typeof v === 'number') return String(v).replace('.', ',')
  return String(v)
}

function toBool(v) {
  if (isErr(v)) throw v
  if (Array.isArray(v)) return toBool(v.flat(Infinity)[0])
  if (typeof v === 'boolean') return v
  if (typeof v === 'number') return v !== 0
  if (v === null || v === undefined || v === '') return false
  const t = String(v).toUpperCase()
  if (t === 'VRAI' || t === 'TRUE') return true
  if (t === 'FAUX' || t === 'FALSE') return false
  throw err('#VALEUR!', `« ${v} » n'est ni VRAI ni FAUX.`)
}

const numbersIn = (args) => args.flatMap(flat).filter((v) => typeof v === 'number')

function same(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) < 1e-9
  return toText(a).toLowerCase() === toText(b).toLowerCase()
}

function compare(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  if (typeof a === 'number') return -1 // dans Excel, les nombres sont "plus petits" que les textes
  if (typeof b === 'number') return 1
  return toText(a).localeCompare(toText(b), 'fr', { sensitivity: 'base' })
}

// Critère des fonctions *.SI : 5, "Lyon", ">100", "<>Retard", "P-*"
function matcher(criterion) {
  const text = toText(criterion)
  const m = /^(<>|<=|>=|<|>|=)?(.*)$/s.exec(typeof criterion === 'number' ? '' : text)
  const op = typeof criterion === 'number' ? '=' : m[1] || '='
  const raw = typeof criterion === 'number' ? criterion : m[2]
  const num = typeof raw === 'number' ? raw : raw !== '' && !Number.isNaN(Number(raw.replace(',', '.'))) ? Number(raw.replace(',', '.')) : null
  const wildcard =
    typeof raw === 'string' && /[*?]/.test(raw)
      ? new RegExp(`^${raw.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.')}$`, 'i')
      : null
  return (value) => {
    if (num !== null && typeof value === 'number') {
      const d = value - num
      return { '=': d === 0, '<>': d !== 0, '<': d < 0, '>': d > 0, '<=': d <= 0, '>=': d >= 0 }[op]
    }
    if (num !== null && op !== '=' && op !== '<>') return false
    const t = toText(value).toLowerCase()
    const r = String(raw).toLowerCase()
    const equal = wildcard ? wildcard.test(toText(value)) : t === r
    if (op === '=') return equal
    if (op === '<>') return !equal
    const c = t.localeCompare(r, 'fr', { sensitivity: 'base' })
    return { '<': c < 0, '>': c > 0, '<=': c <= 0, '>=': c >= 0 }[op]
  }
}

function argCount(name, args, min, max = min) {
  if (args.length < min || args.length > max) {
    const expected = min === max ? `${min}` : max === Infinity ? `au moins ${min}` : `${min} à ${max}`
    throw err('#VALEUR!', `${name} attend ${expected} argument(s), tu en as donné ${args.length}.`)
  }
}

// Somme/compte "conditionnels" à plusieurs critères (*.SI.ENS)
function maskFor(pairs) {
  const ranges = pairs.map(([range]) => flat(range))
  const size = ranges[0].length
  if (ranges.some((r) => r.length !== size)) throw err('#VALEUR!', 'Les plages doivent avoir la même taille.')
  const tests = pairs.map(([, criterion]) => matcher(criterion))
  return Array.from({ length: size }, (_, i) => tests.every((test, k) => test(ranges[k][i])))
}

function round(value, digits, mode) {
  const factor = 10 ** digits
  const x = value * factor
  const r = mode === 'up' ? Math.sign(x) * Math.ceil(Math.abs(x) - 1e-9) : mode === 'down' ? Math.trunc(x) : Math.sign(x) * Math.round(Math.abs(x))
  return r / factor
}

function stdev(values, sample) {
  const n = values.length
  if (n < (sample ? 2 : 1)) throw err('#DIV/0!', 'Pas assez de valeurs.')
  const mean = values.reduce((a, b) => a + b, 0) / n
  const sq = values.reduce((a, b) => a + (b - mean) ** 2, 0)
  return Math.sqrt(sq / (sample ? n - 1 : n))
}

// ---------- Fonctions ----------
// Chaque fonction reçoit ses arguments déjà calculés (plages = tableaux 2D).
const FUNCTIONS = {
  SOMME: (a) => numbersIn(a).reduce((s, v) => s + v, 0),
  MOYENNE: (a) => {
    const n = numbersIn(a)
    if (!n.length) throw err('#DIV/0!', 'Aucune valeur numérique.')
    return n.reduce((s, v) => s + v, 0) / n.length
  },
  MIN: (a) => (numbersIn(a).length ? Math.min(...numbersIn(a)) : 0),
  MAX: (a) => (numbersIn(a).length ? Math.max(...numbersIn(a)) : 0),
  NB: (a) => numbersIn(a).length,
  NBVAL: (a) => a.flatMap(flat).filter((v) => v !== null && v !== undefined && v !== '').length,
  'NB.VIDE': (a) => a.flatMap(flat).filter((v) => v === null || v === undefined || v === '').length,
  'NB.SI': (a) => {
    argCount('NB.SI', a, 2)
    const test = matcher(a[1])
    return flat(a[0]).filter(test).length
  },
  'NB.SI.ENS': (a) => {
    if (a.length < 2 || a.length % 2) throw err('#VALEUR!', 'NB.SI.ENS attend des paires plage ; critère.')
    const pairs = []
    for (let i = 0; i < a.length; i += 2) pairs.push([a[i], a[i + 1]])
    return maskFor(pairs).filter(Boolean).length
  },
  'SOMME.SI': (a) => {
    argCount('SOMME.SI', a, 2, 3)
    const crit = flat(a[0])
    const values = flat(a[2] ?? a[0])
    const test = matcher(a[1])
    return crit.reduce((s, v, i) => (test(v) && typeof values[i] === 'number' ? s + values[i] : s), 0)
  },
  'SOMME.SI.ENS': (a) => {
    if (a.length < 3 || a.length % 2 === 0) throw err('#VALEUR!', 'SOMME.SI.ENS attend : plage à additionner ; puis des paires plage ; critère.')
    const values = flat(a[0])
    const pairs = []
    for (let i = 1; i < a.length; i += 2) pairs.push([a[i], a[i + 1]])
    const mask = maskFor(pairs)
    if (mask.length !== values.length) throw err('#VALEUR!', 'Les plages doivent avoir la même taille.')
    return values.reduce((s, v, i) => (mask[i] && typeof v === 'number' ? s + v : s), 0)
  },
  'MOYENNE.SI': (a) => {
    argCount('MOYENNE.SI', a, 2, 3)
    const crit = flat(a[0])
    const values = flat(a[2] ?? a[0])
    const test = matcher(a[1])
    const picked = crit.map((v, i) => (test(v) ? values[i] : null)).filter((v) => typeof v === 'number')
    if (!picked.length) throw err('#DIV/0!', 'Aucune valeur ne correspond au critère.')
    return picked.reduce((s, v) => s + v, 0) / picked.length
  },
  SOMMEPROD: (a) => {
    const arrays = a.map(flat)
    const size = arrays[0].length
    if (arrays.some((r) => r.length !== size)) throw err('#VALEUR!', 'Les plages doivent avoir la même taille.')
    let total = 0
    for (let i = 0; i < size; i++) total += arrays.reduce((p, arr) => p * (typeof arr[i] === 'number' ? arr[i] : 0), 1)
    return total
  },
  SI: (a) => {
    argCount('SI', a, 2, 3)
    return toBool(a[0]) ? a[1] : a.length > 2 ? a[2] : false
  },
  ET: (a) => a.flatMap(flat).every(toBool),
  OU: (a) => a.flatMap(flat).some(toBool),
  NON: (a) => !toBool(a[0]),
  SIERREUR: () => {
    throw new Error('géré à part')
  },
  'RECHERCHEV': (a) => {
    argCount('RECHERCHEV', a, 3, 4)
    const [value, table, colArg, approxArg] = a
    if (!Array.isArray(table)) throw err('#VALEUR!', 'Le 2e argument doit être une plage.')
    const col = toNumber(colArg)
    if (col < 1 || col > table[0].length) throw err('#REF!', `La colonne ${col} n'existe pas dans la plage.`)
    const approx = approxArg === undefined || approxArg === null ? true : toBool(approxArg)
    let rowIndex = -1
    if (approx) {
      table.forEach((row, i) => {
        if (compare(row[0], value) <= 0) rowIndex = i
      })
    } else rowIndex = table.findIndex((row) => same(row[0], value))
    if (rowIndex < 0) throw err('#N/A', `« ${toText(value)} » est introuvable dans la 1re colonne.`)
    return table[rowIndex][col - 1]
  },
  RECHERCHEX: (a) => {
    argCount('RECHERCHEX', a, 3, 6)
    const [value, lookup, result, notFound] = a
    const keys = flat(lookup)
    const values = Array.isArray(result) && result.length === keys.length ? result.map((r) => (r.length === 1 ? r[0] : r)) : flat(result)
    if (values.length !== keys.length) throw err('#VALEUR!', 'La plage de recherche et la plage de résultat doivent avoir la même taille.')
    const i = keys.findIndex((k) => same(k, value))
    if (i < 0) {
      if (notFound !== undefined && notFound !== null) return notFound
      throw err('#N/A', `« ${toText(value)} » est introuvable.`)
    }
    return values[i]
  },
  EQUIV: (a) => {
    argCount('EQUIV', a, 2, 3)
    const keys = flat(a[1])
    const type = a[2] === undefined || a[2] === null ? 1 : toNumber(a[2])
    let index = -1
    if (type === 0) index = keys.findIndex((k) => same(k, a[0]))
    else if (type === 1) keys.forEach((k, i) => compare(k, a[0]) <= 0 && (index = i))
    else keys.forEach((k, i) => compare(k, a[0]) >= 0 && (index = i))
    if (index < 0) throw err('#N/A', `« ${toText(a[0])} » est introuvable.`)
    return index + 1
  },
  INDEX: (a) => {
    argCount('INDEX', a, 2, 3)
    const table = Array.isArray(a[0]) ? a[0] : [[a[0]]]
    let row = toNumber(a[1])
    let col = a.length > 2 ? toNumber(a[2]) : 1
    // Plage sur une seule ligne : INDEX(A1:E1; 3) vise la 3e colonne
    if (a.length === 2 && table.length === 1) [row, col] = [1, row]
    if (row < 1 || row > table.length || col < 1 || col > table[0].length) throw err('#REF!', 'Position en dehors de la plage.')
    return table[row - 1][col - 1]
  },
  ARRONDI: (a) => (argCount('ARRONDI', a, 2), round(toNumber(a[0]), toNumber(a[1]))),
  'ARRONDI.SUP': (a) => (argCount('ARRONDI.SUP', a, 2), round(toNumber(a[0]), toNumber(a[1]), 'up')),
  'ARRONDI.INF': (a) => (argCount('ARRONDI.INF', a, 2), round(toNumber(a[0]), toNumber(a[1]), 'down')),
  ENT: (a) => Math.floor(toNumber(a[0])),
  ABS: (a) => Math.abs(toNumber(a[0])),
  RACINE: (a) => {
    const v = toNumber(a[0])
    if (v < 0) throw err('#NOMBRE!', "Impossible de calculer la racine d'un nombre négatif.")
    return Math.sqrt(v)
  },
  PUISSANCE: (a) => toNumber(a[0]) ** toNumber(a[1]),
  MOD: (a) => {
    const d = toNumber(a[1])
    if (d === 0) throw err('#DIV/0!', 'Division par zéro.')
    const n = toNumber(a[0])
    return n - d * Math.floor(n / d)
  },
  'ECARTYPE.STANDARD': (a) => stdev(numbersIn(a), true),
  'ECARTYPE.PEARSON': (a) => stdev(numbersIn(a), false),
  CONCAT: (a) => a.flatMap(flat).map(toText).join(''),
  MAJUSCULE: (a) => toText(a[0]).toUpperCase(),
}

// Autres noms acceptés (anciens noms français et noms anglais)
const ALIASES = {
  ECARTYPE: 'ECARTYPE.STANDARD', 'ECARTYPE.S': 'ECARTYPE.STANDARD', ECARTYPEP: 'ECARTYPE.PEARSON',
  CONCATENER: 'CONCAT', SUM: 'SOMME', AVERAGE: 'MOYENNE', COUNT: 'NB', COUNTA: 'NBVAL',
  COUNTIF: 'NB.SI', COUNTIFS: 'NB.SI.ENS', SUMIF: 'SOMME.SI', SUMIFS: 'SOMME.SI.ENS',
  AVERAGEIF: 'MOYENNE.SI', SUMPRODUCT: 'SOMMEPROD', IF: 'SI', AND: 'ET', OR: 'OU', NOT: 'NON',
  IFERROR: 'SIERREUR', VLOOKUP: 'RECHERCHEV', XLOOKUP: 'RECHERCHEX', MATCH: 'EQUIV',
  ROUND: 'ARRONDI', ROUNDUP: 'ARRONDI.SUP', ROUNDDOWN: 'ARRONDI.INF', INT: 'ENT', SQRT: 'RACINE',
  POWER: 'PUISSANCE', 'STDEV.S': 'ECARTYPE.STANDARD', STDEV: 'ECARTYPE.STANDARD', 'STDEV.P': 'ECARTYPE.PEARSON',
  UPPER: 'MAJUSCULE',
}
export const canonicalName = (name) => ALIASES[name] ?? name
export const KNOWN_FUNCTIONS = Object.keys(FUNCTIONS)

// ---------- Évaluation ----------
function evaluateNode(node, sheet) {
  switch (node.type) {
    case 'num':
    case 'str':
    case 'bool':
      return node.value
    case 'empty':
      return null
    case 'ref': {
      const v = sheet.get(node.address)
      return v === undefined ? null : v
    }
    case 'range': {
      const r1 = Math.min(node.start.row, node.end.row)
      const r2 = Math.max(node.start.row, node.end.row)
      const c1 = Math.min(node.start.col, node.end.col)
      const c2 = Math.max(node.start.col, node.end.col)
      const rows = []
      for (let r = r1; r <= r2; r++) {
        const row = []
        for (let c = c1; c <= c2; c++) row.push(sheet.get({ row: r, col: c }) ?? null)
        rows.push(row)
      }
      return rows
    }
    case 'neg':
      return -toNumber(evaluateNode(node.value, sheet))
    case 'binop': {
      const left = evaluateNode(node.left, sheet)
      const right = evaluateNode(node.right, sheet)
      const l = Array.isArray(left) ? left.flat(Infinity)[0] : left
      const r = Array.isArray(right) ? right.flat(Infinity)[0] : right
      switch (node.op) {
        case '+': return toNumber(l) + toNumber(r)
        case '-': return toNumber(l) - toNumber(r)
        case '*': return toNumber(l) * toNumber(r)
        case '/': {
          const d = toNumber(r)
          if (d === 0) throw err('#DIV/0!', 'Division par zéro.')
          return toNumber(l) / d
        }
        case '^': return toNumber(l) ** toNumber(r)
        case '&': return toText(l) + toText(r)
        case '=': return same(l ?? '', r ?? '')
        case '<>': return !same(l ?? '', r ?? '')
        case '<': return compare(l ?? 0, r ?? 0) < 0
        case '>': return compare(l ?? 0, r ?? 0) > 0
        case '<=': return compare(l ?? 0, r ?? 0) <= 0
        case '>=': return compare(l ?? 0, r ?? 0) >= 0
        default: throw err('#VALEUR!', `Opérateur inconnu ${node.op}`)
      }
    }
    case 'func': {
      const name = canonicalName(node.name)
      if (name === 'SIERREUR') {
        argCount('SIERREUR', node.args, 2)
        try {
          const v = evaluateNode(node.args[0], sheet)
          if (isErr(v)) return evaluateNode(node.args[1], sheet)
          return v
        } catch (e) {
          if (isErr(e)) return evaluateNode(node.args[1], sheet)
          throw e
        }
      }
      const fn = FUNCTIONS[name]
      if (!fn) throw err('#NOM?', `La fonction ${node.name} n'existe pas (ou n'est pas encore gérée par l'appli).`)
      const args = node.args.map((a) => evaluateNode(a, sheet))
      const errorArg = args.find(isErr)
      if (errorArg) throw errorArg
      return fn(args)
    }
    default:
      throw err('#VALEUR!', 'Formule invalide.')
  }
}

// Point d'entrée. `cells` = { A1: 'Référence', B2: 12.5, … }
// Renvoie { value } ou { error: { code, message } }
export function evaluateFormula(formula, cells) {
  const sheet = { get: ({ row, col }) => cells[`${columnName(col)}${row}`] }
  try {
    let value = evaluateNode(parseFormula(formula), sheet)
    if (Array.isArray(value)) value = value.flat(Infinity)[0] ?? null
    if (isErr(value)) return { error: { code: value.code, message: value.message } }
    if (typeof value === 'number' && !Number.isFinite(value)) return { error: { code: '#NOMBRE!', message: 'Résultat impossible.' } }
    return { value }
  } catch (e) {
    if (isErr(e)) return { error: { code: e.code, message: e.message } }
    if (e instanceof FormulaSyntaxError) return { error: { code: 'Syntaxe', message: e.message } }
    throw e
  }
}

// Même valeur ? (nombres à 0,001 près, textes sans tenir compte des majuscules)
export function sameResult(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) <= 1e-3 * Math.max(1, Math.abs(b))
  return toText(a).trim().toLowerCase() === toText(b).trim().toLowerCase()
}

// Affichage d'une valeur "à la française"
export function formatValue(v) {
  if (v === null || v === undefined) return ''
  if (typeof v === 'boolean') return v ? 'VRAI' : 'FAUX'
  if (typeof v === 'number') return v.toLocaleString('fr-FR', { maximumFractionDigits: 4 })
  return String(v)
}
