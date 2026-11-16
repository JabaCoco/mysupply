// Atelier « Tournée de livraison » : un dépôt (point 0) et des clients. Le joueur choisit l'ordre des visites,
// le camion revient au dépôt. On compare avec la méthode du « plus proche voisin » et avec la tournée optimale
// (calculée exactement par programmation dynamique, méthode de Held-Karp).

export const KM_PER_UNIT = 1.5 // 1 unité de la carte = 1,5 km
export const LEVELS = { facile: 6, moyen: 8, difficile: 10 }

const rnd = (a, b) => a + Math.random() * (b - a)

export const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)

export function generateTour(clients) {
  const points = []
  let guard = 0
  while (points.length < clients + 1 && guard++ < 1000) {
    const p = { x: Math.round(rnd(8, 92)), y: Math.round(rnd(8, 92)) }
    if (points.every((q) => dist(p, q) > 13)) points.push(p)
  }
  // le point 0 est le dépôt ; on le place plutôt vers le centre-bas pour qu'il soit lisible
  const costPerKm = Math.round(rnd(0.9, 1.5) * 10) / 10
  return { points, costPerKm }
}

// Longueur d'une tournée : dépôt → clients (dans l'ordre) → dépôt
export function routeLength(points, order) {
  let total = 0
  let prev = 0
  for (const i of order) {
    total += dist(points[prev], points[i])
    prev = i
  }
  return total + dist(points[prev], points[0])
}

export const toKm = (units) => units * KM_PER_UNIT

export function nearestNeighbor(points) {
  const left = new Set(points.map((_, i) => i).slice(1))
  const order = []
  let cur = 0
  while (left.size) {
    let best = null
    for (const i of left) if (best === null || dist(points[cur], points[i]) < dist(points[cur], points[best])) best = i
    order.push(best)
    left.delete(best)
    cur = best
  }
  return order
}

// Tournée optimale exacte (Held-Karp) : n clients ≤ 12
export function optimalTour(points) {
  const n = points.length - 1
  const size = 1 << n
  const d = (i, j) => dist(points[i], points[j])
  const cost = Array.from({ length: size }, () => new Float64Array(n).fill(Infinity))
  const parent = Array.from({ length: size }, () => new Int8Array(n).fill(-1))
  for (let j = 0; j < n; j++) cost[1 << j][j] = d(0, j + 1)
  for (let mask = 1; mask < size; mask++) {
    for (let j = 0; j < n; j++) {
      if (!(mask & (1 << j)) || cost[mask][j] === Infinity) continue
      for (let k = 0; k < n; k++) {
        if (mask & (1 << k)) continue
        const next = mask | (1 << k)
        const c = cost[mask][j] + d(j + 1, k + 1)
        if (c < cost[next][k]) {
          cost[next][k] = c
          parent[next][k] = j
        }
      }
    }
  }
  const full = size - 1
  let bestEnd = 0
  let best = Infinity
  for (let j = 0; j < n; j++) {
    const c = cost[full][j] + d(j + 1, 0)
    if (c < best) {
      best = c
      bestEnd = j
    }
  }
  const order = []
  let mask = full
  let j = bestEnd
  while (j !== -1) {
    order.push(j + 1)
    const p = parent[mask][j]
    mask &= ~(1 << j)
    j = p
  }
  return order.reverse()
}

// Les segments se croisent-ils ? (une tournée optimale n'a jamais de croisement)
const ccw = (a, b, c) => (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x)
const cross = (a, b, c, d) => ccw(a, c, d) !== ccw(b, c, d) && ccw(a, b, c) !== ccw(a, b, d)
export function crossings(points, order) {
  const path = [0, ...order, 0]
  let n = 0
  for (let i = 0; i < path.length - 1; i++)
    for (let j = i + 2; j < path.length - 1; j++) {
      if (i === 0 && j === path.length - 2) continue // premier et dernier segments partagent le dépôt
      if (cross(points[path[i]], points[path[i + 1]], points[path[j]], points[path[j + 1]])) n++
    }
  return n
}

// Score sur 100 : 100 si optimal, −2,5 points par % de kilomètres en trop
export function scoreTour(points, order) {
  const opt = routeLength(points, optimalTour(points))
  const mine = routeLength(points, order)
  return Math.max(0, Math.min(100, Math.round(100 - 250 * (mine / opt - 1))))
}
