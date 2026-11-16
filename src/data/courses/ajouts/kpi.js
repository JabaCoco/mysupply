// Lot 9 — KPI : 4 leçons ajoutées + questions supplémentaires pour les 2 leçons existantes.
import { fmt, int, numQuestion, pick } from '../../gen.js'

export default {
  more: {
    'service-otif': [
      () => {
        const total = int(400, 1500, 50)
        const onTime = Math.round(total * (int(85, 98) / 100))
        return numQuestion({
          q: `Sur ${fmt(total)} commandes, ${fmt(onTime)} sont livrées à l'heure. Quel est le taux de ponctualité ?`,
          answer: (onTime / total) * 100,
          unit: '%',
          digits: 1,
          max: 100,
          explain: `${fmt(onTime)} / ${fmt(total)} × 100 = ${fmt((onTime / total) * 100, 1)} %.`,
        })
      },
      () => {
        const a = int(88, 96)
        const b = int(90, 98)
        return numQuestion({
          q: `Une enseigne a ${a} % de commandes livrées à l'heure ET ${b} % livrées complètes, en supposant les deux événements indépendants. Quel est approximativement son OTIF ?`,
          answer: (a * b) / 100,
          unit: '%',
          digits: 1,
          explain: `OTIF ≈ ${a} % × ${b} % = ${fmt((a * b) / 100, 1)} % : les deux conditions doivent être réunies pour qu'une commande compte.`,
          wrong: [(a + b) / 2, Math.min(a, b), Math.max(a, b), 100 - (a * b) / 100],
        })
      },
      {
        q: "Que mesure le taux de service ?",
        choices: ["La part de la demande satisfaite", "Le nombre de camions utilisés", "Le délai moyen de paiement", "La marge moyenne par produit"],
        answer: 0,
        explain: "Le taux de service compare ce qui a été livré à ce que les clients avaient demandé.",
      },
      {
        q: "Pourquoi l'OTIF est-il plus exigeant que le seul taux de service ?",
        choices: ["Il exige à la fois l'heure et la quantité", "Il ne compte que les petites commandes", "Il ignore les retards de livraison", "Il se mesure une fois par an"],
        answer: 0,
        explain: "Une commande n'est comptée que si elle est livrée à la date promise ET complète.",
      },
    ],
    'rotation-couverture': [
      () => {
        const cogs = int(600, 3000, 100) * 1000
        const stock = int(100, 600, 50) * 1000
        return numQuestion({
          q: `Le coût des marchandises vendues est de ${fmt(cogs)} € par an et le stock moyen de ${fmt(stock)} €. Quelle est la rotation annuelle ?`,
          answer: cogs / stock,
          unit: 'fois',
          digits: 1,
          explain: `Rotation = ${fmt(cogs)} / ${fmt(stock)} = ${fmt(cogs / stock, 1)} fois par an.`,
          wrong: [stock / cogs, cogs - stock, (cogs / stock) * 2, (cogs / stock) / 2],
        })
      },
      () => {
        const rot = pick([4, 6, 8, 12])
        return numQuestion({
          q: `Une rotation annuelle de ${rot} correspond à une couverture de combien de jours (année de 360 jours) ?`,
          answer: 360 / rot,
          unit: 'jours',
          digits: 0,
          explain: `Couverture = 360 / ${rot} = ${fmt(360 / rot, 0)} jours.`,
          wrong: [360 * rot, rot * 30, 365 - rot, (360 / rot) * 2],
        })
      },
      {
        q: "Que signifie une couverture de stock de 45 jours ?",
        choices: ["Le stock couvre 45 jours de ventes", "Le stock est renouvelé tous les 45 mois", "Le stock a été acheté il y a 45 jours", "45 % du stock est invendable"],
        answer: 0,
        explain: "La couverture indique combien de temps le stock actuel permet de vendre au rythme actuel de la demande.",
      },
      {
        q: "Quelle évolution est généralement positive pour la rotation ?",
        choices: ["Une rotation qui augmente", "Une rotation qui tombe à zéro", "Une couverture qui augmente sans raison", "Un stock qui double sans ventes"],
        answer: 0,
        explain: "Une rotation plus élevée signifie que l'argent immobilisé en stock revient plus vite, à condition de ne pas créer de ruptures.",
      },
    ],
  },

  lessons: [
    {
      id: 'couts-logistiques',
      title: 'Les coûts logistiques',
      minutes: 5,
      cards: [
        {
          type: 'text',
          title: 'Combien coûte la logistique ?',
          body: "Les **coûts logistiques** regroupent tout ce que coûte le fait de **déplacer et stocker** des produits : transport, entreposage, stocks immobilisés, manutention, administration des commandes. Ils représentent souvent **entre 5 et 15 %** du chiffre d'affaires, selon les secteurs.",
        },
        {
          type: 'list',
          title: 'Les grands postes',
          items: [
            ['Transport', 'Amont (approvisionnement) et aval (livraison clients).'],
            ['Entreposage', 'Loyer, énergie, personnel, équipements.'],
            ['Stocks', 'Coût de possession : capital immobilisé, assurance, obsolescence.'],
            ['Administration', 'Traitement des commandes, facturation, système d\'information.'],
          ],
        },
        {
          type: 'formula',
          title: 'Les ratios de coût',
          formula: 'Coût logistique par commande = coûts logistiques totaux / nombre de commandes',
          legend: [
            ['Part du CA', 'Coûts logistiques / chiffre d\'affaires × 100.'],
            ['Coût par unité', 'Coûts logistiques / unités expédiées.'],
          ],
          example: '1,2 M€ de coûts logistiques, 60 000 commandes, 15 M€ de CA : 20 € par commande et 8 % du chiffre d\'affaires.',
        },
        {
          type: 'text',
          title: 'Attention aux arbitrages',
          body: "Réduire un poste peut en augmenter un autre : **moins de stock** fait baisser le coût de possession mais peut augmenter les **ruptures** et les **livraisons express**. D'où l'idée de **coût total logistique** : on optimise l'ensemble, pas un poste isolé.",
        },
        {
          type: 'key',
          points: [
            'Postes : transport, entreposage, stocks, administration.',
            'Ratios : coût par commande, par unité, part du chiffre d\'affaires.',
            'Optimiser le coût total, pas un poste isolé.',
          ],
        },
      ],
      quiz: [
        () => {
          const cost = int(500, 2500, 100) * 1000
          const orders = int(20, 100, 10) * 1000
          return numQuestion({
            q: `Les coûts logistiques annuels sont de ${fmt(cost)} € pour ${fmt(orders)} commandes. Quel est le coût logistique par commande ?`,
            answer: cost / orders,
            unit: '€',
            digits: 2,
            explain: `${fmt(cost)} / ${fmt(orders)} = ${fmt(cost / orders, 2)} € par commande.`,
            wrong: [cost * orders, orders / cost, cost / orders * 2, cost / orders / 2],
          })
        },
        () => {
          const ca = int(10, 50, 5) * 1000000
          const share = pick([6, 8, 10, 12])
          return numQuestion({
            q: `Une entreprise réalise ${fmt(ca)} € de chiffre d'affaires et ses coûts logistiques représentent ${share} % de celui-ci. Quel est le montant des coûts logistiques ?`,
            answer: (ca * share) / 100,
            unit: '€',
            digits: 0,
            explain: `${fmt(ca)} × ${share} % = ${fmt((ca * share) / 100, 0)} €.`,
            wrong: [ca * share, ca / share, ca - (ca * share) / 100, (ca * share) / 10],
          })
        },
        () => {
          const cost = int(100, 600, 50) * 1000
          const units = int(100, 500, 50) * 1000
          return numQuestion({
            q: `${fmt(cost)} € de coûts logistiques pour ${fmt(units)} unités expédiées : quel est le coût par unité ?`,
            answer: cost / units,
            unit: '€',
            digits: 2,
            explain: `${fmt(cost)} / ${fmt(units)} = ${fmt(cost / units, 2)} € par unité.`,
            wrong: [cost * units, units / cost, (cost / units) * 2, cost / units + 1],
          })
        },
        {
          q: 'Quel est un poste des coûts logistiques ?',
          choices: ['Le transport', 'Le salaire du directeur général', 'La publicité à la télévision', 'Le loyer du siège social'],
          answer: 0,
          explain: 'Transport, entreposage, stocks et administration des commandes forment les coûts logistiques.',
        },
        {
          q: 'Quel ordre de grandeur représentent souvent les coûts logistiques ?',
          choices: ['5 à 15 % du chiffre d\'affaires', '90 % du chiffre d\'affaires', 'Moins de 0,1 % du chiffre d\'affaires', '50 % du chiffre d\'affaires'],
          answer: 0,
          explain: 'Selon les secteurs, la logistique pèse en général entre 5 et 15 % du chiffre d\'affaires.',
        },
        {
          q: 'Que comprend le coût de possession du stock ?',
          choices: ['Capital immobilisé, assurance et obsolescence', 'Seulement le prix d\'achat des produits', 'Uniquement le salaire des préparateurs', 'Le coût des campagnes publicitaires'],
          answer: 0,
          explain: 'Détenir un stock coûte un capital immobilisé, des assurances, de la place et un risque de perte de valeur.',
        },
        {
          q: 'Pourquoi raisonner en coût total logistique ?',
          choices: ['Réduire un poste peut en augmenter un autre', 'Pour éviter de calculer chaque poste', 'Pour ne suivre que le transport', 'Pour supprimer les stocks'],
          answer: 0,
          explain: 'Par exemple, moins de stock peut provoquer plus de transports express : il faut optimiser l\'ensemble.',
        },
        {
          q: 'Quel ratio permet de comparer deux entreprises de tailles différentes ?',
          choices: ['La part des coûts dans le chiffre d\'affaires', 'Le montant brut des coûts logistiques', 'Le nombre total de camions possédés', 'La surface de l\'entrepôt principal'],
          answer: 0,
          explain: 'Un pourcentage neutralise l\'effet de taille et rend la comparaison possible.',
        },
      ],
    },

    {
      id: 'productivite-entrepot',
      title: 'Productivité et qualité en entrepôt',
      minutes: 5,
      cards: [
        {
          type: 'text',
          title: 'Mesurer le travail de l\'entrepôt',
          body: "Quelques indicateurs suffisent à piloter un entrepôt : la **productivité** (combien de lignes ou colis par heure), la **qualité** (erreurs de préparation) et l'**utilisation** des ressources (taux de remplissage, occupation des emplacements).",
        },
        {
          type: 'list',
          title: 'Les indicateurs courants',
          items: [
            ['Lignes par heure', 'Lignes de commande préparées / heures travaillées : mesure la productivité du picking.'],
            ['Taux d\'erreur de préparation', 'Commandes avec erreur / commandes préparées : en parts pour mille ou en %.'],
            ['Taux d\'occupation', 'Emplacements occupés / emplacements disponibles.'],
            ['Taux de casse ou de démarque', 'Valeur perdue (casse, vol, erreurs) / valeur du stock ou des ventes.'],
            ['Délai de préparation', 'Temps entre la réception de la commande et son expédition.'],
          ],
        },
        {
          type: 'formula',
          title: 'La productivité en lignes par heure',
          formula: 'Productivité = lignes préparées / heures travaillées',
          legend: [
            ['Lignes', 'Une ligne = une référence demandée sur une commande.'],
            ['Heures', 'Heures réellement travaillées par les préparateurs.'],
          ],
          example: '1 800 lignes préparées en 120 heures : 15 lignes par heure.',
        },
        {
          type: 'text',
          title: 'Un indicateur seul peut tromper',
          body: "Un préparateur qui va très vite fait peut-être plus d'erreurs. On suit donc **productivité ET qualité** ensemble. De même, un taux d'occupation de 100 % semble idéal mais bloque tout nouveau stockage : on vise souvent **80 à 90 %**.",
        },
        {
          type: 'key',
          points: [
            'Productivité = lignes préparées / heures travaillées.',
            'Taux d\'erreur = commandes avec erreur / commandes préparées.',
            'Suivre productivité et qualité ensemble.',
            'Un taux d\'occupation trop proche de 100 % bloque l\'entrepôt.',
          ],
        },
      ],
      quiz: [
        () => {
          const hours = int(80, 200, 10)
          const rate = int(12, 25)
          const lines = hours * rate
          return numQuestion({
            q: `${fmt(lines)} lignes ont été préparées en ${hours} heures de travail. Quelle est la productivité ?`,
            answer: lines / hours,
            unit: 'lignes/h',
            digits: 1,
            explain: `${fmt(lines)} / ${hours} = ${fmt(lines / hours, 1)} lignes par heure.`,
            wrong: [lines * hours, hours / lines, lines / hours * 2, lines - hours],
          })
        },
        () => {
          const orders = int(2000, 8000, 500)
          const err = Math.round(orders * (int(5, 30) / 1000))
          return numQuestion({
            q: `Sur ${fmt(orders)} commandes préparées, ${err} contiennent une erreur. Quel est le taux d'erreur ?`,
            answer: (err / orders) * 100,
            unit: '%',
            digits: 2,
            max: 100,
            explain: `${err} / ${fmt(orders)} × 100 = ${fmt((err / orders) * 100, 2)} %.`,
          })
        },
        () => {
          const total = int(1000, 5000, 500)
          const used = Math.round(total * (int(60, 98) / 100))
          return numQuestion({
            q: `Un entrepôt compte ${fmt(total)} emplacements, dont ${fmt(used)} occupés. Quel est le taux d'occupation ?`,
            answer: (used / total) * 100,
            unit: '%',
            digits: 1,
            max: 100,
            explain: `${fmt(used)} / ${fmt(total)} × 100 = ${fmt((used / total) * 100, 1)} %.`,
          })
        },
        {
          q: 'Que mesure le nombre de lignes par heure ?',
          choices: ['La productivité du picking', 'Le taux de service client', 'La rotation du stock', 'Le coût du transport'],
          answer: 0,
          explain: 'On compte les lignes de commande préparées par heure travaillée : c\'est la productivité de la préparation.',
        },
        {
          q: 'Pourquoi suivre la qualité avec la productivité ?',
          choices: ['Aller vite peut faire plus d\'erreurs', 'La qualité remplace la productivité', 'La productivité fait baisser les erreurs', 'Les deux se mesurent pareil'],
          answer: 0,
          explain: 'Un gain de vitesse obtenu au prix d\'erreurs est un faux progrès : il faut regarder les deux ensemble.',
        },
        {
          q: 'Pourquoi un taux d\'occupation de 100 % pose-t-il problème ?',
          choices: ['Impossible de stocker de nouveaux produits', 'Cela réduit le nombre de commandes', 'Cela supprime les erreurs de préparation', 'Cela fait baisser la rotation'],
          answer: 0,
          explain: 'Sans emplacement libre, les réceptions s\'accumulent sur les quais et le réapprovisionnement se bloque.',
        },
        {
          q: 'Que signifie la démarque inconnue ?',
          choices: ['Des pertes de stock sans cause identifiée', 'Une réduction de prix accordée aux clients', 'Une marque de distributeur sans nom', 'Une erreur de saisie du prix'],
          answer: 0,
          explain: 'Elle regroupe vols, casse et erreurs dont l\'origine n\'est pas retrouvée à l\'inventaire.',
        },
        {
          q: 'Que mesure le délai de préparation ?',
          choices: ['Le temps entre la commande et l\'expédition', 'Le temps de trajet vers le client', 'La durée de vie d\'un produit', 'Le temps de formation d\'un salarié'],
          answer: 0,
          explain: 'Il commence à la réception de la commande et se termine quand elle quitte l\'entrepôt.',
        },
      ],
    },

    {
      id: 'tableau-de-bord',
      title: 'Construire un tableau de bord',
      minutes: 5,
      cards: [
        {
          type: 'text',
          title: 'Piloter avec peu d\'indicateurs',
          body: "Un **tableau de bord** réunit les indicateurs clés (KPI) dont un responsable a besoin pour **décider**. Trop d'indicateurs noient l'information ; un bon tableau en contient **5 à 10**, lisibles d'un coup d'œil.",
        },
        {
          type: 'list',
          title: 'Un bon KPI',
          items: [
            ['Pertinent', 'Il mesure ce qui compte pour la stratégie.'],
            ['Mesurable', 'On sait le calculer de la même façon à chaque période.'],
            ['Compris', 'Chacun sait ce qu\'il signifie et comment agir dessus.'],
            ['Comparé', 'On le compare à un objectif et à la période précédente.'],
          ],
        },
        {
          type: 'list',
          title: 'Les familles de KPI',
          items: [
            ['Service', 'Taux de service, OTIF, délai de livraison.'],
            ['Coût', 'Coût logistique par commande, coût de transport par colis.'],
            ['Stock', 'Rotation, couverture, taux de rupture, stocks dormants.'],
            ['Qualité', 'Erreurs de préparation, casse, réclamations.'],
            ['Productivité', 'Lignes par heure, TRS.'],
          ],
        },
        {
          type: 'text',
          title: 'Lire et agir',
          body: "Un chiffre n'a de sens que **comparé** : à l'objectif (97 % visé, 94 % réalisé), à la période précédente, à un autre site. On utilise des **couleurs** (vert, orange, rouge) — avec un **libellé** ou un symbole, jamais la couleur seule — et on prévoit pour chaque écart **une action et un responsable**.",
        },
        {
          type: 'key',
          points: [
            'Un tableau de bord = 5 à 10 KPI pertinents, lisibles d\'un coup d\'œil.',
            'Bon KPI : pertinent, mesurable, compris, comparé à un objectif.',
            'Familles : service, coût, stock, qualité, productivité.',
            'Chaque écart appelle une action et un responsable.',
          ],
        },
      ],
      quiz: [
        () => {
          const target = int(95, 99)
          const real = target - int(1, 5)
          return numQuestion({
            q: `Objectif de taux de service : ${target} %. Résultat : ${real} %. De combien de points le résultat est-il sous l'objectif ?`,
            answer: target - real,
            unit: 'points',
            digits: 0,
            explain: `${target} − ${real} = ${target - real} points : l'objectif n'est pas atteint.`,
            wrong: [real, target + real, (target - real) * 2, target - real + 3],
          })
        },
        () => {
          const prev = int(300, 500, 10)
          const now = Math.round(prev * (1 + int(3, 15) / 100))
          return numQuestion({
            q: `Les réclamations sont passées de ${prev} le mois dernier à ${now} ce mois-ci. Quelle est l'évolution en % ?`,
            answer: ((now - prev) / prev) * 100,
            unit: '%',
            digits: 1,
            explain: `(${now} − ${prev}) / ${prev} × 100 = ${fmt(((now - prev) / prev) * 100, 1)} %.`,
            wrong: [((prev - now) / prev) * 100, ((now - prev) / now) * 100, now - prev, ((now - prev) / prev) * 10],
          })
        },
        {
          q: 'Combien de KPI contient en général un bon tableau de bord ?',
          choices: ['Environ 5 à 10', 'Plus de 100', 'Un seul', 'Exactement 50'],
          answer: 0,
          explain: 'Trop de chiffres noient l\'information : un tableau lisible en contient quelques-uns, choisis avec soin.',
        },
        {
          q: 'Pourquoi comparer un KPI à un objectif ?',
          choices: ['Un chiffre isolé ne dit pas si c\'est bon', 'Pour changer l\'objectif chaque mois', 'Pour éviter de mesurer', 'Pour cacher les mauvais résultats'],
          answer: 0,
          explain: 'Savoir que le taux de service est de 94 % n\'a de sens que par rapport à l\'objectif et aux mois précédents.',
        },
        {
          q: 'Quelle est la bonne pratique pour les couleurs d\'un tableau de bord ?',
          choices: ['Ajouter un libellé ou un symbole', 'Utiliser uniquement la couleur', 'Supprimer toutes les couleurs', 'Utiliser dix couleurs différentes'],
          answer: 0,
          explain: 'Une personne daltonienne ne distingue pas toujours le rouge du vert : le libellé ou le symbole garantit la lisibilité.',
        },
        {
          q: 'Quel KPI appartient à la famille « stock » ?',
          choices: ['Le taux de rupture', 'Le nombre de lignes par heure', 'Le coût par colis livré', 'Le taux d\'erreur de préparation'],
          answer: 0,
          explain: 'Rupture, rotation, couverture et stocks dormants sont les KPI de stock.',
        },
        {
          q: 'Que faut-il associer à chaque écart important ?',
          choices: ['Une action et un responsable', 'Une nouvelle couleur de tableau', 'Un autre indicateur à suivre', 'Un rapport de cent pages'],
          answer: 0,
          explain: 'Un tableau de bord sert à décider : sans action ni responsable, l\'écart restera sans suite.',
        },
        {
          q: 'Qu\'est-ce qu\'un KPI mal choisi ?',
          choices: ['Un chiffre que personne ne sait influencer', 'Un chiffre comparé à un objectif', 'Un chiffre calculé toujours pareil', 'Un chiffre lié à la stratégie'],
          answer: 0,
          explain: 'Un indicateur sur lequel l\'équipe ne peut pas agir ne sert pas à piloter.',
        },
      ],
    },

    {
      id: 'kpi-fournisseurs',
      title: 'Évaluer un fournisseur',
      minutes: 5,
      cards: [
        {
          type: 'text',
          title: 'Mesurer la performance des fournisseurs',
          body: "Un fournisseur se juge sur des **faits**, pas sur des impressions. Les achats suivent quelques indicateurs de façon régulière pour décider de **continuer, améliorer ou remplacer** un fournisseur.",
        },
        {
          type: 'list',
          title: 'Les critères classiques (QCDRSE)',
          items: [
            ['Qualité', 'Taux de non-conformité, réclamations (souvent en ppm : pièces défectueuses par million).'],
            ['Coût', 'Prix, évolution des prix, coût total.'],
            ['Délai', 'Taux de livraison à l\'heure, délai moyen.'],
            ['Réactivité', 'Rapidité de réponse, flexibilité face à un changement.'],
            ['Service', 'Qualité du suivi et du support.'],
            ['RSE', 'Respect des règles sociales et environnementales.'],
          ],
        },
        {
          type: 'formula',
          title: 'Taux de livraison à l\'heure et ppm',
          formula: 'Livraison à l\'heure = livraisons à l\'heure / livraisons totales × 100',
          legend: [
            ['ppm', 'Parties par million : (pièces défectueuses / pièces livrées) × 1 000 000.'],
            ['Note globale', 'Moyenne pondérée des critères, selon leur importance.'],
          ],
          example: '48 livraisons à l\'heure sur 60 : 80 %. 30 pièces défectueuses sur 120 000 livrées : 250 ppm.',
        },
        {
          type: 'example',
          title: 'Note globale pondérée',
          body: "Qualité 80/100 (poids 40 %), coût 70 (30 %), délai 90 (30 %).\n\nNote = 80 × 0,4 + 70 × 0,3 + 90 × 0,3 = 32 + 21 + 27 = **80/100**.\n\nLes **poids** reflètent les priorités de l'entreprise : une pièce critique donne plus de poids à la qualité.",
        },
        {
          type: 'key',
          points: [
            'Évaluer sur des faits : qualité, coût, délai, réactivité, service, RSE.',
            'Livraison à l\'heure = livraisons à l\'heure / livraisons totales.',
            'ppm = défauts / pièces livrées × 1 000 000.',
            'La note globale pondère les critères selon les priorités.',
          ],
        },
      ],
      quiz: [
        () => {
          const total = int(40, 120, 10)
          const ok = Math.round(total * (int(75, 98) / 100))
          return numQuestion({
            q: `Un fournisseur a effectué ${total} livraisons dont ${ok} à l'heure. Quel est son taux de livraison à l'heure ?`,
            answer: (ok / total) * 100,
            unit: '%',
            digits: 1,
            max: 100,
            explain: `${ok} / ${total} × 100 = ${fmt((ok / total) * 100, 1)} %.`,
          })
        },
        () => {
          const delivered = int(50, 400, 50) * 1000
          const defects = int(5, 60, 5)
          return numQuestion({
            q: `${defects} pièces défectueuses ont été relevées sur ${fmt(delivered)} pièces livrées. Combien cela fait-il en ppm ?`,
            answer: (defects / delivered) * 1000000,
            unit: 'ppm',
            digits: 0,
            explain: `${defects} / ${fmt(delivered)} × 1 000 000 = ${fmt((defects / delivered) * 1000000, 0)} ppm.`,
            wrong: [(defects / delivered) * 100, (defects / delivered) * 1000, (delivered / defects), (defects / delivered) * 1000000 * 2],
          })
        },
        () => {
          const q = int(60, 95, 5)
          const c = int(60, 95, 5)
          const d = int(60, 95, 5)
          const note = q * 0.4 + c * 0.3 + d * 0.3
          return numQuestion({
            q: `Un fournisseur obtient ${q} en qualité (poids 40 %), ${c} en coût (30 %) et ${d} en délai (30 %). Quelle est sa note globale ?`,
            answer: note,
            unit: '/100',
            digits: 1,
            explain: `${q} × 0,4 + ${c} × 0,3 + ${d} × 0,3 = ${fmt(note, 1)}.`,
            wrong: [(q + c + d) / 3, q + c + d, Math.max(q, c, d), note + 5],
          })
        },
        {
          q: 'Que signifie le sigle QCD ?',
          choices: ['Qualité, coût, délai', 'Quantité, capacité, distance', 'Qualification, contrat, demande', 'Qualité, climat, durabilité'],
          answer: 0,
          explain: 'Qualité, coût et délai sont les trois critères historiques d\'évaluation d\'un fournisseur.',
        },
        {
          q: 'Que mesure le ppm ?',
          choices: ['Le nombre de pièces défectueuses par million', 'Le prix par mètre', 'Le poids par palette', 'Les paiements par mois'],
          answer: 0,
          explain: 'Le ppm (parties par million) exprime très précisément un faible taux de défauts.',
        },
        {
          q: 'Pourquoi pondérer les critères de la note globale ?',
          choices: ['Tous n\'ont pas la même importance', 'Pour obtenir une note plus élevée', 'Pour éviter d\'évaluer la qualité', 'Parce que la loi l\'impose'],
          answer: 0,
          explain: 'Pour une pièce critique, la qualité pèse plus que le prix : le poids traduit cette priorité.',
        },
        {
          q: 'Quelle décision peut suivre une mauvaise évaluation ?',
          choices: ['Un plan d\'amélioration ou un changement de fournisseur', 'Une augmentation automatique des commandes', 'La suppression de tout contrôle qualité', 'L\'arrêt de toute évaluation future'],
          answer: 0,
          explain: 'On demande d\'abord un plan d\'action ; si rien ne change, on envisage de remplacer le fournisseur.',
        },
        {
          q: 'Que représente le critère RSE ?',
          choices: ['Le respect des règles sociales et environnementales', 'La rapidité de réponse du service client', 'Le réseau de stockage européen', 'Le rendement des équipements'],
          answer: 0,
          explain: 'La responsabilité sociétale couvre les conditions de travail, l\'environnement et l\'éthique du fournisseur.',
        },
      ],
    },
  ],
}
