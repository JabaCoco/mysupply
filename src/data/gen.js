// Outils pour fabriquer des exercices et des questions à chiffres aléatoires.
// Utilisés par les fichiers de contenu (cours, défis Excel, formules, études de cas).

// Entier aléatoire entre min et max (inclus), par pas de `step`
export const int = (min, max, step = 1) => min + step * Math.floor(Math.random() * (Math.floor((max - min) / step) + 1))
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// n éléments différents tirés au hasard
export const sample = (arr, n) => shuffle(arr).slice(0, n)

export const fmt = (n, d = 2) => n.toLocaleString('fr-FR', { maximumFractionDigits: d })
export const eur = (n, d = 2) => `${fmt(n, d)} €`

// Mélange une bonne réponse et des mauvaises : renvoie { choices, answer (index de la bonne) }
export function choiceSet(correct, wrongs) {
  const all = [correct, ...wrongs].map((text, i) => ({ text, ok: i === 0 }))
  const mixed = shuffle(all)
  return { choices: mixed.map((c) => c.text), answer: mixed.findIndex((c) => c.ok) }
}

// Question de quiz à réponse chiffrée, avec 3 mauvaises réponses proches.
// { q, answer, unit?, digits? (décimales), explain, wrong? (mauvaises réponses imposées), max? (borne haute) }
export function numQuestion({ q, answer, unit = '', digits = 0, explain, wrong, max }) {
  const round = (v) => Number(v.toFixed(digits))
  const label = (v) => `${fmt(v, digits)}${unit ? ` ${unit}` : ''}`
  const correct = round(answer)
  const step = digits ? 10 ** -digits : 1
  const raw = wrong ?? [0.5, 0.75, 0.9, 1.1, 1.25, 1.5, 2].map((k) => answer * k)
  const labels = new Set([label(correct)])
  const wrongs = []
  for (const v of shuffle(raw.map(round))) {
    if (v < 0 || (max !== undefined && v > max)) continue
    const l = label(v)
    if (!labels.has(l)) {
      labels.add(l)
      wrongs.push(l)
    }
    if (wrongs.length === 3) break
  }
  // Secours : on ajoute des valeurs voisines si les multiples ne suffisent pas
  for (let k = 1; wrongs.length < 3 && k < 20; k++) {
    for (const v of [correct + k * step, correct - k * step]) {
      const l = label(round(v))
      if (round(v) >= 0 && (max === undefined || v <= max) && !labels.has(l) && wrongs.length < 3) {
        labels.add(l)
        wrongs.push(l)
      }
    }
  }
  return { q, ...choiceSet(label(correct), wrongs), explain }
}
