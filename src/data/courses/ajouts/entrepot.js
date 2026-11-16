// Lot 4 — Entrepôt : 4 leçons ajoutées + questions supplémentaires pour les 2 leçons existantes.
import { fmt, int, numQuestion, pick } from '../../gen.js'

export default {
  more: {
    etapes: [
      {
        q: "Que vérifie-t-on à la réception d'un camion ?",
        choices: ["Les quantités et l'état de la marchandise", "Le prix de vente aux clients du magasin", "La couleur des palettes livrées par le camion", "Le nom du conducteur et de son employeur"],
        answer: 0,
        explain: "À la réception, on compare la livraison avec le bon de commande et le bon de livraison : bons articles, bonnes quantités, bon état.",
      },
      {
        q: "Qu'appelle-t-on l'adressage d'un entrepôt ?",
        choices: ["Une adresse par emplacement", "Écrire l'adresse du client sur chaque colis", "Choisir l'adresse postale de l'entrepôt", "Envoyer les factures par la poste"],
        answer: 0,
        explain: "Chaque emplacement a une adresse (allée, travée, niveau) : le système sait où est chaque produit et guide les préparateurs.",
      },
      {
        q: "Pourquoi enregistre-t-on la mise en stock dans le système ?",
        choices: ["Pour localiser chaque produit", "Pour calculer le salaire des préparateurs", "Pour choisir la couleur des étiquettes de palettes", "Pour fixer la date de l'inventaire annuel"],
        answer: 0,
        explain: "Un produit rangé mais non enregistré est « perdu » : le système doit connaître son emplacement et la quantité disponible pour la préparation.",
      },
      () => {
        const rate = int(60, 120, 5)
        const hours = pick([6, 7, 7.5, 8])
        return numQuestion({
          q: `Un préparateur prélève ${rate} lignes par heure et travaille ${fmt(hours)} heures de préparation par jour. Combien de lignes prépare-t-il par jour ?`,
          answer: rate * hours,
          unit: "lignes",
          digits: 0,
          explain: `Lignes par jour = productivité × heures = ${rate} × ${fmt(hours)} = ${fmt(rate * hours, 0)} lignes.`,
          wrong: [rate + hours, rate * hours * 1.2, rate / hours, rate * (hours + 2)],
        })
      },
    ],
    picking: [
      {
        q: "En quoi consiste le picking par vagues ?",
        choices: ["Lancer les commandes par groupes", "Préparer une seule commande à la fois, en continu", "Déplacer les marchandises sur des vagues de convoyeurs", "Préparer les commandes uniquement la nuit"],
        answer: 0,
        explain: "On regroupe les commandes à préparer en « vagues » adaptées aux horaires de départ des transporteurs, pour étaler la charge de travail.",
      },
      {
        q: "Que fait le pick-to-light ?",
        choices: ["Il allume un voyant à l'emplacement", "Il imprime les étiquettes d'expédition des colis", "Il éclaire les allées de l'entrepôt la nuit", "Il pèse chaque colis préparé"],
        answer: 0,
        explain: "Des voyants lumineux guident le préparateur vers le bon emplacement et affichent la quantité à prélever : moins d'erreurs, plus de vitesse.",
      },
      {
        q: "Que permet le picking vocal ?",
        choices: ["Recevoir des instructions dans un casque, mains libres", "Dicter les commandes des clients au téléphone", "Faire parler les chariots élévateurs entre eux", "Remplacer tous les préparateurs par des enregistrements"],
        answer: 0,
        explain: "Le préparateur entend l'adresse et la quantité dans un casque et confirme à voix haute : il garde les mains et les yeux libres.",
      },
      () => {
        const lines = int(300, 900, 10)
        const hours = int(4, 8)
        return numQuestion({
          q: `Une équipe prépare ${fmt(lines)} lignes en ${hours} heures. Quelle est sa productivité, en lignes par heure ?`,
          answer: lines / hours,
          unit: "lignes/h",
          digits: 0,
          explain: `Productivité = lignes / heures = ${fmt(lines)} / ${hours} ≈ ${fmt(lines / hours, 0)} lignes par heure.`,
          wrong: [lines * hours, lines / (hours + 2), (lines / hours) * 1.5, lines - hours],
        })
      },
    ],
  },

  lessons: [
    {
      id: "implantation",
      title: "Implanter et zoner l'entrepôt",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Les objectifs de l'implantation",
          body: "Bien implanter un entrepôt, c'est organiser l'espace pour **réduire les déplacements**, **fluidifier les flux**, **exploiter la hauteur** et **sécuriser** les personnes.\n\nUn mètre parcouru en trop par un préparateur, répété des milliers de fois par jour, représente des heures de travail perdues.",
        },
        {
          type: "list",
          title: "Les zones d'un entrepôt",
          items: [
            ["Réception", "Quais de déchargement, contrôle des marchandises, enregistrement."],
            ["Stockage (réserve)", "Racks et emplacements où le stock est rangé en quantité."],
            ["Préparation (picking)", "Emplacements accessibles où l'on prélève les articles des commandes."],
            ["Expédition", "Regroupement, contrôle et chargement des commandes dans les camions."],
            ["Zones annexes", "Retours, quarantaine, emballage, charge des chariots."],
          ],
        },
        {
          type: "list",
          title: "Les formes de flux",
          items: [
            ["Flux en U", "Réception et expédition du même côté du bâtiment : les quais peuvent être partagés."],
            ["Flux traversant (en ligne)", "Réception d'un côté, expédition du côté opposé : très fluide, mais demande plus de quais."],
            ["Choix", "Il dépend de la forme du terrain, du nombre de quais et du type d'activité."],
          ],
        },
        {
          type: "text",
          title: "Où placer les produits ?",
          body: "On place les références à **forte rotation** (classe A) dans la **zone d'or** : près des quais d'expédition, à **hauteur d'homme**. Les articles **lourds** vont en **bas**, les articles **légers ou peu vendus** plus haut ou plus loin.\n\nOn rapproche aussi les produits **souvent commandés ensemble**. Chaque emplacement reçoit une **adresse** (allée, travée, niveau) enregistrée dans le système.",
        },
        {
          type: "list",
          title: "Les indicateurs d'implantation",
          items: [
            ["Taux d'occupation", "Emplacements occupés / emplacements disponibles : au-delà de 85 à 90 %, l'entrepôt devient difficile à gérer."],
            ["Densité de stockage", "Nombre de palettes ou de colis par m² au sol."],
            ["Distance parcourue", "Kilomètres parcourus par jour par les préparateurs et les chariots."],
          ],
        },
        {
          type: "key",
          points: [
            "Objectifs : moins de déplacements, flux fluides, hauteur utilisée, sécurité.",
            "Zones : réception, stockage, préparation, expédition, annexes.",
            "Les articles A à forte rotation vont dans la zone d'or, près des quais et à hauteur d'homme.",
            "Taux d'occupation = emplacements occupés / emplacements disponibles.",
          ],
        },
      ],
      quiz: [
        () => {
          const total = int(8, 40) * 100
          const occ = Math.round(total * (int(55, 95) / 100))
          return numQuestion({
            q: `Un entrepôt dispose de ${fmt(total)} emplacements palettes, dont ${fmt(occ)} sont occupés. Quel est son taux d'occupation ?`,
            answer: (occ / total) * 100,
            unit: "%",
            digits: 1,
            max: 100,
            explain: `Taux d'occupation = ${fmt(occ)} / ${fmt(total)} × 100 ≈ ${fmt((occ / total) * 100, 1)} %.`,
          })
        },
        () => {
          const aisles = int(4, 12)
          const bays = int(20, 50)
          const levels = int(3, 6)
          return numQuestion({
            q: `Un entrepôt compte ${aisles} allées, ${bays} travées par allée et ${levels} niveaux de rack. Combien d'emplacements palettes cela fait-il (un emplacement par case) ?`,
            answer: aisles * bays * levels,
            unit: "emplacements",
            digits: 0,
            explain: `${aisles} × ${bays} × ${levels} = ${fmt(aisles * bays * levels, 0)} emplacements.`,
            wrong: [aisles + bays + levels, aisles * bays, bays * levels, aisles * bays * levels * 2],
          })
        },
        {
          q: "Où place-t-on les références à forte rotation ?",
          choices: ["Dans la zone d'or", "Tout au fond de l'entrepôt", "Au dernier niveau des racks", "Dans la zone de quarantaine"],
          answer: 0,
          explain: "Les articles les plus demandés doivent être les plus faciles d'accès : près de l'expédition et à hauteur d'homme, pour réduire les déplacements.",
        },
        {
          q: "Où range-t-on plutôt les articles lourds ?",
          choices: ["En bas, à hauteur de taille ou au sol", "Au dernier niveau, pour gagner de la place", "Sur des étagères légères au milieu", "Toujours à côté des articles les plus fragiles"],
          answer: 0,
          explain: "Un article lourd en hauteur est difficile et dangereux à manipuler : on le range bas pour limiter les efforts et les risques.",
        },
        {
          q: "Que décrit un flux en U ?",
          choices: ["Réception et expédition du même côté", "Réception et expédition sur deux côtés opposés", "Un entrepôt en forme de cercle", "Des camions qui tournent autour du bâtiment"],
          answer: 0,
          explain: "Dans un flux en U, les marchandises entrent et sortent par la même façade : les quais peuvent être partagés et les surfaces mieux utilisées.",
        },
        {
          q: "Pourquoi rapproche-t-on deux produits souvent commandés ensemble ?",
          choices: ["Pour raccourcir le trajet du préparateur", "Pour augmenter leur prix de vente", "Pour qu'ils se vendent moins vite", "Pour simplifier la facturation aux clients"],
          answer: 0,
          explain: "Si deux articles sont presque toujours dans la même commande, les placer côte à côte évite un aller-retour dans l'entrepôt.",
        },
        {
          q: "Que signifie l'adresse d'un emplacement ?",
          choices: ["Sa position : allée, travée et niveau", "L'adresse du fournisseur de l'article", "L'adresse du client qui l'a commandé", "Le numéro de téléphone du chef d'équipe"],
          answer: 0,
          explain: "L'adresse d'un emplacement est son identifiant unique dans l'entrepôt : elle permet au système de guider le rangement et la préparation.",
        },
        {
          q: "Que dit un taux d'occupation très élevé (par exemple 95 %) ?",
          choices: ["Il est presque plein et difficile à gérer", "L'entrepôt est bien optimisé et ne peut plus s'améliorer", "L'entrepôt est vide la plupart du temps", "Les produits sont tous de classe A"],
          answer: 0,
          explain: "Au-delà de 85 à 90 %, il devient difficile de ranger et de réorganiser : manque de place pour les arrivages, déplacements supplémentaires.",
        },
      ],
    },

    {
      id: "equipements",
      title: "Les équipements de stockage et de manutention",
      minutes: 5,
      cards: [
        {
          type: "list",
          title: "Les solutions de stockage",
          items: [
            ["Rayonnage à palettes classique", "Chaque palette est accessible directement : très souple, mais moins dense."],
            ["Drive-in (stockage dense)", "Les chariots entrent dans les allées du rack : très dense, mais on retrouve la dernière palette entrée en premier (LIFO)."],
            ["Rayonnage dynamique (gravité)", "Les palettes avancent seules sur des rails : le premier entré est le premier sorti (FIFO)."],
            ["Cantilever", "Bras latéraux pour les objets longs : tubes, planches, profilés."],
            ["Étagères et bacs", "Pour la petite pièce et le picking de colis."],
          ],
        },
        {
          type: "list",
          title: "Les équipements de manutention",
          items: [
            ["Transpalette", "Déplace une palette à plat : manuel ou électrique."],
            ["Gerbeur", "Soulève une palette en hauteur, pour de faibles hauteurs de rack."],
            ["Chariot frontal", "Chariot élévateur à contrepoids, le plus polyvalent."],
            ["Chariot à mât rétractable / tridirectionnel", "Pour les allées étroites et les grandes hauteurs, avec une densité plus forte."],
            ["Convoyeur", "Tapis ou rouleaux qui déplacent les colis automatiquement."],
          ],
        },
        {
          type: "text",
          title: "Densité contre accessibilité",
          body: "Plus un stockage est **dense**, moins chaque palette est **accessible**. Un rayonnage classique donne l'accès direct à toutes les palettes mais occupe plus de place. Un drive-in stocke beaucoup plus de palettes au m², mais impose de déplacer d'autres palettes pour atteindre celle qu'on cherche.\n\nOn choisit selon le nombre de **références** : peu de références en grandes quantités → stockage dense ; beaucoup de références → accès direct.",
        },
        {
          type: "list",
          title: "La palette (ordres de grandeur)",
          items: [
            ["Palette Europe", "1 200 × 800 mm, la plus courante en Europe."],
            ["Palette industrielle", "1 200 × 1 000 mm."],
            ["Charge", "Selon le modèle et le rack, de 1 000 à 1 500 kg environ par palette."],
          ],
        },
        {
          type: "example",
          title: "Quel rayonnage pour quel produit ?",
          body: "Un entrepôt de produits laitiers (**date limite de consommation**) doit respecter le **FIFO** : le **rayonnage dynamique** est idéal.\n\nUn entrepôt de boissons qui stocke de grandes quantités de **peu de références** peut choisir le **drive-in**, très dense.\n\nUn entrepôt e-commerce avec des **milliers de références** préfère des **étagères** et un accès direct à chaque article.",
        },
        {
          type: "key",
          points: [
            "Racks classiques : accès direct ; drive-in : dense (LIFO) ; dynamique : FIFO.",
            "Transpalette, gerbeur, chariot frontal, chariot à mât rétractable, convoyeur.",
            "Plus c'est dense, moins c'est accessible : on choisit selon le nombre de références.",
            "Palette Europe : 1 200 × 800 mm.",
          ],
        },
      ],
      quiz: [
        () => {
          const bays = int(10, 40)
          const levels = int(3, 6)
          return numQuestion({
            q: `Un rack classique compte ${bays} travées de 2 emplacements palettes et ${levels} niveaux. Combien de palettes peut-il contenir ?`,
            answer: bays * 2 * levels,
            unit: "palettes",
            digits: 0,
            explain: `${bays} travées × 2 emplacements × ${levels} niveaux = ${fmt(bays * 2 * levels, 0)} palettes.`,
            wrong: [bays * levels, bays + 2 + levels, bays * 2, bays * 2 * levels + bays],
          })
        },
        {
          q: "Quel stockage respecte naturellement le FIFO ?",
          choices: ["Le rack dynamique", "Le stockage drive-in", "Le stockage au sol en bloc", "Le rayonnage cantilever"],
          answer: 0,
          explain: "Dans un rayonnage dynamique, les palettes avancent sur des rails : on les charge d'un côté et on les prélève de l'autre, le plus ancien sortant en premier.",
        },
        {
          q: "Quel est l'inconvénient principal du drive-in ?",
          choices: ["Accès limité à certaines palettes", "Il occupe beaucoup plus de place qu'un rack classique", "Il ne peut stocker que des palettes très légères", "Il ne convient à aucun produit alimentaire"],
          answer: 0,
          explain: "Pour atteindre une palette au fond du bloc, il faut parfois sortir d'abord celles qui sont devant : c'est le prix de la forte densité.",
        },
        {
          q: "À quoi sert un cantilever ?",
          choices: ["Stocker des objets longs", "Stocker des produits très froids", "Peser les palettes automatiquement", "Faire circuler les colis sur des rails"],
          answer: 0,
          explain: "Les bras latéraux d'un cantilever reçoivent des charges longues, comme des tubes, des planches ou des profilés.",
        },
        {
          q: "Quelle est la dimension d'une palette Europe ?",
          choices: ["1 200 × 800 mm", "1 000 × 1 000 mm", "1 200 × 1 200 mm", "800 × 600 mm"],
          answer: 0,
          explain: "La palette Europe (EPAL) mesure 1 200 × 800 mm ; la palette industrielle mesure 1 200 × 1 000 mm.",
        },
        {
          q: "Pour des produits avec date limite de consommation, quel stockage est le mieux adapté ?",
          choices: ["Le rayonnage dynamique (FIFO)", "Le drive-in (LIFO)", "Le stockage au sol sans rotation", "Le cantilever"],
          answer: 0,
          explain: "Les produits à date limite doivent sortir dans l'ordre d'arrivée : le FIFO du rayonnage dynamique limite les invendus et les pertes.",
        },
        {
          q: "Quel équipement déplace une palette à plat, sans la soulever en hauteur ?",
          choices: ["Le transpalette", "Le chariot à mât rétractable", "Le convoyeur à rouleaux", "Le gerbeur de grande hauteur"],
          answer: 0,
          explain: "Le transpalette (manuel ou électrique) soulève la palette de quelques centimètres seulement : il sert au déplacement horizontal.",
        },
        {
          q: "Quand un stockage dense comme le drive-in est-il pertinent ?",
          choices: ["Beaucoup de palettes pour peu de références", "Des milliers de références en petites quantités", "Une grande variété de produits fragiles", "Un stockage très temporaire de quelques heures"],
          answer: 0,
          explain: "Le stockage dense est efficace quand on empile beaucoup de palettes identiques : l'accès sélectif n'est alors pas nécessaire.",
        },
      ],
    },

    {
      id: "automatisation",
      title: "L'automatisation de l'entrepôt",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Pourquoi automatiser ?",
          body: "L'automatisation répond à plusieurs besoins : **manque de main-d'œuvre**, **volumes en forte hausse** (e-commerce), **précision** des préparations et **gain de place** en stockant plus haut et plus dense.\n\nElle a un coût : un **investissement important** et une **flexibilité plus faible** si l'activité change vite.",
        },
        {
          type: "list",
          title: "Les technologies courantes",
          items: [
            ["Convoyeurs et trieurs", "Déplacent et trient automatiquement les colis."],
            ["Transstockeurs et navettes", "Machines qui rangent et sortent les palettes ou les bacs dans des racks très hauts."],
            ["Robots mobiles (AGV, AMR)", "Véhicules qui se déplacent seuls pour transporter des charges."],
            ["Goods-to-person", "La marchandise vient au préparateur, qui reste à son poste."],
            ["Pick-to-light et voice picking", "Guidage par la lumière ou la voix : mains libres, moins d'erreurs."],
          ],
        },
        {
          type: "list",
          title: "Homme vers produit ou produit vers homme",
          items: [
            ["Préparation classique", "Le préparateur marche vers les emplacements : de l'ordre de 60 à 100 lignes par heure."],
            ["Goods-to-person", "Les produits arrivent au poste : souvent 300 lignes par heure ou davantage."],
            ["Avantage", "Moins de marche, plus de productivité et de précision."],
          ],
        },
        {
          type: "formula",
          title: "Le délai de retour sur investissement",
          formula: "Payback (années) = investissement / gain annuel net",
          legend: [
            ["Investissement", "Coût du projet : machines, logiciel, installation."],
            ["Gain annuel net", "Économies de main-d'œuvre et d'erreurs, moins la maintenance annuelle."],
          ],
          example: "Investissement 1 200 000 € ; économies 400 000 €/an ; maintenance 100 000 €/an → gain net 300 000 € ; payback = 4 ans.",
        },
        {
          type: "list",
          title: "Quand automatiser ?",
          items: [
            ["Plutôt oui", "Volumes élevés et réguliers, nombreuses petites lignes de commandes, coût du travail élevé, manque de place."],
            ["Plutôt non", "Volumes faibles ou très variables, assortiment qui change souvent, contrats clients de courte durée."],
            ["Étape par étape", "On peut automatiser une partie seulement : par exemple le tri, ou le stockage dense."],
          ],
        },
        {
          type: "key",
          points: [
            "Automatiser : gain de productivité et de place, mais investissement élevé et flexibilité réduite.",
            "Goods-to-person : la marchandise vient au préparateur (souvent 300 lignes/h ou plus).",
            "Payback = investissement / gain annuel net.",
            "On automatise quand les volumes sont élevés, réguliers et durables.",
          ],
        },
      ],
      quiz: [
        () => {
          const invest = int(6, 20) * 100000
          const net = int(15, 50) * 10000
          return numQuestion({
            q: `Un projet d'automatisation coûte ${fmt(invest, 0)} € et rapporte ${fmt(net, 0)} € de gain net par an. En combien d'années se rembourse-t-il ?`,
            answer: invest / net,
            unit: "ans",
            digits: 1,
            explain: `Payback = investissement / gain net = ${fmt(invest, 0)} / ${fmt(net, 0)} ≈ ${fmt(invest / net, 1)} ans.`,
            wrong: [net / invest, invest / net / 2, (invest / net) * 2, invest - net],
          })
        },
        () => {
          const saving = int(25, 60) * 10000
          const maint = int(5, 15) * 10000
          return numQuestion({
            q: `Un système fait économiser ${fmt(saving, 0)} € par an de main-d'œuvre, mais sa maintenance coûte ${fmt(maint, 0)} € par an. Quel est le gain annuel net ?`,
            answer: saving - maint,
            unit: "€",
            digits: 0,
            explain: `Gain net = économies − maintenance = ${fmt(saving, 0)} − ${fmt(maint, 0)} = ${fmt(saving - maint, 0)} €.`,
            wrong: [saving + maint, saving, maint, saving - maint * 2],
          })
        },
        {
          q: "Que signifie « goods-to-person » ?",
          choices: ["La marchandise vient au préparateur", "Le préparateur marche vers la marchandise", "Le client vient chercher sa commande", "Les marchandises sont données aux salariés"],
          answer: 0,
          explain: "En goods-to-person, des machines ou des robots apportent les produits à un poste fixe : le préparateur ne marche plus, ce qui augmente sa productivité.",
        },
        {
          q: "Quel est l'inconvénient principal de l'automatisation ?",
          choices: ["Un coût élevé et peu de flexibilité", "Une baisse de la précision des préparations", "Une augmentation du nombre d'erreurs de saisie", "Une impossibilité d'utiliser des racks hauts"],
          answer: 0,
          explain: "Une installation automatisée coûte cher et s'adapte mal à un changement rapide d'activité ou de produits.",
        },
        {
          q: "Que désignent les AGV ou AMR ?",
          choices: ["Des robots mobiles autonomes", "Des logiciels de gestion des commandes clients", "Des étagères à glissières pour les petits colis", "Des camions autonomes sur autoroute"],
          answer: 0,
          explain: "Les AGV (guidés) et AMR (autonomes) transportent des charges sans conducteur, par exemple des palettes ou des bacs.",
        },
        {
          q: "Dans quel cas l'automatisation est-elle plutôt pertinente ?",
          choices: ["Volumes élevés, réguliers et durables", "Volumes faibles et très irréguliers", "Contrat client de quelques mois seulement", "Assortiment qui change tous les mois"],
          answer: 0,
          explain: "Un investissement lourd n'est rentabilisé que si l'activité est importante et stable assez longtemps pour le rembourser.",
        },
        {
          q: "Que fait un système de voice picking ?",
          choices: ["Guide le préparateur par la voix, mains libres", "Reconnaît la voix des clients au téléphone", "Fait parler les palettes pour qu'on les retrouve", "Remplace les lecteurs de codes-barres des quais"],
          answer: 0,
          explain: "Le préparateur reçoit les instructions dans un casque et répond à voix haute : ses mains et ses yeux restent libres pour prélever.",
        },
        {
          q: "À quoi sert un trieur automatique ?",
          choices: ["Aiguiller chaque colis", "Compter les palettes dans les racks", "Contrôler l'identité des chauffeurs", "Ranger les palettes en hauteur"],
          answer: 0,
          explain: "Le trieur lit l'étiquette de chaque colis et le pousse automatiquement vers la bonne destination (quai, zone d'expédition, client).",
        },
      ],
    },

    {
      id: "securite",
      title: "La sécurité dans l'entrepôt",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Un lieu à risques",
          body: "Un entrepôt réunit des **engins en mouvement**, des **charges lourdes**, du **travail en hauteur** et parfois des **produits dangereux**. Les principaux risques sont : **collisions** entre chariots et piétons, **chutes** de charges ou de personnes, **troubles musculo-squelettiques** (TMS) dus aux gestes répétés, **incendie**.\n\nLa sécurité n'est pas un frein à la productivité : un accident arrête l'activité, coûte cher et blesse des personnes.",
        },
        {
          type: "list",
          title: "Les règles essentielles",
          items: [
            ["Séparer les circulations", "Des voies distinctes pour les piétons et pour les engins, avec marquages au sol."],
            ["Équipements de protection (EPI)", "Chaussures de sécurité, gilet haute visibilité, casque ou gants selon les tâches."],
            ["Vitesse limitée", "Les engins roulent lentement, particulièrement dans les zones croisées."],
            ["Charge maximale affichée", "Chaque rack porte une plaque de charge à ne jamais dépasser."],
            ["Vérification des racks", "Contrôle régulier : un montant déformé doit être signalé et remplacé."],
          ],
        },
        {
          type: "list",
          title: "Conduire un chariot : le CACES",
          items: [
            ["Autorisation de conduite", "Seuls les salariés formés et autorisés par l'employeur peuvent conduire un engin."],
            ["CACES", "Certificat d'aptitude à la conduite en sécurité : il atteste qu'on maîtrise l'engin, par catégorie."],
            ["Catégories", "Par exemple R489 pour les chariots élévateurs à conducteur porté, R485 pour les gerbeurs à conducteur accompagnant."],
            ["Validité", "Le CACES est valable plusieurs années (souvent 5 ans) et doit être renouvelé."],
          ],
        },
        {
          type: "list",
          title: "Incendie et produits dangereux",
          items: [
            ["Prévention", "Extincteurs, issues de secours libres, plan d'évacuation affiché, exercices réguliers."],
            ["Détection et sprinklers", "Détecteurs et arrosage automatique dans beaucoup d'entrepôts."],
            ["Produits dangereux", "Étiquetage, stockage séparé, fiches de données de sécurité."],
            ["Réglementation", "Certains entrepôts sont des « installations classées » soumises à des règles strictes."],
          ],
        },
        {
          type: "example",
          title: "Exemple : collision chariot / piéton",
          body: "Un piéton traverse une allée où roule un chariot : la collision est l'un des accidents les plus graves en entrepôt.\n\nLes solutions : **voies piétonnes séparées**, **miroirs et signaux lumineux** aux croisements, **vitesse limitée**, **gilet haute visibilité** pour tous, et **formation** régulière des conducteurs et des salariés.",
        },
        {
          type: "key",
          points: [
            "Principaux risques : collisions, chutes de charges, TMS, incendie.",
            "Séparer piétons et engins, porter les EPI, respecter les charges maximales.",
            "Conduire un chariot demande une formation, une autorisation et un CACES valide.",
            "La prévention se prépare : formation, marquages, contrôles, exercices.",
          ],
        },
      ],
      quiz: [
        {
          q: "Que signifie TMS ?",
          choices: ["Troubles musculo-squelettiques", "Transport et manutention sécurisés", "Techniques de maintenance standard", "Taux moyen de sinistres"],
          answer: 0,
          explain: "Les TMS sont des douleurs articulaires et musculaires dues à des gestes répétés ou des charges lourdes : très fréquents en entrepôt.",
        },
        {
          q: "Que faut-il pour conduire un chariot élévateur ?",
          choices: ["Une formation, une autorisation et un CACES", "Le permis de conduire poids lourd uniquement", "Avoir plus de dix ans d'ancienneté dans l'entreprise", "Aucune condition : tout salarié peut le faire"],
          answer: 0,
          explain: "Le conducteur doit être formé, évalué (CACES) et autorisé par son employeur à conduire l'engin concerné.",
        },
        {
          q: "À quoi servent les EPI ?",
          choices: ["Protéger contre les risques du poste", "Calculer les salaires des préparateurs", "Mesurer la productivité de l'entrepôt", "Identifier les produits dans les racks"],
          answer: 0,
          explain: "Les équipements de protection individuelle (chaussures de sécurité, gilet, casque, gants) réduisent la gravité des accidents.",
        },
        {
          q: "Quelle est l'une des meilleures mesures contre les collisions chariot / piéton ?",
          choices: ["Séparer les voies de circulation", "Augmenter la vitesse des chariots", "Supprimer les marquages au sol", "Faire circuler les piétons au milieu des allées"],
          answer: 0,
          explain: "Des voies distinctes, bien marquées, limitent les croisements : c'est la mesure la plus efficace, avec la limitation de vitesse.",
        },
        {
          q: "Pourquoi une plaque de charge est-elle affichée sur chaque rack ?",
          choices: ["Pour ne jamais dépasser la charge autorisée", "Pour indiquer le prix des palettes stockées", "Pour décorer les allées de l'entrepôt", "Pour identifier le fournisseur du rack"],
          answer: 0,
          explain: "Un rack surchargé peut se déformer ou s'effondrer : la plaque rappelle la charge maximale par niveau et par travée.",
        },
        {
          q: "Que doit-on faire d'un montant de rack déformé ?",
          choices: ["Le signaler et le faire remplacer", "L'ignorer tant qu'il tient debout", "Le repeindre pour le cacher", "Ajouter plus de palettes pour le tester"],
          answer: 0,
          explain: "Un montant déformé a perdu de sa résistance : il doit être signalé et remplacé avant tout accident, la zone pouvant être interdite.",
        },
        {
          q: "Quel est le rôle d'un plan d'évacuation affiché ?",
          choices: ["Montrer le chemin des issues", "Montrer l'emplacement des produits les plus chers", "Fixer les horaires des équipes de nuit", "Planifier les livraisons des fournisseurs"],
          answer: 0,
          explain: "En cas d'incendie ou d'alerte, chacun doit savoir où sont les issues de secours et le point de rassemblement.",
        },
        {
          q: "Pourquoi la sécurité ne freine-t-elle pas la productivité ?",
          choices: ["Un accident arrête l'activité et coûte très cher", "Parce que les règles de sécurité sont facultatives", "Parce que les salariés vont plus vite avec des EPI", "Parce que les accidents sont toujours sans gravité"],
          answer: 0,
          explain: "Un accident blesse une personne, arrête une zone et génère des coûts humains et financiers bien supérieurs à ceux de la prévention.",
        },
      ],
    },
  ],
}
