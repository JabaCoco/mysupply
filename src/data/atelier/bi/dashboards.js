// Constructeur de tableau de bord (/atelier/bi/tableau) : mises en situation « répondre à une question métier ».
// À chaque essai, les données sont tirées au hasard ; les attentes (visuel, mesure, axe) ne dépendent pas des données.
import { fmt, int, pick, sample } from '../../gen.js'
import { deliveries, SUPPLIERS, WAREHOUSES, CARRIERS } from './helpers.js'
import * as kpi from '../../../lib/biKpi.js'

export const VISUALS = [
  { id: 'card', label: 'Carte', hint: 'Un chiffre clé' },
  { id: 'bar', label: 'Histogramme', hint: 'Comparer des catégories' },
  { id: 'line', label: 'Courbe', hint: 'Évolution dans le temps' },
  { id: 'donut', label: 'Anneau', hint: 'Parts d’un tout (peu de parts)' },
  { id: 'table', label: 'Tableau', hint: 'Détail chiffré' },
  { id: 'slicer', label: 'Segment', hint: 'Filtre cliquable pour la page' },
]

const MOIS = ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin']
const CATEGORIES = ['Emballages', 'Pièces', 'Consommables']

const pctFmt = (v) => `${fmt(v * 100, 1)} %`
export const FORMATS = {
  pct: pctFmt,
  jours: (v) => `${fmt(v, 1)} j`,
  eur: (v) => `${fmt(v, 0)} €`,
  eur2: (v) => `${fmt(v, 2)} €`,
  num: (v) => fmt(v, 0),
  rot: (v) => `${fmt(v, 2)} / mois`,
}

export const FAMILIES = {
  livraisons: {
    table: 'Livraisons',
    make() {
      const sup = sample(SUPPLIERS, 4)
      const wh = sample(WAREHOUSES, 3)
      return MOIS.flatMap((m) => deliveries(10, { suppliers: sup, warehouses: wh }).map((r) => ({ ...r, mois: m, transporteur: pick(CARRIERS) })))
    },
    dims: [
      { id: 'mois', label: 'Mois', order: MOIS },
      { id: 'fournisseur', label: 'Fournisseur' },
      { id: 'entrepot', label: 'Entrepôt' },
      { id: 'transporteur', label: 'Transporteur' },
    ],
    measures: [
      { id: 'otif', label: 'OTIF', fmt: 'pct', fn: kpi.otif, dax: 'OTIF = DIVIDE(COUNTROWS(FILTER(Livraisons, Livraisons[JoursRetard] <= 0 && Livraisons[QteLivrée] >= Livraisons[QteCommandée])), COUNTROWS(Livraisons))', note: 'Livraisons à l’heure ET complètes / toutes les livraisons' },
      { id: 'service', label: 'Taux de service', fmt: 'pct', fn: kpi.tauxService, dax: 'Taux de service = DIVIDE(SUM(Livraisons[QteLivrée]), SUM(Livraisons[QteCommandée]))', note: 'Quantités livrées / quantités commandées' },
      { id: 'retard', label: 'Retard moyen', fmt: 'jours', fn: kpi.retardMoyen, dax: 'Retard moyen = AVERAGE(Livraisons[JoursRetard])', note: 'Moyenne des jours de retard par livraison' },
      { id: 'cout', label: 'Coût de transport', fmt: 'eur', fn: kpi.coutTransport, dax: 'Coût de transport = SUM(Livraisons[CoûtTransport])', note: 'Total des coûts de transport' },
      { id: 'coutUnit', label: 'Coût par unité livrée', fmt: 'eur2', fn: kpi.coutParUnite, dax: 'Coût par unité = DIVIDE(SUM(Livraisons[CoûtTransport]), SUM(Livraisons[QteLivrée]))', note: 'Coût de transport / quantités livrées' },
      { id: 'nb', label: 'Nombre de livraisons', fmt: 'num', fn: kpi.nbLivraisons, dax: 'Nombre de livraisons = COUNTROWS(Livraisons)', note: 'Nombre de lignes de la table' },
    ],
  },
  stocks: {
    table: 'Stocks',
    make() {
      const wh = sample(WAREHOUSES, 3)
      return MOIS.flatMap((m) => wh.flatMap((e) => CATEGORIES.map((c) => ({ mois: m, entrepot: e, categorie: c, coutVentes: int(15, 45) * 1000, stock: int(60, 140) * 1000 }))))
    },
    dims: [
      { id: 'mois', label: 'Mois', order: MOIS },
      { id: 'entrepot', label: 'Entrepôt' },
      { id: 'categorie', label: 'Catégorie' },
    ],
    measures: [
      { id: 'rotation', label: 'Rotation mensuelle', fmt: 'rot', fn: kpi.rotation, dax: 'Rotation mensuelle = DIVIDE(SUM(Stocks[CoûtDesVentes]), SUM(Stocks[Stock]))', note: 'Coût des ventes / stock (en fin de mois)' },
      { id: 'couverture', label: 'Couverture (jours)', fmt: 'jours', fn: (r) => kpi.couverture(r), dax: 'Couverture (jours) = DIVIDE(30, [Rotation mensuelle])', note: '30 jours / rotation mensuelle' },
      { id: 'ventes', label: 'Coût des ventes', fmt: 'eur', fn: kpi.coutVentes, dax: 'Coût des ventes = SUM(Stocks[CoûtDesVentes])', note: 'Total du coût des ventes' },
      { id: 'stockMoy', label: 'Stock moyen', fmt: 'eur', fn: kpi.stockMoyen, dax: 'Stock moyen = DIVIDE(SUM(Stocks[Stock]), DISTINCTCOUNT(Stocks[Mois]))', note: 'Stock total de fin de mois, en moyenne sur les mois' },
    ],
  },
}

