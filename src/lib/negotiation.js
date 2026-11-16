// Atelier « Négociation avec un fournisseur ».
// L'acheteur dispose de 5 « leviers » à jouer dans l'ordre de son choix. Chaque levier fait bouger le prix
// et/ou une condition (paiement, délai de livraison, engagement de volume). Le fournisseur ne descend jamais
// sous son prix plancher. Le score compare le coût total annuel obtenu au meilleur coût possible.

export const MAX_ROUNDS = 5

const rnd = (a, b, step = 1) => a + step * Math.floor(Math.random() * (Math.floor((b - a) / step) + 1))
const pick = (a) => a[Math.floor(Math.random() * a.length)]

const PRODUCTS = ['des composants électroniques', 'des cartons d\'emballage', 'des palettes plastique', 'des pièces usinées', 'des films étirables', 'des étiquettes thermiques']

export function generateNegotiation() {
  const price = pick([5, 8, 12, 15, 20, 30]) + rnd(0, 9) / 10
  const floorDiscount = rnd(7, 12) / 100
  const hasCompetitor = Math.random() < 0.6
  return {
    product: pick(PRODUCTS),
    need: rnd(20, 120, 10) * 1000, // besoin annuel (unités)
    price, // prix catalogue, € l'unité
    floor: Math.round(price * (1 - floorDiscount) * 100) / 100, // prix plancher du fournisseur (caché)
    competitor: hasCompetitor ? Math.round(price * (1 - rnd(3, 7) / 100) * 100) / 100 : null, // devis concurrent (caché tant qu'on n'a pas fait de benchmark)
    rate: rnd(5, 8) / 100, // coût de l'argent
    holding: rnd(15, 25) / 100, // coût de possession du stock
    pay0: 45, // délai de paiement proposé au départ (jours)
    lead0: 10, // délai de livraison de départ (jours)
  }
}

export const LEVERS = [
  { id: 'bench', label: 'Faire un benchmark des prix du marché', hint: 'Prépare ta négociation : te renseigne sur les offres concurrentes et le prix réel du marché.' },
  { id: 'remise', label: 'Demander une remise sur le prix', hint: 'Une demande directe. Plus efficace quand tu as des arguments chiffrés.' },
  { id: 'vol90', label: "S'engager sur 90 % du besoin annuel", hint: 'Un engagement de volume prudent, que tu es sûr de tenir.' },
  { id: 'vol120', label: "S'engager sur 120 % du besoin annuel", hint: 'Plus de volume contre un meilleur prix… mais tu paieras ce que tu ne consommes pas.' },
  { id: 'pay15', label: 'Payer à 15 jours au lieu de 45', hint: 'Le fournisseur encaisse plus vite, mais ta trésorerie en souffre.' },
  { id: 'lead', label: 'Accepter 10 jours de délai de livraison en plus', hint: 'Plus de souplesse pour lui, plus de stock à prévoir pour toi.' },
  { id: 'concurrent', label: 'Mettre en avant un devis concurrent', hint: 'Très efficace si le devis existe… très risqué si tu bluffes.' },
]

export const initialState = (s) => ({ price: s.price, pay: s.pay0, lead: s.lead0, commit: 1, bench: false, bluff: false, used: [], log: [] })

const euros = (n) => `${n.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} €`
const pct = (n) => `${(n * 100).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %`

