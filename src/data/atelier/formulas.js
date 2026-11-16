// Mini-formations des calculateurs : un cours court + des générateurs d'exercices.
// Chaque générateur tire des chiffres au hasard et calcule lui-même la réponse et la correction.
//
// Exercice généré = {
//   kind: 'number' | 'choice',
//   statement, data: [[libellé, valeur], …], question,
//   answer (nombre, ou index du bon choix), unit, tolerance (écart accepté), choices (si 'choice'),
//   steps: [lignes de la correction pas à pas], conclusion
// }
import { INCOTERMS, INCOTERM_ROWS, isSeller } from './incoterms.js'

// ---------- Outils ----------
const fmt = (n, d = 2) => n.toLocaleString('fr-FR', { maximumFractionDigits: d })
const eur = (n, d = 2) => `${fmt(n, d)} €`
const int = (min, max, step = 1) => min + step * Math.floor(Math.random() * (Math.floor((max - min) / step) + 1))
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
// Mélange des choix, en gardant la trace de la bonne réponse
function choiceSet(correct, wrongs) {
  const all = [correct, ...wrongs].map((text, i) => ({ text, ok: i === 0 }))
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  return { choices: all.map((c) => c.text), answer: all.findIndex((c) => c.ok) }
}
const Z = [
  [90, 1.28],
  [95, 1.65],
  [99, 2.33],
]

// Liste et titres des formules (dans l'ordre d'affichage)
export const FORMULA_LIST = [
  { id: 'stock-securite', title: 'Stock de sécurité et point de commande', short: 'SS = z × σ × √L' },
  { id: 'wilson', title: 'Quantité économique (Wilson)', short: 'Q* = √(2DS/H)' },
  { id: 'abc', title: 'Analyse ABC', short: 'Classement 80 / 15 / 5' },
  { id: 'rotation', title: 'Rotation et couverture', short: 'Conso / stock moyen' },
  { id: 'otif', title: 'OTIF et taux de service', short: "À l'heure ET complet" },
  { id: 'tco', title: 'Comparateur TCO', short: 'Le vrai coût de 2 fournisseurs' },
  { id: 'incoterms', title: 'Incoterms 2020', short: 'Qui paie quoi ?' },
]

