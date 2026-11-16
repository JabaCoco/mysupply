// Jeu de la bière : une chaîne de 4 maillons (détaillant → grossiste → distributeur → usine).
// Le joueur gère le GROSSISTE ; les trois autres maillons sont pilotés par des règles simples.
// Chaque semaine, chaque maillon : 1) reçoit sa livraison, 2) reçoit les commandes de l'aval,
// 3) livre ce qu'il peut (le reste devient un retard de livraison), 4) passe sa commande à l'amont.
// Délai : une commande passée en semaine S arrive au début de la semaine S + 2.
// Coûts : 0,50 € par unité en stock en fin de semaine, 1 € par unité en retard de livraison.

export const STAGES = ['Détaillant', 'Grossiste', 'Distributeur', 'Usine']
export const PLAYER = 1
export const WEEKS = 20
export const LEAD = 2
export const HOLDING = 0.5
export const BACKLOG = 1

export const BEER_PROFILES = {
  classique: { label: 'Classique', text: 'La demande des clients passe d\'un coup de 4 à 8 caisses par semaine à la semaine 5.' },
  stable: { label: 'Stable', text: 'La demande des clients reste à 6 caisses par semaine.' },
  saisonniere: { label: 'Saisonnière', text: 'La demande monte vers un pic au milieu de la partie, puis redescend.' },
  tendance: { label: 'En tendance', text: 'La demande augmente régulièrement de 4 à 8 caisses par semaine.' },
  promotions: { label: 'Avec promotions', text: 'Deux promotions doublent la demande (semaines 5 et 12), suivies d\'un creux.' },
}

// Demande des clients finaux, semaine par semaine
export function customerDemand(profile, weeks = WEEKS) {
  return Array.from({ length: weeks }, (_, w) => {
    switch (profile) {
      case 'stable':
        return 6
      case 'saisonniere':
        return Math.round(6 * (1 - 0.4 * Math.cos((2 * Math.PI * w) / weeks)))
      case 'tendance':
        return Math.round(4 + (4 * w) / (weeks - 1))
      case 'promotions':
        return w === 4 || w === 11 ? 10 : w === 5 || w === 12 ? 3 : 5
      default:
        return w < 4 ? 4 : 8
    }
  })
}

export function newBeerGame(profile = 'classique') {
  const demand = customerDemand(profile)
  const flow = demand[0]
  return {
    profile,
    demand,
    week: 0,
    flow,
    stages: STAGES.map(() => ({
      inv: flow + 2,
      backlog: 0,
      owed: flow * LEAD, // commandes passées, pas encore reçues
      arrivals: { 0: flow, 1: flow },
      incoming: [flow, flow], // dernières commandes reçues de l'aval
      orders: [],
      received: 0,
      shipped: 0,
    })),
    history: [],
  }
}

// Règle des maillons pilotés : prévision = moyenne des 3 dernières commandes reçues,
// niveau cible = 2 semaines de prévision (le délai) + 2 de sécurité ; on commande la prévision + la moitié de l'écart
// entre ce niveau cible et la position de stock (stock − retard + commandes en route).
export function aiOrder(stage, forecastSource) {
  const last = forecastSource.slice(-3)
  const f = last.reduce((a, b) => a + b, 0) / last.length
  const target = Math.round(f * LEAD + 2)
  // on corrige la moitié de l'écart chaque semaine, en plus de la demande prévue
  return Math.max(0, Math.round(f + (target - (stage.inv - stage.backlog + stage.owed)) / 2))
}

// Joue une semaine. `playerOrder` = commande du grossiste. `shared` = true : tous les maillons
// voient la vraie demande des clients (partage d'information) au lieu des seules commandes de l'aval.
export function playBeerWeek(game, playerOrder, shared = false) {
  const t = game.week
  const stages = game.stages.map((s) => ({ ...s, arrivals: { ...s.arrivals }, incoming: [...s.incoming], orders: [...s.orders] }))
  const entry = stages.map(() => ({}))

  // 1) livraisons reçues
  stages.forEach((s, i) => {
    const got = s.arrivals[t] ?? 0
    s.inv += got
    s.owed -= got
    entry[i].received = got
  })
  // 2) commandes reçues de l'aval
  stages.forEach((s, i) => {
    const incoming = i === 0 ? game.demand[t] : (stages[i - 1].orders[t - 1] ?? game.flow)
    s.incoming.push(incoming)
    entry[i].incoming = incoming
  })
  // 3) livraisons vers l'aval
  stages.forEach((s, i) => {
    const need = s.backlog + s.incoming.at(-1)
    const ship = Math.min(s.inv, need)
    s.inv -= ship
    s.backlog = need - ship
    entry[i].shipped = ship
    if (i > 0) stages[i - 1].arrivals[t + 1] = (stages[i - 1].arrivals[t + 1] ?? 0) + ship
  })
  // 4) commandes à l'amont
  const customerSeen = game.demand.slice(0, t + 1)
  stages.forEach((s, i) => {
    const source = shared ? customerSeen : s.incoming
    const qty = i === PLAYER && playerOrder !== null ? Math.max(0, Math.round(playerOrder) || 0) : aiOrder(s, source)
    s.orders[t] = qty
    s.owed += qty
    entry[i].ordered = qty
    if (i === STAGES.length - 1) s.arrivals[t + LEAD] = (s.arrivals[t + LEAD] ?? 0) + qty // l'usine se livre elle-même
    entry[i].inv = s.inv
    entry[i].backlog = s.backlog
    entry[i].cost = s.inv * HOLDING + s.backlog * BACKLOG
  })
  return { ...game, week: t + 1, stages, history: [...game.history, { week: t + 1, demand: game.demand[t], stages: entry }] }
}

// Joue toute la partie automatiquement (comparaisons) : le grossiste suit la règle automatique.
export function simulateAuto(profile, shared) {
  let g = newBeerGame(profile)
  while (g.week < WEEKS) g = playBeerWeek(g, null, shared)
  return g
}

const std = (a) => {
  const m = a.reduce((x, y) => x + y, 0) / a.length
  return Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / a.length)
}

// Résumé : coûts par maillon et effet coup de fouet (écart-type des commandes / écart-type de la demande)
export function summarizeBeer(game) {
  const dStd = std(game.demand.slice(0, game.history.length))
  const stages = STAGES.map((name, i) => {
    const orders = game.history.map((h) => h.stages[i].ordered)
    const cost = game.history.reduce((s, h) => s + h.stages[i].cost, 0)
    const backlogUnits = game.history.reduce((s, h) => s + h.stages[i].backlog, 0)
    const maxInv = Math.max(...game.history.map((h) => h.stages[i].inv))
    return { name, orders, cost, backlogUnits, maxInv, ratio: dStd > 0 ? std(orders) / dStd : 1 }
  })
  return { stages, total: stages.reduce((s, x) => s + x.cost, 0), dStd }
}

// Ce que voit le joueur au début de la semaine, avant de décider (livraison reçue, commande de l'aval, livraison possible)
export function playerView(game) {
  const t = game.week
  const s = game.stages[PLAYER]
  const received = s.arrivals[t] ?? 0
  const incoming = game.stages[PLAYER - 1].orders[t - 1] ?? game.flow
  const inv = s.inv + received
  const need = s.backlog + incoming
  const ship = Math.min(inv, need)
  return {
    received,
    incoming,
    backlogBefore: s.backlog,
    inv,
    ship,
    invAfter: inv - ship,
    backlogAfter: need - ship,
    owed: s.owed - received,
    lastOrder: s.orders[t - 1] ?? game.flow,
  }
}
