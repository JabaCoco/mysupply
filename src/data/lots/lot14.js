// Lot 14 — Risques et résilience : Atelier (2 formules, 3 défis Excel, 2 études de cas) + Anglais (réclamations, litiges et risques).
import { fmt, int, pick } from '../gen.js'

export default {
  formulas: [
    {
      id: 'perte-esperee',
      title: 'Perte espérée et arbitrage assurance',
      short: 'Perte espérée = probabilité × impact',
      course: {
        purpose:
          "Pour décider combien investir dans la prévention d'un risque, on le **chiffre** : la **perte espérée** est le coût moyen annuel du risque. On la compare au **coût de la protection** (assurance, double sourcing, stock) pour savoir si elle est rentable.",
        formulas: ['Perte espérée = probabilité × impact financier', 'Criticité = probabilité × gravité (notes de 1 à 5)', 'Gain d\'une protection = perte espérée évitée − coût de la protection'],
        terms: [
          ['Probabilité', 'Chance que le risque survienne en un an, en %.'],
          ['Impact', 'Coût si le risque survient (€).'],
          ['Protection', 'Action qui réduit la probabilité ou l\'impact (assurance, second fournisseur, stock).'],
        ],
        example: {
          statement: 'Incendie d\'entrepôt : probabilité 2 % par an, impact 800 000 €. Un système d\'extinction à 12 000 € par an réduit la probabilité à 0,5 %.',
          steps: ['Perte espérée avant = 800 000 × 2 % = 16 000 €', 'Perte espérée après = 800 000 × 0,5 % = 4 000 €', 'Gain = (16 000 − 4 000) − 12 000 = 0 €'],
          result: 'La protection est juste équilibrée financièrement : elle protège aussi des conséquences non financières (réputation, clients).',
        },
        exercises: [
          () => {
            const p = pick([2, 5, 10, 20])
            const impact = int(5, 40, 5) * 10000
            return {
              kind: 'number',
              statement: 'Calcule la perte espérée annuelle du risque.',
              data: [['Probabilité annuelle', `${p} %`], ['Impact', `${fmt(impact)} €`]],
              question: 'Perte espérée (en €) ?',
              answer: (impact * p) / 100,
              unit: '€',
              tolerance: 1,
              steps: [`${fmt(impact)} × ${p} % = ${fmt((impact * p) / 100, 0)} €`],
              conclusion: 'C\'est le montant à partir duquel on compare les protections possibles.',
            }
          },
          () => {
            const p1 = pick([10, 15, 20])
            const p2 = p1 / 2
            const impact = int(10, 50, 10) * 10000
            const cost = Math.round(((impact * (p1 - p2)) / 100) * pick([0.6, 0.8, 1.2]))
            return {
              kind: 'number',
              statement: 'Une protection réduit la probabilité d\'un risque. Calcule son gain net annuel.',
              data: [['Probabilité avant → après', `${p1} % → ${p2} %`], ['Impact', `${fmt(impact)} €`], ['Coût annuel de la protection', `${fmt(cost)} €`]],
              question: 'Gain net annuel (en €, peut être négatif) ?',
              answer: (impact * (p1 - p2)) / 100 - cost,
              unit: '€',
              tolerance: 1,
              steps: [`Perte évitée = ${fmt(impact)} × (${p1} − ${p2}) % = ${fmt((impact * (p1 - p2)) / 100, 0)} €`, `Gain net = ${fmt((impact * (p1 - p2)) / 100, 0)} − ${fmt(cost)} = ${fmt((impact * (p1 - p2)) / 100 - cost, 0)} €`],
              conclusion: (impact * (p1 - p2)) / 100 - cost >= 0 ? 'Gain positif : la protection est rentable.' : 'Gain négatif : le coût dépasse la perte évitée ; d\'autres raisons peuvent tout de même la justifier.',
            }
          },
          () => {
            const p = int(1, 5)
            const g = int(1, 5)
            return {
              kind: 'number',
              statement: 'Calcule la criticité du risque.',
              data: [['Probabilité (1 à 5)', String(p)], ['Gravité (1 à 5)', String(g)]],
              question: 'Criticité ?',
              answer: p * g,
              unit: '',
              tolerance: 0.1,
              steps: [`${p} × ${g} = ${p * g} (maximum 25)`],
              conclusion: p * g >= 15 ? 'Criticité élevée : traitement prioritaire.' : p * g >= 8 ? 'Criticité moyenne : plan d\'action à prévoir.' : 'Criticité faible : surveillance suffisante.',
            }
          },
          () => {
            const prime = int(10, 60, 5) * 1000
            const impact = int(10, 40, 10) * 10000
            const p = pick([5, 10, 20])
            const exp = (impact * p) / 100
            return {
              kind: 'number',
              statement: 'Une assurance transfère entièrement le risque. Calcule son surcoût par rapport à la perte espérée.',
              data: [['Prime d\'assurance annuelle', `${fmt(prime)} €`], ['Probabilité', `${p} %`], ['Impact', `${fmt(impact)} €`]],
              question: 'Prime − perte espérée (en €) ?',
              answer: prime - exp,
              unit: '€',
              tolerance: 1,
              steps: [`Perte espérée = ${fmt(impact)} × ${p} % = ${fmt(exp, 0)} €`, `Prime − perte espérée = ${fmt(prime)} − ${fmt(exp, 0)} = ${fmt(prime - exp, 0)} €`],
              conclusion: 'L\'assureur facture en moyenne un peu plus que la perte espérée : on paie la sécurité et la stabilité du budget.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'p', label: 'Probabilité annuelle', unit: '%', value: 5 },
            { key: 'impact', label: 'Impact', unit: '€', value: 500000 },
            { key: 'p2', label: 'Probabilité après protection', unit: '%', value: 1 },
            { key: 'cost', label: 'Coût annuel de la protection', unit: '€', value: 10000 },
          ],
          outputs: [
            { label: 'Perte espérée actuelle', unit: '€', digits: 0, fn: (n) => (n.impact * n.p) / 100 },
            { label: 'Perte espérée après protection', unit: '€', digits: 0, fn: (n) => (n.impact * n.p2) / 100 },
            { label: 'Gain net de la protection', unit: '€', digits: 0, highlight: true, fn: (n) => (n.impact * (n.p - n.p2)) / 100 - n.cost },
          ],
          steps: (n) => [`Perte actuelle = ${fmt(n.impact)} × ${fmt(n.p)} % = ${fmt((n.impact * n.p) / 100, 0)} €`],
          note: 'Un gain net négatif n\'interdit pas la protection : réputation, sécurité des personnes et continuité comptent aussi.',
        },
      },
    },

    {
      id: 'temps-survie',
      title: 'Temps de survie et stock de crise',
      short: 'TTS = stock / consommation journalière',
      course: {
        purpose:
          "Face à la défaillance d'un fournisseur ou d'un site, la question est : **combien de temps peut-on tenir** ? Le **TTS** (time to survive) donne cette durée ; on le compare au **TTR** (time to recover, durée de retour à la normale) pour savoir si un stock de crise est nécessaire.",
        formulas: ['TTS = stock disponible / consommation journalière', 'Rupture = max(0 ; TTR − TTS) jours', 'Stock de crise = consommation journalière × (TTR − TTS)'],
        terms: [
          ['TTS', 'Durée de tenue grâce au stock (en jours).'],
          ['TTR', 'Durée nécessaire pour retrouver une source (réparer, qualifier un autre fournisseur).'],
          ['Stock de crise', 'Stock supplémentaire pour combler l\'écart.'],
        ],
        example: {
          statement: 'Stock de 6 000 pièces, consommation 400 par jour, TTR estimé à 30 jours.',
          steps: ['TTS = 6 000 / 400 = 15 jours', 'Rupture = 30 − 15 = 15 jours', 'Stock de crise = 400 × 15 = 6 000 pièces'],
          result: 'Il faudrait doubler le stock, ou qualifier un second fournisseur pour ramener le TTR sous 15 jours.',
        },
        exercises: [
          () => {
            const stock = int(2, 20) * 1000
            const daily = pick([200, 250, 400, 500, 1000])
            return {
              kind: 'number',
              statement: 'Calcule le temps de survie.',
              data: [['Stock', `${fmt(stock)} pièces`], ['Consommation', `${fmt(daily)} pièces/jour`]],
              question: 'TTS (en jours) ?',
              answer: stock / daily,
              unit: 'jours',
              tolerance: 0.1,
              steps: [`${fmt(stock)} / ${fmt(daily)} = ${fmt(stock / daily, 1)} jours`],
              conclusion: 'Plus la consommation est forte, plus le stock s\'épuise vite.',
            }
          },
          () => {
            const tts = int(8, 30)
            const ttr = tts + int(5, 30)
            return {
              kind: 'number',
              statement: 'Calcule le nombre de jours de rupture à craindre.',
              data: [['TTS', `${tts} jours`], ['TTR', `${ttr} jours`]],
              question: 'Jours de rupture ?',
              answer: ttr - tts,
              unit: 'jours',
              tolerance: 0.1,
              steps: [`${ttr} − ${tts} = ${ttr - tts} jours`],
              conclusion: 'Chaque jour de rupture a un coût : arrêt de ligne, pénalités, clients perdus.',
            }
          },
          () => {
            const daily = pick([200, 300, 400, 500])
            const gap = int(5, 25)
            return {
              kind: 'number',
              statement: 'Calcule le stock de crise nécessaire pour combler l\'écart.',
              data: [['Consommation', `${fmt(daily)} pièces/jour`], ['Écart TTR − TTS', `${gap} jours`]],
              question: 'Stock de crise (en pièces) ?',
              answer: daily * gap,
              unit: 'pièces',
              tolerance: 1,
              steps: [`${fmt(daily)} × ${gap} = ${fmt(daily * gap, 0)} pièces`],
              conclusion: 'Cette quantité est à comparer au coût d\'un second fournisseur.',
            }
          },
          () => {
            const daily = pick([200, 300, 400])
            const gap = int(5, 20)
            const price = int(3, 25)
            const rate = pick([8, 10, 12])
            const stock = daily * gap
            return {
              kind: 'number',
              statement: 'Calcule le coût annuel de détention du stock de crise.',
              data: [['Stock de crise', `${fmt(stock)} pièces`], ['Valeur d\'une pièce', `${price} €`], ['Taux de possession', `${rate} % par an`]],
              question: 'Coût annuel de détention (en €) ?',
              answer: (stock * price * rate) / 100,
              unit: '€',
              tolerance: 1,
              steps: [`Valeur du stock = ${fmt(stock)} × ${price} = ${fmt(stock * price, 0)} €`, `Coût = ${fmt(stock * price, 0)} × ${rate} % = ${fmt((stock * price * rate) / 100, 0)} €`],
              conclusion: 'Ce coût annuel garantit la continuité : il se compare à la perte espérée en cas de rupture.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'stock', label: 'Stock disponible', unit: 'pièces', value: 6000 },
            { key: 'daily', label: 'Consommation journalière', unit: 'pièces', value: 400 },
            { key: 'ttr', label: 'TTR estimé', unit: 'jours', value: 30 },
          ],
          outputs: [
            { label: 'TTS (temps de survie)', unit: 'jours', digits: 1, highlight: true, fn: (n) => (n.daily > 0 ? n.stock / n.daily : 0) },
            { label: 'Jours de rupture à craindre', unit: 'jours', digits: 1, fn: (n) => (n.daily > 0 ? Math.max(0, n.ttr - n.stock / n.daily) : 0) },
            { label: 'Stock de crise à constituer', unit: 'pièces', digits: 0, fn: (n) => (n.daily > 0 ? Math.max(0, n.daily * n.ttr - n.stock) : 0) },
          ],
          steps: (n) => [`TTS = ${fmt(n.stock)} / ${fmt(n.daily)} = ${fmt(n.daily > 0 ? n.stock / n.daily : 0, 1)} jours`],
          note: 'Si le TTS dépasse le TTR, aucun stock de crise n\'est nécessaire.',
        },
      },
    },
  ],

  excel: [
    {
      id: 'perte-esperee-excel',
      fn: 'SOMMEPROD',
      level: 3,
      tier: 5,
      title: 'La perte espérée de plusieurs risques',
      context: 'Tu établis le registre des risques de la chaîne logistique avec la probabilité annuelle et l\'impact de chacun.',
      instruction: 'En **B6**, calcule la **perte espérée totale** : somme de (probabilité × impact) pour tous les risques.',
      generate() {
        const names = ['Panne entrepôt', 'Grève transport', 'Cyberattaque', 'Défaillance fournisseur']
        return { rows: [['Risque', 'Probabilité', 'Impact (€)'], ...names.map((n) => [n, pick([0.02, 0.05, 0.1, 0.15, 0.2]), int(5, 50, 5) * 10000])], extra: { A6: 'Perte espérée totale (€)' } }
      },
      target: 'B6',
      solution: '=SOMMEPROD(B2:B5;C2:C5)',
      mustUse: ['SOMMEPROD'],
      hints: ['Probabilités en B2:B5, impacts en C2:C5.', 'SOMMEPROD(B2:B5;C2:C5) multiplie ligne par ligne puis additionne.'],
      explain: 'Chaque risque apporte probabilité × impact ; la somme donne le coût moyen annuel de l\'ensemble des risques du registre.',
    },
    {
      id: 'part-fournisseur-excel',
      fn: 'MAX',
      level: 2,
      tier: 4,
      title: 'La dépendance au premier fournisseur',
      context: 'Tu mesures à quel point tes achats sont concentrés sur un fournisseur.',
      instruction: 'En **B6**, calcule la **part du premier fournisseur** (celui qui a le plus gros montant) dans le total des achats, **en % arrondi à l\'entier**.',
      generate() {
        return { rows: [['Fournisseur', 'Achats (€)'], ['A', int(10, 80, 5) * 10000], ['B', int(10, 80, 5) * 10000], ['C', int(10, 80, 5) * 10000], ['D', int(10, 80, 5) * 10000]], extra: { A6: 'Part du 1er fournisseur (%)' } }
      },
      target: 'B6',
      solution: '=ARRONDI(MAX(B2:B5)/SOMME(B2:B5)*100;0)',
      mustUse: ['MAX', 'SOMME', 'ARRONDI'],
      hints: ['MAX(B2:B5) trouve le plus gros fournisseur.', 'Divise-le par SOMME(B2:B5), multiplie par 100 et arrondis.'],
      explain: 'Au-delà de 50 % chez un seul fournisseur, la dépendance est forte : le calcul de la part du plus gros fournisseur est le premier indicateur de concentration.',
    },
    {
      id: 'couverture-crise-excel',
      fn: 'SI',
      level: 2,
      tier: 2,
      title: 'Peut-on tenir pendant la crise ?',
      context: 'Tu compares la couverture de ton stock au temps nécessaire pour retrouver un fournisseur.',
      instruction: 'En **B5**, affiche **« Risque »** si le stock couvre moins de jours que le délai de reprise (TTR), sinon **« OK »**.',
      minResults: 2,
      generate() {
        const daily = pick([200, 250, 400, 500])
        const ttr = int(10, 40)
        const stock = daily * int(Math.max(5, ttr - 12), ttr + 12)
        return { rows: [['Stock (pièces)', stock], ['Consommation par jour', daily], ['TTR (jours)', ttr]], extra: { A5: 'Statut' } }
      },
      target: 'B5',
      solution: '=SI(B1/B2<B3;"Risque";"OK")',
      mustUse: ['SI'],
      hints: ['Le temps de survie est B1/B2.', 'SI(B1/B2<B3;"Risque";"OK") compare la survie au délai de reprise.'],
      explain: 'Si le stock tient moins longtemps que la reprise (TTS < TTR), il y aura rupture. La fonction SI traduit cette règle en un statut lisible.',
    },
  ],

  cases: [
    {
      id: 'fournisseur-unique-risque',
      title: 'Un fournisseur unique pour une pièce critique',
      role: "Responsable achats d'un fabricant de vélos électriques",
      lesson: 'risques/double-sourcing',
      generate() {
        const share = int(70, 95, 5)
        const volume = int(8, 30, 2) * 100000
        const prob = pick([5, 10, 15])
        const loss = int(8, 25, 1) * 100000
        const extra = pick([2, 3, 4])
        const expected = (loss * prob) / 100
        const surcost = (volume * extra) / 100
        return {
          intro: `Un fournisseur unique livre ${share} % de tes moteurs (achats annuels de ${fmt(volume)} €). Une défaillance prolongée arrêterait le montage : perte estimée à ${fmt(loss)} €, avec ${prob} % de probabilité par an. Qualifier un second fournisseur ferait augmenter le coût d'achat de ${extra} %.`,
          steps: [
            {
              situation: 'Quelle est la perte espérée annuelle liée à ce fournisseur unique ?',
              better: `${fmt(loss)} × ${prob} % = ${fmt(expected, 0)} € par an. C'est le coût moyen du risque que l'on accepte en restant dépendant.`,
              choices: [
                { text: `${fmt(expected, 0)} € par an.`, points: 3, feedback: `${fmt(loss)} × ${prob} % = ${fmt(expected, 0)} € : le coût moyen annuel du risque.` },
                { text: `${fmt(loss, 0)} € : la perte totale.`, points: 1, feedback: 'C\'est l\'impact si le risque survient ; la perte espérée tient compte de sa probabilité.' },
                { text: 'Zéro, car la défaillance est improbable.', points: 0, feedback: `Un risque de ${prob} % par an est loin d'être négligeable pour ce montant.` },
              ],
            },
            {
              situation: `Le double sourcing coûte ${fmt(surcost, 0)} € de plus par an. Est-ce rentable ?`,
              better: `Le surcoût (${fmt(surcost, 0)} €) est ${surcost < expected ? 'inférieur' : 'supérieur'} à la perte espérée (${fmt(expected, 0)} €). ${surcost < expected ? 'Financièrement, le double sourcing est justifié, sans compter la protection des clients et de la réputation.' : 'Financièrement, il est discutable, mais la protection de la production et des clients peut le justifier ; une solution intermédiaire (stock de crise) est à comparer.'}`,
              choices: [
                { text: `Je compare ${fmt(surcost, 0)} € de surcoût à ${fmt(expected, 0)} € de perte espérée et je tiens compte des autres enjeux.`, points: 3, feedback: 'La décision repose sur un chiffrage, complété par les effets non financiers (clients, réputation).' },
                { text: 'Je refuse : tout surcoût est mauvais.', points: 0, feedback: 'Refuser sans comparer au risque évité peut coûter beaucoup plus cher en cas de défaillance.' },
                { text: 'J\'accepte sans calcul : la sécurité n\'a pas de prix.', points: 1, feedback: 'Un arbitrage chiffré est indispensable : la sécurité a un prix, et on peut parfois la trouver moins cher.' },
              ],
            },
            {
              situation: 'Comment organises-tu concrètement la double source ?',
              better: "On qualifie progressivement le second fournisseur (essais, audit qualité), on lui confie 20 à 30 % du volume pour garder une relation active, et on surveille ses indicateurs (livraison à l'heure, ppm) comme ceux du fournisseur principal.",
              choices: [
                { text: 'Qualification progressive, 20 à 30 % du volume, suivi des KPI des deux.', points: 3, feedback: 'Un volume réel maintient le second fournisseur opérationnel et prêt à monter en puissance.' },
                { text: 'Le qualifier mais ne rien lui commander.', points: 1, feedback: 'Un fournisseur sans volume n\'est pas réellement prêt à livrer en cas de crise.' },
                { text: 'Tout transférer d\'un coup chez le nouveau.', points: 0, feedback: 'Un transfert brutal recrée une dépendance et expose à des problèmes de qualification.' },
              ],
            },
          ],
          debrief: `La perte espérée est de ${fmt(expected, 0)} € par an pour un surcoût de ${fmt(surcost, 0)} € : on compare, puis on qualifie un second fournisseur progressivement avec 20 à 30 % du volume.`,
        }
      },
    },
    {
      id: 'cyberattaque-entrepot',
      title: "Cyberattaque sur l'entrepôt",
      role: "Responsable logistique d'un distributeur alimentaire",
      lesson: 'risques/pca',
      intro:
        "Lundi matin, le système de gestion d'entrepôt est bloqué par un rançongiciel : plus d'emplacements, plus d'étiquettes, plus de commandes. L'entrepôt expédie normalement 4 000 colis par jour et la direction estime l'arrêt à 15 000 € par jour. Vos sauvegardes hors ligne datent de samedi soir.",
      steps: [
        {
          situation: 'Quelle est ta première décision ?',
          better:
            "On isole les systèmes touchés (pour éviter la propagation), on prévient la cellule de crise et les équipes informatiques, et on active le plan de continuité : procédures dégradées sur papier pour les expéditions prioritaires.",
          choices: [
            { text: "J'active la cellule de crise, j'isole les systèmes et je passe en mode dégradé.", points: 3, feedback: 'Limiter la propagation et continuer à servir les clients prioritaires est la bonne séquence.' },
            { text: 'Je paie la rançon immédiatement pour tout débloquer.', points: 0, feedback: 'Rien ne garantit la restitution des données, et payer encourage de nouvelles attaques : la décision se prend avec les experts et la direction, pas en urgence.' },
            { text: 'J\'attends que l\'informatique règle le problème.', points: 1, feedback: 'Attendre sans activer le plan fait perdre des heures précieuses et des clients.' },
          ],
        },
        {
          situation: 'Quelles commandes traites-tu en priorité en mode dégradé ?',
          better:
            "Sans système, on ne peut pas tout traiter : on sert d'abord les clients et produits critiques (produits frais, clients stratégiques, urgences) avec des bons de préparation papier, en notant tout pour ressaisir ensuite.",
          choices: [
            { text: 'Les clients et produits critiques, avec bons papier et traçage manuel.', points: 3, feedback: 'Prioriser limite l\'impact à 15 000 € par jour et préserve les relations clés.' },
            { text: 'Toutes les commandes dans l\'ordre d\'arrivée.', points: 1, feedback: 'Un traitement uniforme risque de laisser sans produits des clients critiques ou des produits périssables.' },
            { text: 'Aucune : on arrête tout jusqu\'au redémarrage.', points: 0, feedback: 'Un arrêt total coûte 15 000 € par jour et abîme la confiance des clients.' },
          ],
        },
        {
          situation: 'Après le redémarrage, que fais-tu ?',
          better:
            "Un retour d'expérience : ce qui a bien fonctionné (sauvegardes, procédures papier) et ce qui a manqué (communication, formation). On met à jour le PCA, on forme les équipes (hameçonnage), on teste la reprise et on renforce les sauvegardes.",
          choices: [
            { text: "Un retour d'expérience, la mise à jour du PCA, la formation et de nouveaux tests.", points: 3, feedback: 'Chaque incident est une occasion d\'améliorer le plan avant le prochain.' },
            { text: 'Je classe le dossier : c\'est fini.', points: 0, feedback: 'Sans analyse, les mêmes failles seront exploitées à nouveau.' },
            { text: 'Je change uniquement de logiciel.', points: 1, feedback: 'Le logiciel n\'est qu\'un élément : les procédures, les sauvegardes et la formation comptent autant.' },
          ],
        },
      ],
      debrief:
        "Face à une cyberattaque : isoler, activer la cellule de crise, travailler en mode dégradé sur les priorités, puis tirer les leçons pour renforcer le plan de continuité et la formation.",
    },
  ],

  english: {
    units: [
      {
        id: 'reclamation-en',
        title: 'Réclamations, litiges et risques',
        icon: 'alert',
        color: 'red',
        lessons: [
          {
            id: 'risques-mots',
            title: 'Perturbations et risques',
            level: 2,
            items: [
              { en: 'threat', fr: 'menace', def: "Danger possible qui peut causer des dommages.", ex: 'A cyberattack is a serious threat.', exFr: "Une cyberattaque est une menace sérieuse." },
              { en: 'disruption', fr: 'perturbation', def: "Événement qui interrompt ou ralentit le fonctionnement normal.", ex: 'The strike caused a major disruption.', exFr: 'La grève a causé une forte perturbation.' },
              { en: 'supply gap', fr: "manque d'approvisionnement", def: "Écart entre ce qui est nécessaire et ce que les fournisseurs peuvent livrer.", ex: 'A supply gap is expected in May.', exFr: "Un manque d'approvisionnement est prévu en mai." },
              { en: 'backup supplier', fr: 'fournisseur de secours', def: "Fournisseur qualifié que l'on peut utiliser si le fournisseur principal ne livre plus.", ex: 'We need a backup supplier.', exFr: 'Nous avons besoin d\'un fournisseur de secours.' },
              { en: 'contingency plan', fr: 'plan de secours', def: "Plan préparé à l'avance pour réagir à un événement grave.", ex: 'Our contingency plan worked well.', exFr: 'Notre plan de secours a bien fonctionné.' },
              { en: 'single point of failure', fr: 'point de défaillance unique', def: "Élément dont la panne bloque tout le système, faute d'alternative.", ex: 'One supplier is a single point of failure.', exFr: "Un seul fournisseur est un point de défaillance unique." },
              { en: 'resilience', fr: 'résilience', def: "Capacité à absorber un choc et à reprendre une activité normale.", ex: 'Resilience matters more than ever.', exFr: 'La résilience compte plus que jamais.' },
              { en: 'insurance policy', fr: "contrat d'assurance", def: "Document qui précise ce que l'assureur rembourse en cas de dommage.", ex: 'Check the insurance policy first.', exFr: "Vérifiez d'abord le contrat d'assurance." },
            ],
          },
          {
            id: 'litige-mots',
            title: 'Réclamation et litige',
            level: 2,
            items: [
              { en: 'complaint', fr: 'réclamation', def: "Plainte exprimée par un client qui n'est pas satisfait.", ex: 'We received a complaint today.', exFr: 'Nous avons reçu une réclamation aujourd\'hui.' },
              { en: 'claim', fr: 'demande d\'indemnisation', def: "Demande officielle de remboursement ou de compensation après un dommage.", ex: 'We filed a claim with the carrier.', exFr: 'Nous avons déposé une demande d\'indemnisation auprès du transporteur.' },
              { en: 'dispute', fr: 'litige', def: "Désaccord entre deux parties, par exemple sur une facture ou une livraison.", ex: 'There is a dispute over the invoice.', exFr: 'Il y a un litige sur la facture.' },
              { en: 'compensation', fr: 'indemnité (compensation)', def: "Somme versée pour réparer un dommage ou un désagrément.", ex: 'They offered compensation.', exFr: 'Ils ont proposé une indemnité.' },
              { en: 'liability', fr: 'responsabilité (juridique)', def: "Obligation légale de réparer un dommage que l'on a causé.", ex: 'The carrier accepted liability.', exFr: 'Le transporteur a accepté sa responsabilité.' },
              { en: 'fine', fr: 'amende', def: "Somme à payer parce qu'on n'a pas respecté une règle ou un contrat.", ex: 'The customs office issued a fine.', exFr: "La douane a infligé une amende." },
              { en: 'proof', fr: 'preuve', def: "Document ou élément qui montre que quelque chose est vrai.", ex: 'We need proof of damage.', exFr: 'Nous avons besoin d\'une preuve du dommage.' },
              { en: 'apology', fr: 'excuses', def: "Expression de regret après une erreur.", ex: 'Please accept our apology.', exFr: 'Veuillez accepter nos excuses.' },
            ],
          },
          {
            id: 'reclamation-phrases',
            title: 'Écrire une réclamation',
            level: 3,
            items: [
              { en: 'I am writing to complain about a damaged delivery.', fr: 'Je vous écris pour me plaindre d\'une livraison endommagée.', blank: 'complain' },
              { en: 'Half of the pallets arrived broken.', fr: 'La moitié des palettes sont arrivées cassées.', blank: 'broken' },
              { en: 'We kindly ask you to replace the goods.', fr: 'Nous vous prions de bien vouloir remplacer les marchandises.', blank: 'replace' },
              { en: 'We hold the carrier responsible for the damage.', fr: 'Nous tenons le transporteur responsable du dommage.', blank: 'hold' },
              { en: 'Please find attached photos of the damage.', fr: 'Veuillez trouver ci-joint des photos du dommage.', blank: 'photos' },
              { en: 'We expect a reply within five working days.', fr: 'Nous attendons une réponse sous cinq jours ouvrés.', blank: 'expect' },
            ],
          },
        ],
      },
    ],
  },
}
