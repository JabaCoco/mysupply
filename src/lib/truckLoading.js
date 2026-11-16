// Atelier « Plan de chargement » : placer des palettes dans un camion.
// Le camion a ROWS rangées de 2 places au sol (rangée 0 = près de la porte arrière, la dernière = près de la cabine).
// Une palette peut être posée sur une autre si celle du dessous supporte une charge (non fragile)
// et si elle est plus légère. Le camion livre les clients dans l'ordre A, puis B, puis C.

export const ROWS = 8
export const COLS = 2
export const CLIENTS = ['A', 'B', 'C']

const rnd = (a, b, step = 1) => a + step * Math.floor(Math.random() * (Math.floor((b - a) / step) + 1))
const shuffle = (a) => {
  const x = [...a]
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[x[i], x[j]] = [x[j], x[i]]
  }
  return x
}

export function generateLoad() {
  const n = rnd(11, 16)
  const pallets = Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    client: CLIENTS[Math.min(2, Math.floor((i * 3) / n))],
    weight: rnd(200, 1000, 50),
    fragile: Math.random() < 0.25,
  }))
  const total = pallets.reduce((s, p) => s + p.weight, 0)
  const payload = Math.ceil((total * (1 + rnd(5, 25) / 100)) / 500) * 500
  return { pallets: shuffle(pallets), payload }
}

export const emptyPlan = () => Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => ({ bottom: null, top: null })))
export const clonePlan = (plan) => plan.map((row) => row.map((s) => ({ ...s })))

// Peut-on poser `pallet` sur la palette `under` ?
export const canStack = (under, pallet) => !under.fragile && pallet.weight <= under.weight

// Évalue un plan : conflits de déchargement, poids, équilibre, palettes non chargées.
export function evaluate(load, plan) {
  const byId = Object.fromEntries(load.pallets.map((p) => [p.id, p]))
  const placed = []
  plan.forEach((row, r) =>
    row.forEach((slot, c) => {
      if (slot.bottom) placed.push({ ...byId[slot.bottom], r, c, level: 0 })
      if (slot.top) placed.push({ ...byId[slot.top], r, c, level: 1 })
    }),
  )
  const weight = placed.reduce((s, p) => s + p.weight, 0)
  const missing = load.pallets.length - placed.length
  // Une palette X gêne Y (même colonne) si X est entre Y et la porte (ou posée dessus) et livrée après Y
  const conflicts = []
  for (const y of placed) {
    for (const x of placed) {
      if (x === y || x.c !== y.c) continue
      const blocks = x.r < y.r || (x.r === y.r && x.level > y.level)
      if (blocks && x.client > y.client) conflicts.push({ blocker: x, blocked: y })
    }
  }
  const front = placed.filter((p) => p.r >= ROWS / 2).reduce((s, p) => s + p.weight, 0)
  const frontShare = weight > 0 ? front / weight : 0.5
  const overweight = weight > load.payload
  const unbalanced = weight > 0 && (frontShare < 0.45 || frontShare > 0.75)
  let score = 100 - missing * 8 - (overweight ? 30 : 0) - Math.min(36, conflicts.length * 6) - (unbalanced ? 10 : 0)
  score = Math.max(0, score)
  const slotsUsed = plan.flat().filter((s) => s.bottom).length
  return { placed, weight, missing, conflicts, frontShare, overweight, unbalanced, score, fill: slotsUsed / (ROWS * COLS), loadRate: weight / load.payload }
}

// Solution simple : on charge d'abord le dernier client (au fond), les plus lourdes vers la cabine.
export function suggestPlan(load) {
  const order = [...load.pallets].sort((a, b) => (a.client < b.client ? 1 : a.client > b.client ? -1 : b.weight - a.weight))
  const plan = emptyPlan()
  let r = ROWS - 1
  let c = 0
  for (const p of order) {
    if (r < 0) {
      // plus de place au sol : on empile sur une palette plus lourde du même client ou d'un client livré plus tard
      let done = false
      for (let rr = ROWS - 1; rr >= 0 && !done; rr--)
        for (let cc = 0; cc < COLS && !done; cc++) {
          const slot = plan[rr][cc]
          const under = slot.bottom && load.pallets.find((x) => x.id === slot.bottom)
          if (under && !slot.top && canStack(under, p) && under.client >= p.client) {
            slot.top = p.id
            done = true
          }
        }
      continue
    }
    plan[r][c].bottom = p.id
    c++
    if (c === COLS) {
      c = 0
      r--
    }
  }
  return plan
}
