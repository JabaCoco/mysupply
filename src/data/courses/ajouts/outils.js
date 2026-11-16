// Lot 11 — Outils et SI : 5 leçons ajoutées + questions supplémentaires pour les 3 leçons existantes.
import { fmt, int, numQuestion, pick } from '../../gen.js'

export default {
  more: {
    'erp-wms-tms': [
      {
        q: "Quel logiciel suit les réceptions, le rangement et les expéditions d'un entrepôt ?",
        choices: ['Le WMS', 'Le TMS', 'Le logiciel de paie', "Le système de caisse d'un magasin"],
        answer: 0,
        explain: "Le WMS (Warehouse Management System) gère réception, rangement, préparation et expédition.",
      },
      {
        q: "Quel logiciel optimise les tournées et suit les livraisons ?",
        choices: ['Le TMS', 'Le WMS', 'Le tableur de comptabilité', 'Le logiciel de messagerie'],
        answer: 0,
        explain: "Le TMS (Transport Management System) choisit les transporteurs, planifie les tournées et suit les expéditions.",
      },
      {
        q: "Que centralise un ERP ?",
        choices: ['Les données et processus de toute l\'entreprise', 'Uniquement les emplacements de stock', 'Uniquement les tournées de livraison', 'Les photos des produits du catalogue'],
        answer: 0,
        explain: "L'ERP réunit achats, stocks, production, ventes et finance dans une base de données commune.",
      },
      () => {
        const users = int(20, 200, 10)
        const price = int(40, 150, 5)
        return numQuestion({
          q: `Un logiciel WMS est facturé ${price} € par utilisateur et par mois. Pour ${users} utilisateurs, quel est le coût annuel ?`,
          answer: users * price * 12,
          unit: '€',
          digits: 0,
          explain: `${users} × ${price} € × 12 mois = ${fmt(users * price * 12, 0)} €.`,
          wrong: [users * price, users * price * 6, users * 12, (users * price * 12) / 2],
        })
      },
    ],
    lean: [
      {
        q: "Que signifie le lean management ?",
        choices: ['Éliminer les gaspillages pour créer plus de valeur', 'Réduire le personnel au minimum', 'Produire le plus possible en stock', 'Augmenter les contrôles administratifs'],
        answer: 0,
        explain: "Le lean cherche à supprimer tout ce qui n'apporte pas de valeur au client : attentes, stocks inutiles, défauts.",
      },
      {
        q: "Que vise la méthode des 5S ?",
        choices: ['Un poste de travail rangé et propre', 'Une baisse du salaire des équipes', 'Un stock de sécurité plus élevé', 'Un nombre de contrôles doublé'],
        answer: 0,
        explain: "Les 5S (trier, ranger, nettoyer, standardiser, maintenir) organisent le poste pour travailler plus vite et plus sûrement.",
      },
      {
        q: "Qu'est-ce que le muda ?",
        choices: ['Un gaspillage', 'Un indicateur de qualité', 'Un type de machine', 'Une méthode de paiement'],
        answer: 0,
        explain: "Muda signifie gaspillage en japonais : surproduction, attentes, transports inutiles, stocks, défauts…",
      },
      () => {
        const lead = int(8, 20)
        const value = int(1, 4)
        return numQuestion({
          q: `Un produit met ${lead} jours à traverser l'usine, dont ${value} jour${value > 1 ? 's' : ''} de travail réellement utile. Quel est le pourcentage de temps à valeur ajoutée ?`,
          answer: (value / lead) * 100,
          unit: '%',
          digits: 1,
          max: 100,
          explain: `${value} / ${lead} × 100 = ${fmt((value / lead) * 100, 1)} % : le reste est de l'attente.`,
        })
      },
    ],
    ia: [
      {
        q: "À quoi sert l'IA dans la prévision de la demande ?",
        choices: ['À repérer des tendances dans de nombreuses données', 'À remplacer toutes les équipes de vente', 'À fixer le prix de vente sans calcul', 'À supprimer le besoin de données'],
        answer: 0,
        explain: "Les algorithmes détectent des liens (saison, météo, promotions) que les méthodes simples ne voient pas.",
      },
      {
        q: "De quoi dépend la qualité d'un modèle d'IA ?",
        choices: ['De la qualité des données utilisées', 'Du prix du logiciel uniquement', 'De la couleur de l\'interface', 'Du nombre d\'écrans dans le bureau'],
        answer: 0,
        explain: "Avec des données fausses ou incomplètes, même un très bon algorithme produit de mauvais résultats.",
      },
      {
        q: "Quelle tâche logistique l'IA peut-elle améliorer ?",
        choices: ['L\'optimisation des tournées de livraison', 'La signature des contrats par le directeur', 'Le choix de la couleur des cartons', 'L\'embauche de tous les intérimaires'],
        answer: 0,
        explain: "L'optimisation de tournées, la prévision et la détection d'anomalies sont des usages courants.",
      },
      {
        q: "Pourquoi garder un humain dans la boucle ?",
        choices: ['Pour valider les décisions et corriger les erreurs', 'Parce que l\'IA ne travaille jamais seule', 'Pour faire les mêmes calculs à la main', 'Parce que la loi interdit les ordinateurs'],
        answer: 0,
        explain: "Un modèle peut se tromper ou ignorer un contexte : la supervision humaine sécurise les décisions importantes.",
      },
    ],
  },

  lessons: [
    {
      id: 'edi-api',
      title: "L'échange de données : EDI et API",
      minutes: 5,
      cards: [
        {
          type: 'text',
          title: 'Des systèmes qui se parlent',
          body: "Entre un client, un fournisseur et un transporteur, des milliers de messages circulent : commandes, avis d'expédition, factures. Les saisir à la main prend du temps et provoque des erreurs. L'**échange de données informatisé** (EDI) et les **API** permettent aux **systèmes de communiquer directement**.",
        },
        {
          type: 'list',
          title: 'Les messages EDI courants',
          items: [
            ['ORDERS', 'La commande du client.'],
            ['DESADV', "L'avis d'expédition : ce qui est parti, quand, dans quels colis."],
            ['INVOIC', 'La facture.'],
            ['RECADV', 'L\'avis de réception du client.'],
          ],
        },
        {
          type: 'list',
          title: 'EDI et API',
          items: [
            ['EDI', "Messages normalisés (EDIFACT, standard international), échangés en lots, très répandu dans la grande distribution et l'industrie."],
            ['API', "Interface moderne : un système interroge l'autre en temps réel (ex. suivre un colis)."],
            ['Portail web', "Saisie manuelle dans le système du partenaire : simple, mais peu automatisé."],
          ],
        },
        {
          type: 'text',
          title: 'Les bénéfices',
          body: "• **Moins d'erreurs** : plus de ressaisie.\n• **Gain de temps** : une commande traitée en secondes.\n• **Traçabilité** : chaque échange est enregistré.\n• **Délais plus courts** : l'avis d'expédition permet de préparer la réception avant l'arrivée du camion.",
        },
        {
          type: 'key',
          points: [
            "EDI : messages normalisés entre systèmes (commande, avis d'expédition, facture).",
            "API : dialogue en temps réel entre applications.",
            "Avantages : moins d'erreurs, plus de rapidité, traçabilité.",
          ],
        },
      ],
      quiz: [
        () => {
          const orders = int(500, 3000, 100)
          const min = pick([3, 4, 5])
          return numQuestion({
            q: `La saisie manuelle d'une commande prend ${min} minutes. Avec l'EDI, ${fmt(orders)} commandes par mois sont traitées automatiquement. Combien d'heures de saisie sont économisées ?`,
            answer: (orders * min) / 60,
            unit: 'heures',
            digits: 0,
            explain: `${fmt(orders)} × ${min} min = ${fmt(orders * min)} minutes, soit ${fmt((orders * min) / 60, 0)} heures.`,
            wrong: [orders * min, orders / min, (orders * min) / 100, ((orders * min) / 60) * 2],
          })
        },
        () => {
          const errors = pick([2, 3, 4, 5])
          const orders = int(1000, 5000, 500)
          const cost = pick([20, 30, 40])
          return numQuestion({
            q: `${errors} % des ${fmt(orders)} commandes saisies à la main contiennent une erreur, et chaque erreur coûte ${cost} € à corriger. Quel est le coût mensuel des erreurs ?`,
            answer: (orders * errors * cost) / 100,
            unit: '€',
            digits: 0,
            explain: `${fmt(orders)} × ${errors} % = ${fmt((orders * errors) / 100, 0)} erreurs × ${cost} € = ${fmt((orders * errors * cost) / 100, 0)} €.`,
            wrong: [orders * cost, orders * errors, (orders * errors * cost) / 10, (orders * errors) / 100],
          })
        },
        {
          q: 'Que signifie EDI ?',
          choices: ['Échange de données informatisé', 'Entrepôt de distribution internationale', 'Évaluation de la demande interne', 'Équipement de déchargement industriel'],
          answer: 0,
          explain: "L'EDI échange des messages normalisés entre systèmes d'information, sans ressaisie.",
        },
        {
          q: "Que contient un avis d'expédition (DESADV) ?",
          choices: ['Ce qui part, quand et dans quels colis', 'Le prix et les conditions de paiement', 'La facture à payer par le client', 'Le plan de l\'entrepôt de destination'],
          answer: 0,
          explain: "Il prévient le destinataire du contenu de l'envoi : il peut préparer la réception avant l'arrivée du camion.",
        },
        {
          q: 'Quelle est la différence entre une API et le portail web du partenaire ?',
          choices: ["L'API automatise l'échange entre deux systèmes", 'Le portail est plus rapide qu\'une API', 'L\'API oblige à ressaisir toutes les données', 'Il n\'y a aucune différence'],
          answer: 0,
          explain: "Avec une API, les systèmes dialoguent seuls ; sur un portail, une personne saisit les informations.",
        },
        {
          q: 'Quel est un bénéfice de l\'EDI ?',
          choices: ['Moins d\'erreurs de ressaisie', 'Plus de papier à archiver', 'Un délai de commande allongé', 'Des factures saisies deux fois'],
          answer: 0,
          explain: "Les données circulent sans être retapées, ce qui supprime les erreurs de saisie.",
        },
        {
          q: "Pourquoi l'EDI est-il très répandu en grande distribution ?",
          choices: ['Il y a un très grand nombre de messages à traiter', 'Il remplace le besoin de camions', 'Il élimine les stocks en magasin', 'Il supprime la facturation'],
          answer: 0,
          explain: "Des milliers de commandes et de factures par jour justifient une automatisation complète.",
        },
        {
          q: 'Que signifie un échange en temps réel ?',
          choices: ["L'information est disponible immédiatement", 'Elle est envoyée une fois par mois', 'Elle est imprimée avant d\'être envoyée', 'Elle n\'est jamais enregistrée'],
          answer: 0,
          explain: "Une API permet par exemple de connaître la position d'un colis à l'instant précis de la demande.",
        },
      ],
    },

    {
      id: 'tracabilite',
      title: 'Identification et traçabilité',
      minutes: 5,
      cards: [
        {
          type: 'text',
          title: 'Savoir ce que l\'on a, et où',
          body: "Pour suivre un produit tout au long de la chaîne, il faut **l'identifier de façon unique**. Des **standards mondiaux** (GS1) définissent les codes des articles, des palettes et des sites. La **traçabilité** permet de retrouver l'historique d'un produit : d'où il vient, où il est passé, où il est parti.",
        },
        {
          type: 'list',
          title: 'Les codes GS1',
          items: [
            ['GTIN (EAN)', "Identifiant de l'article : le code-barres du produit en rayon."],
            ['SSCC', "Identifiant d'une unité logistique (palette, colis) : il suit la palette dans toute la chaîne."],
            ['GLN', "Identifiant d'un lieu : entrepôt, magasin, site de livraison."],
            ['Numéro de lot', 'Regroupe les produits fabriqués ensemble, essentiel pour les rappels.'],
          ],
        },
        {
          type: 'list',
          title: 'Les technologies',
          items: [
            ['Code-barres 1D', 'Lecture rapide et peu coûteuse, un code à la fois, ligne de vue nécessaire.'],
            ['Code 2D / QR code', 'Contient plus d\'informations (lot, date) sur une petite surface.'],
            ['RFID', 'Puce lue par radio : plusieurs articles à la fois, sans ligne de vue, mais plus cher à l\'unité.'],
            ['GPS / IoT', 'Suivi de la position et de l\'état (température) des véhicules et conteneurs.'],
          ],
        },
        {
          type: 'text',
          title: 'À quoi sert la traçabilité ?',
          body: "• **Rappel de produits** : retrouver rapidement tous les produits d'un lot défectueux.\n• **Sécurité alimentaire et santé** : obligation légale dans de nombreux secteurs.\n• **Lutte contre la contrefaçon**.\n• **Fiabilité des stocks** : lecture à chaque mouvement.\n\nUn bon système identifie **en amont** (fournisseurs), **en interne** (production, stockage) et **en aval** (clients).",
        },
        {
          type: 'key',
          points: [
            'GTIN : article ; SSCC : unité logistique ; GLN : lieu ; numéro de lot : fabrication.',
            'Codes-barres, QR codes, RFID, GPS : de plus en plus de données, de plus en plus de coût.',
            'La traçabilité permet les rappels de lots et la sécurité des produits.',
          ],
        },
      ],
      quiz: [
        () => {
          const per = int(200, 1200, 100)
          const share = pick([5, 10, 20])
          return numQuestion({
            q: `Un lot de ${fmt(per)} produits est rappelé grâce à la traçabilité. Sans elle, il aurait fallu rappeler ${share} fois plus de produits. Combien de produits auraient été rappelés ?`,
            answer: per * share,
            unit: 'produits',
            digits: 0,
            explain: `${fmt(per)} × ${share} = ${fmt(per * share, 0)} produits.`,
            wrong: [per, per + share, per / share, per * share * 2],
          })
        },
        () => {
          const items = int(2, 12, 1) * 1000
          const rfid = pick([5, 10, 20, 50])
          return numQuestion({
            q: `Un lecteur RFID lit ${rfid} articles par seconde. Combien de secondes faut-il pour lire ${fmt(items)} articles ?`,
            answer: items / rfid,
            unit: 's',
            digits: 0,
            explain: `${fmt(items)} / ${rfid} = ${fmt(items / rfid, 0)} secondes.`,
            wrong: [items * rfid, items - rfid, items / rfid / 2, items / rfid * 2],
          })
        },
        {
          q: 'Que identifie le code SSCC ?',
          choices: ['Une unité logistique, comme une palette', 'Un article vendu en rayon', 'Un entrepôt ou un site de livraison', 'Le numéro du chauffeur'],
          answer: 0,
          explain: "Le SSCC (Serial Shipping Container Code) donne un identifiant unique à une palette ou un colis.",
        },
        {
          q: 'Que représente le GTIN ou EAN ?',
          choices: ["L'identifiant de l'article", "L'identifiant d'un camion", 'Le numéro de commande interne', 'La date de péremption'],
          answer: 0,
          explain: "Le GTIN (souvent affiché sous forme de code-barres EAN) identifie chaque référence de produit.",
        },
        {
          q: 'Quel est l\'intérêt du numéro de lot ?',
          choices: ['Retrouver tous les produits fabriqués ensemble', 'Fixer le prix de chaque produit', 'Choisir le transporteur du lot', 'Remplacer le code-barres'],
          answer: 0,
          explain: "En cas de défaut, le lot permet de rappeler précisément les produits concernés, pas toute la production.",
        },
        {
          q: 'Quel avantage a la RFID par rapport au code-barres ?',
          choices: ['Elle lit plusieurs articles sans ligne de vue', 'Elle coûte moins cher à l\'unité', 'Elle ne nécessite aucun lecteur', 'Elle fonctionne sans aucune donnée'],
          answer: 0,
          explain: "La lecture radio traite en bloc une palette entière, mais les étiquettes coûtent plus cher que des codes-barres.",
        },
        {
          q: 'Que permet un code QR sur un emballage ?',
          choices: ['Stocker plus d\'informations sur peu de surface', 'Remplacer le produit lui-même', 'Éviter toute étape de contrôle', 'Réduire le poids du colis'],
          answer: 0,
          explain: "Les codes 2D peuvent contenir lot, date et URL : plus d'information qu'un code-barres classique.",
        },
        {
          q: "Pourquoi la traçabilité est-elle obligatoire dans l'alimentaire ?",
          choices: ['Pour protéger les consommateurs en cas de problème', 'Pour fixer les prix de vente', 'Pour éviter le transport maritime', 'Pour réduire le nombre de références'],
          answer: 0,
          explain: "Elle permet de retirer rapidement du marché les produits dangereux et de remonter à l'origine du problème.",
        },
      ],
    },

    {
      id: 'aps',
      title: "La planification avancée (APS)",
      minutes: 5,
      cards: [
        {
          type: 'text',
          title: 'Planifier sous contraintes',
          body: "L'ERP calcule des plans sans toujours tenir compte des limites réelles. Un système d'**APS** (Advanced Planning and Scheduling) cherche **le meilleur plan réalisable** en tenant compte simultanément de la **demande**, des **capacités**, des **stocks**, des **délais** et des **coûts**.",
        },
        {
          type: 'list',
          title: 'Ce que fait un APS',
          items: [
            ['Prévision', 'Calcule une prévision statistique et suit les erreurs.'],
            ['Planification de la production', 'Répartit la charge entre sites et machines.'],
            ['Planification des approvisionnements', 'Calcule les commandes aux fournisseurs avec les stocks de sécurité.'],
            ['Simulation', 'Teste des scénarios : « et si la demande augmente de 20 % ? »'],
            ['Optimisation', 'Cherche le plan qui minimise le coût ou maximise le service.'],
          ],
        },
        {
          type: 'text',
          title: 'Un plan « optimal » reste un plan',
          body: "Un APS ne remplace pas les décisions humaines : il fournit un **plan de référence** que les équipes ajustent lors du **S&OP**. Sa valeur dépend de la **qualité des données** (stocks, délais, capacités) : « garbage in, garbage out » (des données fausses donnent des résultats faux).",
        },
        {
          type: 'list',
          title: 'Quand en a-t-on besoin ?',
          items: [
            ['Beaucoup de références et de sites', 'Impossible de planifier à la main.'],
            ['Contraintes complexes', 'Capacités limitées, produits qui partagent des ressources.'],
            ['Besoin de réactivité', 'Recalculer vite après un aléa.'],
          ],
        },
        {
          type: 'key',
          points: [
            "APS : planification sous contraintes, avec simulation et optimisation.",
            "Il s'appuie sur des données fiables et prépare le S&OP.",
            "Utile quand références, sites et contraintes sont nombreux.",
          ],
        },
      ],
      quiz: [
        () => {
          const skus = int(2, 20) * 1000
          const sec = pick([3, 5, 10])
          return numQuestion({
            q: `Un planificateur met ${sec} minutes pour planifier une référence à la main. Avec ${fmt(skus)} références, combien d'heures cela représenterait-il ?`,
            answer: (skus * sec) / 60,
            unit: 'heures',
            digits: 0,
            explain: `${fmt(skus)} × ${sec} min = ${fmt(skus * sec)} min, soit ${fmt((skus * sec) / 60, 0)} heures : impossible sans automatisation.`,
            wrong: [skus * sec, skus / sec, (skus * sec) / 100, ((skus * sec) / 60) * 2],
          })
        },
        () => {
          const base = int(800, 3000, 100)
          const rise = pick([10, 20, 30])
          return numQuestion({
            q: `Une simulation APS teste une hausse de la demande de ${rise} % sur un volume de base de ${fmt(base)} unités. Quel volume doit-on planifier dans ce scénario ?`,
            answer: base * (1 + rise / 100),
            unit: 'unités',
            digits: 0,
            explain: `${fmt(base)} × ${fmt(1 + rise / 100)} = ${fmt(base * (1 + rise / 100), 0)} unités.`,
            wrong: [base * rise, base + rise, base * (1 - rise / 100), base * (1 + rise / 100) * 1.2],
          })
        },
        {
          q: 'Que signifie APS ?',
          choices: ['Advanced Planning and Scheduling', 'Automatic Production System', 'Applied Purchasing Strategy', 'Annual Planning Summary'],
          answer: 0,
          explain: "APS signifie planification et ordonnancement avancés, avec prise en compte des contraintes.",
        },
        {
          q: 'En quoi un APS diffère-t-il du MRP de base ?',
          choices: ['Il tient compte des capacités et optimise', 'Il ne calcule aucun besoin', 'Il remplace tous les fournisseurs', 'Il fonctionne sans aucune donnée'],
          answer: 0,
          explain: "Le MRP de base suppose les capacités infinies ; l'APS cherche un plan réalisable et optimisé.",
        },
        {
          q: 'À quoi sert la simulation de scénarios ?',
          choices: ['Comparer des décisions avant de les prendre', 'Remplacer toutes les prévisions', 'Éviter de calculer les stocks', 'Réduire le nombre de clients'],
          answer: 0,
          explain: "On teste « et si… » (hausse de demande, panne d'une usine) pour préparer des réponses.",
        },
        {
          q: "Que signifie « garbage in, garbage out » ?",
          choices: ['Des données fausses donnent des résultats faux', 'Les déchets doivent être recyclés', 'Un bon logiciel corrige tout', 'Les données sont toujours justes'],
          answer: 0,
          explain: "La qualité d'un plan dépend entièrement de celle des données d'entrée.",
        },
        {
          q: "Quel est le lien entre l'APS et le S&OP ?",
          choices: ["L'APS fournit un plan de référence que le S&OP ajuste", "L'APS supprime le besoin d'un S&OP", 'Le S&OP remplace le logiciel APS', 'Aucun lien entre les deux'],
          answer: 0,
          explain: "Les équipes se servent du plan de l'APS comme base de discussion et de décision mensuelle.",
        },
        {
          q: 'Quand un APS est-il le plus utile ?',
          choices: ['Beaucoup de références, de sites et de contraintes', 'Une seule référence vendue localement', 'Une entreprise sans stock ni production', 'Un commerce de quartier sans fournisseur'],
          answer: 0,
          explain: "Plus la situation est complexe, plus un calcul automatisé apporte de valeur.",
        },
      ],
    },

    {
      id: 'tour-de-controle',
      title: 'La tour de contrôle',
      minutes: 5,
      cards: [
        {
          type: 'text',
          title: 'Voir toute la chaîne en un seul endroit',
          body: "Une **tour de contrôle** (*control tower*) est un centre de pilotage qui **rassemble les données** de la chaîne d'approvisionnement (commandes, transports, stocks, fournisseurs) pour **voir en temps réel** ce qui se passe, **détecter les problèmes** et **réagir vite**. Le nom vient du contrôle aérien.",
        },
        {
          type: 'list',
          title: 'Ce que montre la tour de contrôle',
          items: [
            ['Visibilité', 'Où sont les commandes, les conteneurs, les camions ? Quels stocks sont disponibles ?'],
            ['Alertes', 'Retard probable, rupture à venir, température hors limites.'],
            ['Analyse', 'Indicateurs de service, de coût et de délai.'],
            ['Décision', 'Propose ou lance des actions : changer de transporteur, expédier en urgence.'],
          ],
        },
        {
          type: 'example',
          title: 'Un exemple',
          body: "Un navire qui transporte des composants est retardé de 5 jours. La tour de contrôle détecte le retard dès la sortie du port, calcule l'impact sur la production (rupture dans 8 jours) et propose : **un transport aérien** d'une partie des pièces, ou **un changement de planning**. Le responsable décide en quelques heures au lieu de le découvrir en ligne de production.",
        },
        {
          type: 'list',
          title: 'Les conditions du succès',
          items: [
            ['Des données connectées', 'Les systèmes (ERP, TMS, WMS) et les partenaires doivent partager leurs informations.'],
            ['Des règles claires', 'Qui réagit à quelle alerte, avec quel pouvoir de décision.'],
            ['Peu d\'alertes, mais pertinentes', 'Trop d\'alertes sont ignorées.'],
          ],
        },
        {
          type: 'key',
          points: [
            "Tour de contrôle : visibilité en temps réel, alertes et aide à la décision.",
            "Elle réunit les données des commandes, transports et stocks.",
            "Succès : données connectées, règles claires, alertes pertinentes.",
          ],
        },
      ],
      quiz: [
        () => {
          const delay = int(3, 10)
          const stock = int(4, 14)
          return numQuestion({
            q: `Un navire a ${delay} jours de retard. Le stock couvre ${stock} jours de production. De combien de jours de production manquera-t-on si on ne fait rien (0 si le stock suffit) ?`,
            answer: Math.max(0, delay - stock),
            unit: 'jours',
            digits: 0,
            explain: delay > stock ? `${delay} − ${stock} = ${delay - stock} jours de rupture.` : `Le stock de ${stock} jours couvre le retard de ${delay} jours : aucune rupture.`,
            wrong: [delay, stock, delay + stock, Math.abs(delay - stock) + 2],
          })
        },
        () => {
          const alerts = int(40, 200, 10)
          const useful = pick([10, 20, 30, 50])
          return numQuestion({
            q: `Une tour de contrôle envoie ${alerts} alertes par jour, dont ${useful} % sont vraiment utiles. Combien d'alertes utiles cela fait-il ?`,
            answer: (alerts * useful) / 100,
            unit: 'alertes',
            digits: 0,
            explain: `${alerts} × ${useful} % = ${fmt((alerts * useful) / 100, 0)} alertes utiles : les autres noient l'information.`,
            wrong: [alerts - (alerts * useful) / 100, alerts * useful, alerts / useful, (alerts * useful) / 10],
          })
        },
        {
          q: "Que fait une tour de contrôle logistique ?",
          choices: ['Elle centralise les informations pour piloter en temps réel', 'Elle contrôle les avions à la place des pilotes', 'Elle fabrique les produits de l\'entreprise', 'Elle remplace tous les transporteurs'],
          answer: 0,
          explain: "Elle regroupe les données de la chaîne et aide à détecter puis à traiter rapidement les problèmes.",
        },
        {
          q: 'Quel est le premier bénéfice d\'une tour de contrôle ?',
          choices: ['La visibilité de bout en bout', 'La fermeture des entrepôts', 'La suppression des clients difficiles', 'La baisse des salaires'],
          answer: 0,
          explain: "Savoir où sont les commandes et les stocks permet d'anticiper plutôt que de subir.",
        },
        {
          q: 'Pourquoi trop d\'alertes sont-elles un problème ?',
          choices: ['Les alertes importantes passent inaperçues', 'Cela augmente le stock de sécurité', 'Cela accélère les transports', 'Cela réduit les coûts de maintenance'],
          answer: 0,
          explain: "Quand tout est urgent, plus rien ne l'est : il faut quelques alertes bien choisies.",
        },
        {
          q: 'De quoi dépend la qualité d\'une tour de contrôle ?',
          choices: ['De la qualité et du partage des données', 'Du nombre d\'écrans dans la salle', 'De la couleur du logiciel', 'Du nombre de marques vendues'],
          answer: 0,
          explain: "Sans données fiables et connectées (ERP, TMS, WMS, partenaires), la vue d'ensemble est trompeuse.",
        },
        {
          q: "Que doit-on définir en plus du logiciel ?",
          choices: ['Qui réagit à quelle alerte et avec quel pouvoir', 'La marque du camion utilisé', 'Le prix de vente du produit', 'La couleur des tableaux de bord'],
          answer: 0,
          explain: "Sans règles de décision, les alertes restent sans suite : l'organisation compte autant que l'outil.",
        },
        {
          q: 'Quelle action une tour de contrôle peut-elle proposer après un retard de navire ?',
          choices: ['Un transport aérien pour une partie des pièces', 'Une augmentation des prix de vente', 'La fermeture de la ligne de production', 'La suppression de la commande'],
          answer: 0,
          explain: "Un fret plus rapide pour les pièces critiques évite l'arrêt de la production à un coût maîtrisé.",
        },
      ],
    },

    {
      id: 'donnees-reference',
      title: 'Les données de référence',
      minutes: 5,
      cards: [
        {
          type: 'text',
          title: 'La base de tout',
          body: "Les **données de référence** (ou données maîtres, *master data*) décrivent les objets stables de l'entreprise : **articles**, **fournisseurs**, **clients**, **nomenclatures**, **emplacements**. Tous les logiciels s'en servent. Si elles sont fausses, **tous les calculs** (MRP, prévision, coûts) le sont aussi.",
        },
        {
          type: 'list',
          title: 'Des erreurs fréquentes',
          items: [
            ['Dimensions et poids faux', "Mauvais calcul de remplissage, de coût de transport, de stockage."],
            ['Délais fournisseurs obsolètes', 'Commandes lancées trop tard : ruptures.'],
            ['Doublons', "Le même article avec deux codes : stocks éclatés, mauvaise prévision."],
            ['Unités de mesure incohérentes', 'Pièce, carton, palette : erreurs de quantité.'],
            ['Nomenclatures erronées', 'Besoins de composants faux.'],
          ],
        },
        {
          type: 'list',
          title: 'Bien gérer ses données',
          items: [
            ['Un propriétaire par donnée', 'Quelqu\'un est responsable de chaque information.'],
            ['Des règles de création', 'Un formulaire unique, des champs obligatoires.'],
            ['Des contrôles réguliers', 'Détecter doublons, valeurs aberrantes, données non mises à jour.'],
            ['Un nettoyage périodique', 'Archiver les articles et fournisseurs inactifs.'],
          ],
        },
        {
          type: 'formula',
          title: 'Mesurer la qualité des données',
          formula: 'Taux de fiabilité = enregistrements corrects / enregistrements contrôlés × 100',
          legend: [
            ['Contrôle', 'On vérifie un échantillon (par exemple 200 articles) en comparant avec la réalité.'],
          ],
          example: 'Sur 200 articles contrôlés, 176 ont des dimensions exactes : 88 % de fiabilité. Le reste doit être corrigé.',
        },
        {
          type: 'key',
          points: [
            "Données de référence : articles, fournisseurs, clients, nomenclatures, emplacements.",
            "Une erreur se propage dans tous les calculs.",
            "Bonnes pratiques : propriétaire, règles de création, contrôles, nettoyage.",
          ],
        },
      ],
      quiz: [
        () => {
          const checked = int(100, 400, 50)
          const ok = Math.round(checked * (int(80, 98) / 100))
          return numQuestion({
            q: `Sur ${checked} articles contrôlés, ${ok} ont des données exactes. Quel est le taux de fiabilité ?`,
            answer: (ok / checked) * 100,
            unit: '%',
            digits: 1,
            max: 100,
            explain: `${ok} / ${checked} × 100 = ${fmt((ok / checked) * 100, 1)} %.`,
          })
        },
        () => {
          const articles = int(5, 40) * 1000
          const dup = pick([2, 3, 5, 8])
          return numQuestion({
            q: `Une entreprise gère ${fmt(articles)} articles dont ${dup} % sont des doublons. Combien de doublons cela fait-il ?`,
            answer: (articles * dup) / 100,
            unit: 'articles',
            digits: 0,
            explain: `${fmt(articles)} × ${dup} % = ${fmt((articles * dup) / 100, 0)} doublons à fusionner.`,
            wrong: [articles - (articles * dup) / 100, articles * dup, articles / dup, (articles * dup) / 10],
          })
        },
        {
          q: 'Que sont les données de référence ?',
          choices: ['Les informations stables : articles, fournisseurs, clients', 'Les ventes du mois dernier uniquement', 'Les mails reçus par les services', 'Les plannings de congés'],
          answer: 0,
          explain: "Ces données décrivent les objets de base de l'entreprise et alimentent tous les systèmes.",
        },
        {
          q: 'Pourquoi les dimensions d\'un article doivent-elles être exactes ?',
          choices: ['Elles servent à calculer le stockage et le transport', 'Elles fixent la couleur du produit', 'Elles remplacent le code-barres', 'Elles décident du prix de vente'],
          answer: 0,
          explain: "Un volume erroné fausse le taux de remplissage, les coûts de transport et la capacité d'entrepôt.",
        },
        {
          q: "Quelle est la conséquence d'un délai fournisseur obsolète ?",
          choices: ['Des commandes lancées trop tard', 'Un stock de sécurité réduit à zéro', 'Un prix de vente plus élevé', 'Un meilleur taux de service'],
          answer: 0,
          explain: "Si le délai réel est plus long que celui du système, la marchandise arrive après le besoin.",
        },
        {
          q: 'Pourquoi les doublons posent-ils problème ?',
          choices: ['Ils éclatent le stock et faussent les prévisions', 'Ils augmentent la rotation des stocks', 'Ils rendent les produits plus fiables', 'Ils facilitent la traçabilité'],
          answer: 0,
          explain: "Un même produit sous deux codes empêche d'avoir une vision claire de son stock et de ses ventes.",
        },
        {
          q: 'Quelle bonne pratique améliore la qualité des données ?',
          choices: ['Désigner un propriétaire pour chaque donnée', 'Autoriser chacun à modifier toutes les fiches', 'Ne jamais contrôler les informations', 'Garder tous les articles même inactifs'],
          answer: 0,
          explain: "Un responsable identifié assure la mise à jour, la cohérence et le contrôle.",
        },
        {
          q: 'Pourquoi nettoyer régulièrement les données ?',
          choices: ['Pour retirer les articles et fournisseurs inactifs', 'Pour supprimer toutes les nomenclatures', 'Pour augmenter le nombre de références', 'Pour supprimer l\'historique des ventes'],
          answer: 0,
          explain: "Un référentiel allégé est plus clair, plus rapide à utiliser et moins source d'erreurs.",
        },
      ],
    },
  ],
}
