// Mini-moteur « Power Query » pédagogique (simulation, pas le vrai Power Query).
// Une table = { cols: [{ name, type }], rows: [[valeur, …]] } avec type 'any' | 'text' | 'int' | 'dec'.
// Une étape = { op, …paramètres }. On rejoue les étapes dans l'ordre à partir de la source, comme le volet
// « Étapes appliquées » : si une étape échoue (colonne introuvable, texte non numérique…), les suivantes aussi.

export const ERR = '#Erreur' // valeur d'une cellule dont la conversion a échoué (Error dans Power Query)
export const isErr = (v) => v === ERR

export class PqError extends Error {}

export const TYPE_LABEL = { any: 'Tout (ABC123)', text: 'Texte', int: 'Nombre entier', dec: 'Nombre décimal' }
const M_TYPE = { text: 'type text', int: 'Int64.Type', dec: 'type number' }
export const isNumType = (t) => t === 'int' || t === 'dec'

const table = (cols, rows) => ({ cols, rows })
const colIndex = (t, name) => {
  const i = t.cols.findIndex((c) => c.name === name)
  if (i < 0) throw new PqError(`La colonne « ${name} » de la table est introuvable.`)
  return i
}
const blank = (v) => v === null || v === undefined || v === ''

// Convertit un texte en nombre : espaces ignorés, virgule ou point décimal
export function parseNumber(v) {
  if (typeof v === 'number') return v
  if (isErr(v)) return v
  const s = String(v).replace(/[\s ]/g, '').replace(',', '.')
  if (s === '' || !/^-?\d+(\.\d+)?$/.test(s)) return ERR
  return Number(s)
}

const q = (s) => (s === null ? 'null' : `"${s}"`)
const list = (a) => `{${a.map(q).join(', ')}}`

