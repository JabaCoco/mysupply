// Lot 8 — Distribution et e-commerce : Atelier (2 formules, 3 défis Excel, 2 études de cas) + Anglais (e-commerce, confirmer une commande).
import { fmt, int, pick, shuffle } from '../gen.js'

export default {
  formulas: [
    {
      id: 'racine-carree-stock',
      title: 'Regrouper les stocks : règle de la racine carrée',
      short: 'Stock total ≈ stock d\'un site × √n',
      course: {
        purpose:
          "Quand on **regroupe plusieurs entrepôts** en un seul, le stock de sécurité nécessaire diminue : les ruptures d'un site se compensent avec les surplus d'un autre. La **règle de la racine carrée** donne un ordre de grandeur de cette économie.",
        formulas: ['Stock de sécurité après regroupement ≈ stock par site × √n', 'Économie = stock avant − stock après', 'Économie en % = 1 − 1 / √n'],
        terms: [
          ['n', 'Nombre de sites regroupés (de même niveau de demande).'],
          ['Stock par site', 'Stock de sécurité nécessaire sur un site avant le regroupement.'],
          ['√n', 'Racine carrée de n : 4 sites → 2, 9 sites → 3, 16 sites → 4.'],
        ],
        example: {
          statement: '4 entrepôts ont chacun 200 unités de stock de sécurité. On les regroupe en un seul.',
          steps: ['Avant : 4 × 200 = 800 unités', 'Après : 200 × √4 = 200 × 2 = 400 unités', 'Économie : 800 − 400 = 400 unités, soit 50 %'],
          result: 'Le regroupement divise ici par deux le stock de sécurité, mais allonge les trajets vers les clients.',
        },
        exercises: [
          () => {
            const n = pick([4, 9, 16])
            const ss = int(100, 500, 50)
            return {
              kind: 'number',
              statement: 'Calcule le stock de sécurité après regroupement.',
              data: [['Nombre de sites', String(n)], ['Stock de sécurité par site', `${ss} unités`]],
              question: 'Stock de sécurité après regroupement (en unités) ?',
              answer: ss * Math.sqrt(n),
              unit: 'unités',
              tolerance: 1,
              steps: [`√${n} = ${Math.sqrt(n)}`, `Stock = ${ss} × ${Math.sqrt(n)} = ${fmt(ss * Math.sqrt(n), 0)}`],
              conclusion: 'Le stock ne baisse pas de n fois, mais de √n fois : l\'effet est réel mais plus modeste que le nombre de sites supprimés.',
            }
          },
          () => {
            const n = pick([4, 9, 16, 25])
            const ss = int(100, 400, 50)
            return {
              kind: 'number',
              statement: 'Calcule l\'économie de stock obtenue en regroupant les sites.',
              data: [['Nombre de sites', String(n)], ['Stock de sécurité par site', `${ss} unités`]],
              question: 'Économie de stock (en unités) ?',
              answer: ss * n - ss * Math.sqrt(n),
              unit: 'unités',
              tolerance: 1,
              steps: [`Avant : ${n} × ${ss} = ${fmt(ss * n, 0)}`, `Après : ${ss} × √${n} = ${fmt(ss * Math.sqrt(n), 0)}`, `Économie = ${fmt(ss * n - ss * Math.sqrt(n), 0)} unités`],
              conclusion: 'Plus on regroupe de sites, plus l\'économie en valeur absolue est grande.',
            }
          },
          () => {
            const n = pick([4, 9, 16, 25])
            return {
              kind: 'number',
              statement: 'Quelle part du stock de sécurité total économise-t-on en regroupant tous les sites en un seul ?',
              data: [['Nombre de sites', String(n)]],
              question: 'Économie (en %) ?',
              answer: (1 - 1 / Math.sqrt(n)) * 100,
              unit: '%',
              tolerance: 0.5,
              steps: [`Stock après / stock avant = √${n} / ${n} = 1 / √${n} = ${fmt(1 / Math.sqrt(n), 2)}`, `Économie = 1 − ${fmt(1 / Math.sqrt(n), 2)} = ${fmt((1 - 1 / Math.sqrt(n)) * 100, 0)} %`],
              conclusion: 'Avec 4 sites on économise 50 % ; avec 9, 67 % ; avec 16, 75 %.',
            }
          },
          () => {
            const n = pick([4, 9, 16])
            const ss = int(100, 400, 50)
            const unit = int(8, 40, 2)
            return {
              kind: 'number',
              statement: 'Chaque unité de stock de sécurité coûte son prix d\'achat à immobiliser. Calcule l\'économie financière du regroupement.',
              data: [['Sites', String(n)], ['Stock de sécurité par site', `${ss} unités`], ['Valeur d\'une unité', `${unit} €`]],
              question: 'Économie de valeur de stock (en €) ?',
              answer: (ss * n - ss * Math.sqrt(n)) * unit,
              unit: '€',
              tolerance: 5,
              steps: [`Économie de stock = ${fmt(ss * n - ss * Math.sqrt(n), 0)} unités`, `Valeur = ${fmt(ss * n - ss * Math.sqrt(n), 0)} × ${unit} = ${fmt((ss * n - ss * Math.sqrt(n)) * unit, 0)} €`],
              conclusion: 'Cette économie doit être comparée au surcoût de transport vers les clients.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'n', label: 'Nombre de sites regroupés', value: 4 },
            { key: 'ss', label: 'Stock de sécurité par site', unit: 'unités', value: 200 },
            { key: 'price', label: 'Valeur d\'une unité', unit: '€', value: 20 },
          ],
          outputs: [
            { label: 'Stock avant', unit: 'unités', digits: 0, fn: (n) => n.n * n.ss },
            { label: 'Stock après regroupement', unit: 'unités', digits: 0, highlight: true, fn: (n) => n.ss * Math.sqrt(Math.max(n.n, 0)) },
            { label: 'Économie de valeur', unit: '€', digits: 0, fn: (n) => (n.n * n.ss - n.ss * Math.sqrt(Math.max(n.n, 0))) * n.price },
          ],
          steps: (n) => [`Après = ${fmt(n.ss)} × √${fmt(n.n)} = ${fmt(n.ss * Math.sqrt(Math.max(n.n, 0)), 0)}`],
          note: 'Règle approchée : suppose des sites de demande similaire et indépendante.',
        },
      },
    },

    {
      id: 'couts-ecommerce',
      title: 'Coûts e-commerce : colis et retours',
      short: 'Coût par colis livré, taux de retour, marge nette',
      course: {
        purpose:
          "En e-commerce, la marge dépend fortement de la **livraison** et des **retours**. Trois calculs reviennent : le **coût par colis réellement livré** (échecs inclus), le **taux de retour** et la **marge nette** après frais logistiques.",
        formulas: ['Coût par colis = coût de la tournée / colis livrés', 'Taux de retour = retours / commandes livrées × 100', 'Marge nette = marge brute − livraison − coût des retours'],
        terms: [
          ['Colis livrés', 'Colis réellement remis (les échecs sont à refaire).'],
          ['Coût d\'un retour', 'Transport + traitement + dépréciation moyenne du produit.'],
          ['Marge brute', 'Prix de vente − coût d\'achat du produit.'],
        ],
        example: {
          statement: 'Commande de 60 € (marge brute 30 %), livraison 5,50 € payée par le vendeur, 20 % des commandes retournées à 9 € de coût.',
          steps: ['Marge brute = 60 × 30 % = 18 €', 'Coût moyen des retours par commande = 20 % × 9 = 1,80 €', 'Marge nette = 18 − 5,50 − 1,80 = 10,70 €'],
          result: 'Sur 18 € de marge brute, il ne reste que 10,70 € : la logistique en absorbe 40 %.',
        },
        exercises: [
          () => {
            const parcels = int(100, 180, 10)
            const failed = int(10, 30, 5)
            const cost = int(220, 400, 10)
            return {
              kind: 'number',
              statement: 'Calcule le coût par colis réellement livré.',
              data: [['Coût de la tournée', `${cost} €`], ['Colis prévus', String(parcels)], ['Colis non livrés (absents)', String(failed)]],
              question: 'Coût par colis livré (en €) ?',
              answer: cost / (parcels - failed),
              unit: '€',
              tolerance: 0.02,
              steps: [`Colis livrés = ${parcels} − ${failed} = ${parcels - failed}`, `Coût = ${cost} / ${parcels - failed} = ${fmt(cost / (parcels - failed), 2)} €`],
              conclusion: 'Chaque échec de livraison augmente le coût des colis livrés.',
            }
          },
          () => {
            const orders = int(2000, 9000, 500)
            const returns = Math.round(orders * (int(10, 35) / 100))
            return {
              kind: 'number',
              statement: 'Calcule le taux de retour.',
              data: [['Commandes livrées', fmt(orders)], ['Commandes retournées', fmt(returns)]],
              question: 'Taux de retour (en %) ?',
              answer: (returns / orders) * 100,
              unit: '%',
              tolerance: 0.2,
              steps: [`${fmt(returns)} / ${fmt(orders)} × 100 = ${fmt((returns / orders) * 100, 1)} %`],
              conclusion: 'Suivre ce taux par produit montre où le problème est concentré.',
            }
          },
          () => {
            const price = int(40, 120, 10)
            const margin = pick([25, 30, 35, 40])
            const delivery = pick([4.5, 5.5, 6.5])
            const rate = pick([10, 15, 20, 30])
            const retCost = pick([7, 9, 11])
            const net = (price * margin) / 100 - delivery - (rate / 100) * retCost
            return {
              kind: 'number',
              statement: 'Calcule la marge nette moyenne par commande après logistique.',
              data: [['Prix de vente', `${price} €`], ['Marge brute', `${margin} %`], ['Livraison offerte (coût)', `${fmt(delivery)} €`], ['Taux de retour', `${rate} %`], ['Coût d\'un retour', `${retCost} €`]],
              question: 'Marge nette par commande (en €) ?',
              answer: net,
              unit: '€',
              tolerance: 0.05,
              steps: [`Marge brute = ${price} × ${margin} % = ${fmt((price * margin) / 100, 2)} €`, `Retours par commande = ${rate} % × ${retCost} = ${fmt((rate / 100) * retCost, 2)} €`, `Marge nette = ${fmt((price * margin) / 100, 2)} − ${fmt(delivery)} − ${fmt((rate / 100) * retCost, 2)} = ${fmt(net, 2)} €`],
              conclusion: net < 0 ? 'La commande fait perdre de l\'argent : la livraison offerte est trop coûteuse pour cette marge.' : 'La marge reste positive, mais la logistique en consomme une grande part.',
            }
          },
          () => {
            const returns = int(500, 3000, 100)
            const cost = pick([6, 8, 9, 11])
            const cut = pick([10, 20, 25])
            const before = returns * cost
            const after = returns * (1 - cut / 100) * cost
            return {
              kind: 'number',
              statement: 'Un guide des tailles réduit le nombre de retours. Calcule l\'économie annuelle.',
              data: [['Retours par an', fmt(returns)], ['Coût moyen d\'un retour', `${cost} €`], ['Baisse des retours', `${cut} %`]],
              question: 'Économie annuelle (en €) ?',
              answer: before - after,
              unit: '€',
              tolerance: 1,
              steps: [`Avant : ${fmt(returns)} × ${cost} = ${fmt(before, 0)} €`, `Après : ${fmt(returns * (1 - cut / 100), 0)} × ${cost} = ${fmt(after, 0)} €`, `Économie = ${fmt(before - after, 0)} €`],
              conclusion: 'Agir sur la cause (information client) coûte souvent moins cher que de traiter les retours.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'price', label: 'Prix de vente', unit: '€', value: 60 },
            { key: 'margin', label: 'Marge brute', unit: '%', value: 30 },
            { key: 'delivery', label: 'Coût de livraison payé', unit: '€', value: 5.5 },
            { key: 'rate', label: 'Taux de retour', unit: '%', value: 20 },
            { key: 'ret', label: 'Coût d\'un retour', unit: '€', value: 9 },
          ],
          outputs: [
            { label: 'Marge brute', unit: '€', digits: 2, fn: (n) => (n.price * n.margin) / 100 },
            { label: 'Coût moyen des retours', unit: '€', digits: 2, fn: (n) => (n.rate / 100) * n.ret },
            { label: 'Marge nette par commande', unit: '€', digits: 2, highlight: true, fn: (n) => (n.price * n.margin) / 100 - n.delivery - (n.rate / 100) * n.ret },
          ],
          steps: (n) => [`Marge nette = ${fmt((n.price * n.margin) / 100, 2)} − ${fmt(n.delivery)} − ${fmt((n.rate / 100) * n.ret, 2)}`],
          note: 'Exemple : une marge négative signifie que la commande est vendue à perte une fois la logistique payée.',
        },
      },
    },
  ],

  excel: [
    {
      id: 'taux-retour-excel',
      fn: 'NB.SI',
      level: 2,
      tier: 2,
      title: 'Le taux de retour',
      context: 'Tu analyses les commandes du mois d\'une boutique en ligne : chaque ligne indique si le client a renvoyé son colis.',
      instruction: 'En **D2**, calcule le **taux de retour** : nombre de « Oui » ÷ nombre de commandes × 100, **arrondi à 1 décimale**.',
      generate() {
        const n = 15
        const p = int(12, 35) / 100
        return { rows: [['Commande', 'Montant', 'Retour'], ...Array.from({ length: n }, (_, i) => [`C${100 + i}`, int(20, 150, 5), Math.random() < p ? 'Oui' : 'Non'])], extra: { D1: 'Taux de retour (%)' } }
      },
      target: 'D2',
      solution: '=ARRONDI(NB.SI(C2:C16;"Oui")/NB(B2:B16)*100;1)',
      mustUse: ['NB.SI', 'ARRONDI'],
      hints: ['NB.SI(plage ; "Oui") compte les retours.', 'Divise par le nombre de commandes NB(B2:B16), multiplie par 100 et arrondis.'],
      explain: 'NB.SI compte les lignes « Oui » ; NB compte les commandes (les montants sont des nombres). Le taux de retour est la part des commandes renvoyées.',
    },
    {
      id: 'cout-colis-excel',
      fn: 'ARRONDI',
      level: 2,
      tier: 5,
      title: 'Le coût par colis livré',
      context: 'Tu analyses la tournée de la journée d\'un livreur : quelques clients étaient absents.',
      instruction: 'En **B5**, calcule le **coût par colis réellement livré** : coût de la tournée ÷ (colis prévus − colis non livrés), **arrondi à 2 décimales**.',
      generate() {
        const parcels = int(80, 160, 10)
        return { rows: [['Coût de la tournée (€)', int(180, 380, 10)], ['Colis prévus', parcels], ['Colis non livrés', int(8, 25)]], extra: { A5: 'Coût par colis livré (€)' } }
      },
      target: 'B5',
      solution: '=ARRONDI(B1/(B2-B3);2)',
      mustUse: ['ARRONDI'],
      hints: ['Colis livrés = B2 − B3.', 'Divise le coût B1 par ce nombre, puis ARRONDI(…;2).'],
      explain: 'Seuls les colis remis comptent : les échecs font monter le coût unitaire des colis livrés. Les parenthèses sont indispensables pour diviser par la différence.',
    },
    {
      id: 'choix-site-expedition',
      fn: 'MIN.SI.ENS',
      level: 3,
      tier: 5,
      title: "Choisir le site d'expédition",
      context: 'Une commande en ligne peut être servie par plusieurs entrepôts. Tu cherches le coût de livraison le plus bas parmi les sites qui ont du stock.',
      instruction: 'En **D2**, trouve le **coût de livraison le plus bas parmi les sites dont le stock est supérieur à 0**.',
      generate() {
        const costs = [int(3, 5, 0.5), int(6, 8, 0.5), int(9, 11, 0.5), int(12, 14, 0.5), int(15, 18, 0.5)]
        const stock = shuffle([0, int(10, 80, 5), int(10, 80, 5), int(10, 80, 5), int(10, 80, 5)])
        // le site le moins cher est forcément celui sans stock : on le place sur la valeur 0
        const idx = shuffle([0, 1, 2, 3, 4])
        const rows = idx.map((k, i) => [`Site ${i + 1}`, k === 0 ? 0 : stock.filter((s) => s > 0)[k - 1], costs[k]])
        return { rows: [['Site', 'Stock', 'Coût livraison (€)'], ...rows], extra: { D1: 'Meilleur coût avec stock' } }
      },
      target: 'D2',
      solution: '=MIN.SI.ENS(C2:C6;B2:B6;">0")',
      mustUse: ['MIN.SI.ENS'],
      hints: ['Les stocks sont en B2:B6 et les coûts en C2:C6.', 'MIN.SI.ENS(plage des coûts ; plage des stocks ; ">0").'],
      explain: 'Le site le moins cher n\'a pas de stock : il ne peut pas servir la commande. MIN.SI.ENS ne regarde que les sites répondant au critère « stock > 0 ».',
    },
  ],

  cases: [
    {
      id: 'regrouper-entrepots',
      title: 'Faut-il regrouper les entrepôts ?',
      role: "Responsable réseau logistique d'un distributeur de petit électroménager",
      lesson: 'distribution/reseaux',
      generate() {
        const n = pick([4, 9])
        const ss = int(150, 400, 50)
        const price = int(15, 40, 5)
        const before = n * ss
        const after = ss * Math.sqrt(n)
        const gain = (before - after) * price
        return {
          intro: `Ton entreprise exploite ${n} entrepôts régionaux, chacun avec ${ss} unités de stock de sécurité (valeur moyenne ${price} € l'unité). La direction envisage de les regrouper en un seul site central, ce qui rallongerait les livraisons de 1 à 2 jours pour certains clients.`,
          steps: [
            {
              situation: 'Quel stock de sécurité total faudrait-il après regroupement (règle de la racine carrée) ?',
              better: `Stock après = ${ss} × √${n} = ${fmt(after, 0)} unités, contre ${fmt(before, 0)} avant : l'économie est de ${fmt(before - after, 0)} unités.`,
              choices: [
                { text: `${fmt(after, 0)} unités : ${ss} × √${n}.`, points: 3, feedback: `Le stock de sécurité ne baisse pas jusqu'à ${ss}, mais diminue de √${n} : ${fmt(after, 0)} unités.` },
                { text: `${ss} unités, comme un seul site.`, points: 0, feedback: `Un site unique doit absorber la demande de tous les anciens sites : ${ss} serait insuffisant (il faut ${fmt(after, 0)}).` },
                { text: `${fmt(before, 0)} unités : rien ne change.`, points: 1, feedback: `Au contraire : les variations de demande se compensent entre sites, ce qui réduit le stock nécessaire (${fmt(after, 0)} unités).` },
              ],
            },
            {
              situation: "Quelle économie de valeur de stock cela représente-t-il ?",
              better: `(${fmt(before, 0)} − ${fmt(after, 0)}) × ${price} € = ${fmt(gain, 0)} € de stock en moins. Il reste à comparer cette économie avec le surcoût de transport et la perte de service pour les clients éloignés.`,
              choices: [
                { text: `${fmt(gain, 0)} € de stock en moins, à comparer au surcoût de transport.`, points: 3, feedback: `L'économie de ${fmt(before - after, 0)} unités × ${price} € = ${fmt(gain, 0)} € doit être mise en balance avec les coûts logistiques supplémentaires.` },
                { text: `${fmt(before * price, 0)} € : tout le stock disparaît.`, points: 0, feedback: `Le stock ne disparaît pas : il passe de ${fmt(before, 0)} à ${fmt(after, 0)} unités, donc l'économie est ${fmt(gain, 0)} €.` },
                { text: 'Aucune économie : le stock est déjà minimal.', points: 1, feedback: 'Le regroupement réduit le stock de sécurité en mutualisant les aléas : l\'économie est bien réelle.' },
              ],
            },
            {
              situation: 'Que recommandes-tu à la direction ?',
              better: "Regrouper n'a de sens que si l'économie de stock dépasse le surcoût de transport et ne dégrade pas le service. Un réseau intermédiaire (quelques sites) ou un stock central + stock avancé pour les produits à forte rotation est souvent le meilleur compromis.",
              choices: [
                { text: "Chiffrer l'économie de stock et le surcoût de transport, puis choisir un compromis (peu de sites).", points: 3, feedback: 'Le bon réseau est un compromis entre stock, transport et délai de livraison : il faut chiffrer chaque scénario.' },
                { text: 'Regrouper immédiatement : moins de stock, c\'est toujours mieux.', points: 0, feedback: 'Un stock plus faible ne compense pas toujours des livraisons plus lentes et plus coûteuses : le service client en pâtirait.' },
                { text: 'Ne rien changer sans analyse.', points: 1, feedback: 'Garder le réseau tel quel peut coûter cher en stocks : l\'analyse chiffrée est nécessaire avant de décider.' },
              ],
            },
          ],
          debrief: `Regrouper ${n} sites ramène le stock de sécurité de ${fmt(before, 0)} à ${fmt(after, 0)} unités (soit ${fmt(gain, 0)} € de stock en moins), mais il faut comparer avec le surcoût de transport et la perte de rapidité de livraison.`,
        }
      },
    },
    {
      id: 'retours-mode',
      title: 'Trop de retours dans la mode',
      role: "Responsable logistique d'une boutique de vêtements en ligne",
      lesson: 'distribution/retours',
      intro:
        "Sur 10 000 commandes par mois, 3 200 sont retournées (32 %). Un retour coûte en moyenne 9 € (transport et traitement). L'analyse montre que 55 % des retours sont dus à une taille inadaptée et 15 % à un produit différent des photos.",
      steps: [
        {
          situation: 'Quel est le coût mensuel des retours, et par où commences-tu ?',
          better:
            "3 200 retours × 9 € = 28 800 € par mois. Plus de la moitié des retours venant de la taille, c'est là qu'une action aura le plus d'effet : un guide des tailles précis coûte peu et agit à la source.",
          choices: [
            { text: 'Je chiffre (28 800 €) et je traite d\'abord la taille, premier motif.', points: 3, feedback: '55 % des retours viennent de la taille : agir sur ce motif donne le gain le plus important pour le moindre effort.' },
            { text: "Je supprime les retours gratuits dès demain.", points: 0, feedback: 'Cela ferait fuir de nombreux clients et la cause (taille, description) resterait entière.' },
            { text: 'Je ne fais rien : les retours font partie du métier.', points: 1, feedback: 'Avec 28 800 € par mois en jeu, ignorer le problème n\'est pas raisonnable : une partie est évitable.' },
          ],
        },
        {
          situation: 'Quelle action mets-tu en place pour réduire les retours de taille ?',
          better:
            "Un guide des tailles précis, des mesures détaillées par article et des avis sur la taille (« taille petit ») réduisent directement le motif principal. Si 25 % des retours de taille disparaissent, l'économie est d'environ 3 200 × 55 % × 25 % × 9 € ≈ 3 960 € par mois.",
          choices: [
            { text: 'Un guide des tailles et des avis « taille petit / grand ».', points: 3, feedback: 'Le client choisit la bonne taille du premier coup : le retour est évité avant d\'exister.' },
            { text: 'Retirer les photos pour ne pas décevoir les clients.', points: 0, feedback: 'Sans photos, le client est moins bien informé : les retours « produit différent » augmenteraient.' },
            { text: 'Augmenter les prix pour couvrir le coût des retours.', points: 1, feedback: 'Cela reporte le coût sur tous les clients sans réduire les retours à la source.' },
          ],
        },
        {
          situation: 'Que fais-tu des produits retournés en bon état ?',
          better:
            "Un article en parfait état doit retourner en stock rapidement : chaque jour d'immobilisation fait perdre de la valeur (collection de saison). Les articles abîmés partent en reconditionnement, soldes ou don.",
          choices: [
            { text: 'Contrôle rapide, remise en stock vendable, reste en soldes ou don.', points: 3, feedback: 'Les produits retrouvent vite un acheteur, et l\'on évite la destruction.' },
            { text: 'Je détruis tous les retours par sécurité.', points: 0, feedback: 'Détruire des produits neufs est coûteux, polluant et contraire aux obligations de la loi anti-gaspillage.' },
            { text: 'Je les stocke dans un coin en attendant de décider.', points: 1, feedback: 'Un produit qui attend perd de la valeur : une décision rapide (contrôle puis remise en stock) est nécessaire.' },
          ],
        },
      ],
      debrief:
        "La logistique des retours se traite d'abord à la source : en informant mieux le client (taille, photos), on évite un retour avant qu'il ne coûte. Ce qui revient est contrôlé vite, puis remis en stock, reconditionné, soldé ou donné.",
    },
  ],

  english: {
    units: [
      {
        id: 'ecommerce-en',
        title: 'E-commerce et livraison',
        icon: 'store',
        color: 'rose',
        lessons: [
          {
            id: 'commande-en-ligne',
            title: 'Commande en ligne',
            level: 2,
            items: [
              { en: 'online store', fr: 'boutique en ligne', def: "Site web sur lequel on achète des produits.", ex: 'Our online store opens at midnight.', exFr: 'Notre boutique en ligne ouvre à minuit.' },
              { en: 'shopping cart', fr: 'panier', def: "Liste des produits que le client a choisis avant de payer.", ex: 'He left items in his shopping cart.', exFr: 'Il a laissé des articles dans son panier.' },
              { en: 'checkout', fr: 'paiement (validation de commande)', def: "Dernière étape où le client valide et paie sa commande.", ex: 'The checkout takes two minutes.', exFr: 'La validation de commande prend deux minutes.' },
              { en: 'order confirmation', fr: 'confirmation de commande', def: "Message envoyé au client pour lui confirmer que sa commande est enregistrée.", ex: 'You will receive an order confirmation.', exFr: 'Vous recevrez une confirmation de commande.' },
              { en: 'fulfilment', fr: 'préparation et expédition des commandes', def: "Ensemble des opérations pour traiter une commande, de la préparation à l'envoi.", ex: 'Fulfilment is done in our warehouse.', exFr: 'La préparation des commandes se fait dans notre entrepôt.' },
              { en: 'out of stock', fr: 'en rupture de stock', def: "Se dit d'un produit qui n'est plus disponible.", ex: 'This size is out of stock.', exFr: 'Cette taille est en rupture de stock.' },
              { en: 'refund', fr: 'remboursement', def: "Somme rendue au client quand il retourne ou annule un achat.", ex: 'The refund arrives in five days.', exFr: 'Le remboursement arrive en cinq jours.' },
              { en: 'return policy', fr: 'politique de retour', def: "Règles qui expliquent comment et jusqu'à quand un client peut renvoyer un produit.", ex: 'Please read our return policy.', exFr: 'Veuillez lire notre politique de retour.' },
            ],
          },
          {
            id: 'livraison-en',
            title: 'La livraison',
            level: 2,
            items: [
              { en: 'last mile', fr: 'dernier kilomètre', def: "Dernière étape de la livraison, jusqu'à la porte du client.", ex: 'The last mile is the most expensive.', exFr: 'Le dernier kilomètre est le plus cher.' },
              { en: 'courier', fr: 'coursier (livreur)', def: "Personne ou société qui livre rapidement des colis.", ex: 'A courier brought the package.', exFr: 'Un coursier a apporté le colis.' },
              { en: 'pick-up point', fr: 'point de retrait', def: "Commerce ou casier où le client vient chercher son colis.", ex: 'You can collect it at a pick-up point.', exFr: 'Vous pouvez le retirer dans un point de retrait.' },
              { en: 'delivery slot', fr: 'créneau de livraison', def: "Plage horaire choisie pour recevoir sa commande.", ex: 'Choose a delivery slot online.', exFr: 'Choisissez un créneau de livraison en ligne.' },
              { en: 'tracking number', fr: 'numéro de suivi', def: "Code qui permet de suivre un colis pendant son trajet.", ex: 'Here is your tracking number.', exFr: 'Voici votre numéro de suivi.' },
              { en: 'signature', fr: 'signature', def: "Preuve que le destinataire a bien reçu le colis.", ex: 'A signature is required on delivery.', exFr: 'Une signature est exigée à la livraison.' },
              { en: 'damaged', fr: 'endommagé', def: "Abîmé pendant le transport ou la manutention.", ex: 'The box arrived damaged.', exFr: 'La boîte est arrivée endommagée.' },
              { en: 'same-day delivery', fr: 'livraison le jour même', def: "Livraison réalisée quelques heures après la commande, le même jour.", ex: 'Same-day delivery costs more.', exFr: 'La livraison le jour même coûte plus cher.' },
            ],
          },
          {
            id: 'service-client',
            title: 'Répondre à un client',
            level: 3,
            items: [
              { en: 'Your order has been shipped.', fr: 'Votre commande a été expédiée.', blank: 'shipped' },
              { en: 'We are sorry for the inconvenience.', fr: 'Nous sommes désolés pour la gêne occasionnée.', blank: 'inconvenience' },
              { en: 'Your parcel will arrive within three working days.', fr: 'Votre colis arrivera sous trois jours ouvrés.', blank: 'within' },
              { en: 'Please send the item back in its original packaging.', fr: 'Veuillez renvoyer l\'article dans son emballage d\'origine.', blank: 'packaging' },
              { en: 'We will send you a replacement free of charge.', fr: 'Nous vous enverrons un article de remplacement gratuitement.', blank: 'replacement' },
              { en: 'Your refund has been processed.', fr: 'Votre remboursement a été traité.', blank: 'processed' },
            ],
          },
        ],
      },
    ],
    extend: {
      negociation: [
        {
          id: 'confirmer-commande',
          title: 'Confirmer une commande',
          level: 3,
          items: [
            { en: 'We would like to place an order for two pallets.', fr: 'Nous souhaitons passer commande de deux palettes.', blank: 'place' },
            { en: 'The purchase order is enclosed with this email.', fr: 'Le bon de commande est joint à cet e-mail.', blank: 'enclosed' },
            { en: 'Could you acknowledge receipt of this order?', fr: 'Pourriez-vous accuser réception de cette commande ?', blank: 'acknowledge' },
            { en: 'The delivery is scheduled for the fifth of May.', fr: 'La livraison est prévue le cinq mai.', blank: 'scheduled' },
            { en: 'Please send us the invoice by email.', fr: 'Veuillez nous envoyer la facture par e-mail.', blank: 'invoice' },
            { en: 'Payment will be made within thirty days.', fr: 'Le paiement sera effectué sous trente jours.', blank: 'payment' },
          ],
        },
      ],
    },
  },
}