// =====================================================================
export const FORMULAS = {
  // ------------------------------------------------------------------
  'stock-securite': {
    purpose:
      "Le **stock de sécurité** protège contre les variations de la demande pendant le délai de livraison : sans lui, une semaine de ventes plus fortes que prévu provoque une rupture. Le **point de commande** est le niveau de stock auquel on doit repasser commande pour être livré avant d'être à court.",
    formulas: ['SS = z × σ × √L', 'PC = D × L + SS'],
    terms: [
      ['SS', 'Stock de sécurité, en unités.'],
      ['z', 'Coefficient du taux de service visé : 1,28 pour 90 %, 1,65 pour 95 %, 2,33 pour 99 %.'],
      ['σ', 'Écart-type de la demande par période : mesure à quel point la demande varie.'],
      ['L', "Délai d'approvisionnement, dans la même unité de temps que σ (jours, semaines…)."],
      ['D', 'Demande moyenne par période.'],
      ['PC', 'Point de commande : quand le stock descend à ce niveau, on commande.'],
    ],
    example: {
      statement: 'Demande moyenne 80 unités/jour, écart-type 15 unités/jour, délai 9 jours, taux de service visé 95 %.',
      steps: [
        'z = 1,65 (95 %) et √L = √9 = 3',
        'SS = 1,65 × 15 × 3 = 74,25 → 75 unités (on arrondit au-dessus)',
        'PC = D × L + SS = 80 × 9 + 74,25 = 794,25 → 795 unités',
      ],
      result: 'On repasse commande dès que le stock descend à 795 unités.',
    },
    exercises: [
      () => {
        const sigma = int(10, 40)
        const L = pick([4, 6, 9, 10, 16])
        const [rate, z] = pick(Z)
        const ss = z * sigma * Math.sqrt(L)
        return {
          kind: 'number',
          statement: 'Calcule le stock de sécurité.',
          data: [['Taux de service visé', `${rate} % (z = ${fmt(z)})`], ['Écart-type de la demande σ', `${sigma} unités / jour`], ['Délai L', `${L} jours`]],
          question: 'Stock de sécurité (en unités) ?',
          answer: ss,
          unit: 'unités',
          tolerance: 1,
          steps: [`√L = √${L} = ${fmt(Math.sqrt(L), 3)}`, `SS = z × σ × √L = ${fmt(z)} × ${sigma} × ${fmt(Math.sqrt(L), 3)} = ${fmt(ss)}`],
          conclusion: `Soit ${Math.ceil(ss)} unités en arrondissant au-dessus.`,
        }
      },
      () => {
        const D = int(50, 300, 10)
        const L = int(2, 10)
        const ss = int(20, 150, 5)
        const pc = D * L + ss
        return {
          kind: 'number',
          statement: 'Le stock de sécurité est déjà calculé. Trouve le point de commande.',
          data: [['Demande moyenne D', `${D} unités / jour`], ['Délai L', `${L} jours`], ['Stock de sécurité', `${ss} unités`]],
          question: 'Point de commande (en unités) ?',
          answer: pc,
          unit: 'unités',
          tolerance: 0.5,
          steps: [`Consommation pendant le délai : D × L = ${D} × ${L} = ${D * L}`, `PC = ${D * L} + ${ss} = ${pc}`],
          conclusion: `On commande dès que le stock atteint ${pc} unités.`,
        }
      },
      () => {
        const D = int(200, 800, 50)
        const sigma = int(30, 120, 10)
        const L = pick([2, 3, 4])
        const ss = 1.65 * sigma * Math.sqrt(L)
        const pc = D * L + ss
        return {
          kind: 'number',
          statement: 'Données hebdomadaires, taux de service 95 % (z = 1,65). Calcule directement le point de commande.',
          data: [['Demande moyenne D', `${D} unités / semaine`], ['Écart-type σ', `${sigma} unités / semaine`], ['Délai L', `${L} semaines`]],
          question: 'Point de commande (en unités) ?',
          answer: pc,
          unit: 'unités',
          tolerance: 2,
          steps: [
            `SS = 1,65 × ${sigma} × √${L} = 1,65 × ${sigma} × ${fmt(Math.sqrt(L), 3)} = ${fmt(ss)}`,
            `PC = D × L + SS = ${D} × ${L} + ${fmt(ss)} = ${fmt(pc)}`,
          ],
          conclusion: 'σ et L sont tous les deux en semaines : les unités sont cohérentes.',
        }
      },
      () => {
        const D = int(40, 120, 10)
        const L = int(3, 8)
        const ss = int(30, 100, 10)
        const pc = D * L + ss
        const stock = pc + pick([-1, 1]) * int(10, 80, 10)
        const order = stock <= pc
        return {
          kind: 'choice',
          statement: 'Tu fais le point sur ton stock ce matin.',
          data: [['Stock actuel', `${stock} unités`], ['Demande moyenne', `${D} unités / jour`], ['Délai', `${L} jours`], ['Stock de sécurité', `${ss} unités`]],
          question: 'Faut-il passer commande aujourd\'hui ?',
          ...choiceSet(order ? 'Oui, il faut commander' : 'Non, pas encore', [order ? 'Non, pas encore' : 'Oui, il faut commander']),
          steps: [`PC = ${D} × ${L} + ${ss} = ${pc}`, `Stock actuel ${stock} ${order ? '≤' : '>'} PC ${pc}`],
          conclusion: order ? 'Le stock est au niveau du point de commande ou en dessous : on commande.' : 'Le stock est encore au-dessus du point de commande : on attend.',
        }
      },
    ],
  },

  // ------------------------------------------------------------------
  wilson: {
    purpose:
      "La formule de **Wilson** donne la **quantité économique de commande** (EOQ) : celle qui rend minimal le total « coût de passation + coût de possession ». Commander souvent coûte cher en commandes ; commander en gros coûte cher en stock.",
    formulas: ['Q* = √(2 × D × S / H)', 'H = prix unitaire × taux de possession', 'N = D / Q*'],
    terms: [
      ['Q*', 'Quantité économique à commander à chaque fois.'],
      ['D', 'Demande annuelle, en unités.'],
      ['S', 'Coût de passation d\'une commande (administratif, transport, réception), en €.'],
      ['H', "Coût de possession d'une unité pendant un an, en €."],
      ['N', 'Nombre de commandes par an.'],
      ['Coût total', 'Coût annuel = (D / Q) × S + (Q / 2) × H. Au point Q*, les deux parties sont égales.'],
    ],
    example: {
      statement: 'Demande 12 000 unités/an, 50 € par commande, prix 10 €, taux de possession 20 %/an.',
      steps: [
        'H = 10 × 20 % = 2 € par unité et par an',
        'Q* = √(2 × 12 000 × 50 / 2) = √600 000 ≈ 775 unités',
        'N = 12 000 / 775 ≈ 15,5 commandes par an',
        'Coût total ≈ 15,5 × 50 + (775 / 2) × 2 ≈ 775 + 775 = 1 550 €',
      ],
      result: 'On commande environ 775 unités, une quinzaine de fois par an.',
    },
    exercises: [
      () => {
        const D = int(2000, 40000, 500)
        const S = int(20, 200, 10)
        const H = pick([0.5, 1, 2, 4, 5])
        const q = Math.sqrt((2 * D * S) / H)
        return {
          kind: 'number',
          statement: 'Calcule la quantité économique.',
          data: [['Demande annuelle D', `${fmt(D)} unités`], ['Coût par commande S', eur(S)], ['Coût de possession H', `${eur(H)} / unité / an`]],
          question: 'Q* (en unités) ?',
          answer: q,
          unit: 'unités',
          tolerance: 2,
          steps: [`2 × D × S / H = 2 × ${fmt(D)} × ${S} / ${fmt(H)} = ${fmt((2 * D * S) / H)}`, `Q* = √${fmt((2 * D * S) / H)} = ${fmt(q)}`],
          conclusion: `On commande environ ${Math.round(q)} unités à la fois.`,
        }
      },
      () => {
        const D = int(1000, 20000, 500)
        const S = int(30, 150, 10)
        const price = int(5, 80)
        const rate = pick([15, 20, 25, 30])
        const H = (price * rate) / 100
        const q = Math.sqrt((2 * D * S) / H)
        return {
          kind: 'number',
          statement: "Le coût de possession n'est pas donné directement : calcule-le d'abord.",
          data: [['Demande annuelle D', `${fmt(D)} unités`], ['Coût par commande S', eur(S)], ['Prix unitaire', eur(price)], ['Taux de possession', `${rate} % par an`]],
          question: 'Q* (en unités) ?',
          answer: q,
          unit: 'unités',
          tolerance: 2,
          steps: [`H = ${price} × ${rate} % = ${fmt(H)} €`, `Q* = √(2 × ${fmt(D)} × ${S} / ${fmt(H)}) = √${fmt((2 * D * S) / H)} = ${fmt(q)}`],
          conclusion: 'Attention à ne pas oublier de transformer le taux en euros avant d\'appliquer la formule.',
        }
      },
      () => {
        const D = int(3000, 30000, 1000)
        const q = int(200, 1500, 50)
        const n = D / q
        return {
          kind: 'number',
          statement: 'La quantité commandée est fixée. Combien de commandes faut-il passer dans l\'année ?',
          data: [['Demande annuelle D', `${fmt(D)} unités`], ['Quantité par commande Q', `${q} unités`]],
          question: 'Nombre de commandes par an ?',
          answer: n,
          unit: 'commandes',
          tolerance: 0.1,
          steps: [`N = D / Q = ${fmt(D)} / ${q} = ${fmt(n)}`],
          conclusion: `Soit environ une commande toutes les ${fmt(52 / n, 1)} semaines.`,
        }
      },
      () => {
        const D = int(2000, 20000, 1000)
        const S = int(40, 120, 10)
        const H = pick([1, 2, 3, 4])
        const q = int(300, 1200, 100)
        const order = (D / q) * S
        const holding = (q / 2) * H
        return {
          kind: 'number',
          statement: 'Calcule le coût annuel total (passation + possession) pour cette quantité.',
          data: [['Demande annuelle D', `${fmt(D)} unités`], ['Coût par commande S', eur(S)], ['Coût de possession H', `${eur(H)} / unité / an`], ['Quantité commandée Q', `${q} unités`]],
          question: 'Coût total annuel (en €) ?',
          answer: order + holding,
          unit: '€',
          tolerance: 2,
          steps: [
            `Passation = (D / Q) × S = (${fmt(D)} / ${q}) × ${S} = ${eur(order)}`,
            `Possession = (Q / 2) × H = (${q} / 2) × ${H} = ${eur(holding)}`,
            `Total = ${eur(order)} + ${eur(holding)} = ${eur(order + holding)}`,
          ],
          conclusion: `Q* serait ici ${Math.round(Math.sqrt((2 * D * S) / H))} : ${order > holding ? 'on commande trop peu à la fois' : order < holding ? 'on commande trop gros' : "c'est l'optimum"}.`,
        }
      },
    ],
  },

  // ------------------------------------------------------------------
  abc: {
    purpose:
      "L'**analyse ABC** (loi de Pareto) classe les articles selon leur poids dans la valeur consommée, pour concentrer les efforts de gestion sur les plus importants. En général, environ 20 % des articles font 80 % de la valeur.",
    formulas: ['Valeur = consommation annuelle × prix unitaire', 'Part (%) = valeur de l\'article / valeur totale × 100', 'Cumul (%) = somme des parts, du plus grand au plus petit'],
    terms: [
      ['Classe A', 'Les articles tant que le cumul avant eux est sous 80 % : suivi très serré.'],
      ['Classe B', 'Les suivants, jusqu\'à environ 95 % : suivi normal.'],
      ['Classe C', 'Le reste (beaucoup d\'articles, peu de valeur) : gestion simplifiée.'],
    ],
    example: {
      statement: 'Trois articles : X = 600 u. × 10 € ; Y = 100 u. × 20 € ; Z = 1 000 u. × 1 €.',
      steps: [
        'Valeurs : X = 6 000 €, Y = 2 000 €, Z = 1 000 € → total 9 000 €',
        'Parts : X = 66,7 %, Y = 22,2 %, Z = 11,1 %',
        'Cumuls : X = 66,7 %, Y = 88,9 %, Z = 100 %',
        'X : cumul avant = 0 % → A ; Y : cumul avant = 66,7 % → A ; Z : cumul avant = 88,9 % → B',
      ],
      result: 'X et Y en A, Z en B (sur un vrai stock, il y a des centaines d\'articles et les trois classes).',
    },
    exercises: [
      () => {
        const conso = int(100, 5000, 50)
        const price = pick([0.5, 1.2, 2.5, 8, 15, 42, 120])
        return {
          kind: 'number',
          statement: 'Première étape de toute analyse ABC : la valeur consommée.',
          data: [['Consommation annuelle', `${fmt(conso)} unités`], ['Prix unitaire', eur(price)]],
          question: 'Valeur consommée (en €) ?',
          answer: conso * price,
          unit: '€',
          tolerance: 0.5,
          steps: [`Valeur = ${fmt(conso)} × ${fmt(price)} = ${eur(conso * price)}`],
          conclusion: 'On fait ce calcul pour chaque article avant de les trier.',
        }
      },
      () => {
        const values = [int(20, 60, 5), int(8, 20, 1), int(4, 10, 1), int(1, 4, 1), int(1, 3, 1)].map((v) => v * 1000)
        const total = values.reduce((a, b) => a + b, 0)
        const share = (values[0] / total) * 100
        return {
          kind: 'number',
          statement: 'Voici la valeur consommée de 5 articles.',
          data: values.map((v, i) => [`Article ${String.fromCharCode(65 + i + 15)}`, eur(v, 0)]),
          question: `Quelle part de la valeur totale représente l'article P (en %) ?`,
          answer: share,
          unit: '%',
          tolerance: 0.5,
          steps: [`Total = ${values.map((v) => fmt(v)).join(' + ')} = ${eur(total, 0)}`, `Part de P = ${fmt(values[0])} / ${fmt(total)} × 100 = ${fmt(share, 1)} %`],
          conclusion: share >= 50 ? 'Un seul article pèse plus de la moitié de la valeur : il est forcément en classe A.' : 'C\'est le plus gros article : il sera en classe A.',
        }
      },
      () => {
        const before = pick([42, 63, 71, 78, 84, 89, 93, 96, 98])
        const own = int(2, 9)
        const cls = before < 80 ? 'A' : before < 95 ? 'B' : 'C'
        return {
          kind: 'choice',
          statement: 'Les articles sont triés par valeur décroissante. On regarde l\'article n° 7.',
          data: [['Cumul des articles 1 à 6', `${before} %`], ['Part de l\'article 7', `${own} %`], ['Cumul après l\'article 7', `${before + own > 100 ? 100 : before + own} %`]],
          question: 'Dans quelle classe va l\'article 7 ?',
          ...choiceSet(`Classe ${cls}`, ['A', 'B', 'C'].filter((c) => c !== cls).map((c) => `Classe ${c}`)),
          steps: [`Règle : on regarde le cumul AVANT l'article (${before} %).`, `${before} % ${before < 80 ? '< 80 % → A' : before < 95 ? 'est entre 80 et 95 % → B' : '≥ 95 % → C'}`],
          conclusion: `L'article 7 est en classe ${cls}.`,
        }
      },
    ],
  },

  // ------------------------------------------------------------------
  rotation: {
    purpose:
      'La **rotation** mesure combien de fois le stock se renouvelle dans l\'année ; la **couverture** indique combien de jours on peut tenir avec le stock actuel. Ce sont deux façons de voir si le stock est léger ou trop lourd.',
    formulas: ['Rotation = consommation annuelle / stock moyen', 'Stock moyen = (stock initial + stock final) / 2', 'Couverture (jours) = stock / consommation par jour ≈ 365 / rotation'],
    terms: [
      ['Consommation annuelle', 'Sorties de l\'année, valorisées au coût (pas au prix de vente).'],
      ['Stock moyen', 'Stock moyen sur la période, dans la même unité (€ ou unités).'],
      ['Couverture', 'Nombre de jours de consommation que le stock permet de couvrir.'],
    ],
    example: {
      statement: 'Consommation annuelle 1 200 000 €, stock au 1er janvier 180 000 €, au 31 décembre 220 000 €.',
      steps: ['Stock moyen = (180 000 + 220 000) / 2 = 200 000 €', 'Rotation = 1 200 000 / 200 000 = 6', 'Couverture ≈ 365 / 6 ≈ 61 jours'],
      result: 'Le stock tourne 6 fois par an, soit environ 2 mois de stock.',
    },
    exercises: [
      () => {
        const conso = int(400, 3000, 100) * 1000
        const stock = int(50, 500, 10) * 1000
        const rot = conso / stock
        return {
          kind: 'number',
          statement: 'Calcule la rotation du stock.',
          data: [['Consommation annuelle (au coût)', eur(conso, 0)], ['Stock moyen', eur(stock, 0)]],
          question: 'Rotation (fois par an) ?',
          answer: rot,
          unit: 'fois / an',
          tolerance: 0.05,
          steps: [`Rotation = ${fmt(conso)} / ${fmt(stock)} = ${fmt(rot)}`],
          conclusion: `Le stock se renouvelle ${fmt(rot, 1)} fois par an.`,
        }
      },
      () => {
        const stock = int(500, 8000, 100)
        const daily = int(20, 400, 10)
        return {
          kind: 'number',
          statement: 'Combien de jours peux-tu tenir sans réapprovisionnement ?',
          data: [['Stock actuel', `${fmt(stock)} unités`], ['Consommation moyenne', `${daily} unités / jour`]],
          question: 'Couverture (en jours) ?',
          answer: stock / daily,
          unit: 'jours',
          tolerance: 0.5,
          steps: [`Couverture = ${fmt(stock)} / ${daily} = ${fmt(stock / daily, 1)} jours`],
          conclusion: 'On compare souvent ce chiffre au délai fournisseur : s\'il est plus court, il faut commander vite.',
        }
      },
      () => {
        const rot = pick([4, 5, 6, 8, 10, 12, 15])
        return {
          kind: 'number',
          statement: 'La rotation annuelle est connue.',
          data: [['Rotation', `${rot} fois par an`]],
          question: 'Couverture approximative (en jours) ?',
          answer: 365 / rot,
          unit: 'jours',
          tolerance: 1,
          steps: [`Couverture ≈ 365 / rotation = 365 / ${rot} = ${fmt(365 / rot, 1)} jours`],
          conclusion: 'Plus la rotation est élevée, plus la couverture est courte.',
        }
      },
      () => {
        const si = int(100, 400, 10) * 1000
        const sf = int(100, 400, 10) * 1000
        const conso = int(800, 4000, 100) * 1000
        const avg = (si + sf) / 2
        return {
          kind: 'number',
          statement: 'Le stock moyen n\'est pas donné : calcule-le à partir des stocks de début et de fin d\'année.',
          data: [['Stock au 1er janvier', eur(si, 0)], ['Stock au 31 décembre', eur(sf, 0)], ['Consommation annuelle', eur(conso, 0)]],
          question: 'Rotation (fois par an) ?',
          answer: conso / avg,
          unit: 'fois / an',
          tolerance: 0.05,
          steps: [`Stock moyen = (${fmt(si)} + ${fmt(sf)}) / 2 = ${eur(avg, 0)}`, `Rotation = ${fmt(conso)} / ${fmt(avg)} = ${fmt(conso / avg)}`],
          conclusion: `Couverture correspondante ≈ ${fmt(365 / (conso / avg), 0)} jours.`,
        }
      },
    ],
  },

  // ------------------------------------------------------------------
  otif: {
    purpose:
      "L'**OTIF** (On Time In Full) mesure la part des commandes livrées **à l'heure ET complètes**. Le **taux de service** mesure la part des commandes servies sans rupture. Ce sont les indicateurs n° 1 de la qualité de service.",
    formulas: ['OTIF = commandes à l\'heure ET complètes / commandes totales × 100', 'Taux de service = commandes servies sans rupture / commandes totales × 100'],
    terms: [
      ['On Time', 'Livrée à la date promise.'],
      ['In Full', 'Livrée en totalité : bons articles, bonnes quantités.'],
      ['Règle', "L'OTIF est toujours ≤ au taux « à l'heure » et ≤ au taux « complet »."],
    ],
    example: {
      statement: "1 000 commandes : 950 à l'heure, 960 complètes, 920 à l'heure ET complètes.",
      steps: ["On Time = 950 / 1 000 = 95 %", 'In Full = 960 / 1 000 = 96 %', 'OTIF = 920 / 1 000 = 92 %'],
      result: "L'OTIF (92 %) est plus bas que chacun des deux taux : c'est normal, il est plus exigeant.",
    },
    exercises: [
      () => {
        const total = int(200, 2000, 50)
        const both = Math.round(total * (int(80, 98) / 100))
        return {
          kind: 'number',
          statement: 'Calcule l\'OTIF du mois.',
          data: [['Commandes livrées', fmt(total)], ["Dont à l'heure ET complètes", fmt(both)]],
          question: 'OTIF (en %) ?',
          answer: (both / total) * 100,
          unit: '%',
          tolerance: 0.1,
          steps: [`OTIF = ${both} / ${total} × 100 = ${fmt((both / total) * 100, 1)} %`],
          conclusion: 'On ne garde que les commandes qui sont à la fois à l\'heure et complètes.',
        }
      },
      () => {
        const total = int(300, 3000, 100)
        const ruptures = int(5, Math.round(total * 0.1))
        return {
          kind: 'number',
          statement: 'Certaines commandes n\'ont pas pu être servies à cause de ruptures.',
          data: [['Commandes reçues', fmt(total)], ['Commandes touchées par une rupture', fmt(ruptures)]],
          question: 'Taux de service (en %) ?',
          answer: ((total - ruptures) / total) * 100,
          unit: '%',
          tolerance: 0.1,
          steps: [`Commandes servies = ${total} − ${ruptures} = ${total - ruptures}`, `Taux de service = ${total - ruptures} / ${total} × 100 = ${fmt(((total - ruptures) / total) * 100, 1)} %`],
          conclusion: 'Attention à bien partir des commandes servies, et non des ruptures.',
        }
      },
      () => {
        const onTime = int(90, 97)
        const inFull = int(90, 97)
        const low = Math.min(onTime, inFull)
        const correct = low - int(1, 4)
        return {
          kind: 'choice',
          statement: "Ton tableau de bord affiche ces deux taux, mais l'OTIF a été effacé.",
          data: [["Taux à l'heure", `${onTime} %`], ['Taux complet', `${inFull} %`]],
          question: "Quelle valeur d'OTIF est possible ?",
          ...choiceSet(`${correct} %`, [`${low + 1} %`, `${Math.max(onTime, inFull) + 1} %`, `${Math.min(99, low + 3)} %`].filter((v, i, a) => a.indexOf(v) === i && v !== `${correct} %`)),
          steps: [`L'OTIF ne peut pas dépasser le plus petit des deux taux : min(${onTime} ; ${inFull}) = ${low} %.`],
          conclusion: `Seule une valeur ≤ ${low} % est possible : ${correct} %.`,
        }
      },
    ],
  },

  // ------------------------------------------------------------------
  tco: {
    purpose:
      "Le **TCO** (coût total de possession) additionne tous les coûts liés à un achat, pas seulement le prix : transport, douane, stockage, non-qualité… Il permet de comparer des fournisseurs de façon juste.",
    formulas: ['TCO unitaire = prix + transport + prix × droits de douane + stockage + prix × taux de non-qualité'],
    terms: [
      ['Prix', "Prix d'achat unitaire."],
      ['Transport', 'Coût de transport ramené à une unité.'],
      ['Droits de douane', 'Pourcentage appliqué au prix (hors Union européenne).'],
      ['Stockage', 'Coût du stock supplémentaire (un délai long oblige à stocker plus).'],
      ['Non-qualité', 'Coût des défauts : rebuts, retours, retouches, en % du prix.'],
    ],
    example: {
      statement: 'Fournisseur Asie : 8 €, transport 1,20 €, douane 10 %, stockage 1 €, non-qualité 6 %. Fournisseur Europe : 10 €, transport 0,50 €, douane 0 %, stockage 0,20 €, non-qualité 1 %.',
      steps: [
        'Asie : 8 + 1,20 + 8 × 10 % + 1 + 8 × 6 % = 8 + 1,20 + 0,80 + 1 + 0,48 = 11,48 €',
        'Europe : 10 + 0,50 + 0 + 0,20 + 10 × 1 % = 10 + 0,50 + 0,20 + 0,10 = 10,80 €',
      ],
      result: 'Le fournisseur européen est plus cher à l\'achat mais moins cher au TCO, de 0,68 € par unité.',
    },
    exercises: [
      () => {
        const price = int(5, 40)
        const transport = int(2, 30) / 10
        const duty = pick([0, 3, 6, 10, 12])
        const storage = int(1, 15) / 10
        const defect = pick([0.5, 1, 2, 4, 5])
        const tco = price + transport + (price * duty) / 100 + storage + (price * defect) / 100
        return {
          kind: 'number',
          statement: 'Calcule le TCO unitaire de ce fournisseur.',
          data: [['Prix', eur(price)], ['Transport / unité', eur(transport)], ['Droits de douane', `${duty} %`], ['Stockage / unité', eur(storage)], ['Non-qualité', `${fmt(defect)} % du prix`]],
          question: 'TCO unitaire (en €) ?',
          answer: tco,
          unit: '€',
          tolerance: 0.02,
          steps: [
            `Douane = ${price} × ${duty} % = ${eur((price * duty) / 100)}`,
            `Non-qualité = ${price} × ${fmt(defect)} % = ${eur((price * defect) / 100)}`,
            `TCO = ${price} + ${fmt(transport)} + ${fmt((price * duty) / 100)} + ${fmt(storage)} + ${fmt((price * defect) / 100)} = ${eur(tco)}`,
          ],
          conclusion: `Le vrai coût est ${fmt(((tco - price) / price) * 100, 0)} % au-dessus du prix d'achat.`,
        }
      },
      () => {
        const pa = int(6, 12)
        const pb = pa + int(1, 3)
        const a = pa + 1.5 + pa * 0.1 + 0.8 + pa * 0.05
        const b = pb + 0.4 + 0 + 0.2 + pb * 0.01
        return {
          kind: 'number',
          statement: 'Compare les deux fournisseurs au TCO.',
          data: [
            ['A (Asie)', `${eur(pa)} + transport 1,50 € + douane 10 % + stockage 0,80 € + non-qualité 5 %`],
            ['B (Europe)', `${eur(pb)} + transport 0,40 € + douane 0 % + stockage 0,20 € + non-qualité 1 %`],
          ],
          question: 'Écart de TCO par unité entre les deux (en €, valeur positive) ?',
          answer: Math.abs(a - b),
          unit: '€',
          tolerance: 0.02,
          steps: [`TCO A = ${pa} + 1,50 + ${fmt(pa * 0.1)} + 0,80 + ${fmt(pa * 0.05)} = ${eur(a)}`, `TCO B = ${pb} + 0,40 + 0 + 0,20 + ${fmt(pb * 0.01)} = ${eur(b)}`, `Écart = ${eur(Math.abs(a - b))}`],
          conclusion: `Le fournisseur ${a < b ? 'A' : 'B'} est le moins cher au TCO${a < b ? '' : ', alors que son prix d\'achat est plus élevé'}.`,
        }
      },
      () => {
        const diff = int(10, 120) / 100
        const qty = int(5, 80) * 1000
        return {
          kind: 'number',
          statement: "Le fournisseur retenu a un TCO plus bas que l'ancien.",
          data: [['Écart de TCO par unité', eur(diff)], ['Quantité achetée par an', `${fmt(qty)} unités`]],
          question: 'Économie annuelle (en €) ?',
          answer: diff * qty,
          unit: '€',
          tolerance: 1,
          steps: [`Économie = ${fmt(diff)} × ${fmt(qty)} = ${eur(diff * qty, 0)}`],
          conclusion: 'Un petit écart unitaire fait vite une grosse somme sur un an.',
        }
      },
    ],
  },

  // ------------------------------------------------------------------
  incoterms: {
    purpose:
      "Les **Incoterms 2020** (11 règles) fixent, entre un vendeur et un acheteur, **qui paie quoi** (transport, assurance, douane) et **où le risque passe** de l'un à l'autre. Coût et risque ne changent pas forcément de main au même endroit.",
    formulas: ['E → F → C → D : de moins en plus d\'obligations pour le vendeur'],
    terms: [
      ['E (EXW)', "Le vendeur met à disposition chez lui : l'acheteur fait tout."],
      ['F (FCA, FAS, FOB)', "Le vendeur remet la marchandise au départ ; l'acheteur paie le transport principal."],
      ['C (CFR, CIF, CPT, CIP)', 'Le vendeur paie le transport principal, mais le risque passe AU DÉPART.'],
      ['D (DAP, DPU, DDP)', "Le vendeur supporte coûts et risques jusqu'à destination."],
      ['Maritimes', 'FAS, FOB, CFR et CIF : uniquement pour le maritime et le fluvial.'],
    ],
    example: {
      statement: 'Achat de pièces en CIF Le Havre, depuis Shanghai. Le navire subit une avarie en mer.',
      steps: [
        'En CIF, le vendeur paie le fret et l\'assurance jusqu\'au Havre.',
        'Mais le risque est passé à l\'acheteur dès le chargement à bord, à Shanghai.',
        "C'est donc l'acheteur qui subit la perte… et qui est indemnisé par l'assurance souscrite par le vendeur.",
      ],
      result: 'Avec les règles C, on paie jusqu\'à destination mais le risque est transféré au départ.',
    },
    exercises: Array.from({ length: 4 }, (_, k) => () => {
      const t = pick(INCOTERMS)
      const type = k % 4
      if (type === 0) {
        const who = t.rows[2]
        return {
          kind: 'choice',
          statement: `Contrat en ${t.code} (${t.name}).`,
          data: [],
          question: 'Qui paie le transport principal ?',
          ...choiceSet(who, [isSeller(who) ? 'Acheteur' : 'Vendeur']),
          steps: [`${t.code} est une règle ${t.code[0]}.`, `Transport principal : ${who}.`],
          conclusion: ['C', 'D'].includes(t.code[0]) ? 'Avec les règles C et D, le vendeur paie le transport principal.' : "Avec les règles E et F, c'est l'acheteur qui paie le transport principal.",
        }
      }
      if (type === 1) {
        const others = INCOTERMS.filter((o) => o.risk !== t.risk).map((o) => o.risk)
        const wrongs = [...new Set(others)].sort(() => Math.random() - 0.5).slice(0, 3)
        return {
          kind: 'choice',
          statement: `Contrat en ${t.code} (${t.name}).`,
          data: [],
          question: "Où le risque passe-t-il du vendeur à l'acheteur ?",
          ...choiceSet(t.risk, wrongs),
          steps: [`${t.code} : ${t.risk}`],
          conclusion: 'Le transfert du risque est la question clé de chaque Incoterm.',
        }
      }
      if (type === 2) {
        const who = t.rows[5]
        return {
          kind: 'choice',
          statement: `Contrat en ${t.code} (${t.name}).`,
          data: [],
          question: "Qui paie le dédouanement à l'import et les droits de douane ?",
          ...choiceSet(who, [isSeller(who) ? 'Acheteur' : 'Vendeur']),
          steps: [`${INCOTERM_ROWS[5]} : ${who}.`],
          conclusion: "Seul le DDP met les droits d'importation à la charge du vendeur.",
        }
      }
      return {
        kind: 'choice',
        statement: `Un client veut utiliser le ${t.code} pour un envoi par camion.`,
        data: [],
        question: 'Est-ce adapté ?',
        ...choiceSet(t.maritime ? 'Non, cette règle est réservée au maritime' : 'Oui, cette règle vaut pour tous les modes', [t.maritime ? 'Oui, cette règle vaut pour tous les modes' : 'Non, cette règle est réservée au maritime']),
        steps: [`${t.code} est ${t.maritime ? 'une des 4 règles maritimes (FAS, FOB, CFR, CIF)' : 'une règle « tous modes »'}.`],
        conclusion: t.maritime ? `Pour un camion, on utiliserait plutôt ${{ FAS: 'FCA', FOB: 'FCA', CFR: 'CPT', CIF: 'CIP' }[t.code]}.` : 'Aucun problème pour la route.',
      }
    }),
  },
}

// Génère une série d'exercices (un par modèle) pour une formule
export function generateExercises(id) {
  return FORMULAS[id].exercises.map((make) => make())
}

// Vérifie une réponse numérique (virgule ou point acceptés)
export function checkNumber(input, exercise) {
  const value = Number(String(input).replace(/\s/g, '').replace(',', '.').replace('%', '').replace('€', ''))
  if (!Number.isFinite(value)) return null
  const margin = Math.max(exercise.tolerance, Math.abs(exercise.answer) * 0.005)
  return Math.abs(value - exercise.answer) <= margin
}

export const formatAnswer = (exercise) => `${fmt(exercise.answer)} ${exercise.unit}`
