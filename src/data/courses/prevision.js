export default {
  id: 'prevision',
  title: 'Prévision de la demande',
  short: 'Prévision',
  icon: 'trend',
  color: 'pink',
  lessons: [
    {
      id: 'methodes',
      title: 'Prévoir la demande',
      minutes: 6,
      cards: [
        {
          type: 'text',
          title: 'Pourquoi prévoir ?',
          body:
            "Les fournisseurs et les usines ont besoin de **temps** pour produire. Il faut donc **anticiper** la demande pour acheter, produire et stocker au bon niveau.\n\nUne règle d'or : **une prévision est toujours fausse**. L'enjeu est de réduire l'erreur et de la mesurer.",
        },
        {
          type: 'list',
          title: 'Deux familles de méthodes',
          items: [
            ['Qualitatives', 'Avis d\'experts, des commerciaux, études de marché. Utiles pour un nouveau produit sans historique.'],
            ['Quantitatives', "Calculs à partir de l'historique des ventes : moyennes mobiles, lissage exponentiel, régression, saisonnalité."],
          ],
        },
        {
          type: 'formula',
          title: 'Moyenne mobile',
          formula: 'Prévision = moyenne des n dernières périodes',
          legend: [['n', 'Nombre de périodes prises en compte (3 mois, 6 mois…).']],
          example: 'Ventes : janvier 100, février 120, mars 110 → prévision d\'avril sur 3 mois = (100 + 120 + 110) / 3 = 110.',
        },
        {
          type: 'formula',
          title: 'Lissage exponentiel',
          formula: 'F(t+1) = α × D(t) + (1 − α) × F(t)',
          legend: [
            ['α', 'Coefficient entre 0 et 1 : plus il est grand, plus on réagit vite aux dernières ventes.'],
            ['D(t)', 'Demande réelle de la période.'],
            ['F(t)', 'Prévision qui avait été faite pour cette période.'],
          ],
          example: 'α = 0,3 ; prévision 100 ; ventes réelles 120 → nouvelle prévision = 0,3 × 120 + 0,7 × 100 = 106.',
        },
        {
          type: 'formula',
          title: "Mesurer l'erreur : le MAPE",
          formula: 'MAPE = moyenne de |réel − prévision| / réel',
          legend: [['MAPE', 'Mean Absolute Percentage Error : erreur moyenne en pourcentage.']],
          example: 'Réel 100, prévu 90 → 10 % ; réel 120, prévu 130 → 8,3 %. MAPE = (10 + 8,3) / 2 ≈ 9,2 %.',
        },
        {
          type: 'key',
          points: [
            'Une prévision est toujours fausse : on mesure et on réduit l\'erreur.',
            'Qualitatif sans historique ; quantitatif avec historique.',
            'Lissage exponentiel : α élevé = forte réactivité.',
            'Le MAPE mesure l\'erreur moyenne en %.',
          ],
        },
      ],
      quiz: [
        {
          q: 'Ventes : 80, 100, 90. Prévision du mois suivant par moyenne mobile sur 3 mois ?',
          choices: ['80', '90', '100', '270'],
          answer: 1,
          explain: '(80 + 100 + 90) / 3 = 270 / 3 = 90.',
        },
        {
          q: 'α = 0,5 ; prévision précédente 200 ; ventes réelles 240. Nouvelle prévision ?',
          choices: ['200', '220', '240', '440'],
          answer: 1,
          explain: '0,5 × 240 + 0,5 × 200 = 120 + 100 = 220.',
        },
        {
          q: 'Pour un produit totalement nouveau, sans historique, on utilise plutôt…',
          choices: ['La moyenne mobile', 'Le lissage exponentiel', 'Une méthode qualitative', 'Le MAPE'],
          answer: 2,
          explain: 'Sans historique, les calculs sont impossibles : on s\'appuie sur des avis d\'experts ou des produits comparables.',
        },
        {
          q: 'Réel 50, prévu 40. L\'erreur en pourcentage est de…',
          choices: ['10 %', '20 %', '25 %', '40 %'],
          answer: 1,
          explain: '|50 − 40| / 50 = 10 / 50 = 20 %.',
        },
      ],
    },
    {
      id: 'bullwhip',
      title: "L'effet coup de fouet",
      minutes: 5,
      cards: [
        {
          type: 'text',
          title: 'Le phénomène',
          body:
            "L'**effet coup de fouet** (bullwhip effect) : une petite variation de la demande du client final devient une **variation de plus en plus forte** en remontant la chaîne (distributeur → grossiste → usine → fournisseurs).\n\nComme un fouet : un petit geste du poignet, un grand claquement au bout.",
        },
        {
          type: 'list',
          title: 'Les 4 grandes causes',
          items: [
            ['Prévisions en cascade', "Chaque maillon fait sa propre prévision à partir des commandes qu'il reçoit, et ajoute sa marge de sécurité."],
            ['Commandes par lots', 'On commande en gros, de temps en temps, plutôt qu\'au fil de la demande.'],
            ['Promotions et variations de prix', 'Les clients achètent en masse pendant les promos, puis plus rien.'],
            ['Peur de la pénurie', 'Quand un produit manque, chacun commande plus que nécessaire pour être servi.'],
          ],
        },
        {
          type: 'example',
          title: 'Exemple : le papier toilette en 2020',
          body:
            "Au début de la crise du Covid, la consommation réelle avait peu changé, mais la **peur de manquer** a fait exploser les achats. Les magasins ont passé des commandes énormes, les usines ont été débordées… puis les commandes se sont effondrées.",
        },
        {
          type: 'list',
          title: 'Les remèdes',
          items: [
            ['Partager les données', 'Transmettre les ventes réelles (sorties de caisse) à toute la chaîne.'],
            ['GPA / VMI', 'Le fournisseur gère directement le stock de son client.'],
            ['Réduire les délais', 'Moins de délai = moins d\'incertitude à couvrir.'],
            ['Lisser les prix', 'Limiter les promotions qui créent des pics artificiels.'],
          ],
        },
        {
          type: 'key',
          points: [
            'La variabilité s\'amplifie en remontant vers les fournisseurs.',
            'Causes : prévisions en cascade, lots, promos, peur de la pénurie.',
            'Remède principal : partager l\'information sur la demande réelle.',
          ],
        },
      ],
      quiz: [
        {
          q: "L'effet coup de fouet désigne…",
          choices: [
            'Une baisse des prix chez les fournisseurs',
            "L'amplification de la variabilité de la demande en remontant la chaîne",
            'Un retard de livraison',
            'Une méthode de prévision',
          ],
          answer: 1,
          explain: 'Plus on s\'éloigne du client final, plus les commandes fluctuent fortement.',
        },
        {
          q: 'Laquelle de ces pratiques AGGRAVE l\'effet coup de fouet ?',
          choices: ['Partager les ventes réelles', 'Faire de fréquentes promotions', 'Réduire les délais', 'Mettre en place la GPA'],
          answer: 1,
          explain: 'Les promotions créent des pics d\'achat artificiels, suivis de creux.',
        },
        {
          q: 'Que signifie GPA (ou VMI en anglais) ?',
          choices: [
            'Gestion Partagée des Approvisionnements',
            'Grand Plan d\'Achat',
            'Gestion des Prix Annuels',
            'Garantie Produit Assurée',
          ],
          answer: 0,
          explain: 'Avec la GPA (Vendor Managed Inventory), le fournisseur pilote le réapprovisionnement de son client.',
        },
        {
          q: 'Quel est le remède le plus efficace contre le coup de fouet ?',
          choices: [
            'Commander de plus gros lots',
            "Partager l'information sur la demande réelle",
            'Augmenter les prix',
            'Multiplier les intermédiaires',
          ],
          answer: 1,
          explain: 'Quand tous les maillons voient la vraie demande du client final, ils n\'amplifient plus les variations.',
        },
      ],
    },
  ],
}
