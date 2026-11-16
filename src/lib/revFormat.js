// Format d'import des révisions (« format RV », version 1) : un fichier texte simple, écrit par Claude à partir de tes cours.
// Ce module lit le texte, le vérifie ligne par ligne et renvoie le lot prêt à être enregistré.
// Il ne dépend de rien d'autre (aucune API, aucun appel externe) : il marche hors ligne.
//
// Structure :
//   @lot Titre          (obligatoire)      @matiere Nom       (obligatoire)      @cours Nom (facultatif)
//   puis des blocs : @fiche, @flashcard, @qcm, @qa, @exercice
//   Les champs d'un bloc s'écrivent « clé: valeur » ; une valeur peut continuer sur les lignes suivantes.
//   Un tableau s'écrit avec des lignes commençant par | (comme en Markdown).

export const MAX_ITEMS = 500
export const BLOCKS = ['fiche', 'flashcard', 'qcm', 'qa', 'exercice']
const HEADERS = ['lot', 'matiere', 'cours']
const ALLOWED = {
  flashcard: ['recto', 'verso', 'note'],
  qcm: ['question', 'reponse', 'explication'],
  qa: ['question', 'reponse', 'explication'],
  exercice: ['enonce', 'question', 'reponse', 'unite', 'tolerance', 'correction', 'indice'],
}
const KEYS = new Set(Object.values(ALLOWED).flat())
const CHOICE = /^([a-fA-F])\s*[).]\s+(.*)$/

const strip = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

// Identifiant stable (FNV-1a) : le même contenu garde le même identifiant d'un import à l'autre,
// ce qui permet de conserver la progression quand on réimporte un lot corrigé.
export function hashId(text) {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(36)
}

// Nombre au format français : « 1 250,5 », « 12 % », « 3,2 € »
export function parseNumber(text) {
  const cleaned = String(text).replace(/[\s  ]/g, '').replace('%', '').replace('€', '').replace(',', '.')
  if (!/^[-+]?\d+(\.\d+)?$/.test(cleaned)) return null
  return Number(cleaned)
}

// Contrôle des tableaux d'un texte : lignes commençant par |
function checkTables(lines, errors) {
  let i = 0
  while (i < lines.length) {
    if (!lines[i].s.trim().startsWith('|')) {
      i++
      continue
    }
    let j = i
    while (j < lines.length && lines[j].s.trim().startsWith('|')) j++
    const rows = lines.slice(i, j)
    const width = (r) => r.s.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').length
    rows.forEach((r) => {
      if (!r.s.trim().endsWith('|') || r.s.trim().length < 3) errors.push({ line: r.n, message: 'ligne de tableau incomplète : elle doit commencer et finir par |' })
    })
    if (rows.length < 3) errors.push({ line: rows[0].n, message: 'tableau incomplet : il faut une ligne d\'en-têtes, une ligne de séparation (| --- | --- |) et au moins une ligne de données' })
    else {
      const sep = rows[1].s.trim().replace(/^\|/, '').replace(/\|$/, '').split('|')
      if (!sep.every((c) => /^\s*:?-{3,}:?\s*$/.test(c))) errors.push({ line: rows[1].n, message: 'la 2e ligne du tableau doit être une ligne de séparation comme | --- | --- |' })
      const w = width(rows[0])
      rows.forEach((r) => {
        if (width(r) !== w) errors.push({ line: r.n, message: `ce tableau a ${w} colonne${w > 1 ? 's' : ''} dans l'en-tête mais cette ligne en a ${width(r)}` })
      })
    }
    i = j
  }
}

const textOf = (lines) => {
  const out = lines.map((l) => l.s.replace(/\s+$/, ''))
  while (out.length && !out[out.length - 1].trim()) out.pop()
  while (out.length && !out[0].trim()) out.shift()
  return out.join('\n')
}

