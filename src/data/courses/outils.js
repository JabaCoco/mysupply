export default {
  id: 'outils',
  title: 'Outils et tendances',
  short: 'Outils',
  icon: 'cpu',
  color: 'fuchsia',
  lessons: [
    {
      id: 'erp-wms-tms',
      title: 'ERP, WMS, TMS : les logiciels clés',
      minutes: 4,
      cards: [
        {
          type: 'list',
          title: 'Les grands logiciels',
          items: [
            ['ERP', "Progiciel de gestion intégré : achats, stocks, production, ventes, comptabilité dans un seul système. Ex. SAP, Oracle, Microsoft Dynamics."],
            ['WMS', "Gestion d'entrepôt : emplacements, réception, préparation, expédition."],
            ['TMS', 'Gestion du transport : choix des transporteurs, tournées, suivi des livraisons, factures de transport.'],
            ['APS', 'Planification avancée : optimise les plans de production et d\'approvisionnement sous contraintes.'],
          ],
        },
        {
          type: 'text',
          title: "L'ERP au centre",
          body:
            "L'**ERP** est la colonne vertébrale : il contient les **données de référence** (articles, clients, fournisseurs) et les **transactions** (commandes, factures).\n\nLe WMS, le TMS et l'APS s'y **connectent** pour échanger les informations en temps réel.",
        },
        {
          type: 'example',
          title: 'Une commande, quatre logiciels',
          body:
            "Un client commande → l'**ERP** crée la commande et vérifie le stock → l'**APS** a planifié la production → le **WMS** lance la préparation dans l'entrepôt → le **TMS** choisit le transporteur et suit la livraison → l'**ERP** facture.",
        },
        {
          type: 'key',
          points: [
            'ERP = gestion intégrée de toute l\'entreprise.',
            'WMS = entrepôt ; TMS = transport ; APS = planification.',
            'Tous échangent leurs données avec l\'ERP.',
          ],
        },
      ],
      quiz: [
        {
          q: 'Quel logiciel choisit les transporteurs et suit les livraisons ?',
          choices: ['WMS', 'TMS', 'CRM', 'APS'],
          answer: 1,
          explain: 'TMS = Transport Management System.',
        },
        {
          q: 'SAP est surtout connu comme éditeur de…',
          choices: ['WMS', 'ERP', 'Camions', 'Robots'],
          answer: 1,
          explain: "SAP est le leader mondial des ERP (progiciels de gestion intégrés).",
        },
        {
          q: 'Quel logiciel gère les emplacements et la préparation dans un entrepôt ?',
          choices: ['ERP', 'TMS', 'WMS', 'Excel uniquement'],
          answer: 2,
          explain: 'WMS = Warehouse Management System.',
        },
        {
          q: "Le rôle principal d'un APS est de…",
          choices: ['Facturer les clients', 'Optimiser la planification sous contraintes', 'Gérer la paie', 'Conduire les chariots'],
          answer: 1,
          explain: 'APS = Advanced Planning and Scheduling : il optimise les plans de production et d\'approvisionnement.',
        },
      ],
    },
    {
      id: 'lean',
      title: 'Le Lean et ses outils',
      minutes: 5,
      cards: [
        {
          type: 'text',
          title: "D'où vient le Lean ?",
          body:
            "Le **Lean** vient du **système de production Toyota** (TPS). Son idée : **éliminer tout ce qui n'apporte pas de valeur au client**, c'est-à-dire les **gaspillages** (en japonais, **muda**).",
        },
        {
          type: 'list',
          title: 'Les 7 gaspillages',
          items: [
            ['Surproduction', 'Produire plus ou plus tôt que nécessaire.'],
            ['Attentes', 'Personnes ou machines inactives.'],
            ['Transports inutiles', 'Déplacer les produits sans valeur ajoutée.'],
            ['Traitements inutiles', 'Faire plus que ce que le client demande.'],
            ['Stocks', 'Excès de matières ou de produits.'],
            ['Mouvements inutiles', 'Gestes et déplacements des opérateurs.'],
            ['Défauts', 'Rebuts et retouches.'],
          ],
        },
        {
          type: 'list',
          title: 'Quelques outils',
          items: [
            ['Juste-à-temps', 'Produire ou livrer exactement ce qu\'il faut, quand il faut.'],
            ['Kanban', 'Étiquettes ou cartes qui déclenchent la production quand un bac est vide : du flux tiré.'],
            ['5S', 'Trier, ranger, nettoyer, standardiser, maintenir : un poste de travail organisé.'],
            ['Kaizen', 'Amélioration continue, par petits pas, avec les équipes.'],
          ],
        },
        {
          type: 'example',
          title: 'Kanban en pratique',
          body:
            "Sur une ligne d'assemblage, chaque bac de vis porte une carte. Quand le bac est vide, la carte part au magasin, qui renvoie un bac plein. On ne réapprovisionne **que ce qui a été consommé**.",
        },
        {
          type: 'key',
          points: [
            'Lean = chasse aux gaspillages (muda), issue de Toyota.',
            '7 gaspillages, dont la surproduction et les stocks.',
            'Outils : juste-à-temps, Kanban, 5S, Kaizen.',
          ],
        },
      ],
      quiz: [
        {
          q: 'Le Lean est né chez…',
          choices: ['Ford', 'Toyota', 'Amazon', 'IKEA'],
          answer: 1,
          explain: 'Le Lean est issu du Toyota Production System, développé notamment par Taiichi Ohno.',
        },
        {
          q: 'Lequel de ces éléments est un des 7 gaspillages ?',
          choices: ['La surproduction', 'La formation', 'La qualité', 'La satisfaction client'],
          answer: 0,
          explain: 'Produire trop ou trop tôt est souvent considéré comme le pire gaspillage : il en génère d\'autres (stocks, transports…).',
        },
        {
          q: 'Le Kanban est un outil de…',
          choices: ['Flux poussé', 'Flux tiré', 'Comptabilité', 'Recrutement'],
          answer: 1,
          explain: 'La consommation réelle déclenche le réapprovisionnement : c\'est du flux tiré.',
        },
        {
          q: 'Les 5S servent à…',
          choices: ['Organiser et maintenir un poste de travail propre et efficace', 'Choisir des fournisseurs', 'Calculer un stock de sécurité', 'Négocier les prix'],
          answer: 0,
          explain: 'Trier, ranger, nettoyer, standardiser, maintenir : la base d\'un poste efficace.',
        },
      ],
    },
    {
      id: 'ia',
      title: "L'IA dans la supply chain",
      minutes: 4,
      cards: [
        {
          type: 'list',
          title: "Où l'IA est déjà utilisée",
          items: [
            ['Prévision de la demande', "Des modèles de machine learning combinent l'historique, la météo, les promos, les événements…"],
            ['Optimisation des tournées', 'Calcul des meilleurs itinéraires en temps réel selon le trafic.'],
            ['Entrepôts', 'Robots mobiles, vision par ordinateur pour contrôler les colis.'],
            ['Achats', 'Analyse automatique des contrats, des factures et des risques fournisseurs.'],
            ['Agents IA', 'Assistants capables de traiter des commandes, réserver du fret ou répondre aux clients.'],
          ],
        },
        {
          type: 'text',
          title: 'Ce que ça change',
          body:
            "L'IA permet de **détecter plus tôt** les risques (retard, pénurie) et de **décider plus vite**, en analysant beaucoup plus de données qu'un humain.\n\nMais elle dépend de la **qualité des données** : avec des données fausses, l'IA donne des résultats faux.",
        },
        {
          type: 'list',
          title: 'Les limites',
          items: [
            ['Données', 'Il faut des données propres, complètes et à jour.'],
            ['Explicabilité', 'Il faut pouvoir comprendre pourquoi l\'IA propose une décision.'],
            ['Humain', "Le supply chain manager reste responsable : l'IA aide à décider, elle ne remplace pas le jugement."],
          ],
        },
        {
          type: 'key',
          points: [
            "L'IA sert à prévoir, optimiser, automatiser et détecter les risques.",
            'Sa qualité dépend de celle des données.',
            "L'humain garde la décision finale.",
          ],
        },
      ],
      quiz: [
        {
          q: "Laquelle de ces applications relève de l'IA en supply chain ?",
          choices: ['Un stock de sécurité fixe', 'Une prévision intégrant la météo et les promos', 'Un bon de commande papier', 'Un chariot élévateur manuel'],
          answer: 1,
          explain: 'Le machine learning combine de nombreuses variables pour affiner la prévision.',
        },
        {
          q: "Quelle est la principale condition pour qu'une IA soit fiable ?",
          choices: ['Un bel écran', 'Des données de qualité', 'Beaucoup de salariés', 'Un entrepôt neuf'],
          answer: 1,
          explain: 'Une IA entraînée sur des données fausses ou incomplètes produit des résultats faux.',
        },
        {
          q: "Un agent IA qui réserve automatiquement du fret est un exemple…",
          choices: ["D'automatisation de tâches", 'De Lean', "D'Incoterm", 'De 5S'],
          answer: 0,
          explain: 'Les agents IA prennent en charge des tâches répétitives comme la réservation de transport.',
        },
        {
          q: 'Qui reste responsable des décisions ?',
          choices: ["L'IA", 'Le supply chain manager', 'Le fournisseur', 'Personne'],
          answer: 1,
          explain: "L'IA est une aide à la décision ; l'humain garde la responsabilité.",
        },
      ],
    },
  ],
}
