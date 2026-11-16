// Simulateur de stock : un produit, 12 semaines, demande aléatoire, délai de livraison.
// Chaque semaine : 1) on décide combien commander, 2) la demande tombe,
// 3) on paie le stockage, les ruptures et les commandes, 4) les livraisons arrivent.
// Les paramètres (demande, délai, coûts…) changent à chaque partie : voir generateScenario().

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const round = (n, step) => Math.round(n / step) * step
const Z = 1.65 // taux de service visé 95 %

const PRODUCTS = ['Cartons d\'emballage', 'Palettes bois', 'Casques audio', 'Pots de peinture', 'Sacs de ciment', 'Cartouches d\'encre', 'Bouteilles d\'eau', 'Pneus vélo']

// Les 4 profils de demande : coefficient appliqué à la demande de base, semaine par semaine (12 semaines)
export const PROFILES = {
  stable: {
    label: 'Stable',
    text: 'La demande reste autour de la même valeur toute la période.',
    factors: Array(12).fill(1),
  },
  saisonniere: {
    label: 'Saisonnière',
    text: 'La demande monte progressivement vers un pic au milieu de la période, puis redescend.',
    factors: [0.7, 0.75, 0.85, 1, 1.15, 1.3, 1.35, 1.25, 1.1, 0.95, 0.8, 0.7],
  },
  tendance: {
    label: 'En tendance',
    text: 'La demande augmente régulièrement, de la première à la dernière semaine.',
    factors: Array.from({ length: 12 }, (_, w) => 0.7 + (0.6 * w) / 11),
  },
  promotions: {
    label: 'Avec promotions',
    text: "Deux promotions doublent la demande (semaines 4 et 9), suivies d'un creux (semaines 5 et 10).",
    factors: [0.9, 0.9, 0.9, 2, 0.6, 0.9, 0.9, 0.9, 2, 0.6, 0.9, 0.9],
  },
}

// Demande moyenne attendue la semaine w (index à partir de 0) : connue du joueur comme « prévision »
export const expectedDemand = (p, w) => p.means?.[Math.min(w, p.weeks - 1)] ?? p.mean

// Demande aléatoire ~ loi normale (méthode de Box-Muller), arrondie, jamais négative
export function generateDemand(p, random = Math.random) {
  return Array.from({ length: p.weeks }, (_, w) => {
    const u = 1 - random()
    const v = random()
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
    return Math.max(0, Math.round(expectedDemand(p, w) + p.sd * z))
  })
}

// Repères du cours pour un jeu de paramètres
export function referenceFor(p) {
  const safetyStock = Math.round(Z * p.sd * Math.sqrt(p.lead))
  return {
    safetyStock,
    reorderPoint: Math.round(p.mean * p.lead + Z * p.sd * Math.sqrt(p.lead)),
    quantity: Math.max(10, round(Math.sqrt((2 * p.mean * p.orderCost) / p.holding), 10)),
  }
}

export function newGame(params, demand = generateDemand(params)) {
  return { params, demand, week: 0, stock: params.initialStock, pipeline: [], history: [], lastReceived: 0 }
}

// Joue une semaine avec la quantité commandée. Renvoie le nouvel état (sans modifier l'ancien).
export function playWeek(game, orderQty) {
  const p = game.params
  const qty = Math.max(0, Math.round(orderQty) || 0)
  const pipeline = qty > 0 ? [...game.pipeline, { arrival: game.week + p.lead, qty }] : [...game.pipeline]
  const demand = game.demand[game.week]
  const sold = Math.min(game.stock, demand)
  const lost = demand - sold
  const endStock = game.stock - sold
  const costs = {
    holding: endStock * p.holding,
    shortage: lost * p.shortage,
    order: qty > 0 ? p.orderCost : 0,
  }
  const week = game.week + 1
  // Livraisons qui arrivent au début de la semaine suivante
  const received = pipeline.filter((o) => o.arrival === week).reduce((s, o) => s + o.qty, 0)
  return {
    ...game,
    week,
    stock: endStock + received,
    pipeline: pipeline.filter((o) => o.arrival !== week),
    lastReceived: received,
    history: [
      ...game.history,
      { week, ordered: qty, demand, sold, lost, endStock, costs, cost: costs.holding + costs.shortage + costs.order },
    ],
  }
}