// Valeur d'une mesure par valeur d'axe (ordre des mois respecté), sans valeur manquante
export function series(rows, family, measureId, dimId) {
  const fam = FAMILIES[family]
  const m = fam.measures.find((x) => x.id === measureId)
  if (!dimId) return [{ label: 'Total', value: m.fn(rows) }]
  const dim = fam.dims.find((d) => d.id === dimId)
  const keys = dim.order ?? [...new Set(rows.map((r) => r[dimId]))].sort((a, b) => String(a).localeCompare(String(b), 'fr'))
  return keys.map((k) => ({ label: k, value: m.fn(rows.filter((r) => r[dimId] === k)) })).filter((p) => p.value !== null && Number.isFinite(p.value))
}

export const dimValues = (rows, family, dimId) => {
  const dim = FAMILIES[family].dims.find((d) => d.id === dimId)
  return dim.order ?? [...new Set(rows.map((r) => r[dimId]))].sort((a, b) => String(a).localeCompare(String(b), 'fr'))
}

// Points d'un besoin : visuel (2 meilleur / 1 acceptable), mesure (3), axe (1). Un segment n'a pas de mesure.
export function scoreNeed(need, picked) {
  const visual = picked.visual === need.visual ? 2 : need.ok.includes(picked.visual) ? 1 : 0
  const measure = need.measure ? (picked.measure === need.measure ? 3 : 0) : 0
  const dim = (need.dim ?? null) === (picked.dim ?? null) ? 1 : 0
  return { visual, measure, dim, total: visual + measure + dim }
}
export const needMax = (need) => 2 + (need.measure ? 3 : 0) + 1
export const dashboardMax = (d) => d.needs.reduce((s, n) => s + needMax(n), 0)

