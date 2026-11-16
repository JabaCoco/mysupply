// Lot 5 — Achats : 4 leçons ajoutées + questions supplémentaires pour les 2 leçons existantes.
import { fmt, int, numQuestion, pick } from '../../gen.js'

const WEIGHTS = [
  [40, 35, 25],
  [50, 30, 20],
  [30, 40, 30],
  [45, 35, 20],
]

export default {
  more: {
    processus: [
      {
        q: "Que contient un cahier des charges d'achat ?",
        choices: ["Le besoin, les spécifications, les quantités et les délais", "Le prix de vente que le client final paiera", "La liste des salariés qui travailleront chez le fournisseur", "Le plan comptable de l'entreprise acheteuse"],
        answer: 0,
        explain: "Le cahier des charges décrit précisément ce que l'on veut acheter : spécifications, quantités, délais, critères de qualité. Sans lui, les offres ne sont pas comparables.",
      },
      () => {
        const spend = int(2, 15) * 1000000
        const pct = pick([1, 2, 3, 4, 5])
        return numQuestion({
          q: `Une entreprise achète pour ${fmt(spend, 0)} € par an. Son service achats obtient ${pct} % de baisse de prix. Quelle économie annuelle cela représente-t-il ?`,
          answer: (spend * pct) / 100,
          unit: "€",
          digits: 0,
          explain: `Économie = ${fmt(spend, 0)} × ${pct} % = ${fmt((spend * pct) / 100, 0)} € par an, qui s'ajoutent directement au résultat.`,
          wrong: [spend * pct, spend / pct, spend + pct, (spend * pct) / 10],
        })
      },
      {
        q: "À quoi sert un bon de commande ?",
        choices: ["Confirmer la commande", "Réclamer le paiement d'une facture au client", "Mesurer la qualité des produits livrés", "Calculer le stock de sécurité d'un article"],
        answer: 0,
        explain: "Le bon de commande indique les articles, quantités, prix et dates convenus : c'est la preuve de l'engagement d'achat envers le fournisseur.",
      },
      {
        q: "Pourquoi évalue-t-on régulièrement ses fournisseurs ?",
        choices: ["Mesurer leur performance", "Choisir la couleur de leurs emballages", "Connaître leur nombre exact d'employés", "Vérifier qu'ils ont une adresse internet"],
        answer: 0,
        explain: "Une évaluation (qualité, coût, délai, service) permet d'améliorer la relation, de signaler les écarts ou de changer de fournisseur si besoin.",
      },
    ],
    fournisseurs: [
      () => {
        const price = int(8, 40)
        const transport = int(5, 25) / 10
        const storage = int(2, 15) / 10
        const defects = int(2, 12) / 10
        const total = price + transport + storage + defects
        return numQuestion({
          q: `Un fournisseur vend à ${fmt(price)} € l'unité. Transport : ${fmt(transport)} €, stockage : ${fmt(storage)} €, coût de la non-qualité : ${fmt(defects)} € par unité. Quel est le TCO unitaire ?`,
          answer: total,
          unit: "€",
          digits: 2,
          explain: `TCO = ${fmt(price)} + ${fmt(transport)} + ${fmt(storage)} + ${fmt(defects)} = ${fmt(total)} € par unité : bien plus que le seul prix d'achat.`,
          wrong: [price, price + transport, price + storage + defects, total * 1.2],
        })
      },
      {
        q: "Dans la matrice de Kraljic, un achat à faible impact financier mais à fort risque d'approvisionnement est…",
        choices: ["Critique", "Simple", "Levier", "Stratégique"],
        answer: 0,
        explain: "Faible impact et fort risque : un achat « critique » ou « goulot ». On sécurise l'approvisionnement avec du stock ou une deuxième source.",
      },
      {
        q: "Que signifie être en situation de fournisseur unique (single source) ?",
        choices: ["Dépendre d'un seul fournisseur pour un produit", "Avoir un seul contrat pour tous les produits achetés", "Acheter à un fournisseur par an seulement", "Payer toutes ses factures en une seule fois"],
        answer: 0,
        explain: "Un fournisseur unique crée une dépendance : s'il a un problème, l'entreprise n'a pas d'alternative immédiate. Le double sourcing réduit ce risque.",
      },
      {
        q: "Quelle stratégie convient à un achat « simple » (fournitures de bureau) ?",
        choices: ["Simplifier et automatiser, avec un catalogue", "Négocier un partenariat de dix ans", "Visiter chaque fournisseur chaque trimestre", "Constituer un stock stratégique de plusieurs années"],
        answer: 0,
        explain: "Faible impact et faible risque : on réduit le temps passé avec des catalogues, des commandes automatisées et peu de fournisseurs.",
      },
    ],
  },

  lessons: [
    {
      id: "sourcing",
      title: "Le sourcing et l'appel d'offres",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "Le sourcing, du besoin à la sélection",
          body: "Le **sourcing** consiste à **trouver et sélectionner les fournisseurs** les plus adaptés à un besoin.\n\nLes étapes : définir le besoin → rechercher des fournisseurs (annuaires, salons, références) → **présélectionner** selon des critères → **consulter** les fournisseurs retenus → **comparer** les offres → **choisir** et contractualiser.",
        },
        {
          type: "list",
          title: "Les demandes envoyées aux fournisseurs",
          items: [
            ["RFI (demande d'information)", "Pour connaître les fournisseurs possibles et leurs capacités, avant de lancer l'achat."],
            ["RFQ (demande de prix)", "Pour un produit défini : on demande un prix et des délais."],
            ["RFP (demande de proposition)", "Pour un besoin complexe : le fournisseur propose une solution, pas seulement un prix."],
            ["Appel d'offres", "Procédure formelle et encadrée : règles identiques pour tous, obligatoire dans le public."],
          ],
        },
        {
          type: "list",
          title: "Les critères de choix",
          items: [
            ["QCD", "Qualité, coût (TCO) et délai : la base de toute comparaison."],
            ["Capacité et solidité", "Peut-il suivre la demande ? Est-il financièrement stable ?"],
            ["Risques", "Dépendance, localisation, conformité, réputation."],
            ["RSE et innovation", "Engagements sociaux et environnementaux, capacité à innover."],
          ],
        },
        {
          type: "formula",
          title: "La grille de notation pondérée",
          formula: "Note finale = Σ (poids du critère × note du critère)",
          legend: [
            ["Poids", "Importance du critère, en %. La somme des poids vaut 100 %."],
            ["Note", "Évaluation du fournisseur sur ce critère (par exemple de 0 à 10)."],
            ["Note finale", "Sert à classer les fournisseurs de façon objective."],
          ],
          example: "Qualité 40 % (note 8), Coût 35 % (note 6), Délai 25 % (note 9) : 0,40 × 8 + 0,35 × 6 + 0,25 × 9 = 3,2 + 2,1 + 2,25 = 7,55.",
        },
        {
          type: "key",
          points: [
            "Sourcing : chercher, présélectionner, consulter, comparer, choisir.",
            "RFI = information ; RFQ = prix ; RFP = proposition ; appel d'offres = procédure formelle.",
            "On compare au TCO et on note chaque critère selon une pondération définie à l'avance.",
            "Mêmes règles et même cahier des charges pour tous les fournisseurs consultés.",
          ],
        },
      ],
      quiz: [
        () => {
          const [wq, wc, wd] = pick(WEIGHTS)
          const nq = int(4, 10)
          const nc = int(4, 10)
          const nd = int(4, 10)
          const score = (wq * nq + wc * nc + wd * nd) / 100
          return numQuestion({
            q: `Qualité ${wq} % (note ${nq}), coût ${wc} % (note ${nc}), délai ${wd} % (note ${nd}). Quelle est la note finale pondérée du fournisseur ?`,
            answer: score,
            unit: "/10",
            digits: 2,
            explain: `${wq / 100} × ${nq} + ${wc / 100} × ${nc} + ${wd / 100} × ${nd} = ${fmt(score)} sur 10.`,
            wrong: [(nq + nc + nd) / 3, score + 0.8, score - 0.7, nq + nc + nd],
          })
        },
        {
          q: "Que signifie RFQ ?",
          choices: ["Demande de prix (Request For Quotation)", "Demande d'information (Request For Information)", "Demande de proposition (Request For Proposal)", "Règlement fournisseur de qualité"],
          answer: 0,
          explain: "Une RFQ demande un prix et des délais pour un produit déjà défini ; la RFI demande des informations et la RFP une solution complète.",
        },
        {
          q: "Quand envoie-t-on plutôt une RFP ?",
          choices: ["Pour un besoin complexe qui demande une solution", "Pour un produit standard au catalogue", "Pour renouveler un contrat existant sans changement", "Pour fournir une facture à un client"],
          answer: 0,
          explain: "Une RFP (Request For Proposal) laisse le fournisseur proposer sa solution : elle convient quand le besoin est complexe ou mal défini.",
        },
        {
          q: "Pourquoi donne-t-on les mêmes règles à tous les fournisseurs consultés ?",
          choices: ["Pour comparer des offres équivalentes", "Pour qu'ils proposent tous le même prix", "Pour réduire le nombre de réponses reçues", "Pour éviter de lire leurs propositions"],
          answer: 0,
          explain: "Un même cahier des charges et les mêmes critères garantissent une comparaison équitable : on compare des offres sur le même périmètre.",
        },
        {
          q: "Quel est l'intérêt d'une grille de notation pondérée ?",
          choices: ["Classer objectivement", "Supprimer toute négociation avec eux", "Fixer le prix de vente aux clients", "Remplacer le cahier des charges"],
          answer: 0,
          explain: "Chaque critère reçoit un poids selon son importance : la note finale permet de classer les offres sans se fier à une impression.",
        },
        {
          q: "Que signifie QCD dans la sélection d'un fournisseur ?",
          choices: ["Qualité, coût et délai", "Quantité, contrat et douane", "Qualité, conformité et diversité", "Quai, camion et dépôt"],
          answer: 0,
          explain: "QCD est la base de l'évaluation : on compare les fournisseurs sur la qualité, le coût (si possible complet, le TCO) et le délai.",
        },
        {
          q: "À quoi sert une RFI ?",
          choices: ["À connaître les fournisseurs", "À demander un prix pour un article précis", "À signer le contrat d'achat définitif", "À payer un acompte au fournisseur"],
          answer: 0,
          explain: "La RFI (Request For Information) est une étape exploratoire : elle aide à repérer les fournisseurs possibles avant l'achat.",
        },
        {
          q: "Pourquoi consulte-t-on plusieurs fournisseurs plutôt qu'un seul ?",
          choices: ["Pour comparer les offres", "Pour dépenser davantage en frais de consultation", "Pour compliquer la gestion des commandes", "Pour retarder le choix final"],
          answer: 0,
          explain: "La mise en concurrence donne des points de comparaison (prix, délais, conditions) et améliore la position de négociation de l'acheteur.",
        },
      ],
    },

    {
      id: "negociation",
      title: "La négociation d'achat",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "Préparer sa négociation",
          body: "Une bonne négociation se **prépare** : connaître son besoin, le marché, le fournisseur et ses **alternatives** (que faire si l'accord échoue ?).\n\nL'acheteur fixe trois niveaux : un **objectif idéal**, un **objectif réaliste** et une **limite** au-delà de laquelle il refuse l'accord.",
        },
        {
          type: "list",
          title: "Les leviers de négociation",
          items: [
            ["Volume", "Regrouper les commandes ou les sites pour peser davantage."],
            ["Durée", "S'engager sur plusieurs années contre un meilleur prix."],
            ["Conditions de paiement", "Obtenir un paiement à 60 jours au lieu de 30 : un avantage financier."],
            ["Mise en concurrence", "Comparer plusieurs offres pour renforcer sa position."],
            ["Standardisation", "Réduire les spécifications pour simplifier la fabrication du fournisseur."],
          ],
        },
        {
          type: "list",
          title: "Les étapes d'une négociation",
          items: [
            ["Préparation", "Objectifs, arguments, alternatives, rôles dans l'équipe."],
            ["Ouverture et argumentation", "Présenter ses besoins, écouter, justifier."],
            ["Concessions", "On échange : chaque concession doit avoir une contrepartie."],
            ["Conclusion", "Reformuler l'accord et le confirmer par écrit."],
            ["Suivi", "Vérifier que ce qui a été promis est appliqué."],
          ],
        },
        {
          type: "text",
          title: "Négocier le coût total, pas seulement le prix",
          body: "Un prix unitaire plus bas n'est pas toujours le meilleur résultat. On négocie aussi les **délais**, la **qualité**, les **délais de paiement**, la **logistique** (franco ou non) et la **révision des prix**.\n\nExemple : une remise de **3 %** sur **1,2 M€** d'achats rapporte **36 000 €**. Passer le paiement de **30 à 60 jours** avec un coût de l'argent de **5 %** par an rapporte environ 1,2 M€ × 5 % × 30/365 ≈ **4 900 €** de plus.",
        },
        {
          type: "key",
          points: [
            "Préparer : besoin, marché, alternatives, objectif idéal / réaliste / limite.",
            "Leviers : volume, durée, paiement, concurrence, standardisation.",
            "Chaque concession demande une contrepartie.",
            "On négocie le coût total, pas seulement le prix.",
          ],
        },
      ],
      quiz: [
        () => {
          const spend = int(5, 30) * 100000
          const discount = pick([2, 3, 4, 5, 6])
          return numQuestion({
            q: `Un acheteur obtient ${discount} % de remise sur ${fmt(spend, 0)} € d'achats annuels. Quel est le gain annuel ?`,
            answer: (spend * discount) / 100,
            unit: "€",
            digits: 0,
            explain: `Gain = ${fmt(spend, 0)} × ${discount} % = ${fmt((spend * discount) / 100, 0)} € par an.`,
            wrong: [spend * discount, spend / discount, spend - discount, (spend * discount) / 10],
          })
        },
        () => {
          const amount = int(5, 30) * 100000
          const rate = pick([3, 4, 5, 6])
          const extra = pick([30, 45, 60])
          const gain = (amount * rate * extra) / 100 / 365
          return numQuestion({
            q: `Un fournisseur accepte ${extra} jours de délai de paiement supplémentaires sur ${fmt(amount, 0)} € d'achats. Avec un coût de l'argent de ${rate} % par an, quel est le gain financier, à peu près ?`,
            answer: gain,
            unit: "€",
            digits: 0,
            explain: `Gain = montant × taux × jours / 365 = ${fmt(amount, 0)} × ${rate} % × ${extra} / 365 ≈ ${fmt(gain, 0)} €.`,
            wrong: [amount * rate / 100, gain * 2, gain / 2, gain * 3],
          })
        },
        {
          q: "Pourquoi connaître ses alternatives avant de négocier ?",
          choices: ["Pour savoir quand refuser un accord insuffisant", "Pour montrer au fournisseur qu'on est pressé", "Pour éviter de préparer des arguments", "Pour obtenir un prix identique à celui du marché"],
          answer: 0,
          explain: "Connaître sa meilleure alternative donne une limite claire : si l'offre est moins bonne, on peut la refuser sans stress.",
        },
        {
          q: "Que doit accompagner chaque concession dans une négociation ?",
          choices: ["Une contrepartie", "Une excuse", "Un nouveau délai de livraison", "Un contrat de dix ans"],
          answer: 0,
          explain: "On ne cède jamais gratuitement : une concession s'échange contre un avantage (volume, durée, paiement) pour garder l'équilibre.",
        },
        {
          q: "Quel levier consiste à regrouper les besoins de plusieurs sites ?",
          choices: ["Le volume", "La durée", "La standardisation", "La transparence des coûts"],
          answer: 0,
          explain: "En regroupant les achats de plusieurs sites, l'entreprise représente un client plus gros et peut négocier de meilleurs prix.",
        },
        {
          q: "Pourquoi un délai de paiement plus long est-il intéressant pour l'acheteur ?",
          choices: ["Il garde de la trésorerie plus longtemps", "Il réduit automatiquement le prix du produit", "Il améliore la qualité des livraisons", "Il supprime le besoin de contrat"],
          answer: 0,
          explain: "Payer plus tard permet de conserver l'argent plus longtemps : c'est un gain financier, sans modifier le prix affiché.",
        },
        {
          q: "Quand une négociation est-elle conclue correctement ?",
          choices: ["Quand l'accord est confirmé par écrit", "Quand les deux parties se serrent la main", "Quand le fournisseur refuse de répondre", "Quand l'acheteur change de sujet"],
          answer: 0,
          explain: "Un accord oral peut être compris différemment par chacun : on le reformule et on le confirme par écrit pour éviter les malentendus.",
        },
        {
          q: "Pourquoi négocier uniquement le prix unitaire est-il insuffisant ?",
          choices: ["Délais et qualité jouent aussi", "Parce que le prix n'a aucune importance", "Parce que le fournisseur fixe toujours le prix", "Parce que seule la qualité compte"],
          answer: 0,
          explain: "Un prix bas peut être compensé par des retards, des défauts ou des conditions de paiement défavorables : le coût total compte.",
        },
      ],
    },

    {
      id: "contrats",
      title: "Les contrats d'achat",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "À quoi sert un contrat ?",
          body: "Un contrat fixe les **droits et obligations** de chaque partie : ce qui est acheté, à quel prix, quand, avec quelle qualité, et ce qui se passe en cas de problème.\n\nIl **sécurise** la relation et évite les conflits : quand un incident arrive, on relit ce qui a été convenu.",
        },
        {
          type: "list",
          title: "Les grands types de contrats",
          items: [
            ["Commande ponctuelle", "Un bon de commande, avec les conditions générales d'achat : pour un besoin isolé."],
            ["Contrat-cadre (accord-cadre)", "Prix et conditions fixés pour une durée ; on passe ensuite des commandes au fil de l'eau."],
            ["Contrat de partenariat (long terme)", "Engagement réciproque, souvent avec des objectifs communs d'amélioration."],
            ["Contrat avec engagement de volume", "Le client s'engage à acheter un minimum ; le fournisseur garantit sa capacité."],
          ],
        },
        {
          type: "list",
          title: "Les clauses clés",
          items: [
            ["Objet, prix et révision", "Ce qui est acheté, le prix, et comment il peut évoluer (indice, matières premières)."],
            ["Quantités et délais", "Volumes, dates de livraison, pénalités de retard."],
            ["Qualité et garantie", "Normes à respecter, contrôles, durée de garantie."],
            ["Livraison et Incoterm", "Qui paie le transport, où le risque est transféré."],
            ["Paiement", "Délai et mode de paiement."],
            ["Rupture et résiliation", "Conditions pour mettre fin au contrat, droit applicable."],
          ],
        },
        {
          type: "list",
          title: "Conditions générales : achat ou vente ?",
          items: [
            ["CGA", "Conditions générales d'achat : les règles de l'acheteur."],
            ["CGV", "Conditions générales de vente : les règles du fournisseur."],
            ["En cas de conflit", "Les conditions particulières signées par les deux parties l'emportent sur les conditions générales."],
          ],
        },
        {
          type: "example",
          title: "Exemple : la clause de pénalités",
          body: "Un contrat prévoit **0,5 % du montant de la commande par jour de retard**, avec un **plafond de 10 %**. Pour une commande de **100 000 €** livrée avec **8 jours de retard** : 0,5 % × 8 = 4 % soit **4 000 €**. Avec 30 jours de retard, le calcul donnerait 15 %, mais le plafond limite la pénalité à **10 000 €**.",
        },
        {
          type: "key",
          points: [
            "Un contrat fixe prix, quantités, délais, qualité, paiement et conséquences d'un incident.",
            "Commande ponctuelle, contrat-cadre, partenariat, engagement de volume.",
            "Les conditions particulières signées l'emportent sur les conditions générales.",
            "Les pénalités de retard sont souvent plafonnées.",
          ],
        },
      ],
      quiz: [
        () => {
          const amount = int(5, 50) * 10000
          const rate = pick([0.5, 1])
          const days = int(3, 25)
          const cap = 10
          const pen = Math.min((amount * rate * days) / 100, (amount * cap) / 100)
          return numQuestion({
            q: `Pénalité de ${fmt(rate)} % du montant par jour de retard, plafonnée à ${cap} %. Commande de ${fmt(amount, 0)} €, livrée avec ${days} jours de retard. Quelle pénalité s'applique ?`,
            answer: pen,
            unit: "€",
            digits: 0,
            explain: `Sans plafond : ${fmt(rate)} % × ${days} jours = ${fmt(rate * days)} %. Le plafond est de ${cap} % : la pénalité vaut ${fmt(Math.min(rate * days, cap))} % de ${fmt(amount, 0)} € = ${fmt(pen, 0)} €.`,
            wrong: [(amount * rate * days) / 100, (amount * cap) / 100 * 2, amount / days, pen / 2],
          })
        },
        {
          q: "Qu'est-ce qu'un contrat-cadre ?",
          choices: ["Un accord de prix pour une durée", "Un contrat limité à une seule livraison", "Un contrat sans aucun prix défini", "Un contrat réservé aux clients étrangers"],
          answer: 0,
          explain: "Le contrat-cadre fixe les règles pour une période : ensuite, chaque commande se passe simplement, sans renégocier à chaque fois.",
        },
        {
          q: "Que se passe-t-il en cas de conflit entre conditions générales et conditions particulières signées ?",
          choices: ["Les conditions particulières l'emportent", "Les conditions générales l'emportent toujours", "Le contrat devient automatiquement nul", "Le plus ancien document l'emporte"],
          answer: 0,
          explain: "Ce qui a été négocié spécifiquement et signé par les deux parties prévaut sur les conditions générales standards.",
        },
        {
          q: "À quoi sert une clause de révision de prix ?",
          choices: ["Adapter le prix à un indice", "Interdire toute modification de la commande", "Fixer le salaire du fournisseur", "Changer le fournisseur sans préavis"],
          answer: 0,
          explain: "Quand les matières ou l'énergie varient, la clause de révision indique comment le prix suit un indice défini à l'avance.",
        },
        {
          q: "Que précise la clause sur l'Incoterm ?",
          choices: ["Qui paie le transport et le risque", "Le nombre de salariés du fournisseur", "La marge du fournisseur sur chaque article", "Le lieu de signature du contrat"],
          answer: 0,
          explain: "L'Incoterm répartit les coûts et les risques du transport entre vendeur et acheteur : il doit être précisé dans le contrat.",
        },
        {
          q: "Que désignent les CGA ?",
          choices: ["Les conditions générales d'achat", "Les conditions générales d'assurance", "Les comptes généraux annuels", "Les contrôles de garantie des articles"],
          answer: 0,
          explain: "Les CGA sont les règles standard imposées par l'acheteur à ses fournisseurs ; les CGV sont celles du vendeur.",
        },
        {
          q: "Pourquoi plafonne-t-on souvent les pénalités de retard ?",
          choices: ["Pour limiter son risque", "Pour supprimer toute sanction", "Pour allonger les délais de livraison", "Pour augmenter le prix de vente"],
          answer: 0,
          explain: "Un plafond (par exemple 10 % de la commande) rend le risque acceptable pour le fournisseur, tout en gardant une incitation à livrer à temps.",
        },
        {
          q: "Quel est l'intérêt d'un contrat avec engagement de volume ?",
          choices: ["Capacité garantie contre volume minimal", "L'acheteur ne paie plus rien après la signature", "Le fournisseur choisit seul les quantités à livrer", "Les prix ne peuvent plus jamais évoluer"],
          answer: 0,
          explain: "Le client s'engage sur un minimum de volume, et le fournisseur réserve la capacité nécessaire : les deux parties gagnent en visibilité.",
        },
      ],
    },

    {
      id: "achats-responsables",
      title: "Les achats responsables",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Acheter en tenant compte de l'impact",
          body: "Les **achats responsables** intègrent des critères **environnementaux**, **sociaux** et **éthiques** en plus du prix, de la qualité et du délai.\n\nLes entreprises sont de plus en plus tenues de **surveiller leurs fournisseurs** : en France, la loi sur le **devoir de vigilance** (2017) impose aux grandes entreprises de prévenir les atteintes graves aux droits humains et à l'environnement dans leur chaîne d'approvisionnement.",
        },
        {
          type: "list",
          title: "Les grands critères",
          items: [
            ["Environnement", "Émissions de CO₂, déchets, énergie, certifications comme ISO 14001."],
            ["Social", "Conditions de travail, sécurité, absence de travail forcé ou de travail des enfants."],
            ["Éthique", "Lutte contre la corruption, respect de la concurrence, transparence."],
            ["Local et inclusion", "PME, entreprises locales, secteur du travail protégé et adapté."],
          ],
        },
        {
          type: "list",
          title: "Les outils de l'acheteur",
          items: [
            ["Charte fournisseurs", "Un document par lequel le fournisseur s'engage à respecter des principes."],
            ["Questionnaire et audit", "Pour vérifier les pratiques, sur dossier ou sur place."],
            ["Notation RSE", "Des plateformes externes évaluent les fournisseurs (par exemple EcoVadis)."],
            ["Cartographie des risques", "Repérer les pays, produits et fournisseurs les plus exposés."],
          ],
        },
        {
          type: "list",
          title: "Pourquoi ça compte",
          items: [
            ["Risques", "Scandale chez un fournisseur, rupture d'approvisionnement, sanctions."],
            ["Image", "Les clients et les investisseurs attendent des chaînes responsables."],
            ["Réglementation", "Obligations croissantes d'information et de vigilance."],
            ["Opportunités", "Innovation, économies d'énergie, relations plus durables."],
          ],
        },
        {
          type: "example",
          title: "Exemple : un fournisseur local plus cher",
          body: "Un fournisseur local propose un prix **3 % plus élevé**, mais une livraison en **2 jours** au lieu de **3 semaines** et un transport beaucoup moins émetteur de CO₂.\n\nLe **TCO** peut être plus faible grâce à moins de stock et moins de risque de rupture. On décide donc avec un **coût total** et des critères RSE, pas seulement sur le prix.",
        },
        {
          type: "key",
          points: [
            "Achats responsables : critères environnementaux, sociaux et éthiques en plus du QCD.",
            "Devoir de vigilance : les grandes entreprises surveillent leur chaîne d'approvisionnement.",
            "Outils : charte, audits, notation RSE, cartographie des risques.",
            "On décide au coût total et avec des critères RSE, pas au seul prix.",
          ],
        },
      ],
      quiz: [
        {
          q: "Que désignent les achats responsables ?",
          choices: ["Intégrer des critères sociaux et verts", "Acheter toujours le produit le moins cher", "Acheter uniquement à des fournisseurs étrangers", "Ne plus négocier avec aucun fournisseur"],
          answer: 0,
          explain: "Les achats responsables ajoutent aux critères classiques (qualité, coût, délai) des critères environnementaux, sociaux et éthiques.",
        },
        {
          q: "Qu'impose le devoir de vigilance en France aux grandes entreprises ?",
          choices: ["Prévenir les atteintes graves", "Acheter exclusivement des produits français", "Supprimer tous leurs fournisseurs étrangers", "Publier le prix de chaque commande"],
          answer: 0,
          explain: "La loi de 2017 oblige les grandes entreprises à identifier et prévenir les risques graves (droits humains, environnement) liés à leurs activités et à celles de leurs fournisseurs.",
        },
        {
          q: "À quoi sert une charte fournisseurs ?",
          choices: ["Engager le fournisseur", "Fixer le prix de chaque commande", "Remplacer le cahier des charges techniques", "Décrire la marque du fournisseur"],
          answer: 0,
          explain: "La charte fournisseurs est un engagement écrit sur des règles (éthique, sécurité, environnement) que le fournisseur accepte de respecter.",
        },
        {
          q: "Que fait une notation RSE de fournisseur ?",
          choices: ["Évaluer ses pratiques RSE", "Mesurer la taille de ses entrepôts", "Calculer le prix de ses produits", "Choisir le transporteur de l'acheteur"],
          answer: 0,
          explain: "Une plateforme de notation RSE (comme EcoVadis) évalue les pratiques d'un fournisseur et donne une note comparable.",
        },
        {
          q: "Que signifie ISO 14001 ?",
          choices: ["Une norme de management environnemental", "Un contrat type de transport", "Une règle de calcul du stock de sécurité", "Une taxe douanière européenne"],
          answer: 0,
          explain: "ISO 14001 est une norme internationale qui aide une organisation à maîtriser son impact sur l'environnement.",
        },
        {
          q: "Pourquoi un fournisseur local plus cher peut-il rester intéressant ?",
          choices: ["Délais courts et moins de stock", "Parce qu'il a toujours la meilleure qualité", "Parce que son prix n'a aucune importance", "Parce qu'il évite toute négociation"],
          answer: 0,
          explain: "Un prix un peu plus élevé peut être compensé par un stock plus faible, moins de rupture et un transport plus court : on raisonne en coût total.",
        },
        {
          q: "Qu'est-ce qu'une cartographie des risques fournisseurs ?",
          choices: ["Repérer les plus exposés", "Dessiner la carte routière des livraisons", "Établir la liste des prix de tous les produits", "Classer les fournisseurs par ordre alphabétique"],
          answer: 0,
          explain: "On identifie où se situent les risques (pays instables, fournisseur unique, pratiques sociales) pour agir en priorité sur les plus graves.",
        },
        {
          q: "Quel est un risque pour une entreprise dont le fournisseur est impliqué dans un scandale ?",
          choices: ["Rupture et atteinte à l'image", "Une baisse automatique des prix d'achat", "Une augmentation des ventes aux clients", "Aucune conséquence pour l'acheteur"],
          answer: 0,
          explain: "Le scandale peut arrêter le fournisseur (rupture), provoquer des sanctions et nuire à la réputation de l'entreprise cliente.",
        },
      ],
    },
  ],
}