export function summarize(history) {
  const sum = (f) => history.reduce((s, h) => s + f(h), 0)
  const demand = sum((h) => h.demand)
  return {
    cost: sum((h) => h.cost),
    holding: sum((h) => h.costs.holding),
    shortage: sum((h) => h.costs.shortage),
    order: sum((h) => h.costs.order),
    orders: history.filter((h) => h.ordered > 0).length,
    lost: sum((h) => h.lost),
    service: demand ? sum((h) => h.sold) / demand : 1,
  }
}

// Point de commande de la semaine w : demande attendue pendant le délai + stock de sécurité
export function reorderPointAt(p, w) {
  let need = 0
  for (let k = 0; k < p.lead; k++) need += expectedDemand(p, w + k)
  return Math.round(need + Z * p.sd * Math.sqrt(p.lead))
}

// Méthode du cours : si position de stock (stock + commandes en route) ≤ point de commande,
// on commande la quantité de Wilson (plusieurs fois si besoin).
// Avec une demande non stable, le point de commande suit la demande attendue pendant le délai.
export function referenceOrder(game) {
  const ref = referenceFor(game.params)
  const rp = reorderPointAt(game.params, game.week)
  const position = game.stock + game.pipeline.reduce((s, o) => s + o.qty, 0)
  let qty = 0
  while (position + qty <= rp) qty += ref.quantity
  return qty
}

function playStrategy(params, demand, strategy) {
  let game = newGame(params, demand)
  while (game.week < params.weeks) game = playWeek(game, strategy(game))
  return game
}

export const playReference = (params, demand) => playStrategy(params, demand, referenceOrder)

// Tire un nouveau scénario au hasard. On ne garde que les scénarios où la méthode du cours
// bat nettement la stratégie naïve "commander la demande moyenne chaque semaine".
export function generateScenario(profileId = null) {
  let best = null
  for (let attempt = 0; attempt < 30; attempt++) {
    const base = pick([60, 80, 100, 120, 150, 200])
    const profile = profileId ?? pick(Object.keys(PROFILES))
    const means = PROFILES[profile].factors.map((k) => Math.round(base * k))
    const mean = Math.round(means.reduce((a, b) => a + b, 0) / means.length)
    const lead = pick([1, 2, 3])
    const params = {
      product: pick(PRODUCTS),
      weeks: 12,
      profile,
      means,
      mean,
      sd: Math.max(5, round(mean * pick([0.15, 0.2, 0.25, 0.3]), 5)),
      lead,
      initialStock: round(mean * (lead + pick([0.5, 1, 1.5])), 10),
      holding: pick([0.5, 1, 1.5, 2]),
      shortage: pick([4, 5, 6, 8, 10]),
      orderCost: pick([100, 150, 200, 250, 300]),
    }
    let refCost = 0
    let naiveCost = 0
    for (let i = 0; i < 60; i++) {
      const demand = generateDemand(params)
      refCost += summarize(playReference(params, demand).history).cost
      naiveCost += summarize(playStrategy(params, demand, (g) => expectedDemand(params, g.week)).history).cost
    }
    const gain = 1 - refCost / naiveCost
    if (gain >= 0.1) return params
    if (!best || gain > best.gain) best = { params, gain }
  }
  return best.params
}

// Prévisions affichées pendant la partie (avec la demande MOYENNE, la vraie demande est inconnue)
export function forecast(game, orderNow = 0) {
  const p = game.params
  const nextWeek = game.week + 1
  const d1 = expectedDemand(p, game.week)
  const d2 = expectedDemand(p, game.week + 1)
  const arrivingNext = game.pipeline.filter((o) => o.arrival === nextWeek).reduce((s, o) => s + o.qty, 0) + (p.lead === 1 ? orderNow : 0)
  const endOfWeek = game.stock - d1
  const nextWeekEnd = Math.max(0, endOfWeek) + arrivingNext - d2
  return { endOfWeek, arrivingNext, nextWeekEnd, d1, d2 }
}
