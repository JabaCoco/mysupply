// Lot 16 — Stratégie et innovation : Atelier (3 formules, 3 défis Excel, 2 études de cas) + Anglais (CV, entretien de stage, LinkedIn).
import { fmt, int, pick } from '../gen.js'

export default {
  formulas: [
    {
      id: 'centre-gravite',
      title: 'Centre de gravité et notation pondérée',
      short: 'X = Σ(volume × x) / Σ volume',
      course: {
        purpose:
          "Pour implanter un entrepôt, la **méthode du centre de gravité** donne un point de départ : un lieu proche des gros volumes à livrer. La **notation pondérée** compare ensuite plusieurs sites sur plusieurs critères, selon leur importance.",
        formulas: ['X = Σ (volume × x) / Σ volume', 'Y = Σ (volume × y) / Σ volume', 'Note pondérée = Σ (note du critère × poids du critère)'],
        terms: [
          ['x, y', 'Coordonnées d\'un point de livraison (en km sur une carte, par exemple).'],
          ['Volume', 'Quantité livrée à ce point.'],
          ['Poids', 'Importance du critère (la somme des poids vaut 100 %).'],
        ],
        example: {
          statement: 'Trois clients : A (x = 10 ; 100 unités), B (x = 30 ; 300 unités), C (x = 50 ; 100 unités).',
          steps: ['Σ (volume × x) = 10×100 + 30×300 + 50×100 = 15 000', 'Σ volume = 500', 'X = 15 000 / 500 = 30'],
          result: 'Le centre de gravité est en x = 30, sur le client B qui reçoit le plus.',
        },
        exercises: [
          () => {
            const v = [int(1, 5) * 100, int(1, 5) * 100, int(1, 5) * 100]
            const x = [int(1, 8) * 10, int(1, 8) * 10, int(1, 8) * 10]
            const total = v[0] + v[1] + v[2]
            const gx = (v[0] * x[0] + v[1] * x[1] + v[2] * x[2]) / total
            return {
              kind: 'number',
              statement: 'Calcule la coordonnée x du centre de gravité.',
              data: x.map((xi, i) => [`Client ${i + 1}`, `x = ${xi} · ${v[i]} unités`]),
              question: 'Coordonnée X (arrondie à 0,1) ?',
              answer: gx,
              unit: '',
              tolerance: 0.2,
              steps: [`Σ (volume × x) = ${x.map((xi, i) => `${xi}×${v[i]}`).join(' + ')} = ${fmt(v[0] * x[0] + v[1] * x[1] + v[2] * x[2], 0)}`, `Σ volume = ${total}`, `X = ${fmt(v[0] * x[0] + v[1] * x[1] + v[2] * x[2], 0)} / ${total} = ${fmt(gx, 1)}`],
              conclusion: 'Le centre de gravité est attiré par les gros volumes.',
            }
          },
          () => {
            const w = pick([[0.5, 0.3, 0.2], [0.4, 0.4, 0.2], [0.6, 0.2, 0.2]])
            const n = [int(2, 5), int(2, 5), int(2, 5)]
            const score = n[0] * w[0] + n[1] * w[1] + n[2] * w[2]
            return {
              kind: 'number',
              statement: 'Calcule la note pondérée d\'un site.',
              data: [['Notes (sur 5)', n.join(' / ')], ['Poids', w.map((x) => `${fmt(x * 100, 0)} %`).join(' / ')]],
              question: 'Note pondérée (sur 5) ?',
              answer: score,
              unit: '',
              tolerance: 0.02,
              steps: [`${n[0]}×${fmt(w[0])} + ${n[1]}×${fmt(w[1])} + ${n[2]}×${fmt(w[2])} = ${fmt(score, 2)}`],
              conclusion: 'On compare les sites sur cette note : la plus élevée correspond au meilleur compromis.',
            }
          },
          () => {
            const a = int(15, 40) / 10
            const b = int(15, 40) / 10
            const w = pick([0.6, 0.7])
            const sa = a * w + (5 - a) * (1 - w)
            return {
              kind: 'number',
              statement: 'Un site obtient la note a pour le critère « proximité » (poids ci-dessous) et la note 5 − a pour le critère « coût » (poids complémentaire). Calcule sa note pondérée.',
              data: [['Note proximité', fmt(a, 1)], ['Poids proximité', `${fmt(w * 100, 0)} %`]],
              question: 'Note pondérée ?',
              answer: sa,
              unit: '',
              tolerance: 0.02,
              steps: [`Note coût = 5 − ${fmt(a, 1)} = ${fmt(5 - a, 1)}`, `${fmt(a, 1)} × ${fmt(w)} + ${fmt(5 - a, 1)} × ${fmt(1 - w)} = ${fmt(sa, 2)}`],
              conclusion: 'Le poids modifie fortement le classement : il faut le discuter avant de noter.',
            }
          },
          () => {
            const km = int(50, 300, 10)
            const trips = int(100, 500, 50)
            const cost = pick([1.2, 1.5, 1.8])
            return {
              kind: 'number',
              statement: 'Calcule le coût de transport mensuel depuis ce site.',
              data: [['Distance moyenne', `${km} km`], ['Livraisons par mois', String(trips)], ['Coût', `${fmt(cost, 1)} € / km`]],
              question: 'Coût mensuel (en €) ?',
              answer: km * trips * cost,
              unit: '€',
              tolerance: 1,
              steps: [`${km} × ${trips} × ${fmt(cost, 1)} = ${fmt(km * trips * cost, 0)} €`],
              conclusion: 'Un site plus éloigné du centre de gravité augmente directement ce coût.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'v1', label: 'Volume client 1', value: 100 },
            { key: 'x1', label: 'Position x client 1', value: 10 },
            { key: 'v2', label: 'Volume client 2', value: 300 },
            { key: 'x2', label: 'Position x client 2', value: 30 },
            { key: 'v3', label: 'Volume client 3', value: 100 },
            { key: 'x3', label: 'Position x client 3', value: 50 },
          ],
          outputs: [
            { label: 'Volume total', unit: '', digits: 0, fn: (n) => n.v1 + n.v2 + n.v3 },
            { label: 'Centre de gravité X', unit: '', digits: 1, highlight: true, fn: (n) => (n.v1 + n.v2 + n.v3 > 0 ? (n.v1 * n.x1 + n.v2 * n.x2 + n.v3 * n.x3) / (n.v1 + n.v2 + n.v3) : 0) },
          ],
          steps: (n) => [`X = (${fmt(n.v1 * n.x1)} + ${fmt(n.v2 * n.x2)} + ${fmt(n.v3 * n.x3)}) / ${fmt(n.v1 + n.v2 + n.v3)}`],
          note: 'Refais le calcul avec les coordonnées y pour obtenir le point (X ; Y).',
        },
      },
    },

    {
      id: 'faire-ou-acheter',
      title: 'Faire ou acheter : le seuil',
      short: 'Seuil = frais fixes / (prix d\'achat − coût variable)',
      course: {
        purpose:
          "Pour savoir s'il vaut mieux **fabriquer** une pièce soi-même ou l'**acheter**, on compare les coûts totaux. Fabriquer a des **frais fixes** (machine, outillage) et un **coût variable** faible ; acheter n'a pas de frais fixes mais un **prix unitaire** plus élevé. Il existe donc une **quantité seuil**.",
        formulas: ['Coût de fabrication = frais fixes + coût variable × quantité', 'Coût d\'achat = prix d\'achat × quantité', 'Quantité seuil = frais fixes / (prix d\'achat − coût variable)'],
        terms: [
          ['Frais fixes', 'Dépenses indépendantes du volume (machine, outillage, personnel dédié).'],
          ['Coût variable', 'Coût par pièce fabriquée (matière, énergie, main-d\'œuvre).'],
          ['Seuil', 'Quantité à laquelle fabriquer et acheter coûtent pareil.'],
        ],
        example: {
          statement: 'Frais fixes 60 000 € ; coût variable 8 € ; prix d\'achat 14 €.',
          steps: ['Seuil = 60 000 / (14 − 8) = 10 000 pièces', 'Pour 15 000 pièces : fabriquer = 60 000 + 8 × 15 000 = 180 000 € ; acheter = 14 × 15 000 = 210 000 €', 'Économie à fabriquer = 30 000 €'],
          result: 'Au-dessus de 10 000 pièces, fabriquer devient plus économique.',
        },
        exercises: [
          () => {
            const fixed = int(2, 9) * 20000
            const buy = int(10, 20)
            const variable = buy - pick([2, 4, 5])
            return {
              kind: 'number',
              statement: 'Calcule la quantité seuil entre fabriquer et acheter.',
              data: [['Frais fixes', `${fmt(fixed)} €`], ['Coût variable', `${variable} € / pièce`], ['Prix d\'achat', `${buy} € / pièce`]],
              question: 'Quantité seuil (en pièces) ?',
              answer: fixed / (buy - variable),
              unit: 'pièces',
              tolerance: 1,
              steps: [`Écart unitaire = ${buy} − ${variable} = ${buy - variable} €`, `Seuil = ${fmt(fixed)} / ${buy - variable} = ${fmt(fixed / (buy - variable), 0)} pièces`],
              conclusion: 'Au-dessus de ce volume, fabriquer coûte moins cher ; en dessous, acheter est préférable.',
            }
          },
          () => {
            const fixed = int(3, 10) * 10000
            const variable = int(5, 10)
            const q = int(5, 20) * 1000
            return {
              kind: 'number',
              statement: 'Calcule le coût total de fabrication.',
              data: [['Frais fixes', `${fmt(fixed)} €`], ['Coût variable', `${variable} € / pièce`], ['Quantité', fmt(q)]],
              question: 'Coût total (en €) ?',
              answer: fixed + variable * q,
              unit: '€',
              tolerance: 1,
              steps: [`${fmt(fixed)} + ${variable} × ${fmt(q)} = ${fmt(fixed + variable * q, 0)} €`],
              conclusion: 'À comparer au coût d\'achat pour la même quantité.',
            }
          },
          () => {
            const fixed = int(2, 9) * 20000
            const buy = int(12, 20)
            const variable = buy - pick([2, 4, 5])
            const q = Math.round((fixed / (buy - variable)) * pick([1.5, 2, 2.5]) / 100) * 100
            const make = fixed + variable * q
            const bought = buy * q
            return {
              kind: 'number',
              statement: 'Calcule l\'économie réalisée en fabriquant plutôt qu\'en achetant (si positive).',
              data: [['Frais fixes', `${fmt(fixed)} €`], ['Coût variable', `${variable} €`], ['Prix d\'achat', `${buy} €`], ['Quantité', fmt(q)]],
              question: 'Économie (en €) ?',
              answer: bought - make,
              unit: '€',
              tolerance: 1,
              steps: [`Fabriquer = ${fmt(fixed)} + ${variable} × ${fmt(q)} = ${fmt(make, 0)} €`, `Acheter = ${buy} × ${fmt(q)} = ${fmt(bought, 0)} €`, `Économie = ${fmt(bought - make, 0)} €`],
              conclusion: 'La quantité étant supérieure au seuil, fabriquer est avantageux.',
            }
          },
          () => {
            const fixed = int(2, 9) * 20000
            const buy = int(10, 20)
            const variable = buy - pick([2, 4, 5])
            const q = Math.round(fixed / (buy - variable) / 2 / 100) * 100
            const make = fixed + variable * q
            const bought = buy * q
            return {
              kind: 'number',
              statement: 'La quantité est inférieure au seuil. Calcule le surcoût à fabriquer plutôt qu\'à acheter.',
              data: [['Frais fixes', `${fmt(fixed)} €`], ['Coût variable', `${variable} €`], ['Prix d\'achat', `${buy} €`], ['Quantité', fmt(q)]],
              question: 'Surcoût (en €) ?',
              answer: make - bought,
              unit: '€',
              tolerance: 1,
              steps: [`Fabriquer = ${fmt(make, 0)} €`, `Acheter = ${fmt(bought, 0)} €`, `Surcoût = ${fmt(make - bought, 0)} €`],
              conclusion: 'À faible volume, les frais fixes pèsent trop : mieux vaut acheter.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'fixed', label: 'Frais fixes', unit: '€', value: 60000 },
            { key: 'variable', label: 'Coût variable de fabrication', unit: '€/pièce', value: 8 },
            { key: 'buy', label: 'Prix d\'achat', unit: '€/pièce', value: 14 },
            { key: 'q', label: 'Quantité', unit: 'pièces', value: 15000 },
          ],
          outputs: [
            { label: 'Quantité seuil', unit: 'pièces', digits: 0, highlight: true, fn: (n) => (n.buy > n.variable ? n.fixed / (n.buy - n.variable) : 0) },
            { label: 'Coût de fabrication', unit: '€', digits: 0, fn: (n) => n.fixed + n.variable * n.q },
            { label: 'Coût d\'achat', unit: '€', digits: 0, fn: (n) => n.buy * n.q },
            { label: 'Économie à fabriquer (négatif = acheter)', unit: '€', digits: 0, fn: (n) => n.buy * n.q - (n.fixed + n.variable * n.q) },
          ],
          steps: (n) => [`Seuil = ${fmt(n.fixed)} / (${fmt(n.buy)} − ${fmt(n.variable)})`],
          note: 'Si le prix d\'achat est inférieur au coût variable, acheter est toujours préférable.',
        },
      },
    },
  ],

  excel: [
    {
      id: 'centre-gravite-excel',
      fn: 'SOMMEPROD',
      level: 3,
      tier: 5,
      title: 'Le centre de gravité',
      context: 'Tu cherches où implanter un entrepôt : tu pars du centre de gravité des livraisons.',
      instruction: 'En **B6**, calcule la **coordonnée X du centre de gravité** : Σ(volume × x) ÷ Σ volume, **arrondie à 1 décimale**.',
      generate() {
        return { rows: [['Client', 'Volume', 'x (km)'], ['A', int(1, 6) * 100, int(1, 8) * 10], ['B', int(1, 6) * 100, int(1, 8) * 10], ['C', int(1, 6) * 100, int(1, 8) * 10]], extra: { A6: 'Centre de gravité X' } }
      },
      target: 'B6',
      solution: '=ARRONDI(SOMMEPROD(B2:B4;C2:C4)/SOMME(B2:B4);1)',
      mustUse: ['SOMMEPROD', 'SOMME', 'ARRONDI'],
      hints: ['SOMMEPROD(B2:B4;C2:C4) calcule Σ(volume × x).', 'Divise par SOMME(B2:B4) puis arrondis à 1 décimale.'],
      explain: 'Le centre de gravité est une moyenne des positions pondérée par les volumes : les gros clients attirent le point vers eux.',
    },
    {
      id: 'seuil-faire-acheter-excel',
      fn: 'ARRONDI.SUP',
      level: 2,
      tier: 5,
      title: 'Faire ou acheter : le seuil',
      context: 'Tu compares la fabrication interne d\'une pièce avec son achat à un fournisseur.',
      instruction: 'En **B4**, calcule la **quantité seuil** : frais fixes ÷ (prix d\'achat − coût variable), **arrondie à l\'entier supérieur**.',
      generate() {
        const buy = int(10, 20)
        return { rows: [['Frais fixes (€)', int(2, 9) * 20000 + int(0, 3) * 1000], ['Coût variable (€)', buy - pick([2, 3, 4, 5])], ['Prix d\'achat (€)', buy]], extra: { A4: 'Quantité seuil' } }
      },
      target: 'B4',
      solution: '=ARRONDI.SUP(B1/(B3-B2);0)',
      mustUse: ['ARRONDI.SUP'],
      hints: ['La différence entre le prix d\'achat (B3) et le coût variable (B2) donne l\'économie par pièce.', 'Divise les frais fixes B1 par cette différence (entre parenthèses) puis ARRONDI.SUP(…;0).'],
      explain: 'Le seuil est la quantité à partir de laquelle l\'économie réalisée par pièce a remboursé les frais fixes. On arrondit au supérieur car on ne fabrique pas une demi-pièce.',
    },
    {
      id: 'note-ponderee-excel',
      fn: 'SOMMEPROD',
      level: 3,
      tier: 5,
      title: 'La note pondérée d\'un site',
      context: 'Tu compares trois sites d\'implantation avec des critères pondérés.',
      instruction: 'En **E2**, calcule la **note pondérée du site A** : somme des notes × poids (ligne 6), **arrondie à 2 décimales**.',
      generate() {
        const w = pick([[0.5, 0.3, 0.2], [0.4, 0.4, 0.2], [0.6, 0.2, 0.2]])
        return { rows: [['Site', 'Proximité', 'Coût', 'Risque'], ['A', int(2, 5), int(2, 5), int(2, 5)], ['B', int(2, 5), int(2, 5), int(2, 5)], ['C', int(2, 5), int(2, 5), int(2, 5)], ['', '', '', ''], ['Poids', w[0], w[1], w[2]]], extra: { E1: 'Note pondérée' } }
      },
      target: 'E2',
      solution: '=ARRONDI(SOMMEPROD(B2:D2;B6:D6);2)',
      mustUse: ['SOMMEPROD', 'ARRONDI'],
      hints: ['Les notes du site A sont en B2:D2 et les poids en B6:D6.', 'SOMMEPROD(B2:D2;B6:D6) puis ARRONDI(…;2).'],
      explain: 'SOMMEPROD multiplie chaque note par son poids et additionne : c\'est la note pondérée. On calcule ensuite la même chose pour B et C avant de comparer.',
    },
  ],

  cases: [
    {
      id: 'make-or-buy-piece',
      title: 'Fabriquer ou acheter une pièce ?',
      role: "Responsable industrialisation d'un fabricant de machines agricoles",
      lesson: 'strategie/faire-ou-faire-faire',
      generate() {
        const buy = int(12, 20)
        const variable = buy - pick([2, 4, 5])
        const fixed = int(3, 9) * 20000
        const seuil = fixed / (buy - variable)
        const q = Math.round((seuil * pick([0.6, 1.5, 2])) / 100) * 100
        const make = fixed + variable * q
        const bought = buy * q
        const makeIsBetter = make < bought
        return {
          intro: `Une pièce est aujourd'hui achetée ${buy} € l'unité. Fabriquer en interne demanderait ${fmt(fixed)} € de frais fixes (outillage, formation) et ${variable} € de coût variable par pièce. Le besoin prévu est de ${fmt(q)} pièces par an. La pièce n'est pas stratégique, mais la qualité du fournisseur actuel est parfois irrégulière.`,
          steps: [
            {
              situation: 'Quelle est la quantité seuil entre fabriquer et acheter ?',
              better: `Seuil = ${fmt(fixed)} / (${buy} − ${variable}) = ${fmt(seuil, 0)} pièces. Au-dessus, fabriquer coûte moins cher ; en dessous, acheter.`,
              choices: [
                { text: `${fmt(seuil, 0)} pièces : frais fixes divisés par l'économie unitaire.`, points: 3, feedback: `${fmt(fixed)} / ${buy - variable} = ${fmt(seuil, 0)} pièces : au-delà, les frais fixes sont amortis.` },
                { text: `${fmt(fixed / buy, 0)} pièces : frais fixes divisés par le prix d'achat.`, points: 0, feedback: 'Il faut diviser par l\'économie par pièce (prix d\'achat − coût variable), pas par le prix d\'achat seul.' },
                { text: `${fmt(fixed / variable, 0)} pièces : frais fixes divisés par le coût variable.`, points: 1, feedback: 'Le seuil dépend de la différence entre prix d\'achat et coût variable, pas du coût variable seul.' },
              ],
            },
            {
              situation: `Pour ${fmt(q)} pièces par an, que montre le calcul de coût ?`,
              better: `Fabriquer : ${fmt(fixed)} + ${variable} × ${fmt(q)} = ${fmt(make, 0)} €. Acheter : ${buy} × ${fmt(q)} = ${fmt(bought, 0)} €. ${makeIsBetter ? `Fabriquer économise ${fmt(bought - make, 0)} € par an.` : `Acheter économise ${fmt(make - bought, 0)} € par an.`}`,
              choices: [
                { text: makeIsBetter ? `Fabriquer est moins cher de ${fmt(bought - make, 0)} € par an.` : `Acheter est moins cher de ${fmt(make - bought, 0)} € par an.`, points: 3, feedback: `Coût de fabrication ${fmt(make, 0)} € contre coût d'achat ${fmt(bought, 0)} € pour ${fmt(q)} pièces.` },
                { text: makeIsBetter ? 'Acheter est toujours moins cher.' : 'Fabriquer est toujours moins cher.', points: 0, feedback: 'Cela dépend du volume : on compare les coûts totaux pour la quantité réelle.' },
                { text: 'Impossible de comparer les deux options.', points: 1, feedback: 'Le calcul est direct : coût fixe plus coût variable contre prix d\'achat fois quantité.' },
              ],
            },
            {
              situation: 'Quels autres éléments pèsent dans la décision ?',
              better: "Au-delà du coût : la qualité (fournisseur parfois irrégulier), le risque de dépendance, la charge des équipes internes, la flexibilité face à une variation de volume et le délai pour être opérationnel. Une décision équilibrée peut aussi être de fabriquer une partie et d'acheter le reste.",
              choices: [
                { text: 'La qualité, le risque, la charge interne, la flexibilité et le délai de mise en route.', points: 3, feedback: 'Le seuil de rentabilité n\'est qu\'un critère : les risques et les capacités comptent aussi.' },
                { text: 'Rien d\'autre : seul le coût compte.', points: 1, feedback: 'Une économie peut être annulée par des problèmes de qualité ou de capacité.' },
                { text: 'Uniquement l\'avis du fournisseur actuel.', points: 0, feedback: 'Le fournisseur n\'est pas neutre : il a intérêt à garder le contrat.' },
              ],
            },
          ],
          debrief: `Seuil de ${fmt(seuil, 0)} pièces ; pour ${fmt(q)} pièces, ${makeIsBetter ? 'fabriquer' : 'acheter'} est plus économique. La décision tient aussi compte de la qualité, du risque, de la flexibilité et de la charge interne.`,
        }
      },
    },
    {
      id: 'implantation-site',
      title: 'Choisir le site du futur entrepôt',
      role: "Responsable réseau d'un distributeur de pièces automobiles",
      lesson: 'strategie/design-reseau',
      generate() {
        const w = [0.5, 0.3, 0.2]
        const sites = [
          { n: 'Lyon', s: [int(4, 5), int(2, 3), int(3, 4)] },
          { n: 'Dijon', s: [int(3, 4), int(4, 5), int(3, 4)] },
          { n: 'Saint-Étienne', s: [int(2, 3), int(4, 5), int(2, 3)] },
        ]
        const score = (s) => s[0] * w[0] + s[1] * w[1] + s[2] * w[2]
        const best = [...sites].sort((a, b) => score(b.s) - score(a.s))[0]
        const bestScore = score(best.s)
        return {
          intro: `Tu compares trois sites : ${sites.map((x) => `${x.n} (proximité ${x.s[0]}, coût ${x.s[1]}, risque ${x.s[2]})`).join(' ; ')} (notes sur 5, 5 étant la meilleure). Les poids retenus sont : proximité des clients 50 %, coût 30 %, risque 20 %.`,
          steps: [
            {
              situation: 'Quel site obtient la meilleure note pondérée ?',
              better: `Notes pondérées : ${sites.map((x) => `${x.n} ${fmt(score(x.s), 2)}`).join(' ; ')}. Le meilleur est ${best.n} (${fmt(bestScore, 2)}).`,
              choices: [
                { text: `${best.n} : ${fmt(bestScore, 2)} sur 5.`, points: 3, feedback: `Calcul : notes × poids (0,5 ; 0,3 ; 0,2) et somme. ${best.n} arrive en tête avec ${fmt(bestScore, 2)}.` },
                { text: `${sites.find((x) => x.n !== best.n).n}, car sa note de proximité est élevée.`, points: 0, feedback: 'Un seul critère ne suffit pas : il faut calculer la note pondérée de chaque site.' },
                { text: 'On ne peut pas les comparer avec ces données.', points: 1, feedback: 'Les notes et les poids permettent de calculer et de comparer.' },
              ],
            },
            {
              situation: 'La direction préfère donner 40 % au coût et 40 % à la proximité (20 % au risque). Que fais-tu ?',
              better: "On refait le calcul avec les nouveaux poids pour voir si le classement change. Si le meilleur site reste le même, le choix est robuste ; sinon, la décision dépend des priorités et la direction doit trancher en connaissance de cause.",
              choices: [
                { text: 'Je refais le calcul avec les nouveaux poids pour tester la robustesse du choix.', points: 3, feedback: 'Tester la sensibilité aux poids montre si le résultat dépend de la pondération.' },
                { text: 'Je garde le même résultat sans recalcul.', points: 0, feedback: 'Changer les poids peut modifier le classement : il faut recalculer.' },
                { text: 'J\'abandonne la méthode de notation.', points: 1, feedback: 'La méthode reste utile : c\'est le débat sur les poids qu\'elle rend explicite.' },
              ],
            },
            {
              situation: 'Quelles vérifications ajoutes-tu avant de signer ?',
              better: "On complète par des éléments non notés : disponibilité réelle d'un terrain ou d'un bâtiment, coûts détaillés (loyer, taxes), accès routier et ferroviaire, main-d'œuvre locale, risques naturels, impact environnemental, et on teste le scénario sur le volume de demain.",
              choices: [
                { text: 'Terrain disponible, coûts détaillés, accès, main-d\'œuvre, risques et volumes futurs.', points: 3, feedback: 'La notation oriente le choix, mais ne remplace pas une vérification des faits.' },
                { text: 'Aucune : la note suffit.', points: 1, feedback: 'Une note résume des estimations : il faut vérifier les faits avant un engagement de plusieurs années.' },
                { text: 'Je signe avec le premier site visité.', points: 0, feedback: 'Une décision de ce type ne se prend pas sans comparaison ni analyse.' },
              ],
            },
          ],
          debrief: `${best.n} arrive en tête (${fmt(bestScore, 2)}) avec les poids retenus. On teste la robustesse en changeant les poids et on vérifie les faits (terrain, coûts, accès, risques) avant d'engager l'entreprise.`,
        }
      },
    },
  ],

  english: {
    units: [
      {
        id: 'carriere',
        title: 'Carrière : CV, entretien, LinkedIn',
        icon: 'presentation',
        color: 'pink',
        lessons: [
          {
            id: 'cv-mots',
            title: 'Le vocabulaire du CV',
            level: 2,
            items: [
              { en: 'resume', fr: 'CV', def: "Document qui résume les études, l'expérience et les compétences d'une personne qui cherche un emploi.", ex: 'Please send me your resume.', exFr: 'Merci de m\'envoyer votre CV.' },
              { en: 'cover letter', fr: 'lettre de motivation', def: "Lettre qui accompagne un CV pour expliquer pourquoi on veut ce poste.", ex: 'I wrote a short cover letter.', exFr: 'J\'ai écrit une courte lettre de motivation.' },
              { en: 'degree', fr: 'diplôme', def: "Titre obtenu après des études supérieures.", ex: 'I have a degree in logistics.', exFr: 'J\'ai un diplôme en logistique.' },
              { en: 'work experience', fr: 'expérience professionnelle', def: "Emplois, stages et missions déjà réalisés par une personne.", ex: 'I have two years of work experience.', exFr: 'J\'ai deux ans d\'expérience professionnelle.' },
              { en: 'strengths', fr: 'points forts', def: "Qualités et compétences dans lesquelles une personne est particulièrement bonne.", ex: 'My strengths are organization and teamwork.', exFr: 'Mes points forts sont l\'organisation et le travail en équipe.' },
              { en: 'achievement', fr: 'réussite (réalisation)', def: "Résultat important obtenu grâce à ses efforts.", ex: 'My main achievement was reducing errors.', exFr: 'Ma principale réussite a été de réduire les erreurs.' },
              { en: 'to apply for', fr: 'postuler à', def: "Demander officiellement un emploi, un stage ou une formation.", ex: 'I want to apply for this internship.', exFr: 'Je veux postuler à ce stage.' },
              { en: 'fluent', fr: 'courant (en langue)', def: "Qui parle une langue facilement et sans difficulté.", ex: 'I am fluent in French and English.', exFr: 'Je parle couramment le français et l\'anglais.' },
            ],
          },
          {
            id: 'entretien-phrases',
            title: "L'entretien de stage",
            level: 3,
            items: [
              { en: 'Thank you for inviting me to this interview.', fr: 'Merci de m\'avoir invité à cet entretien.', blank: 'inviting' },
              { en: 'I am studying supply chain management.', fr: 'J\'étudie la gestion de la supply chain.', blank: 'studying' },
              { en: 'I am very interested in logistics.', fr: 'Je suis très intéressé par la logistique.', blank: 'interested' },
              { en: 'One of my strengths is attention to detail.', fr: 'L\'un de mes points forts est le sens du détail.', blank: 'detail' },
              { en: 'I would like to learn more about your company.', fr: 'J\'aimerais en savoir plus sur votre entreprise.', blank: 'learn' },
              { en: 'When could I start the internship?', fr: 'Quand pourrais-je commencer le stage ?', blank: 'start' },
            ],
          },
          {
            id: 'linkedin-phrases',
            title: 'Écrire sur LinkedIn',
            level: 3,
            items: [
              { en: 'I am a student looking for an internship in logistics.', fr: 'Je suis étudiant et je cherche un stage en logistique.', blank: 'looking' },
              { en: 'I would be happy to connect with you.', fr: 'Je serais ravi d\'échanger avec vous.', blank: 'connect' },
              { en: 'Thank you for accepting my connection request.', fr: 'Merci d\'avoir accepté ma demande de connexion.', blank: 'accepting' },
              { en: 'I recently completed a project on stock optimization.', fr: 'J\'ai récemment terminé un projet sur l\'optimisation des stocks.', blank: 'completed' },
              { en: 'Could you share some advice about starting a career in supply chain?', fr: 'Pourriez-vous partager quelques conseils pour débuter une carrière en supply chain ?', blank: 'advice' },
              { en: 'I am grateful for any guidance you can offer.', fr: "Je vous serais reconnaissant de tout conseil que vous pourrez m'apporter.", blank: 'guidance' },
            ],
          },
        ],
      },
    ],
  },
}
