export default {
  id: 'achats',
  title: 'Achats et approvisionnement',
  short: 'Achats',
  icon: 'cart',
  color: 'sky',
  lessons: [
    {
      id: 'processus',
      title: 'Le processus achat',
      minutes: 4,
      cards: [
        {
          type: 'list',
          title: 'Achats ≠ approvisionnement',
          items: [
            ['Achats', 'Stratégique : choisir les fournisseurs, négocier les prix et les contrats.'],
            ['Approvisionnement', 'Opérationnel : passer les commandes au quotidien, suivre les livraisons, éviter les ruptures.'],
          ],
        },
        {
          type: 'list',
          title: 'Les étapes',
          items: [
            ['1. Expression du besoin', 'Que faut-il acheter, en quelle quantité, avec quel cahier des charges ?'],
            ['2. Sourcing', 'Rechercher et présélectionner des fournisseurs (appel d\'offres, RFQ).'],
            ['3. Négociation', 'Prix, délais, qualité, conditions de paiement.'],
            ['4. Contractualisation', 'Signature du contrat ou d\'un accord-cadre.'],
            ['5. Commande et suivi', 'Bon de commande, réception, contrôle, paiement.'],
            ['6. Évaluation', 'Mesurer la performance du fournisseur.'],
          ],
        },
        {
          type: 'text',
          title: 'Un levier de rentabilité',
          body:
            "Dans l'industrie, les achats représentent souvent **plus de la moitié** du chiffre d'affaires d'une entreprise.\n\nC'est pourquoi **1 € économisé à l'achat** améliore directement la marge : c'est l'un des leviers les plus puissants.",
        },
        {
          type: 'example',
          title: 'Exemple',
          body:
            "Une entreprise réalise 10 M€ de CA, dont 6 M€ d'achats, pour une marge de 5 % (500 k€). Si elle baisse ses achats de **3 %** (180 k€ économisés), sa marge passe à **680 k€**, soit **+36 %**.",
        },
        {
          type: 'key',
          points: [
            'Achats = stratégique ; approvisionnement = opérationnel.',
            'Besoin → sourcing → négociation → contrat → commande → évaluation.',
            'Les achats pèsent lourd : chaque euro gagné va droit à la marge.',
          ],
        },
      ],
      quiz: [
        {
          q: 'Passer les commandes quotidiennes et suivre les livraisons relève…',
          choices: ['Des achats', "De l'approvisionnement", 'Du marketing', 'De la comptabilité'],
          answer: 1,
          explain: "C'est la partie opérationnelle : l'approvisionnement.",
        },
        {
          q: 'Le sourcing consiste à…',
          choices: ['Payer les fournisseurs', 'Rechercher et sélectionner des fournisseurs', 'Stocker les produits', 'Livrer les clients'],
          answer: 1,
          explain: 'Le sourcing est la recherche de fournisseurs capables de répondre au besoin.',
        },
        {
          q: 'Quelle est la première étape du processus achat ?',
          choices: ['La négociation', "L'expression du besoin", 'Le paiement', "L'évaluation"],
          answer: 1,
          explain: "On ne peut rien acheter sans savoir précisément ce dont on a besoin : c'est le cahier des charges.",
        },
        {
          q: 'Pourquoi dit-on que les achats sont un levier de rentabilité ?',
          choices: [
            'Parce qu\'ils augmentent le prix de vente',
            'Parce que chaque économie d\'achat améliore directement la marge',
            'Parce qu\'ils réduisent les salaires',
            'Ils ne le sont pas',
          ],
          answer: 1,
          explain: 'Une économie sur les achats ne demande pas de vendre plus : elle s\'ajoute directement au résultat.',
        },
      ],
    },
    {
      id: 'fournisseurs',
      title: 'Choisir ses fournisseurs : QCD, TCO, Kraljic',
      minutes: 6,
      cards: [
        {
          type: 'list',
          title: 'Les critères QCD',
          items: [
            ['Q — Qualité', 'Conformité, taux de défauts, certifications (ISO 9001).'],
            ['C — Coût', 'Prix, mais pas seulement : voir le TCO.'],
            ['D — Délai', 'Délai de livraison, respect des dates, réactivité.'],
          ],
        },
        {
          type: 'text',
          title: 'Le TCO : le vrai coût',
          body:
            "Le **TCO** (Total Cost of Ownership, ou coût total de possession) additionne **tous les coûts** liés à un achat : prix, transport, droits de douane, stockage, non-qualité, maintenance, fin de vie…\n\nUn fournisseur moins cher sur le prix peut coûter **plus cher au total** !",
        },
        {
          type: 'example',
          title: 'Exemple : deux fournisseurs',
          body:
            "Fournisseur Asie : 8 €/pièce + 2 € de transport et douane + 1 € de stock (délai long) + 0,5 € de défauts = **11,5 €**.\n\nFournisseur Europe : 10 €/pièce + 0,5 € de transport + 0,2 € de stock + 0,1 € de défauts = **10,8 €**.\n\nAu TCO, le fournisseur européen est le plus intéressant.",
        },
        {
          type: 'list',
          title: 'La matrice de Kraljic',
          items: [
            ['Stratégiques', 'Fort impact financier et fort risque : partenariat de long terme (ex. composants clés).'],
            ['Leviers', 'Fort impact, faible risque : mise en concurrence pour obtenir le meilleur prix.'],
            ['Critiques (goulots)', 'Faible impact, fort risque : sécuriser l\'approvisionnement (stock, double source).'],
            ['Simples', 'Faible impact, faible risque : simplifier et automatiser (fournitures de bureau).'],
          ],
        },
        {
          type: 'key',
          points: [
            'On évalue un fournisseur sur la Qualité, le Coût et le Délai.',
            'Le TCO compte tous les coûts, pas seulement le prix.',
            'Kraljic croise impact financier et risque fournisseur : 4 stratégies.',
          ],
        },
      ],
      quiz: [
        {
          q: 'Que signifie QCD ?',
          choices: ['Quantité, Commande, Distribution', 'Qualité, Coût, Délai', 'Qualité, Contrat, Douane', 'Quai, Camion, Dépôt'],
          answer: 1,
          explain: 'Ce sont les trois critères classiques pour évaluer un fournisseur.',
        },
        {
          q: 'Le TCO prend en compte…',
          choices: ['Uniquement le prix d\'achat', 'Tous les coûts liés à l\'achat, sur toute sa durée de vie', 'Seulement le transport', 'Le prix de vente au client'],
          answer: 1,
          explain: 'Total Cost of Ownership : prix, transport, douane, stock, qualité, maintenance, fin de vie…',
        },
        {
          q: 'Dans la matrice de Kraljic, un composant unique, cher et produit par un seul fournisseur est un achat…',
          choices: ['Simple', 'Levier', 'Stratégique', 'Critique à faible impact'],
          answer: 2,
          explain: 'Fort impact financier et fort risque : c\'est un achat stratégique, à gérer en partenariat.',
        },
        {
          q: 'Pour des achats « leviers » (fort impact, faible risque), la meilleure stratégie est…',
          choices: ['Un partenariat exclusif', 'La mise en concurrence des fournisseurs', 'Constituer un gros stock de sécurité', 'Ne rien faire'],
          answer: 1,
          explain: "Beaucoup de fournisseurs sont disponibles : on fait jouer la concurrence pour gagner sur le prix.",
        },
      ],
    },
  ],
}
