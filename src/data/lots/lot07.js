// Lot 7 — Production : Atelier (4 formules, 4 défis Excel, 2 études de cas) + Anglais (unité « Produire »).
import { fmt, int, pick } from '../gen.js'

const sum = (a) => a.reduce((s, x) => s + x, 0)

export default {
  formulas: [
    {
      id: 'besoins-nets-mrp',
      title: 'Besoins nets du MRP',
      short: 'Besoin net = besoin brut − stock − réceptions',
      course: {
        purpose:
          "Le **MRP** calcule ce qu'il faut vraiment commander ou fabriquer : on part du **besoin brut** et on retire ce que l'on a déjà (stock et commandes en route). On arrondit ensuite au **lot**, puis on recule la date du **délai** pour savoir quand lancer.",
        formulas: ['Besoin net = max(0 ; besoin brut − stock − réceptions prévues)', 'Quantité lancée = besoin net arrondi au multiple de lot supérieur', 'Semaine de lancement = semaine du besoin − délai'],
        terms: [
          ['Besoin brut', 'Quantité nécessaire dans la période, issue du PDP et des nomenclatures.'],
          ['Réceptions prévues', 'Commandes déjà passées qui arriveront avant le besoin.'],
          ['Lot', 'Quantité minimale ou multiple de commande ou de fabrication.'],
          ['Délai', "Temps entre le lancement de l'ordre et sa disponibilité."],
        ],
        example: {
          statement: 'Besoin brut 90 en semaine 6 ; stock 30 ; réception prévue 20 ; lot de 25 ; délai 2 semaines.',
          steps: ['Besoin net = 90 − 30 − 20 = 40', 'Lot de 25 : 40 / 25 = 1,6 → 2 lots, soit 50 unités', 'Lancement = semaine 6 − 2 = semaine 4'],
          result: 'On lance 50 unités en semaine 4 pour couvrir le besoin de la semaine 6.',
        },
        exercises: [
          () => {
            const stock = int(10, 60, 5)
            const receipt = int(0, 40, 10)
            const gross = stock + receipt + int(20, 120, 10)
            return {
              kind: 'number',
              statement: 'Calcule le besoin net de la période.',
              data: [['Besoin brut', `${gross} unités`], ['Stock disponible', `${stock} unités`], ['Réception prévue', `${receipt} unités`]],
              question: 'Besoin net (en unités) ?',
              answer: gross - stock - receipt,
              unit: 'unités',
              tolerance: 0.5,
              steps: [`Besoin net = ${gross} − ${stock} − ${receipt} = ${gross - stock - receipt}`],
              conclusion: 'On ne commande que ce qui manque après avoir compté le stock et les commandes en route.',
            }
          },
          () => {
            const lot = pick([20, 25, 50, 100])
            let net = int(20, 260, 5)
            if (net % lot === 0) net += 5
            const order = Math.ceil(net / lot) * lot
            return {
              kind: 'number',
              statement: 'Arrondis le besoin net au lot de commande.',
              data: [['Besoin net', `${net} unités`], ['Commande par multiples de', `${lot} unités`]],
              question: 'Quantité à lancer (en unités) ?',
              answer: order,
              unit: 'unités',
              tolerance: 0.5,
              steps: [`${net} / ${lot} = ${fmt(net / lot, 2)} → ${Math.ceil(net / lot)} lots`, `Quantité = ${Math.ceil(net / lot)} × ${lot} = ${order}`],
              conclusion: 'On arrondit toujours au lot supérieur : arrondir en dessous laisserait un manque.',
            }
          },
          () => {
            const need = int(6, 14)
            const lead = int(1, 5)
            return {
              kind: 'number',
              statement: 'Détermine la semaine de lancement.',
              data: [['Besoin en semaine', String(need)], ['Délai d\'approvisionnement', `${lead} semaine${lead > 1 ? 's' : ''}`]],
              question: 'Numéro de la semaine de lancement ?',
              answer: need - lead,
              unit: '',
              tolerance: 0.1,
              steps: [`Lancement = ${need} − ${lead} = semaine ${need - lead}`],
              conclusion: 'Le lancement est toujours décalé du délai pour que la marchandise arrive à temps.',
            }
          },
          () => {
            const stock = int(30, 80, 5)
            const needs = [int(10, 40, 5), int(10, 40, 5), int(10, 40, 5)]
            const prod = int(20, 60, 10)
            const end = stock - needs[0] - needs[1] + prod - needs[2]
            return {
              kind: 'number',
              statement: 'Projette le stock sur 3 semaines : la production arrive en semaine 2.',
              data: [['Stock initial', `${stock} unités`], ['Besoins S1 / S2 / S3', needs.join(' / ')], ['Production reçue en S2', `${prod} unités`]],
              question: 'Stock projeté à la fin de la semaine 3 (en unités) ?',
              answer: end,
              unit: 'unités',
              tolerance: 0.5,
              steps: [`S1 : ${stock} − ${needs[0]} = ${stock - needs[0]}`, `S2 : ${stock - needs[0]} + ${prod} − ${needs[1]} = ${stock - needs[0] + prod - needs[1]}`, `S3 : ${stock - needs[0] + prod - needs[1]} − ${needs[2]} = ${end}`],
              conclusion: end < 0 ? 'Le stock projeté est négatif : il y aura un besoin net à couvrir.' : 'Le stock reste positif : aucun besoin net supplémentaire sur la période.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'gross', label: 'Besoin brut', unit: 'unités', value: 90 },
            { key: 'stock', label: 'Stock disponible', unit: 'unités', value: 30 },
            { key: 'receipt', label: 'Réception prévue', unit: 'unités', value: 20 },
            { key: 'lot', label: 'Lot de commande', unit: 'unités', value: 25 },
            { key: 'week', label: 'Semaine du besoin', value: 6 },
            { key: 'lead', label: 'Délai', unit: 'semaines', value: 2 },
          ],
          outputs: [
            { label: 'Besoin net', unit: 'unités', digits: 0, fn: (n) => Math.max(0, n.gross - n.stock - n.receipt) },
            { label: 'Quantité à lancer', unit: 'unités', digits: 0, highlight: true, fn: (n) => (n.lot > 0 ? Math.ceil(Math.max(0, n.gross - n.stock - n.receipt) / n.lot) * n.lot : 0) },
            { label: 'Semaine de lancement', unit: '', digits: 0, fn: (n) => n.week - n.lead },
          ],
          steps: (n) => [`Besoin net = ${fmt(n.gross)} − ${fmt(n.stock)} − ${fmt(n.receipt)} = ${fmt(Math.max(0, n.gross - n.stock - n.receipt))}`, `Lancement = semaine ${fmt(n.week)} − ${fmt(n.lead)} = semaine ${fmt(n.week - n.lead)}`],
          note: 'Si le besoin net est nul, aucun ordre n\'est à lancer.',
        },
      },
    },

    {
      id: 'trs',
      title: 'TRS : rendement des machines',
      short: 'TRS = disponibilité × performance × qualité',
      course: {
        purpose:
          "Le **TRS** (ou OEE) mesure la part du temps où une machine produit **des pièces bonnes à la cadence idéale**. Il combine trois pertes : les **arrêts** (disponibilité), les **ralentissements** (performance) et les **rebuts** (qualité).",
        formulas: ['Disponibilité = temps de marche / temps requis', 'Performance = (pièces produites × temps de cycle idéal) / temps de marche', 'Qualité = pièces bonnes / pièces produites', 'TRS = disponibilité × performance × qualité'],
        terms: [
          ['Temps requis', 'Temps pendant lequel la machine devrait produire.'],
          ['Temps de marche', 'Temps requis moins les arrêts (pannes, réglages).'],
          ['Cycle idéal', 'Temps minimal pour fabriquer une pièce à pleine cadence.'],
          ['Pièces bonnes', 'Pièces conformes, sans rebut.'],
        ],
        example: {
          statement: 'Temps requis 480 min, arrêts 60 min, cycle idéal 0,5 min, 700 pièces produites dont 672 bonnes.',
          steps: ['Marche = 480 − 60 = 420 min → disponibilité = 420 / 480 = 87,5 %', 'Performance = 700 × 0,5 / 420 = 350 / 420 = 83,3 %', 'Qualité = 672 / 700 = 96 %', 'TRS = 0,875 × 0,833 × 0,96 ≈ 70 %'],
          result: 'La machine produit 70 % de ce qu\'elle ferait sans aucune perte.',
        },
        exercises: [
          () => {
            const stops = int(30, 120, 10)
            return {
              kind: 'number',
              statement: 'Calcule la disponibilité de la machine.',
              data: [['Temps requis', '480 min'], ['Arrêts (pannes + réglages)', `${stops} min`]],
              question: 'Disponibilité (en %) ?',
              answer: ((480 - stops) / 480) * 100,
              unit: '%',
              tolerance: 0.2,
              steps: [`Marche = 480 − ${stops} = ${480 - stops} min`, `Disponibilité = ${480 - stops} / 480 = ${fmt(((480 - stops) / 480) * 100, 1)} %`],
              conclusion: 'La disponibilité ne tient compte que des arrêts, pas de la cadence ni des rebuts.',
            }
          },
          () => {
            const run = int(380, 440, 10)
            const ideal = pick([0.4, 0.5, 0.6])
            const produced = Math.round((run / ideal) * (int(75, 95) / 100))
            return {
              kind: 'number',
              statement: 'Calcule la performance de la machine.',
              data: [['Temps de marche', `${run} min`], ['Cycle idéal', `${fmt(ideal)} min / pièce`], ['Pièces produites', `${fmt(produced)}`]],
              question: 'Performance (en %) ?',
              answer: ((produced * ideal) / run) * 100,
              unit: '%',
              tolerance: 0.3,
              steps: [`Temps théorique = ${fmt(produced)} × ${fmt(ideal)} = ${fmt(produced * ideal, 1)} min`, `Performance = ${fmt(produced * ideal, 1)} / ${run} = ${fmt(((produced * ideal) / run) * 100, 1)} %`],
              conclusion: 'Une performance inférieure à 100 % signale des ralentissements ou des micro-arrêts.',
            }
          },
          () => {
            const a = int(80, 95)
            const p = int(75, 95)
            const q = int(92, 99)
            return {
              kind: 'number',
              statement: 'Combine les trois facteurs.',
              data: [['Disponibilité', `${a} %`], ['Performance', `${p} %`], ['Qualité', `${q} %`]],
              question: 'TRS (en %) ?',
              answer: (a * p * q) / 10000,
              unit: '%',
              tolerance: 0.3,
              steps: [`TRS = ${a} % × ${p} % × ${q} %`, `= ${fmt(a / 100, 2)} × ${fmt(p / 100, 2)} × ${fmt(q / 100, 2)} = ${fmt((a * p * q) / 10000, 1)} %`],
              conclusion: 'Les trois pertes se multiplient : trois facteurs « corrects » donnent un TRS nettement plus bas.',
            }
          },
          () => {
            const stops = int(30, 90, 10)
            const ideal = pick([0.5, 0.6, 0.75])
            const run = 480 - stops
            const produced = Math.round((run / ideal) * (int(80, 95) / 100))
            const good = Math.round(produced * (int(94, 99) / 100))
            return {
              kind: 'number',
              statement: 'Calcule directement le TRS à partir des données brutes.',
              data: [['Temps requis', '480 min'], ['Arrêts', `${stops} min`], ['Cycle idéal', `${fmt(ideal)} min / pièce`], ['Pièces produites', fmt(produced)], ['Pièces bonnes', fmt(good)]],
              question: 'TRS (en %) ?',
              answer: ((good * ideal) / 480) * 100,
              unit: '%',
              tolerance: 0.5,
              steps: [`Disponibilité = ${run} / 480 = ${fmt((run / 480) * 100, 1)} %`, `Performance = ${fmt(produced)} × ${fmt(ideal)} / ${run} = ${fmt(((produced * ideal) / run) * 100, 1)} %`, `Qualité = ${fmt(good)} / ${fmt(produced)} = ${fmt((good / produced) * 100, 1)} %`, `TRS = pièces bonnes × cycle / temps requis = ${fmt(good)} × ${fmt(ideal)} / 480 = ${fmt(((good * ideal) / 480) * 100, 1)} %`],
              conclusion: 'Raccourci utile : TRS = temps de production utile / temps requis.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'req', label: 'Temps requis', unit: 'min', value: 480 },
            { key: 'stop', label: 'Arrêts', unit: 'min', value: 60 },
            { key: 'ideal', label: 'Cycle idéal', unit: 'min / pièce', value: 0.5 },
            { key: 'prod', label: 'Pièces produites', value: 700 },
            { key: 'good', label: 'Pièces bonnes', value: 672 },
          ],
          outputs: [
            { label: 'Disponibilité', unit: '%', digits: 1, fn: (n) => ((n.req - n.stop) / n.req) * 100 },
            { label: 'Performance', unit: '%', digits: 1, fn: (n) => ((n.prod * n.ideal) / (n.req - n.stop)) * 100 },
            { label: 'Qualité', unit: '%', digits: 1, fn: (n) => (n.good / n.prod) * 100 },
            { label: 'TRS', unit: '%', digits: 1, highlight: true, fn: (n) => ((n.good * n.ideal) / n.req) * 100 },
          ],
          steps: (n) => [`Marche = ${fmt(n.req)} − ${fmt(n.stop)} = ${fmt(n.req - n.stop)} min`, `TRS = ${fmt(n.good)} × ${fmt(n.ideal)} / ${fmt(n.req)} = ${fmt(((n.good * n.ideal) / n.req) * 100, 1)} %`],
          note: 'Objectif mondial souvent cité : 85 %.',
        },
      },
    },

    {
      id: 'lot-fabrication',
      title: 'Lot économique de fabrication',
      short: 'Q* = √(2 × D × S / (H × (1 − d/p)))',
      course: {
        purpose:
          "Quand l'entreprise **fabrique** elle-même ses articles, le stock se remplit progressivement pendant la production. La formule de Wilson est adaptée : on **réduit le coût de stockage** par la part de la production qui est consommée en même temps. Le résultat est le **lot de fabrication** qui minimise le coût de lancement et de stockage.",
        formulas: ['Q* = √( 2 × D × S / ( H × (1 − d / p) ) )', 'd / p = demande par jour / production par jour'],
        terms: [
          ['D', 'Demande annuelle (unités).'],
          ['S', "Coût de lancement d'une série (réglage, nettoyage…), en €."],
          ['H', 'Coût de possession d\'une unité pendant un an, en €.'],
          ['d', 'Demande par jour.'],
          ['p', 'Cadence de production par jour (p doit être supérieur à d).'],
        ],
        example: {
          statement: 'D = 6 000 ; S = 120 € ; H = 3 € ; d / p = 0,25 (on produit 4 fois plus vite qu\'on ne consomme).',
          steps: ['1 − d/p = 0,75', 'Q* = √(2 × 6 000 × 120 / (3 × 0,75)) = √(1 440 000 / 2,25) = √640 000', 'Q* = 800 unités'],
          result: 'On lance des séries de 800 unités (soit 7,5 séries par an).',
        },
        exercises: [
          () => {
            const D = int(3000, 12000, 500)
            const S = int(60, 200, 10)
            const H = pick([2, 3, 4, 5])
            const r = pick([0.2, 0.25, 0.4, 0.5])
            const q = Math.sqrt((2 * D * S) / (H * (1 - r)))
            return {
              kind: 'number',
              statement: 'Calcule le lot économique de fabrication.',
              data: [['Demande annuelle D', `${fmt(D)} unités`], ['Coût de lancement S', `${S} €`], ['Coût de possession H', `${H} € / unité / an`], ['d / p', fmt(r)]],
              question: 'Lot économique Q* (en unités) ?',
              answer: q,
              unit: 'unités',
              tolerance: 3,
              steps: [`1 − d/p = ${fmt(1 - r)}`, `2 × D × S = ${fmt(2 * D * S)}`, `H × (1 − d/p) = ${fmt(H * (1 - r))}`, `Q* = √(${fmt(2 * D * S)} / ${fmt(H * (1 - r))}) = ${fmt(q, 0)}`],
              conclusion: 'Plus la production est rapide par rapport à la demande, plus le lot économique est grand.',
            }
          },
          () => {
            const D = int(4000, 12000, 500)
            const q = int(400, 1200, 100)
            const runs = D / q
            return {
              kind: 'number',
              statement: 'Combien de séries lance-t-on par an avec ce lot ?',
              data: [['Demande annuelle', `${fmt(D)} unités`], ['Lot de fabrication', `${fmt(q)} unités`]],
              question: 'Nombre de séries par an ?',
              answer: runs,
              unit: 'séries',
              tolerance: 0.1,
              steps: [`Séries = D / Q = ${fmt(D)} / ${fmt(q)} = ${fmt(runs, 1)}`],
              conclusion: 'Un grand nombre de séries signifie beaucoup de changements de série : leur coût compte.',
            }
          },
          () => {
            const q = int(400, 1000, 100)
            const S = int(80, 200, 10)
            const D = q * int(5, 12)
            const cost = (D / q) * S
            return {
              kind: 'number',
              statement: 'Calcule le coût annuel de lancement des séries.',
              data: [['Demande annuelle', `${fmt(D)} unités`], ['Lot', `${fmt(q)} unités`], ['Coût de lancement', `${S} € par série`]],
              question: 'Coût annuel de lancement (en €) ?',
              answer: cost,
              unit: '€',
              tolerance: 1,
              steps: [`Nombre de séries = ${fmt(D)} / ${fmt(q)} = ${fmt(D / q, 1)}`, `Coût = ${fmt(D / q, 1)} × ${S} = ${fmt(cost, 0)} €`],
              conclusion: 'Réduire le coût de lancement (réglages rapides) permet de produire de plus petites séries.',
            }
          },
          () => {
            const r = pick([0.2, 0.25, 0.4, 0.5])
            const D = int(4000, 10000, 500)
            const S = int(60, 160, 10)
            const H = pick([2, 3, 4])
            const wilson = Math.sqrt((2 * D * S) / H)
            const prod = Math.sqrt((2 * D * S) / (H * (1 - r)))
            return {
              kind: 'number',
              statement: 'De combien le lot de fabrication dépasse-t-il le lot de Wilson (achat) ?',
              data: [['D', fmt(D)], ['S', `${S} €`], ['H', `${H} €`], ['d / p', fmt(r)]],
              question: 'Écart en pourcentage entre Q* de fabrication et le Q* de Wilson (en %) ?',
              answer: (prod / wilson - 1) * 100,
              unit: '%',
              tolerance: 0.5,
              steps: [`Wilson = √(2 × ${fmt(D)} × ${S} / ${H}) = ${fmt(wilson, 0)}`, `Fabrication = Wilson / √(1 − ${fmt(r)}) = ${fmt(prod, 0)}`, `Écart = ${fmt(prod, 0)} / ${fmt(wilson, 0)} − 1 = ${fmt((prod / wilson - 1) * 100, 1)} %`],
              conclusion: 'Le lot de fabrication est toujours plus grand que celui de Wilson, car le stock se remplit moins vite.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'D', label: 'Demande annuelle D', unit: 'unités', value: 6000 },
            { key: 'S', label: 'Coût de lancement S', unit: '€', value: 120 },
            { key: 'H', label: 'Coût de possession H', unit: '€ / unité / an', value: 3 },
            { key: 'r', label: 'Rapport d / p', value: 0.25, help: 'Strictement entre 0 et 1' },
          ],
          outputs: [
            { label: 'Lot économique Q*', unit: 'unités', digits: 0, highlight: true, fn: (n) => (n.r >= 0 && n.r < 1 && n.H > 0 ? Math.sqrt((2 * n.D * n.S) / (n.H * (1 - n.r))) : 0) },
            { label: 'Séries par an', unit: 'séries', digits: 1, fn: (n) => (n.r >= 0 && n.r < 1 && n.H > 0 ? n.D / Math.sqrt((2 * n.D * n.S) / (n.H * (1 - n.r))) : 0) },
          ],
          steps: (n) => [`1 − d/p = ${fmt(1 - n.r)}`, `Q* = √(2 × ${fmt(n.D)} × ${fmt(n.S)} / (${fmt(n.H)} × ${fmt(1 - n.r)}))`],
          note: 'd/p doit rester inférieur à 1 : on doit produire plus vite qu\'on ne consomme.',
        },
      },
    },

    {
      id: 'loi-little',
      title: 'Loi de Little : en-cours et délai',
      short: 'En-cours = débit × temps de traversée',
      course: {
        purpose:
          "La **loi de Little** relie trois grandeurs d'un flux stable : le **stock en cours** (les produits présents dans le système), le **débit** (produits qui sortent par unité de temps) et le **temps de traversée** (durée passée dans le système). Connaître deux d'entre elles donne la troisième.",
        formulas: ['L = λ × W', 'W = L / λ (temps de traversée)', 'λ = L / W (débit)'],
        terms: [
          ['L', 'Nombre moyen d\'unités dans le système (en-cours).'],
          ['λ', 'Débit : unités qui sortent par jour, heure…'],
          ['W', 'Temps moyen passé dans le système, dans la même unité de temps.'],
        ],
        example: {
          statement: 'Un atelier a 600 pièces en cours et en sort 150 par jour.',
          steps: ['W = L / λ = 600 / 150 = 4', 'Chaque pièce reste en moyenne 4 jours dans l\'atelier'],
          result: 'Pour réduire le délai de moitié à débit constant, il faut diviser l\'en-cours par deux.',
        },
        exercises: [
          () => {
            const lambda = int(40, 200, 10)
            const W = int(2, 10)
            return {
              kind: 'number',
              statement: 'Calcule l\'en-cours moyen.',
              data: [['Débit', `${lambda} pièces / jour`], ['Temps de traversée', `${W} jours`]],
              question: 'En-cours moyen (en pièces) ?',
              answer: lambda * W,
              unit: 'pièces',
              tolerance: 0.5,
              steps: [`L = λ × W = ${lambda} × ${W} = ${lambda * W}`],
              conclusion: 'À débit égal, un délai plus long signifie plus de pièces immobilisées dans le système.',
            }
          },
          () => {
            const lambda = int(40, 200, 10)
            const L = lambda * int(2, 9)
            return {
              kind: 'number',
              statement: 'Calcule le temps de traversée moyen.',
              data: [['En-cours', `${L} pièces`], ['Débit', `${lambda} pièces / jour`]],
              question: 'Temps de traversée (en jours) ?',
              answer: L / lambda,
              unit: 'jours',
              tolerance: 0.1,
              steps: [`W = L / λ = ${L} / ${lambda} = ${fmt(L / lambda, 1)}`],
              conclusion: 'Réduire les en-cours est le moyen le plus direct de raccourcir les délais.',
            }
          },
          () => {
            const W = int(2, 8)
            const lambda = int(30, 150, 10)
            const L = lambda * W
            return {
              kind: 'number',
              statement: 'Calcule le débit du système.',
              data: [['En-cours', `${L} pièces`], ['Temps de traversée', `${W} jours`]],
              question: 'Débit (en pièces par jour) ?',
              answer: L / W,
              unit: 'pièces / jour',
              tolerance: 0.5,
              steps: [`λ = L / W = ${L} / ${W} = ${fmt(L / W, 0)}`],
              conclusion: 'Le débit est la production réellement sortie, pas la capacité théorique.',
            }
          },
          () => {
            const lambda = int(50, 200, 10)
            const W = int(4, 10)
            const target = Math.floor(W / 2)
            return {
              kind: 'number',
              statement: 'Le débit reste constant. On veut ramener le temps de traversée à la valeur cible.',
              data: [['Débit', `${lambda} pièces / jour`], ['Temps actuel', `${W} jours`], ['Temps cible', `${target} jours`]],
              question: 'Nouvel en-cours à viser (en pièces) ?',
              answer: lambda * target,
              unit: 'pièces',
              tolerance: 0.5,
              steps: [`En-cours actuel = ${lambda} × ${W} = ${lambda * W}`, `En-cours cible = ${lambda} × ${target} = ${lambda * target}`],
              conclusion: `Il faut retirer ${fmt(lambda * (W - target))} pièces de l'atelier : moins de séries lancées d'avance, plus de flux tiré.`,
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'L', label: 'En-cours L', unit: 'pièces', value: 600 },
            { key: 'lam', label: 'Débit λ', unit: 'pièces / jour', value: 150 },
          ],
          outputs: [
            { label: 'Temps de traversée W', unit: 'jours', digits: 1, highlight: true, fn: (n) => (n.lam > 0 ? n.L / n.lam : 0) },
            { label: 'Temps de traversée en heures (8 h/jour)', unit: 'heures', digits: 1, fn: (n) => (n.lam > 0 ? (n.L / n.lam) * 8 : 0) },
          ],
          steps: (n) => [`W = ${fmt(n.L)} / ${fmt(n.lam)} = ${fmt(n.lam > 0 ? n.L / n.lam : 0, 1)} jours`],
          note: 'Valable pour un flux stable : ce qui entre est égal à ce qui sort en moyenne.',
        },
      },
    },
  ],

  excel: [
    {
      id: 'besoin-net-mrp',
      fn: 'MAX',
      level: 2,
      tier: 5,
      title: 'Le besoin net du MRP',
      context: "Tu calcules ce qu'il faut commander pour la semaine à partir du besoin brut, du stock et des réceptions prévues.",
      instruction: 'En **B5**, calcule le **besoin net** : besoin brut − stock − réception, **sans jamais descendre sous zéro**.',
      generate() {
        const stock = int(10, 60, 5)
        const receipt = int(0, 40, 10)
        const gross = Math.max(5, stock + receipt + int(-30, 80, 5))
        return { rows: [['Besoin brut', gross], ['Stock disponible', stock], ['Réception prévue', receipt]], extra: { A5: 'Besoin net' } }
      },
      target: 'B5',
      solution: '=MAX(0;B1-B2-B3)',
      mustUse: ['MAX'],
      hints: ['Besoin brut en B1, stock en B2, réception en B3.', 'MAX(0 ; B1−B2−B3) évite un résultat négatif.'],
      explain: "Si le stock et les réceptions dépassent le besoin brut, la différence serait négative : le besoin net est alors nul (aucun ordre à lancer). MAX(0 ; …) traduit cette règle.",
    },
    {
      id: 'trs-excel',
      fn: 'ARRONDI',
      level: 3,
      tier: 5,
      title: 'Le TRS d\'une machine',
      context: 'Tu calcules le taux de rendement synthétique de la machine à partir du relevé de la journée.',
      instruction: 'En **B6**, calcule le **TRS en %** : pièces bonnes × cycle idéal ÷ temps requis × 100, **arrondi à 1 décimale**.',
      generate() {
        const stops = int(30, 90, 10)
        const ideal = pick([0.5, 0.6, 0.75])
        const produced = Math.round(((480 - stops) / ideal) * (int(80, 95) / 100))
        const good = Math.round(produced * (int(94, 99) / 100))
        return { rows: [['Temps requis (min)', 480], ['Arrêts (min)', stops], ['Cycle idéal (min)', ideal], ['Pièces produites', produced], ['Pièces bonnes', good]], extra: { A6: 'TRS (%)' } }
      },
      target: 'B6',
      solution: '=ARRONDI(B5*B3/B1*100;1)',
      mustUse: ['ARRONDI'],
      hints: ['Le temps de production utile = pièces bonnes (B5) × cycle idéal (B3).', 'Divise par le temps requis (B1), multiplie par 100 puis arrondis à 1 décimale.'],
      explain: 'Le TRS (disponibilité × performance × qualité) se simplifie en : temps de production utile ÷ temps requis. Les arrêts et les pièces produites sont déjà « inclus » dans les pièces bonnes.',
    },
    {
      id: 'taux-de-charge',
      fn: 'SOMMEPROD',
      level: 3,
      tier: 5,
      title: 'Le taux de charge d\'un atelier',
      context: 'Tu compares la charge de la semaine à la capacité disponible de l\'atelier.',
      instruction: 'En **B7**, calcule le **taux de charge en %** : charge totale (quantité × minutes par pièce, convertie en heures) ÷ capacité en heures × 100, **arrondi à l\'entier**.',
      generate() {
        const rows = ['Pièce A', 'Pièce B', 'Pièce C'].map((p) => [p, int(200, 1200, 50), pick([2, 3, 4, 5, 6])])
        const load = sum(rows.map((r) => r[1] * r[2])) / 60
        const cap = Math.round((load * (int(75, 130) / 100)) / 5) * 5
        return { rows: [['Produit', 'Quantité', 'Minutes / pièce'], ...rows, ['Capacité (h)', cap]], extra: { A7: 'Taux de charge (%)' } }
      },
      target: 'B7',
      solution: '=ARRONDI(SOMMEPROD(B2:B4;C2:C4)/60/B5*100;0)',
      mustUse: ['SOMMEPROD', 'ARRONDI'],
      hints: ['SOMMEPROD(B2:B4;C2:C4) donne le total des minutes de travail.', 'Divise par 60 pour passer en heures, puis par la capacité B5, × 100.'],
      explain: 'SOMMEPROD multiplie quantité et temps ligne par ligne puis additionne : c\'est la charge totale. Au-dessus de 100 %, le plan est irréalisable sans ajouter de capacité.',
    },
    {
      id: 'ratio-critique-excel',
      fn: 'ARRONDI',
      level: 2,
      tier: 5,
      title: 'Le ratio critique',
      context: 'Tu mesures l\'urgence d\'une commande dans le planning de l\'atelier.',
      instruction: 'En **B4**, calcule le **ratio critique** : jours avant l\'échéance ÷ jours de travail restants, **arrondi à 2 décimales**.',
      generate() {
        return { rows: [['Commande', 'Réf.'], ['Jours avant l\'échéance', int(4, 14)], ['Jours de travail restants', int(3, 12)]], extra: { A4: 'Ratio critique' } }
      },
      target: 'B4',
      solution: '=ARRONDI(B2/B3;2)',
      mustUse: ['ARRONDI'],
      hints: ['Échéance en B2, travail restant en B3.', 'Divise B2 par B3, puis arrondis à 2 décimales.'],
      explain: "Un ratio inférieur à 1 signifie que la commande est en retard (il reste moins de temps que de travail) : elle passe en priorité.",
    },
  ],

  cases: [
    {
      id: 'mrp-lancement',
      title: 'Quand lancer la commande ?',
      role: "Planificateur MRP dans une usine d'électroménager",
      lesson: 'production/mrp',
      generate() {
        const stock = int(40, 120, 10)
        const receipt = int(20, 60, 10)
        const need = stock + receipt + int(25, 150, 5)
        const net = need - stock - receipt
        const lot = pick([25, 50, 100])
        const order = Math.ceil(net / lot) * lot
        const week = int(7, 12)
        const lead = pick([2, 3, 4])
        return {
          intro: `Le MRP te signale, en semaine ${week}, un besoin brut de ${need} moteurs. Le stock disponible est de ${stock}, une réception de ${receipt} est déjà prévue. Le fournisseur livre par lots de ${lot} avec un délai de ${lead} semaines.`,
          steps: [
            {
              situation: 'Quel est le besoin net ?',
              better: `Besoin net = ${need} − ${stock} − ${receipt} = ${net} moteurs. On retire le stock et la réception déjà prévue : commander ${need} reviendrait à acheter ce que l'on possède déjà.`,
              choices: [
                { text: `${net} moteurs : on retire le stock et la réception.`, points: 3, feedback: `${need} − ${stock} − ${receipt} = ${net} : c'est exactement ce qui manque.` },
                { text: `${need} moteurs : on commande tout le besoin brut.`, points: 0, feedback: `Tu commanderais ${stock + receipt} moteurs en trop, car ils sont déjà en stock ou en route.` },
                { text: `${need - stock} moteurs : on oublie la réception prévue.`, points: 1, feedback: `Tu as retiré le stock, mais pas la réception de ${receipt} déjà commandée : tu surcommandes.` },
              ],
            },
            {
              situation: `Le fournisseur livre par lots de ${lot}. Quelle quantité commandes-tu ?`,
              better: `${net} / ${lot} = ${fmt(net / lot, 2)} : on arrondit au lot supérieur, soit ${order} moteurs. En commander moins laisserait un manque.`,
              choices: [
                { text: `${order} moteurs, arrondis au lot supérieur.`, points: 3, feedback: `Le lot oblige à commander un multiple de ${lot} : ${order} couvre le besoin net de ${net}.` },
                { text: `${net} moteurs, exactement le besoin net.`, points: 1, feedback: `Le fournisseur ne livre que par multiples de ${lot} : cette quantité ne peut pas être commandée telle quelle.` },
                { text: `${order + lot} moteurs, pour avoir de la marge.`, points: 0, feedback: `Un lot de plus (${lot} moteurs) immobilise du stock inutilement : le stock de sécurité se traite à part.` },
              ],
            },
            {
              situation: 'À quelle semaine lances-tu la commande ?',
              better: `Semaine ${week} − ${lead} semaines de délai = semaine ${week - lead}. Commander plus tard ferait livrer le composant après la date du besoin.`,
              choices: [
                { text: `En semaine ${week - lead}, soit le besoin moins le délai.`, points: 3, feedback: `Le moteur arrive ${lead} semaines après la commande : il est là pile pour la semaine ${week}.` },
                { text: `En semaine ${week}, quand le besoin apparaît.`, points: 0, feedback: `Le moteur arriverait en semaine ${week + lead} : la production serait arrêtée entre-temps.` },
                { text: `En semaine ${week - lead - 3}, par sécurité.`, points: 1, feedback: 'Commander trop tôt immobilise de la trésorerie et du stock ; mieux vaut un stock de sécurité raisonné.' },
              ],
            },
          ],
          debrief: `Le MRP applique toujours la même séquence : besoin net (${net}), arrondi au lot (${order}), lancement décalé du délai (semaine ${week - lead}).`,
        }
      },
    },
    {
      id: 'goulot-usine',
      title: 'Où se cache le goulot ?',
      role: "Responsable production d'une usine de mobilier métallique",
      lesson: 'production/charge',
      intro:
        "Ta ligne comprend trois postes en série : la découpe (120 pièces/h), la soudure (80 pièces/h) et la peinture (100 pièces/h). Le carnet de commandes demande 90 pièces par heure.",
      steps: [
        {
          situation: 'Quel poste limite la production ?',
          better: "La ligne produit au rythme de son poste le plus lent : la soudure, avec 80 pièces/h, soit 10 pièces/h de moins que la demande (90). C'est le goulot.",
          choices: [
            { text: 'La soudure : 80 pièces/h, le plus bas des trois.', points: 3, feedback: 'Tout ce qui sort de la ligne passe par la soudure : son débit de 80 pièces/h limite la ligne entière.' },
            { text: 'La découpe : elle est en début de ligne.', points: 0, feedback: 'La découpe a la plus grande capacité (120 pièces/h) : elle attend plutôt la soudure.' },
            { text: 'La peinture : elle est en fin de ligne.', points: 1, feedback: 'La peinture (100 pièces/h) dépasse la demande : elle n\'est pas le maillon le plus faible.' },
          ],
        },
        {
          situation: 'Tu as un budget pour augmenter une capacité. Où l\'investis-tu ?',
          better: "Seule une augmentation de la capacité du goulot (la soudure) améliore la production de toute la ligne. Ajouter de la capacité ailleurs ne ferait que créer du stock devant la soudure.",
          choices: [
            { text: 'Sur la soudure, pour dépasser 90 pièces/h.', points: 3, feedback: 'Au-dessus de 90 pièces/h à la soudure, la ligne répond à la demande (la peinture plafonne à 100).' },
            { text: 'Sur la découpe, déjà la plus rapide.', points: 0, feedback: 'La découpe produirait plus que la soudure ne peut absorber : les pièces s\'accumuleraient devant le goulot.' },
            { text: 'Sur la peinture, pour « équilibrer » la ligne.', points: 1, feedback: 'La peinture n\'est pas le frein : le gain réel sur le flux de la ligne serait nul.' },
          ],
        },
        {
          situation: 'En attendant l\'investissement, comment protèges-tu le goulot ?',
          better: "Chaque heure perdue à la soudure est perdue pour toute la ligne : on évite les arrêts du goulot (matière toujours disponible, maintenance planifiée hors production, pauses décalées) et on contrôle la qualité avant lui.",
          choices: [
            { text: 'Je garde toujours des pièces devant la soudure et je planifie sa maintenance hors des heures de production.', points: 3, feedback: 'Un goulot qui ne s\'arrête jamais maximise le débit de la ligne : un stock tampon le protège.' },
            { text: 'Je lance la découpe à fond pour remplir l\'atelier.', points: 0, feedback: 'Produire à fond en amont gonfle les en-cours sans augmenter les pièces finies : c\'est du gaspillage.' },
            { text: 'Je laisse la soudure s\'arrêter pendant les pauses, comme les autres postes.', points: 1, feedback: 'Une pause du goulot arrête la ligne : on décale les pauses pour que la soudure tourne en continu.' },
          ],
        },
      ],
      debrief:
        "Le débit d'une ligne est celui de son goulot. On l'identifie, on le protège contre les arrêts et on n'investit que là où l'on augmente réellement le flux.",
    },
  ],

  english: {
    units: [
      {
        id: 'production-en',
        title: 'Produire',
        icon: 'factory',
        color: 'lime',
        lessons: [
          {
            id: 'machines',
            title: 'Machines et production',
            level: 2,
            items: [
              { en: 'production line', fr: 'ligne de production', def: "Suite de postes de travail par lesquels passent les pièces pour devenir un produit fini.", ex: 'The production line runs on two shifts.', exFr: 'La ligne de production tourne en deux équipes.' },
              { en: 'shift', fr: 'équipe (poste de travail)', def: "Période de travail d'une équipe, par exemple le matin, l'après-midi ou la nuit.", ex: 'The night shift starts at ten.', exFr: 'L\'équipe de nuit commence à dix heures.', note: 'Piège : « shift » veut aussi dire « décaler ».' },
              { en: 'downtime', fr: 'temps d\'arrêt', def: "Période pendant laquelle une machine ne produit pas à cause d'une panne ou d'un réglage.", ex: 'Downtime cost us two hours today.', exFr: 'Les arrêts nous ont coûté deux heures aujourd\'hui.' },
              { en: 'breakdown', fr: 'panne', def: "Arrêt imprévu d'une machine qui ne fonctionne plus.", ex: 'A breakdown stopped the line.', exFr: 'Une panne a arrêté la ligne.' },
              { en: 'throughput', fr: 'débit de production', def: "Quantité de produits qui sortent d'une ligne sur une période donnée.", ex: 'Throughput is ninety units per hour.', exFr: 'Le débit est de quatre-vingt-dix unités par heure.' },
              { en: 'yield', fr: 'rendement', def: "Part de la production qui est utilisable, sans défaut.", ex: 'The yield improved to ninety-five percent.', exFr: 'Le rendement est passé à quatre-vingt-quinze pour cent.' },
              { en: 'scrap', fr: 'rebut', def: "Pièce défectueuse qui ne peut pas être vendue.", ex: 'We reduced scrap by ten percent.', exFr: 'Nous avons réduit les rebuts de dix pour cent.' },
              { en: 'setup', fr: 'réglage (changement de série)', def: "Préparation de la machine pour fabriquer un nouveau produit.", ex: 'The setup takes thirty minutes.', exFr: 'Le réglage prend trente minutes.' },
            ],
          },
          {
            id: 'planning-prod',
            title: 'Planifier la fabrication',
            level: 2,
            items: [
              { en: 'work order', fr: 'ordre de fabrication', def: "Document qui demande de produire une quantité précise d'un article à une date donnée.", ex: 'The work order was released this morning.', exFr: 'L\'ordre de fabrication a été lancé ce matin.' },
              { en: 'bill of materials', fr: 'nomenclature', def: "Liste des composants et des quantités nécessaires pour fabriquer un produit.", ex: 'Check the bill of materials first.', exFr: 'Vérifiez d\'abord la nomenclature.' },
              { en: 'raw material', fr: 'matière première', def: "Matière brute achetée avant toute transformation.", ex: 'Raw material prices are rising.', exFr: 'Les prix des matières premières augmentent.' },
              { en: 'work in progress', fr: 'en-cours de production', def: "Produits en cours de fabrication, pas encore terminés.", ex: 'Work in progress is too high.', exFr: 'Les en-cours de production sont trop élevés.' },
              { en: 'batch', fr: 'lot (série)', def: "Quantité de produits fabriqués ensemble en une seule fois.", ex: 'We produce in batches of five hundred.', exFr: 'Nous produisons par lots de cinq cents.' },
              { en: 'maintenance', fr: 'maintenance', def: "Entretien et réparation des machines pour éviter les pannes.", ex: 'Maintenance is planned for Sunday.', exFr: 'La maintenance est prévue dimanche.' },
              { en: 'overtime', fr: 'heures supplémentaires', def: "Heures travaillées en plus de l'horaire normal.", ex: 'We need overtime to meet the deadline.', exFr: 'Il nous faut des heures supplémentaires pour tenir le délai.' },
              { en: 'subcontractor', fr: 'sous-traitant', def: "Entreprise à qui l'on confie une partie de la fabrication.", ex: 'A subcontractor makes the housing.', exFr: 'Un sous-traitant fabrique le boîtier.' },
            ],
          },
          {
            id: 'phrases-prod',
            title: 'Parler de la production',
            level: 3,
            items: [
              { en: 'The line is down since this morning.', fr: 'La ligne est à l\'arrêt depuis ce matin.', blank: 'down' },
              { en: 'We are running at ninety percent of capacity.', fr: 'Nous tournons à quatre-vingt-dix pour cent de la capacité.', blank: 'capacity' },
              { en: 'Can we expedite this work order?', fr: 'Peut-on accélérer cet ordre de fabrication ?', blank: 'expedite' },
              { en: 'The delay comes from a lack of raw material.', fr: 'Le retard vient d\'un manque de matière première.', blank: 'lack' },
              { en: 'We will catch up on the backlog next week.', fr: 'Nous rattraperons le retard de commandes la semaine prochaine.', blank: 'backlog' },
              { en: 'Quality control rejected the whole batch.', fr: 'Le contrôle qualité a rejeté tout le lot.', blank: 'rejected' },
            ],
          },
        ],
      },
    ],
  },
}
