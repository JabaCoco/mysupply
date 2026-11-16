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
  const asDate = parseDateText(String(v))
  if (asDate !== null) return asDate // une date écrite "12/03/2026" vaut son numéro de série
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

// ---------- Dates : numéros de série Excel (1 = 01/01/1900) ----------
const DAY_MS = 86_400_000
const serialOf = (y, m, d) => Math.floor(Date.UTC(y, m - 1, d) / DAY_MS) + 25569
const dateOf = (serial) => new Date((Math.floor(serial) - 25569) * DAY_MS)
// "12/03/2026" ou "2026-03-12" → numéro de série ; sinon null
function parseDateText(text) {
  const t = text.trim()
  const fr = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(t)
  if (fr) return serialOf(Number(fr[3]), Number(fr[2]), Number(fr[1]))
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t)
  if (iso) return serialOf(Number(iso[1]), Number(iso[2]), Number(iso[3]))
  return null
}
const pad2 = (n) => String(n).padStart(2, '0')

// Applique un format TEXTE("…") : dates (jj/mm/aaaa) ou nombres (0 ; 0,00 ; 0 % ; # ##0)
function formatWith(value, format) {
  if (/[jJaA]/.test(format) && !/^[#0 ,.%]+$/.test(format)) {
    const d = dateOf(toNumber(value))
    return format
      .replace(/aaaa/gi, String(d.getUTCFullYear()))
      .replace(/jj/gi, pad2(d.getUTCDate()))
      .replace(/mm/gi, pad2(d.getUTCMonth() + 1))
  }
  const percent = format.includes('%')
  const decimals = (format.split(/[,.]/)[1] ?? '').replace(/[^0#]/g, '').length
  const n = toNumber(value) * (percent ? 100 : 1)
  const grouped = format.includes('#') // "# ##0" ou "#,##0" : séparateur de milliers
  const text = n.toLocaleString('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: grouped })
  return percent ? `${text} %` : text
}

function conditionMask(a, from) {
  const pairs = []
  for (let i = from; i < a.length; i += 2) pairs.push([a[i], a[i + 1]])
  return maskFor(pairs)
}

const EXTRA = {
  'SI.CONDITIONS': (a) => {
    if (a.length < 2 || a.length % 2) throw err('#VALEUR!', 'SI.CONDITIONS attend des paires condition ; valeur.')
    for (let i = 0; i < a.length; i += 2) if (toBool(a[i])) return a[i + 1]
    throw err('#N/A', "Aucune condition n'est vraie (ajoute VRAI ; valeur en dernière paire).")
  },
  'MAX.SI.ENS': (a) => {
    if (a.length < 3 || a.length % 2 === 0) throw err('#VALEUR!', 'MAX.SI.ENS attend : plage ; puis des paires plage ; critère.')
    const values = flat(a[0])
    const mask = conditionMask(a, 1)
    const picked = values.filter((v, i) => mask[i] && typeof v === 'number')
    return picked.length ? Math.max(...picked) : 0
  },
  'MIN.SI.ENS': (a) => {
    if (a.length < 3 || a.length % 2 === 0) throw err('#VALEUR!', 'MIN.SI.ENS attend : plage ; puis des paires plage ; critère.')
    const values = flat(a[0])
    const mask = conditionMask(a, 1)
    const picked = values.filter((v, i) => mask[i] && typeof v === 'number')
    return picked.length ? Math.min(...picked) : 0
  },
  'MOYENNE.SI.ENS': (a) => {
    if (a.length < 3 || a.length % 2 === 0) throw err('#VALEUR!', 'MOYENNE.SI.ENS attend : plage ; puis des paires plage ; critère.')
    const values = flat(a[0])
    const mask = conditionMask(a, 1)
    const picked = values.filter((v, i) => mask[i] && typeof v === 'number')
    if (!picked.length) throw err('#DIV/0!', 'Aucune valeur ne correspond aux critères.')
    return picked.reduce((s, v) => s + v, 0) / picked.length
  },
  MEDIANE: (a) => {
    const n = numbersIn(a).sort((x, y) => x - y)
    if (!n.length) throw err('#NOMBRE!', 'Aucune valeur numérique.')
    const m = Math.floor(n.length / 2)
    return n.length % 2 ? n[m] : (n[m - 1] + n[m]) / 2
  },
  PRODUIT: (a) => numbersIn(a).reduce((p, v) => p * v, 1),
  'GRANDE.VALEUR': (a) => {
    argCount('GRANDE.VALEUR', a, 2)
    const n = numbersIn([a[0]]).sort((x, y) => y - x)
    const k = toNumber(a[1])
    if (k < 1 || k > n.length) throw err('#NOMBRE!', `Il n'y a pas de ${k}e valeur.`)
    return n[k - 1]
  },
  'PETITE.VALEUR': (a) => {
    argCount('PETITE.VALEUR', a, 2)
    const n = numbersIn([a[0]]).sort((x, y) => x - y)
    const k = toNumber(a[1])
    if (k < 1 || k > n.length) throw err('#NOMBRE!', `Il n'y a pas de ${k}e valeur.`)
    return n[k - 1]
  },
  RANG: (a) => {
    argCount('RANG', a, 2, 3)
    const v = toNumber(a[0])
    const n = numbersIn([a[1]])
    if (!n.includes(v)) throw err('#N/A', 'La valeur est absente de la plage.')
    const ascending = a[2] !== undefined && a[2] !== null && toNumber(a[2]) !== 0
    return n.filter((x) => (ascending ? x < v : x > v)).length + 1
  },
  CHOISIR: (a) => {
    const i = Math.floor(toNumber(a[0]))
    if (i < 1 || i >= a.length) throw err('#VALEUR!', `CHOISIR : le n° ${i} n'existe pas.`)
    return a[i]
  },
  GAUCHE: (a) => toText(a[0]).slice(0, a[1] === undefined || a[1] === null ? 1 : Math.max(0, toNumber(a[1]))),
  DROITE: (a) => {
    const t = toText(a[0])
    const n = a[1] === undefined || a[1] === null ? 1 : Math.max(0, toNumber(a[1]))
    return n === 0 ? '' : t.slice(-n)
  },
  STXT: (a) => {
    argCount('STXT', a, 3)
    const start = toNumber(a[1])
    if (start < 1) throw err('#VALEUR!', 'La position de départ doit être au moins 1.')
    return toText(a[0]).substr(start - 1, Math.max(0, toNumber(a[2])))
  },
  NBCAR: (a) => toText(a[0]).length,
  CHERCHE: (a) => {
    argCount('CHERCHE', a, 2, 3)
    const from = a[2] === undefined || a[2] === null ? 1 : toNumber(a[2])
    const i = toText(a[1]).toLowerCase().indexOf(toText(a[0]).toLowerCase(), from - 1)
    if (i < 0) throw err('#VALEUR!', `« ${toText(a[0])} » est introuvable.`)
    return i + 1
  },
  TROUVE: (a) => {
    argCount('TROUVE', a, 2, 3)
    const from = a[2] === undefined || a[2] === null ? 1 : toNumber(a[2])
    const i = toText(a[1]).indexOf(toText(a[0]), from - 1)
    if (i < 0) throw err('#VALEUR!', `« ${toText(a[0])} » est introuvable (TROUVE distingue majuscules et minuscules).`)
    return i + 1
  },
  SUBSTITUE: (a) => {
    argCount('SUBSTITUE', a, 3)
    return toText(a[0]).split(toText(a[1])).join(toText(a[2]))
  },
  MINUSCULE: (a) => toText(a[0]).toLowerCase(),
  SUPPRESPACE: (a) => toText(a[0]).trim().replace(/\s+/g, ' '),
  EXACT: (a) => toText(a[0]) === toText(a[1]),
  TEXTE: (a) => {
    argCount('TEXTE', a, 2)
    return formatWith(a[0], toText(a[1]))
  },
  DATE: (a) => {
    argCount('DATE', a, 3)
    return serialOf(toNumber(a[0]), toNumber(a[1]), toNumber(a[2]))
  },
  JOUR: (a) => dateOf(toNumber(a[0])).getUTCDate(),
  MOIS: (a) => dateOf(toNumber(a[0])).getUTCMonth() + 1,
  ANNEE: (a) => dateOf(toNumber(a[0])).getUTCFullYear(),
  JOURSEM: (a) => {
    const day = dateOf(toNumber(a[0])).getUTCDay() // 0 = dimanche
    const type = a[1] === undefined || a[1] === null ? 1 : toNumber(a[1])
    return type === 2 ? ((day + 6) % 7) + 1 : day + 1
  },
  'NB.JOURS.OUVRES': (a) => {
    argCount('NB.JOURS.OUVRES', a, 2)
    const s = Math.floor(toNumber(a[0]))
    const e = Math.floor(toNumber(a[1]))
    const [from, to, sign] = s <= e ? [s, e, 1] : [e, s, -1]
    let count = 0
    for (let d = from; d <= to; d++) {
      const day = dateOf(d).getUTCDay()
      if (day !== 0 && day !== 6) count++
    }
    return sign * count
  },
  'NB.JOURS': (a) => (argCount('NB.JOURS', a, 2), Math.floor(toNumber(a[0])) - Math.floor(toNumber(a[1]))),
  ESTNUM: (a) => typeof (Array.isArray(a[0]) ? a[0].flat(Infinity)[0] : a[0]) === 'number',
  ESTVIDE: (a) => {
    const v = Array.isArray(a[0]) ? a[0].flat(Infinity)[0] : a[0]
    return v === null || v === undefined || v === ''
  },
  PLAFOND: (a) => {
    argCount('PLAFOND', a, 2)
    const m = toNumber(a[1])
    if (m === 0) return 0
    return Math.ceil(toNumber(a[0]) / m - 1e-9) * m
  },
  PLANCHER: (a) => {
    argCount('PLANCHER', a, 2)
    const m = toNumber(a[1])
    if (m === 0) throw err('#DIV/0!', 'Le multiple ne peut pas être 0.')
    return Math.floor(toNumber(a[0]) / m + 1e-9) * m
  },
}
Object.assign(FUNCTIONS, EXTRA)

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
  IFS: 'SI.CONDITIONS', MAXIFS: 'MAX.SI.ENS', MINIFS: 'MIN.SI.ENS', AVERAGEIFS: 'MOYENNE.SI.ENS',
  MEDIAN: 'MEDIANE', PRODUCT: 'PRODUIT', LARGE: 'GRANDE.VALEUR', SMALL: 'PETITE.VALEUR', RANK: 'RANG',
  'RANK.EQ': 'RANG', CHOOSE: 'CHOISIR', LEFT: 'GAUCHE', RIGHT: 'DROITE', MID: 'STXT', LEN: 'NBCAR',
  SEARCH: 'CHERCHE', FIND: 'TROUVE', SUBSTITUTE: 'SUBSTITUE', LOWER: 'MINUSCULE', TRIM: 'SUPPRESPACE',
  TEXT: 'TEXTE', DAY: 'JOUR', MONTH: 'MOIS', YEAR: 'ANNEE', WEEKDAY: 'JOURSEM', NETWORKDAYS: 'NB.JOURS.OUVRES',
  DAYS: 'NB.JOURS', ISNUMBER: 'ESTNUM', ISERROR: 'ESTERREUR', ISBLANK: 'ESTVIDE', CEILING: 'PLAFOND', FLOOR: 'PLANCHER',
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
      if (name === 'ESTERREUR') {
        argCount('ESTERREUR', node.args, 1)
        try {
          return isErr(evaluateNode(node.args[0], sheet))
        } catch (e) {
          if (isErr(e)) return true
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
