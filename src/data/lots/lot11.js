// Lot 11 — Outils et SI : Atelier (1 formule, 3 défis Excel, 2 études de cas) + Anglais (abréviations, réunion en visio).
import { fmt, int, pick } from '../gen.js'

export default {
  formulas: [
    {
      id: 'retour-investissement',
      title: "Retour sur investissement d'un projet",
      short: 'Délai de retour = investissement / gain annuel',
      course: {
        purpose:
          "Avant d'acheter un logiciel ou un équipement (WMS, automatisation, étiquetage), on vérifie qu'il est **rentable**. Le **délai de retour** indique en combien de temps les économies remboursent l'investissement ; le **ROI** mesure le gain par euro investi.",
        formulas: ['Gain annuel net = économies annuelles − coûts annuels du système', 'Délai de retour = investissement / gain annuel net', 'ROI sur n ans = (gain annuel × n − investissement) / investissement × 100'],
        terms: [
          ['Investissement', 'Dépense initiale (licences, intégration, formation, matériel).'],
          ['Économies annuelles', 'Heures gagnées, erreurs évitées, stocks réduits… en euros par an.'],
          ['Coûts annuels', 'Maintenance, abonnement, support.'],
          ['ROI', 'Return On Investment : rentabilité de l\'investissement, en %.'],
        ],
        example: {
          statement: 'Un WMS coûte 120 000 € à installer. Il fait économiser 70 000 € par an mais coûte 15 000 € par an en maintenance.',
          steps: ['Gain annuel net = 70 000 − 15 000 = 55 000 €', 'Délai de retour = 120 000 / 55 000 ≈ 2,2 ans', 'ROI sur 5 ans = (55 000 × 5 − 120 000) / 120 000 = 129 %'],
          result: "Le projet est rentabilisé en un peu plus de 2 ans ; sur 5 ans il rapporte 1,29 € net par euro investi.",
        },
        exercises: [
          () => {
            const eco = int(40, 120, 5) * 1000
            const cost = int(5, 25, 5) * 1000
            return {
              kind: 'number',
              statement: 'Calcule le gain annuel net du projet.',
              data: [['Économies annuelles', `${fmt(eco)} €`], ['Coûts annuels du système', `${fmt(cost)} €`]],
              question: 'Gain annuel net (en €) ?',
              answer: eco - cost,
              unit: '€',
              tolerance: 1,
              steps: [`${fmt(eco)} − ${fmt(cost)} = ${fmt(eco - cost, 0)} €`],
              conclusion: 'Les coûts de fonctionnement réduisent le gain : il faut toujours les inclure.',
            }
          },
          () => {
            const inv = int(60, 300, 20) * 1000
            const gain = int(25, 100, 5) * 1000
            return {
              kind: 'number',
              statement: 'Calcule le délai de retour sur investissement.',
              data: [['Investissement', `${fmt(inv)} €`], ['Gain annuel net', `${fmt(gain)} €`]],
              question: 'Délai de retour (en années) ?',
              answer: inv / gain,
              unit: 'ans',
              tolerance: 0.05,
              steps: [`${fmt(inv)} / ${fmt(gain)} = ${fmt(inv / gain, 2)} an${inv / gain > 1 ? 's' : ''}`],
              conclusion: inv / gain <= 3 ? 'Moins de 3 ans : la plupart des entreprises acceptent ce type de délai.' : 'Plus de 3 ans : le projet devra être très bien justifié.',
            }
          },
          () => {
            const inv = int(80, 300, 20) * 1000
            const gain = int(40, 120, 10) * 1000
            const years = pick([3, 5])
            return {
              kind: 'number',
              statement: 'Calcule le ROI du projet sur la période.',
              data: [['Investissement', `${fmt(inv)} €`], ['Gain annuel net', `${fmt(gain)} €`], ['Durée', `${years} ans`]],
              question: 'ROI (en %) ?',
              answer: ((gain * years - inv) / inv) * 100,
              unit: '%',
              tolerance: 0.5,
              steps: [`Gain cumulé = ${fmt(gain)} × ${years} = ${fmt(gain * years, 0)} €`, `ROI = (${fmt(gain * years, 0)} − ${fmt(inv)}) / ${fmt(inv)} × 100 = ${fmt(((gain * years - inv) / inv) * 100, 0)} %`],
              conclusion: ((gain * years - inv) / inv) < 0 ? 'ROI négatif : sur cette durée, le projet ne se rentabilise pas.' : 'ROI positif : le projet rapporte plus qu\'il ne coûte sur la durée.',
            }
          },
          () => {
            const hours = int(1000, 6000, 500)
            const rate = int(20, 40, 2)
            const cut = pick([10, 15, 20, 30])
            return {
              kind: 'number',
              statement: 'Un outil réduit le temps de saisie. Calcule l\'économie annuelle de main-d\'œuvre.',
              data: [['Heures de saisie par an', fmt(hours)], ['Coût horaire chargé', `${rate} €`], ['Réduction du temps', `${cut} %`]],
              question: 'Économie annuelle (en €) ?',
              answer: (hours * cut * rate) / 100,
              unit: '€',
              tolerance: 5,
              steps: [`Heures gagnées = ${fmt(hours)} × ${cut} % = ${fmt((hours * cut) / 100, 0)} h`, `Économie = ${fmt((hours * cut) / 100, 0)} × ${rate} € = ${fmt((hours * cut * rate) / 100, 0)} €`],
              conclusion: 'Ces économies alimentent le gain annuel utilisé pour calculer le délai de retour.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'inv', label: 'Investissement', unit: '€', value: 120000 },
            { key: 'eco', label: 'Économies annuelles', unit: '€', value: 70000 },
            { key: 'cost', label: 'Coûts annuels du système', unit: '€', value: 15000 },
            { key: 'years', label: 'Durée d\'analyse', unit: 'ans', value: 5 },
          ],
          outputs: [
            { label: 'Gain annuel net', unit: '€', digits: 0, fn: (n) => n.eco - n.cost },
            { label: 'Délai de retour', unit: 'ans', digits: 1, highlight: true, fn: (n) => (n.eco - n.cost > 0 ? n.inv / (n.eco - n.cost) : 0) },
            { label: 'ROI sur la durée', unit: '%', digits: 0, fn: (n) => (n.inv > 0 ? (((n.eco - n.cost) * n.years - n.inv) / n.inv) * 100 : 0) },
          ],
          steps: (n) => [`Gain net = ${fmt(n.eco)} − ${fmt(n.cost)} = ${fmt(n.eco - n.cost, 0)} €`],
          note: 'Si le gain net est nul ou négatif, le délai de retour n\'existe pas (affiché 0).',
        },
      },
    },
  ],

  excel: [
    {
      id: 'doublons-articles',
      fn: 'NB.SI',
      level: 3,
      tier: 2,
      title: 'Repérer un doublon',
      context: 'Tu nettoies le fichier articles : certains codes sont saisis deux fois.',
      instruction: 'En **C2**, indique **combien de fois le code de la ligne 2 apparaît** dans la liste des codes (colonne A).',
      generate() {
        const codes = ['A100', 'A101', 'A102', 'A103', 'A104', 'A105', 'A106', 'A107']
        const first = pick(codes)
        const rows = Array.from({ length: 10 }, (_, i) => (i === 0 ? first : Math.random() < 0.3 ? first : pick(codes)))
        return { rows: [['Code article', 'Désignation'], ...rows.map((c, i) => [c, `Article ${i + 1}`])], extra: { C1: 'Nombre de fois' } }
      },
      target: 'C2',
      solution: '=NB.SI(A2:A11;A2)',
      mustUse: ['NB.SI'],
      hints: ['La liste des codes va de A2 à A11.', 'NB.SI(A2:A11 ; A2) compte les cellules qui valent la même chose que A2.'],
      explain: 'NB.SI compte les cellules d\'une plage qui répondent à un critère : ici, le code lui-même. Un résultat supérieur à 1 indique un doublon.',
    },
    {
      id: 'fiabilite-donnees',
      fn: 'ARRONDI',
      level: 2,
      tier: 5,
      title: 'La fiabilité des données',
      context: 'Tu as contrôlé un échantillon d\'articles : pour chacun, tu as noté si les dimensions étaient exactes.',
      instruction: 'En **D2**, calcule le **taux de fiabilité** : nombre de « Oui » ÷ nombre d\'articles contrôlés × 100, **arrondi à 1 décimale**.',
      generate() {
        const p = int(75, 97) / 100
        return { rows: [['Article', 'Dimensions exactes'], ...Array.from({ length: 20 }, (_, i) => [`Art-${i + 1}`, Math.random() < p ? 'Oui' : 'Non'])], extra: { D1: 'Fiabilité (%)' } }
      },
      target: 'D2',
      solution: '=ARRONDI(NB.SI(B2:B21;"Oui")/NBVAL(A2:A21)*100;1)',
      mustUse: ['NB.SI', 'ARRONDI'],
      hints: ['NB.SI(B2:B21;"Oui") compte les articles exacts.', 'Divise par NBVAL(A2:A21) puis multiplie par 100 et arrondis.'],
      explain: 'Le taux de fiabilité compare les enregistrements corrects au total contrôlé. Il permet de suivre la qualité des données d\'une période à l\'autre.',
    },
    {
      id: 'delai-retour-excel',
      fn: 'ARRONDI',
      level: 2,
      tier: 5,
      title: 'Le délai de retour sur investissement',
      context: 'Tu présentes le projet d\'un nouveau logiciel de gestion d\'entrepôt à ta direction.',
      instruction: 'En **B5**, calcule le **délai de retour en années** : investissement ÷ (économies − coûts annuels), **arrondi à 1 décimale**.',
      generate() {
        return { rows: [['Investissement (€)', int(80, 250, 10) * 1000], ['Économies annuelles (€)', int(60, 120, 5) * 1000], ['Coûts annuels (€)', int(5, 25, 5) * 1000]], extra: { A5: 'Délai de retour (ans)' } }
      },
      target: 'B5',
      solution: '=ARRONDI(B1/(B2-B3);1)',
      mustUse: ['ARRONDI'],
      hints: ['Le gain net annuel est B2 − B3.', 'Divise B1 par ce gain, entre parenthèses, puis arrondis à 1 décimale.'],
      explain: 'Le délai de retour divise la dépense initiale par le gain annuel net. Les parenthèses sont indispensables : sans elles, Excel diviserait seulement par B2.',
    },
  ],

  cases: [
    {
      id: 'choix-wms',
      title: 'Investir dans un WMS ?',
      role: "Responsable logistique d'un distributeur de pièces détachées",
      lesson: 'outils/erp-wms-tms',
      generate() {
        const inv = int(100, 200, 20) * 1000
        const eco = int(60, 100, 10) * 1000
        const cost = int(10, 20, 5) * 1000
        const gain = eco - cost
        const payback = inv / gain
        return {
          intro: `Ton entrepôt gère ses emplacements sur un tableur : erreurs de préparation et recherches de stock fréquentes. Un éditeur propose un WMS : investissement de ${fmt(inv)} €, économies annuelles estimées à ${fmt(eco)} € (heures et erreurs évitées), mais ${fmt(cost)} € de coûts annuels (maintenance, abonnement).`,
          steps: [
            {
              situation: 'Quel est le gain annuel net, et en combien de temps le projet se rembourse-t-il ?',
              better: `Gain net = ${fmt(eco)} − ${fmt(cost)} = ${fmt(gain)} € par an. Délai de retour = ${fmt(inv)} / ${fmt(gain)} = ${fmt(payback, 1)} ans. Il faut déduire les coûts annuels, sinon le projet paraît plus rentable qu'il ne l'est.`,
              choices: [
                { text: `Gain net ${fmt(gain)} € par an, retour en ${fmt(payback, 1)} ans.`, points: 3, feedback: `(${fmt(eco)} − ${fmt(cost)}) donne ${fmt(gain)} € ; ${fmt(inv)} / ${fmt(gain)} = ${fmt(payback, 1)} ans.` },
                { text: `Retour en ${fmt(inv / eco, 1)} ans en ignorant les coûts annuels.`, points: 1, feedback: `Tu oublies ${fmt(cost)} € par an de coûts : le vrai délai est ${fmt(payback, 1)} ans, plus long que ${fmt(inv / eco, 1)}.` },
                { text: 'Impossible à calculer sans connaître la marque du logiciel.', points: 0, feedback: 'Le calcul de rentabilité repose sur des montants et non sur la marque.' },
              ],
            },
            {
              situation: 'Les économies annoncées par l\'éditeur reposent sur des hypothèses. Comment sécurises-tu ton analyse ?',
              better: "Un chiffrage prudent : on vérifie les hypothèses avec des mesures de l'entrepôt (temps passé, taux d'erreur), on teste un scénario pessimiste (économies réduites de 30 %) et on demande des références clients.",
              choices: [
                { text: 'Je mesure mes données actuelles et je teste un scénario pessimiste.', points: 3, feedback: 'Des hypothèses vérifiées et un scénario prudent évitent une mauvaise surprise après l\'achat.' },
                { text: 'Je reprends les chiffres du vendeur tels quels.', points: 0, feedback: 'Un vendeur a intérêt à présenter des gains optimistes : il faut les confronter à ta réalité.' },
                { text: 'Je renonce à tout projet par prudence.', points: 1, feedback: 'Refuser sans analyse prive l\'entreprise d\'un gain peut-être important.' },
              ],
            },
            {
              situation: 'Comment limites-tu les risques du déploiement ?',
              better: "Un déploiement progressif (zone pilote, formation, nettoyage des données avant la reprise) limite les arrêts d'activité. La qualité des données de référence (dimensions, emplacements) conditionne la réussite.",
              choices: [
                { text: 'Un pilote, la formation des équipes et des données nettoyées avant le démarrage.', points: 3, feedback: 'Les échecs de projets viennent surtout de la formation et de la qualité des données, pas du logiciel.' },
                { text: 'Un démarrage général un lundi matin, sans test.', points: 0, feedback: 'Un démarrage sans test risque de bloquer l\'entrepôt et de retarder les livraisons.' },
                { text: 'Laisser l\'éditeur gérer seul le projet.', points: 1, feedback: 'L\'éditeur ne connaît pas votre activité : les équipes internes doivent participer.' },
              ],
            },
          ],
          debrief: `Le projet se rembourse en ${fmt(payback, 1)} ans (gain net ${fmt(gain)} € par an). Pour décider, on déduit les coûts annuels, on vérifie les hypothèses de gain, on teste un scénario pessimiste et on prépare un déploiement progressif avec des données propres.`,
        }
      },
    },
    {
      id: 'donnees-fausses',
      title: 'Des commandes toujours en retard',
      role: "Planificateur approvisionnements dans une usine de composants",
      lesson: 'outils/donnees-reference',
      intro:
        "Depuis trois mois, plusieurs composants arrivent en retard et la ligne s'arrête. Ton ERP calcule les besoins avec un délai de 14 jours pour ces articles, alors que le fournisseur a changé d'usine : les livraisons prennent maintenant 28 jours. Personne n'a mis à jour la fiche.",
      steps: [
        {
          situation: "Quelle est la cause la plus probable des ruptures ?",
          better:
            "Le MRP lance les commandes 14 jours avant le besoin alors que la livraison en prend 28 : les composants arrivent systématiquement 14 jours trop tard. Le problème vient de la donnée de référence, pas du fournisseur seul.",
          choices: [
            { text: "Le délai de la fiche article est faux : le MRP commande trop tard.", points: 3, feedback: 'Avec 14 jours dans le système et 28 en réalité, chaque commande part 14 jours trop tard.' },
            { text: 'Le fournisseur est de mauvaise foi.', points: 1, feedback: 'Le fournisseur livre en 28 jours comme annoncé : l\'erreur vient de la fiche article non mise à jour.' },
            { text: 'La demande a explosé de 100 %.', points: 0, feedback: 'Rien n\'indique une explosion de la demande : le décalage de 14 jours explique les retards.' },
          ],
        },
        {
          situation: 'Que fais-tu en urgence ?',
          better:
            "On corrige le délai dans les fiches concernées, on relance le calcul des besoins et on traite les commandes déjà en retard (livraison express, priorisation). On évite de se contenter d'augmenter le stock de sécurité, qui masque la cause.",
          choices: [
            { text: 'Je corrige les délais, je relance le MRP et j\'accélère les commandes en retard.', points: 3, feedback: 'Corriger la donnée évite que le problème se reproduise ; accélérer les commandes réduit les arrêts de ligne.' },
            { text: 'J\'augmente simplement le stock de sécurité.', points: 1, feedback: 'Cela cache le problème sans le résoudre, et immobilise du capital.' },
            { text: 'Je ne change rien en attendant que cela passe.', points: 0, feedback: 'Sans correction, les ruptures continueront chaque semaine.' },
          ],
        },
        {
          situation: 'Comment éviter que cela se reproduise ?',
          better:
            "Un propriétaire par donnée (les achats pour les délais), une revue périodique des délais réels (comparer délai théorique et délai constaté) et une alerte quand l'écart dépasse un seuil. La qualité des données se pilote comme un indicateur.",
          choices: [
            { text: 'Un propriétaire, une revue régulière des délais réels et une alerte d\'écart.', points: 3, feedback: 'La donnée est surveillée en continu : une dérive est repérée avant d\'arrêter la production.' },
            { text: 'Demander à chaque opérateur de corriger ce qu\'il voit.', points: 1, feedback: 'Sans responsable ni règles, les corrections sont incohérentes et incomplètes.' },
            { text: 'Ne plus utiliser l\'ERP pour calculer les besoins.', points: 0, feedback: 'Supprimer l\'outil remplace une donnée fausse par des calculs manuels, plus lents et plus risqués.' },
          ],
        },
      ],
      debrief:
        "Une donnée de référence fausse (un délai de 14 jours au lieu de 28) fait échouer tous les calculs qui en dépendent. On corrige, on relance, puis on met en place un propriétaire et un contrôle régulier.",
    },
  ],

  english: {
    units: [
      {
        id: 'abreviations',
        title: 'Abréviations et sigles',
        icon: 'ruler',
        color: 'violet',
        lessons: [
          {
            id: 'sigles-transport',
            title: 'Sigles du transport et des stocks',
            level: 2,
            items: [
              { en: 'ETA', fr: 'heure d\'arrivée estimée', def: "Sigle de « estimated time of arrival » : le moment où l'on prévoit l'arrivée d'un envoi.", ex: 'The ETA is Monday morning.', exFr: 'L\'heure d\'arrivée estimée est lundi matin.' },
              { en: 'ETD', fr: 'heure de départ estimée', def: "Sigle de « estimated time of departure » : le moment prévu pour le départ d'un envoi.", ex: 'The ETD is Friday at six.', exFr: 'L\'heure de départ estimée est vendredi à dix-huit heures.' },
              { en: 'SKU', fr: 'référence article', def: "Sigle de « stock keeping unit » : code qui identifie chaque article en stock.", ex: 'Each SKU has a barcode.', exFr: 'Chaque référence article a un code-barres.' },
              { en: 'MOQ', fr: 'quantité minimale de commande', def: "Sigle de « minimum order quantity » : quantité minimale que le fournisseur accepte de vendre.", ex: 'The MOQ is five hundred units.', exFr: 'La quantité minimale de commande est de cinq cents unités.' },
              { en: 'PO', fr: 'bon de commande', def: "Sigle de « purchase order » : document par lequel un acheteur commande à un fournisseur.", ex: 'We received your PO today.', exFr: 'Nous avons reçu votre bon de commande aujourd\'hui.' },
              { en: 'ASAP', fr: 'dès que possible', def: "Sigle de « as soon as possible » : le plus rapidement possible.", ex: 'We need this ASAP.', exFr: 'Nous en avons besoin dès que possible.' },
              { en: 'FYI', fr: 'pour information', def: "Sigle de « for your information » : message envoyé pour informer, sans action attendue.", ex: 'FYI, the meeting is cancelled.', exFr: 'Pour information, la réunion est annulée.' },
              { en: 'EOD', fr: 'fin de journée', def: "Sigle de « end of day » : avant la fin de la journée de travail.", ex: 'Please reply by EOD.', exFr: 'Merci de répondre avant la fin de journée.' },
            ],
          },
          {
            id: 'sigles-logistique',
            title: 'Sigles des opérations',
            level: 2,
            items: [
              { en: 'FEFO', fr: 'premier périmé, premier sorti', def: "Méthode de gestion où l'on sort d'abord les produits dont la date limite est la plus proche.", ex: 'We use FEFO for food products.', exFr: 'Nous utilisons le FEFO pour les produits alimentaires.' },
              { en: 'OTIF', fr: 'à l\'heure et complet', def: "Indicateur : livraison réalisée à la date prévue ET avec les bonnes quantités.", ex: 'Our OTIF is ninety-four percent.', exFr: 'Notre OTIF est de quatre-vingt-quatorze pour cent.' },
              { en: 'LTL', fr: 'groupage (camion partiel)', def: "Transport routier d'un chargement trop petit pour remplir un camion entier.", ex: 'This shipment goes by LTL.', exFr: 'Cet envoi part en groupage.' },
              { en: 'FTL', fr: 'camion complet', def: "Transport routier où un seul client remplit un camion entier.", ex: 'We booked an FTL for Monday.', exFr: 'Nous avons réservé un camion complet pour lundi.' },
              { en: 'RFQ', fr: 'demande de prix', def: "Sigle de « request for quotation » : demande de prix envoyée à des fournisseurs.", ex: 'We sent an RFQ to three suppliers.', exFr: 'Nous avons envoyé une demande de prix à trois fournisseurs.' },
              { en: 'POD', fr: 'preuve de livraison', def: "Sigle de « proof of delivery » : document signé qui prouve la livraison.", ex: 'We need the POD for invoicing.', exFr: 'Nous avons besoin de la preuve de livraison pour facturer.' },
              { en: 'KPI', fr: 'indicateur clé', def: "Sigle de « key performance indicator » : chiffre qui mesure un objectif important.", ex: 'This KPI is reviewed monthly.', exFr: 'Cet indicateur clé est revu chaque mois.' },
              { en: 'ROI', fr: 'retour sur investissement', def: "Sigle de « return on investment » : gain obtenu par rapport à la somme investie.", ex: 'The ROI is two years.', exFr: 'Le retour sur investissement est de deux ans.' },
            ],
          },
        ],
      },
    ],
    extend: {
      reunions: [
        {
          id: 'visio-phrases',
          title: 'Réunion en visioconférence',
          level: 3,
          items: [
            { en: 'Can you hear me clearly?', fr: 'M\'entendez-vous bien ?', blank: 'hear' },
            { en: 'I will share my screen.', fr: 'Je vais partager mon écran.', blank: 'share' },
            { en: 'Could you please mute your microphone?', fr: 'Pourriez-vous couper votre micro ?', blank: 'mute' },
            { en: 'Sorry, the connection is very slow.', fr: 'Désolé, la connexion est très lente.', blank: 'connection' },
            { en: 'Let me put that in the chat.', fr: 'Je vais mettre cela dans le chat.', blank: 'chat' },
            { en: 'We will record the meeting for those who cannot attend.', fr: 'Nous enregistrerons la réunion pour ceux qui ne peuvent pas y assister.', blank: 'record' },
          ],
        },
      ],
    },
  },
}