// Applique un levier. Renvoie le nouvel état (avec la réponse du fournisseur dans `log`).
export function applyLever(s, state, id, withLog = true) {
  if (state.used.includes(id) || state.used.length >= MAX_ROUNDS) return state
  const next = { ...state, used: [...state.used, id], commit: state.commit }
  const cut = (delta) => {
    const eff = delta * (state.bluff ? 0.5 : 1)
    const target = state.price * (1 - eff)
    next.price = Math.max(s.floor, Math.round(target * 100) / 100)
    return state.price - next.price
  }
  let reply = ''
  if (id === 'bench') {
    next.bench = true
    reply = s.competitor
      ? `Ton benchmark est solide : un concurrent propose ${euros(s.competitor)} l'unité. Le fournisseur le sait désormais.`
      : `Ton benchmark montre que ton prix catalogue (${euros(s.price)}) est dans la moyenne du marché : pas de concurrent moins cher. Tu as des arguments chiffrés pour la suite.`
  } else if (id === 'remise') {
    const delta = state.bench ? 0.04 : 0.015
    const d = cut(delta)
    reply = d > 0 ? `Le fournisseur accorde ${pct(delta)} : nouveau prix ${euros(next.price)}.${state.bench ? '' : ' Sans arguments chiffrés, il ne va pas plus loin.'}` : 'Le fournisseur refuse : il est déjà à son prix le plus bas.'
  } else if (id === 'vol90') {
    if (state.commit !== 1) reply = 'Tu as déjà proposé un engagement de volume : le fournisseur ne le compte qu\'une fois.'
    else {
      next.commit = 0.9
      cut(0.02)
      reply = `Le fournisseur apprécie la visibilité : ${pct(0.02)} de remise pour un engagement sur 90 % du besoin. Prix ${euros(next.price)}.`
    }
  } else if (id === 'vol120') {
    if (state.commit !== 1) reply = 'Tu as déjà proposé un engagement de volume : le fournisseur ne le compte qu\'une fois.'
    else {
      next.commit = 1.2
      cut(0.035)
      reply = `Le fournisseur est ravi : ${pct(0.035)} de remise pour un engagement sur 120 % du besoin. Prix ${euros(next.price)}. Attention : tu paieras les 20 % que tu ne consommeras pas.`
    }
  } else if (id === 'pay15') {
    next.pay = 15
    cut(0.03)
    reply = `Le fournisseur encaisse 30 jours plus tôt : il accorde ${pct(0.03)}. Prix ${euros(next.price)}, paiement à 15 jours.`
  } else if (id === 'lead') {
    next.lead = state.lead + 10
    cut(0.015)
    reply = `Plus de souplesse de production : ${pct(0.015)} de remise. Prix ${euros(next.price)}, livraison sous ${next.lead} jours.`
  } else if (id === 'concurrent') {
    if (s.competitor) {
      const target = Math.round(s.competitor * 0.99 * 100) / 100
      next.price = Math.max(s.floor, Math.min(state.price, target))
      reply = next.price < state.price ? `Le fournisseur s'aligne presque sur le concurrent : prix ${euros(next.price)}.` : 'Le fournisseur est déjà moins cher que le devis concurrent.'
    } else {
      next.bluff = true
      reply = 'Le fournisseur vérifie : il n\'y a pas de devis concurrent à ce prix. Tu perds en crédibilité : ses concessions suivantes seront réduites de moitié.'
    }
  }
  if (withLog) next.log = [...state.log, { id, reply }]
  return next
}

// Coût total annuel (€) : achat + stock lié au délai + engagement non consommé − avantage de trésorerie du délai de paiement
export function totalCost(s, state) {
  const base = state.price * s.need
  const financing = base * (state.pay / 365) * s.rate
  const leadCost = base * (state.lead / 365) * s.holding
  const penalty = state.price * Math.max(0, state.commit * s.need - s.need)
  return { base, financing, leadCost, penalty, total: base - financing + leadCost + penalty }
}

export const playSequence = (s, seq, withLog = true) => seq.reduce((st, id) => applyLever(s, st, id, withLog), initialState(s))

// Meilleur enchaînement possible : on essaie tous les ordres de 0 à 5 leviers parmi 7
const sameState = (a, b) => a.price === b.price && a.pay === b.pay && a.lead === b.lead && a.commit === b.commit && a.bench === b.bench && a.bluff === b.bluff
const bestCache = new WeakMap()
export function bestSequence(s) {
  if (bestCache.has(s)) return bestCache.get(s)
  const start = initialState(s)
  let best = { seq: [], total: totalCost(s, start).total }
  const ids = LEVERS.map((l) => l.id)
  const walk = (seq, state) => {
    const total = totalCost(s, state).total
    if (total < best.total - 1e-9) best = { seq, total }
    if (seq.length >= MAX_ROUNDS) return
    for (const id of ids) {
      if (seq.includes(id)) continue
      const next = applyLever(s, state, id, false)
      if (sameState(next, state)) continue // levier sans effet : on ne le garde pas
      walk([...seq, id], next)
    }
  }
  walk([], start)
  bestCache.set(s, best)
  return best
}

// Score sur 100 : part de l'économie maximale possible
export function scoreNegotiation(s, state) {
  const start = totalCost(s, initialState(s)).total
  const best = bestSequence(s).total
  const mine = totalCost(s, state).total
  if (start - best <= 0) return 100
  return Math.max(0, Math.min(100, Math.round(((start - mine) / (start - best)) * 100)))
}