// Libellé de l'étape (façon volet « Étapes appliquées ») et code M correspondant (prev = nom de l'étape précédente)
export const STEP_INFO = {
  promoteHeaders: {
    name: 'En-têtes promus',
    text: () => 'Utiliser la première ligne comme en-têtes',
    m: (_s, prev) => `Table.PromoteHeaders(${prev}, [PromoteAllScalars=true])`,
  },
  changeType: {
    name: 'Type modifié',
    text: (s) => `Changer le type de « ${s.col} » en ${TYPE_LABEL[s.type]}`,
    m: (s, prev) => `Table.TransformColumnTypes(${prev}, {{"${s.col}", ${M_TYPE[s.type]}}})`,
  },
  trim: {
    name: 'Texte nettoyé',
    text: (s) => `Supprimer les espaces en trop dans « ${s.col} »`,
    m: (s, prev) => `Table.TransformColumns(${prev}, {{"${s.col}", Text.Trim, type text}})`,
  },
  replace: {
    name: 'Valeur remplacée',
    text: (s) => `Remplacer ${s.from === null ? 'null' : `« ${s.from} »`} par « ${s.to} » dans « ${s.col} »`,
    m: (s, prev) => `Table.ReplaceValue(${prev}, ${q(s.from)}, ${q(s.to)}, Replacer.ReplaceValue, {"${s.col}"})`,
  },
  filter: {
    name: 'Lignes filtrées',
    text: (s) => `Filtrer « ${s.col} » ${FILTER_TEXT[s.cmp]}${s.cmp === 'notnull' ? '' : ` ${s.value}`}`,
    m: (s, prev) => `Table.SelectRows(${prev}, each [${s.col}] ${FILTER_M[s.cmp]}${s.cmp === 'notnull' ? '' : ` ${typeof s.value === 'number' ? s.value : q(s.value)}`})`,
  },
  removeCols: {
    name: 'Colonnes supprimées',
    text: (s) => `Supprimer ${s.cols.length > 1 ? 'les colonnes' : 'la colonne'} ${s.cols.map((c) => `« ${c} »`).join(', ')}`,
    m: (s, prev) => `Table.RemoveColumns(${prev}, ${list(s.cols)})`,
  },
  split: {
    name: 'Colonne fractionnée',
    text: (s) => `Fractionner « ${s.col} » par le délimiteur « ${s.sep} »`,
    m: (s, prev) => `Table.SplitColumn(${prev}, "${s.col}", Splitter.SplitTextByDelimiter("${s.sep}", QuoteStyle.Csv), ${list(s.names)})`,
  },
  removeDuplicates: {
    name: 'Doublons supprimés',
    text: (s) => (s.cols ? `Supprimer les doublons selon « ${s.cols.join(' », « ')} »` : 'Supprimer les doublons (lignes identiques)'),
    m: (s, prev) => `Table.Distinct(${prev}${s.cols ? `, ${list(s.cols)}` : ''})`,
  },
  removeBlankRows: {
    name: 'Lignes vides supprimées',
    text: () => 'Supprimer les lignes vides',
    m: (_s, prev) => `Table.SelectRows(${prev}, each not List.IsEmpty(List.RemoveMatchingItems(Record.FieldValues(_), {"", null})))`,
  },
  fillDown: {
    name: 'Rempli vers le bas',
    text: (s) => `Renseigner vers le bas « ${s.col} »`,
    m: (s, prev) => `Table.FillDown(${prev}, ${list([s.col])})`,
  },
  unpivot: {
    name: 'Autres colonnes non pivotées',
    text: (s) => `Dépivoter les autres colonnes que ${s.keep.map((c) => `« ${c} »`).join(', ')}`,
    m: (s, prev) => `Table.UnpivotOtherColumns(${prev}, ${list(s.keep)}, "${s.attr}", "${s.value}")`,
  },
  pivot: {
    name: 'Colonne pivotée',
    text: (s) => `Pivoter la colonne « ${s.attr} » (valeurs : somme de « ${s.value} »)`,
    m: (s, prev) => `Table.Pivot(${prev}, List.Distinct(${prev}[${s.attr}]), "${s.attr}", "${s.value}", List.Sum)`,
  },
  addCalc: {
    name: 'Colonne ajoutée',
    text: (s) => `Ajouter la colonne « ${s.name} » = [${s.a}] ${s.sym} [${s.b}]`,
    m: (s, prev) => `Table.AddColumn(${prev}, "${s.name}", each [${s.a}] ${s.sym} [${s.b}], type number)`,
  },
  merge: {
    name: 'Requêtes fusionnées',
    text: (s) => `Fusionner avec « ${s.right} » (${JOIN_TEXT[s.join]}) sur « ${s.leftKey} » = « ${s.rightKey} », garder ${s.take.map((c) => `« ${c} »`).join(', ')}`,
    m: (s, prev) =>
      `Table.NestedJoin(${prev}, {"${s.leftKey}"}, ${s.right}, {"${s.rightKey}"}, "${s.right}", ${JOIN_M[s.join]})\n` +
      `Table.ExpandTableColumn(…, "${s.right}", ${list(s.take)}, ${list(s.take)})`,
  },
  append: {
    name: 'Requêtes ajoutées',
    text: (s) => `Ajouter les lignes de « ${s.with} » à la suite`,
    m: (s, prev) => `Table.Combine({${prev}, ${s.with}})`,
  },
}
const FILTER_TEXT = { eq: '=', ne: '≠', gt: '>', ge: '≥', lt: '<', le: '≤', notnull: 'n’est pas vide' }
const FILTER_M = { eq: '=', ne: '<>', gt: '>', ge: '>=', lt: '<', le: '<=', notnull: '<> null' }
const JOIN_TEXT = { leftouter: 'externe gauche : toutes les lignes de gauche', inner: 'interne : seulement les correspondances' }
const JOIN_M = { leftouter: 'JoinKind.LeftOuter', inner: 'JoinKind.Inner' }

export const describeStep = (step) => STEP_INFO[step.op].text(step)

