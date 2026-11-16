// Lot 3 — Stocks : 3 leçons ajoutées + questions supplémentaires (dont questions de calcul à chiffres aléatoires).
import { fmt, int, numQuestion, pick } from '../../gen.js'

const Z = [[90, 1.28], [95, 1.65], [99, 2.33]]

export default {
  more: {
    abc: [
      {
        q: "Quel principe est à l'origine de la méthode ABC ?",
        choices: ["La loi de Pareto (80/20)", "La formule de Wilson pour fixer la commande", "Le principe du juste-à-temps de Toyota", "La règle des « 5 B » de la supply chain"],
        answer: 0,
        explain: "La méthode ABC applique la loi de Pareto : une minorité d'articles (environ 20 %) représente la majorité de la valeur (environ 80 %).",
      },
      () => {
        const qty = int(100, 5000, 50)
        const price = pick([0.5, 1.2, 2.5, 8, 15, 42, 120])
        return numQuestion({
          q: `Un article est consommé à ${fmt(qty)} unités par an, à ${fmt(price)} € l'unité. Quelle est sa valeur annuelle consommée ?`,
          answer: qty * price,
          unit: "€",
          digits: 0,
          explain: `Valeur annuelle = consommation × prix = ${fmt(qty)} × ${fmt(price)} = ${fmt(qty * price, 0)} €. C'est la base du classement ABC.`,
          wrong: [qty + price, qty * price * 12, (qty * price) / 12, qty * price * 1.2],
        })
      },
      {
        q: "Pour les articles de classe C, quelle gestion est recommandée ?",
        choices: ["Une gestion simple et peu coûteuse", "Un suivi quotidien avec des prévisions détaillées", "Une négociation individuelle avec chaque fournisseur", "Un inventaire complet chaque semaine, article par article"],
        answer: 0,
        explain: "Les articles C pèsent peu en valeur : on les gère simplement (grosses commandes peu fréquentes, contrôles allégés) pour garder l'effort sur les A.",
      },
      () => {
        const total = int(60, 200, 5) * 1000
        const part = int(15, 60) / 100
        const value = Math.round(total * part)
        return numQuestion({
          q: `Un article représente ${fmt(value, 0)} € sur un total de ${fmt(total, 0)} € de consommation annuelle. Quelle est sa part de la valeur totale ?`,
          answer: (value / total) * 100,
          unit: "%",
          digits: 1,
          max: 100,
          explain: `Part = ${fmt(value, 0)} / ${fmt(total, 0)} × 100 = ${fmt((value / total) * 100, 1)} %.`,
        })
      },
      {
        q: "Comment classe-t-on les articles pour une analyse ABC ?",
        choices: ["Par valeur décroissante", "Par ordre alphabétique du nom", "Par poids unitaire croissant", "Par date de première commande"],
        answer: 0,
        explain: "On trie du plus gros au plus petit montant annuel (consommation × prix), puis on calcule les pourcentages cumulés pour fixer les classes A, B et C.",
      },
    ],
    "stock-securite": [
      () => {
        const [rate, z] = pick(Z)
        const sigma = int(10, 40)
        const L = pick([4, 9, 16])
        const ss = z * sigma * Math.sqrt(L)
        return numQuestion({
          q: `Taux de service visé : ${rate} % (z = ${fmt(z)}). Écart-type de la demande : ${sigma} unités par jour. Délai : ${L} jours. Quel est le stock de sécurité ?`,
          answer: ss,
          unit: "unités",
          digits: 0,
          explain: `SS = z × σ × √L = ${fmt(z)} × ${sigma} × √${L} = ${fmt(z)} × ${sigma} × ${Math.sqrt(L)} ≈ ${fmt(ss, 0)} unités.`,
          wrong: [z * sigma * L, z * sigma, sigma * Math.sqrt(L), z * sigma * Math.sqrt(L) * 1.5],
        })
      },
      () => {
        const D = int(50, 300, 10)
        const L = int(2, 10)
        const ss = int(20, 150, 10)
        return numQuestion({
          q: `Demande moyenne : ${D} unités par jour. Délai : ${L} jours. Stock de sécurité : ${ss} unités. Quel est le point de commande ?`,
          answer: D * L + ss,
          unit: "unités",
          digits: 0,
          explain: `PC = D × L + SS = ${D} × ${L} + ${ss} = ${D * L + ss} unités.`,
          wrong: [D * L, D + ss, (D + ss) * L, D * L + ss * 2],
        })
      },
      {
        q: "Le délai d'approvisionnement est multiplié par 4. Par combien le stock de sécurité est-il multiplié ?",
        choices: ["Par 2", "Par 4", "Par 16", "Il ne change pas"],
        answer: 0,
        explain: "Le stock de sécurité dépend de √L : si L est multiplié par 4, √L est multiplié par 2 (car √4 = 2), donc le stock de sécurité aussi.",
      },
      {
        q: "Quel coefficient z correspond à un taux de service de 95 % ?",
        choices: ["1,65", "1,28", "2,33", "0,95"],
        answer: 0,
        explain: "Les valeurs usuelles sont 1,28 (90 %), 1,65 (95 %) et 2,33 (99 %) : plus le taux de service visé est élevé, plus z et le stock de sécurité augmentent.",
      },
      {
        q: "Contre quoi le stock de sécurité protège-t-il ?",
        choices: ["Les aléas de demande et de délai", "L'augmentation du prix des fournisseurs", "Les erreurs de facturation des clients", "La concurrence des autres entreprises"],
        answer: 0,
        explain: "Le stock de sécurité absorbe les écarts imprévus (demande plus forte, livraison en retard) pendant le délai d'approvisionnement.",
      },
    ],
    wilson: [
      () => {
        const D = int(2000, 40000, 500)
        const S = int(20, 200, 10)
        const H = pick([0.5, 1, 2, 4, 5])
        const q = Math.sqrt((2 * D * S) / H)
        return numQuestion({
          q: `Demande annuelle ${fmt(D)} unités, coût d'une commande ${S} €, coût de possession ${fmt(H)} € par unité et par an. Quelle est la quantité économique ?`,
          answer: q,
          unit: "unités",
          digits: 0,
          explain: `Q* = √(2 × D × S / H) = √(2 × ${fmt(D)} × ${S} / ${fmt(H)}) = √${fmt((2 * D * S) / H, 0)} ≈ ${fmt(q, 0)} unités.`,
          wrong: [(2 * D * S) / H, q * 2, q / 2, Math.sqrt(D * S / H)],
        })
      },
      () => {
        const D = int(3000, 30000, 1000)
        const q = int(200, 1500, 50)
        return numQuestion({
          q: `Tu commandes ${q} unités à chaque fois pour une demande annuelle de ${fmt(D)} unités. Combien de commandes passes-tu par an, à peu près ?`,
          answer: D / q,
          unit: "commandes",
          digits: 1,
          explain: `N = D / Q = ${fmt(D)} / ${q} ≈ ${fmt(D / q, 1)} commandes par an.`,
          wrong: [D * q, D / q / 2, D / q * 2, q / D],
        })
      },
      {
        q: "Si le coût de possession H augmente, que devient la quantité économique ?",
        choices: ["Elle diminue", "Elle augmente", "Elle ne change pas", "Elle devient nulle"],
        answer: 0,
        explain: "H est au dénominateur de Q* = √(2DS/H) : stocker coûte plus cher, donc on commande en plus petites quantités, plus souvent.",
      },
      {
        q: "Au point optimal de Wilson, que peut-on dire des deux coûts ?",
        choices: ["Le coût de passation égale le coût de possession", "Le coût de passation est le double du coût de possession", "Le coût de possession est nul", "Les deux coûts sont minimaux séparément"],
        answer: 0,
        explain: "À la quantité économique, les deux coûts annuels sont égaux : c'est ce qui rend leur somme minimale.",
      },
      () => {
        const price = int(5, 80)
        const rate = pick([15, 20, 25, 30])
        return numQuestion({
          q: `Un article coûte ${price} € et le taux de possession est de ${rate} % par an. Quel est le coût de possession d'une unité par an ?`,
          answer: (price * rate) / 100,
          unit: "€",
          digits: 2,
          explain: `H = prix × taux = ${price} × ${rate} % = ${fmt((price * rate) / 100)} € par unité et par an.`,
          wrong: [price + rate, price * rate, price / rate, (price * rate) / 10],
        })
      },
    ],
  },

  lessons: [
    {
      id: "types-couts",
      title: "Les types de stocks et leurs coûts",
      minutes: 5,
      cards: [
        {
          type: "list",
          title: "Les principaux types de stocks",
          items: [
            ["Stock de cycle", "Dû aux lots : on commande par quantités, donc le stock monte puis redescend."],
            ["Stock de sécurité", "Une marge pour absorber les aléas de la demande et des délais."],
            ["Stock d'anticipation (saisonnier)", "On le constitue avant un pic, comme les jouets avant Noël."],
            ["Stock en transit", "Des marchandises en route : elles appartiennent déjà à l'entreprise mais ne sont pas encore disponibles."],
            ["Stock dormant", "Des articles qui ne bougent plus depuis longtemps, devenus peu ou pas vendables."],
          ],
        },
        {
          type: "list",
          title: "Pourquoi garder du stock ?",
          items: [
            ["Absorber les aléas", "Retard d'un fournisseur, demande plus forte que prévu."],
            ["Livrer vite", "Le client est servi immédiatement, sans attendre la fabrication."],
            ["Acheter en gros", "Obtenir des remises de quantité et réduire le coût du transport."],
            ["Lisser la production", "Fabriquer régulièrement, même quand la demande varie."],
          ],
        },
        {
          type: "list",
          title: "Les quatre coûts du stock",
          items: [
            ["Coût de possession", "Capital immobilisé, entrepôt, assurance, manutention, casse et obsolescence."],
            ["Coût de passation", "Frais d'une commande : temps administratif, transport, réception."],
            ["Coût de rupture", "Ventes perdues, pénalités, clients mécontents ou perdus."],
            ["Coût d'acquisition", "Le prix d'achat des marchandises."],
          ],
        },
        {
          type: "text",
          title: "Le coût de possession en chiffres",
          body: "On l'exprime en pourcentage de la **valeur du stock** par an : en général entre **15 % et 30 %**. Il regroupe le coût du **capital** (l'argent immobilisé), du **stockage** (m², personnel, énergie), de l'**assurance** et des **risques** (casse, vol, obsolescence).\n\nExemple : un stock moyen de **200 000 €** avec un taux de **20 %** coûte **40 000 €** par an à posséder, avant même d'avoir vendu une unité.",
        },
        {
          type: "example",
          title: "Le stock dormant",
          body: "Un article qui n'a **aucun mouvement depuis 12 mois** est souvent considéré comme dormant. Il continue de coûter (place, assurance, capital) et sa valeur baisse avec le temps.\n\nOn le traite en **déstockant** (promotion, vente en lot, retour fournisseur, don) ou en le **dépréciant** dans les comptes, avant qu'il ne devienne un déchet.",
        },
        {
          type: "key",
          points: [
            "Types : cycle, sécurité, anticipation, transit, dormant.",
            "Quatre coûts : possession, passation, rupture, acquisition.",
            "Coût de possession : environ 15 à 30 % de la valeur du stock par an.",
            "Trop de stock immobilise de l'argent ; trop peu provoque des ruptures.",
          ],
        },
      ],
      quiz: [
        () => {
          const stock = int(50, 400, 10) * 1000
          const rate = pick([15, 18, 20, 25, 30])
          return numQuestion({
            q: `Le stock moyen d'une entreprise vaut ${fmt(stock, 0)} € et son taux de possession est de ${rate} % par an. Combien lui coûte la possession de ce stock chaque année ?`,
            answer: (stock * rate) / 100,
            unit: "€",
            digits: 0,
            explain: `Coût de possession = ${fmt(stock, 0)} × ${rate} % = ${fmt((stock * rate) / 100, 0)} € par an.`,
            wrong: [stock + rate, stock * rate, stock / rate, (stock * rate) / 10],
          })
        },
        {
          q: "Quel stock constitue-t-on avant un pic de demande, comme Noël ?",
          choices: ["Le stock d'anticipation", "Le stock dormant", "Le stock de cycle uniquement", "Le stock en transit uniquement"],
          answer: 0,
          explain: "Un stock d'anticipation (ou saisonnier) se prépare à l'avance pour répondre à un pic de demande que la production ne pourrait pas suivre en direct.",
        },
        {
          q: "Qu'est-ce que le stock en transit ?",
          choices: ["Des marchandises en route, déjà achetées", "Des produits en cours de fabrication", "Des articles sans mouvement depuis longtemps", "La marge de sécurité de l'entrepôt"],
          answer: 0,
          explain: "Ce sont des marchandises en cours de transport : elles appartiennent à l'entreprise mais ne sont pas encore utilisables.",
        },
        {
          q: "Que comprend le coût de rupture ?",
          choices: ["Ventes et clients perdus", "L'assurance et le loyer de l'entrepôt", "Le prix d'achat des marchandises", "Le temps administratif d'une commande"],
          answer: 0,
          explain: "Une rupture coûte la vente manquée, parfois des pénalités contractuelles, et peut faire perdre un client durablement.",
        },
        {
          q: "Qu'appelle-t-on un stock dormant ?",
          choices: ["Un stock sans mouvement", "Un stock stocké de nuit seulement", "Un stock de sécurité très élevé", "Un stock en cours d'inventaire"],
          answer: 0,
          explain: "Un article qui ne sort plus (par exemple depuis 12 mois) est dormant : il coûte sans rapporter, et risque de devenir invendable.",
        },
        {
          q: "Pourquoi trop de stock est-il un problème ?",
          choices: ["Il immobilise de l'argent", "Il empêche toute livraison aux clients", "Il oblige à changer de fournisseur", "Il supprime le besoin de prévision"],
          answer: 0,
          explain: "Un stock excessif immobilise du capital et génère des coûts de possession (place, assurance, obsolescence), sans améliorer le service.",
        },
        {
          q: "Parmi ces éléments, lequel fait partie du coût de possession ?",
          choices: ["L'assurance de l'entrepôt", "Le transport de la commande", "Le prix d'achat unitaire", "La pénalité de retard au client"],
          answer: 0,
          explain: "L'assurance fait partie des coûts liés au fait de détenir le stock. Le transport de commande relève de la passation, la pénalité de la rupture.",
        },
        {
          q: "Pourquoi acheter en grande quantité peut-il être intéressant ?",
          choices: ["Pour obtenir des remises", "Pour supprimer tout coût de stockage", "Pour éviter de calculer les besoins", "Pour ne plus jamais avoir de rupture"],
          answer: 0,
          explain: "Acheter en gros peut baisser le prix unitaire et le coût de passation, mais augmente le stock moyen et donc le coût de possession.",
        },
      ],
    },

    {
      id: "reappro",
      title: "Les méthodes de réapprovisionnement",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "Deux questions à chaque réapprovisionnement",
          body: "Gérer un stock revient à répondre sans cesse à deux questions : **quand commander ?** et **combien commander ?**\n\nLes méthodes de réapprovisionnement donnent des réponses différentes, adaptées à la valeur des articles, à leur consommation et au nombre de références.",
        },
        {
          type: "list",
          title: "Les méthodes classiques",
          items: [
            ["Point de commande (quantité fixe)", "On surveille le stock en continu : dès qu'il atteint le point de commande, on commande toujours la même quantité (souvent Wilson)."],
            ["Recomplètement périodique (période fixe)", "On revient à intervalle régulier (chaque semaine, par exemple) : on commande ce qu'il faut pour remonter à un niveau cible."],
            ["Réapprovisionnement à la demande (flux tiré)", "On commande seulement quand un besoin réel apparaît, par exemple avec le Kanban."],
          ],
        },
        {
          type: "formula",
          title: "Le recomplètement périodique",
          formula: "S = D × (R + L) + z × σ × √(R + L)",
          legend: [
            ["S", "Niveau cible (stock maximal) à atteindre à chaque commande."],
            ["R", "Période entre deux revues du stock (par exemple 7 jours)."],
            ["L", "Délai d'approvisionnement."],
            ["Quantité", "À commander = S − position de stock (stock + commandes en cours)."],
          ],
          example: "D = 100/j ; R = 7 j ; L = 3 j ; σ = 20 ; z = 1,65 → S = 100 × 10 + 1,65 × 20 × √10 ≈ 1 104. Si la position est 700, on commande 404.",
        },
        {
          type: "list",
          title: "Quelle méthode choisir ?",
          items: [
            ["Point de commande", "Articles de classe A, chers et importants : on les surveille en continu."],
            ["Recomplètement périodique", "Beaucoup d'articles de classe B ou C, ou plusieurs articles du même fournisseur à regrouper dans une seule commande."],
            ["Flux tiré (Kanban)", "Consommation régulière et répétitive, comme une ligne de production."],
          ],
        },
        {
          type: "key",
          points: [
            "Point de commande : quantité fixe, date variable.",
            "Recomplètement périodique : date fixe, quantité variable.",
            "La période de protection du recomplètement est R + L (revue + délai).",
            "Quantité à commander = niveau cible − position de stock.",
          ],
        },
      ],
      quiz: [
        () => {
          const D = int(50, 300, 10)
          const R = pick([5, 7, 10])
          const L = pick([2, 3, 5])
          const sigma = int(10, 40)
          const S = D * (R + L) + 1.65 * sigma * Math.sqrt(R + L)
          return numQuestion({
            q: `Demande ${D} par jour, revue tous les ${R} jours, délai ${L} jours, σ = ${sigma} par jour, z = 1,65. Quel est le niveau cible S ?`,
            answer: S,
            unit: "unités",
            digits: 0,
            explain: `S = D × (R + L) + z × σ × √(R + L) = ${D} × ${R + L} + 1,65 × ${sigma} × √${R + L} = ${D * (R + L)} + ${fmt(1.65 * sigma * Math.sqrt(R + L), 0)} ≈ ${fmt(S, 0)}.`,
            wrong: [D * (R + L), D * L + 1.65 * sigma * Math.sqrt(L), S * 1.3, D * R + 1.65 * sigma * Math.sqrt(R)],
          })
        },
        () => {
          const S = int(60, 200, 10) * 10
          const position = Math.round(S * (int(30, 70) / 100))
          return numQuestion({
            q: `Le niveau cible est ${S} unités. À la revue, la position de stock (stock + commandes en cours) est de ${position}. Quelle quantité commandes-tu ?`,
            answer: S - position,
            unit: "unités",
            digits: 0,
            explain: `Quantité = S − position = ${S} − ${position} = ${S - position} unités.`,
            wrong: [S + position, position, S, S - position * 2],
          })
        },
        {
          q: "Dans la méthode du point de commande, qu'est-ce qui est fixe ?",
          choices: ["La quantité commandée", "La date de commande", "Le prix d'achat", "Le fournisseur choisi"],
          answer: 0,
          explain: "On commande toujours la même quantité (souvent la quantité économique) ; c'est la date qui varie, selon le moment où le stock atteint le point de commande.",
        },
        {
          q: "Dans le recomplètement périodique, qu'est-ce qui est fixe ?",
          choices: ["Le rythme des commandes", "La quantité commandée", "Le niveau de stock restant", "Le délai du fournisseur"],
          answer: 0,
          explain: "On revient à dates régulières (chaque semaine, par exemple) et la quantité s'adapte : on commande ce qui manque pour atteindre le niveau cible.",
        },
        {
          q: "Pourquoi la période de protection est-elle R + L dans le recomplètement ?",
          choices: ["Entre deux revues, plus le délai de livraison", "Parce que le délai est doublé par prudence", "Parce que R est le prix du délai", "Parce qu'on ajoute les jours de transport seulement"],
          answer: 0,
          explain: "Après une revue, la prochaine commande ne pourra être passée que R jours plus tard, puis livrée L jours après : le stock doit tenir R + L jours.",
        },
        {
          q: "Quelle méthode convient bien aux articles de classe A, chers et importants ?",
          choices: ["Le point de commande", "Le recomplètement mensuel sans suivi", "L'achat une fois par an", "Aucune méthode : on commande au hasard"],
          answer: 0,
          explain: "Pour les articles A, on suit le stock en continu avec un point de commande précis : une rupture ou un surstock coûte cher.",
        },
        {
          q: "Quand le recomplètement périodique est-il particulièrement pratique ?",
          choices: ["Pour grouper les articles", "Pour un seul article très cher", "Pour les produits fabriqués sur mesure", "Quand on ne connaît pas la demande du tout"],
          answer: 0,
          explain: "En passant une commande régulière qui regroupe plusieurs références du même fournisseur, on réduit les frais de commande et de transport.",
        },
        {
          q: "Que comprend la position de stock ?",
          choices: ["Le stock plus les commandes en cours", "Le stock disponible uniquement", "Le stock de sécurité seulement", "Les commandes des clients en attente"],
          answer: 0,
          explain: "La position de stock ajoute au stock disponible les quantités déjà commandées et non reçues : sans elles, on risquerait de commander deux fois la même chose.",
        },
      ],
    },

    {
      id: "valorisation",
      title: "Inventaires et valorisation du stock",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Pourquoi faire des inventaires ?",
          body: "Le stock du **système informatique** (théorique) diffère parfois du stock **réel** : erreurs de saisie, casse, vols, produits mal rangés.\n\nL'inventaire compare les deux, corrige les écarts et permet d'établir la **valeur du stock** pour les comptes de l'entreprise. Sans stock fiable, on se trompe sur les commandes et sur la disponibilité promise aux clients.",
        },
        {
          type: "list",
          title: "Annuel ou tournant ?",
          items: [
            ["Inventaire annuel", "On compte tout, une fois par an, souvent en arrêtant l'activité : lourd mais exhaustif."],
            ["Inventaire tournant (cyclique)", "On compte quelques articles chaque jour ou chaque semaine, sans arrêter l'activité."],
            ["Priorité aux articles A", "On les compte plus souvent, car une erreur y coûte davantage."],
          ],
        },
        {
          type: "list",
          title: "Valoriser le stock",
          items: [
            ["FIFO (PEPS)", "Premier entré, premier sorti : les sorties sont valorisées au prix des plus anciennes entrées."],
            ["CUMP", "Coût unitaire moyen pondéré : on fait la moyenne pondérée des prix d'achat en stock."],
            ["Pourquoi ça compte ?", "La méthode change le coût des ventes et la valeur du stock final, donc le résultat de l'entreprise."],
          ],
        },
        {
          type: "example",
          title: "Exemple : FIFO contre CUMP",
          body: "Entrées : **100 unités à 10 €** puis **100 unités à 12 €**. Sortie : **150 unités**.\n\n• **FIFO** : 100 × 10 + 50 × 12 = **1 600 €** ; stock final : 50 × 12 = **600 €**.\n• **CUMP** : (1 000 + 1 200) / 200 = **11 €** l'unité ; sortie : 150 × 11 = **1 650 €** ; stock final : 50 × 11 = **550 €**.\n\nLes deux méthodes donnent un total de 2 200 € à répartir entre sorties et stock final, mais pas de la même façon.",
        },
        {
          type: "text",
          title: "La fiabilité du stock",
          body: "On mesure la qualité des données par l'**exactitude du stock** : la part des références dont la quantité système correspond à la quantité comptée.\n\nUn bon niveau est généralement **supérieur à 98 %** dans un entrepôt bien tenu. En dessous, les ruptures « fantômes » (le système croit avoir du stock qui n'existe pas) deviennent fréquentes.",
        },
        {
          type: "key",
          points: [
            "Un inventaire compare le stock système au stock réel et corrige les écarts.",
            "Inventaire annuel (tout) ou tournant (un peu chaque jour, priorité aux A).",
            "FIFO : sorties au prix des plus anciennes entrées ; CUMP : prix moyen pondéré.",
            "Exactitude du stock : objectif supérieur à 98 %.",
          ],
        },
      ],
      quiz: [
        () => {
          const qa = int(80, 200, 10)
          const pa = int(8, 14)
          const qb = int(80, 200, 10)
          const pb = pa + int(1, 4)
          const out = qa + int(10, Math.min(qb - 10, 80))
          const fifo = qa * pa + (out - qa) * pb
          return numQuestion({
            q: `Entrées : ${qa} unités à ${pa} €, puis ${qb} unités à ${pb} €. Sortie de ${out} unités. Quelle est la valeur de la sortie en FIFO ?`,
            answer: fifo,
            unit: "€",
            digits: 0,
            explain: `FIFO : on sort d'abord les ${qa} unités les plus anciennes à ${pa} €, puis ${out - qa} unités à ${pb} € : ${qa} × ${pa} + ${out - qa} × ${pb} = ${fmt(fifo, 0)} €.`,
            wrong: [out * pa, out * pb, (qa * pa + qb * pb), fifo + out * 2],
          })
        },
        () => {
          const qa = int(80, 200, 10)
          const pa = int(8, 14)
          const qb = int(80, 200, 10)
          const pb = pa + int(1, 4)
          const out = int(50, Math.min(qa + qb - 20, 180), 10)
          const cump = (qa * pa + qb * pb) / (qa + qb)
          return numQuestion({
            q: `Entrées : ${qa} unités à ${pa} €, puis ${qb} unités à ${pb} €. Sortie de ${out} unités. Quelle est la valeur de la sortie en CUMP ?`,
            answer: cump * out,
            unit: "€",
            digits: 0,
            explain: `CUMP = (${qa} × ${pa} + ${qb} × ${pb}) / ${qa + qb} = ${fmt(cump, 2)} €. Sortie : ${out} × ${fmt(cump, 2)} ≈ ${fmt(cump * out, 0)} €.`,
            wrong: [out * pa, out * pb, out * (pa + pb), cump * out * 1.15],
          })
        },
        {
          q: "Que signifie FIFO ?",
          choices: ["Premier entré, premier sorti", "Dernier entré, premier sorti", "Stock moyen en fin d'année", "Premier inventaire, première opération"],
          answer: 0,
          explain: "FIFO (First In, First Out, ou PEPS en français) : les plus anciennes entrées sortent en premier, et sont valorisées à leur prix d'entrée.",
        },
        {
          q: "À quoi sert l'inventaire ?",
          choices: ["Comparer réel et système", "Calculer le prix de vente", "Choisir le transporteur", "Négocier avec les fournisseurs"],
          answer: 0,
          explain: "Il vérifie que les quantités du système correspondent à la réalité, corrige les écarts et permet d'établir la valeur du stock.",
        },
        {
          q: "En quoi consiste un inventaire tournant ?",
          choices: ["Compter un peu chaque jour", "Compter tout le stock une seule fois par an", "Compter uniquement les articles en rupture", "Faire tourner les palettes dans l'entrepôt"],
          answer: 0,
          explain: "L'inventaire tournant (ou cyclique) répartit le comptage dans le temps : l'activité continue et les écarts se corrigent plus vite.",
        },
        {
          q: "Pourquoi compte-t-on plus souvent les articles de classe A ?",
          choices: ["Une erreur y coûte plus cher", "Ils sont plus faciles à retrouver", "Ils pèsent plus lourd à porter", "Ils ne sont jamais en rupture"],
          answer: 0,
          explain: "Les articles A concentrent la valeur : un écart non détecté y coûte davantage, donc on les contrôle plus souvent.",
        },
        {
          q: "Que mesure l'exactitude du stock ?",
          choices: ["La part de références exactes", "Le nombre total d'articles en entrepôt", "La vitesse de préparation des commandes", "Le prix moyen d'un article en stock"],
          answer: 0,
          explain: "C'est le pourcentage de références pour lesquelles la quantité du système correspond à la quantité comptée : un bon indicateur de fiabilité.",
        },
        {
          q: "Pourquoi la méthode de valorisation (FIFO, CUMP) est-elle importante ?",
          choices: ["Elle change la valeur du stock", "Elle change la quantité physique en stock", "Elle modifie le délai du fournisseur", "Elle décide du transporteur à utiliser"],
          answer: 0,
          explain: "Pour les mêmes quantités, FIFO et CUMP donnent un coût des ventes et une valeur de stock final différents, donc un résultat comptable différent.",
        },
      ],
    },
  ],
}
