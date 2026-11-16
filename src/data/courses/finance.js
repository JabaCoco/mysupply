// Lot 15 — Nouveau module : Finance et supply chain (5 leçons).
import { fmt, int, numQuestion, pick } from '../gen.js'

export default {
  id: "finance",
  title: "Finance et supply chain",
  short: "Finance",
  icon: "coins",
  color: "amber",
  lessons: [
    {
      id: "bfr",
      title: "Le besoin en fonds de roulement (BFR)",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "L'argent immobilisé par l'activité",
          body: "Une entreprise paie ses fournisseurs, fabrique, stocke, puis se fait payer par ses clients. Entre le moment où elle **dépense** et celui où elle **encaisse**, elle doit **financer** son activité : c'est le **besoin en fonds de roulement (BFR)**. Plus la supply chain est lente (gros stocks, clients qui paient tard), plus le BFR est élevé.",
        },
        {
          type: "formula",
          title: "Le BFR d'exploitation",
          formula: "BFR = stocks + créances clients − dettes fournisseurs",
          legend: [
            ["Stocks", "Matières, en-cours et produits finis : de l'argent déjà dépensé mais pas encore récupéré."],
            ["Créances clients", "Ventes facturées mais pas encore payées."],
            ["Dettes fournisseurs", "Achats reçus mais pas encore payés : ils financent l'activité."],
          ],
          example: "Stocks 400 000 €, créances clients 600 000 €, dettes fournisseurs 500 000 € : BFR = 400 + 600 − 500 = 500 000 €. L'entreprise doit trouver 500 000 € pour financer son cycle.",
        },
        {
          type: "list",
          title: "Les leviers pour réduire le BFR",
          items: [
            ["Stocks", "Réduire les stocks (rotation, prévisions, Kanban, stocks dormants)."],
            ["Clients", "Raccourcir les délais de paiement, relancer vite, facturer à la livraison."],
            ["Fournisseurs", "Allonger les délais de paiement dans les limites légales, sans fragiliser le fournisseur."],
          ],
        },
        {
          type: "text",
          title: "Pourquoi cela intéresse la supply chain",
          body: "Les décisions de la supply chain agissent sur deux des trois composantes du BFR : les **stocks** (directement) et les **délais de paiement des fournisseurs** (par les achats). Réduire les stocks de 100 000 € **libère 100 000 € de trésorerie** une fois, en plus d'économiser chaque année le **coût de possession** de ces stocks (financement, stockage, obsolescence).",
        },
        {
          type: "key",
          points: [
            "BFR = stocks + créances clients − dettes fournisseurs.",
            "Un BFR élevé = trésorerie immobilisée à financer.",
            "Réduire les stocks libère de la trésorerie et réduit les coûts de possession.",
          ],
        },
      ],
      quiz: [
        () => {
          const stock = int(2, 8) * 100000
          const cred = int(3, 9) * 100000
          const dettes = int(2, 7) * 100000
          return numQuestion({
            q: `Stocks ${fmt(stock)} €, créances clients ${fmt(cred)} €, dettes fournisseurs ${fmt(dettes)} €. Quel est le BFR ?`,
            answer: stock + cred - dettes,
            unit: "€",
            digits: 0,
            explain: `${fmt(stock)} + ${fmt(cred)} − ${fmt(dettes)} = ${fmt(stock + cred - dettes, 0)} €.`,
            wrong: [stock + cred + dettes, stock - cred - dettes + 300000, stock + dettes - cred + 100000, stock + cred],
          })
        },
        () => {
          const stock = int(2, 8) * 100000
          const cut = pick([10, 20, 25, 30])
          return numQuestion({
            q: `Une entreprise réduit son stock de ${fmt(stock)} € de ${cut} %. Quelle trésorerie cela libère-t-il (une fois) ?`,
            answer: (stock * cut) / 100,
            unit: "€",
            digits: 0,
            explain: `${fmt(stock)} × ${cut} % = ${fmt((stock * cut) / 100, 0)} € libérés.`,
            wrong: [stock - (stock * cut) / 100, stock * cut, stock / cut, (stock * cut) / 10],
          })
        },
        () => {
          const stock = int(2, 8) * 100000
          const cut = pick([10, 20, 25, 30])
          const rate = pick([8, 10, 12])
          return numQuestion({
            q: `Le stock baisse de ${cut} % sur ${fmt(stock)} €, avec un coût de possession de ${rate} % par an. Quelle économie annuelle cela représente-t-il ?`,
            answer: (stock * cut * rate) / 10000,
            unit: "€",
            digits: 0,
            explain: `Stock en moins = ${fmt((stock * cut) / 100, 0)} € ; économie = ${fmt((stock * cut) / 100, 0)} × ${rate} % = ${fmt((stock * cut * rate) / 10000, 0)} € par an.`,
            wrong: [(stock * cut) / 100, (stock * rate) / 100, stock * cut * rate, (stock * cut * rate) / 1000],
          })
        },
        {
          q: "Que représente le BFR ?",
          choices: ["L'argent à financer entre dépenses et encaissements", "Le bénéfice net de l'entreprise sur l'année", "Le capital versé par les actionnaires au départ", "Le total des salaires versés aux équipes"],
          answer: 0,
          explain: "Le BFR mesure la trésorerie immobilisée dans le cycle d'exploitation (stocks et clients, moins fournisseurs).",
        },
        {
          q: "Quel élément réduit le BFR ?",
          choices: ["Des dettes fournisseurs plus élevées", "Des stocks plus élevés dans les entrepôts", "Des clients qui paient beaucoup plus tard", "Des invendus plus nombreux en fin de saison"],
          answer: 0,
          explain: "Les dettes fournisseurs financent l'activité : plus elles sont élevées, moins l'entreprise doit financer elle-même.",
        },
        {
          q: "Quel levier la logistique actionne-t-elle directement sur le BFR ?",
          choices: ["Le niveau des stocks", "Le délai de paiement des clients en jours", "Le prix de vente", "Le taux de TVA"],
          answer: 0,
          explain: "Réduire les stocks (rotation, prévisions, flux tirés) réduit directement le BFR.",
        },
        {
          q: "Pourquoi un client qui paie plus tard augmente-t-il le BFR ?",
          choices: ["Les créances clients augmentent", "Les stocks diminuent", "Les dettes fournisseurs disparaissent", "Le chiffre d'affaires baisse"],
          answer: 0,
          explain: "Tant que le client n'a pas payé, l'entreprise a déjà dépensé mais n'a pas encaissé : elle doit financer ce délai.",
        },
        {
          q: "Que libère une réduction de stock ?",
          choices: ["De la trésorerie, une fois", "Du chiffre d'affaires chaque année", "Des créances clients", "Des dettes fournisseurs"],
          answer: 0,
          explain: "Un stock en moins, c'est de l'argent récupéré ; l'effet est ponctuel, plus une économie annuelle de coûts de possession.",
        },
      ],
    },

    {
      id: "cash-to-cash",
      title: "Le cycle cash-to-cash",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "Combien de jours entre payer et être payé ?",
          body: "Le **cycle cash-to-cash** (ou cycle de conversion de trésorerie) mesure le nombre de **jours** entre le moment où l'entreprise **paie ses fournisseurs** et celui où elle **encaisse ses clients**. Plus il est court, moins elle a besoin de financer. C'est l'un des indicateurs préférés des directeurs financiers et supply chain.",
        },
        {
          type: "formula",
          title: "Les trois durées",
          formula: "Cash-to-cash = DIO + DSO − DPO",
          legend: [
            ["DIO (jours de stock)", "Stock moyen / coût des ventes × 365."],
            ["DSO (délai clients)", "Créances clients / chiffre d'affaires × 365."],
            ["DPO (délai fournisseurs)", "Dettes fournisseurs / achats × 365."],
          ],
          example: "Stock 400 000 € pour 3 000 000 € de coût des ventes : DIO = 48,7 jours. Créances 600 000 € pour 4 000 000 € de CA : DSO = 54,8 jours. Dettes 500 000 € pour 2 400 000 € d'achats : DPO = 76,0 jours. Cash-to-cash = 48,7 + 54,8 − 76,0 ≈ 27,5 jours.",
        },
        {
          type: "list",
          title: "Lecture du résultat",
          items: [
            ["Cycle court ou négatif", "L'entreprise est payée avant de payer ses fournisseurs : elle finance son activité grâce aux autres (cas de certains distributeurs)."],
            ["Cycle long", "Beaucoup de trésorerie immobilisée : besoin de financement."],
            ["Comparaison", "On se compare à son secteur : le cycle varie beaucoup d'une industrie à l'autre."],
          ],
        },
        {
          type: "key",
          points: [
            "Cash-to-cash = DIO + DSO − DPO, en jours.",
            "DIO : jours de stock ; DSO : délai clients ; DPO : délai fournisseurs.",
            "Un cycle plus court = moins de trésorerie immobilisée.",
          ],
        },
      ],
      quiz: [
        () => {
          const stock = int(2, 8) * 100000
          const cogs = int(10, 40) * 100000
          return numQuestion({
            q: `Stock moyen de ${fmt(stock)} € pour un coût des ventes annuel de ${fmt(cogs)} €. Quel est le DIO (année de 365 jours) ?`,
            answer: (stock / cogs) * 365,
            unit: "jours",
            digits: 0,
            explain: `${fmt(stock)} / ${fmt(cogs)} × 365 = ${fmt((stock / cogs) * 365, 0)} jours.`,
            wrong: [(cogs / stock) * 365, (stock / cogs) * 360 + 30, stock / cogs, (stock / cogs) * 100],
          })
        },
        () => {
          const dio = int(30, 70)
          const dso = int(30, 60)
          const dpo = int(30, 80)
          return numQuestion({
            q: `DIO ${dio} jours, DSO ${dso} jours, DPO ${dpo} jours. Quel est le cycle cash-to-cash ?`,
            answer: dio + dso - dpo,
            unit: "jours",
            digits: 0,
            explain: `${dio} + ${dso} − ${dpo} = ${dio + dso - dpo} jours.`,
            wrong: [dio + dso + dpo, dio - dso - dpo + 60, dio + dso, dpo - dio - dso + 120],
          })
        },
        () => {
          const days = int(5, 15)
          const ca = int(10, 50) * 100000
          return numQuestion({
            q: `Un projet réduit le cycle cash-to-cash de ${days} jours. Pour un chiffre d'affaires annuel de ${fmt(ca)} € (année de 365 jours), quelle trésorerie approximative cela libère-t-il ?`,
            answer: (ca / 365) * days,
            unit: "€",
            digits: 0,
            explain: `Chiffre d'affaires par jour = ${fmt(ca)} / 365 = ${fmt(ca / 365, 0)} € ; × ${days} jours = ${fmt((ca / 365) * days, 0)} €.`,
            wrong: [ca * days, ca / days, (ca / 365) * days * 2, ca / 365],
          })
        },
        {
          q: "Que mesure le DIO ?",
          choices: ["Le nombre de jours de stock", "Le délai de paiement des clients en jours", "Le délai de paiement des fournisseurs", "Le nombre de jours de congé"],
          answer: 0,
          explain: "DIO (Days Inventory Outstanding) : combien de jours de ventes représente le stock.",
        },
        {
          q: "Que mesure le DPO ?",
          choices: ["Le délai moyen de paiement des fournisseurs", "Le délai moyen de paiement de tous les clients", "Le nombre de jours de production par mois", "Le délai de livraison des produits aux clients"],
          answer: 0,
          explain: "DPO (Days Payable Outstanding) : en moyenne, combien de jours l'entreprise met à payer ses fournisseurs.",
        },
        {
          q: "Comment calcule-t-on le cash-to-cash ?",
          choices: ["DIO + DSO − DPO", "DIO − DSO − DPO", "DIO + DSO + DPO", "DSO − DIO + DPO"],
          answer: 0,
          explain: "Les jours de stock et de crédit clients s'ajoutent ; le crédit fournisseurs s'en soustrait car il finance le cycle.",
        },
        {
          q: "Quelle action raccourcit le cash-to-cash ?",
          choices: ["Réduire les stocks ou accélérer les encaissements", "Augmenter fortement les stocks de sécurité", "Payer tous les fournisseurs beaucoup plus tôt", "Accorder des délais de paiement plus longs aux clients"],
          answer: 0,
          explain: "Moins de jours de stock ou de crédit clients, ou plus de jours de crédit fournisseurs, raccourcissent le cycle.",
        },
        {
          q: "Que signifie un cash-to-cash négatif ?",
          choices: ["L'entreprise encaisse avant de payer ses fournisseurs", "L'entreprise perd de l'argent chaque jour de l'année", "L'entreprise n'a aucun stock dans ses entrepôts", "L'entreprise ne vend plus rien à ses clients"],
          answer: 0,
          explain: "Certains distributeurs vendent et encaissent avant d'avoir à payer leurs fournisseurs : leurs fournisseurs financent leur activité.",
        },
      ],
    },

    {
      id: "cout-complet",
      title: "Le coût complet logistique",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Voir tous les coûts, pas seulement le prix",
          body: "Le **prix d'achat** ne dit pas tout. Le **coût complet** (ou *total cost of ownership*, TCO) additionne tous les coûts liés à un produit ou une décision : achat, transport, stockage, qualité, administration, risques. Il évite de choisir une option « moins chère » qui coûte plus cher au final.",
        },
        {
          type: "list",
          title: "Les composantes",
          items: [
            ["Achat", "Prix du produit, remises."],
            ["Transport et douane", "Fret, assurance, droits, frais de dédouanement."],
            ["Stock", "Coût de possession du stock (capital, stockage, obsolescence)."],
            ["Qualité", "Rebuts, retours, retouches, réclamations."],
            ["Administration", "Commandes, factures, suivi du fournisseur."],
            ["Risque", "Ruptures, retards, assurance."],
          ],
        },
        {
          type: "formula",
          title: "Le coût complet par unité",
          formula: "Coût complet = (achat + transport + stock + qualité + administration) / quantité",
          legend: [
            ["Comparaison", "On compare toujours le coût complet de deux options, pas leur prix d'achat."],
            ["Coût de possession", "Valeur du stock × taux annuel de possession (souvent 15 à 25 %)."],
          ],
          example: "Fournisseur lointain : achat 8 € + transport 1,2 € + stock 0,9 € + qualité 0,4 € = 10,5 € par unité. Fournisseur local : achat 9,5 € + transport 0,3 € + stock 0,2 € + qualité 0,1 € = 10,1 €. Le « moins cher » à l'achat est plus cher au final.",
        },
        {
          type: "key",
          points: [
            "Coût complet (TCO) = achat + transport + stock + qualité + administration + risque.",
            "On compare toujours les coûts complets, pas les prix d'achat.",
            "Le coût de possession du stock est souvent sous-estimé.",
          ],
        },
      ],
      quiz: [
        () => {
          const buy = int(5, 15)
          const transport = int(5, 20) / 10
          const stock = int(2, 12) / 10
          const quality = int(1, 6) / 10
          const total = buy + transport + stock + quality
          return numQuestion({
            q: `Achat ${fmt(buy)} €, transport ${fmt(transport, 1)} €, stock ${fmt(stock, 1)} €, qualité ${fmt(quality, 1)} € par unité. Quel est le coût complet par unité ?`,
            answer: total,
            unit: "€",
            digits: 2,
            explain: `${fmt(buy)} + ${fmt(transport, 1)} + ${fmt(stock, 1)} + ${fmt(quality, 1)} = ${fmt(total, 2)} €.`,
            wrong: [buy, buy + transport, total + 1, total - 0.5],
          })
        },
        () => {
          const value = int(2, 10) * 100000
          const rate = pick([15, 20, 25])
          return numQuestion({
            q: `Un stock de ${fmt(value)} € a un coût de possession de ${rate} % par an. Quel est son coût annuel ?`,
            answer: (value * rate) / 100,
            unit: "€",
            digits: 0,
            explain: `${fmt(value)} × ${rate} % = ${fmt((value * rate) / 100, 0)} €.`,
            wrong: [value, value * rate, value / rate, (value * rate) / 10],
          })
        },
        () => {
          const a = int(80, 120) / 10
          const b = a + int(5, 15) / 10
          const extraA = int(10, 30) / 10
          const extraB = int(1, 6) / 10
          return numQuestion({
            q: `Option A : prix ${fmt(a, 1)} € + ${fmt(extraA, 1)} € de coûts annexes. Option B : prix ${fmt(b, 1)} € + ${fmt(extraB, 1)} €. Quel est l'écart de coût complet entre les deux options (en €) ?`,
            answer: Math.abs(a + extraA - (b + extraB)),
            unit: "€",
            digits: 1,
            explain: `A : ${fmt(a + extraA, 1)} € ; B : ${fmt(b + extraB, 1)} € ; écart absolu = ${fmt(Math.abs(a + extraA - (b + extraB)), 1)} €.`,
            wrong: [Math.abs(a - b), a + extraA, b + extraB, Math.abs(a + extraA - (b + extraB)) + 1],
          })
        },
        {
          q: "Que signifie TCO ?",
          choices: ["Coût total de possession", "Taux de croissance opérationnel", "Temps de commande optimal", "Transport en cours d'organisation"],
          answer: 0,
          explain: "Le TCO additionne tous les coûts liés à une décision, pas seulement le prix d'achat.",
        },
        {
          q: "Pourquoi comparer des coûts complets plutôt que des prix d'achat ?",
          choices: ["Un prix bas peut cacher des coûts annexes élevés", "Les prix d'achat affichés sont toujours faux ou trompeurs", "Le prix d'achat n'existe plus dans les entreprises modernes", "Les coûts annexes sont toujours nuls pour les achats importants"],
          answer: 0,
          explain: "Transport, stock, qualité et administration peuvent annuler l'avantage d'un prix d'achat plus bas.",
        },
        {
          q: "Que comprend le coût de possession d'un stock ?",
          choices: ["Capital immobilisé, stockage, assurance, obsolescence", "Uniquement le prix d'achat des produits stockés", "Seulement le transport des produits jusqu'au client", "Le salaire du directeur logistique et de son équipe"],
          answer: 0,
          explain: "Détenir un stock coûte une part de sa valeur chaque année : souvent 15 à 25 %.",
        },
        {
          q: "Quel coût un fournisseur lointain fait-il souvent augmenter ?",
          choices: ["Le coût de stock et de transport", "Le coût d'achat uniquement", "Le coût de formation du personnel", "Le coût de publicité"],
          answer: 0,
          explain: "Des délais plus longs nécessitent plus de stock de sécurité et de stock en transit.",
        },
        {
          q: "Que fait-on avec les risques dans un coût complet ?",
          choices: ["On les chiffre : ruptures, retards, assurance", "On les ignore toujours dans les comparaisons de prix", "On les supprime systématiquement des comparaisons", "On les confie entièrement au transporteur choisi"],
          answer: 0,
          explain: "Un risque a un coût moyen (probabilité × impact) qui peut être ajouté à la comparaison.",
        },
      ],
    },

    {
      id: "impact-resultat",
      title: "L'impact sur le résultat",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Un euro économisé vaut plus qu'un euro vendu",
          body: "Une entreprise gagne de l'argent quand ses **recettes** dépassent ses **coûts**. Une économie de coûts logistiques s'ajoute **intégralement au résultat**, alors qu'une vente supplémentaire ne rapporte que sa **marge**. Les directions financières écoutent donc beaucoup les arguments chiffrés de la supply chain.",
        },
        {
          type: "formula",
          title: "Le chiffre d'affaires équivalent",
          formula: "CA équivalent = économie réalisée / marge nette (en %)",
          legend: [
            ["Marge nette", "Résultat net / chiffre d'affaires, par exemple 4 %."],
            ["CA équivalent", "Chiffre d'affaires supplémentaire à réaliser pour obtenir le même gain que l'économie."],
          ],
          example: "Une économie de 100 000 € de coûts logistiques, pour une entreprise à 4 % de marge nette : CA équivalent = 100 000 / 0,04 = 2 500 000 €. Il faudrait vendre 2,5 M€ de plus pour gagner autant.",
        },
        {
          type: "list",
          title: "Le compte de résultat vu par la supply chain",
          items: [
            ["Chiffre d'affaires", "Les ventes : influencées par le taux de service."],
            ["Coût des ventes", "Achats et fabrication : influencé par les achats et la production."],
            ["Coûts logistiques", "Transport, entreposage, manutention."],
            ["Frais de stock", "Coûts de possession, démarque, obsolescence (dépréciation)."],
            ["Résultat", "Ce qui reste après tous les coûts."],
          ],
        },
        {
          type: "text",
          title: "Parler le langage de la finance",
          body: "Pour convaincre, on **chiffre** : coût actuel, coût après la solution, **gain annuel**, **investissement** et **délai de retour**. On présente l'effet sur le **résultat** et sur la **trésorerie**, pas seulement sur « l'efficacité » logistique.",
        },
        {
          type: "key",
          points: [
            "Une économie de coûts s'ajoute intégralement au résultat.",
            "CA équivalent = économie / marge nette.",
            "Chiffrer le gain, l'investissement et le délai de retour pour convaincre.",
          ],
        },
      ],
      quiz: [
        () => {
          const saving = int(2, 10) * 50000
          const margin = pick([2, 3, 4, 5, 8])
          return numQuestion({
            q: `Une économie de ${fmt(saving)} € de coûts logistiques, pour une entreprise dont la marge nette est de ${margin} %. Quel chiffre d'affaires supplémentaire faudrait-il réaliser pour gagner autant ?`,
            answer: (saving * 100) / margin,
            unit: "€",
            digits: 0,
            explain: `${fmt(saving)} / ${fmt(margin / 100, 2)} = ${fmt((saving * 100) / margin, 0)} €.`,
            wrong: [saving * margin, saving / 100 * margin, saving + margin, (saving * 100) / margin / 2],
          })
        },
        () => {
          const ca = int(10, 60) * 1000000
          const share = pick([6, 8, 10, 12])
          const cut = pick([5, 8, 10])
          return numQuestion({
            q: `Les coûts logistiques représentent ${share} % d'un chiffre d'affaires de ${fmt(ca)} €. On les réduit de ${cut} %. Quel gain de résultat obtient-on ?`,
            answer: (ca * share * cut) / 10000,
            unit: "€",
            digits: 0,
            explain: `Coûts logistiques = ${fmt((ca * share) / 100, 0)} € ; × ${cut} % = ${fmt((ca * share * cut) / 10000, 0)} €.`,
            wrong: [(ca * share) / 100, (ca * cut) / 100, ca * share * cut, (ca * share * cut) / 1000],
          })
        },
        () => {
          const ca = int(20, 100, 10) * 100000
          const margin = pick([3, 4, 5])
          const rise = pick([5, 10])
          return numQuestion({
            q: `Un meilleur taux de service fait croître le chiffre d'affaires de ${fmt(ca)} € de ${rise} %. Avec une marge nette de ${margin} %, quel résultat supplémentaire cela génère-t-il ?`,
            answer: (ca * rise * margin) / 10000,
            unit: "€",
            digits: 0,
            explain: `CA supplémentaire = ${fmt((ca * rise) / 100, 0)} € ; résultat = ${fmt((ca * rise) / 100, 0)} × ${margin} % = ${fmt((ca * rise * margin) / 10000, 0)} €.`,
            wrong: [(ca * rise) / 100, (ca * margin) / 100, ca * rise * margin, (ca * rise * margin) / 1000],
          })
        },
        {
          q: "Pourquoi une économie de coûts pèse-t-elle plus qu'une vente équivalente ?",
          choices: ["Elle s'ajoute entièrement au résultat", "Elle augmente automatiquement les prix de vente", "Elle supprime tous les impôts de l'entreprise", "Elle fait baisser la marge brute de tous les produits"],
          answer: 0,
          explain: "Un euro économisé est un euro de résultat en plus ; un euro de vente en plus ne rapporte que sa marge.",
        },
        {
          q: "Que signifie un CA équivalent de 2,5 M€ pour 100 000 € d'économie ?",
          choices: ["Il faudrait vendre 2,5 M€ de plus pour gagner autant", "L'entreprise gagne 2,5 M€ de plus chaque année", "Le projet coûte 2,5 M€ à l'entreprise", "Le chiffre d'affaires baisse de 2,5 M€ cette année"],
          answer: 0,
          explain: "Avec 4 % de marge nette, 100 000 € de gain équivalent à 2,5 M€ de ventes en plus.",
        },
        {
          q: "Quel élément du compte de résultat dépend du taux de service ?",
          choices: ["Le chiffre d'affaires", "Les impôts", "Les amortissements de l'usine", "Le capital social"],
          answer: 0,
          explain: "Un meilleur service évite les ventes perdues par rupture et fidélise les clients.",
        },
        {
          q: "Que doit présenter un dossier pour convaincre la direction financière ?",
          choices: ["Le gain annuel, l'investissement et le délai de retour", "Uniquement des mesures de productivité de l'entrepôt", "Une liste des logiciels disponibles sur le marché", "Les photos de l'entrepôt et des équipes"],
          answer: 0,
          explain: "Les décideurs financiers raisonnent en gain, investissement et délai de retour.",
        },
        {
          q: "Que désigne la démarque ?",
          choices: ["Les pertes de stock (casse, vol, erreurs)", "La remise accordée au client à la livraison", "La marge réalisée sur un produit vendu", "Le prix d'un emballage standard du produit"],
          answer: 0,
          explain: "La démarque réduit directement le résultat : un stock perdu est un coût sans vente.",
        },
      ],
    },

    {
      id: "investissements",
      title: "Évaluer un investissement : VAN et délai de retour",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "Un euro demain vaut moins qu'un euro aujourd'hui",
          body: "Pour décider d'un investissement (nouvel entrepôt, robot, logiciel), on compare ce qu'il **coûte** à ce qu'il **rapportera** sur plusieurs années. Mais un euro reçu dans trois ans vaut **moins** qu'un euro aujourd'hui (on pourrait le placer, et il y a un risque). On **actualise** donc les gains futurs avec un **taux d'actualisation**.",
        },
        {
          type: "formula",
          title: "La valeur actuelle nette (VAN)",
          formula: "VAN = Σ flux de l'année n / (1 + taux)^n − investissement",
          legend: [
            ["Flux", "Gain net de chaque année (économies − coûts)."],
            ["Taux", "Taux d'actualisation, par exemple 8 %."],
            ["Décision", "VAN positive : le projet crée de la valeur ; négative : il en détruit."],
          ],
          example: "Investissement 100 000 €, gains de 40 000 € par an pendant 3 ans, taux 8 % : 40 000/1,08 + 40 000/1,08² + 40 000/1,08³ = 37 037 + 34 294 + 31 753 = 103 084 €. VAN = 103 084 − 100 000 = 3 084 € (positive, mais de justesse).",
        },
        {
          type: "list",
          title: "Les critères de décision",
          items: [
            ["VAN", "Valeur créée en euros d'aujourd'hui."],
            ["Délai de retour", "Années pour récupérer l'investissement (simple, ignore l'actualisation)."],
            ["ROI", "Gain total / investissement."],
            ["TRI (taux de rentabilité interne)", "Taux pour lequel la VAN est nulle."],
          ],
        },
        {
          type: "text",
          title: "Ne pas oublier",
          body: "Les chiffres reposent sur des **hypothèses** (économies attendues, durée de vie, volumes) : on teste un scénario **prudent** et un scénario **optimiste**. Certains bénéfices ne se chiffrent pas facilement (sécurité, image, qualité de vie) mais comptent dans la décision finale.",
        },
        {
          type: "key",
          points: [
            "On actualise les gains futurs : un euro demain vaut moins qu'aujourd'hui.",
            "VAN = somme des flux actualisés − investissement ; positive = projet intéressant.",
            "Délai de retour et ROI : critères complémentaires, plus simples.",
            "Tester plusieurs scénarios, car les hypothèses sont incertaines.",
          ],
        },
      ],
      quiz: [
        () => {
          const flow = int(2, 8) * 10000
          const rate = pick([5, 8, 10])
          return numQuestion({
            q: `Un gain de ${fmt(flow)} € est attendu dans un an. Avec un taux d'actualisation de ${rate} %, quelle est sa valeur actuelle ?`,
            answer: flow / (1 + rate / 100),
            unit: "€",
            digits: 0,
            explain: `${fmt(flow)} / ${fmt(1 + rate / 100, 2)} = ${fmt(flow / (1 + rate / 100), 0)} €.`,
            wrong: [flow, flow * (1 + rate / 100), flow * (1 - rate / 100), flow / (1 + rate / 100) + flow / 10],
          })
        },
        () => {
          const inv = int(5, 20) * 10000
          const gain = int(2, 6) * 10000
          const years = int(3, 6)
          return numQuestion({
            q: `Investissement de ${fmt(inv)} €, gain annuel de ${fmt(gain)} € pendant ${years} ans (sans actualisation). Quel est le gain net total ?`,
            answer: gain * years - inv,
            unit: "€",
            digits: 0,
            explain: `${fmt(gain)} × ${years} − ${fmt(inv)} = ${fmt(gain * years - inv, 0)} €.`,
            wrong: [gain * years, inv - gain, gain * years + inv, gain - inv],
          })
        },
        () => {
          const inv = int(8, 20) * 10000
          const gain = int(2, 5) * 10000
          return numQuestion({
            q: `Investissement de ${fmt(inv)} €, gain annuel net de ${fmt(gain)} €. Quel est le délai de retour (en années) ?`,
            answer: inv / gain,
            unit: "ans",
            digits: 1,
            explain: `${fmt(inv)} / ${fmt(gain)} = ${fmt(inv / gain, 1)} ans.`,
            wrong: [gain / inv, inv - gain, inv * gain, (inv / gain) * 2],
          })
        },
        {
          q: "Pourquoi actualise-t-on les gains futurs ?",
          choices: ["Un euro futur vaut moins qu'un euro actuel", "Pour augmenter artificiellement la valeur du projet", "Parce que les gains futurs sont toujours nuls", "Pour éviter définitivement de calculer le délai de retour"],
          answer: 0,
          explain: "On pourrait placer l'argent aujourd'hui et le futur est incertain : les flux lointains pèsent moins.",
        },
        {
          q: "Que signifie une VAN positive ?",
          choices: ["Le projet crée de la valeur", "Le projet est forcément déficitaire pour l'entreprise", "Le projet est gratuit pour tous les services", "Le projet est sans aucun risque pour l'entreprise"],
          answer: 0,
          explain: "La VAN positive indique que les gains actualisés dépassent l'investissement.",
        },
        {
          q: "Que mesure le délai de retour ?",
          choices: ["Le temps pour récupérer l'investissement", "Le temps de livraison d'un projet par le fournisseur", "Le taux d'intérêt de l'emprunt bancaire du projet", "Le salaire des équipes du projet pendant un an"],
          answer: 0,
          explain: "Il indique en combien d'années les gains cumulés remboursent la mise de départ.",
        },
        {
          q: "Que représente le TRI ?",
          choices: ["Le taux pour lequel la VAN est nulle", "Le taux de remplissage interne des entrepôts", "Le total des retours et incidents de la période", "Le délai de paiement des clients en jours"],
          answer: 0,
          explain: "Le TRI (taux de rentabilité interne) est le taux d'actualisation qui annule la VAN du projet.",
        },
        {
          q: "Pourquoi tester plusieurs scénarios ?",
          choices: ["Les hypothèses sont incertaines", "Pour augmenter volontairement le montant de l'investissement", "Pour éviter de devoir décider avant la fin de l'année", "Pour supprimer totalement le risque du projet"],
          answer: 0,
          explain: "Les économies et la durée de vie sont des estimations : un scénario prudent protège d'une mauvaise surprise.",
        },
      ],
    },
  ],
}
