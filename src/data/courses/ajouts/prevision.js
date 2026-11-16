// Lot 6 — Prévision : 4 leçons ajoutées + questions supplémentaires pour les 2 leçons existantes.
import { fmt, int, numQuestion, pick } from '../../gen.js'

export default {
  more: {
    methodes: [
      {
        q: "Quelle approche utilise-t-on pour prévoir la demande d'un tout nouveau produit ?",
        choices: ["Une méthode qualitative (avis d'experts)", "Une moyenne mobile sur les ventes passées", "Un lissage exponentiel de l'historique", "Une régression sur dix ans de données"],
        answer: 0,
        explain: "Sans historique, on ne peut pas calculer : on s'appuie sur l'avis d'experts, des études de marché ou des produits comparables.",
      },
      () => {
        const sales = Array.from({ length: 3 }, () => int(80, 160, 5))
        const avg = (sales[0] + sales[1] + sales[2]) / 3
        return numQuestion({
          q: `Ventes des 3 derniers mois : ${sales[0]}, ${sales[1]} et ${sales[2]}. Quelle est la prévision du mois suivant par moyenne mobile sur 3 mois ?`,
          answer: avg,
          unit: "unités",
          digits: 1,
          explain: `(${sales[0]} + ${sales[1]} + ${sales[2]}) / 3 = ${fmt(avg, 1)} unités.`,
          wrong: [sales[2], sales[0] + sales[1] + sales[2], (sales[1] + sales[2]) / 2, avg * 1.2],
        })
      },
      () => {
        const alpha = pick([0.2, 0.3, 0.4, 0.5])
        const forecast = int(80, 200, 5)
        const demand = int(80, 200, 5)
        const next = alpha * demand + (1 - alpha) * forecast
        return numQuestion({
          q: `Lissage exponentiel avec α = ${fmt(alpha)}. Prévision précédente : ${forecast}. Ventes réelles : ${demand}. Quelle est la nouvelle prévision ?`,
          answer: next,
          unit: "unités",
          digits: 1,
          explain: `F = α × D + (1 − α) × F précédente = ${fmt(alpha)} × ${demand} + ${fmt(1 - alpha)} × ${forecast} = ${fmt(next, 1)}.`,
          wrong: [demand, forecast, (demand + forecast) / 2, (1 - alpha) * demand + alpha * forecast],
        })
      },
      {
        q: "En quoi consiste la méthode Delphi ?",
        choices: ["Interroger des experts en plusieurs tours", "Calculer une moyenne mobile sur plusieurs années", "Faire voter les clients pour choisir un produit", "Utiliser un logiciel de prévision automatique"],
        answer: 0,
        explain: "Dans la méthode Delphi, des experts répondent à plusieurs tours de questions : après chaque tour, ils découvrent l'avis du groupe et peuvent ajuster le leur.",
      },
    ],
    bullwhip: [
      {
        q: "Quelle donnée partager pour limiter l'effet coup de fouet ?",
        choices: ["Les ventes réelles au client final", "Les marges de chaque entreprise", "Les salaires des équipes logistiques", "Les plans marketing confidentiels"],
        answer: 0,
        explain: "Quand tous les maillons voient la vraie demande, ils cessent de réagir aux commandes des autres, ce qui réduit l'amplification.",
      },
      () => {
        const demandChange = int(5, 15)
        const factor = pick([1.5, 2])
        const links = 3
        const final = demandChange * factor ** links
        return numQuestion({
          q: `La demande du client final augmente de ${demandChange} %. À chaque maillon, la variation est multipliée par ${fmt(factor)}. Quelle variation arrive chez le fournisseur après ${links} maillons ?`,
          answer: final,
          unit: "%",
          digits: 1,
          explain: `${demandChange} % × ${fmt(factor)}³ = ${fmt(final, 1)} % : une petite variation devient énorme en remontant la chaîne.`,
          wrong: [demandChange * factor, demandChange * factor * links, demandChange + factor * links, final / 2],
        })
      },
      {
        q: "Comment réduire le délai d'approvisionnement aide-t-il contre le coup de fouet ?",
        choices: ["Il réduit l'incertitude à couvrir", "Il supprime toutes les commandes en cours", "Il augmente la taille des lots commandés", "Il ralentit la remontée des informations"],
        answer: 0,
        explain: "Un délai plus court demande moins de prévisions sur une période incertaine : les commandes sont plus proches de la demande réelle.",
      },
      {
        q: "En quoi une promotion peut-elle aggraver le coup de fouet ?",
        choices: ["Elle crée des pics artificiels", "Elle diminue le nombre de clients du magasin", "Elle supprime le besoin de réapprovisionner", "Elle augmente toujours les prix d'achat"],
        answer: 0,
        explain: "Les clients achètent en masse pendant la promotion puis très peu ensuite : les commandes oscillent bien plus que la consommation réelle.",
      },
    ],
  },

  lessons: [
    {
      id: "saisonnalite",
      title: "Tendance et saisonnalité",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Les composantes d'une série de ventes",
          body: "L'historique de ventes ne varie pas au hasard : il combine un **niveau** de base, une **tendance** (hausse ou baisse durable), une **saisonnalité** (variations qui reviennent chaque année) et de l'**aléa** (le reste, imprévisible).\n\nPrévoir, c'est séparer ces composantes pour projeter celles qui sont stables.",
        },
        {
          type: "list",
          title: "Les quatre composantes",
          items: [
            ["Niveau", "La valeur moyenne autour de laquelle les ventes oscillent."],
            ["Tendance", "Une évolution lente et durable : la demande monte ou baisse année après année."],
            ["Saisonnalité", "Un schéma qui se répète : pic de glaces en été, de jouets en décembre."],
            ["Aléa", "Les écarts imprévisibles : météo, grève, événement ponctuel."],
          ],
        },
        {
          type: "formula",
          title: "L'indice saisonnier",
          formula: "Indice = ventes du mois / moyenne mensuelle",
          legend: [
            ["Indice > 1", "Mois plus fort que la moyenne (pic)."],
            ["Indice < 1", "Mois plus faible que la moyenne (creux)."],
            ["Prévision d'un mois", "Prévision annuelle / 12 × indice du mois."],
          ],
          example: "Moyenne mensuelle 1 000 ; décembre 1 500 → indice 1,5. Pour une prévision annuelle de 12 600 : décembre = 12 600 / 12 × 1,5 = 1 575.",
        },
        {
          type: "list",
          title: "Quelle méthode pour quelle série ?",
          items: [
            ["Moyenne mobile, lissage simple", "Série stable, sans tendance ni saisonnalité."],
            ["Lissage avec tendance (Holt)", "Une tendance claire, sans saisonnalité."],
            ["Holt-Winters", "Tendance et saisonnalité à la fois."],
            ["Régression linéaire", "Pour projeter une tendance régulière."],
          ],
        },
        {
          type: "text",
          title: "Désaisonnaliser",
          body: "Pour voir la **vraie tendance**, on retire l'effet saisonnier : on **divise** les ventes du mois par l'**indice saisonnier**.\n\nExemple : décembre à 1 800 avec un indice de 1,5 donne 1 800 / 1,5 = **1 200** désaisonnalisé. Si ce chiffre est supérieur à celui de l'an dernier, la demande progresse vraiment, au-delà de l'effet de Noël.",
        },
        {
          type: "key",
          points: [
            "Série = niveau + tendance + saisonnalité + aléa.",
            "Indice saisonnier = ventes du mois / moyenne mensuelle.",
            "Prévision saisonnière = prévision annuelle / 12 × indice.",
            "Désaisonnaliser = diviser par l'indice, pour repérer la tendance.",
          ],
        },
      ],
      quiz: [
        () => {
          const avg = int(800, 2000, 100)
          const month = Math.round(avg * (int(60, 180) / 100) / 10) * 10
          return numQuestion({
            q: `La moyenne mensuelle des ventes est de ${fmt(avg)} unités. Un mois donné, les ventes sont de ${fmt(month)} unités. Quel est l'indice saisonnier de ce mois ?`,
            answer: month / avg,
            unit: "",
            digits: 2,
            explain: `Indice = ${fmt(month)} / ${fmt(avg)} = ${fmt(month / avg, 2)}.`,
            wrong: [avg / month, month - avg, (month + avg) / 2, (month / avg) * 1.3],
          })
        },
        () => {
          const annual = int(80, 240) * 100
          const idx = pick([0.6, 0.8, 1.2, 1.4, 1.5, 1.8])
          const forecast = (annual / 12) * idx
          return numQuestion({
            q: `Prévision annuelle : ${fmt(annual)} unités. Indice saisonnier d'un mois : ${fmt(idx, 1)}. Quelle est la prévision de ce mois ?`,
            answer: forecast,
            unit: "unités",
            digits: 0,
            explain: `Prévision du mois = ${fmt(annual)} / 12 × ${fmt(idx, 1)} = ${fmt(forecast, 0)} unités.`,
            wrong: [annual / 12, annual * idx, annual / idx, forecast * 1.3],
          })
        },
        () => {
          const idx = pick([1.25, 1.5, 0.8, 1.2])
          const sales = int(60, 220, 10) * 10
          return numQuestion({
            q: `Les ventes d'un mois sont de ${fmt(sales)} unités et son indice saisonnier est de ${fmt(idx, 2)}. Quelles sont les ventes désaisonnalisées ?`,
            answer: sales / idx,
            unit: "unités",
            digits: 0,
            explain: `Ventes désaisonnalisées = ${fmt(sales)} / ${fmt(idx, 2)} = ${fmt(sales / idx, 0)} unités.`,
            wrong: [sales * idx, sales - idx, sales, sales / idx * 1.2],
          })
        },
        {
          q: "Qu'est-ce que la saisonnalité ?",
          choices: ["Un schéma de ventes qui se répète chaque année", "Une hausse durable de la demande sur dix ans", "Un incident ponctuel et imprévisible", "Le niveau moyen des ventes sur toute la période"],
          answer: 0,
          explain: "La saisonnalité désigne des variations régulières liées à la période de l'année : vacances, saisons, fêtes.",
        },
        {
          q: "Qu'est-ce qu'une tendance ?",
          choices: ["Une évolution lente et durable", "Un pic de ventes qui revient chaque décembre", "Un écart imprévisible lié à la météo", "La moyenne des erreurs de prévision"],
          answer: 0,
          explain: "La tendance est le mouvement de fond de la demande, au-delà des variations saisonnières et des aléas.",
        },
        {
          q: "Quelle méthode convient à une série avec tendance et saisonnalité ?",
          choices: ["Holt-Winters", "La moyenne mobile simple", "Le lissage exponentiel simple", "L'avis d'un seul expert"],
          answer: 0,
          explain: "Holt-Winters modélise à la fois le niveau, la tendance et la saisonnalité ; les méthodes simples ignorent ces deux composantes.",
        },
        {
          q: "Que signifie un indice saisonnier inférieur à 1 ?",
          choices: ["Mois sous la moyenne", "Le mois est plus fort que la moyenne", "Les ventes sont égales à la moyenne", "Il n'y a pas eu de ventes ce mois-ci"],
          answer: 0,
          explain: "Un indice de 0,8 signifie que le mois vend 20 % de moins que la moyenne mensuelle : c'est un mois creux.",
        },
        {
          q: "Pourquoi désaisonnalise-t-on les ventes ?",
          choices: ["Pour repérer la tendance réelle", "Pour supprimer toute variation de la demande", "Pour calculer le prix de vente moyen", "Pour augmenter artificiellement les ventes"],
          answer: 0,
          explain: "Retirer l'effet saisonnier permet de comparer deux mois différents et de voir si la demande progresse réellement.",
        },
      ],
    },

    {
      id: "erreur-biais",
      title: "Mesurer l'erreur de prévision",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "Pourquoi mesurer ses erreurs ?",
          body: "Une prévision est **toujours fausse** : l'important est de savoir **de combien** et **dans quel sens**. Mesurer l'erreur permet de choisir la meilleure méthode, de dimensionner le stock de sécurité et de repérer un problème dans le processus.\n\nIl faut comparer chaque prévision à ce qui s'est réellement vendu, une fois la période terminée.",
        },
        {
          type: "list",
          title: "Les indicateurs d'erreur",
          items: [
            ["Erreur absolue", "L'écart entre réel et prévu, sans le signe : |réel − prévu|."],
            ["MAD", "Erreur absolue moyenne, en unités."],
            ["MAPE", "Erreur absolue moyenne en pourcentage du réel : pratique pour comparer des produits."],
            ["Biais", "Erreur avec son signe, rapportée aux prévisions : positif = prévisions trop optimistes, négatif = trop basses."],
            ["Tracking signal", "Cumul des erreurs divisé par la MAD : alerte quand le biais s'installe."],
          ],
        },
        {
          type: "formula",
          title: "MAPE et biais",
          formula: "MAPE = moyenne de |réel − prévu| / réel × 100",
          legend: [
            ["MAD", "Moyenne de |réel − prévu|, en unités."],
            ["MAPE", "En pourcentage : 10 % signifie qu'on se trompe de 10 % en moyenne."],
            ["Biais (%)", "[ Σ (Prévu − Réalisé) / Σ Prévu ] × 100 : positif = prévisions trop optimistes (surestimation), négatif = trop basses (sous-estimation)."],
          ],
          example: "Réel : 100, 120, 80 ; prévu : 110, 100, 90. Erreurs en %: 10 %, 16,7 %, 12,5 % → MAPE ≈ 13,1 %. Biais = (10 − 20 + 10) / 300 × 100 = 0 %. Autre série : prévu 110, 120, 130 (somme 360) pour un réel de 100, 100, 100 : biais = 60 / 360 × 100 ≈ 16,7 %.",
        },
        {
          type: "text",
          title: "Biais ou bruit ?",
          body: "Un **biais positif** (on prévoit trop) crée du **surstock** ; un **biais négatif** crée des **ruptures**. Un biais est **systématique** : on peut le corriger, par exemple en réduisant toutes les prévisions de 8 %.\n\nLe **bruit** (écarts qui vont dans tous les sens) ne se corrige pas : on le gère avec du **stock de sécurité**. Une prévision peut avoir un biais nul mais une forte erreur : les erreurs se compensent.",
        },
        {
          type: "key",
          points: [
            "Erreur absolue : |réel − prévu| ; MAD en unités ; MAPE en %.",
            "Biais (%) = [Σ (Prévu − Réalisé) / Σ Prévu] × 100 : positif = prévisions trop optimistes.",
            "Un biais se corrige ; le bruit se couvre avec du stock de sécurité.",
            "Un biais nul n'empêche pas une forte erreur.",
          ],
        },
      ],
      quiz: [
        () => {
          const real = [int(80, 150, 10), int(80, 150, 10), int(80, 150, 10)]
          const forecast = real.map((r) => r + int(-20, 20, 5))
          const mape = (real.reduce((s, r, i) => s + Math.abs(r - forecast[i]) / r, 0) / 3) * 100
          return numQuestion({
            q: `Réel : ${real.join(", ")}. Prévu : ${forecast.join(", ")}. Quel est le MAPE, à peu près ?`,
            answer: mape,
            unit: "%",
            digits: 1,
            explain: `On calcule |réel − prévu| / réel pour chaque mois, puis on fait la moyenne : MAPE ≈ ${fmt(mape, 1)} %.`,
            wrong: [mape * 2, mape / 2, mape + 5, Math.abs(real.reduce((s, r) => s + r, 0) - forecast.reduce((s, f) => s + f, 0)) / 3],
          })
        },
        () => {
          const real = [int(80, 150, 10), int(80, 150, 10), int(80, 150, 10), int(80, 150, 10)]
          const forecast = real.map((r) => r + int(-15, 25, 5))
          const mad = real.reduce((s, r, i) => s + Math.abs(r - forecast[i]), 0) / 4
          return numQuestion({
            q: `Réel : ${real.join(", ")}. Prévu : ${forecast.join(", ")}. Quelle est l'erreur absolue moyenne (MAD) ?`,
            answer: mad,
            unit: "unités",
            digits: 1,
            explain: `MAD = moyenne des |réel − prévu| = ${fmt(mad, 1)} unités.`,
            wrong: [mad * 2, mad / 2, mad + 8, mad + 3],
          })
        },
        () => {
          const real = [int(90, 130, 10), int(90, 130, 10), int(90, 130, 10), int(90, 130, 10)]
          const forecast = real.map((r) => r + int(5, 25, 5))
          const sumF = forecast.reduce((s, f) => s + f, 0)
          const sumR = real.reduce((s, r) => s + r, 0)
          const bias = ((sumF - sumR) / sumF) * 100
          return numQuestion({
            q: `Réel : ${real.join(", ")}. Prévu : ${forecast.join(", ")}. Quel est le biais en % (Σ(prévu − réalisé) / Σ prévu × 100) ?`,
            answer: bias,
            unit: "%",
            digits: 1,
            explain: `Σ prévu = ${sumF} ; Σ(prévu − réalisé) = ${sumF - sumR} ; biais = ${sumF - sumR} / ${sumF} × 100 = ${fmt(bias, 1)} % : positif, prévisions trop optimistes.`,
            wrong: [(sumF - sumR) / sumR * 100, -bias, bias * 2, bias / 2],
          })
        },
        {
          q: "Un biais positif signifie…",
          choices: ["Prévisions trop optimistes", "Que les prévisions sont trop basses", "Que les erreurs se compensent toujours", "Que la prévision est parfaite"],
          answer: 0,
          explain: "Biais = Σ(Prévu − Réalisé) / Σ Prévu × 100. Positif : on prévoit plus que ce qui se vend (surestimation), avec un risque de surstock.",
        },
        {
          q: "Que risque-t-on avec une sous-prévision systématique ?",
          choices: ["Des ruptures de stock", "Un surstock important", "Une baisse du délai fournisseur", "Un meilleur taux de service"],
          answer: 0,
          explain: "Si on prévoit trop peu, on commande trop peu : le stock manque et le service client se dégrade.",
        },
        {
          q: "Pourquoi utilise-t-on le MAPE plutôt que la MAD pour comparer deux produits ?",
          choices: ["Il s'exprime en pourcentage", "Il est toujours plus petit que la MAD", "Il ne dépend pas des données réelles", "Il supprime le biais de la prévision"],
          answer: 0,
          explain: "Une erreur de 50 unités n'a pas la même importance sur 100 ou sur 10 000 unités : le pourcentage rend les produits comparables.",
        },
        {
          q: "Que peut-on faire d'un biais constant ?",
          choices: ["Le corriger en ajustant les prévisions", "Le couvrir uniquement avec du stock de sécurité", "L'ignorer, car il se compense tout seul", "Le multiplier par le délai fournisseur"],
          answer: 0,
          explain: "Un biais est systématique : on peut le corriger en recalant la méthode ou les prévisions. Le bruit, lui, se couvre avec du stock de sécurité.",
        },
        {
          q: "Une prévision peut-elle avoir un biais nul avec une forte erreur ?",
          choices: ["Oui, si les écarts se compensent", "Non, un biais nul signifie zéro erreur", "Oui, mais seulement avec un lissage exponentiel", "Non, un biais ne dépend jamais du signe des erreurs"],
          answer: 0,
          explain: "Le biais additionne des erreurs signées : +10 et −10 donnent un biais nul alors que l'erreur absolue est de 10 à chaque fois.",
        },
      ],
    },

    {
      id: "sop",
      title: "Le S&OP et le plan industriel et commercial",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "Aligner ventes et opérations",
          body: "Le **S&OP** (Sales & Operations Planning), appelé en France **PIC** (Plan Industriel et Commercial), est un **processus mensuel** qui met d'accord les **ventes**, la **production**, les **achats**, la **logistique** et la **finance** sur un même plan.\n\nSans lui, chaque service avance avec ses propres chiffres : les commerciaux promettent, l'usine ne suit pas, les stocks s'envolent ou manquent.",
        },
        {
          type: "list",
          title: "Les étapes d'un cycle mensuel (exemple)",
          items: [
            ["1. Prévision statistique", "Le planificateur produit une première prévision à partir de l'historique."],
            ["2. Revue de la demande", "Ventes et marketing l'ajustent avec ce qu'ils savent : promotions, nouveaux clients."],
            ["3. Revue de l'offre", "Production, achats et logistique vérifient les capacités : usines, fournisseurs, stocks."],
            ["4. Pré-S&OP", "On résout les écarts entre demande et capacité, avec des scénarios chiffrés."],
            ["5. Réunion de décision", "La direction tranche les arbitrages qui restent et valide le plan."],
          ],
        },
        {
          type: "list",
          title: "Les arbitrages fréquents",
          items: [
            ["Stock ou service", "Plus de stock protège les ventes, mais coûte de l'argent."],
            ["Heures supplémentaires ou sous-traitance", "Comment absorber un pic de demande ?"],
            ["Lisser ou suivre la demande", "Produire régulièrement ou coller aux variations."],
            ["Promotions et capacité", "Une promotion n'a de sens que si on peut la servir."],
          ],
        },
        {
          type: "text",
          title: "Un horizon à moyen terme",
          body: "Le S&OP travaille sur **12 à 24 mois**, par **familles de produits** et en **volumes et en valeur** (chiffre d'affaires, coûts). Il donne le cadre dans lequel se décide ensuite le plan détaillé par article, le **PDP** (plan directeur de production), que tu étudieras avec la production.\n\nL'objectif n'est pas la prévision parfaite, mais **un plan unique** accepté par tous, et des décisions prises à temps.",
        },
        {
          type: "key",
          points: [
            "S&OP (PIC en France) : processus mensuel d'alignement ventes, production, achats, finance.",
            "Cycle : prévision, revue demande, revue offre, pré-S&OP, décision.",
            "Il arbitre entre stock, service, capacité et coûts.",
            "Il travaille à 12-24 mois, par familles, avant le plan détaillé (PDP).",
          ],
        },
      ],
      quiz: [
        () => {
          const demand = int(80, 200, 5) * 100
          const capacity = Math.round(demand * (int(75, 95) / 100) / 100) * 100
          return numQuestion({
            q: `La demande prévue est de ${fmt(demand)} unités par mois, mais la capacité de production n'est que de ${fmt(capacity)}. Quel est l'écart à combler (par stock, heures supplémentaires ou sous-traitance) ?`,
            answer: demand - capacity,
            unit: "unités",
            digits: 0,
            explain: `Écart = demande − capacité = ${fmt(demand)} − ${fmt(capacity)} = ${fmt(demand - capacity)} unités à absorber.`,
            wrong: [demand + capacity, capacity, demand / capacity, (demand - capacity) * 2],
          })
        },
        {
          q: "Que signifie PIC en France ?",
          choices: ["Plan Industriel et Commercial", "Plan d'Investissement Central", "Prévision d'Inventaire Continue", "Planification des Importations et Contrats"],
          answer: 0,
          explain: "Le PIC est le nom français du S&OP : il aligne le plan industriel (production, achats) et le plan commercial (ventes).",
        },
        {
          q: "Pourquoi organise-t-on un S&OP chaque mois ?",
          choices: ["Aligner ventes, production et finance", "Remplacer toutes les prévisions par des estimations", "Choisir la couleur des emballages du trimestre", "Fixer le prix d'achat de chaque matière première"],
          answer: 0,
          explain: "Chaque mois, les informations changent (ventes, capacités, promotions) : le S&OP remet tout le monde d'accord sur un plan.",
        },
        {
          q: "Qui ajuste la prévision statistique lors de la revue de la demande ?",
          choices: ["Les ventes et le marketing", "Les caristes de l'entrepôt", "Le service de paie", "Les transporteurs"],
          answer: 0,
          explain: "Les ventes et le marketing connaissent les promotions, les nouveaux clients et les projets : ils enrichissent la prévision statistique.",
        },
        {
          q: "Que vérifie la revue de l'offre ?",
          choices: ["Les capacités de l'offre", "Le nombre de clients du service commercial", "Le prix de vente des concurrents", "Les décisions de la direction"],
          answer: 0,
          explain: "La revue de l'offre vérifie si l'entreprise peut produire et livrer ce qui est demandé : usines, fournisseurs, logistique, stocks.",
        },
        {
          q: "Quel arbitrage est typique d'un S&OP ?",
          choices: ["Heures sup ou sous-traitance", "Choix du nom d'un produit", "Calcul du salaire de chaque employé", "Décoration des locaux de l'usine"],
          answer: 0,
          explain: "Quand la demande dépasse la capacité, on choisit comment la couvrir : heures supplémentaires, sous-traitance, stock anticipé ou limitation des ventes.",
        },
        {
          q: "À quel horizon travaille généralement le S&OP ?",
          choices: ["12 à 24 mois", "Quelques heures", "Une seule semaine", "Plus de dix ans"],
          answer: 0,
          explain: "Le S&OP est un plan à moyen terme, assez long pour ajuster capacités et approvisionnements, assez court pour rester fiable.",
        },
        {
          q: "Quel est le but principal du S&OP ?",
          choices: ["Un plan unique partagé", "Une prévision statistique parfaite", "La suppression de tous les stocks", "La réduction du nombre de clients"],
          answer: 0,
          explain: "Une prévision parfaite n'existe pas : l'enjeu est que ventes, opérations et finance travaillent sur le même plan et décident à temps.",
        },
      ],
    },

    {
      id: "collaboration",
      title: "Collaborer avec clients et fournisseurs",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Partager l'information",
          body: "L'effet coup de fouet vient en grande partie d'un **manque d'information** : chaque maillon devine la demande. La solution est la **collaboration** : partager les données de vente, de stock et de prévision avec ses clients et ses fournisseurs.\n\nPlus l'information circule vite et loin, moins les prévisions s'écartent de la réalité.",
        },
        {
          type: "list",
          title: "Les approches de collaboration",
          items: [
            ["Partage des ventes réelles", "Le client envoie ses sorties de caisse (sell-out) à son fournisseur."],
            ["GPA / VMI", "Le fournisseur gère le stock chez son client."],
            ["CPFR", "Planification, prévision et réapprovisionnement collaboratifs."],
            ["Portails et EDI", "Échange automatique des commandes, prévisions et stocks."],
            ["Kanban fournisseur", "Un signal de réapprovisionnement envoyé quand un bac se vide."],
          ],
        },
        {
          type: "list",
          title: "La GPA (gestion partagée des approvisionnements)",
          items: [
            ["Principe", "Le fournisseur surveille le stock de son client et décide des réapprovisionnements."],
            ["Données échangées", "Ventes et niveaux de stock du client."],
            ["Avantages", "Moins de ruptures, moins de stock global, commandes plus régulières."],
            ["Limites", "Demande de la confiance et des systèmes compatibles ; le fournisseur prend des responsabilités."],
          ],
        },
        {
          type: "text",
          title: "Le CPFR",
          body: "Le **CPFR** (Collaborative Planning, Forecasting and Replenishment) va plus loin : client et fournisseur **construisent ensemble** leurs prévisions et leurs plans de réapprovisionnement.\n\nIls s'accordent sur un **plan commun**, une **prévision conjointe** (avec les promotions, les lancements), puis suivent **ensemble** les écarts et corrigent. Il est surtout utilisé entre grands industriels et distributeurs.",
        },
        {
          type: "list",
          title: "Les conditions de réussite",
          items: [
            ["Confiance", "Chacun partage des informations sensibles."],
            ["Données fiables", "Un partage de mauvaises données n'aide personne."],
            ["Indicateurs communs", "On suit les mêmes mesures : taux de service, erreur de prévision."],
            ["Partage des gains", "Les bénéfices (moins de stock, plus de ventes) profitent aux deux parties."],
          ],
        },
        {
          type: "key",
          points: [
            "Partager l'information réduit l'effet coup de fouet.",
            "GPA (VMI) : le fournisseur gère le stock chez le client.",
            "CPFR : prévisions et plans de réapprovisionnement construits ensemble.",
            "Réussite : confiance, données fiables, indicateurs communs, gains partagés.",
          ],
        },
      ],
      quiz: [
        {
          q: "Que signifie GPA (VMI en anglais) ?",
          choices: ["Gestion partagée des approvisionnements", "Grand plan d'achat", "Garantie produit assurée", "Gestion des prix annuels"],
          answer: 0,
          explain: "Avec la GPA, le fournisseur gère lui-même le réapprovisionnement du stock de son client, à partir des ventes et des stocks partagés.",
        },
        {
          q: "Que partage un client avec son fournisseur dans une démarche de collaboration ?",
          choices: ["Ventes réelles et stocks", "Ses salaires et ses marges internes", "Ses brevets non publiés", "Ses plans de recrutement"],
          answer: 0,
          explain: "Les ventes réelles (sell-out) et les stocks permettent au fournisseur de réagir à la vraie demande, pas aux commandes déformées.",
        },
        {
          q: "Que signifie CPFR ?",
          choices: ["Planification et prévision collaboratives", "Contrôle des paiements et factures reçues", "Calcul prévisionnel des frais de route", "Centre de production des fournisseurs régionaux"],
          answer: 0,
          explain: "CPFR (Collaborative Planning, Forecasting and Replenishment) : client et fournisseur construisent ensemble prévisions et plans d'approvisionnement.",
        },
        {
          q: "Quel est un avantage de la GPA pour le client ?",
          choices: ["Moins de ruptures", "L'absence totale de stock chez lui", "La fin des paiements au fournisseur", "L'arrêt de toute prévision de ventes"],
          answer: 0,
          explain: "Le fournisseur surveille le stock et réapprovisionne à temps : le client a moins de ruptures et moins de travail de gestion.",
        },
        {
          q: "Quelle est une limite de la collaboration ?",
          choices: ["Elle exige de la confiance", "Elle supprime tous les contrats", "Elle augmente toujours l'effet coup de fouet", "Elle interdit de partager des données"],
          answer: 0,
          explain: "Partager des données sensibles demande de la confiance, des règles claires et des outils capables d'échanger l'information.",
        },
        {
          q: "Pourquoi les indicateurs doivent-ils être communs ?",
          choices: ["Pour mesurer la même chose", "Pour cacher certaines informations à l'autre", "Pour supprimer la phase de planification", "Pour augmenter le nombre de réunions"],
          answer: 0,
          explain: "Avec des indicateurs communs (taux de service, erreur de prévision), les discussions portent sur des faits partagés.",
        },
        {
          q: "Que fait un portail fournisseur ou un EDI ?",
          choices: ["Échange automatiquement les données", "Imprime les étiquettes de transport", "Recrute de nouveaux fournisseurs", "Gère les paies des équipes"],
          answer: 0,
          explain: "L'échange de données informatisé (EDI) ou les portails transmettent les informations sans ressaisie : plus rapide et plus fiable.",
        },
        {
          q: "Comment la collaboration réduit-elle l'effet coup de fouet ?",
          choices: ["Chaque maillon voit la vraie demande du client final", "Chaque maillon augmente ses commandes par précaution", "Chaque maillon cache ses stocks aux autres", "Chaque maillon réduit sa fréquence de livraison"],
          answer: 0,
          explain: "Quand la demande réelle est visible de tous, les commandes ne sont plus déformées par les réactions en chaîne.",
        },
      ],
    },
  ],
}
