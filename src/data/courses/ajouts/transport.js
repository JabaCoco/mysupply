// Lot 2 — Transport : 5 leçons ajoutées + questions supplémentaires pour les 3 leçons existantes.
import { int, numQuestion, pick } from '../../gen.js'

export default {
  more: {
    modes: [
      {
        q: "Quel mode de transport émet généralement le plus de CO₂ par tonne transportée ?",
        choices: ["L'aérien", "Le ferroviaire", "Le fluvial", "Le maritime"],
        answer: 0,
        explain: "L'avion émet beaucoup plus de CO₂ par tonne et par kilomètre que le bateau ou le train : c'est le mode le plus émetteur.",
      },
      {
        q: "Pour des produits lourds et peu urgents (sable, céréales) sur une voie navigable, on choisit plutôt…",
        choices: ["le fluvial, très économique pour les pondéreux", "l'aérien, pour gagner du temps", "l'express, pour livrer le jour même", "le messager à vélo, plus écologique"],
        answer: 0,
        explain: "Le fluvial est lent mais très bon marché : il convient bien aux marchandises lourdes et non urgentes quand une voie navigable existe.",
      },
      {
        q: "Le transport combiné route-rail consiste à…",
        choices: ["utiliser le train sur la longue distance et le camion aux extrémités", "faire rouler les camions directement sur les voies ferrées, sans les charger", "remplacer tous les camions de l'entreprise par des trains", "livrer uniquement les colis par le train de nuit"],
        answer: 0,
        explain: "On combine les atouts : le train pour la partie longue distance, le camion pour la collecte et la livraison finale.",
      },
      {
        q: "Un envoi urgent de pièces détachées, petit et de forte valeur, partira plutôt par…",
        choices: ["avion, car la vitesse justifie le coût", "bateau, car c'est le moins cher", "péniche, car elle est fiable", "train de marchandises, car il est régulier"],
        answer: 0,
        explain: "Quand le produit est urgent, léger et de grande valeur, le surcoût de l'aérien est vite compensé par le temps gagné.",
      },
      {
        q: "Quel mode permet un transport porte-à-porte sans changer de véhicule ?",
        choices: ["Le routier", "Le maritime", "Le ferroviaire", "Le fluvial"],
        answer: 0,
        explain: "Le camion peut aller de l'entrepôt de départ à celui d'arrivée sans rupture de charge, ce qui fait sa souplesse.",
      },
    ],
    incoterms: [
      {
        q: "En FCA, à quel moment le risque passe-t-il du vendeur à l'acheteur ?",
        choices: ["À la remise au transporteur de l'acheteur", "Quand la marchandise arrive à l'entrepôt de l'acheteur", "Quand le navire quitte le port de départ", "Quand la facture est payée par l'acheteur"],
        answer: 0,
        explain: "En FCA (Free Carrier), le vendeur a fini son travail une fois la marchandise remise au transporteur choisi par l'acheteur, au lieu convenu.",
      },
      {
        q: "Combien de règles compte la version Incoterms 2020 ?",
        choices: ["11", "7", "13", "4"],
        answer: 0,
        explain: "Incoterms 2020 compte 11 règles : 7 pour tous les modes de transport et 4 réservées au maritime et au fluvial.",
      },
      {
        q: "Quelles règles obligent le vendeur à souscrire une assurance du transport ?",
        choices: ["CIF et CIP", "EXW et FCA", "FOB et DAP", "DDP et FAS"],
        answer: 0,
        explain: "Seules les règles CIF et CIP imposent au vendeur d'assurer la marchandise (couverture minimale en CIF, plus large en CIP).",
      },
      {
        q: "Avec DAP, le vendeur…",
        choices: ["livre à destination, sans payer les droits d'importation", "livre à l'usine du vendeur, sans organiser de transport", "paie aussi les droits de douane à l'importation du pays", "n'a aucune responsabilité après le chargement de la marchandise"],
        answer: 0,
        explain: "DAP (Delivered At Place) : le vendeur supporte transport et risques jusqu'au lieu de destination, mais l'acheteur dédouane à l'import et paie les droits.",
      },
      {
        q: "Pour un envoi en conteneur, quelle règle la CCI recommande-t-elle plutôt que FOB ?",
        choices: ["FCA", "EXW", "DDP", "CFR"],
        answer: 0,
        explain: "Un conteneur est souvent remis au transporteur dans un terminal, avant d'être à bord : le risque passe donc plutôt en FCA qu'en FOB.",
      },
      {
        q: "Pourquoi EXW est-il parfois délicat pour l'acheteur ?",
        choices: ["Il doit tout organiser depuis les locaux du vendeur", "Il paie le transport jusqu'à son entrepôt sans rien décider", "Le vendeur refuse de lui remettre la marchandise", "Le vendeur choisit le transporteur à sa place"],
        answer: 0,
        explain: "En EXW, le vendeur met seulement la marchandise à disposition : l'acheteur gère presque tout, ce qui demande de l'expérience.",
      },
    ],
    "3pl": [
      {
        q: "Un prestataire 4PL est souvent décrit comme…",
        choices: ["un chef d'orchestre des prestataires", "un simple transporteur routier régional", "un fabricant de chariots élévateurs", "un fournisseur de matières premières"],
        answer: 0,
        explain: "Le 4PL (ou intégrateur) conçoit et pilote la chaîne : il coordonne les 3PL et les transporteurs pour le compte du client.",
      },
      {
        q: "Quel avantage le 3PL offre-t-il à une PME ?",
        choices: ["Accéder à des entrepôts sans investir", "Ne plus jamais avoir aucun stock à gérer", "Supprimer toute dépendance envers un fournisseur", "Fabriquer les produits à sa place"],
        answer: 0,
        explain: "Un 3PL mutualise entrepôts, équipes et outils : la PME évite un gros investissement et gagne en souplesse.",
      },
      {
        q: "Comment pilote-t-on un contrat avec un 3PL ?",
        choices: ["Avec des indicateurs de service et de qualité", "Uniquement avec le prix du mètre carré loué", "Sans indicateurs, par simple confiance mutuelle", "Avec le nombre de camions possédés"],
        answer: 0,
        explain: "Un contrat de logistique s'appuie sur des KPI (service, qualité, délais, coûts) pour mesurer la performance du prestataire.",
      },
      {
        q: "Quelle activité n'est généralement PAS confiée à un 3PL ?",
        choices: ["La conception des produits", "L'entreposage", "La préparation de commandes", "Le transport"],
        answer: 0,
        explain: "Un 3PL prend en charge des opérations logistiques (stockage, préparation, transport), pas la conception des produits.",
      },
    ],
  },

  lessons: [
    {
      id: "conteneur",
      title: "Le conteneur et l'EVP",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Une boîte standardisée",
          body: "Le conteneur maritime suit une norme internationale (ISO) : il se transporte de la même façon sur un navire, un train ou un camion. Deux longueurs dominent : **20 pieds** (environ 6 m) et **40 pieds** (environ 12 m).\n\nOn compte les volumes en **EVP** : l'**Équivalent Vingt Pieds** (TEU en anglais). Un conteneur de 20 pieds = **1 EVP**, un conteneur de 40 pieds = **2 EVP**.",
        },
        {
          type: "list",
          title: "Les tailles à connaître (ordres de grandeur)",
          items: [
            ["20 pieds standard", "Environ 33 m³ utiles et 28 tonnes de charge utile."],
            ["40 pieds standard", "Environ 67 m³ utiles et 26 tonnes de charge utile."],
            ["40 pieds High Cube", "Environ 76 m³ : plus haut d'environ 30 cm, utile pour les produits volumineux."],
            ["Règle pratique", "On est limité par le volume OU par le poids : le premier qui est atteint."],
          ],
        },
        {
          type: "list",
          title: "Les principaux types de conteneurs",
          items: [
            ["Standard (dry)", "Le plus courant : une boîte fermée pour la marchandise générale."],
            ["Frigorifique (reefer)", "Température contrôlée : produits frais, congelés, pharmaceutiques."],
            ["Open top / flat rack", "Toit ouvert ou plateau : marchandises hors gabarit ou très lourdes."],
            ["Citerne (tank)", "Pour les liquides et les gaz."],
          ],
        },
        {
          type: "list",
          title: "Complet ou groupage ?",
          items: [
            ["FCL (Full Container Load)", "Conteneur complet, utilisé par un seul chargeur."],
            ["LCL (Less than Container Load)", "Groupage : plusieurs chargeurs se partagent un conteneur, pour un envoi trop petit."],
            ["Quand choisir ?", "Le LCL coûte plus cher au m³ et prend plus de temps, mais évite de payer un conteneur à moitié vide."],
          ],
        },
        {
          type: "text",
          title: "Identifier et sécuriser un conteneur",
          body: "Chaque conteneur porte un **numéro unique de 11 caractères** : 4 lettres (le code du propriétaire) suivies de 7 chiffres, le dernier étant un chiffre de contrôle.\n\nIl est fermé par un **plomb** (scellé) numéroté : si le plomb est rompu, on sait que le conteneur a été ouvert. Depuis 2016, le **VGM** (masse brute vérifiée) doit être déclaré avant l'embarquement.",
        },
        {
          type: "key",
          points: [
            "1 EVP = un conteneur de 20 pieds ; 40 pieds = 2 EVP.",
            "20 pieds : environ 33 m³ et 28 t ; 40 pieds : environ 67 m³ et 26 t ; High Cube : environ 76 m³.",
            "FCL = conteneur complet ; LCL = groupage.",
            "Plomb = scellé ; VGM = masse brute vérifiée.",
          ],
        },
      ],
      quiz: [
        () => {
          const n40 = int(1, 9)
          const n20 = int(0, 6)
          return numQuestion({
            q: `Un navire charge ${n40} conteneurs de 40 pieds et ${n20} conteneur${n20 > 1 ? "s" : ""} de 20 pieds. Combien cela représente-t-il d'EVP ?`,
            answer: 2 * n40 + n20,
            unit: "EVP",
            explain: `Un 40 pieds vaut 2 EVP et un 20 pieds vaut 1 EVP : 2 × ${n40} + ${n20} = ${2 * n40 + n20} EVP.`,
            wrong: [n40 + n20, 2 * (n40 + n20), 2 * n40, 2 * n40 + n20 + 2],
          })
        },
        () => {
          const volume = pick([33, 67, 76])
          const pct = int(60, 95, 5)
          return numQuestion({
            q: `Un conteneur d'environ ${volume} m³ utiles est rempli à ${pct} %. Quel volume de marchandises contient-il, à peu près ?`,
            answer: (volume * pct) / 100,
            unit: "m³",
            digits: 1,
            explain: `${volume} m³ × ${pct} % = ${((volume * pct) / 100).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} m³.`,
          })
        },
        {
          q: "Que signifie EVP ?",
          choices: ["Équivalent Vingt Pieds", "Entrepôt de Vente Portuaire", "Expédition Vers Pays étranger", "Évaluation de la Valeur du Poids"],
          answer: 0,
          explain: "EVP veut dire Équivalent Vingt Pieds : l'unité qui permet de compter des conteneurs de tailles différentes (TEU en anglais).",
        },
        {
          q: "Qu'est-ce qui distingue un conteneur 40 pieds High Cube ?",
          choices: ["Il est plus haut, donc il offre un plus grand volume", "Il est plus court que le 40 pieds standard", "Il est réfrigéré en permanence", "Il ne peut transporter que des liquides"],
          answer: 0,
          explain: "Le High Cube mesure environ 30 cm de plus en hauteur : il offre un volume d'environ 76 m³, idéal pour les produits volumineux mais légers.",
        },
        {
          q: "Quel conteneur transporte des produits frais ou congelés ?",
          choices: ["Le frigorifique (reefer)", "Le conteneur citerne pour liquides", "L'open top à toit ouvert", "Le flat rack sans parois"],
          answer: 0,
          explain: "Le reefer dispose d'un groupe frigorifique branché sur le navire ou le terminal : il maintient la température demandée pendant tout le trajet.",
        },
        {
          q: "Que signifie FCL ?",
          choices: ["Un conteneur complet pour un seul chargeur", "Un conteneur partagé entre plusieurs chargeurs", "Un conteneur de 40 pieds uniquement", "Un conteneur en cours de dédouanement"],
          answer: 0,
          explain: "FCL (Full Container Load) : le chargeur paie le conteneur entier, qu'il soit plein ou non. Le groupage s'appelle LCL.",
        },
        {
          q: "Quand le groupage (LCL) est-il adapté ?",
          choices: ["Quand l'envoi ne remplit pas un conteneur", "Quand l'envoi remplit deux conteneurs complets", "Quand on veut un transport plus rapide", "Quand la marchandise est dangereuse"],
          answer: 0,
          explain: "Le LCL évite de payer un conteneur à moitié vide : plusieurs envois sont regroupés, au prix d'un coût au m³ plus élevé et de délais plus longs.",
        },
        {
          q: "À quoi sert le plomb (scellé) d'un conteneur ?",
          choices: ["Prouver que le conteneur n'a pas été ouvert", "Équilibrer le poids du conteneur sur le navire", "Indiquer la température intérieure", "Peser le conteneur automatiquement"],
          answer: 0,
          explain: "Le plomb est numéroté et enregistré sur les documents : un plomb rompu ou différent signale que le conteneur a pu être ouvert en route.",
        },
        {
          q: "Que désigne le VGM ?",
          choices: ["La masse brute vérifiée du conteneur", "La valeur globale de la marchandise chargée", "Le volume de gaz maximal autorisé", "Le visa de douane du transitaire"],
          answer: 0,
          explain: "Le VGM (Verified Gross Mass) oblige le chargeur à déclarer le poids réel du conteneur plein, pour la sécurité du navire.",
        },
      ],
    },

    {
      id: "routier",
      title: "Le transport routier",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Le mode le plus utilisé",
          body: "Le camion assure l'essentiel des transports de marchandises sur les distances courtes et moyennes. Sa force : la **souplesse** (porte-à-porte, horaires flexibles, accès partout).\n\nSes limites : une **capacité** limitée par véhicule, la **congestion**, la **réglementation du conducteur** et des **émissions de CO₂** plus élevées que le train ou le bateau.",
        },
        {
          type: "list",
          title: "Les grands types d'envois",
          items: [
            ["Lot complet", "Un camion entier pour un seul chargeur, direct de l'enlèvement à la livraison."],
            ["Lot partiel / groupage", "Plusieurs envois partagent un camion : on paie la place utilisée."],
            ["Messagerie", "Petits envois de plusieurs clients, regroupés dans un réseau de plateformes."],
            ["Express", "Livraison très rapide, à une heure ou un jour précis (J+1)."],
          ],
        },
        {
          type: "list",
          title: "Le véhicule (ordres de grandeur)",
          items: [
            ["Semi-remorque (13,6 m)", "Environ 33 palettes Europe (1,2 × 0,8 m) sur un plancher, ou 26 palettes de 1,2 × 1,0 m."],
            ["Charge utile", "Environ 25 tonnes pour une semi-remorque."],
            ["Porteur et fourgon", "Plus petits, pour la distribution urbaine et régionale."],
            ["Frigorifique", "Caisse isotherme avec groupe froid, pour les produits frais."],
          ],
        },
        {
          type: "list",
          title: "Ce qui fait le coût d'un transport routier",
          items: [
            ["Carburant et péages", "Variables selon la distance et le prix du gazole."],
            ["Conducteur", "Salaire et temps de conduite réglementé."],
            ["Véhicule", "Amortissement, entretien, assurance."],
            ["Retour à vide", "Kilomètres parcourus sans chargement : un coût que le transporteur répartit sur ses clients."],
          ],
        },
        {
          type: "text",
          title: "Les règles du conducteur",
          body: "En Europe, un conducteur ne peut conduire que **9 heures par jour** (10 heures deux fois par semaine). Il doit faire une **pause de 45 minutes** après **4 h 30 de conduite**. Un **tachygraphe** enregistre ces temps de conduite et de repos.\n\nCes règles fixent le **délai réaliste** d'une livraison : sur de longues distances, il faut parfois deux conducteurs ou une nuit de repos.",
        },
        {
          type: "key",
          points: [
            "Routier = souplesse et porte-à-porte, mais capacité et CO₂ limités.",
            "Lot complet, groupage, messagerie, express.",
            "Semi-remorque : environ 33 palettes Europe et 25 t de charge utile.",
            "Taux de remplissage élevé et peu de retours à vide = coût par palette plus bas.",
          ],
        },
      ],
      quiz: [
        () => {
          const loaded = int(14, 32)
          return numQuestion({
            q: `Une semi-remorque de 33 places palettes en transporte ${loaded}. Quel est son taux de remplissage, à peu près ?`,
            answer: (loaded / 33) * 100,
            unit: "%",
            max: 100,
            explain: `${loaded} / 33 × 100 ≈ ${Math.round((loaded / 33) * 100)} %. Plus ce taux est bas, plus chaque palette transportée coûte cher.`,
          })
        },
        {
          q: "Que désigne un « lot complet » ?",
          choices: ["Un camion entier pour un seul chargeur", "Un colis de moins de dix kilos livré en ville", "Un ensemble de plusieurs conteneurs", "Un envoi partagé avec d'autres clients"],
          answer: 0,
          explain: "En lot complet, le camion est réservé à un seul chargeur et va directement de l'enlèvement à la livraison.",
        },
        {
          q: "En quoi consiste la messagerie ?",
          choices: ["Regrouper de petits envois de plusieurs clients", "Livrer un seul client avec un camion complet dédié", "Transporter uniquement des lettres", "Utiliser des avions pour les petits colis"],
          answer: 0,
          explain: "La messagerie collecte des envois de plusieurs clients, les regroupe sur des plateformes et les redistribue : le coût est partagé.",
        },
        {
          q: "Combien de palettes Europe (1,2 × 0,8 m) tiennent environ dans une semi-remorque standard de 13,6 m ?",
          choices: ["33", "26", "48", "12"],
          answer: 0,
          explain: "Environ 33 palettes Europe sur un plancher de 13,6 m (26 si ce sont des palettes de 1,2 × 1,0 m).",
        },
        {
          q: "Qu'appelle-t-on un « retour à vide » ?",
          choices: ["Un retour du camion sans marchandise", "Un colis renvoyé par le client à l'usine", "Un conteneur vide renvoyé au port de départ", "Une palette vide renvoyée à l'usine du client"],
          answer: 0,
          explain: "Le camion qui rentre sans chargement coûte du carburant et du temps pour rien : les transporteurs cherchent à l'éviter.",
        },
        {
          q: "À quoi sert le tachygraphe ?",
          choices: ["Enregistrer les temps de conduite et de repos", "Mesurer le poids du chargement sur chaque essieu", "Calculer le prix du carburant à chaque plein", "Suivre la température de la remorque frigorifique"],
          answer: 0,
          explain: "Le tachygraphe contrôle le respect de la réglementation sur les temps de conduite et de repos.",
        },
        {
          q: "Après combien de conduite une pause de 45 minutes est-elle obligatoire en Europe ?",
          choices: ["4 h 30", "2 h", "6 h", "9 h"],
          answer: 0,
          explain: "La règle européenne impose une pause de 45 minutes (fractionnable) après 4 h 30 de conduite.",
        },
        {
          q: "Que peut faire un chargeur pour réduire le coût de transport par palette ?",
          choices: ["Regrouper ses commandes pour mieux remplir", "Passer toutes ses commandes en livraison express", "Livrer chaque client séparément", "Envoyer des camions à moitié vides"],
          answer: 0,
          explain: "Un camion mieux rempli répartit le coût fixe sur plus de palettes : regrouper les commandes réduit le coût unitaire.",
        },
      ],
    },

    {
      id: "maritime",
      title: "Le transport maritime",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Le mode des grands volumes",
          body: "Le transport maritime assure l'essentiel du commerce mondial en volume. Il est **lent** mais **très économique à la tonne** : un seul navire porte des milliers de conteneurs.\n\nC'est un transport **de port à port** : il faut ajouter un **pré-acheminement** (de l'usine au port de départ) et un **post-acheminement** (du port d'arrivée au client), souvent par camion ou par train.",
        },
        {
          type: "list",
          title: "Qui est qui ?",
          items: [
            ["Armateur (armement)", "Possède et exploite les navires, vend le transport (par exemple MSC, Maersk, CMA CGM)."],
            ["Chargeur", "L'entreprise qui expédie la marchandise."],
            ["Transitaire / commissionnaire", "Organise le transport et les formalités pour le chargeur."],
            ["Terminal et manutentionnaire", "Chargent et déchargent les conteneurs au port."],
            ["Consignataire", "Représente l'armateur dans le port : escales, documents, navires."],
          ],
        },
        {
          type: "list",
          title: "Lignes régulières ou affrètement",
          items: [
            ["Ligne régulière (liner)", "Des navires à rotations fixes, avec des escales et des horaires publiés : le cas du conteneur."],
            ["Tramping / affrètement", "Un navire est loué à la demande, souvent pour du vrac (céréales, minerais, pétrole)."],
          ],
        },
        {
          type: "list",
          title: "Une traversée Asie → Europe",
          items: [
            ["Départ", "Pré-acheminement, chargement au port d'Asie."],
            ["Traversée", "Environ 30 à 40 jours via le canal de Suez ; environ 10 jours de plus par le cap de Bonne-Espérance."],
            ["Transbordement", "Parfois, changement de navire dans un port intermédiaire (hub)."],
            ["Arrivée", "Déchargement, dédouanement, puis post-acheminement."],
          ],
        },
        {
          type: "list",
          title: "Le prix : fret de base + surcharges",
          items: [
            ["Fret de base", "Prix de transport du conteneur entre deux ports."],
            ["BAF", "Surcharge carburant (bunker adjustment factor)."],
            ["THC", "Frais de manutention du conteneur aux terminaux (terminal handling charges)."],
            ["Surcharge haute saison", "Ajoutée quand la demande est très forte."],
          ],
        },
        {
          type: "key",
          points: [
            "Lent mais très économique à la tonne : le mode des grands volumes.",
            "Transport de port à port : pré- et post-acheminement à ajouter.",
            "Ligne régulière pour le conteneur ; affrètement pour le vrac.",
            "Prix = fret de base + surcharges (BAF, THC…).",
          ],
        },
      ],
      quiz: [
        () => {
          const base = int(900, 2400, 50)
          const baf = int(100, 400, 10)
          const thc = int(150, 350, 10)
          return numQuestion({
            q: `Un devis maritime indique : fret de base ${base} €, BAF ${baf} €, THC ${thc} €. Quel est le prix total du conteneur ?`,
            answer: base + baf + thc,
            unit: "€",
            explain: `${base} + ${baf} + ${thc} = ${base + baf + thc} €. Le fret de base n'est qu'une partie du prix : il faut ajouter les surcharges.`,
            wrong: [base + baf, base + thc, base, base + baf + thc + 150],
          })
        },
        {
          q: "Qu'est-ce qu'une ligne régulière (liner) ?",
          choices: ["Des navires à escales et horaires fixes", "Un navire loué à la demande pour un seul voyage", "Un convoi de navires militaires escortant les cargos", "Une ligne de camions qui relient deux ports"],
          answer: 0,
          explain: "Sur une ligne régulière, les navires suivent une rotation publiée : c'est le fonctionnement habituel du transport de conteneurs.",
        },
        {
          q: "Qu'appelle-t-on le tramping ?",
          choices: ["Un navire affrété à la demande", "Un train de marchandises entre deux ports", "Le transport de conteneurs frigorifiques", "Un abonnement annuel à une ligne régulière"],
          answer: 0,
          explain: "Le tramping est l'affrètement d'un navire pour un voyage donné, sans horaires fixes : fréquent pour les céréales, les minerais ou le pétrole.",
        },
        {
          q: "À quoi correspond le BAF ?",
          choices: ["Une surcharge liée au carburant", "Une taxe de douane perçue à l'arrivée du navire", "Un frais de manutention du conteneur au terminal", "Une assurance obligatoire pour tous les navires"],
          answer: 0,
          explain: "Le BAF (bunker adjustment factor) ajuste le prix du transport selon le coût du carburant du navire.",
        },
        {
          q: "Qui possède et exploite les navires de ligne ?",
          choices: ["L'armateur", "Le transitaire qui organise le transport", "Le consignataire du port d'escale", "Le terminal portuaire du Havre"],
          answer: 0,
          explain: "L'armateur est la compagnie maritime : elle possède (ou affrète) les navires et vend le transport aux chargeurs.",
        },
        {
          q: "Que rémunère le THC ?",
          choices: ["La manutention au terminal", "Le carburant consommé par le navire", "L'assurance de la marchandise transportée", "Le travail du transitaire pour le client"],
          answer: 0,
          explain: "Les THC (terminal handling charges) couvrent le déplacement du conteneur sur le terminal et son chargement ou déchargement.",
        },
        {
          q: "Pourquoi certains navires contournent-ils l'Afrique par le cap de Bonne-Espérance ?",
          choices: ["Pour éviter Suez, au prix d'environ 10 jours de plus", "Parce que c'est un trajet nettement plus court qu'à Suez", "Parce que le canal de Suez est devenu gratuit pour tous", "Pour transporter plus de conteneurs sur chaque navire"],
          answer: 0,
          explain: "Quand la route de Suez est jugée trop risquée, les armateurs contournent l'Afrique : le trajet s'allonge d'environ une dizaine de jours.",
        },
        {
          q: "Qu'est-ce qu'un transbordement ?",
          choices: ["Le changement de navire en cours de route", "Le déchargement d'un camion à l'entrepôt", "L'inspection du conteneur par la douane", "Le remplacement du conteneur endommagé par un autre"],
          answer: 0,
          explain: "Le conteneur est déchargé dans un port hub puis rechargé sur un autre navire : cela relie de nombreuses lignes mais peut ajouter des délais.",
        },
        {
          q: "Que désigne le pré-acheminement ?",
          choices: ["Le transport de l'usine au port de départ", "Le transport du port d'arrivée jusqu'au client final", "La traversée en mer entre les deux ports", "La réservation de la place sur le navire"],
          answer: 0,
          explain: "Le pré-acheminement mène la marchandise jusqu'au port d'embarquement ; le post-acheminement l'emmène du port d'arrivée au client.",
        },
      ],
    },

    {
      id: "aerien",
      title: "Le transport aérien et l'express",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "La vitesse avant tout",
          body: "L'avion livre en **1 à 5 jours** presque partout dans le monde. C'est le mode le plus **rapide** et très **sûr**, mais aussi le plus **cher** et celui qui émet le plus de CO₂ par tonne.\n\nIl est réservé aux marchandises qui **justifient son prix** : de grande valeur, urgentes ou périssables.",
        },
        {
          type: "list",
          title: "Comment voyage une marchandise ?",
          items: [
            ["Soute d'avion de ligne", "Le fret voyage sous les passagers (belly cargo) : peu de capacité, beaucoup de destinations."],
            ["Avion tout-cargo", "Des avions dédiés au fret, pour les gros volumes et les marchandises encombrantes."],
            ["Intégrateur express", "Des entreprises comme DHL, FedEx ou UPS ont leurs avions, leurs camions et leur suivi : service porte-à-porte."],
          ],
        },
        {
          type: "text",
          title: "Le poids taxable",
          body: "Un avion est limité par le **volume** autant que par le **poids**. La compagnie facture donc le **plus grand** des deux : le **poids réel** ou le **poids volumétrique**.\n\nEn aérien, la règle courante est **1 m³ = 167 kg**. Le poids volumétrique = volume (m³) × 167. Exemple : un carton de 0,6 m³ pèse 40 kg, mais compte pour 0,6 × 167 ≈ 100 kg : c'est 100 kg qui seront facturés.",
        },
        {
          type: "list",
          title: "Documents et acteurs",
          items: [
            ["LTA (AWB)", "Lettre de transport aérien : preuve du contrat de transport. Elle n'est pas un titre de propriété (non négociable)."],
            ["Transitaire / agent de fret", "Réserve la capacité auprès de la compagnie et prépare les documents."],
            ["Compagnie aérienne", "Transporte la marchandise d'un aéroport à l'autre."],
            ["Handler", "Prestataire qui manutentionne le fret à l'aéroport."],
          ],
        },
        {
          type: "list",
          title: "Quelles marchandises ?",
          items: [
            ["Haute valeur", "Électronique, horlogerie, luxe : le coût du transport pèse peu dans le prix."],
            ["Urgentes", "Pièces détachées qui bloquent une usine, prototypes, documents."],
            ["Périssables", "Fleurs, poisson, fruits fragiles."],
            ["Sensibles", "Médicaments et produits à température dirigée."],
          ],
        },
        {
          type: "key",
          points: [
            "Rapide (1 à 5 jours) et sûr, mais cher et émetteur de CO₂.",
            "Poids taxable = le plus grand du poids réel et du poids volumétrique.",
            "Aérien : 1 m³ = 167 kg ; LTA = document non négociable.",
          ],
        },
      ],
      quiz: [
        () => {
          const L = int(40, 120, 10)
          const l = int(30, 80, 10)
          const h = int(30, 100, 10)
          const vol = (L * l * h) / 1_000_000
          return numQuestion({
            q: `Un colis mesure ${L} × ${l} × ${h} cm. Quel est son poids volumétrique en aérien (1 m³ = 167 kg) ?`,
            answer: vol * 167,
            unit: "kg",
            digits: 1,
            explain: `Volume = ${L} × ${l} × ${h} cm³ = ${vol.toLocaleString("fr-FR", { maximumFractionDigits: 3 })} m³. Poids volumétrique = ${vol.toLocaleString("fr-FR", { maximumFractionDigits: 3 })} × 167 ≈ ${(vol * 167).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} kg.`,
          })
        },
        () => {
          const real = int(20, 300, 10)
          const vol = int(2, 25) / 10
          const volumetric = vol * 167
          return numQuestion({
            q: `Un envoi aérien pèse ${real} kg et occupe ${vol.toLocaleString("fr-FR")} m³ (1 m³ = 167 kg). Quel est son poids taxable ?`,
            answer: Math.max(real, volumetric),
            unit: "kg",
            digits: 1,
            explain: `Poids volumétrique = ${vol.toLocaleString("fr-FR")} × 167 ≈ ${volumetric.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} kg. On facture le plus grand entre ${real} kg et ${volumetric.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} kg.`,
            wrong: [Math.min(real, volumetric), real + volumetric, real, volumetric * 1.2],
          })
        },
        {
          q: "Sur quel poids facture-t-on le fret aérien ?",
          choices: ["Le plus grand des deux poids", "Toujours le poids réel du colis", "Toujours le poids volumétrique seul", "La moyenne des deux poids mesurés"],
          answer: 0,
          explain: "La compagnie facture le plus grand des deux, car un colis volumineux et léger occupe autant de place qu'un colis plus lourd.",
        },
        {
          q: "Que représente la LTA (AWB) ?",
          choices: ["Un document de transport non négociable", "Un titre de propriété négociable, comme le connaissement", "La facture émise par le transitaire", "Le certificat d'origine de la marchandise"],
          answer: 0,
          explain: "La lettre de transport aérien prouve le contrat de transport, mais elle n'est pas négociable : elle ne représente pas la propriété de la marchandise.",
        },
        {
          q: "Que propose un intégrateur express comme DHL ou FedEx ?",
          choices: ["Un service porte-à-porte avec suivi", "Uniquement la vente d'avions aux compagnies", "Un transport maritime beaucoup moins cher", "La gestion des douanes pour le compte de l'État"],
          answer: 0,
          explain: "Les intégrateurs maîtrisent toute la chaîne (collecte, avions, plateformes, livraison) : le client suit son colis de bout en bout.",
        },
        {
          q: "Quel type de produit justifie le plus souvent l'aérien ?",
          choices: ["Les produits urgents ou de grande valeur", "Les céréales en vrac par grandes quantités", "Le sable et le gravier des carrières", "Les meubles volumineux et peu chers"],
          answer: 0,
          explain: "Le surcoût de l'avion est acceptable quand le produit a une forte valeur ou quand le temps gagné compte beaucoup.",
        },
        {
          q: "Pourquoi l'aérien coûte-t-il plus cher que la mer ?",
          choices: ["Faible capacité et forte consommation", "Parce que les avions volent toujours à vide", "Parce que les marchandises sont plus lourdes", "Parce qu'il n'y a aucun document à remplir"],
          answer: 0,
          explain: "Un avion transporte bien moins de tonnes qu'un navire et consomme beaucoup : la vitesse se paie cher à la tonne.",
        },
        {
          q: "Comment appelle-t-on le fret transporté dans la soute d'un avion de passagers ?",
          choices: ["Belly cargo", "Air cargo express", "Open top container", "Groupage aérien"],
          answer: 0,
          explain: "Le « belly cargo » voyage sous les passagers : peu de capacité par vol, mais beaucoup de destinations desservies.",
        },
      ],
    },

    {
      id: "tarification",
      title: "Lire et calculer un tarif de transport",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "Comment un transporteur facture",
          body: "Un transporteur facture selon trois choses : la **quantité transportée** (poids ou volume), la **distance ou la zone** et les **services** demandés.\n\nPour les petits envois, il ne facture pas le poids réel mais le **poids taxable** : le plus grand entre le poids réel et le **poids volumétrique**, qui mesure la place occupée.",
        },
        {
          type: "formula",
          title: "Poids volumétrique",
          formula: "Poids volumétrique = L × l × h (en m) × coefficient",
          legend: [
            ["L, l, h", "Longueur, largeur et hauteur du colis, converties en mètres."],
            ["Coefficient", "Kilos facturés par m³ : fixé par le mode de transport ou par le transporteur."],
            ["Poids taxable", "Le plus grand entre le poids réel et le poids volumétrique."],
          ],
          example: "Colis de 120 × 80 × 100 cm : volume 0,96 m³ ; en messagerie à 250 kg/m³, poids volumétrique = 240 kg.",
        },
        {
          type: "list",
          title: "Les coefficients usuels (ordres de grandeur)",
          items: [
            ["Aérien", "1 m³ = 167 kg."],
            ["Messagerie routière", "Souvent 1 m³ = 250 kg : le coefficient varie selon les transporteurs."],
            ["Maritime en groupage (LCL)", "1 m³ = 1 tonne : on facture le plus grand entre le nombre de tonnes et de m³."],
            ["À retenir", "Toujours vérifier le coefficient dans les conditions du transporteur."],
          ],
        },
        {
          type: "list",
          title: "Lire une grille de tarifs",
          items: [
            ["Tranches de poids", "Le prix au kilo ou aux 100 kg diminue quand le poids augmente."],
            ["Zones", "Le prix dépend de la destination : département, pays ou zone."],
            ["Minimum de perception", "Montant minimal facturé, même pour un très petit envoi."],
            ["Indexation gazole", "Une surcharge qui varie avec le prix du carburant."],
          ],
        },
        {
          type: "example",
          title: "Exemple chiffré",
          body: "Un colis de **120 × 80 × 100 cm** pèse **90 kg**.\n\n• Volume = 1,2 × 0,8 × 1,0 = **0,96 m³**\n• Poids volumétrique (250 kg/m³) = 0,96 × 250 = **240 kg**\n• Poids taxable = le plus grand de 90 et 240 = **240 kg**\n• À 0,30 € le kilo : 240 × 0,30 = **72 €**\n\nLe colis est facturé presque trois fois son poids réel, car il occupe beaucoup de place.",
        },
        {
          type: "key",
          points: [
            "Poids volumétrique = volume (m³) × coefficient (167 en aérien, souvent 250 en messagerie).",
            "Poids taxable = le plus grand du poids réel et du poids volumétrique.",
            "Grille : prix selon la tranche de poids et la zone, avec un minimum de perception.",
            "Comparer deux transporteurs = tarif + surcharges + délais + qualité.",
          ],
        },
      ],
      quiz: [
        () => {
          const L = int(60, 140, 10)
          const l = int(40, 100, 10)
          const h = int(40, 120, 10)
          const vol = (L * l * h) / 1_000_000
          return numQuestion({
            q: `Un colis de ${L} × ${l} × ${h} cm part en messagerie (1 m³ = 250 kg). Quel est son poids volumétrique ?`,
            answer: vol * 250,
            unit: "kg",
            digits: 1,
            explain: `Volume = ${vol.toLocaleString("fr-FR", { maximumFractionDigits: 3 })} m³ ; poids volumétrique = ${vol.toLocaleString("fr-FR", { maximumFractionDigits: 3 })} × 250 ≈ ${(vol * 250).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} kg.`,
          })
        },
        () => {
          const real = int(30, 300, 10)
          const volumetric = int(30, 300, 10)
          const rate = int(20, 60, 5) / 100
          const taxable = Math.max(real, volumetric)
          return numQuestion({
            q: `Un envoi pèse ${real} kg et son poids volumétrique est de ${volumetric} kg. Le tarif est de ${rate.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} € le kilo taxable. Combien coûte le transport ?`,
            answer: taxable * rate,
            unit: "€",
            digits: 1,
            explain: `Poids taxable = le plus grand de ${real} et ${volumetric} = ${taxable} kg. Coût = ${taxable} × ${rate.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} = ${(taxable * rate).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} €.`,
            wrong: [Math.min(real, volumetric) * rate, (real + volumetric) * rate, taxable * rate * 1.25, taxable * rate * 0.8],
          })
        },
        () => {
          const tonnes = int(2, 9)
          const m3 = int(2, 9)
          return numQuestion({
            q: `En maritime groupage (1 m³ = 1 tonne), un envoi pèse ${tonnes} tonnes et occupe ${m3} m³. Sur quelle quantité est-il facturé ?`,
            answer: Math.max(tonnes, m3),
            unit: tonnes >= m3 ? "tonnes" : "m³",
            explain: `On facture le plus grand entre ${tonnes} tonnes et ${m3} m³ : ${Math.max(tonnes, m3)} ${tonnes >= m3 ? "tonnes" : "m³"}.`,
            wrong: [Math.min(tonnes, m3), tonnes + m3, Math.max(tonnes, m3) + 1, Math.max(tonnes, m3) - 1],
          })
        },
        {
          q: "Pourquoi un colis volumineux et léger est-il facturé plus cher que son poids réel ?",
          choices: ["Il est facturé sur son poids volumétrique", "Parce que les transporteurs détestent les gros colis", "Parce que le transporteur ajoute une taxe au hasard", "Parce que le poids réel est toujours faux"],
          answer: 0,
          explain: "Un camion, un avion ou un conteneur se remplit en volume avant de se remplir en poids : la place occupée est donc facturée.",
        },
        {
          q: "Qu'est-ce que le minimum de perception ?",
          choices: ["Le montant minimal facturé par envoi", "Le poids minimal accepté par le transporteur", "La remise accordée aux gros clients fidèles", "La taxe payée à la douane à l'arrivée"],
          answer: 0,
          explain: "Un petit envoi coûte presque autant à traiter qu'un autre : le transporteur fixe un prix minimum par envoi.",
        },
        {
          q: "À quoi sert l'indexation gazole ?",
          choices: ["Ajuster le prix selon le carburant", "Réduire le poids des marchandises transportées", "Calculer la distance entre deux villes", "Fixer le prix d'achat d'un camion neuf"],
          answer: 0,
          explain: "Le carburant est un coût important et variable : la surcharge gazole se met à jour avec son prix, sans renégocier tout le tarif.",
        },
        {
          q: "Dans une grille de tarifs, de quoi dépend le prix d'un envoi ?",
          choices: ["De la tranche de poids et de la zone", "De la couleur et de la forme du colis", "Du jour de la semaine uniquement", "Du nom et de l'adresse du destinataire"],
          answer: 0,
          explain: "Une grille croise des tranches de poids (en lignes) et des zones géographiques (en colonnes) : à chaque case correspond un tarif.",
        },
        {
          q: "Pour comparer deux transporteurs, que faut-il regarder ?",
          choices: ["Le coût complet, délais et qualité inclus", "Uniquement le prix au kilo affiché sur le devis", "Uniquement la taille de leurs camions", "Uniquement la marque de leurs véhicules"],
          answer: 0,
          explain: "Un tarif bas peut cacher des surcharges, des délais plus longs ou des retards : on compare le coût complet et la qualité.",
        },
      ],
    },
  ],
}
