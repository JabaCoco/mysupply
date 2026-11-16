// Lot 13 — Nouveau module : Supply chain durable (5 leçons).
import { fmt, int, numQuestion, pick } from '../gen.js'

export default {
  id: "durable",
  title: "Supply chain durable",
  short: "Durable",
  icon: "leaf",
  color: "emerald",
  lessons: [
    {
      id: "empreinte-carbone",
      title: "L'empreinte carbone et les scopes",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "Mesurer pour réduire",
          body: "La logistique et le transport représentent une part importante des **émissions de gaz à effet de serre (GES)** d'une entreprise. Pour les réduire, il faut d'abord les **mesurer** : c'est le rôle du **bilan carbone** (ou bilan GES). Les émissions s'expriment en **équivalent CO₂** (CO₂e), qui regroupe les différents gaz selon leur effet sur le climat.",
        },
        {
          type: "list",
          title: "Les trois scopes",
          items: [
            ["Scope 1", "Émissions directes : carburant des véhicules de l'entreprise, chaudières, procédés de fabrication."],
            ["Scope 2", "Émissions indirectes liées à l'énergie achetée : électricité, chaleur ou froid."],
            ["Scope 3", "Toutes les autres émissions indirectes : achats, transport amont et aval, utilisation et fin de vie des produits, déplacements."],
          ],
        },
        {
          type: "text",
          title: "Pourquoi le scope 3 compte autant",
          body: "Pour la plupart des entreprises, le **scope 3** représente la **plus grande part** des émissions (souvent plus de 70 %). Pour un distributeur, par exemple, l'essentiel vient de la **fabrication des produits vendus** et de leur **transport**, pas de ses propres bureaux. Réduire son empreinte suppose donc de **travailler avec ses fournisseurs et ses transporteurs**.",
        },
        {
          type: "formula",
          title: "Le calcul d'une émission",
          formula: "Émissions = donnée d'activité × facteur d'émission",
          legend: [
            ["Donnée d'activité", "La quantité mesurée : litres de carburant, kWh, tonnes-kilomètres."],
            ["Facteur d'émission", "Les kg de CO₂e émis par unité d'activité (publié par des bases officielles comme la Base Empreinte de l'ADEME)."],
          ],
          example: "10 000 litres de gazole × 3 kg CO₂e par litre (ordre de grandeur) = 30 000 kg CO₂e, soit 30 tonnes.",
        },
        {
          type: "key",
          points: [
            "Bilan carbone : mesurer les émissions en équivalent CO₂ (CO₂e).",
            "Scope 1 : direct ; scope 2 : énergie achetée ; scope 3 : tout le reste de la chaîne.",
            "Le scope 3 est souvent la plus grande part des émissions.",
            "Émissions = donnée d'activité × facteur d'émission.",
          ],
        },
      ],
      quiz: [
        () => {
          const liters = int(2, 20) * 1000
          const factor = pick([2.5, 2.7, 3])
          return numQuestion({
            q: `Une flotte consomme ${fmt(liters)} litres de gazole, avec un facteur d'émission de ${fmt(factor)} kg CO₂e par litre. Quelles émissions (en tonnes de CO₂e) cela représente-t-il ?`,
            answer: (liters * factor) / 1000,
            unit: "t CO₂e",
            digits: 1,
            explain: `${fmt(liters)} × ${fmt(factor)} = ${fmt(liters * factor, 0)} kg, soit ${fmt((liters * factor) / 1000, 1)} tonnes de CO₂e.`,
            wrong: [liters * factor, liters / factor, (liters * factor) / 100, ((liters * factor) / 1000) * 2],
          })
        },
        () => {
          const total = int(100, 900, 50)
          const s3 = pick([60, 70, 80, 85])
          return numQuestion({
            q: `Un bilan carbone total de ${total} tonnes de CO₂e comporte ${s3} % de scope 3. Combien de tonnes cela représente-t-il ?`,
            answer: (total * s3) / 100,
            unit: "t CO₂e",
            digits: 0,
            explain: `${total} × ${s3} % = ${fmt((total * s3) / 100, 0)} tonnes : l'essentiel est dans la chaîne amont et aval.`,
            wrong: [total - (total * s3) / 100, total * s3, total / s3, (total * s3) / 10],
          })
        },
        {
          q: "Que mesure un bilan carbone ?",
          choices: ["Les émissions de gaz à effet de serre", "Le chiffre d'affaires de l'entreprise", "Le nombre de salariés formés", "La qualité de l'eau utilisée"],
          answer: 0,
          explain: "Le bilan carbone (ou bilan GES) chiffre les émissions en équivalent CO₂ liées à une activité.",
        },
        {
          q: "Que comprend le scope 1 ?",
          choices: ["Les émissions directes de l'entreprise", "Les émissions de tous ses fournisseurs", "Les émissions de ses clients finaux", "Les émissions de ses concurrents"],
          answer: 0,
          explain: "Le scope 1 regroupe les émissions directes : carburant des véhicules possédés, chaudières, procédés.",
        },
        {
          q: "À quel scope appartient l'électricité achetée ?",
          choices: ["Au scope 2", "Au scope 1", "Au scope 3 uniquement", "À aucun scope"],
          answer: 0,
          explain: "Le scope 2 couvre les émissions indirectes liées à l'énergie achetée.",
        },
        {
          q: "Où classe-t-on le transport confié à un prestataire ?",
          choices: ["Dans le scope 3", "Dans le scope 1", "Dans le scope 2", "Nulle part"],
          answer: 0,
          explain: "Un transport réalisé par un tiers est une émission indirecte de la chaîne de valeur : scope 3.",
        },
        {
          q: "Pourquoi le scope 3 est-il difficile à réduire ?",
          choices: ["Il dépend des fournisseurs et des clients", "Il est toujours inférieur au scope 1", "Il se mesure sans aucune donnée", "Il concerne uniquement les bureaux"],
          answer: 0,
          explain: "Ces émissions ne sont pas sous contrôle direct : il faut convaincre et accompagner les partenaires.",
        },
        {
          q: "Que signifie CO₂e ?",
          choices: ["Équivalent CO₂ de tous les gaz à effet de serre", "Carbone organique émis par les employés", "Consommation d'oxygène en entreprise", "Code d'origine des emballages"],
          answer: 0,
          explain: "On ramène chaque gaz (méthane, protoxyde d'azote…) à l'effet climatique équivalent en CO₂.",
        },
      ],
    },

    {
      id: "transport-bas-carbone",
      title: "Le transport bas carbone",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "Tous les modes ne polluent pas pareil",
          body: "Les émissions d'un transport dépendent de la **masse** transportée, de la **distance** et du **mode**. On les exprime en **gramme de CO₂e par tonne-kilomètre** (g CO₂e/t.km). Pour une même marchandise et une même distance, le choix du mode change l'empreinte d'un facteur 10 à 50.",
        },
        {
          type: "list",
          title: "Ordres de grandeur (indicatifs)",
          items: [
            ["Maritime (porte-conteneurs)", "environ 10 à 20 g CO₂e/t.km : le plus efficace."],
            ["Ferroviaire", "environ 20 à 30 g CO₂e/t.km."],
            ["Fluvial", "environ 30 à 40 g CO₂e/t.km."],
            ["Routier (poids lourd)", "environ 60 à 100 g CO₂e/t.km."],
            ["Aérien", "environ 600 à 1 000 g CO₂e/t.km : de 10 à 50 fois plus que le train ou le bateau."],
          ],
        },
        {
          type: "formula",
          title: "Calculer les émissions d'un transport",
          formula: "Émissions (kg CO₂e) = masse (t) × distance (km) × facteur (g/t.km) / 1 000",
          legend: [
            ["Masse", "En tonnes (1 000 kg = 1 t)."],
            ["Facteur", "En g CO₂e par tonne-kilomètre, selon le mode."],
          ],
          example: "20 t sur 1 000 km par camion à 80 g/t.km : 20 × 1 000 × 80 / 1 000 = 1 600 kg CO₂e. Par train à 25 g/t.km : 500 kg CO₂e.",
        },
        {
          type: "list",
          title: "Les leviers de réduction",
          items: [
            ["Changer de mode", "Report modal : de la route vers le fer ou le fleuve."],
            ["Remplir mieux les véhicules", "Moins de trajets à vide, mutualisation."],
            ["Réduire les distances", "Relocalisation, approvisionnements plus proches."],
            ["Énergies alternatives", "Camions électriques, biogaz, carburants renouvelables."],
            ["Conduite et vitesse", "Écoconduite, limitation de vitesse."],
          ],
        },
        {
          type: "key",
          points: [
            "Émissions = masse × distance × facteur du mode.",
            "Mer et rail émettent bien moins que la route, et l'avion le plus.",
            "Leviers : report modal, remplissage, distances, énergies alternatives.",
          ],
        },
      ],
      quiz: [
        () => {
          const t = int(5, 25)
          const km = int(2, 20) * 100
          const f = pick([60, 80, 100])
          return numQuestion({
            q: `${t} tonnes transportées sur ${fmt(km)} km par camion à ${f} g CO₂e par tonne-kilomètre. Quelles sont les émissions (en kg CO₂e) ?`,
            answer: (t * km * f) / 1000,
            unit: "kg",
            digits: 0,
            explain: `${t} × ${fmt(km)} × ${f} / 1 000 = ${fmt((t * km * f) / 1000, 0)} kg CO₂e.`,
            wrong: [t * km * f, (t * km * f) / 100, t * km, (t * km * f) / 10000],
          })
        },
        () => {
          const t = int(10, 30)
          const km = int(5, 20) * 100
          return numQuestion({
            q: `${t} tonnes sur ${fmt(km)} km : le camion émet 80 g CO₂e/t.km, le train 25 g CO₂e/t.km. Combien de kg de CO₂e économise-t-on en passant au train ?`,
            answer: (t * km * (80 - 25)) / 1000,
            unit: "kg",
            digits: 0,
            explain: `Camion : ${fmt((t * km * 80) / 1000, 0)} kg ; train : ${fmt((t * km * 25) / 1000, 0)} kg ; économie : ${fmt((t * km * 55) / 1000, 0)} kg.`,
            wrong: [(t * km * 80) / 1000, (t * km * 25) / 1000, (t * km * 105) / 1000, (t * km * 55) / 100],
          })
        },
        () => {
          const t = int(1, 5)
          const km = int(5, 12) * 1000
          return numQuestion({
            q: `${t} tonne${t > 1 ? 's' : ''} de marchandises voyagent par avion sur ${fmt(km)} km à 800 g CO₂e/t.km. Quelles sont les émissions (en kg CO₂e) ?`,
            answer: (t * km * 800) / 1000,
            unit: "kg",
            digits: 0,
            explain: `${t} × ${fmt(km)} × 800 / 1 000 = ${fmt((t * km * 800) / 1000, 0)} kg CO₂e.`,
            wrong: [t * km * 800, (t * km * 800) / 100, (t * km * 80) / 1000, (t * km * 800) / 10000],
          })
        },
        {
          q: "Quel mode de transport émet généralement le moins de CO₂ par tonne-kilomètre ?",
          choices: ["Le maritime", "L'aérien", "Le routier", "La camionnette"],
          answer: 0,
          explain: "Un grand porte-conteneurs émet beaucoup moins de CO₂e par tonne-kilomètre que le camion ou l'avion.",
        },
        {
          q: "Quel mode émet le plus par tonne-kilomètre ?",
          choices: ["L'aérien", "Le ferroviaire", "Le fluvial", "Le maritime"],
          answer: 0,
          explain: "L'avion est de loin le mode le plus émetteur : 10 à 50 fois plus que le train ou le bateau.",
        },
        {
          q: "Qu'est-ce que le report modal ?",
          choices: ["Passer de la route au rail ou au fleuve", "Reporter la livraison d'une semaine", "Changer la marque du transporteur", "Arrêter tous les transports"],
          answer: 0,
          explain: "Le report modal consiste à transférer des flux d'un mode émetteur vers un mode plus sobre.",
        },
        {
          q: "Comment réduire les émissions à kilométrage égal ?",
          choices: ["Mieux remplir les véhicules", "Rouler à vide plus souvent", "Augmenter la vitesse maximale", "Multiplier les petites livraisons"],
          answer: 0,
          explain: "Un véhicule mieux rempli transporte plus de marchandises pour les mêmes émissions.",
        },
        {
          q: "Que représente la tonne-kilomètre ?",
          choices: ["Une tonne transportée sur un kilomètre", "Un kilomètre parcouru par un camion", "Le poids d'un camion à vide", "Le prix d'un transport d'une tonne"],
          answer: 0,
          explain: "C'est l'unité de transport qui combine masse et distance : 10 t sur 100 km = 1 000 t.km.",
        },
      ],
    },

    {
      id: "economie-circulaire",
      title: "L'économie circulaire",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Sortir du « prendre, fabriquer, jeter »",
          body: "L'économie **linéaire** extrait des matières, fabrique, vend puis **jette**. L'économie **circulaire** cherche à **boucler** le cycle : concevoir des produits durables, **réutiliser**, **réparer**, **reconditionner** et **recycler**, pour limiter les ressources consommées et les déchets.",
        },
        {
          type: "list",
          title: "Les leviers",
          items: [
            ["Écoconception", "Concevoir des produits durables, réparables, recyclables."],
            ["Réemploi et réparation", "Prolonger la vie des produits."],
            ["Reconditionnement", "Remettre en état pour une seconde vie (téléphones, palettes, machines)."],
            ["Recyclage", "Transformer les déchets en nouvelles matières."],
            ["Économie de fonctionnalité", "Vendre l'usage plutôt que le produit (location, abonnement)."],
          ],
        },
        {
          type: "text",
          title: "Le rôle de la logistique",
          body: "La **logistique inverse** (collecte, tri, retour) est au cœur du cercle : sans elle, les produits usagés ne reviennent pas. Il faut organiser la **collecte**, le **tri**, le **transport retour** et les **centres de reconditionnement** pour que la matière redevienne utile. La **responsabilité élargie du producteur (REP)** oblige certains fabricants à financer la collecte et le recyclage de leurs produits en fin de vie.",
        },
        {
          type: "formula",
          title: "Le taux de recyclage",
          formula: "Taux de recyclage = déchets recyclés / déchets totaux × 100",
          legend: [
            ["Valorisation", "Déchets recyclés, réutilisés ou transformés en énergie."],
            ["Élimination", "Déchets enfouis ou incinérés sans valorisation."],
          ],
          example: "Un entrepôt génère 80 tonnes de déchets par an, dont 56 recyclés : 56 / 80 = 70 %.",
        },
        {
          type: "key",
          points: [
            "Économie circulaire : boucler le cycle (réemploi, reconditionnement, recyclage).",
            "La logistique inverse permet de récupérer les produits usagés.",
            "REP : le producteur finance la collecte et le recyclage de ses produits.",
            "Taux de recyclage = déchets recyclés / déchets totaux.",
          ],
        },
      ],
      quiz: [
        () => {
          const total = int(40, 200, 10)
          const rate = pick([50, 60, 70, 75, 80])
          return numQuestion({
            q: `Un entrepôt génère ${total} tonnes de déchets par an, dont ${rate} % sont recyclés. Combien de tonnes sont recyclées ?`,
            answer: (total * rate) / 100,
            unit: "tonnes",
            digits: 0,
            explain: `${total} × ${rate} % = ${fmt((total * rate) / 100, 0)} tonnes.`,
            wrong: [total - (total * rate) / 100, total * rate, total / rate, (total * rate) / 10],
          })
        },
        () => {
          const total = int(40, 200, 10)
          const recycled = Math.round(total * (int(50, 90) / 100))
          return numQuestion({
            q: `Sur ${total} tonnes de déchets, ${recycled} tonnes sont recyclées. Quel est le taux de recyclage ?`,
            answer: (recycled / total) * 100,
            unit: "%",
            digits: 1,
            max: 100,
            explain: `${recycled} / ${total} × 100 = ${fmt((recycled / total) * 100, 1)} %.`,
          })
        },
        () => {
          const units = int(500, 3000, 100)
          const saving = int(20, 120, 10)
          return numQuestion({
            q: `Le reconditionnement de ${fmt(units)} produits évite d'en fabriquer de nouveaux, à ${saving} kg de CO₂e évités par produit. Quelles émissions évite-t-on (en tonnes) ?`,
            answer: (units * saving) / 1000,
            unit: "t CO₂e",
            digits: 1,
            explain: `${fmt(units)} × ${saving} kg = ${fmt(units * saving, 0)} kg, soit ${fmt((units * saving) / 1000, 1)} tonnes.`,
            wrong: [units * saving, units / saving, (units * saving) / 100, (units * saving) / 10000],
          })
        },
        {
          q: "Que signifie économie circulaire ?",
          choices: ["Réduire les déchets en réutilisant et recyclant", "Livrer toujours dans la même ville", "Ne vendre que des produits ronds", "Faire circuler plus de camions"],
          answer: 0,
          explain: "L'économie circulaire cherche à boucler le cycle des matières plutôt qu'à les jeter après usage.",
        },
        {
          q: "Quel est le rôle de la logistique inverse ?",
          choices: ["Collecter et ramener les produits usagés", "Livrer plus vite les nouveaux produits", "Réduire le nombre d'entrepôts", "Fixer le prix des produits"],
          answer: 0,
          explain: "Sans collecte et transport retour, les produits usagés ne peuvent être ni réparés ni recyclés.",
        },
        {
          q: "Que signifie REP ?",
          choices: ["Responsabilité élargie du producteur", "Réduction des émissions par palette", "Répartition équitable des profits", "Réseau européen de production"],
          answer: 0,
          explain: "La REP oblige certains producteurs à financer la collecte et le recyclage de leurs produits en fin de vie.",
        },
        {
          q: "Que vise l'économie de fonctionnalité ?",
          choices: ["Vendre l'usage plutôt que le produit", "Vendre uniquement des pièces détachées", "Supprimer toute location", "Augmenter le volume des ventes"],
          answer: 0,
          explain: "Par la location ou l'abonnement, le producteur garde la propriété et a intérêt à rendre le produit durable.",
        },
        {
          q: "Qu'est-ce que le reconditionnement ?",
          choices: ["Remettre un produit en état pour le revendre", "Détruire un produit défectueux", "Changer l'emballage d'un produit neuf", "Ranger un produit à l'entrepôt"],
          answer: 0,
          explain: "Un produit reconditionné est nettoyé, réparé et testé pour une seconde vie.",
        },
      ],
    },

    {
      id: "emballages",
      title: "Emballages et palettes",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Un emballage, trois fonctions",
          body: "Un emballage **protège** le produit, permet de le **manipuler et le stocker**, et **informe** (étiquettes, consignes). Mais il représente aussi des **déchets** et des **coûts** (matière, transport d'air, manutention). L'objectif est le **juste emballage** : assez pour protéger, pas plus.",
        },
        {
          type: "list",
          title: "Les niveaux d'emballage",
          items: [
            ["Primaire", "Au contact du produit (le flacon, le sachet)."],
            ["Secondaire", "Regroupe plusieurs unités (carton de 12)."],
            ["Tertiaire", "Pour le transport et la manutention (palette, film étirable)."],
          ],
        },
        {
          type: "list",
          title: "Réduire l'impact",
          items: [
            ["Réduire le volume", "Moins de vide dans les cartons : plus de produits par palette, moins de camions."],
            ["Choisir les matériaux", "Carton recyclé, matériaux recyclables, moins de plastique."],
            ["Réemploi", "Palettes consignées, contenants réutilisables, caisses repliables."],
            ["Éviter le suremballage", "Un seul niveau suffisant plutôt que trois."],
          ],
        },
        {
          type: "formula",
          title: "Le taux de vide",
          formula: "Taux de vide = (volume du carton − volume du produit) / volume du carton × 100",
          legend: [
            ["Vide", "Espace occupé par de l'air ou du calage."],
            ["Effet", "Un carton plus petit permet de charger plus de colis par palette et par camion."],
          ],
          example: "Carton de 60 L pour un produit de 24 L : (60 − 24) / 60 = 60 % de vide. Avec un carton de 36 L : 33 % de vide.",
        },
        {
          type: "key",
          points: [
            "Emballage : protéger, manipuler, informer.",
            "Primaire, secondaire, tertiaire.",
            "Moins de vide = moins de camions, moins de matière, moins de CO₂.",
            "Le réemploi (palettes, contenants) réduit les déchets.",
          ],
        },
      ],
      quiz: [
        () => {
          const box = pick([40, 50, 60, 80])
          const product = Math.round(box * (int(30, 60) / 100))
          return numQuestion({
            q: `Un carton de ${box} litres contient un produit de ${product} litres. Quel est le taux de vide ?`,
            answer: ((box - product) / box) * 100,
            unit: "%",
            digits: 0,
            max: 100,
            explain: `(${box} − ${product}) / ${box} × 100 = ${fmt(((box - product) / box) * 100, 0)} %.`,
          })
        },
        () => {
          const perPallet = pick([20, 24, 30, 40])
          const gain = pick([20, 25, 30, 50])
          return numQuestion({
            q: `Un carton plus petit permet de charger ${gain} % de colis en plus sur une palette qui en contenait ${perPallet}. Combien de colis par palette cela donne-t-il ?`,
            answer: perPallet * (1 + gain / 100),
            unit: "colis",
            digits: 0,
            explain: `${perPallet} × ${fmt(1 + gain / 100)} = ${fmt(perPallet * (1 + gain / 100), 0)} colis.`,
            wrong: [perPallet, perPallet + gain, perPallet * gain, perPallet * (1 - gain / 100)],
          })
        },
        () => {
          const pallets = int(2, 20) * 100
          const price = int(8, 20)
          const reuse = pick([5, 10])
          return numQuestion({
            q: `Une palette neuve à usage unique coûte ${price} €. Une palette réutilisable est utilisée ${reuse} fois. Pour ${fmt(pallets)} palettes expédiées, combien de palettes neuves évite-t-on d'acheter en réemploi ?`,
            answer: pallets - pallets / reuse,
            unit: "palettes",
            digits: 0,
            explain: `Avec ${reuse} utilisations, il faut ${fmt(pallets / reuse, 0)} palettes au lieu de ${fmt(pallets, 0)} : ${fmt(pallets - pallets / reuse, 0)} évitées.`,
            wrong: [pallets / reuse, pallets, pallets * reuse, pallets - reuse],
          })
        },
        {
          q: "Quelle est la fonction principale d'un emballage tertiaire ?",
          choices: ["Faciliter le transport et la manutention", "Contenir directement le produit", "Informer le consommateur en rayon", "Regrouper quelques unités de vente"],
          answer: 0,
          explain: "L'emballage tertiaire (palette, film) permet de manipuler et de transporter les colis en grand nombre.",
        },
        {
          q: "À quel niveau appartient un flacon de shampoing ?",
          choices: ["Primaire", "Secondaire", "Tertiaire", "Ce n'est pas un emballage"],
          answer: 0,
          explain: "L'emballage primaire est au contact direct du produit.",
        },
        {
          q: "Pourquoi réduire le vide dans les cartons ?",
          choices: ["Pour charger plus de produits par camion", "Pour augmenter la taille des palettes", "Pour doubler le poids des colis", "Pour supprimer les contrôles"],
          answer: 0,
          explain: "Moins d'air transporté signifie moins de camions et d'émissions pour la même quantité de produits.",
        },
        {
          q: "Que désigne le suremballage ?",
          choices: ["Un emballage excessif par rapport au besoin", "Un emballage très résistant", "Un emballage recyclé uniquement", "Un emballage pour produits fragiles"],
          answer: 0,
          explain: "Plusieurs niveaux d'emballage inutiles ajoutent des déchets et des coûts sans apporter de protection.",
        },
        {
          q: "Quel est l'avantage d'une palette consignée ?",
          choices: ["Elle est réutilisée de nombreuses fois", "Elle ne pèse jamais rien", "Elle remplace le transporteur", "Elle ne nécessite aucun retour"],
          answer: 0,
          explain: "Le réemploi réduit les déchets et le coût par utilisation, à condition d'organiser la récupération.",
        },
      ],
    },

    {
      id: "reglementation-rse",
      title: "Réglementation et reporting RSE",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "De la bonne volonté à l'obligation",
          body: "Longtemps volontaire, la **responsabilité sociétale des entreprises (RSE)** devient de plus en plus **réglementée**. Les entreprises doivent mesurer, **rendre compte** de leurs impacts sociaux et environnementaux, et agir sur toute leur chaîne d'approvisionnement.",
        },
        {
          type: "list",
          title: "Les principaux textes",
          items: [
            ["CSRD (Europe)", "Directive sur le reporting de durabilité : les entreprises concernées publient des informations normalisées (environnement, social, gouvernance), y compris sur leur chaîne de valeur. Son champ et son calendrier évoluent."],
            ["Devoir de vigilance (France, 2017)", "Les grandes entreprises doivent prévenir les atteintes graves aux droits humains et à l'environnement dans leur chaîne d'approvisionnement."],
            ["Loi AGEC (France)", "Loi anti-gaspillage pour une économie circulaire : interdiction de détruire certains invendus non alimentaires, objectifs de recyclage."],
            ["ZFE", "Zones à faibles émissions : restrictions d'accès pour les véhicules les plus polluants."],
          ],
        },
        {
          type: "list",
          title: "Les labels et référentiels",
          items: [
            ["ISO 14001", "Management environnemental."],
            ["ISO 26000", "Lignes directrices de la responsabilité sociétale."],
            ["EcoVadis", "Notation RSE de fournisseurs, très utilisée par les acheteurs."],
            ["SBTi", "Objectifs de réduction des émissions alignés sur la science du climat."],
          ],
        },
        {
          type: "text",
          title: "Ce que cela change pour la supply chain",
          body: "Les acheteurs doivent **évaluer** leurs fournisseurs sur des critères RSE, **collecter** des données d'émissions, **auditer** les sites à risque et **inscrire** des clauses RSE dans les contrats. La logistique doit fournir des **données d'émissions** par transport et par site. La **traçabilité** devient un enjeu majeur.",
        },
        {
          type: "key",
          points: [
            "RSE de plus en plus réglementée : CSRD, devoir de vigilance, AGEC, ZFE.",
            "Référentiels : ISO 14001, ISO 26000, EcoVadis, SBTi.",
            "La supply chain doit fournir des données d'émissions et évaluer ses fournisseurs.",
          ],
        },
      ],
      quiz: [
        () => {
          const suppliers = int(50, 300, 10)
          const share = pick([20, 30, 40, 50])
          return numQuestion({
            q: `Une entreprise évalue ${share} % de ses ${suppliers} fournisseurs avec une notation RSE. Combien de fournisseurs sont évalués ?`,
            answer: (suppliers * share) / 100,
            unit: "fournisseurs",
            digits: 0,
            explain: `${suppliers} × ${share} % = ${fmt((suppliers * share) / 100, 0)} fournisseurs.`,
            wrong: [suppliers - (suppliers * share) / 100, suppliers * share, suppliers / share, (suppliers * share) / 10],
          })
        },
        () => {
          const sites = int(10, 60, 10)
          const risk = pick([10, 20, 30, 50])
          return numQuestion({
            q: `Parmi ${sites} sites de fournisseurs, ${risk} % sont jugés à risque et doivent être audités. Combien d'audits sont nécessaires ?`,
            answer: (sites * risk) / 100,
            unit: "audits",
            digits: 0,
            explain: `${sites} × ${risk} % = ${fmt((sites * risk) / 100, 0)} sites à auditer en priorité.`,
            wrong: [sites - (sites * risk) / 100, sites * risk, sites / risk, (sites * risk) / 10],
          })
        },
        {
          q: "Que signifie RSE ?",
          choices: ["Responsabilité sociétale des entreprises", "Réseau de stockage européen", "Réduction des stocks excédentaires", "Rapport de suivi des expéditions"],
          answer: 0,
          explain: "La RSE désigne la prise en compte par l'entreprise de ses impacts sociaux et environnementaux.",
        },
        {
          q: "Que vise la loi sur le devoir de vigilance ?",
          choices: ["Prévenir les atteintes aux droits humains et à l'environnement dans la chaîne", "Baisser les prix des produits importés", "Supprimer les droits de douane", "Limiter le nombre de fournisseurs"],
          answer: 0,
          explain: "Les grandes entreprises doivent identifier et prévenir les risques graves chez leurs filiales et leurs fournisseurs.",
        },
        {
          q: "Qu'est-ce que la CSRD ?",
          choices: ["Une directive européenne sur le reporting de durabilité", "Un label de qualité alimentaire", "Une taxe sur les emballages", "Un indice de prix du transport"],
          answer: 0,
          explain: "La CSRD impose aux entreprises concernées de publier des informations de durabilité normalisées.",
        },
        {
          q: "À quoi sert EcoVadis ?",
          choices: ["À noter les fournisseurs sur leurs pratiques RSE", "À calculer le prix du transport", "À réserver des conteneurs", "À suivre les stocks"],
          answer: 0,
          explain: "EcoVadis est une plateforme de notation RSE très utilisée par les acheteurs.",
        },
        {
          q: "Que fait une ZFE ?",
          choices: ["Elle restreint l'accès des véhicules les plus polluants", "Elle interdit tous les transports de marchandises", "Elle fixe le prix des carburants", "Elle supprime les livraisons de nuit"],
          answer: 0,
          explain: "Les zones à faibles émissions limitent la circulation de certains véhicules dans les agglomérations.",
        },
        {
          q: "Pourquoi inclure des clauses RSE dans les contrats ?",
          choices: ["Pour engager les fournisseurs sur des règles précises", "Pour réduire le nombre de fournisseurs", "Pour éviter de les évaluer", "Pour supprimer les audits"],
          answer: 0,
          explain: "Une clause contractuelle donne une base pour exiger des pratiques responsables et agir en cas de manquement.",
        },
      ],
    },
  ],
}
