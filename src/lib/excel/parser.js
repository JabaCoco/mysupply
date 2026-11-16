// Lecture d'une formule Excel (version française) → arbre de calcul.
// Gère : nombres (1,5 ou 1.5), textes "…", VRAI/FAUX, cellules (A1, $B$2), plages (A1:C8),
// fonctions (SOMME(…)), opérateurs + - * / ^ & = <> < > <= >= et parenthèses.
// Séparateur d'arguments : ; (comme dans Excel en français). La virgule est aussi acceptée.

export class FormulaSyntaxError extends Error {}

const TOKEN_RULES = [
  ['space', /^\s+/],
  ['string', /^"(?:[^"]|"")*"/],
  ['number', /^\d+(?:[.,]\d+)?(?:[eE][+-]?\d+)?%?/],
  ['ref', /^\$?[A-Za-z]{1,3}\$?\d+(?![\w.(])/],
  ['name', /^[A-Za-zÀ-ÿ_][A-Za-zÀ-ÿ0-9_.]*/],
  ['op', /^(?:<>|<=|>=|[-+*/^&=<>%])/],
  ['paren', /^[()]/],
  ['sep', /^[;,]/],
  ['colon', /^:/],
]

function tokenize(text) {
  const tokens = []
  let rest = text
  while (rest.length) {
    const rule = TOKEN_RULES.find(([, regex]) => regex.test(rest))
    if (!rule) throw new FormulaSyntaxError(`Caractère inattendu : « ${rest[0]} »`)
    const [type, regex] = rule
    const value = rest.match(regex)[0]
    rest = rest.slice(value.length)
    if (type !== 'space') tokens.push({ type, value })
  }
  return tokens
}

// Convertit "$B$12" en { col: 2, row: 12 }
export function parseAddress(text) {
  const match = /^\$?([A-Za-z]{1,3})\$?(\d+)$/.exec(text)
  if (!match) return null
  const col = [...match[1].toUpperCase()].reduce((n, c) => n * 26 + c.charCodeAt(0) - 64, 0)
  return { col, row: Number(match[2]) }
}

export function columnName(col) {
  let name = ''
  while (col > 0) {
    const r = (col - 1) % 26
    name = String.fromCharCode(65 + r) + name
    col = Math.floor((col - 1) / 26)
  }
  return name
}

// Analyse descendante classique, par ordre de priorité des opérateurs
export function parseFormula(input) {
  const text = input.trim().replace(/^=/, '')
  if (!text) throw new FormulaSyntaxError('La formule est vide.')
  const tokens = tokenize(text)
  let pos = 0
  const peek = () => tokens[pos]
  const next = () => tokens[pos++]
  const isOp = (...ops) => peek()?.type === 'op' && ops.includes(peek().value)

  function expect(type, value) {
    const token = next()
    if (!token || token.type !== type || (value && token.value !== value)) {
      throw new FormulaSyntaxError(value === ')' ? 'Il manque une parenthèse fermante « ) ».' : 'Formule incomplète.')
    }
    return token
  }

  function comparison() {
    let node = concat()
    while (isOp('=', '<>', '<', '>', '<=', '>=')) {
      const op = next().value
      node = { type: 'binop', op, left: node, right: concat() }
    }
    return node
  }
  function concat() {
    let node = additive()
    while (isOp('&')) {
      next()
      node = { type: 'binop', op: '&', left: node, right: additive() }
    }
    return node
  }
  function additive() {
    let node = multiplicative()
    while (isOp('+', '-')) {
      const op = next().value
      node = { type: 'binop', op, left: node, right: multiplicative() }
    }
    return node
  }
  function multiplicative() {
    let node = power()
    while (isOp('*', '/')) {
      const op = next().value
      node = { type: 'binop', op, left: node, right: power() }
    }
    return node
  }
  function power() {
    let node = unary()
    while (isOp('^')) {
      next()
      node = { type: 'binop', op: '^', left: node, right: unary() }
    }
    return node
  }
  function unary() {
    if (isOp('-')) {
      next()
      return { type: 'neg', value: unary() }
    }
    if (isOp('+')) {
      next()
      return unary()
    }
    return primary()
  }
  function primary() {
    const token = next()
    if (!token) throw new FormulaSyntaxError('Formule incomplète.')
    switch (token.type) {
      case 'number': {
        const percent = token.value.endsWith('%')
        const value = Number(token.value.replace('%', '').replace(',', '.'))
        return { type: 'num', value: percent ? value / 100 : value }
      }
      case 'string':
        return { type: 'str', value: token.value.slice(1, -1).replace(/""/g, '"') }
      case 'ref': {
        const start = parseAddress(token.value)
        if (peek()?.type === 'colon') {
          next()
          const endToken = expect('ref')
          return { type: 'range', start, end: parseAddress(endToken.value) }
        }
        return { type: 'ref', address: start }
      }
      case 'name': {
        const name = token.value.toUpperCase()
        if (peek()?.type === 'paren' && peek().value === '(') {
          next()
          const args = []
          if (!(peek()?.type === 'paren' && peek().value === ')')) {
            do {
              // Argument vide autorisé : RECHERCHEX(a;b;c;;0)
              if (peek()?.type === 'sep' || (peek()?.type === 'paren' && peek().value === ')')) args.push({ type: 'empty' })
              else args.push(comparison())
            } while (peek()?.type === 'sep' && next())
          }
          expect('paren', ')')
          return { type: 'func', name, args }
        }
        if (name === 'VRAI' || name === 'TRUE') return { type: 'bool', value: true }
        if (name === 'FAUX' || name === 'FALSE') return { type: 'bool', value: false }
        throw new FormulaSyntaxError(`« ${token.value} » n'est pas reconnu. Une fonction s'écrit avec des parenthèses, ex. SOMME(…).`)
      }
      case 'paren':
        if (token.value === '(') {
          const node = comparison()
          expect('paren', ')')
          return node
        }
        throw new FormulaSyntaxError('Parenthèse fermante en trop.')
      default:
        throw new FormulaSyntaxError(`« ${token.value} » est mal placé.`)
    }
  }

  const tree = comparison()
  if (pos < tokens.length) {
    const token = peek()
    throw new FormulaSyntaxError(
      token.type === 'paren' ? 'Parenthèse fermante en trop.' : `« ${token.value} » est mal placé. Vérifie les ; entre les arguments.`,
    )
  }
  return tree
}

// Liste des fonctions utilisées dans une formule (pour vérifier qu'un défi utilise la bonne)
export function functionsUsed(tree, found = new Set()) {
  if (!tree || typeof tree !== 'object') return found
  if (tree.type === 'func') found.add(tree.name)
  for (const child of [tree.left, tree.right, tree.value, ...(tree.args ?? [])]) functionsUsed(child, found)
  return found
}
