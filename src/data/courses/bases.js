export default {
  id: 'bases',
  title: 'Les bases de la supply chain',
  short: 'Bases',
  icon: 'network',
  color: 'violet',
  lessons: [
    {
      id: 'definition',
      title: "La supply chain, c'est quoi ?",
      minutes: 4,
      cards: [
        {
          type: 'text',
          title: 'Une chaîne de A à Z',
          body:
            "La **supply chain** (chaîne logistique globale) regroupe toutes les étapes qui amènent un produit **du fournisseur de matières premières jusqu'au client final**.\n\nElle couvre les achats, la production, le stockage, le transport et la distribution.",
        },
        {
          type: 'list',
          title: 'Les 3 flux à piloter',
          items: [
            ['Flux physiques', 'Les marchandises qui circulent : matières, composants, produits finis.'],
            ["Flux d'information", 'Commandes, prévisions, stocks, suivi des livraisons.'],
            ['Flux financiers', 'Paiements aux fournisseurs, factures clients, coûts logistiques.'],
          ],
        },
        {
          type: 'list',
          title: 'Amont et aval',
          items: [
            ['Amont (upstream)', "Côté fournisseurs : tout ce qui arrive vers l'entreprise."],
            ['Aval (downstream)', "Côté clients : tout ce qui part de l'entreprise vers le marché."],
          ],
        },
        {
          type: 'example',
          title: 'Exemple : un jean',
          body:
            "Coton récolté en Inde → filé et tissé au Bangladesh → teint et cousu en Turquie → stocké dans un entrepôt en France → livré en magasin ou chez toi.\n\nChaque flèche est un maillon de la supply chain, avec du transport, du stock et de l'information.",
        },
        {
          type: 'text',
          title: "L'objectif : le bon équilibre",
          body:
            "Le supply chain manager cherche à livrer **le bon produit, en bonne quantité, au bon endroit, au bon moment, au meilleur coût** (la règle des « 5 B »).\n\nC'est toujours un compromis entre **coût**, **délai** et **qualité de service**.",
        },
        {
          type: 'key',
          points: [
            'Supply chain = du fournisseur du fournisseur au client du client.',
            '3 flux : physiques, information, financiers.',
            'Amont = fournisseurs, aval = clients.',
            'Objectif : servir le client au meilleur coût.',
          ],
        },
      ],
      quiz: [
        {
          q: 'Lequel de ces éléments est un flux d\'information ?',
          choices: ['Un camion de palettes', 'Une prévision de ventes', 'Le paiement d\'une facture', 'Un conteneur de pièces'],
          answer: 1,
          explain: 'Une prévision est une donnée qui circule entre les acteurs : c\'est un flux d\'information. Le paiement est un flux financier.',
        },
        {
          q: "Le côté « amont » de la supply chain, ce sont…",
          choices: ['Les clients', 'Les magasins', 'Les fournisseurs', 'Les transporteurs uniquement'],
          answer: 2,
          explain: "L'amont désigne tout ce qui arrive vers l'entreprise, donc les fournisseurs. L'aval, ce sont les clients.",
        },
        {
          q: 'Le supply chain manager doit surtout trouver un équilibre entre…',
          choices: ['Coût, délai et service', 'Marketing et design', 'Prix de vente et marge', 'Salaires et effectifs'],
          answer: 0,
          explain: 'La supply chain est un arbitrage permanent : livrer vite et bien coûte cher, réduire les coûts peut dégrader le service.',
        },
        {
          q: 'Quelle étape ne fait PAS partie de la supply chain ?',
          choices: ['Le stockage', 'Le transport', 'Les achats', 'Aucune : toutes en font partie'],
          answer: 3,
          explain: 'Achats, production, stockage, transport et distribution sont tous des maillons de la supply chain.',
        },
      ],
    },
    {
      id: 'flux-pousses-tires',
      title: 'Flux poussés et flux tirés',
      minutes: 5,
      cards: [
        {
          type: 'list',
          title: 'Deux logiques opposées',
          items: [
            ['Flux poussé (push)', "On produit **à l'avance**, d'après des **prévisions**, puis on stocke en attendant la demande."],
            ['Flux tiré (pull)', "On produit **seulement quand une commande client arrive** : c'est la demande réelle qui déclenche tout."],
          ],
        },
        {
          type: 'list',
          title: 'Avantages et risques',
          items: [
            ['Poussé', 'Livraison immédiate au client, mais risque de surstock ou d\'invendus si la prévision est fausse.'],
            ['Tiré', 'Peu de stock et pas d\'invendus, mais le client doit attendre la fabrication.'],
          ],
        },
        {
          type: 'list',
          title: 'Les 4 modes de production',
          items: [
            ['MTS — Make to Stock', 'Fabriqué pour le stock (lessive, boissons).'],
            ['ATO — Assemble to Order', 'Composants en stock, assemblage à la commande (PC sur mesure).'],
            ['MTO — Make to Order', 'Fabriqué à la commande (meuble sur mesure).'],
            ['ETO — Engineer to Order', 'Conçu puis fabriqué pour un client (paquebot, usine).'],
          ],
        },
        {
          type: 'text',
          title: 'Le point de découplage',
          body:
            "C'est l'endroit de la chaîne où l'on passe du **poussé** au **tiré**. Avant ce point, on travaille sur prévision ; après, sur commande.\n\nPlus il est placé en **aval** (près du client), plus le délai est court… mais plus il faut de stock.",
        },
        {
          type: 'example',
          title: 'Exemple : Dell',
          body:
            "Dell est célèbre pour son modèle ATO : les composants (processeurs, écrans) sont achetés sur prévision (poussé), mais l'ordinateur n'est assemblé qu'après la commande du client (tiré).",
        },
        {
          type: 'key',
          points: [
            'Poussé = sur prévision, avec du stock.',
            'Tiré = sur commande réelle, avec un délai.',
            'MTS → ATO → MTO → ETO : de plus en plus personnalisé.',
            'Le point de découplage sépare le poussé du tiré.',
          ],
        },
      ],
      quiz: [
        {
          q: 'Une boulangerie qui cuit ses baguettes à 6 h, avant l\'arrivée des clients, fonctionne en…',
          choices: ['Flux tiré', 'Flux poussé', 'ETO', 'Cross-docking'],
          answer: 1,
          explain: 'Le boulanger produit à l\'avance d\'après ce qu\'il pense vendre : c\'est un flux poussé (MTS).',
        },
        {
          q: 'Un configurateur de voiture où le client choisit ses options avant la fabrication relève plutôt du…',
          choices: ['MTS', 'Flux poussé', 'MTO / ATO', 'Stock de sécurité'],
          answer: 2,
          explain: 'La voiture est fabriquée ou assemblée après la commande : c\'est du MTO ou de l\'ATO, donc du flux tiré.',
        },
        {
          q: 'Le point de découplage, c\'est…',
          choices: [
            'Le moment où le client paie',
            'La frontière entre production sur prévision et production sur commande',
            "L'entrepôt le plus proche du client",
            'Le fournisseur principal',
          ],
          answer: 1,
          explain: 'En amont du point de découplage on travaille sur prévision (poussé), en aval sur commande (tiré).',
        },
        {
          q: 'Principal risque du flux poussé ?',
          choices: ['Un délai client trop long', 'Le surstock et les invendus', 'Trop de commandes', 'Aucun risque'],
          answer: 1,
          explain: 'Si la prévision est trop haute, on se retrouve avec du stock qu\'on ne vend pas.',
        },
      ],
    },
  ],
}
