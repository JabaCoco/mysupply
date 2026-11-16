export default {
  id: 'transport',
  title: 'Transport et logistique internationale',
  short: 'Transport',
  icon: 'truck',
  color: 'emerald',
  lessons: [
    {
      id: 'modes',
      title: 'Les modes de transport',
      minutes: 5,
      cards: [
        {
          type: 'list',
          title: 'Les 5 grands modes',
          items: [
            ['Routier', 'Souple et porte-à-porte. Le plus utilisé pour les distances courtes et moyennes.'],
            ['Maritime', 'Très grands volumes à faible coût, mais lent. Environ 80 % du commerce mondial en volume.'],
            ['Aérien', 'Très rapide mais cher. Peu de volume, mais environ un tiers de la valeur du commerce mondial.'],
            ['Ferroviaire', 'Massifié et moins émetteur de CO₂, mais dépend des voies et des horaires.'],
            ['Fluvial', 'Très bon marché pour les pondéreux (céréales, sable), mais lent et limité aux voies navigables.'],
          ],
        },
        {
          type: 'list',
          title: 'Comment choisir ?',
          items: [
            ['Coût', 'Maritime et fluvial < ferroviaire < routier < aérien.'],
            ['Délai', "L'aérien est le plus rapide, le maritime le plus lent (4 à 6 semaines Asie → Europe)."],
            ['Nature du produit', 'Valeur, poids, volume, fragilité, périssable ou non.'],
            ['Environnement', "L'aérien émet beaucoup plus de CO₂ par tonne-km que le train ou le bateau."],
          ],
        },
        {
          type: 'text',
          title: 'Le transport multimodal',
          body:
            "On combine souvent plusieurs modes : bateau jusqu'au port, puis train ou camion jusqu'à l'entrepôt.\n\nOn parle de transport **intermodal** quand la marchandise reste dans la **même unité de chargement** (le conteneur) tout le long du trajet.",
        },
        {
          type: 'example',
          title: 'Exemple : des smartphones',
          body:
            "Un nouveau smartphone est souvent envoyé **par avion** au lancement : il a beaucoup de valeur et peu de poids. Les coques et accessoires, eux, partent **par bateau** : ils sont moins chers et moins urgents.",
        },
        {
          type: 'key',
          points: [
            'Maritime = volume et faible coût ; aérien = vitesse et valeur.',
            'On choisit selon le coût, le délai, le produit et le CO₂.',
            'Intermodal = même conteneur sur plusieurs modes.',
          ],
        },
      ],
      quiz: [
        {
          q: 'Quel mode transporte la grande majorité du commerce mondial en volume ?',
          choices: ['Aérien', 'Routier', 'Maritime', 'Ferroviaire'],
          answer: 2,
          explain: 'Environ 80 % du commerce mondial en volume voyage par la mer, grâce aux énormes capacités des navires.',
        },
        {
          q: 'Pour livrer en urgence des médicaments de grande valeur à l\'autre bout du monde, on choisit…',
          choices: ['Le fluvial', 'L\'aérien', 'Le maritime', 'Le ferroviaire'],
          answer: 1,
          explain: 'Produit urgent, léger et de grande valeur : l\'aérien justifie son coût élevé.',
        },
        {
          q: 'Le transport intermodal se caractérise par…',
          choices: [
            'Un seul mode de transport',
            'La même unité de chargement sur plusieurs modes',
            'Un transport uniquement par avion',
            'Un transport sans emballage',
          ],
          answer: 1,
          explain: 'Le conteneur passe du bateau au train puis au camion sans que la marchandise soit manipulée.',
        },
        {
          q: 'Quel mode est le moins cher pour transporter du sable sur une rivière ?',
          choices: ['Aérien', 'Routier', 'Fluvial', 'Express'],
          answer: 2,
          explain: 'Le fluvial est idéal pour les pondéreux (lourds et peu chers) quand une voie navigable existe.',
        },
      ],
    },
    {
      id: 'incoterms',
      title: 'Les Incoterms 2020',
      minutes: 6,
      cards: [
        {
          type: 'text',
          title: "À quoi servent-ils ?",
          body:
            "Les **Incoterms** (International Commercial Terms) sont des règles publiées par la Chambre de commerce internationale. Ils précisent, entre un vendeur et un acheteur :\n\n• **qui paie** quoi (transport, assurance, douane) ;\n• **où et quand** le **risque** passe du vendeur à l'acheteur.\n\nLa version en vigueur, **Incoterms 2020**, compte **11 règles**.",
        },
        {
          type: 'list',
          title: 'Les règles à connaître',
          items: [
            ['EXW — Ex Works', "Le vendeur met la marchandise à disposition dans ses locaux. L'acheteur fait tout le reste : obligation minimale du vendeur."],
            ['FCA — Free Carrier', 'Le vendeur remet la marchandise, dédouanée export, au transporteur choisi par l\'acheteur.'],
            ['FOB — Free On Board', 'Maritime : le risque passe quand la marchandise est à bord du navire, au port de départ.'],
            ['CIF — Cost, Insurance & Freight', 'Maritime : le vendeur paie le fret et l\'assurance jusqu\'au port d\'arrivée, mais le risque passe dès le chargement au départ.'],
            ['DAP — Delivered At Place', 'Le vendeur livre au lieu convenu, sans payer les droits d\'importation.'],
            ['DDP — Delivered Duty Paid', 'Le vendeur paie tout, droits d\'importation compris : obligation maximale du vendeur.'],
          ],
        },
        {
          type: 'text',
          title: 'Maritimes ou tous modes ?',
          body:
            "**4 règles** sont réservées au transport maritime et fluvial : **FAS, FOB, CFR et CIF**.\n\nLes **7 autres** valent pour tous les modes : **EXW, FCA, CPT, CIP, DAP, DPU et DDP**.\n\nPour un conteneur, la CCI recommande plutôt **FCA** que FOB.",
        },
        {
          type: 'example',
          title: 'Le piège du CIF',
          body:
            "Avec le **CIF**, le vendeur paie le transport jusqu'au port d'arrivée… mais si le navire coule en route, c'est **l'acheteur** qui supporte le risque : il l'a pris dès le chargement au départ. Il sera indemnisé par l'assurance prise par le vendeur.\n\nCoût et risque ne se transfèrent donc pas forcément au même endroit.",
        },
        {
          type: 'key',
          points: [
            '11 Incoterms 2020 : qui paie quoi et où le risque change de main.',
            'EXW = minimum pour le vendeur ; DDP = maximum.',
            'FOB, CFR, CIF, FAS : uniquement maritime et fluvial.',
            'En CIF, le risque passe au départ, même si le vendeur paie jusqu\'à l\'arrivée.',
          ],
        },
      ],
      quiz: [
        {
          q: "Quel Incoterm impose le moins d'obligations au vendeur ?",
          choices: ['DDP', 'CIF', 'EXW', 'DAP'],
          answer: 2,
          explain: "En EXW, le vendeur met simplement la marchandise à disposition chez lui. L'acheteur gère tout le reste.",
        },
        {
          q: 'En FOB, le risque passe à l\'acheteur…',
          choices: [
            "À l'usine du vendeur",
            'Quand la marchandise est à bord du navire au port de départ',
            "Au port d'arrivée",
            "Chez l'acheteur",
          ],
          answer: 1,
          explain: 'FOB = Free On Board : dès que la marchandise est à bord du navire au port de départ.',
        },
        {
          q: 'Lequel de ces Incoterms est réservé au transport maritime ?',
          choices: ['FCA', 'DAP', 'CIF', 'DDP'],
          answer: 2,
          explain: 'FAS, FOB, CFR et CIF sont les 4 Incoterms maritimes. FCA, DAP et DDP valent pour tous les modes.',
        },
        {
          q: 'Avec DDP, qui paie les droits de douane à l\'importation ?',
          choices: ['Le vendeur', "L'acheteur", 'Le transporteur', 'Personne'],
          answer: 0,
          explain: 'DDP = Delivered Duty Paid : le vendeur livre « droits payés ». C\'est l\'obligation maximale pour lui.',
        },
      ],
    },
    {
      id: '3pl',
      title: "Le 3PL, c'est quoi ?",
      minutes: 4,
      cards: [
        {
          type: 'text',
          title: 'Externaliser sa logistique',
          body:
            "Beaucoup d'entreprises confient tout ou partie de leur logistique à des spécialistes. On classe ces prestataires par niveaux : **1PL, 2PL, 3PL, 4PL**.\n\n« PL » veut dire **Party Logistics**.",
        },
        {
          type: 'list',
          title: 'Les niveaux',
          items: [
            ['1PL', "L'entreprise fait tout elle-même, avec ses propres camions et entrepôts."],
            ['2PL', 'Elle confie seulement le transport à un transporteur.'],
            ['3PL', 'Elle confie plusieurs opérations à un prestataire : transport, entreposage, préparation de commandes, parfois douane.'],
            ['4PL', "Un « chef d'orchestre » pilote toute la chaîne et coordonne plusieurs 3PL, souvent sans posséder d'entrepôts ni de camions."],
          ],
        },
        {
          type: 'example',
          title: 'Exemples',
          body:
            "**DHL Supply Chain**, **GXO** ou **ID Logistics** sont des 3PL : ils gèrent des entrepôts et préparent les commandes pour des marques comme des e-commerçants.\n\nUne entreprise qui confie à un 4PL la gestion de tous ses prestataires lui délègue le **pilotage** de sa supply chain.",
        },
        {
          type: 'list',
          title: 'Pourquoi externaliser ?',
          items: [
            ['Avantages', 'Se concentrer sur son cœur de métier, profiter de l\'expertise et des outils du prestataire, transformer des coûts fixes en coûts variables.'],
            ['Risques', 'Dépendance au prestataire, perte de savoir-faire, besoin de bien piloter le contrat avec des KPI.'],
          ],
        },
        {
          type: 'key',
          points: [
            '2PL = transport ; 3PL = plusieurs opérations logistiques.',
            '4PL = pilote et coordonne toute la chaîne.',
            'Externaliser = plus de flexibilité, mais un contrat à piloter.',
          ],
        },
      ],
      quiz: [
        {
          q: 'Une marque confie son entrepôt, la préparation des commandes et les livraisons à un prestataire. C\'est un…',
          choices: ['1PL', '2PL', '3PL', 'Fournisseur'],
          answer: 2,
          explain: 'Plusieurs opérations logistiques confiées à un même prestataire : c\'est un 3PL.',
        },
        {
          q: 'Le rôle principal d\'un 4PL est de…',
          choices: [
            'Conduire les camions',
            'Coordonner et piloter plusieurs prestataires',
            'Fabriquer les produits',
            'Vendre en magasin',
          ],
          answer: 1,
          explain: "Le 4PL est un chef d'orchestre : il pilote la chaîne et coordonne les 3PL.",
        },
        {
          q: 'Un risque de l\'externalisation logistique est…',
          choices: [
            'La transformation de coûts fixes en coûts variables',
            "L'accès à l'expertise du prestataire",
            'La dépendance envers le prestataire',
            'Le recentrage sur le cœur de métier',
          ],
          answer: 2,
          explain: 'Les trois autres réponses sont des avantages. La dépendance (et la perte de savoir-faire) est le principal risque.',
        },
        {
          q: 'Une entreprise qui ne confie que le transport à une société extérieure travaille avec un…',
          choices: ['2PL', '3PL', '4PL', '5PL'],
          answer: 0,
          explain: 'Le 2PL est un transporteur : il ne gère que le transport.',
        },
      ],
    },
  ],
}
