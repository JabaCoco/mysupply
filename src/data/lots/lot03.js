// Lot 3 — Stocks : Atelier (recomplètement, 4 défis Excel, 2 études de cas) + Anglais (stocks et valorisation).
import { eur, fmt, int, pick, sample } from '../gen.js'

const ARTICLES = ['Palette bois', 'Carton 40x30', 'Film étirable', 'Ruban adhésif', 'Étiquettes', 'Caisse plastique', 'Cerclage', 'Gants', 'Cutter', 'Housse']
const MONTHS = ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc']

export default {
  formulas: [
    {
      id: 'recompletement',
      title: 'Recomplètement périodique',
      short: 'S = D × (R + L) + z × σ × √(R + L)',
      course: {
        purpose:
          "Avec le **recomplètement périodique**, on revient à **intervalles réguliers** (chaque semaine, par exemple) et on commande de quoi remonter à un **niveau cible S**. La quantité change à chaque fois ; c'est le rythme qui est fixe. Cette méthode permet de grouper les commandes d'un même fournisseur.",
        formulas: ['S = D × (R + L) + z × σ × √(R + L)', 'Position de stock = stock disponible + commandes en cours', 'Quantité à commander = S − position de stock (0 si négatif)'],
        terms: [
          ['S', 'Niveau cible : le stock maximal visé à chaque commande.'],
          ['D', 'Demande moyenne par période (par jour, par exemple).'],
          ['R', 'Période de revue : intervalle entre deux commandes (jours).'],
          ['L', "Délai d'approvisionnement (jours)."],
          ['z, σ', 'Coefficient du taux de service (1,65 pour 95 %) et écart-type de la demande par période.'],
          ['Position de stock', 'Ce qu\'on a en stock plus ce qui est déjà commandé et pas encore reçu.'],
        ],
        example: {
          statement: 'D = 100 unités/jour ; revue tous les 7 jours ; délai 3 jours ; σ = 20 par jour ; taux de service 95 % (z = 1,65). Stock 450, commandes en cours 250.',
          steps: ['R + L = 7 + 3 = 10 jours', 'S = 100 × 10 + 1,65 × 20 × √10 = 1 000 + 104,4 ≈ 1 104', 'Position = 450 + 250 = 700', 'Quantité = 1 104 − 700 = 404 unités'],
          result: 'On commande 404 unités à la revue de cette semaine.',
        },
        exercises: [
          () => {
            const D = int(50, 300, 10)
            const R = pick([5, 7, 10, 14])
            const L = int(2, 7)
            return {
              kind: 'number',
              statement: 'Calcule la demande moyenne pendant la période de protection (revue + délai).',
              data: [['Demande moyenne D', `${D} unités / jour`], ['Période de revue R', `${R} jours`], ['Délai L', `${L} jours`]],
              question: 'D × (R + L) (en unités) ?',
              answer: D * (R + L),
              unit: 'unités',
              tolerance: 0.5,
              steps: [`R + L = ${R} + ${L} = ${R + L} jours`, `D × (R + L) = ${D} × ${R + L} = ${D * (R + L)}`],
              conclusion: 'Ce premier terme est la demande attendue ; il reste à ajouter le stock de sécurité.',
            }
          },
          () => {
            const D = int(50, 300, 10)
            const R = pick([5, 7, 10])
            const L = pick([2, 3, 5, 6])
            const sigma = int(10, 40)
            const S = D * (R + L) + 1.65 * sigma * Math.sqrt(R + L)
            return {
              kind: 'number',
              statement: 'Calcule le niveau cible (taux de service 95 %, z = 1,65).',
              data: [['Demande moyenne D', `${D} / jour`], ['Revue R', `${R} jours`], ['Délai L', `${L} jours`], ['Écart-type σ', `${sigma} / jour`]],
              question: 'Niveau cible S (en unités) ?',
              answer: S,
              unit: 'unités',
              tolerance: 2,
              steps: [`R + L = ${R + L}`, `D × (R + L) = ${D * (R + L)}`, `Stock de sécurité = 1,65 × ${sigma} × √${R + L} = ${fmt(1.65 * sigma * Math.sqrt(R + L), 1)}`, `S = ${D * (R + L)} + ${fmt(1.65 * sigma * Math.sqrt(R + L), 1)} = ${fmt(S, 1)}`],
              conclusion: 'La période de protection est R + L, plus longue que dans la méthode du point de commande (L seul).',
            }
          },
          () => {
            const S = int(80, 200, 10) * 10
            const stock = Math.round(S * (int(20, 50) / 100))
            const onOrder = Math.round(S * (int(5, 30) / 100))
            return {
              kind: 'number',
              statement: 'À la revue, calcule la quantité à commander.',
              data: [['Niveau cible S', `${fmt(S)} unités`], ['Stock disponible', `${fmt(stock)} unités`], ['Commandes en cours', `${fmt(onOrder)} unités`]],
              question: 'Quantité à commander (en unités) ?',
              answer: S - stock - onOrder,
              unit: 'unités',
              tolerance: 0.5,
              steps: [`Position = ${fmt(stock)} + ${fmt(onOrder)} = ${fmt(stock + onOrder)}`, `Quantité = S − position = ${fmt(S)} − ${fmt(stock + onOrder)} = ${fmt(S - stock - onOrder)}`],
              conclusion: 'On compte les commandes en cours dans la position, sinon on commanderait deux fois la même chose.',
            }
          },
          () => {
            const S = int(80, 200, 10) * 10
            const position = Math.round(S * (int(60, 130) / 100))
            return {
              kind: 'number',
              statement: 'Si la position de stock dépasse le niveau cible, on ne commande rien (quantité = 0).',
              data: [['Niveau cible S', `${fmt(S)} unités`], ['Position de stock', `${fmt(position)} unités`]],
              question: 'Quantité à commander (en unités) ?',
              answer: Math.max(0, S - position),
              unit: 'unités',
              tolerance: 0.5,
              steps: [`S − position = ${fmt(S)} − ${fmt(position)} = ${fmt(S - position)}`, S - position > 0 ? `Résultat positif : on commande ${fmt(S - position)} unités.` : 'Résultat négatif ou nul : on ne commande rien cette fois.'],
              conclusion: 'Le recomplètement ne commande que ce qui manque pour atteindre le niveau cible.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'D', label: 'Demande moyenne', unit: '/ jour', value: 100 },
            { key: 'R', label: 'Période de revue', unit: 'jours', value: 7 },
            { key: 'L', label: 'Délai', unit: 'jours', value: 3 },
            { key: 'sigma', label: 'Écart-type σ', unit: '/ jour', value: 20 },
            { key: 'z', label: 'Coefficient z', value: 1.65, help: '1,28 · 1,65 · 2,33' },
            { key: 'stock', label: 'Stock disponible', unit: 'unités', value: 450 },
            { key: 'onOrder', label: 'Commandes en cours', unit: 'unités', value: 250 },
          ],
          outputs: [
            { label: 'Niveau cible S', unit: 'unités', digits: 0, fn: (n) => n.D * (n.R + n.L) + n.z * n.sigma * Math.sqrt(n.R + n.L) },
            { label: 'Position de stock', unit: 'unités', digits: 0, fn: (n) => n.stock + n.onOrder },
            { label: 'À commander', unit: 'unités', digits: 0, highlight: true, fn: (n) => Math.max(0, Math.ceil(n.D * (n.R + n.L) + n.z * n.sigma * Math.sqrt(n.R + n.L)) - n.stock - n.onOrder) },
          ],
          steps: (n) => {
            const ss = n.z * n.sigma * Math.sqrt(n.R + n.L)
            return [`Stock de sécurité = ${fmt(n.z)} × ${fmt(n.sigma)} × √${fmt(n.R + n.L)} = ${fmt(ss, 1)}`, `S = ${fmt(n.D)} × ${fmt(n.R + n.L)} + ${fmt(ss, 1)} = ${fmt(n.D * (n.R + n.L) + ss, 1)}`, `Quantité = S − (stock + en cours) = ${fmt(n.D * (n.R + n.L) + ss, 0)} − ${fmt(n.stock + n.onOrder)}`]
          },
          note: "Le niveau cible est arrondi à l'unité supérieure pour la quantité à commander.",
        },
      },
    },
  ],

  excel: [
    {
      id: 'classe-abc-si',
      fn: 'SI.CONDITIONS',
      level: 2,
      tier: 2,
      minResults: 3,
      title: 'La classe ABC d\'un article',
      context: 'Tu automatises le classement ABC : la classe dépend du pourcentage cumulé de la valeur.',
      instruction: 'En **B3**, affiche la classe de l\'article : « A » si le cumul (B1) est inférieur ou égal à 80 %, « B » s\'il est inférieur ou égal à 95 %, « C » sinon.',
      generate() {
        return { rows: [['Cumul de la valeur', int(8, 100) / 100]], extra: { A3: 'Classe' } }
      },
      target: 'B3',
      solution: '=SI.CONDITIONS(B1<=0,8;"A";B1<=0,95;"B";VRAI;"C")',
      mustUse: ['SI.CONDITIONS'],
      hints: ['SI.CONDITIONS(test1 ; valeur1 ; test2 ; valeur2 ; …) teste les conditions dans l\'ordre et s\'arrête à la première vraie.', 'Termine par VRAI ; "C" : une condition toujours vraie qui sert de « sinon ». 80 % s\'écrit 0,8 (ou 80%).'],
      explain: 'Excel teste B1<=0,8 en premier ; si c\'est faux, il teste B1<=0,95 ; sinon, VRAI est toujours vrai et renvoie « C ». L\'ordre des conditions est donc essentiel.',
    },
    {
      id: 'abc-cumul',
      fn: 'SOMME',
      level: 3,
      tier: 5,
      title: 'Le cumul en % des meilleurs articles',
      context: 'Pour classer tes articles en A, B et C, tu calcules la part cumulée de la valeur des articles les plus importants.',
      instruction: 'En **D2**, calcule le **cumul en %** des valeurs des lignes 2 à 4 par rapport au total des lignes 2 à 9, **arrondi à 3 décimales** (ex. 0,742).',
      generate() {
        const values = Array.from({ length: 8 }, () => int(2, 90) * 100).sort((a, b) => b - a)
        return { rows: [['Article', 'Valeur annuelle (€)'], ...values.map((v, i) => [`Art-${i + 1}`, v])], extra: { C2: 'Cumul des 3 premiers' } }
      },
      target: 'D2',
      solution: '=ARRONDI(SOMME(B2:B4)/SOMME(B2:B9);3)',
      mustUse: ['SOMME', 'ARRONDI'],
      hints: ['Le numérateur est la somme des 3 premières valeurs : SOMME(B2:B4).', 'Divise-le par le total SOMME(B2:B9), puis entoure le tout de ARRONDI(…;3).'],
      explain: 'Les articles sont triés du plus grand au plus petit : le cumul des 3 premiers divisé par le total donne la part de valeur qu\'ils représentent. C\'est la colonne « cumul » de l\'analyse ABC.',
    },
    {
      id: 'rotation-moyenne',
      fn: 'MOYENNE',
      level: 3,
      tier: 5,
      title: 'La rotation à partir des stocks mensuels',
      context: 'Tu as relevé le stock de fin de chaque mois et tu connais la consommation de l\'année : tu calcules la rotation.',
      instruction: 'En **E2**, calcule la **rotation** : consommation annuelle (E1) divisée par le **stock moyen** des 12 mois, **arrondie à 1 décimale**.',
      generate() {
        const base = int(80, 200) * 1000
        const stocks = MONTHS.map(() => Math.round((base + int(-30, 30) * 1000) / 1000) * 1000)
        const avg = stocks.reduce((a, b) => a + b, 0) / 12
        return {
          rows: [['Mois', 'Stock fin de mois (€)'], ...MONTHS.map((m, i) => [m, stocks[i]])],
          extra: { D1: 'Consommation annuelle (€)', E1: Math.round((avg * int(30, 100)) / 10 / 1000) * 1000, D2: 'Rotation' },
        }
      },
      target: 'E2',
      solution: '=ARRONDI(E1/MOYENNE(B2:B13);1)',
      mustUse: ['MOYENNE', 'ARRONDI'],
      hints: ['Le stock moyen se calcule avec MOYENNE(B2:B13).', 'Rotation = consommation annuelle / stock moyen ; entoure le résultat de ARRONDI(…;1).'],
      explain: 'La rotation indique combien de fois le stock se renouvelle dans l\'année. Pour le stock moyen, on prend la moyenne des 12 relevés mensuels, plus fiable qu\'un seul relevé.',
    },
    {
      id: 'alertes-classe-a',
      fn: 'NB.SI.ENS',
      level: 2,
      tier: 4,
      minResults: 4,
      title: 'Les articles A sous le seuil',
      context: 'Tu surveilles les articles de classe A dont le stock passe sous un seuil d\'alerte.',
      instruction: 'En **G2**, compte les articles de **classe A** dont le **stock est inférieur au seuil** indiqué en G1.',
      generate() {
        const classes = ['A', 'A', 'A', 'A', 'B', 'B', 'B', 'C', 'C']
        const rows = [['Réf', 'Article', 'Classe', 'Stock'], ...sample(classes, 9).map((c, i) => [`R-${301 + i}`, ARTICLES[i], c, int(5, 120)])]
        return { rows, extra: { F1: 'Seuil de stock', G1: int(30, 80, 5), F2: 'Articles A sous le seuil' } }
      },
      target: 'G2',
      solution: '=NB.SI.ENS(C2:C10;"A";D2:D10;"<"&G1)',
      mustUse: ['NB.SI.ENS'],
      hints: ['NB.SI.ENS(plage1 ; critère1 ; plage2 ; critère2) compte les lignes qui respectent les deux critères.', 'Pour comparer avec une cellule, on assemble le signe et la cellule : "<"&G1.'],
      explain: 'NB.SI.ENS compte les lignes où la classe est « A » ET où le stock est inférieur au seuil. Le critère "<"&G1 reste valable si tu changes le seuil en G1.',
    },
  ],

  cases: [
    {
      id: 'stock-dormant',
      title: 'Le stock dormant',
      role: "Responsable stocks d'un grossiste en pièces techniques",
      lesson: 'stocks/types-couts',
      generate() {
        const V = int(5, 20) * 100000
        const share = int(10, 25)
        const D = (V * share) / 100
        const hold = D * 0.2
        return {
          intro: `Un audit montre que ${share} % de la valeur de ton stock (${eur(D, 0)} sur ${eur(V, 0)}) n'a eu aucun mouvement depuis 12 mois. Le coût de possession est estimé à 20 % de la valeur du stock par an.`,
          steps: [
            {
              situation: 'Quelle est ta première action ?',
              better: `Ces articles ne se valent pas : certains peuvent encore se vendre, d'autres être renvoyés au fournisseur ou soldés. Classer par valeur et par ancienneté évite de brader l'ensemble des ${eur(D, 0)} ou de les garder en payant ${eur(hold, 0)} par an.`,
              choices: [
                { text: 'Je classe ces articles par valeur et par ancienneté.', points: 3, feedback: 'Un diagnostic précis permet de choisir une action adaptée à chaque groupe d\'articles : vente, retour fournisseur, don ou dépréciation.' },
                { text: 'Je jette tout pour libérer de la place.', points: 1, feedback: `Tu stoppes les coûts, mais tu détruis ${eur(D, 0)} de valeur d'un coup, alors qu'une partie pourrait être récupérée.` },
                { text: "J'attends : tout finira bien par se vendre.", points: 0, feedback: `Chaque année d'attente coûte ${eur(hold, 0)} en possession, et la valeur des articles baisse avec le temps.` },
              ],
            },
            {
              situation: `Un lot de ${eur(D, 0)} (à prix de revient) peut être soldé à 50 % de sa valeur. Que fais-tu ?`,
              better: `Solder à −50 % rapporte ${eur(D * 0.5, 0)} de trésorerie et supprime ${eur(hold, 0)} de coût de possession par an. Garder le lot coûte ${eur(hold, 0)} chaque année pour un résultat incertain.`,
              choices: [
                { text: 'Je solde à −50 % : je libère de la trésorerie et je stoppe les coûts.', points: 3, feedback: `Tu récupères ${eur(D * 0.5, 0)} et tu économises ${eur(hold, 0)} par an de possession : le résultat est positif dès la première année.` },
                { text: 'Je solde à −90 % pour tout vider tout de suite.', points: 1, feedback: `Tu ne récupérerais que ${eur(D * 0.1, 0)} : trop bradé, alors qu'un prix à −50 % peut déjà trouver preneur.` },
                { text: 'Je garde tout en attendant une meilleure occasion.', points: 0, feedback: `Le lot coûte ${eur(hold, 0)} par an à posséder, et plus il vieillit, moins il se vend.` },
              ],
            },
            {
              situation: 'Comment éviter que le problème se reproduise ?',
              better: `Un contrôle régulier détecte tôt les articles qui ne bougent plus, avant qu'ils ne pèsent ${share} % de la valeur. Réduire tous les stocks de sécurité de moitié sans analyse créerait des ruptures sur les articles qui se vendent.`,
              choices: [
                { text: 'Revue trimestrielle des articles sans mouvement, et arrêt du réapprovisionnement après 6 mois sans vente.', points: 3, feedback: 'On repère les articles qui dorment tôt et on arrête de les racheter : le problème est traité à la source.' },
                { text: 'Réduire de moitié le stock de sécurité de tous les articles.', points: 1, feedback: 'Une mesure trop générale : elle ne cible pas les articles dormants et risque de créer des ruptures sur les bons produits.' },
                { text: 'Acheter moins chez tous les fournisseurs, sans analyse.', points: 0, feedback: 'Sans analyse, tu manques de produits qui se vendent bien, tout en gardant les articles dormants déjà en stock.' },
              ],
            },
          ],
          debrief: `Un stock dormant de ${eur(D, 0)} coûte ${eur(hold, 0)} par an. La bonne démarche est : diagnostiquer, déstocker à un prix réaliste (−50 % rapporte ${eur(D * 0.5, 0)}), puis surveiller les articles sans mouvement pour l'éviter à l'avenir.`,
        }
      },
    },
    {
      id: 'reappro-methode',
      title: 'Quelle méthode de réapprovisionnement ?',
      role: "Responsable approvisionnement d'un grossiste en fournitures de bureau (3 000 références)",
      lesson: 'stocks/reappro',
      intro:
        "Tu gères 3 000 références venant d'une trentaine de fournisseurs. Les articles de classe A (environ 300) représentent 80 % de la valeur ; les 800 références de classe C viennent surtout de 5 fournisseurs. Tes ruptures sont fréquentes et tes commandes sont trop nombreuses.",
      steps: [
        {
          situation: 'Quelle approche globale choisis-tu ?',
          better:
            "Les 300 références A pèsent 80 % de la valeur : elles méritent un suivi précis avec un point de commande. Appliquer la même méthode à 3 000 références obligerait à surveiller chacune en continu, ce qui n'a pas de sens pour des articles à faible valeur.",
          choices: [
            { text: 'Classement ABC : point de commande pour les A, recomplètement périodique pour les B et C.', points: 3, feedback: "Tu concentres l'effort sur les articles qui comptent, et tu allèges la gestion de ceux qui pèsent peu." },
            { text: 'Un point de commande identique pour les 3 000 références.', points: 1, feedback: 'Cela demande un suivi continu de chaque référence, trop lourd pour des articles de faible valeur, et ne règle pas le problème des commandes trop nombreuses.' },
            { text: 'Aucun stock : je commande chaque référence quand un client la demande.', points: 0, feedback: 'Le délai fournisseur ferait perdre beaucoup de ventes : tes clients attendent une livraison rapide.' },
          ],
        },
        {
          situation: 'Pour les 800 références de classe C venant de 5 fournisseurs, quelle fréquence de revue choisis-tu ?',
          better:
            "Avec une revue hebdomadaire regroupée par fournisseur, tu passes 5 commandes par semaine au lieu de 800 commandes séparées, et chaque commande regroupe plusieurs articles : les frais de commande et de transport diminuent.",
          choices: [
            { text: 'Une revue hebdomadaire, regroupée par fournisseur.', points: 3, feedback: 'Peu de commandes, bien remplies : c\'est le cas typique où le recomplètement périodique est le plus efficace.' },
            { text: 'Une surveillance continue de chaque référence.', points: 1, feedback: 'Cela multiplierait les petites commandes, donc les frais de passation, pour des articles de faible valeur.' },
            { text: 'Une seule revue par an.', points: 0, feedback: "Une période de revue aussi longue obligerait à des stocks énormes pour éviter les ruptures, et immobiliserait de l'argent." },
          ],
        },
        {
          situation: 'Comment vérifies-tu que la nouvelle méthode fonctionne ?',
          better:
            "Le taux de service et la rotation, suivis par classe ABC, montrent si les articles A sont bien protégés et si le stock des articles C reste raisonnable. Le chiffre d'affaires seul ne dit rien du stock ni des ruptures.",
          choices: [
            { text: 'Je suis le taux de service et la rotation, par classe ABC.', points: 3, feedback: 'Tu mesures à la fois le service rendu (ruptures) et l\'efficacité du stock (rotation), classe par classe.' },
            { text: 'Je compte le nombre de commandes passées.', points: 1, feedback: "Le nombre de commandes est utile, mais ne dit rien du service rendu au client ni du niveau de stock." },
            { text: "Je regarde seulement le chiffre d'affaires.", points: 0, feedback: "Le chiffre d'affaires dépend de bien d'autres facteurs : il ne mesure ni les ruptures ni le stock." },
          ],
        },
      ],
      debrief:
        "On adapte la méthode au type d'article : suivi continu pour les A (point de commande), revue groupée pour les B et C (recomplètement périodique). On contrôle le résultat avec le taux de service et la rotation par classe.",
    },
  ],

  english: {
    extend: {
      entrepot: [
        {
          id: 'gerer-stock',
          title: 'Gérer le stock',
          level: 2,
          items: [
            { en: 'replenishment', fr: 'réapprovisionnement', def: "Action de remettre du stock en entrepôt après des ventes ou des sorties.", ex: 'Replenishment takes place every Monday.', exFr: 'Le réapprovisionnement a lieu chaque lundi.' },
            { en: 'turnover', fr: 'rotation (du stock)', def: "Nombre de fois où le stock se renouvelle sur une période.", ex: 'The stock turnover is eight times a year.', exFr: 'La rotation du stock est de huit fois par an.', note: 'Piège : « turnover » peut aussi vouloir dire chiffre d\'affaires (en anglais britannique) ou renouvellement du personnel.' },
            { en: 'obsolete', fr: 'obsolète', def: "Qui n'est plus utilisé ni vendable parce qu'il est dépassé.", ex: 'These parts are obsolete.', exFr: 'Ces pièces sont obsolètes.' },
            { en: 'excess stock', fr: 'surstock', def: "Stock plus important que ce que la demande permet de vendre.", ex: 'We have excess stock of winter coats.', exFr: "Nous avons un surstock de manteaux d'hiver." },
            { en: 'stock count', fr: 'comptage de stock', def: "Opération qui consiste à compter physiquement les articles en stock.", ex: 'The stock count starts at six.', exFr: 'Le comptage de stock commence à six heures.' },
            { en: 'shelf life', fr: 'durée de conservation', def: "Durée pendant laquelle un produit peut être stocké ou vendu sans perdre sa qualité.", ex: 'The shelf life of this product is six months.', exFr: 'La durée de conservation de ce produit est de six mois.' },
          ],
        },
        {
          id: 'chiffres-stock',
          title: 'Les chiffres du stock',
          level: 2,
          items: [
            { en: 'cost price', fr: 'prix de revient', def: "Somme de tous les coûts nécessaires pour obtenir un produit.", ex: 'The cost price is eight euros per unit.', exFr: 'Le prix de revient est de huit euros par unité.' },
            { en: 'holding cost', fr: 'coût de possession', def: "Coût de garder du stock : capital immobilisé, place, assurance, casse.", ex: 'High inventory increases the holding cost.', exFr: 'Un stock élevé fait augmenter le coût de possession.' },
            { en: 'ordering cost', fr: 'coût de passation', def: "Coût d'une commande : temps administratif, transport, réception.", ex: 'The ordering cost is fifty euros per order.', exFr: 'Le coût de passation est de cinquante euros par commande.' },
            { en: 'service level', fr: 'taux de service', def: "Part des demandes des clients satisfaites sans rupture.", ex: 'Our target service level is ninety-five percent.', exFr: 'Notre taux de service visé est de quatre-vingt-quinze pour cent.' },
            { en: 'FIFO', fr: 'premier entré, premier sorti', def: "Méthode où les articles les plus anciens sont sortis et valorisés en premier.", ex: 'We use FIFO to manage the stock.', exFr: 'Nous utilisons le FIFO pour gérer le stock.', note: 'FIFO = First In, First Out.' },
            { en: 'write-off', fr: 'dépréciation (mise au rebut)', alt: ['write off'], def: "Perte comptable d'un stock devenu inutilisable ou invendable.", ex: 'The old stock was a total write-off.', exFr: "Le vieux stock a été une perte totale." },
          ],
        },
      ],
    },
  },
}
