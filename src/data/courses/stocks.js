export default {
  id: 'stocks',
  title: 'Gestion des stocks',
  short: 'Stocks',
  icon: 'boxes',
  color: 'orange',
  lessons: [
    {
      id: 'abc',
      title: 'Pourquoi des stocks ? La méthode ABC',
      minutes: 5,
      cards: [
        {
          type: 'list',
          title: 'Les types de stocks',
          items: [
            ['Matières premières', 'Ce qui entre dans la fabrication (acier, tissu, farine).'],
            ['En-cours', 'Produits en cours de fabrication, entre deux étapes.'],
            ['Produits finis', 'Prêts à être vendus.'],
            ['Pièces de rechange (MRO)', 'Pour la maintenance des machines.'],
          ],
        },
        {
          type: 'text',
          title: 'Utile… mais coûteux',
          body:
            "Le stock **protège** contre les aléas (retard fournisseur, pic de demande) et permet de livrer vite.\n\nMais il **coûte** : argent immobilisé, entrepôt, assurance, obsolescence, casse. On estime souvent le **coût de possession** entre **15 % et 30 %** de la valeur du stock par an.",
        },
        {
          type: 'text',
          title: 'La méthode ABC',
          body:
            "On ne gère pas 10 000 références de la même manière. La méthode **ABC** (issue de la loi de **Pareto**, « 80/20 ») classe les articles selon leur **poids dans la valeur consommée** :\n\n• **A** ≈ 20 % des articles → ≈ 80 % de la valeur\n• **B** ≈ 30 % des articles → ≈ 15 % de la valeur\n• **C** ≈ 50 % des articles → ≈ 5 % de la valeur",
        },
        {
          type: 'list',
          title: 'Comment faire, étape par étape',
          items: [
            ['1. Calculer', 'Pour chaque article : consommation annuelle × prix unitaire.'],
            ['2. Trier', 'Du plus grand au plus petit montant.'],
            ['3. Cumuler', 'Calculer le pourcentage cumulé de la valeur totale.'],
            ['4. Classer', "Jusqu'à environ 80 % → A ; jusqu'à environ 95 % → B ; le reste → C."],
          ],
        },
        {
          type: 'example',
          title: 'Et ensuite ?',
          body:
            "Les articles **A** sont suivis de très près : inventaires fréquents, prévisions soignées, négociation serrée.\n\nLes articles **C** sont gérés simplement : grosses commandes peu fréquentes, contrôles allégés.",
        },
        {
          type: 'key',
          points: [
            'Le stock protège des aléas mais coûte 15 à 30 % de sa valeur par an.',
            'ABC = Pareto : peu d\'articles font l\'essentiel de la valeur.',
            'On classe selon consommation × prix, puis on cumule.',
            'Effort de gestion maximal sur les A.',
          ],
        },
      ],
      quiz: [
        {
          q: 'Dans une analyse ABC, les articles de classe A représentent environ…',
          choices: ['50 % des articles et 5 % de la valeur', '20 % des articles et 80 % de la valeur', '80 % des articles et 20 % de la valeur', '100 % de la valeur'],
          answer: 1,
          explain: 'Loi de Pareto : environ 20 % des articles pèsent environ 80 % de la valeur consommée.',
        },
        {
          q: 'Quel critère utilise-t-on pour classer les articles en ABC ?',
          choices: ['Leur poids en kg', 'Leur ordre alphabétique', 'Consommation annuelle × prix unitaire', 'Leur date de création'],
          answer: 2,
          explain: 'On classe selon la valeur consommée sur la période : quantité consommée × prix unitaire.',
        },
        {
          q: 'Un stock moyen de 100 000 € avec un taux de possession de 20 % coûte par an…',
          choices: ['2 000 €', '20 000 €', '200 000 €', '120 000 €'],
          answer: 1,
          explain: '100 000 € × 20 % = 20 000 € par an pour détenir ce stock.',
        },
        {
          q: 'Quels articles méritent le suivi le plus rigoureux ?',
          choices: ['Les A', 'Les B', 'Les C', 'Tous pareil'],
          answer: 0,
          explain: "Les articles A concentrent l'essentiel de la valeur : c'est là qu'une erreur coûte le plus cher.",
        },
      ],
    },
    {
      id: 'stock-securite',
      title: 'Stock de sécurité et point de commande',
      minutes: 6,
      cards: [
        {
          type: 'text',
          title: 'Le problème',
          body:
            "Entre le moment où l'on **passe commande** et celui où l'on est **livré** (le **délai d'approvisionnement**), la demande continue. Et elle varie !\n\nLe **stock de sécurité** sert à éviter la **rupture** si la demande est plus forte que prévu pendant ce délai.",
        },
        {
          type: 'formula',
          title: 'Stock de sécurité',
          formula: 'SS = z × σ × √L',
          legend: [
            ['z', 'Coefficient lié au taux de service visé (1,65 pour 95 %, 2,33 pour 99 %).'],
            ['σ', 'Écart-type de la demande par période (par jour, par semaine…).'],
            ['L', "Délai d'approvisionnement, dans la même unité de temps que σ."],
          ],
        },
        {
          type: 'formula',
          title: 'Point de commande',
          formula: 'PC = D × L + SS',
          legend: [
            ['D', 'Demande moyenne par période.'],
            ['L', "Délai d'approvisionnement."],
            ['SS', 'Stock de sécurité.'],
          ],
          example: 'Dès que le stock descend sous le point de commande, on recommande.',
        },
        {
          type: 'example',
          title: 'Exemple chiffré',
          body:
            "Demande moyenne **D = 100 unités/jour**, écart-type **σ = 20**, délai **L = 4 jours**, taux de service visé **95 %** (z = 1,65).\n\n• SS = 1,65 × 20 × √4 = 1,65 × 20 × 2 = **66 unités**\n• PC = 100 × 4 + 66 = **466 unités**\n\nOn repasse commande dès que le stock tombe à 466.",
        },
        {
          type: 'key',
          points: [
            'SS = z × σ × √L protège contre la variabilité de la demande.',
            'PC = D × L + SS : seuil de déclenchement de la commande.',
            'Plus le taux de service visé est élevé, plus z et le SS augmentent.',
            'σ et L doivent être exprimés dans la même unité de temps.',
          ],
        },
      ],
      quiz: [
        {
          q: 'D = 50 unités/jour, L = 6 jours, SS = 40 unités. Quel est le point de commande ?',
          choices: ['90', '300', '340', '296'],
          answer: 2,
          explain: 'PC = D × L + SS = 50 × 6 + 40 = 340 unités.',
        },
        {
          q: 'z = 1,65 ; σ = 10 unités/jour ; L = 9 jours. Le stock de sécurité vaut…',
          choices: ['49,5', '148,5', '16,5', '99'],
          answer: 0,
          explain: 'SS = 1,65 × 10 × √9 = 1,65 × 10 × 3 = 49,5, soit environ 50 unités.',
        },
        {
          q: 'Si on veut passer d\'un taux de service de 95 % à 99 %, le stock de sécurité…',
          choices: ['Diminue', 'Ne change pas', 'Augmente', 'Devient nul'],
          answer: 2,
          explain: 'z passe de 1,65 à 2,33 : le stock de sécurité augmente d\'environ 40 %.',
        },
        {
          q: 'À quoi sert le point de commande ?',
          choices: [
            'À fixer le prix de vente',
            'À savoir quand déclencher une nouvelle commande',
            'À calculer le nombre de fournisseurs',
            'À mesurer la satisfaction client',
          ],
          answer: 1,
          explain: 'Quand le stock atteint ce seuil, on commande : le stock restant couvrira le délai de livraison.',
        },
      ],
    },
    {
      id: 'wilson',
      title: 'La quantité économique (Wilson)',
      minutes: 6,
      cards: [
        {
          type: 'text',
          title: 'Commander souvent ou en gros ?',
          body:
            "Deux coûts s'opposent :\n\n• **Coût de passation** : chaque commande coûte (temps administratif, transport, réception). Commander rarement, en gros, le réduit.\n• **Coût de possession** : plus on commande gros, plus le stock moyen est élevé, et plus il coûte.\n\nLa **formule de Wilson** trouve la quantité qui **minimise la somme** des deux.",
        },
        {
          type: 'formula',
          title: 'Quantité économique (EOQ)',
          formula: 'Q* = √(2 × D × S / H)',
          legend: [
            ['D', 'Demande annuelle (en unités).'],
            ['S', 'Coût de passation d\'une commande (en €).'],
            ['H', 'Coût de possession d\'une unité pendant un an (prix × taux de possession).'],
          ],
        },
        {
          type: 'example',
          title: 'Exemple chiffré',
          body:
            "D = **12 000 unités/an**, S = **50 € par commande**, prix = 10 € et taux de possession = 20 %, donc H = **2 € par unité et par an**.\n\n• Q* = √(2 × 12 000 × 50 / 2) = √600 000 ≈ **775 unités**\n• Nombre de commandes par an = 12 000 / 775 ≈ **15,5**",
        },
        {
          type: 'list',
          title: 'Les limites du modèle',
          items: [
            ['Hypothèses', 'Demande constante et connue, délai fixe, pas de remise sur quantité.'],
            ['En pratique', "On l'ajuste : multiples de palettes, remises fournisseur, contraintes de place."],
          ],
        },
        {
          type: 'key',
          points: [
            'Wilson équilibre coût de passation et coût de possession.',
            'Q* = √(2DS/H).',
            'H = prix unitaire × taux de possession annuel.',
            'Modèle simple, à adapter aux contraintes réelles.',
          ],
        },
      ],
      quiz: [
        {
          q: 'D = 8 000 unités/an, S = 100 €, H = 4 €/unité/an. Q* vaut…',
          choices: ['200', '400', '632', '1 000'],
          answer: 2,
          explain: 'Q* = √(2 × 8 000 × 100 / 4) = √400 000 ≈ 632 unités.',
        },
        {
          q: 'Si le coût de passation S augmente, la quantité économique…',
          choices: ['Augmente', 'Diminue', 'Ne change pas', 'Devient nulle'],
          answer: 0,
          explain: 'S est au numérateur : commander coûte plus cher, donc on commande moins souvent, en plus grosses quantités.',
        },
        {
          q: 'Un article coûte 25 € et le taux de possession est de 20 %/an. H vaut…',
          choices: ['20 €', '5 €', '0,8 €', '125 €'],
          answer: 1,
          explain: 'H = 25 € × 20 % = 5 € par unité et par an.',
        },
        {
          q: 'Quelle hypothèse fait le modèle de Wilson ?',
          choices: ['Une demande très variable', 'Une demande constante et connue', 'Des remises sur quantité', 'Des ruptures volontaires'],
          answer: 1,
          explain: 'Le modèle suppose une demande régulière et connue, ce qui est rarement parfaitement vrai.',
        },
      ],
    },
  ],
}