// Applique une étape. `tables` = les autres requêtes disponibles (pour fusionner / ajouter).
export function applyStep(t, step, tables = {}) {
  switch (step.op) {
    case 'promoteHeaders': {
      if (!t.rows.length) throw new PqError('Il n’y a aucune ligne à promouvoir en en-têtes.')
      const [head, ...rest] = t.rows
      return table(head.map((h) => ({ name: String(h), type: 'any' })), rest)
    }
    case 'changeType': {
      const i = colIndex(t, step.col)
      const conv = (v) => {
        if (v === null || isErr(v)) return v
        if (step.type === 'text') return String(v)
        const n = parseNumber(v)
        if (isErr(n)) return ERR
        return step.type === 'int' ? Math.round(n) : n
      }
      return table(t.cols.map((c, k) => (k === i ? { ...c, type: step.type } : c)), t.rows.map((r) => r.map((v, k) => (k === i ? conv(v) : v))))
    }
    case 'trim': {
      const i = colIndex(t, step.col)
      return table(t.cols, t.rows.map((r) => r.map((v, k) => (k === i && typeof v === 'string' ? v.trim() : v))))
    }
    case 'replace': {
      const i = colIndex(t, step.col)
      const to = isNumType(t.cols[i].type) ? parseNumber(step.to) : step.to
      return table(t.cols, t.rows.map((r) => r.map((v, k) => (k === i && v === step.from ? to : v))))
    }
    case 'filter': {
      const i = colIndex(t, step.col)
      const numeric = isNumType(t.cols[i].type)
      if (['gt', 'ge', 'lt', 'le'].includes(step.cmp) && !numeric) {
        throw new PqError(`Impossible de comparer le texte de « ${step.col} » à un nombre : change d’abord le type de la colonne.`)
      }
      const test = {
        eq: (v) => v === step.value,
        ne: (v) => v !== step.value,
        gt: (v) => v > step.value,
        ge: (v) => v >= step.value,
        lt: (v) => v < step.value,
        le: (v) => v <= step.value,
        notnull: (v) => !blank(v),
      }[step.cmp]
      return table(t.cols, t.rows.filter((r) => !isErr(r[i]) && (r[i] !== null || step.cmp === 'ne') && test(r[i])))
    }
    case 'removeCols': {
      const drop = new Set(step.cols.map((c) => colIndex(t, c)))
      return table(t.cols.filter((_, k) => !drop.has(k)), t.rows.map((r) => r.filter((_, k) => !drop.has(k))))
    }
    case 'split': {
      const i = colIndex(t, step.col)
      const cols = [...t.cols.slice(0, i), ...step.names.map((name) => ({ name, type: 'any' })), ...t.cols.slice(i + 1)]
      const rows = t.rows.map((r) => {
        const parts = typeof r[i] === 'string' ? r[i].split(step.sep) : []
        const mine = step.names.map((_, k) => (k < parts.length ? parts[k] : null))
        return [...r.slice(0, i), ...mine, ...r.slice(i + 1)]
      })
      return table(cols, rows)
    }
    case 'removeDuplicates': {
      const idx = step.cols ? step.cols.map((c) => colIndex(t, c)) : t.cols.map((_, k) => k)
      const seen = new Set()
      return table(t.cols, t.rows.filter((r) => {
        const key = JSON.stringify(idx.map((k) => r[k]))
        if (seen.has(key)) return false
        seen.add(key)
        return true
      }))
    }
    case 'removeBlankRows':
      return table(t.cols, t.rows.filter((r) => !r.every(blank)))
    case 'fillDown': {
      const i = colIndex(t, step.col)
      let last = null
      return table(t.cols, t.rows.map((r) => {
        if (!blank(r[i])) last = r[i]
        return r.map((v, k) => (k === i ? (blank(r[i]) ? last : v) : v))
      }))
    }
    case 'unpivot': {
      const keep = step.keep.map((c) => colIndex(t, c))
      const others = t.cols.map((_, k) => k).filter((k) => !keep.includes(k))
      const rows = []
      for (const r of t.rows) for (const k of others) if (r[k] !== null && r[k] !== undefined) rows.push([...keep.map((x) => r[x]), t.cols[k].name, r[k]])
      return table([...keep.map((x) => t.cols[x]), { name: step.attr, type: 'text' }, { name: step.value, type: 'any' }], rows)
    }
    case 'pivot': {
      const a = colIndex(t, step.attr)
      const v = colIndex(t, step.value)
      if (!isNumType(t.cols[v].type)) throw new PqError(`La somme de « ${step.value} » demande des nombres : change d’abord le type de la colonne.`)
      const rest = t.cols.map((_, k) => k).filter((k) => k !== a && k !== v)
      const names = [...new Set(t.rows.map((r) => String(r[a])))]
      const groups = new Map()
      for (const r of t.rows) {
        const key = JSON.stringify(rest.map((k) => r[k]))
        if (!groups.has(key)) groups.set(key, { base: rest.map((k) => r[k]), sums: {} })
        const g = groups.get(key)
        g.sums[r[a]] = (g.sums[r[a]] ?? 0) + (typeof r[v] === 'number' ? r[v] : 0)
      }
      const cols = [...rest.map((k) => t.cols[k]), ...names.map((n) => ({ name: n, type: t.cols[v].type }))]
      return table(cols, [...groups.values()].map((g) => [...g.base, ...names.map((n) => g.sums[n] ?? null)]))
    }
    case 'addCalc': {
      const a = colIndex(t, step.a)
      const b = colIndex(t, step.b)
      if (!isNumType(t.cols[a].type) || !isNumType(t.cols[b].type)) throw new PqError('Le calcul demande deux colonnes de nombres : change d’abord leurs types.')
      const f = { '*': (x, y) => x * y, '-': (x, y) => x - y, '+': (x, y) => x + y }[step.sym]
      return table([...t.cols, { name: step.name, type: 'dec' }], t.rows.map((r) => [...r, isErr(r[a]) || isErr(r[b]) || r[a] === null || r[b] === null ? null : Math.round(f(r[a], r[b]) * 100) / 100]))
    }
    case 'merge': {
      const right = tables[step.right]
      if (!right) throw new PqError(`La requête « ${step.right} » est introuvable.`)
      const lk = colIndex(t, step.leftKey)
      const rk = colIndex(right, step.rightKey)
      const take = step.take.map((c) => colIndex(right, c))
      const rows = []
      for (const r of t.rows) {
        const matches = right.rows.filter((x) => x[rk] === r[lk])
        if (matches.length === 0) {
          if (step.join === 'leftouter') rows.push([...r, ...take.map(() => null)])
        } else for (const m of matches) rows.push([...r, ...take.map((k) => m[k])])
      }
      return table([...t.cols, ...take.map((k) => right.cols[k])], rows)
    }
    case 'append': {
      const other = tables[step.with]
      if (!other) throw new PqError(`La requête « ${step.with} » est introuvable.`)
      const names = [...t.cols.map((c) => c.name), ...other.cols.map((c) => c.name).filter((n) => !t.cols.some((c) => c.name === n))]
      const pull = (tb) => tb.rows.map((r) => names.map((n) => { const k = tb.cols.findIndex((c) => c.name === n); return k < 0 ? null : r[k] }))
      return table(names.map((n) => t.cols.find((c) => c.name === n) ?? other.cols.find((c) => c.name === n)), [...pull(t), ...pull(other)])
    }
    default:
      throw new PqError(`Transformation inconnue : ${step.op}`)
  }
}

