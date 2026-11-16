export default {
  id: 'kpi',
  title: 'Les indicateurs (KPI)',
  short: 'KPI',
  icon: 'gauge',
  color: 'cyan',
  lessons: [
    {
      id: 'service-otif',
      title: 'Taux de service et OTIF',
      minutes: 5,
      cards: [
        {
          type: 'text',
          title: 'Mesurer pour piloter',
          body:
            "Un **KPI** (Key Performance Indicator) est un indicateur chiffré qui mesure la performance. En supply chain, les KPI les plus suivis portent sur le **service client**, les **stocks** et les **coûts**.",
        },
        {
          type: 'formula',
          title: 'Taux de service',
          formula: 'Taux de service = commandes servies sans rupture / commandes totales',
          legend: [['Variante', "On peut aussi le calculer en lignes de commande ou en quantités."]],
          example: '950 commandes servies complètes sur 1 000 → taux de service de 95 %.',
        },
        {
          type: 'formula',
          title: "L'OTIF",
          formula: 'OTIF = commandes à l\'heure ET complètes / commandes totales',
          legend: [
            ['On Time', 'Livrée à la date promise.'],
            ['In Full', 'Livrée en totalité (bons articles, bonnes quantités).'],
          ],
          example: '1 000 commandes, dont 920 à l\'heure et complètes → OTIF = 92 %.',
        },
        {
          type: 'example',
          title: 'Attention au piège',
          body:
            "Une commande livrée **à l'heure mais incomplète** compte comme un **échec** dans l'OTIF.\n\nL'OTIF est donc toujours **inférieur ou égal** au taux de livraison à l'heure seul et au taux de livraison complète seul.",
        },
        {
          type: 'key',
          points: [
            'KPI = indicateur chiffré de performance.',
            'Taux de service = part des commandes servies sans rupture.',
            'OTIF = à l\'heure ET complet : l\'indicateur le plus exigeant.',
          ],
        },
      ],
      quiz: [
        {
          q: '500 commandes, dont 460 livrées à l\'heure et complètes. OTIF ?',
          choices: ['46 %', '92 %', '96 %', '8 %'],
          answer: 1,
          explain: '460 / 500 = 0,92, soit 92 %.',
        },
        {
          q: 'Une commande livrée à temps mais avec un article manquant compte dans l\'OTIF comme…',
          choices: ['Un succès', 'Un échec', 'Un demi-succès', 'Elle n\'est pas comptée'],
          answer: 1,
          explain: 'Il faut être à l\'heure ET complet : sinon, c\'est un échec.',
        },
        {
          q: 'Que signifie « In Full » ?',
          choices: ['Livré en totalité', 'Livré en camion plein', 'Payé intégralement', 'Livré à temps'],
          answer: 0,
          explain: 'In Full = toutes les quantités et tous les articles commandés sont livrés.',
        },
        {
          q: 'Taux de livraison à l\'heure 95 %, taux de livraison complète 97 %. L\'OTIF peut être de…',
          choices: ['98 %', '96 %', '93 %', '100 %'],
          answer: 2,
          explain: "L'OTIF ne peut pas dépasser le plus petit des deux taux (95 %). Seul 93 % est possible.",
        },
      ],
    },
    {
      id: 'rotation-couverture',
      title: 'Rotation et couverture de stock',
      minutes: 5,
      cards: [
        {
          type: 'formula',
          title: 'Rotation des stocks',
          formula: 'Rotation = consommation annuelle / stock moyen',
          legend: [
            ['Consommation', 'Sorties de l\'année, valorisées au coût (et non au prix de vente).'],
            ['Stock moyen', 'Moyenne du stock sur l\'année, en valeur.'],
          ],
          example: 'Consommation 1 200 000 €, stock moyen 200 000 € → le stock « tourne » 6 fois par an.',
        },
        {
          type: 'formula',
          title: 'Couverture de stock',
          formula: 'Couverture = stock / consommation moyenne par jour',
          legend: [['Résultat', 'Nombre de jours pendant lesquels le stock permet de tenir sans réapprovisionnement.']],
          example: 'Stock 3 000 unités, consommation 150 unités/jour → couverture de 20 jours.',
        },
        {
          type: 'text',
          title: 'Le lien entre les deux',
          body:
            "Couverture (en jours) ≈ **365 / rotation**.\n\nAvec une rotation de 6, le stock couvre environ 365 / 6 ≈ **61 jours**.\n\nPlus la rotation est **élevée**, plus le stock est **léger** par rapport à l'activité.",
        },
        {
          type: 'example',
          title: 'Ça dépend du secteur',
          body:
            "Un supermarché a une rotation très élevée sur les produits frais (plusieurs dizaines de fois par an). Un fabricant de machines industrielles, avec des pièces chères et lentes, peut avoir une rotation de 2 ou 3.",
        },
        {
          type: 'key',
          points: [
            'Rotation = consommation / stock moyen (au coût).',
            'Couverture = stock / consommation journalière.',
            'Couverture ≈ 365 / rotation.',
            'Rotation élevée = stock léger et efficace.',
          ],
        },
      ],
      quiz: [
        {
          q: 'Consommation annuelle 900 000 €, stock moyen 150 000 €. Rotation ?',
          choices: ['3', '6', '9', '15'],
          answer: 1,
          explain: '900 000 / 150 000 = 6 rotations par an.',
        },
        {
          q: 'Stock 1 200 unités, consommation 40 unités/jour. Couverture ?',
          choices: ['30 jours', '40 jours', '48 jours', '12 jours'],
          answer: 0,
          explain: '1 200 / 40 = 30 jours.',
        },
        {
          q: 'Rotation de 12 par an. Couverture approximative ?',
          choices: ['12 jours', 'Environ 30 jours', 'Environ 60 jours', '365 jours'],
          answer: 1,
          explain: '365 / 12 ≈ 30 jours : environ un mois de stock.',
        },
        {
          q: 'Une hausse de la rotation signifie en général…',
          choices: ['Plus de stock dormant', 'Un stock plus léger par rapport à l\'activité', 'Plus de ruptures, forcément', 'Des prix plus élevés'],
          answer: 1,
          explain: 'Le stock se renouvelle plus vite : moins d\'argent immobilisé pour la même activité.',
        },
      ],
    },
  ],
}