export const DASHBOARDS = [
  {
    id: 'dash-otif',
    title: 'Le point OTIF du lundi',
    family: 'livraisons',
    context: 'Le responsable logistique veut une page pour son point hebdomadaire : où en est la fiabilité des fournisseurs ?',
    needs: [
      { id: 'n1', ask: 'Afficher en un seul chiffre l’OTIF de la période.', visual: 'card', ok: ['card'], measure: 'otif', dim: null, why: 'Un chiffre clé se montre dans une carte. L’OTIF (à l’heure ET complet) est la mesure de fiabilité demandée.' },
      { id: 'n2', ask: 'Montrer comment l’OTIF évolue de mois en mois.', visual: 'line', ok: ['line', 'bar'], measure: 'otif', dim: 'mois', why: 'Une évolution dans le temps se lit sur une courbe, avec le mois en axe.' },
      { id: 'n3', ask: 'Comparer l’OTIF des fournisseurs pour repérer les moins fiables.', visual: 'bar', ok: ['bar', 'table'], measure: 'otif', dim: 'fournisseur', insight: 'low', why: 'Comparer des catégories (les fournisseurs) = histogramme, avec le fournisseur en axe.' },
    ],
  },
  {
    id: 'dash-transport',
    title: 'Où part le budget transport ?',
    family: 'livraisons',
    context: 'La direction trouve que le transport coûte cher. Elle veut savoir combien, chez qui, et si le coût par unité se dégrade.',
    needs: [
      { id: 'n1', ask: 'Afficher la dépense totale de transport.', visual: 'card', ok: ['card'], measure: 'cout', dim: null, why: 'Un total = une carte, avec la somme des coûts de transport.' },
      { id: 'n2', ask: 'Comparer la dépense de chaque transporteur.', visual: 'bar', ok: ['bar', 'table', 'donut'], measure: 'cout', dim: 'transporteur', insight: 'high', why: 'Comparer des transporteurs = histogramme avec le transporteur en axe et la somme des coûts en valeur.' },
      { id: 'n3', ask: 'Suivre le coût par unité livrée mois par mois.', visual: 'line', ok: ['line', 'bar'], measure: 'coutUnit', dim: 'mois', why: 'Le coût par unité (et non le coût total) neutralise l’effet des volumes ; l’évolution se lit sur une courbe.' },
    ],
  },
  {
    id: 'dash-retards',
    title: 'Fournisseurs en retard',
    family: 'livraisons',
    context: 'Les acheteurs préparent une réunion de recadrage avec les fournisseurs. Ils veulent savoir qui retarde et pouvoir filtrer par entrepôt.',
    needs: [
      { id: 'n1', ask: 'Identifier les fournisseurs dont le retard moyen est le plus élevé.', visual: 'bar', ok: ['bar', 'table'], measure: 'retard', dim: 'fournisseur', insight: 'high', why: 'Comparer des fournisseurs sur une moyenne de jours de retard : histogramme, fournisseur en axe.' },
      { id: 'n2', ask: 'Permettre de filtrer toute la page par entrepôt.', visual: 'slicer', ok: [], measure: null, dim: 'entrepot', why: 'Un filtre interactif pour toute la page est un segment, branché sur la dimension Entrepôt.' },
      { id: 'n3', ask: 'Lister, en détail chiffré, le nombre de livraisons par fournisseur.', visual: 'table', ok: ['bar'], measure: 'nb', dim: 'fournisseur', why: 'Un détail chiffré se lit dans un tableau ; le nombre de livraisons est un comptage de lignes.' },
    ],
  },
  {
    id: 'dash-service',
    title: 'Le taux de service client',
    family: 'livraisons',
    context: 'Le service client reçoit des plaintes sur les livraisons incomplètes. Il veut suivre le taux de service et pouvoir isoler un transporteur.',
    needs: [
      { id: 'n1', ask: 'Afficher le taux de service global de la période.', visual: 'card', ok: ['card'], measure: 'service', dim: null, why: 'Un chiffre clé = carte ; le taux de service compare quantités livrées et commandées.' },
      { id: 'n2', ask: 'Montrer l’évolution du taux de service mois par mois.', visual: 'line', ok: ['line', 'bar'], measure: 'service', dim: 'mois', why: 'Évolution dans le temps = courbe, mois en axe.' },
      { id: 'n3', ask: 'Permettre de filtrer la page par transporteur.', visual: 'slicer', ok: [], measure: null, dim: 'transporteur', why: 'Segment sur la dimension Transporteur.' },
    ],
  },
  {
    id: 'dash-stock',
    title: 'La santé des stocks',
    family: 'stocks',
    context: 'Le directeur des opérations veut savoir si les stocks tournent assez vite et dans quels entrepôts.',
    needs: [
      { id: 'n1', ask: 'Afficher la rotation mensuelle des stocks, tous entrepôts confondus.', visual: 'card', ok: ['card'], measure: 'rotation', dim: null, why: 'Chiffre clé = carte ; la rotation compare le coût des ventes au stock.' },
      { id: 'n2', ask: 'Repérer quel entrepôt fait tourner son stock le moins vite.', visual: 'bar', ok: ['bar', 'table'], measure: 'rotation', dim: 'entrepot', insight: 'low', why: 'Comparer des entrepôts : histogramme avec l’entrepôt en axe et la rotation en valeur.' },
      { id: 'n3', ask: 'Suivre le stock moyen mois par mois.', visual: 'line', ok: ['line', 'bar'], measure: 'stockMoy', dim: 'mois', why: 'Évolution dans le temps = courbe ; le stock moyen est l’indicateur demandé.' },
    ],
  },
  {
    id: 'dash-couverture',
    title: 'Combien de jours de couverture ?',
    family: 'stocks',
    context: 'Avant un pic d’activité, la direction veut savoir combien de jours de ventes les stocks couvrent, et d’où viennent les coûts.',
    needs: [
      { id: 'n1', ask: 'Afficher la couverture de stock en jours.', visual: 'card', ok: ['card'], measure: 'couverture', dim: null, why: 'Chiffre clé = carte ; la couverture en jours = 30 / rotation mensuelle.' },
      { id: 'n2', ask: 'Comparer la couverture des trois catégories de produits.', visual: 'bar', ok: ['bar', 'table'], measure: 'couverture', dim: 'categorie', insight: 'low', why: 'Comparer des catégories = histogramme, catégorie en axe.' },
      { id: 'n3', ask: 'Montrer la part de chaque catégorie dans le coût des ventes.', visual: 'donut', ok: ['bar', 'table'], measure: 'ventes', dim: 'categorie', why: 'Des parts d’un tout (3 catégories seulement) : un anneau convient ; la valeur est le coût des ventes.' },
    ],
  },
]

export const findDashboard = (id) => DASHBOARDS.find((d) => d.id === id)
export const makeDashboardData = (d) => FAMILIES[d.family].make()
