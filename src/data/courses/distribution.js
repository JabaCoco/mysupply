// Lot 8 — Nouveau module : Distribution et e-commerce (5 leçons).
import { fmt, int, numQuestion, pick } from '../gen.js'

export default {
  id: "distribution",
  title: "Distribution et e-commerce",
  short: "Distribution",
  icon: "store",
  color: "rose",
  lessons: [
    {
      id: "reseaux",
      title: "Les réseaux de distribution",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Du producteur au consommateur",
          body: "Un **réseau de distribution** est l'ensemble des sites et des flux qui amènent un produit de l'usine jusqu'au client. Il comprend des **entrepôts centraux**, des **plateformes régionales**, des **magasins** ou des **points de retrait**.\n\nSon but : livrer **le bon produit, au bon endroit, au bon coût**, avec le délai attendu.",
        },
        {
          type: "list",
          title: "Les canaux",
          items: [
            ["Direct", "L'entreprise vend elle-même au client (site web, boutique de marque)."],
            ["Indirect court", "Un seul intermédiaire : un détaillant."],
            ["Indirect long", "Plusieurs intermédiaires : grossiste, puis détaillant."],
          ],
        },
        {
          type: "list",
          title: "Les types de sites",
          items: [
            ["Entrepôt central (CDC)", "Gros stock, approvisionne les autres sites."],
            ["Plateforme (cross-docking)", "Les marchandises sont réparties et repartent sans être stockées."],
            ["Entrepôt régional", "Stock plus proche des clients, délais plus courts."],
            ["Magasin", "Dernier maillon, vente directe au consommateur."],
          ],
        },
        {
          type: "text",
          title: "Centraliser ou rapprocher ?",
          body: "**Centraliser** les stocks dans peu de sites réduit le stock total (effet de regroupement) et les coûts de gestion, mais allonge les trajets jusqu'aux clients.\n\n**Rapprocher** les stocks (plus de sites) raccourcit les délais, mais multiplie les stocks et les frais fixes.\n\nLe bon réseau est un **compromis** entre coût, stock et délai de livraison.",
        },
        {
          type: "formula",
          title: "L'effet de regroupement (racine carrée)",
          formula: "Stock de sécurité total ≈ stock d'un site × √(nombre de sites)",
          legend: [
            ["Règle de la racine carrée", "Réunir n sites en un seul divise le stock de sécurité par environ √n."],
          ],
          example: "4 entrepôts ont chacun 200 unités de stock de sécurité, soit 800. Regroupés en 1 : 200 × √4 = 400 unités environ. On économise la moitié du stock.",
        },
        {
          type: "key",
          points: [
            "Réseau = sites et flux de l'usine au client.",
            "Canaux : direct, indirect court, indirect long.",
            "Centraliser réduit le stock ; rapprocher réduit le délai.",
            "Regrouper n sites divise le stock de sécurité par environ √n.",
          ],
        },
      ],
      quiz: [
        () => {
          const sites = pick([4, 9, 16])
          const ss = int(100, 400, 50)
          return numQuestion({
            q: `${sites} entrepôts ont chacun ${ss} unités de stock de sécurité. Avec la règle de la racine carrée, quel serait le stock de sécurité total après regroupement en un seul entrepôt ?`,
            answer: ss * Math.sqrt(sites),
            unit: "unités",
            digits: 0,
            explain: `Stock regroupé ≈ ${ss} × √${sites} = ${ss} × ${Math.sqrt(sites)} = ${fmt(ss * Math.sqrt(sites), 0)} unités, contre ${fmt(ss * sites, 0)} avant.`,
            wrong: [ss * sites, ss, ss * Math.sqrt(sites) * 2, ss * sites / 2],
          })
        },
        () => {
          const orders = int(1000, 6000, 500)
          const share = pick([20, 25, 30, 40])
          return numQuestion({
            q: `Un site traite ${fmt(orders)} commandes par mois, dont ${share} % passent en direct par le site web de la marque. Combien de commandes sont directes ?`,
            answer: (orders * share) / 100,
            unit: "commandes",
            digits: 0,
            explain: `${fmt(orders)} × ${share} % = ${fmt((orders * share) / 100, 0)} commandes directes.`,
            wrong: [orders - (orders * share) / 100, orders * share, orders / share, (orders * share) / 10],
          })
        },
        {
          q: "Qu'est-ce qu'un canal de distribution direct ?",
          choices: ["L'entreprise vend elle-même au client final", "Un grossiste revend aux détaillants de la région", "Un transporteur stocke les produits pour tous les clients", "Un distributeur étranger achète en grande quantité"],
          answer: 0,
          explain: "Direct signifie sans intermédiaire : site web, boutique de marque ou vente en face à face.",
        },
        {
          q: "Que fait une plateforme de cross-docking ?",
          choices: ["Répartit les marchandises sans les stocker", "Stocke les produits pendant plusieurs mois", "Fabrique les produits à la demande du client", "Contrôle la qualité chez les fournisseurs"],
          answer: 0,
          explain: "Le cross-docking fait passer les marchandises du quai de réception au quai d'expédition en quelques heures, sans stockage durable.",
        },
        {
          q: "Que gagne-t-on en centralisant les stocks sur peu de sites ?",
          choices: ["Un stock total plus faible", "Des délais de livraison plus courts", "Des trajets plus courts vers les clients", "Moins de frais de transport en aval"],
          answer: 0,
          explain: "Regrouper les stocks réduit le stock de sécurité total, mais allonge souvent les trajets jusqu'aux clients.",
        },
        {
          q: "Quel est l'avantage de rapprocher les stocks des clients ?",
          choices: ["Des délais de livraison plus courts", "Un stock de sécurité total plus faible", "Moins de sites à gérer pour l'entreprise", "Des frais fixes d'entrepôt réduits"],
          answer: 0,
          explain: "Des sites proches des clients raccourcissent les délais, au prix de plus de stocks et de frais fixes.",
        },
        {
          q: "Quelle est la différence entre distribution indirecte courte et longue ?",
          choices: ["Le nombre d'intermédiaires entre producteur et client", "La distance moyenne parcourue par les marchandises livrées", "Le type de véhicule de transport utilisé pour livrer", "Le nombre moyen de produits vendus dans chaque commande"],
          answer: 0,
          explain: "Courte : un seul intermédiaire (détaillant) ; longue : plusieurs (grossiste puis détaillant, par exemple).",
        },
        {
          q: "Que cherche un bon réseau de distribution ?",
          choices: ["Un compromis entre coût, stock et délai", "Le plus grand nombre possible d'entrepôts", "Le stock le plus élevé dans chaque site", "Le coût de transport le plus bas uniquement"],
          answer: 0,
          explain: "Chaque choix de réseau déplace un curseur entre coûts, niveau de stock et rapidité de livraison : il faut un équilibre.",
        },
      ],
    },

    {
      id: "dernier-km",
      title: "Le dernier kilomètre",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Le maillon le plus cher",
          body: "Le **dernier kilomètre** est la dernière étape de la livraison : du **dépôt local** jusqu'à la **porte du client** (ou au point de retrait). Il représente souvent **la moitié du coût total** du transport d'un colis, alors qu'il ne couvre que quelques kilomètres.\n\nPourquoi si cher ? Beaucoup d'arrêts, de petits colis, des clients absents et du trafic urbain.",
        },
        {
          type: "list",
          title: "Les modes de livraison",
          items: [
            ["À domicile", "Le client est livré chez lui : pratique mais coûteux et exposé à l'absence."],
            ["Point relais", "Le client retire son colis chez un commerçant : coût réduit, un seul arrêt pour plusieurs colis."],
            ["Consigne automatique", "Casier en libre-service accessible à toute heure."],
            ["Click and collect", "Commande en ligne, retrait en magasin."],
            ["Express", "Livraison le jour même ou en quelques heures : très cher."],
          ],
        },
        {
          type: "formula",
          title: "Le coût par colis",
          formula: "Coût par colis = coût de la tournée / nombre de colis livrés avec succès",
          legend: [
            ["Colis livrés", "Seuls les colis effectivement remis comptent (les absents sont à refaire)."],
            ["Densité", "Plus il y a de colis par kilomètre de tournée, plus le coût unitaire baisse."],
          ],
          example: "Tournée de 240 € pour 120 colis livrés : 2 € par colis. Si 20 colis échouent (client absent) : 240 € pour 100 colis livrés = 2,40 €.",
        },
        {
          type: "list",
          title: "Réduire le coût",
          items: [
            ["Densifier", "Regrouper les colis dans les mêmes zones et mêmes jours."],
            ["Points relais", "Remplacer plusieurs arrêts par un seul."],
            ["Créneaux de livraison", "Éviter les absences en prévenant le client."],
            ["Optimiser les tournées", "Choisir l'ordre des arrêts le plus court."],
          ],
        },
        {
          type: "key",
          points: [
            "Le dernier kilomètre pèse souvent la moitié du coût d'un colis.",
            "Modes : domicile, point relais, consigne, click and collect, express.",
            "Coût par colis = coût de la tournée / colis réellement livrés.",
            "Densifier, grouper en points relais et éviter les absences réduit le coût.",
          ],
        },
      ],
      quiz: [
        () => {
          const cost = int(150, 400, 10)
          const parcels = int(60, 150, 10)
          return numQuestion({
            q: `Une tournée coûte ${cost} € et livre ${parcels} colis avec succès. Quel est le coût par colis ?`,
            answer: cost / parcels,
            unit: "€",
            digits: 2,
            explain: `${cost} / ${parcels} = ${fmt(cost / parcels, 2)} € par colis.`,
            wrong: [cost * parcels, cost - parcels, parcels / cost, (cost / parcels) * 2],
          })
        },
        () => {
          const parcels = int(100, 200, 10)
          const failed = int(10, 30, 5)
          const cost = int(200, 360, 10)
          return numQuestion({
            q: `Une tournée de ${cost} € prévoit ${parcels} colis, mais ${failed} échouent (clients absents). Quel est le coût par colis réellement livré ?`,
            answer: cost / (parcels - failed),
            unit: "€",
            digits: 2,
            explain: `Colis livrés = ${parcels} − ${failed} = ${parcels - failed}. Coût = ${cost} / ${parcels - failed} = ${fmt(cost / (parcels - failed), 2)} € par colis.`,
            wrong: [cost / parcels, cost / failed, (cost / parcels) * 0.9, cost / (parcels + failed)],
          })
        },
        {
          q: "Qu'est-ce que le dernier kilomètre ?",
          choices: ["La dernière étape jusqu'au client", "Le premier transport depuis l'usine", "La traversée maritime vers le port", "Le trajet entre deux entrepôts"],
          answer: 0,
          explain: "C'est le trajet entre le dernier dépôt et la porte du client ou le point de retrait.",
        },
        {
          q: "Pourquoi le dernier kilomètre est-il si coûteux ?",
          choices: ["Beaucoup d'arrêts pour de petits colis", "Il est toujours très long en nombre de kilomètres", "Il est réalisé uniquement en avion ou en train", "Il exige des containers spéciaux et réfrigérés"],
          answer: 0,
          explain: "Chaque arrêt livre peu de marchandise ; le coût de la tournée est réparti sur peu de colis par kilomètre.",
        },
        {
          q: "Quel est l'avantage d'un point relais ?",
          choices: ["Plusieurs colis livrés en un seul arrêt", "Une livraison plus rapide que l'express", "Un colis remis directement chez le client", "Une suppression totale des retours"],
          answer: 0,
          explain: "Le transporteur dépose de nombreux colis au même endroit : le coût par colis baisse nettement.",
        },
        {
          q: "Que signifie « click and collect » ?",
          choices: ["Commander en ligne et retirer en magasin", "Cliquer pour suivre sa livraison à domicile", "Payer en ligne puis se faire livrer en express", "Collecter des points de fidélité en achetant"],
          answer: 0,
          explain: "Le client commande sur internet et vient chercher sa commande dans un magasin ou un point de retrait.",
        },
        {
          q: "Quelle action réduit le coût de la livraison à domicile ?",
          choices: ["Regrouper les colis dans les mêmes zones", "Livrer chaque colis en express individuel", "Multiplier les tournées à moitié vides", "Retarder toutes les livraisons de plusieurs jours"],
          answer: 0,
          explain: "Densifier les tournées répartit le coût sur davantage de colis par kilomètre parcouru.",
        },
        {
          q: "Pourquoi un client absent pose-t-il problème ?",
          choices: ["Le colis doit être livré à nouveau, à un coût supplémentaire", "Le colis est détruit automatiquement après un jour de stockage", "Le transporteur doit rembourser tout le colis au client", "Le client reçoit son colis en double exemplaire gratuit"],
          answer: 0,
          explain: "Un échec de livraison oblige à repasser, ce qui double le coût et ralentit la tournée.",
        },
      ],
    },

    {
      id: "omnicanal",
      title: "L'omnicanal",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Un client, plusieurs canaux",
          body: "Un client moderne cherche en ligne, essaie en magasin, achète sur mobile et se fait livrer où il veut. L'**omnicanal** consiste à offrir une **expérience unifiée** sur tous les canaux : mêmes prix, mêmes stocks visibles, mêmes services.\n\nPour la supply chain, cela suppose un **stock partagé** et des **flux flexibles**.",
        },
        {
          type: "list",
          title: "Multicanal ou omnicanal ?",
          items: [
            ["Multicanal", "Plusieurs canaux de vente, mais gérés séparément (stocks et prix distincts)."],
            ["Omnicanal", "Canaux connectés : un seul stock visible, parcours client continu."],
          ],
        },
        {
          type: "list",
          title: "Les services omnicanaux",
          items: [
            ["Click and collect", "Commande en ligne, retrait en magasin."],
            ["Ship from store", "Le magasin prépare et expédie la commande d'un client en ligne."],
            ["Retour en magasin", "Un achat en ligne peut être rendu en boutique."],
            ["Stock visible", "Le client voit la disponibilité en magasin avant de se déplacer."],
          ],
        },
        {
          type: "text",
          title: "Les défis logistiques",
          body: "• **Un stock unique** : sinon le même produit est « en rupture » en ligne et en stock en magasin.\n• **Des flux mélangés** : préparer des palettes pour les magasins et des colis à l'unité pour le web.\n• **Des systèmes connectés** : le système de commandes, le WMS et la caisse doivent partager les données en temps réel.\n• **Un arbitrage de coûts** : expédier depuis le bon site selon stock, distance et coût.",
        },
        {
          type: "formula",
          title: "Le taux de disponibilité omnicanal",
          formula: "Taux de commandes servies = commandes servies / commandes reçues × 100",
          legend: [
            ["Servies", "Commandes livrées complètes, quel que soit le site d'expédition."],
          ],
          example: "950 commandes servies sur 1 000 reçues = 95 %. Avec un stock partagé, une rupture dans un site peut être compensée par un autre.",
        },
        {
          type: "key",
          points: [
            "Omnicanal : canaux connectés, un stock visible, un parcours continu.",
            "Multicanal : plusieurs canaux séparés.",
            "Ship from store, click and collect, retour en magasin : services typiques.",
            "Il faut un stock partagé et des systèmes connectés.",
          ],
        },
      ],
      quiz: [
        () => {
          const received = int(800, 3000, 100)
          const served = Math.round(received * (int(90, 99) / 100))
          return numQuestion({
            q: `Une enseigne reçoit ${fmt(received)} commandes et en sert ${fmt(served)} complètes. Quel est le taux de commandes servies ?`,
            answer: (served / received) * 100,
            unit: "%",
            digits: 1,
            max: 100,
            explain: `${fmt(served)} / ${fmt(received)} × 100 = ${fmt((served / received) * 100, 1)} %.`,
          })
        },
        () => {
          const orders = int(200, 900, 50)
          const share = pick([10, 15, 20, 25])
          return numQuestion({
            q: `Parmi ${orders} commandes en ligne, ${share} % sont retirées en magasin (click and collect). Combien de commandes sont retirées ?`,
            answer: (orders * share) / 100,
            unit: "commandes",
            digits: 0,
            explain: `${orders} × ${share} % = ${fmt((orders * share) / 100, 0)} commandes.`,
            wrong: [orders - (orders * share) / 100, orders * share, orders / share, (orders * share) / 10],
          })
        },
        {
          q: "Quelle est la différence principale entre multicanal et omnicanal ?",
          choices: ["Les canaux sont connectés dans l'omnicanal", "L'omnicanal n'utilise que des magasins physiques en ville", "Le multicanal utilise toujours un stock unique partagé", "L'omnicanal supprime tous les magasins du réseau commercial"],
          answer: 0,
          explain: "En omnicanal, stocks, prix et informations client sont partagés entre tous les canaux.",
        },
        {
          q: "Que signifie « ship from store » ?",
          choices: ["Le magasin expédie la commande d'un client en ligne", "Le client retire sa commande directement à l'entrepôt central", "Le magasin renvoie tous ses invendus à l'usine de fabrication", "Le client expédie lui-même son colis depuis la boutique du quartier"],
          answer: 0,
          explain: "Le magasin sert de mini-entrepôt : il prépare et envoie les commandes passées sur internet.",
        },
        {
          q: "Pourquoi un stock unique est-il important en omnicanal ?",
          choices: ["Pour éviter un produit « en rupture » dans un canal et disponible dans un autre", "Pour supprimer tous les entrepôts régionaux de l'entreprise à terme, quel que soit le client", "Pour empêcher les clients de comparer les prix en ligne et en magasin avant d'acheter", "Pour réduire fortement le nombre de commandes passées sur le site"],
          answer: 0,
          explain: "Si les stocks sont séparés, une commande peut être refusée alors que le produit existe ailleurs dans l'entreprise.",
        },
        {
          q: "Quel est l'intérêt de montrer le stock du magasin sur le site ?",
          choices: ["Le client sait s'il peut y trouver le produit avant de se déplacer", "Le client peut modifier lui-même le prix à sa convenance en ligne", "Le magasin peut refuser de vendre en ligne les produits en promotion", "Le client reçoit automatiquement un remboursement de son déplacement"],
          answer: 0,
          explain: "La visibilité des stocks évite les déplacements inutiles et rassure le client sur la disponibilité.",
        },
        {
          q: "Quel défi logistique apporte l'omnicanal ?",
          choices: ["Gérer des palettes pour magasins et des colis à l'unité", "Supprimer toute gestion des stocks de l'entreprise et de ses fournisseurs", "Livrer uniquement des produits dématérialisés et des services numériques", "Éviter de connaître les stocks disponibles dans chaque site du réseau"],
          answer: 0,
          explain: "Le même entrepôt doit servir des flux de gros volumes (magasins) et de petits colis (clients en ligne).",
        },
        {
          q: "Pourquoi les systèmes d'information doivent-ils être connectés ?",
          choices: ["Pour partager stocks et commandes en temps réel", "Pour empêcher les magasins de vendre leurs produits en ligne aux clients", "Pour afficher des publicités personnalisées sur toutes les caisses", "Pour réduire le nombre d'articles proposés au catalogue général"],
          answer: 0,
          explain: "Sans données partagées, impossible de savoir où est le stock ni de choisir le meilleur site d'expédition.",
        },
      ],
    },

    {
      id: "retours",
      title: "La logistique des retours",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Quand le produit revient",
          body: "En e-commerce, le client peut **retourner** un produit (droit de rétractation de 14 jours en Europe pour un achat à distance). Ces retours, appelés **logistique inverse** ou **reverse logistics**, représentent un coût important : transport aller, contrôle, remise en stock ou destruction.\n\nSelon les secteurs (mode notamment), de **20 à 40 %** des commandes en ligne peuvent être retournées.",
        },
        {
          type: "list",
          title: "Les étapes d'un retour",
          items: [
            ["1. Demande", "Le client déclare le retour et choisit un mode (point relais, domicile)."],
            ["2. Transport retour", "Le colis revient à l'entrepôt ou à un centre de retours."],
            ["3. Réception et contrôle", "On vérifie l'état et l'authenticité du produit."],
            ["4. Décision", "Remise en stock, reconditionnement, soldes, don ou recyclage."],
            ["5. Remboursement", "Le client est remboursé ou échange son produit."],
          ],
        },
        {
          type: "list",
          title: "Que faire du produit retourné ?",
          items: [
            ["Remise en vente", "Si l'état est parfait."],
            ["Reconditionnement", "Remise en état, nouvel emballage."],
            ["Seconde main ou soldes", "Si l'article est abîmé mais utilisable."],
            ["Don ou recyclage", "Dernier recours pour éviter la destruction."],
          ],
        },
        {
          type: "formula",
          title: "Le taux et le coût des retours",
          formula: "Taux de retour = commandes retournées / commandes livrées × 100",
          legend: [
            ["Coût moyen d'un retour", "Transport + traitement + dépréciation éventuelle."],
            ["Coût annuel", "Nombre de retours × coût moyen par retour."],
          ],
          example: "2 000 retours sur 8 000 commandes = 25 %. À 9 € par retour : 18 000 € par an.",
        },
        {
          type: "list",
          title: "Réduire les retours",
          items: [
            ["Fiches produit précises", "Photos, mesures, avis : le client sait ce qu'il commande."],
            ["Guide des tailles", "Surtout en mode et chaussures."],
            ["Analyse des motifs", "Comprendre pourquoi les clients renvoient pour agir à la source."],
          ],
        },
        {
          type: "key",
          points: [
            "Logistique inverse : tout le flux des retours.",
            "Taux de retour = retours / commandes livrées.",
            "Après contrôle : remise en stock, reconditionnement, soldes, don ou recyclage.",
            "La meilleure action : informer le client avant l'achat pour éviter le retour.",
          ],
        },
      ],
      quiz: [
        () => {
          const delivered = int(2000, 10000, 500)
          const returns = Math.round(delivered * (int(10, 35) / 100))
          return numQuestion({
            q: `Sur ${fmt(delivered)} commandes livrées, ${fmt(returns)} sont retournées. Quel est le taux de retour ?`,
            answer: (returns / delivered) * 100,
            unit: "%",
            digits: 1,
            max: 100,
            explain: `${fmt(returns)} / ${fmt(delivered)} × 100 = ${fmt((returns / delivered) * 100, 1)} %.`,
          })
        },
        () => {
          const returns = int(500, 3000, 100)
          const cost = pick([6, 8, 9, 11, 12])
          return numQuestion({
            q: `Une boutique traite ${fmt(returns)} retours par an, à ${cost} € chacun en moyenne. Quel est le coût annuel des retours ?`,
            answer: returns * cost,
            unit: "€",
            digits: 0,
            explain: `${fmt(returns)} × ${cost} € = ${fmt(returns * cost, 0)} € par an.`,
            wrong: [returns + cost, returns / cost, returns * cost * 2, returns * (cost - 2)],
          })
        },
        {
          q: "Qu'est-ce que la logistique inverse ?",
          choices: ["La gestion des flux de retours depuis le client", "La livraison optimisée par le chemin le plus court possible", "Le stockage des produits à l'envers dans les entrepôts du réseau", "La vente directe depuis l'usine aux clients finaux"],
          answer: 0,
          explain: "La logistique inverse (reverse logistics) organise le retour, le contrôle et le réemploi des produits renvoyés.",
        },
        {
          q: "Quel délai de rétractation s'applique à un achat à distance dans l'UE ?",
          choices: ["14 jours", "48 heures", "6 mois", "Aucun délai"],
          answer: 0,
          explain: "Pour un achat à distance, le consommateur européen dispose d'un délai légal de 14 jours pour se rétracter.",
        },
        {
          q: "Que fait-on d'abord d'un colis retourné à l'entrepôt ?",
          choices: ["On contrôle son état et son authenticité", "On le remet directement en rayon sans aucune vérification", "On le détruit systématiquement pour éviter tout risque", "On le renvoie directement au fournisseur sans l'ouvrir"],
          answer: 0,
          explain: "Un contrôle est indispensable avant toute décision : remise en stock, reconditionnement, soldes ou recyclage.",
        },
        {
          q: "Que signifie reconditionner un produit ?",
          choices: ["Le remettre en état et le réemballer pour le revendre", "Le détruire entièrement pour récupérer ses matières premières", "Le renvoyer chez son fabricant sans le trier ni le contrôler", "Le donner automatiquement à une association de quartier"],
          answer: 0,
          explain: "Le reconditionnement nettoie, répare et réemballe un produit pour le remettre en vente.",
        },
        {
          q: "Quelle action réduit les retours dans la mode en ligne ?",
          choices: ["Un guide des tailles précis et des photos détaillées", "Retirer toutes les photos des fiches produit du site marchand", "Cacher les conditions de retour aux clients avant leur achat", "Augmenter le délai de livraison volontairement pour tous les produits"],
          answer: 0,
          explain: "Un client bien informé commande la bonne taille : le motif de retour le plus fréquent est évité.",
        },
        {
          q: "Pourquoi analyser les motifs de retour ?",
          choices: ["Pour agir sur la cause (taille, qualité, description)", "Pour décourager les clients d'acheter à nouveau sur le site marchand", "Pour supprimer la logistique inverse définitivement dans l'entreprise", "Pour augmenter les prix de tous les produits du catalogue en ligne"],
          answer: 0,
          explain: "Connaître les raisons des retours permet de corriger les fiches, la qualité ou le conditionnement à la source.",
        },
      ],
    },

    {
      id: "livraison-urbaine",
      title: "La livraison urbaine",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Livrer en ville",
          body: "Les villes concentrent des clients, mais aussi des contraintes : **circulation dense**, **zones à faibles émissions (ZFE)**, **stationnement limité**, **horaires de livraison** réglementés. La **logistique urbaine** cherche à livrer en ville avec moins de bruit, de pollution et de congestion.",
        },
        {
          type: "list",
          title: "Les solutions",
          items: [
            ["Véhicules propres", "Camionnettes électriques, vélos-cargos, triporteurs."],
            ["Espace logistique urbain (ELU)", "Petit entrepôt en ville, où l'on regroupe les marchandises avant la livraison finale."],
            ["Mutualisation", "Plusieurs transporteurs ou chargeurs partagent les mêmes tournées."],
            ["Livraison hors heures de pointe", "Tôt le matin, tard le soir ou la nuit."],
            ["Points de retrait", "Consignes et relais, qui évitent les livraisons à domicile."],
          ],
        },
        {
          type: "formula",
          title: "Le taux de remplissage d'un véhicule",
          formula: "Taux de remplissage = volume (ou poids) chargé / capacité du véhicule × 100",
          legend: [
            ["Un véhicule mal rempli", "coûte plus cher par colis et pollue davantage."],
            ["Mutualiser", "permet de remplir les véhicules et de réduire le nombre de passages."],
          ],
          example: "Une camionnette de 12 m³ transporte 7,2 m³ : remplissage = 7,2 / 12 = 60 %. En mutualisant, on peut monter à 85 %.",
        },
        {
          type: "text",
          title: "Les arbitrages",
          body: "**Vélo-cargo** : parfait en centre-ville pour de petits colis (jusqu'à environ 150 à 250 kg), mais capacité limitée.\n**Camionnette électrique** : plus de volume, mais recharge et autonomie à gérer.\n**ELU** : réduit le nombre de poids lourds en ville mais ajoute une étape et un coût de manutention.\n\nLe bon choix dépend de la densité des clients, des volumes et des règles locales.",
        },
        {
          type: "key",
          points: [
            "Logistique urbaine : livrer en ville avec moins de pollution et de congestion.",
            "Solutions : véhicules propres, ELU, mutualisation, horaires décalés, points de retrait.",
            "Taux de remplissage = chargé / capacité ; mutualiser le fait monter.",
            "Le meilleur mode dépend de la densité et des volumes.",
          ],
        },
      ],
      quiz: [
        () => {
          const cap = pick([10, 12, 15, 20])
          const load = Math.round(cap * (int(40, 90) / 100) * 10) / 10
          return numQuestion({
            q: `Une camionnette de ${cap} m³ transporte ${fmt(load, 1)} m³. Quel est son taux de remplissage ?`,
            answer: (load / cap) * 100,
            unit: "%",
            digits: 0,
            max: 100,
            explain: `${fmt(load, 1)} / ${cap} × 100 = ${fmt((load / cap) * 100, 0)} %.`,
          })
        },
        () => {
          const trips = int(40, 120, 10)
          const cut = pick([20, 25, 30, 40])
          return numQuestion({
            q: `Une mutualisation permet de réduire de ${cut} % les ${trips} passages hebdomadaires de véhicules dans un quartier. Combien de passages restent-ils ?`,
            answer: trips * (1 - cut / 100),
            unit: "passages",
            digits: 0,
            explain: `${trips} × (1 − ${cut} %) = ${trips} × ${fmt(1 - cut / 100, 2)} = ${fmt(trips * (1 - cut / 100), 0)} passages.`,
            wrong: [trips * (cut / 100), trips - cut, trips + (trips * cut) / 100, trips * (1 - cut / 100) * 2],
          })
        },
        {
          q: "Que désigne l'acronyme ZFE ?",
          choices: ["Zone à faibles émissions", "Zone de fret express", "Zone de fabrication européenne", "Zone de franchise exceptionnelle"],
          answer: 0,
          explain: "Les ZFE limitent l'accès des véhicules les plus polluants dans certaines agglomérations.",
        },
        {
          q: "À quoi sert un espace logistique urbain ?",
          choices: ["Regrouper les marchandises avant la livraison finale", "Fabriquer tous les produits directement au cœur des villes", "Remplacer tous les magasins du centre-ville par des entrepôts", "Stocker les déchets des habitants avant leur recyclage"],
          answer: 0,
          explain: "L'ELU est un petit site en ville depuis lequel des véhicules légers ou propres assurent la dernière étape.",
        },
        {
          q: "Quel avantage offre un vélo-cargo ?",
          choices: ["Il circule facilement et ne pollue pas en centre-ville", "Il transporte de très lourdes palettes sur plusieurs mètres", "Il peut parcourir de très longues distances entre deux villes", "Il remplace complètement le transport maritime de conteneurs"],
          answer: 0,
          explain: "Léger et propre, il convient aux petits colis dans les zones denses, mais sa capacité est limitée.",
        },
        {
          q: "Que signifie mutualiser les livraisons ?",
          choices: ["Partager les tournées entre plusieurs acteurs", "Livrer chaque colis du quartier par un transporteur différent", "Livrer uniquement des commandes provenant d'un seul client", "Supprimer toutes les tournées de livraison en ville"],
          answer: 0,
          explain: "En partageant les véhicules, on les remplit mieux et on réduit le nombre de passages.",
        },
        {
          q: "Pourquoi livrer hors des heures de pointe ?",
          choices: ["Pour limiter la congestion et gagner du temps", "Pour augmenter volontairement le bruit en ville la nuit", "Pour éviter de payer les chauffeurs en heures de pointe", "Pour livrer uniquement des produits frais aux restaurants"],
          answer: 0,
          explain: "Tôt le matin ou tard le soir, les routes sont plus libres : tournées plus rapides et moins de gêne pour les habitants.",
        },
        {
          q: "Quelle conséquence a un faible taux de remplissage ?",
          choices: ["Un coût et des émissions plus élevés par colis", "Un coût par colis plus faible qu'à pleine charge", "Un nombre de livraisons plus grand pour le même coût", "Une disparition de la congestion urbaine"],
          answer: 0,
          explain: "Un véhicule à moitié vide parcourt la même distance pour moins de colis : le coût et les émissions par colis augmentent.",
        },
      ],
    },
  ],
}
