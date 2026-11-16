// Lot 1 — Bases (Fondamentaux) : 3 leçons ajoutées + questions supplémentaires pour les 2 leçons existantes.
export default {
  more: {
    definition: [
      {
        q: "Dans une chaîne classique, dans quel sens circulent les marchandises ?",
        choices: ["Du fournisseur vers le client", "Du client vers le fournisseur", "Dans les deux sens, à parts égales", "Uniquement entre deux entrepôts"],
        answer: 0,
        explain: "Le flux physique descend de l'amont (fournisseurs) vers l'aval (clients). Les commandes et les paiements remontent, eux, vers l'amont.",
      },
      {
        q: "Un virement pour payer un fournisseur est un flux…",
        choices: ["financier", "physique", "d'information", "de transport"],
        answer: 0,
        explain: "L'argent qui circule entre les acteurs est un flux financier. Le virement n'est pas une marchandise, c'est un paiement.",
      },
      {
        q: "La règle des « 5 B » consiste à livrer…",
        choices: [
          "le bon produit, en bonne quantité, au bon endroit, au bon moment, au bon coût",
          "le produit le plus récent, en grande quantité, partout, dans les plus brefs délais",
          "le produit le plus rentable, au meilleur prix de vente, à tous les clients à la fois",
          "toujours le même produit, quelle que soit la demande des clients du moment",
        ],
        answer: 0,
        explain: "Les 5 B résument l'objectif du supply chain manager : servir le client avec le bon produit, la bonne quantité, au bon lieu, au bon moment et au bon coût.",
      },
      {
        q: "Que désigne le « supply chain management » ?",
        choices: ["Piloter les flux de l'amont à l'aval", "Gérer uniquement les stocks des entrepôts", "Fabriquer les produits en usine", "Négocier les prix de vente aux clients"],
        answer: 0,
        explain: "Le supply chain management consiste à piloter l'ensemble des flux (physiques, d'information, financiers), des fournisseurs jusqu'aux clients.",
      },
      {
        q: "Pourquoi parle-t-on de « chaîne » ?",
        choices: [
          "Un problème à un maillon se répercute sur les autres",
          "Parce que tous les acteurs appartiennent à la même entreprise",
          "Parce que les produits sont vendus par lots de dix",
          "Parce que les camions circulent toujours en convoi",
        ],
        answer: 0,
        explain: "Chaque maillon dépend des autres : une panne chez un fournisseur finit par toucher l'usine, l'entrepôt puis le client.",
      },
    ],
    "flux-pousses-tires": [
      {
        q: "Un fabricant de mobilier sur mesure qui lance la fabrication après la commande du client relève du…",
        choices: ["MTO (Make to Order)", "MTS (Make to Stock)", "flux poussé pur", "cross-docking"],
        answer: 0,
        explain: "Fabriquer après la commande du client, c'est du MTO : un flux tiré, avec un délai plus long mais sans produit fini invendu.",
      },
      {
        q: "En ETO (Engineer to Order), le produit est…",
        choices: ["conçu puis fabriqué pour un client précis", "fabriqué en grande série pour le stock", "assemblé à partir de composants stockés", "acheté tout fait auprès d'un grossiste puis revendu"],
        answer: 0,
        explain: "L'ETO s'applique aux produits uniques, comme un paquebot ou une usine : la conception elle-même démarre après la commande.",
      },
      {
        q: "Plus le point de découplage est proche du client (aval), plus…",
        choices: ["le délai de livraison est court, mais le stock est élevé", "le délai de livraison est long, mais le stock est faible", "le coût de transport baisse automatiquement", "la prévision de la demande devient inutile"],
        answer: 0,
        explain: "Si l'on prépare les produits très près du client, on livre vite, mais il faut stocker davantage et on prend plus de risque d'invendus.",
      },
      {
        q: "Quel est l'avantage principal d'un flux tiré ?",
        choices: ["Peu de stock et peu d'invendus", "Une livraison instantanée", "Des prévisions toujours exactes", "Des coûts de transport nuls"],
        answer: 0,
        explain: "On ne produit que ce qui est commandé : le stock et les invendus restent limités, en échange d'un délai à accepter.",
      },
      {
        q: "Une usine produit de la lessive en grande série pour réapprovisionner des entrepôts. Quel mode de production ?",
        choices: ["MTS (Make to Stock)", "MTO (Make to Order)", "ETO (Engineer to Order)", "ATO (Assemble to Order)"],
        answer: 0,
        explain: "Produit standard, demande régulière, fabrication sur prévision pour le stock : c'est du MTS, donc un flux poussé.",
      },
    ],
  },

  lessons: [
    {
      id: "acteurs",
      title: "Les maillons et les acteurs",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Les maillons de la chaîne",
          body: "Un produit traverse plusieurs maillons : l'**approvisionnement** en matières, la **production**, le **stockage**, la **distribution** (transport) puis la **vente** au client.\n\nS'ajoute un maillon souvent oublié : les **retours** (produits renvoyés, recyclés), qu'on appelle la **logistique inverse**.",
        },
        {
          type: "list",
          title: "Les acteurs principaux",
          items: [
            ["Fournisseurs", "Ils livrent les matières, les composants ou les produits."],
            ["Fabricant (industriel)", "Il transforme ou assemble pour obtenir le produit fini."],
            ["Grossiste / distributeur", "Il achète en grandes quantités et revend aux détaillants."],
            ["Détaillant", "Il vend au consommateur final, en magasin ou en ligne."],
            ["Prestataires logistiques", "Transporteur, entrepositaire, transitaire : ils assurent transport, stockage et formalités."],
            ["Client final", "Celui qui utilise le produit : toute la chaîne travaille pour lui."],
          ],
        },
        {
          type: "list",
          title: "Les rangs de fournisseurs",
          items: [
            ["Rang 1", "Fournit directement l'entreprise."],
            ["Rang 2", "Fournit le fournisseur de rang 1 : le fournisseur de ton fournisseur."],
            ["Rang 3 et plus", "Matières premières, composants de base : souvent loin et peu visibles."],
            ["Le « client du client »", "Il se situe en aval, jusqu'au consommateur final."],
          ],
        },
        {
          type: "example",
          title: "Exemple : un smartphone",
          body: "Un smartphone réunit des centaines de composants venus de nombreux fournisseurs et de plusieurs pays : écran, puce, batterie, métaux… Il est assemblé dans une usine, expédié par bateau ou par avion, stocké dans des entrepôts, puis vendu en magasin ou en ligne.\n\nPlus la chaîne est longue et complexe, plus **un seul maillon en panne** peut tout bloquer.",
        },
        {
          type: "text",
          title: "Logistique ou supply chain ?",
          body: "La **logistique** gère les flux physiques et leurs informations : transport, stockage, préparation de commandes, livraison.\n\nLa **supply chain** a une vision plus large : elle ajoute les **achats**, la **production**, la **planification** et les relations avec tous les partenaires. La logistique est donc une partie de la supply chain.",
        },
        {
          type: "key",
          points: [
            "Maillons : approvisionnement, production, stockage, distribution, vente, retours.",
            "Rang 2 = le fournisseur de ton fournisseur.",
            "Les prestataires logistiques (transporteur, entrepositaire, transitaire) font le lien entre les acteurs.",
            "La logistique est une partie de la supply chain, qui est plus large.",
          ],
        },
      ],
      quiz: [
        {
          q: "Qu'est-ce qu'un fournisseur de rang 2 ?",
          choices: ["Le fournisseur de ton fournisseur direct", "Un fournisseur situé à l'étranger", "Un fournisseur moins cher que les autres", "Le deuxième fournisseur choisi pour une commande"],
          answer: 0,
          explain: "Le rang numérote la distance à l'entreprise : le rang 1 la fournit directement, le rang 2 fournit le rang 1, et ainsi de suite.",
        },
        {
          q: "Le rôle d'un grossiste est de…",
          choices: ["acheter en grandes quantités pour revendre aux détaillants", "vendre directement aux consommateurs, en magasin ou sur internet", "fabriquer les produits à partir des matières premières livrées", "transporter les marchandises d'un entrepôt à un autre"],
          answer: 0,
          explain: "Le grossiste est un intermédiaire : il achète en gros aux fabricants et revend aux détaillants.",
        },
        {
          q: "Quelle affirmation sur la logistique est correcte ?",
          choices: ["C'est une partie de la supply chain", "C'est exactement la même chose que la supply chain", "Elle ne concerne que le transport routier", "Elle s'occupe uniquement des achats"],
          answer: 0,
          explain: "La logistique gère les flux physiques (transport, stockage, livraison). La supply chain est plus large, car elle inclut aussi achats, production et planification.",
        },
        {
          q: "Quel acteur organise le transport et les formalités pour le compte de son client ?",
          choices: ["Le transitaire", "Le grossiste", "Le détaillant", "Le fournisseur de rang 3"],
          answer: 0,
          explain: "Le transitaire réserve le transport, prépare les documents et gère la douane pour son client.",
        },
        {
          q: "Le « client du client » se situe…",
          choices: ["en aval, jusqu'au consommateur final", "en amont, chez les fournisseurs de matières premières", "dans l'entrepôt de l'entreprise, avec les produits en stock", "chez le transporteur qui livre les commandes"],
          answer: 0,
          explain: "L'aval, c'est le côté clients : on suit la chaîne jusqu'à la personne qui utilise le produit.",
        },
        {
          q: "Pourquoi la supply chain d'un smartphone est-elle fragile ?",
          choices: ["Beaucoup de fournisseurs, de pays et d'étapes : une panne bloque tout", "Parce qu'il est vendu à un prix trop élevé pour la plupart des clients", "Parce qu'il n'est fabriqué que dans un seul pays, toujours le même", "Parce qu'il n'a aucun fournisseur de rang 2 pour ses composants"],
          answer: 0,
          explain: "Plus il y a de maillons et de dépendances, plus un incident à un seul endroit peut interrompre toute la chaîne.",
        },
        {
          q: "La logistique inverse concerne…",
          choices: ["les retours de produits, du client vers l'entreprise", "les livraisons express réalisées en moins de vingt-quatre heures", "le transport de nuit, pour éviter les embouteillages", "les commandes passées au fournisseur chaque semaine"],
          answer: 0,
          explain: "La logistique inverse gère les flux dans l'autre sens : produits renvoyés, réparés, recyclés ou remis en vente.",
        },
        {
          q: "Un entrepositaire est…",
          choices: ["un prestataire qui stocke et gère des marchandises pour un client", "un camion de livraison équipé d'un hayon élévateur", "un logiciel de gestion qui suit les commandes des clients", "un fournisseur de matières premières pour les usines"],
          answer: 0,
          explain: "L'entrepositaire loue ses entrepôts et son savoir-faire : réception, stockage, préparation et expédition des commandes.",
        },
        {
          q: "Parmi ces acteurs, lequel se situe en aval d'un fabricant ?",
          choices: ["Le détaillant", "Le fournisseur de composants", "Le fournisseur de rang 2", "Le producteur de matières premières"],
          answer: 0,
          explain: "Le détaillant achète au fabricant (ou au grossiste) pour vendre au consommateur : il est en aval. Les autres sont en amont.",
        },
      ],
    },

    {
      id: "histoire",
      title: "Une brève histoire de la supply chain",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Des routes marchandes à l'usine",
          body: "Les échanges de marchandises existent depuis l'Antiquité : routes de la soie, ports, caravanes. Mais la **supply chain moderne** naît avec l'industrie : machines, trains, usines, puis production en grande série.\n\nAu fil du temps, trois choses changent : la **vitesse** du transport, la **taille** des volumes et la **quantité d'information** disponible.",
        },
        {
          type: "list",
          title: "Les repères à connaître",
          items: [
            ["1913", "Henry Ford introduit la chaîne d'assemblage mobile : la production en grande série fait baisser les coûts."],
            ["Années 1950", "Chez Toyota se développe le système de production qui donnera le Lean et le juste-à-temps."],
            ["1956", "Premier transport de conteneurs modernes (navire Ideal X, de Malcom McLean)."],
            ["1974", "Premier produit scanné par code-barres dans un supermarché américain."],
            ["1982", "L'expression « supply chain management » est popularisée par un consultant."],
            ["2001", "La Chine entre dans l'OMC : les échanges mondiaux s'accélèrent."],
            ["2021", "Un porte-conteneurs bloque le canal de Suez pendant environ six jours."],
          ],
        },
        {
          type: "text",
          title: "Le conteneur change tout",
          body: "Avant le conteneur, chaque marchandise était chargée **à la main** : sacs, caisses, tonneaux. Le chargement d'un navire durait des jours et coûtait cher.\n\nAvec une **boîte standardisée**, on charge et décharge très vite, on passe du bateau au train ou au camion **sans toucher à la marchandise**, et le coût du transport maritime chute. C'est l'une des bases de la mondialisation.",
        },
        {
          type: "text",
          title: "Mondialisation et juste-à-temps",
          body: "À partir des années 1990, de nombreuses entreprises **délocalisent** leur production vers des pays à bas coûts et réduisent leurs stocks grâce au **juste-à-temps**.\n\nRésultat : des chaînes **plus longues, plus économiques… mais plus fragiles**. Une perturbation lointaine (grève, pandémie, blocage d'un canal) se ressent vite chez le client.",
        },
        {
          type: "example",
          title: "2021 : un navire bloque le canal de Suez",
          body: "En mars 2021, le porte-conteneurs **Ever Given** s'échoue en travers du canal de Suez. Environ **12 %** du commerce mondial passe par ce canal : des centaines de navires attendent, et des retards se propagent dans le monde entier.\n\nCet épisode a rappelé qu'un **point de passage unique** peut perturber toute une chaîne.",
        },
        {
          type: "key",
          points: [
            "1913 Ford (grande série) → 1956 conteneur → 1974 code-barres → 2001 Chine à l'OMC → 2021 blocage de Suez.",
            "Le conteneur standardisé a fait chuter le coût et la durée du transport maritime.",
            "Juste-à-temps et délocalisation : moins cher, mais plus fragile.",
          ],
        },
      ],
      quiz: [
        {
          q: "Quel événement de 1956 a profondément changé le transport de marchandises ?",
          choices: ["Le premier transport de conteneurs standardisés", "La mise en service du premier camion frigorifique", "L'ouverture du canal de Suez au trafic maritime", "La création du premier système de code-barres"],
          answer: 0,
          explain: "Le navire Ideal X, qui transporte des conteneurs de Newark à Houston en 1956, ouvre l'ère du conteneur standardisé.",
        },
        {
          q: "Le système de production de Toyota est à l'origine…",
          choices: ["du Lean et du juste-à-temps", "du code-barres", "du conteneur maritime", "de la chaîne d'assemblage mobile"],
          answer: 0,
          explain: "Toyota a développé dès les années 1950 des méthodes (juste-à-temps, élimination des gaspillages) qui ont donné le Lean.",
        },
        {
          q: "À quoi sert surtout le code-barres en supply chain ?",
          choices: ["Identifier rapidement les produits et suivre les stocks", "Calculer automatiquement le prix du transport de chaque colis", "Remplacer les factures papier envoyées aux clients", "Mesurer le poids des colis à la sortie de l'entrepôt"],
          answer: 0,
          explain: "Un code-barres identifie un article en une seconde : il rend possibles les caisses automatiques et le suivi des stocks.",
        },
        {
          q: "Le juste-à-temps permet de réduire les stocks, mais…",
          choices: ["rend la chaîne plus sensible aux perturbations", "supprime tout besoin de prévision de la demande", "augmente toujours les coûts de production de l'usine", "oblige à fabriquer sur place, près de chaque client"],
          answer: 0,
          explain: "Avec peu de stock, il n'y a presque plus de marge : un retard fournisseur se répercute immédiatement.",
        },
        {
          q: "Le blocage du canal de Suez en 2021 montre que…",
          choices: ["un point de passage unique peut perturber le commerce mondial", "le transport maritime est devenu inutile pour les entreprises", "les conteneurs sont devenus trop petits pour les navires", "le transport aérien est toujours plus sûr que la mer"],
          answer: 0,
          explain: "Une part importante des échanges passe par quelques passages stratégiques : quand l'un est bloqué, les retards se propagent partout.",
        },
        {
          q: "Avec la chaîne d'assemblage de Ford (1913), l'objectif était de…",
          choices: ["produire en grande série à moindre coût", "livrer plus vite aux clients dans tout le pays", "réduire le nombre de fournisseurs de l'usine", "supprimer tous les entrepôts de l'entreprise"],
          answer: 0,
          explain: "L'assemblage à la chaîne a permis de produire des volumes importants, ce qui a fait baisser le prix unitaire de chaque voiture.",
        },
        {
          q: "La mondialisation des années 1990-2000 s'accompagne souvent…",
          choices: ["de délocalisations vers des pays à bas coûts", "de la fermeture de tous les grands ports du monde", "d'un retour de tous les stocks directement en usine", "d'une forte baisse des échanges internationaux"],
          answer: 0,
          explain: "Pour réduire leurs coûts, beaucoup d'entreprises ont délocalisé leur production, ce qui a allongé les chaînes d'approvisionnement.",
        },
        {
          q: "Quel ordre est chronologique ?",
          choices: [
            "Chaîne Ford (1913), conteneur (1956), code-barres (1974), blocage de Suez (2021)",
            "Conteneur (1956), chaîne Ford (1913), blocage de Suez (2021), code-barres (1974)",
            "Code-barres (1974), chaîne Ford (1913), conteneur (1956), blocage de Suez (2021)",
            "Chaîne Ford (1913), code-barres (1974), blocage de Suez (2021), conteneur (1956)",
          ],
          answer: 0,
          explain: "1913 pour la chaîne d'assemblage mobile de Ford, 1956 pour le conteneur, 1974 pour le premier code-barres scanné, 2021 pour le blocage de Suez.",
        },
      ],
    },

    {
      id: "metiers",
      title: "Les métiers de la supply chain",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Une filière aux métiers variés",
          body: "La supply chain recrute à tous les niveaux, du BTS au Master : **achats**, **planification**, **production**, **transport**, **entrepôt**, **e-commerce**, **données**…\n\nCes métiers ont un point commun : il faut **coordonner** des acteurs différents et réagir vite quand un imprévu arrive.",
        },
        {
          type: "list",
          title: "Quelques métiers clés",
          items: [
            ["Acheteur", "Cherche des fournisseurs, négocie les prix et les contrats (approche stratégique)."],
            ["Approvisionneur", "Passe les commandes au quotidien, suit les livraisons, évite les ruptures."],
            ["Planificateur", "Prépare les prévisions et les plans de production ou d'approvisionnement."],
            ["Responsable d'entrepôt", "Organise les équipes, les flux et la sécurité de l'entrepôt."],
            ["Responsable transport", "Choisit les transporteurs, pilote les tournées et les coûts."],
            ["Analyste de données", "Exploite les données pour suivre les indicateurs et détecter les anomalies."],
          ],
        },
        {
          type: "list",
          title: "Où travailler ?",
          items: [
            ["Industrie", "Usines : achats, planification, logistique de production."],
            ["Distribution et e-commerce", "Magasins, plateformes de vente en ligne, entrepôts de préparation."],
            ["Prestataires logistiques (3PL)", "Entreprises qui gèrent la logistique de leurs clients."],
            ["Conseil et éditeurs de logiciels", "Accompagnent les entreprises dans leurs projets."],
          ],
        },
        {
          type: "text",
          title: "Les compétences recherchées",
          body: "**Rigueur** (les erreurs coûtent cher), **Excel** et outils de gestion (ERP, WMS), **anglais** (fournisseurs et transporteurs internationaux), **communication**, **résolution de problèmes** et **gestion de l'urgence**.\n\nLes entreprises apprécient aussi la capacité à **chiffrer** : savoir expliquer une décision avec des données.",
        },
        {
          type: "example",
          title: "Une journée d'approvisionneur",
          body: "Le matin : il vérifie les stocks et les commandes en retard. Il relance un fournisseur dont la livraison est en retard, puis lance les commandes de la journée. L'après-midi : un client passe une grosse commande, il cherche une solution pour éviter la rupture.\n\nUn métier opérationnel, rythmé par les **urgences** et les **chiffres**.",
        },
        {
          type: "key",
          points: [
            "Acheteur = stratégique ; approvisionneur = commandes quotidiennes ; planificateur = prévisions et plans.",
            "On travaille dans l'industrie, la distribution, chez les prestataires logistiques ou dans le conseil.",
            "Rigueur, Excel, ERP, anglais et sens de l'urgence sont très demandés.",
          ],
        },
      ],
      quiz: [
        {
          q: "Quel métier passe les commandes courantes et suit les livraisons ?",
          choices: ["L'approvisionneur", "Le planificateur", "L'analyste de données", "Le responsable qualité"],
          answer: 0,
          explain: "L'approvisionneur gère le quotidien : commandes, relances et suivi des livraisons pour éviter les ruptures.",
        },
        {
          q: "Quel métier prépare les prévisions et les plans d'approvisionnement ?",
          choices: ["Le planificateur", "Le cariste de l'entrepôt", "Le transitaire de fret", "Le détaillant du magasin"],
          answer: 0,
          explain: "Le planificateur anticipe la demande et organise la production et les achats pour y répondre.",
        },
        {
          q: "Le responsable transport…",
          choices: ["choisit les transporteurs et pilote les coûts de transport", "prépare les commandes dans l'entrepôt avec les caristes", "négocie les prix des matières premières avec les fabricants", "conçoit les nouveaux produits de l'entreprise"],
          answer: 0,
          explain: "Il sélectionne les transporteurs, organise les tournées et surveille les coûts et les délais de transport.",
        },
        {
          q: "Parmi ces entreprises, laquelle est un prestataire logistique (3PL) ?",
          choices: ["Une société qui gère l'entrepôt et les livraisons de ses clients", "Un fabricant de chaussures de sport et de ville", "Une banque qui finance les entreprises de transport", "Un journal en ligne spécialisé dans l'économie"],
          answer: 0,
          explain: "Un 3PL prend en charge tout ou partie de la logistique de ses clients : entreposage, préparation de commandes, transport.",
        },
        {
          q: "En quoi l'acheteur se distingue-t-il de l'approvisionneur ?",
          choices: ["Il travaille sur le sourcing et la négociation, de façon plus stratégique", "Il conduit les chariots élévateurs dans l'entrepôt toute la journée", "Il ne parle jamais aux fournisseurs, seulement aux clients", "Il s'occupe uniquement des livraisons aux clients finaux"],
          answer: 0,
          explain: "L'acheteur choisit les fournisseurs et négocie les contrats ; l'approvisionneur passe ensuite les commandes courantes.",
        },
        {
          q: "Quel métier organise les équipes et les flux d'un entrepôt ?",
          choices: ["Le responsable d'entrepôt", "L'acheteur chargé des fournisseurs", "L'analyste financier du siège", "Le responsable marketing et communication"],
          answer: 0,
          explain: "Le responsable d'entrepôt dirige les équipes, organise réception, stockage et expédition, et veille à la sécurité.",
        },
        {
          q: "Pourquoi l'anglais est-il important dans ces métiers ?",
          choices: ["Fournisseurs, transporteurs et documents sont souvent internationaux", "Parce que tous les clients de l'entreprise sont américains", "Parce que tous les camions viennent d'Angleterre", "Il ne sert qu'à la comptabilité et aux contrats"],
          answer: 0,
          explain: "Les échanges avec les fournisseurs, les transporteurs et les douanes, ainsi que beaucoup de documents, se font souvent en anglais.",
        },
        {
          q: "À quoi sert l'analyste de données en supply chain ?",
          choices: ["Exploiter les données pour suivre les indicateurs et détecter les anomalies", "Conduire les camions de livraison sur les routes", "Fabriquer les produits sur les lignes de l'usine", "Remplacer les acheteurs dans toutes leurs tâches"],
          answer: 0,
          explain: "Il transforme les données (stocks, délais, ventes) en indicateurs et en alertes pour aider à décider.",
        },
      ],
    },
  ],
}
