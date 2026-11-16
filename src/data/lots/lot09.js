// Lot 9 — KPI : Atelier (2 formules, 3 défis Excel, 2 études de cas) + Anglais (KPI, réunions et reporting).
import { fmt, int, pick } from '../gen.js'

export default {
  formulas: [
    {
      id: 'taux-rupture',
      title: 'Taux de rupture et coût de la rupture',
      short: 'Taux de rupture = lignes non servies / lignes demandées',
      course: {
        purpose:
          "Le **taux de rupture** mesure la part des demandes que l'on n'a pas pu satisfaire faute de stock. Il complète le taux de service (qui est son complément à 100 %) et permet de chiffrer le **manque à gagner**.",
        formulas: ['Taux de rupture = lignes non servies / lignes demandées × 100', 'Taux de service = 100 % − taux de rupture', 'Manque à gagner = quantité manquante × marge unitaire'],
        terms: [
          ['Ligne', 'Une référence demandée sur une commande.'],
          ['Non servie', 'Ligne non livrée ou livrée incomplète à cause du stock.'],
          ['Marge unitaire', 'Prix de vente − coût d\'achat d\'une unité.'],
        ],
        example: {
          statement: '4 000 lignes demandées, 120 non servies. Quantité manquante 300 unités à 8 € de marge.',
          steps: ['Taux de rupture = 120 / 4 000 = 3 %', 'Taux de service = 97 %', 'Manque à gagner = 300 × 8 = 2 400 €'],
          result: 'Chaque point de rupture a un prix : 2 400 € de marge perdue sur la période.',
        },
        exercises: [
          () => {
            const asked = int(2000, 8000, 500)
            const miss = Math.round(asked * (int(10, 60) / 1000))
            return {
              kind: 'number',
              statement: 'Calcule le taux de rupture de la période.',
              data: [['Lignes demandées', fmt(asked)], ['Lignes non servies', fmt(miss)]],
              question: 'Taux de rupture (en %) ?',
              answer: (miss / asked) * 100,
              unit: '%',
              tolerance: 0.1,
              steps: [`${fmt(miss)} / ${fmt(asked)} × 100 = ${fmt((miss / asked) * 100, 2)} %`],
              conclusion: 'Un taux de rupture de quelques pourcents peut déjà coûter cher en ventes perdues.',
            }
          },
          () => {
            const rupt = int(10, 80) / 10
            return {
              kind: 'number',
              statement: 'Déduis le taux de service du taux de rupture.',
              data: [['Taux de rupture', `${fmt(rupt)} %`]],
              question: 'Taux de service (en %) ?',
              answer: 100 - rupt,
              unit: '%',
              tolerance: 0.1,
              steps: [`100 − ${fmt(rupt)} = ${fmt(100 - rupt, 1)} %`],
              conclusion: 'Service et rupture sont les deux faces d\'une même mesure.',
            }
          },
          () => {
            const qty = int(100, 900, 50)
            const margin = int(3, 20)
            return {
              kind: 'number',
              statement: 'Chiffre le manque à gagner dû à la rupture.',
              data: [['Quantité manquante', `${qty} unités`], ['Marge unitaire', `${margin} €`]],
              question: 'Manque à gagner (en €) ?',
              answer: qty * margin,
              unit: '€',
              tolerance: 1,
              steps: [`${qty} × ${margin} = ${fmt(qty * margin, 0)} €`],
              conclusion: 'Ce calcul minimise la perte réelle : un client déçu peut aussi ne plus revenir.',
            }
          },
          () => {
            const asked = int(3000, 9000, 500)
            const rupt = int(2, 6)
            const target = rupt - int(1, 2)
            const gain = Math.round((asked * (rupt - target)) / 100)
            return {
              kind: 'number',
              statement: 'On vise un taux de rupture plus bas. Combien de lignes supplémentaires seraient servies ?',
              data: [['Lignes demandées', fmt(asked)], ['Taux de rupture actuel', `${rupt} %`], ['Taux visé', `${target} %`]],
              question: 'Lignes supplémentaires servies (en lignes) ?',
              answer: (asked * (rupt - target)) / 100,
              unit: 'lignes',
              tolerance: 1,
              steps: [`Écart = ${rupt} − ${target} = ${rupt - target} points`, `${fmt(asked)} × ${rupt - target} % = ${fmt(gain, 0)} lignes`],
              conclusion: 'À l\'échelle de milliers de lignes, un point de rupture représente beaucoup de ventes.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'asked', label: 'Lignes demandées', value: 4000 },
            { key: 'miss', label: 'Lignes non servies', value: 120 },
            { key: 'qty', label: 'Quantité manquante', unit: 'unités', value: 300 },
            { key: 'margin', label: 'Marge unitaire', unit: '€', value: 8 },
          ],
          outputs: [
            { label: 'Taux de rupture', unit: '%', digits: 2, highlight: true, fn: (n) => (n.asked > 0 ? (n.miss / n.asked) * 100 : 0) },
            { label: 'Taux de service', unit: '%', digits: 2, fn: (n) => (n.asked > 0 ? 100 - (n.miss / n.asked) * 100 : 0) },
            { label: 'Manque à gagner', unit: '€', digits: 0, fn: (n) => n.qty * n.margin },
          ],
          steps: (n) => [`Rupture = ${fmt(n.miss)} / ${fmt(n.asked)} = ${fmt(n.asked > 0 ? (n.miss / n.asked) * 100 : 0, 2)} %`],
          note: 'Le manque à gagner ne compte que la marge perdue immédiatement.',
        },
      },
    },

    {
      id: 'cout-logistique-commande',
      title: 'Coût logistique par commande',
      short: 'Coût par commande = coûts totaux / nombre de commandes',
      course: {
        purpose:
          "Pour comparer des périodes ou des sites, on ramène les coûts logistiques à **l'unité de travail** : la commande, le colis ou l'unité. On suit aussi la **part du chiffre d'affaires** consacrée à la logistique.",
        formulas: ['Coût par commande = coûts logistiques / commandes', 'Part du CA = coûts logistiques / CA × 100', 'Coûts totaux = transport + entreposage + stocks + administration'],
        terms: [
          ['Transport', 'Amont et aval.'],
          ['Entreposage', 'Loyer, énergie, personnel, équipements.'],
          ['Stocks', 'Coût de possession (capital immobilisé, assurance, obsolescence).'],
          ['Administration', 'Traitement des commandes et système d\'information.'],
        ],
        example: {
          statement: 'Transport 600 k€, entreposage 350 k€, stocks 150 k€, administration 100 k€ pour 60 000 commandes et 15 M€ de CA.',
          steps: ['Coûts totaux = 600 + 350 + 150 + 100 = 1 200 k€', 'Coût par commande = 1 200 000 / 60 000 = 20 €', 'Part du CA = 1,2 / 15 = 8 %'],
          result: 'Chaque commande coûte 20 € à traiter et livrer, soit 8 % du chiffre d\'affaires.',
        },
        exercises: [
          () => {
            const t = int(300, 900, 50)
            const e = int(200, 500, 50)
            const s = int(100, 300, 50)
            const a = int(50, 200, 50)
            const orders = int(30, 90, 10) * 1000
            const total = (t + e + s + a) * 1000
            return {
              kind: 'number',
              statement: 'Calcule le coût logistique par commande.',
              data: [['Transport', `${t} k€`], ['Entreposage', `${e} k€`], ['Stocks', `${s} k€`], ['Administration', `${a} k€`], ['Commandes', fmt(orders)]],
              question: 'Coût par commande (en €) ?',
              answer: total / orders,
              unit: '€',
              tolerance: 0.05,
              steps: [`Total = ${t} + ${e} + ${s} + ${a} = ${t + e + s + a} k€`, `${fmt(total)} / ${fmt(orders)} = ${fmt(total / orders, 2)} €`],
              conclusion: 'Ce ratio permet de comparer des mois ou des sites de tailles différentes.',
            }
          },
          () => {
            const ca = int(8, 40, 2)
            const cost = Math.round(ca * (int(5, 14) / 100) * 100) / 100
            return {
              kind: 'number',
              statement: 'Calcule la part de la logistique dans le chiffre d\'affaires.',
              data: [['Chiffre d\'affaires', `${ca} M€`], ['Coûts logistiques', `${fmt(cost)} M€`]],
              question: 'Part du CA (en %) ?',
              answer: (cost / ca) * 100,
              unit: '%',
              tolerance: 0.1,
              steps: [`${fmt(cost)} / ${ca} × 100 = ${fmt((cost / ca) * 100, 1)} %`],
              conclusion: 'On compare ce pourcentage au secteur : 5 à 15 % est courant.',
            }
          },
          () => {
            const cost = int(15, 30)
            const orders = int(40, 100, 10) * 1000
            const cut = pick([5, 8, 10])
            return {
              kind: 'number',
              statement: 'Une action réduit le coût par commande. Calcule l\'économie annuelle.',
              data: [['Coût actuel par commande', `${cost} €`], ['Commandes par an', fmt(orders)], ['Baisse du coût', `${cut} %`]],
              question: 'Économie annuelle (en €) ?',
              answer: (cost * cut * orders) / 100,
              unit: '€',
              tolerance: 10,
              steps: [`Économie par commande = ${cost} × ${cut} % = ${fmt((cost * cut) / 100, 2)} €`, `Économie annuelle = ${fmt((cost * cut) / 100, 2)} × ${fmt(orders)} = ${fmt((cost * cut * orders) / 100, 0)} €`],
              conclusion: 'Quelques pourcents de gain sur un petit coût unitaire représentent une somme importante.',
            }
          },
          () => {
            const total = int(800, 2000, 100)
            const share = pick([30, 40, 50, 55])
            return {
              kind: 'number',
              statement: 'Le transport représente une part des coûts logistiques.',
              data: [['Coûts logistiques', `${fmt(total)} k€`], ['Part du transport', `${share} %`]],
              question: 'Coût du transport (en k€) ?',
              answer: (total * share) / 100,
              unit: 'k€',
              tolerance: 0.5,
              steps: [`${fmt(total)} × ${share} % = ${fmt((total * share) / 100, 0)} k€`],
              conclusion: 'Le transport est souvent le premier poste : c\'est là que se trouvent les plus grosses économies.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 't', label: 'Transport', unit: 'k€', value: 600 },
            { key: 'e', label: 'Entreposage', unit: 'k€', value: 350 },
            { key: 's', label: 'Stocks (coût de possession)', unit: 'k€', value: 150 },
            { key: 'a', label: 'Administration', unit: 'k€', value: 100 },
            { key: 'orders', label: 'Commandes', value: 60000 },
            { key: 'ca', label: 'Chiffre d\'affaires', unit: 'k€', value: 15000 },
          ],
          outputs: [
            { label: 'Coûts totaux', unit: 'k€', digits: 0, fn: (n) => n.t + n.e + n.s + n.a },
            { label: 'Coût par commande', unit: '€', digits: 2, highlight: true, fn: (n) => (n.orders > 0 ? ((n.t + n.e + n.s + n.a) * 1000) / n.orders : 0) },
            { label: 'Part du chiffre d\'affaires', unit: '%', digits: 1, fn: (n) => (n.ca > 0 ? ((n.t + n.e + n.s + n.a) / n.ca) * 100 : 0) },
          ],
          steps: (n) => [`Total = ${fmt(n.t + n.e + n.s + n.a)} k€`, `Par commande = ${fmt((n.t + n.e + n.s + n.a) * 1000)} / ${fmt(n.orders)}`],
          note: 'Les valeurs sont en k€ pour les coûts et le chiffre d\'affaires.',
        },
      },
    },
  ],

  excel: [
    {
      id: 'otif-excel',
      fn: 'NB.SI.ENS',
      level: 3,
      tier: 2,
      title: "Le taux OTIF d'un mois",
      context: 'Tu calcules le taux de commandes livrées à l\'heure ET complètes.',
      instruction: 'En **D2**, calcule le **taux OTIF** : commandes « Oui » à l\'heure ET « Oui » complètes ÷ nombre de commandes × 100, **arrondi à 1 décimale**.',
      generate() {
        const p = int(80, 97) / 100
        return { rows: [['Commande', 'À l\'heure', 'Complète'], ...Array.from({ length: 20 }, (_, i) => [`C${200 + i}`, Math.random() < p ? 'Oui' : 'Non', Math.random() < p ? 'Oui' : 'Non'])], extra: { D1: 'OTIF (%)' } }
      },
      target: 'D2',
      solution: '=ARRONDI(NB.SI.ENS(B2:B21;"Oui";C2:C21;"Oui")/NBVAL(A2:A21)*100;1)',
      mustUse: ['NB.SI.ENS', 'ARRONDI'],
      hints: ['NB.SI.ENS(B2:B21;"Oui";C2:C21;"Oui") compte les commandes qui remplissent les deux conditions.', 'Divise par NBVAL(A2:A21), multiplie par 100 et arrondis.'],
      explain: 'L\'OTIF exige les deux conditions en même temps : NB.SI.ENS compte uniquement les lignes où l\'heure ET la complétude sont « Oui ».',
    },
    {
      id: 'cout-par-commande-excel',
      fn: 'SOMME',
      level: 2,
      tier: 5,
      title: 'Le coût logistique par commande',
      context: 'Tu consolides les coûts logistiques du trimestre.',
      instruction: 'En **B6**, calcule le **coût par commande** : somme des 4 postes de coûts ÷ nombre de commandes, **arrondi à 2 décimales**.',
      generate() {
        return { rows: [['Transport (€)', int(150, 400, 10) * 1000], ['Entreposage (€)', int(80, 250, 10) * 1000], ['Stocks (€)', int(40, 120, 10) * 1000], ['Administration (€)', int(20, 80, 10) * 1000], ['Commandes', int(15, 45, 5) * 1000]], extra: { A6: 'Coût par commande (€)' } }
      },
      target: 'B6',
      solution: '=ARRONDI(SOMME(B1:B4)/B5;2)',
      mustUse: ['SOMME', 'ARRONDI'],
      hints: ['Les 4 postes de coûts sont en B1:B4 et le nombre de commandes en B5.', 'SOMME(B1:B4)/B5, puis ARRONDI(…;2).'],
      explain: 'On additionne tous les postes avant de diviser : le coût par commande intègre transport, entreposage, stocks et administration.',
    },
    {
      id: 'note-fournisseur-excel',
      fn: 'SOMMEPROD',
      level: 3,
      tier: 5,
      title: "La note globale d'un fournisseur",
      context: 'Tu évalues un fournisseur avec trois critères pondérés.',
      instruction: 'En **B6**, calcule la **note globale** : somme des notes × poids (colonne C), **arrondie à 1 décimale**.',
      generate() {
        const w = pick([[0.4, 0.3, 0.3], [0.5, 0.3, 0.2], [0.3, 0.3, 0.4]])
        return { rows: [['Critère', 'Note', 'Poids'], ['Qualité', int(60, 98), w[0]], ['Coût', int(60, 98), w[1]], ['Délai', int(60, 98), w[2]]], extra: { A6: 'Note globale' } }
      },
      target: 'B6',
      solution: '=ARRONDI(SOMMEPROD(B2:B4;C2:C4);1)',
      mustUse: ['SOMMEPROD', 'ARRONDI'],
      hints: ['Notes en B2:B4, poids en C2:C4.', 'SOMMEPROD(B2:B4;C2:C4) multiplie chaque note par son poids puis additionne.'],
      explain: 'SOMMEPROD fait en une fois la moyenne pondérée : chaque note est multipliée par son poids (la somme des poids vaut 1).',
    },
  ],

  cases: [
    {
      id: 'tableau-de-bord-ecart',
      title: 'Le tableau de bord vire au rouge',
      role: "Responsable logistique d'un distributeur de produits d'entretien",
      lesson: 'kpi/tableau-de-bord',
      generate() {
        const target = 97
        const otif = int(90, 94)
        const stock = int(38, 48)
        const err = int(8, 15) / 10
        return {
          intro: `Ton tableau de bord du mois : OTIF ${otif} % (objectif ${target} %), couverture de stock ${stock} jours (objectif 35 jours), taux d'erreur de préparation ${fmt(err, 1)} % (objectif 0,5 %). La direction te demande un plan d'action pour la réunion de demain.`,
          steps: [
            {
              situation: 'Par quoi commences-tu ?',
              better: `L'OTIF est sous l'objectif de ${target - otif} points : c'est l'indicateur de service qui touche directement les clients. On cherche d'abord la cause (retards ou commandes incomplètes), avant d'agir sur d'autres indicateurs.`,
              choices: [
                { text: "L'écart d'OTIF, pour trouver s'il vient des retards ou des manques.", points: 3, feedback: `L'OTIF de ${otif} % est l'écart le plus visible côté client : décomposer retard et complétude oriente l'action.` },
                { text: 'Je change les objectifs pour qu\'ils soient atteints.', points: 0, feedback: 'Baisser les objectifs masque le problème au lieu de le résoudre.' },
                { text: 'Je supprime l\'indicateur d\'erreur de préparation.', points: 1, feedback: 'Cacher un mauvais indicateur ne règle rien : les erreurs peuvent justement expliquer des commandes incomplètes.' },
              ],
            },
            {
              situation: `La couverture est de ${stock} jours pour un objectif de 35, mais l'OTIF est mauvais. Comment l'interprètes-tu ?`,
              better: "Un stock trop élevé (donc trop cher) et pourtant des commandes incomplètes indiquent un stock mal réparti : trop des mauvais produits, pas assez des produits demandés. On regarde le stock par référence (ABC), pas la couverture globale.",
              choices: [
                { text: "Le stock est mal réparti : je regarde les ruptures par référence (analyse ABC).", points: 3, feedback: 'Une moyenne globale cache des écarts : certains produits sont en excès, d\'autres en rupture.' },
                { text: 'Il faut doubler le stock partout.', points: 0, feedback: 'Doubler le stock coûte très cher et ne corrige pas une mauvaise répartition.' },
                { text: 'Aucun lien entre stock et service.', points: 1, feedback: 'Au contraire : les ruptures sont l\'une des premières causes de commandes incomplètes.' },
              ],
            },
            {
              situation: 'Que présentes-tu à la réunion de demain ?',
              better: "Un plan court : cause probable (stock mal réparti et erreurs de préparation), 2 ou 3 actions chiffrées, un responsable et une échéance par action, et le prochain point de suivi. Un tableau de bord sert à décider, pas à constater.",
              choices: [
                { text: 'Des causes, 2 ou 3 actions avec responsable et échéance, et un suivi.', points: 3, feedback: 'Chaque écart a une action, un responsable et une date : le tableau de bord devient un outil de pilotage.' },
                { text: 'Un rapport de 50 pages de chiffres.', points: 1, feedback: 'Trop de détails noient l\'essentiel : mieux vaut peu de chiffres et un plan clair.' },
                { text: 'Rien : les écarts se corrigeront tout seuls.', points: 0, feedback: 'Sans action, les écarts persistent et les clients continuent d\'être mal servis.' },
              ],
            },
          ],
          debrief: `Un tableau de bord se lit en comparant aux objectifs (OTIF ${otif} % pour ${target} %), en croisant les indicateurs (stock et service) et en terminant par des actions, des responsables et des échéances.`,
        }
      },
    },
    {
      id: 'choisir-fournisseur-kpi',
      title: 'Garder ou remplacer un fournisseur',
      role: "Acheteur dans une entreprise de mobilier",
      lesson: 'kpi/kpi-fournisseurs',
      generate() {
        const onTime = int(70, 85)
        const ppm = int(800, 2500, 100)
        const price = int(5, 12)
        return {
          intro: `Le fournisseur A, historique, livre à l'heure ${onTime} % du temps, avec ${fmt(ppm)} ppm de défauts. Le fournisseur B propose un prix ${price} % plus élevé, mais 96 % de livraisons à l'heure et 150 ppm. Les pièces concernées sont critiques pour la ligne de montage.`,
          steps: [
            {
              situation: 'Comment compares-tu ces deux fournisseurs ?',
              better: "Un prix plus bas ne compte pas si les retards et les défauts arrêtent la ligne. On compare le coût total (prix, retards, rebuts, arrêts de ligne), avec un poids fort sur la qualité et les délais pour des pièces critiques.",
              choices: [
                { text: 'Je compare le coût total et j\'accorde un fort poids à la qualité et au délai.', points: 3, feedback: 'Pour des pièces critiques, une panne de livraison coûte bien plus que quelques pourcents de prix.' },
                { text: 'Je garde A : il est moins cher.', points: 0, feedback: `Avec ${100 - onTime} % de retards et ${fmt(ppm)} ppm, les arrêts et les rebuts coûtent probablement plus que l'économie de prix.` },
                { text: 'Je choisis B sans calculer.', points: 1, feedback: 'B semble meilleur, mais il faut le vérifier par un calcul du coût total pour justifier le choix.' },
              ],
            },
            {
              situation: 'Quelle première action proposes-tu envers A ?',
              better: "Avant de rompre, on partage les résultats avec A et on demande un plan d'amélioration chiffré avec une échéance. Si les résultats ne s'améliorent pas, on bascule progressivement vers B.",
              choices: [
                { text: "Partager les résultats et demander un plan d'amélioration daté.", points: 3, feedback: 'On donne une chance de progresser sur des faits, tout en préparant une solution de repli.' },
                { text: 'Rompre le contrat immédiatement.', points: 1, feedback: 'Une rupture brutale crée un risque de pénurie : on prépare d\'abord la transition.' },
                { text: 'Ne rien dire pour préserver la relation.', points: 0, feedback: 'Sans retour, le fournisseur ne sait pas qu\'il doit progresser : les défauts continueront.' },
              ],
            },
            {
              situation: "Comment sécurises-tu l'approvisionnement pendant cette période ?",
              better: "Un double sourcing partiel (par exemple 70 % A, 30 % B) permet de tester B sans risque et de garder une alternative. On ajuste la répartition selon les résultats du trimestre.",
              choices: [
                { text: 'Un double sourcing partiel, avec un suivi des KPI chaque trimestre.', points: 3, feedback: 'Répartir les volumes réduit le risque et permet de comparer les deux fournisseurs sur des faits.' },
                { text: 'Tout passer chez B dès demain.', points: 1, feedback: 'Un changement total sans test peut créer des problèmes de qualification et de capacité chez B.' },
                { text: 'Continuer exclusivement avec A.', points: 0, feedback: 'Dépendre d\'un fournisseur en difficulté expose la production à des arrêts.' },
              ],
            },
          ],
          debrief: `Pour des pièces critiques, on évalue le coût total (A : ${onTime} % à l'heure, ${fmt(ppm)} ppm ; B : 96 %, 150 ppm), on demande un plan d'amélioration et on répartit les volumes pour sécuriser l'approvisionnement.`,
        }
      },
    },
  ],

  english: {
    units: [
      {
        id: 'kpi-en',
        title: 'Indicateurs et performance',
        icon: 'gauge',
        color: 'cyan',
        lessons: [
          {
            id: 'indicateurs',
            title: 'Les indicateurs',
            level: 2,
            items: [
              { en: 'key performance indicator', fr: 'indicateur clé de performance', def: "Chiffre qui mesure l'atteinte d'un objectif important, souvent abrégé KPI.", ex: 'Each key performance indicator has a target.', exFr: 'Chaque indicateur clé de performance a un objectif.' },
              { en: 'dashboard', fr: 'tableau de bord', def: "Page qui rassemble les indicateurs importants pour suivre l'activité.", ex: 'The dashboard is updated every day.', exFr: 'Le tableau de bord est mis à jour chaque jour.' },
              { en: 'on-time delivery', fr: 'livraison à l\'heure', def: "Livraison réalisée à la date promise.", ex: 'On-time delivery is above ninety-five percent.', exFr: 'La livraison à l\'heure dépasse quatre-vingt-quinze pour cent.' },
              { en: 'fill rate', fr: 'taux de service (lignes servies)', def: "Part de la demande des clients qui est satisfaite.", ex: 'Our fill rate is ninety-seven percent.', exFr: 'Notre taux de service est de quatre-vingt-dix-sept pour cent.' },
              { en: 'inventory turnover', fr: 'rotation des stocks', def: "Nombre de fois par an où le stock est vendu et renouvelé.", ex: 'Inventory turnover improved this quarter.', exFr: 'La rotation des stocks s\'est améliorée ce trimestre.' },
              { en: 'cost per order', fr: 'coût par commande', def: "Coûts logistiques divisés par le nombre de commandes traitées.", ex: 'Cost per order fell by five percent.', exFr: 'Le coût par commande a baissé de cinq pour cent.' },
              { en: 'error rate', fr: 'taux d\'erreur', def: "Part des opérations contenant une erreur.", ex: 'The error rate is under one percent.', exFr: 'Le taux d\'erreur est inférieur à un pour cent.' },
              { en: 'benchmark', fr: 'référence de comparaison', def: "Valeur ou performance de référence à laquelle on se compare, souvent celle d'un concurrent ou du secteur.", ex: 'We use the industry benchmark.', exFr: 'Nous utilisons la référence du secteur.' },
            ],
          },
          {
            id: 'evolution',
            title: 'Parler des évolutions',
            level: 2,
            items: [
              { en: 'rise', fr: 'hausse (augmenter)', def: "Hausse d'un chiffre.", ex: 'There was a sharp rise in costs.', exFr: 'Il y a eu une forte hausse des coûts.' },
              { en: 'drop', fr: 'baisse (chuter)', def: "Baisse d'un chiffre.", ex: 'We saw a slight drop in errors.', exFr: 'Nous avons vu une légère baisse des erreurs.' },
              { en: 'improvement', fr: 'amélioration', def: "Changement qui rend un résultat meilleur.", ex: 'This is a significant improvement.', exFr: 'C\'est une amélioration significative.' },
              { en: 'decline', fr: 'recul (baisse)', def: "Baisse progressive d'un résultat ou d'une qualité.", ex: 'We noticed a decline in service.', exFr: 'Nous avons remarqué un recul du service.' },
              { en: 'stable', fr: 'stable', def: "Qui ne change presque pas d'une période à l'autre.", ex: 'Demand remained stable.', exFr: 'La demande est restée stable.' },
              { en: 'year-on-year', fr: 'd\'une année sur l\'autre', def: "Comparaison d'un chiffre avec celui de la même période l'année précédente.", ex: 'Sales rose year-on-year.', exFr: 'Les ventes ont augmenté d\'une année sur l\'autre.' },
              { en: 'below target', fr: 'sous l\'objectif', def: "Résultat inférieur à l'objectif fixé.", ex: 'Delivery is below target.', exFr: 'La livraison est sous l\'objectif.' },
              { en: 'exceed', fr: 'dépasser', def: "Faire mieux que l'objectif ou la limite prévue.", ex: 'We exceeded our goal.', exFr: 'Nous avons dépassé notre objectif.' },
            ],
          },
          {
            id: 'resultats-phrases',
            title: 'Présenter des résultats',
            level: 3,
            items: [
              { en: 'On-time delivery rose to ninety-four percent.', fr: 'La livraison à l\'heure est passée à quatre-vingt-quatorze pour cent.', blank: 'rose' },
              { en: 'We are slightly below target this month.', fr: 'Nous sommes légèrement sous l\'objectif ce mois-ci.', blank: 'slightly' },
              { en: 'The main cause is a shortage of drivers.', fr: 'La cause principale est un manque de chauffeurs.', blank: 'shortage' },
              { en: 'Costs decreased by three percent compared to last year.', fr: 'Les coûts ont baissé de trois pour cent par rapport à l\'an dernier.', blank: 'compared' },
              { en: 'Let me show you the latest figures.', fr: 'Laissez-moi vous montrer les derniers chiffres.', blank: 'figures' },
              { en: 'This trend is likely to continue.', fr: 'Cette tendance devrait se poursuivre.', blank: 'likely' },
            ],
          },
        ],
      },
      {
        id: 'reunions',
        title: 'Réunions et reporting',
        icon: 'presentation',
        color: 'indigo',
        lessons: [
          {
            id: 'reunion-phrases',
            title: 'Participer à une réunion',
            level: 3,
            items: [
              { en: 'Let\'s start with the agenda.', fr: 'Commençons par l\'ordre du jour.', blank: 'agenda' },
              { en: 'Could you give us an update on the project?', fr: 'Pourriez-vous nous faire un point sur le projet ?', blank: 'update' },
              { en: 'I would like to add a point.', fr: 'Je voudrais ajouter un point.', blank: 'point' },
              { en: 'Let\'s move on to the next item.', fr: 'Passons au point suivant.', blank: 'item' },
              { en: 'Who is responsible for this action?', fr: 'Qui est responsable de cette action ?', blank: 'responsible' },
              { en: 'We will send the minutes after the meeting.', fr: 'Nous enverrons le compte rendu après la réunion.', blank: 'minutes' },
            ],
          },
          {
            id: 'reporting-mots',
            title: 'Le vocabulaire du reporting',
            level: 2,
            items: [
              { en: 'status report', fr: "rapport d'avancement", def: "Document qui présente des résultats ou une situation.", ex: 'I will send you the weekly status report.', exFr: 'Je vous enverrai le rapport hebdomadaire.' },
              { en: 'milestone', fr: 'jalon', def: "Étape importante d'un projet, qui marque une avancée.", ex: 'The first milestone is in March.', exFr: 'Le premier jalon est en mars.' },
              { en: 'action plan', fr: 'plan d\'action', def: "Liste d'actions à réaliser, avec responsables et dates.", ex: 'We need an action plan.', exFr: 'Nous avons besoin d\'un plan d\'action.' },
              { en: 'follow-up', fr: 'suivi', def: "Action menée ensuite pour vérifier qu'une décision est appliquée.", ex: 'There will be a follow-up meeting.', exFr: 'Il y aura une réunion de suivi.' },
              { en: 'stakeholder', fr: 'partie prenante', def: "Personne ou groupe concerné par un projet ou une décision.", ex: 'Every stakeholder was informed.', exFr: 'Chaque partie prenante a été informée.' },
              { en: 'priority', fr: 'priorité', def: "Ce qui doit être traité en premier.", ex: 'Safety is our first priority.', exFr: 'La sécurité est notre première priorité.' },
              { en: 'bottom line', fr: 'résultat final (l\'essentiel)', def: "Résultat net ou conclusion principale d'une analyse.", ex: 'What is the bottom line?', exFr: 'Quel est l\'essentiel ?' },
              { en: 'roadmap', fr: 'feuille de route', def: "Plan qui indique les grandes étapes d'un projet dans le temps.", ex: 'Here is our roadmap for next year.', exFr: 'Voici notre feuille de route pour l\'an prochain.' },
            ],
          },
        ],
      },
    ],
  },
}