export function parseRevisions(source) {
  const errors = []
  const warnings = []
  const err = (line, message) => errors.push({ line, message })
  const warn = (line, message) => warnings.push({ line, message })
  const text = String(source ?? '').replace(/^﻿/, '').replace(/\r\n?/g, '\n')
  if (!text.trim()) return { ok: false, errors: [{ line: 1, message: 'le texte est vide' }], warnings, lot: null, counts: {} }
  const raw = text.split('\n')

  const header = {}
  const items = []
  const ids = new Set()
  let block = null // { kind, line, title, fields: [{key, line, lines: []}], choices: [] }
  let stray = 0

  function finishBlock() {
    if (!block) return
    const b = block
    block = null
    const field = (k) => b.fields.find((f) => f.key === k)
    const need = (k, label = k) => {
      const f = field(k)
      if (!f || !textOf(f.lines)) {
        err(f?.line ?? b.line, `@${b.kind} : le champ « ${label}: » est obligatoire${f ? ' et il est vide' : ''}`)
        return null
      }
      checkTables(f.lines, errors)
      return textOf(f.lines)
    }
    const once = (k) => {
      const all = b.fields.filter((f) => f.key === k)
      if (all.length > 1) err(all[1].line, `@${b.kind} : le champ « ${k}: » est écrit deux fois`)
    }
    const push = (item, primary) => {
      let id = hashId(`${item.type}|${primary}`)
      if (ids.has(id)) {
        warn(b.line, `contenu en double dans le lot (${item.type} « ${primary.slice(0, 40)} ») : la 2e copie est ignorée`)
        return
      }
      ids.add(id)
      items.push({ id, ...item })
    }

    if (b.kind === 'fiche') {
      const body = textOf(b.body)
      if (!b.title) err(b.line, '@fiche : il faut un titre sur la même ligne, par exemple « @fiche Le stock de sécurité »')
      if (!body) err(b.line, '@fiche : le texte de la fiche est vide')
      checkTables(b.body, errors)
      if (b.title && body) push({ type: 'fiche', title: b.title, body }, b.title)
      return
    }
    if (b.title && b.kind !== 'exercice') warn(b.line, `@${b.kind} : le texte après @${b.kind} est ignoré (seul @exercice et @fiche ont un titre)`)

    if (b.kind === 'flashcard') {
      b.fields.forEach((f) => once(f.key))
      const recto = need('recto')
      const verso = need('verso')
      const note = field('note') ? textOf(field('note').lines) : ''
      if (recto && verso) push({ type: 'flashcard', recto, verso, ...(note ? { note } : {}) }, recto)
    } else if (b.kind === 'qcm') {
      b.fields.forEach((f) => once(f.key))
      const question = need('question')
      const answerRaw = need('reponse', 'reponse')
      const explication = field('explication') ? textOf(field('explication').lines) : ''
      if (!explication) warn(b.line, '@qcm : pas d\'« explication: » : la correction expliquée sera vide')
      const choices = b.choices.map((c) => ({ ...c, text: textOf(c.lines) }))
      if (choices.length < 2) err(b.line, `@qcm : il faut au moins 2 choix (a) ..., b) ...), tu en as ${choices.length}`)
      if (choices.length > 6) err(b.line, '@qcm : 6 choix au maximum')
      choices.forEach((c, k) => {
        if (c.letter !== 'abcdef'[k]) err(c.line, `@qcm : les choix doivent se suivre a), b), c)... ; ici « ${c.letter}) » arrive à la place de « ${'abcdef'[k]}) »`)
        if (!c.text) err(c.line, `@qcm : le choix ${c.letter}) est vide`)
      })
      if (new Set(choices.map((c) => c.text.toLowerCase())).size !== choices.length) warn(b.line, '@qcm : deux choix sont identiques')
      let answer = -1
      if (answerRaw) {
        const letter = answerRaw.trim().toLowerCase().replace(/[).]$/, '')
        answer = 'abcdef'.indexOf(letter)
        if (letter.length !== 1 || answer < 0 || answer >= choices.length) {
          err(field('reponse').line, `@qcm : « reponse: ${answerRaw.slice(0, 20)} » doit être une seule lettre parmi ${choices.map((c) => c.letter).join(', ') || 'a, b…'} (une seule bonne réponse)`)
          answer = -1
        }
      }
      if (question && answer >= 0 && choices.length >= 2 && !errors.some((e) => e.line >= b.line)) push({ type: 'qcm', question, choices: choices.map((c) => c.text), answer, explication }, question)
    } else if (b.kind === 'qa') {
      b.fields.forEach((f) => once(f.key))
      const question = need('question')
      const reponse = need('reponse')
      const explication = field('explication') ? textOf(field('explication').lines) : ''
      if (question && reponse) push({ type: 'qa', question, reponse, ...(explication ? { explication } : {}) }, question)
    } else if (b.kind === 'exercice') {
      if (!b.title) err(b.line, '@exercice : il faut un titre sur la même ligne, par exemple « @exercice Calcul du stock de sécurité »')
      const enonce = b.fields.find((f) => f.key === 'enonce')
      if (!enonce || !textOf(enonce.lines)) err(enonce?.line ?? b.line, '@exercice : le champ « enonce: » est obligatoire')
      else checkTables(enonce.lines, errors)
      if (b.fields.filter((f) => f.key === 'enonce').length > 1) err(b.fields.filter((f) => f.key === 'enonce')[1].line, '@exercice : « enonce: » est écrit deux fois')
      const questions = []
      let cur = null
      for (const f of b.fields) {
        if (f.key === 'enonce') continue
        if (f.key === 'question') {
          cur = { line: f.line, question: textOf(f.lines), fields: {} }
          if (!cur.question) err(f.line, '@exercice : « question: » est vide')
          else checkTables(f.lines, errors)
          questions.push(cur)
          continue
        }
        if (!cur) {
          err(f.line, `@exercice : « ${f.key}: » doit venir après une « question: »`)
          continue
        }
        if (cur.fields[f.key]) err(f.line, `@exercice : « ${f.key}: » est écrit deux fois pour la même question`)
        cur.fields[f.key] = f
        if (f.key === 'correction') checkTables(f.lines, errors)
      }
      if (!questions.length) err(b.line, '@exercice : il faut au moins une « question: » avec sa « reponse: »')
      const built = questions.map((q, k) => {
        const rep = q.fields.reponse ? textOf(q.fields.reponse.lines) : ''
        if (!rep) err(q.line, `@exercice : la question ${k + 1} n'a pas de « reponse: »`)
        const correction = q.fields.correction ? textOf(q.fields.correction.lines) : ''
        if (!correction) warn(q.line, `@exercice : la question ${k + 1} n'a pas de « correction: » détaillée`)
        const unite = q.fields.unite ? textOf(q.fields.unite.lines) : ''
        const indice = q.fields.indice ? textOf(q.fields.indice.lines) : ''
        const value = parseNumber(rep)
        let tolerance
        if (q.fields.tolerance) {
          tolerance = parseNumber(textOf(q.fields.tolerance.lines))
          if (tolerance === null || tolerance < 0) err(q.fields.tolerance.line, '@exercice : « tolerance: » doit être un nombre positif (exemple : 0,5)')
          if (value === null) warn(q.fields.tolerance.line, '@exercice : « tolerance: » ne sert que pour une réponse numérique : elle est ignorée ici')
        }
        return { id: `q${k + 1}`, question: q.question, reponse: rep, numeric: value !== null, ...(value !== null ? { value } : {}), ...(unite ? { unite } : {}), ...(tolerance ? { tolerance } : {}), correction, ...(indice ? { indice } : {}) }
      })
      if (b.title && enonce && textOf(enonce.lines) && built.length && !errors.some((e) => e.line >= b.line)) push({ type: 'exercice', title: b.title, enonce: textOf(enonce.lines), questions: built }, `${b.title}|${textOf(enonce.lines).slice(0, 80)}`)
    }
  }

  for (let i = 0; i < raw.length; i++) {
    const n = i + 1
    const line = raw[i]
    const trimmed = line.trim()
    if (trimmed.startsWith('//')) continue // commentaire
    const dm = /^@(\S+)(?:\s+(.*))?$/.exec(line.replace(/\s+$/, ''))
    if (dm) {
      const name = strip(dm[1])
      const value = (dm[2] ?? '').trim()
      if (HEADERS.includes(name)) {
        finishBlock()
        if (items.length || block) err(n, `@${name} doit être écrit au début du fichier, avant les fiches et les questions`)
        else if (header[name] !== undefined) err(n, `@${name} est écrit deux fois`)
        else if (!value) err(n, `@${name} : il manque la valeur (exemple : « @${name} ${name === 'lot' ? 'Mon lot' : name === 'matiere' ? 'Supply chain' : 'Les stocks'} »)`)
        else header[name] = value
      } else if (BLOCKS.includes(name)) {
        finishBlock()
        block = { kind: name, line: n, title: value, fields: [], choices: [], body: [] }
      } else {
        finishBlock()
        err(n, `directive inconnue « @${dm[1]} » : les directives possibles sont @lot, @matiere, @cours, @fiche, @flashcard, @qcm, @qa, @exercice`)
        block = { kind: 'ignore', line: n, title: '', fields: [], choices: [], body: [] }
      }
      continue
    }
    if (!block) {
      if (trimmed && stray++ < 3) err(n, 'ce texte est en dehors d\'un bloc : commence par @lot, @matiere puis un bloc (@fiche, @flashcard, @qcm, @qa, @exercice)')
      continue
    }
    if (block.kind === 'ignore') continue
    if (block.kind === 'fiche') {
      block.body.push({ n, s: line })
      continue
    }
    // choix d'un QCM
    const cm = block.kind === 'qcm' ? CHOICE.exec(trimmed) : null
    if (cm) {
      block.choices.push({ letter: cm[1].toLowerCase(), line: n, lines: [{ n, s: cm[2] }] })
      block.cur = { type: 'choice', ref: block.choices.at(-1) }
      continue
    }
    const km = /^([A-Za-zÀ-ÿ]{2,12})\s*:\s*(.*)$/.exec(trimmed)
    const key = km ? strip(km[1]) : null
    if (key && KEYS.has(key)) {
      if (!ALLOWED[block.kind].includes(key)) {
        err(n, `« ${key}: » n'existe pas dans @${block.kind} (champs possibles : ${ALLOWED[block.kind].map((k) => k + ':').join(' ')})`)
        block.cur = null
        continue
      }
      const f = { key, line: n, lines: [{ n, s: km[2] ?? '' }] }
      block.fields.push(f)
      block.cur = { type: 'field', ref: f }
      continue
    }
    if (block.cur) block.cur.ref.lines.push({ n, s: line })
    else if (trimmed) err(n, `@${block.kind} : texte en dehors d'un champ (écris « ${ALLOWED[block.kind][0]}: ... » avant)`)
  }
  finishBlock()

  if (!header.lot) err(1, 'il manque « @lot Titre du lot » au début du fichier')
  if (!header.matiere) err(1, 'il manque « @matiere Nom de la matière » au début du fichier')
  if (!items.length && !errors.length) err(1, 'aucun contenu : ajoute au moins une @fiche, @flashcard, @qcm, @qa ou @exercice')
  if (items.length > MAX_ITEMS) err(1, `trop de contenus (${items.length}) : ${MAX_ITEMS} au maximum par lot, coupe le fichier en plusieurs lots`)

  errors.sort((a, b) => a.line - b.line)
  warnings.sort((a, b) => a.line - b.line)
  const counts = { fiche: 0, flashcard: 0, qcm: 0, qa: 0, exercice: 0 }
  items.forEach((it) => counts[it.type]++)
  const lot = errors.length ? null : { title: header.lot, matiere: header.matiere, cours: header.cours ?? 'Général', items }
  return { ok: errors.length === 0, errors: errors.slice(0, 60), errorCount: errors.length, warnings: warnings.slice(0, 40), lot, counts }
}

// Types de contenus qui deviennent des cartes à répéter (espacement)
export function cardsOf(lot) {
  const cards = []
  for (const it of lot.items) {
    if (it.type === 'flashcard') {
      cards.push({ itemId: it.id, dir: 'f' }, { itemId: it.id, dir: 'r' })
    } else if (it.type === 'qa' || it.type === 'qcm') cards.push({ itemId: it.id, dir: 'f' })
  }
  return cards
}

// Réponse numérique juste ? (tolérance : celle de la question, ou 0,5 % de la réponse). null si ce n est pas un nombre.
export function checkNumericAnswer(q, input) {
  const v = parseNumber(input)
  if (v === null) return null
  const margin = Math.max(q.tolerance ?? 0, Math.abs(q.value) * 0.005)
  return Math.abs(v - q.value) <= margin + 1e-9
}