// Rejoue toutes les étapes. Renvoie { results: [{ ok, table } | { ok:false, error }], final } (final = null si une étape échoue)
export function runSteps(source, steps, tables = {}) {
  const results = []
  let current = source
  let failed = false
  for (const step of steps) {
    if (failed) {
      results.push({ ok: false, error: 'Une étape précédente est en erreur.', skipped: true })
      continue
    }
    try {
      current = applyStep(current, step, tables)
      results.push({ ok: true, table: current })
    } catch (e) {
      if (!(e instanceof PqError)) throw e
      failed = true
      results.push({ ok: false, error: e.message })
    }
  }
  return { results, final: failed ? null : current }
}

// Nom d'étape unique, façon « Type modifié1 »
export function stepNames(steps) {
  const count = {}
  return steps.map((s) => {
    const base = STEP_INFO[s.op].name
    count[base] = (count[base] ?? 0) + 1
    return count[base] === 1 ? base : `${base}${count[base] - 1}`
  })
}

// Code M complet de la requête (comme dans l'Éditeur avancé)
export function mCode(steps, sourceLabel = 'Excel.Workbook(File.Contents("fichier.xlsx"))') {
  const names = stepNames(steps)
  const ref = (n) => (/\s|[^\w]/.test(n) ? `#"${n}"` : n)
  const lines = [`    Source = ${sourceLabel}`]
  steps.forEach((s, i) => {
    const prev = ref(i === 0 ? 'Source' : names[i - 1])
    lines.push(`    ${ref(names[i])} = ${STEP_INFO[s.op].m(s, prev)}`)
  })
  const last = ref(steps.length ? names[steps.length - 1] : 'Source')
  return `let\n${lines.join(',\n')}\nin\n    ${last}`
}

// Compare deux tables. Renvoie [] si identiques, sinon la liste des différences (en français)
export function diffTables(got, want) {
  const out = []
  const gn = got.cols.map((c) => c.name)
  const wn = want.cols.map((c) => c.name)
  const missing = wn.filter((n) => !gn.includes(n))
  const extra = gn.filter((n) => !wn.includes(n))
  if (missing.length) out.push(`Colonne${missing.length > 1 ? 's' : ''} manquante${missing.length > 1 ? 's' : ''} : ${missing.join(', ')}`)
  if (extra.length) out.push(`Colonne${extra.length > 1 ? 's' : ''} en trop : ${extra.join(', ')}`)
  if (!missing.length && !extra.length && gn.join('|') !== wn.join('|')) out.push('Les colonnes ne sont pas dans le bon ordre.')
  for (const c of want.cols) {
    const g = got.cols.find((x) => x.name === c.name)
    if (g && g.type !== c.type) out.push(`Type de « ${c.name} » : attendu ${TYPE_LABEL[c.type]}, obtenu ${TYPE_LABEL[g.type]}`)
  }
  if (got.rows.length !== want.rows.length) out.push(`Nombre de lignes : attendu ${want.rows.length}, obtenu ${got.rows.length}`)
  else if (!out.length && JSON.stringify(got.rows) !== JSON.stringify(want.rows)) out.push('Certaines valeurs ne sont pas celles attendues (texte non nettoyé, ligne mal remplie, erreur de conversion…).')
  else if (out.length === 0 && got.rows.some((r) => r.some(isErr))) out.push('Certaines cellules sont en erreur.')
  return out
}

export const tablesEqual = (a, b) => diffTables(a, b).length === 0
