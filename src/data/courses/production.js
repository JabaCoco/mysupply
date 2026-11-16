// Lot 7 — Nouveau module : Production et planification (6 leçons).
import { fmt, int, numQuestion, pick } from '../gen.js'

export default {
  id: "production",
  title: "Production et planification",
  short: "Production",
  icon: "factory",
  color: "lime",
  lessons: [
    {
      id: "pdp",
      title: "Le plan directeur de production (PDP)",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "Du plan global au plan détaillé",
          body: "Le **PDP** (plan directeur de production) indique **quels produits finis fabriquer, en quelle quantité et à quelle date**. Il découle du plan à long terme (le PIC, par familles de produits) et nourrit le calcul des besoins en composants (le MRP).\n\nHiérarchie : **PIC** (familles, mois) → **PDP** (articles, semaines) → **MRP** (composants, semaines) → **ordonnancement** (machines, heures).",
        },
        {
          type: "list",
          title: "Ce qui entre et ce qui sort",
          items: [
            ["Entrées", "Prévisions de vente, commandes fermes des clients, stocks, capacités de production."],
            ["Sorties", "Quantités à produire par article et par période, avec les dates de fin."],
            ["Stock projeté", "Le stock attendu à la fin de chaque période, selon le plan : il montre où le plan sera à court."],
          ],
        },
        {
          type: "formula",
          title: "Le stock projeté",
          formula: "Stock projeté (t) = stock (t−1) + production (t) − demande retenue (t)",
          legend: [
            ["Demande retenue", "La plus grande valeur entre la prévision et les commandes fermes de la période."],
            ["Production", "Les quantités du PDP, à décider pour que le stock projeté ne passe pas sous zéro."],
          ],
          example: "Stock initial 50 ; semaine 1 : prévision 40, commandes 55 → demande retenue 55. Production prévue 60 → stock projeté = 50 + 60 − 55 = 55.",
        },
        {
          type: "list",
          title: "Les zones de temps",
          items: [
            ["Zone gelée", "Très proche : on ne modifie plus le plan, la production est lancée."],
            ["Zone ferme", "Modifications possibles seulement avec l'accord des responsables."],
            ["Zone libre", "Plus lointaine : le plan peut être ajusté librement."],
          ],
        },
        {
          type: "text",
          title: "Promettre une date au client : l'ATP",
          body: "L'**ATP** (Available To Promise, quantité disponible à la promesse) est la quantité que l'on peut **promettre à un nouveau client** sans compromettre les commandes déjà acceptées.\n\nATP = stock projeté disponible − commandes déjà promises. Si un client demande 40 unités pour la semaine 3 et que l'ATP vaut 25, on ne peut en promettre que 25 : le reste sera livré plus tard.",
        },
        {
          type: "key",
          points: [
            "PIC → PDP → MRP → ordonnancement : du plus global au plus détaillé.",
            "Stock projeté = stock précédent + production − demande retenue.",
            "Zones : gelée, ferme, libre selon la proximité de la date.",
            "L'ATP sert à promettre un délai fiable à un nouveau client.",
          ],
        },
      ],
      quiz: [
        () => {
          const stock = int(20, 80, 5)
          const forecast = int(30, 70, 5)
          const orders = int(30, 80, 5)
          const prod = int(40, 100, 5)
          const retained = Math.max(forecast, orders)
          return numQuestion({
            q: `Stock initial ${stock}. Semaine 1 : prévision ${forecast}, commandes fermes ${orders}, production prévue ${prod}. Quel est le stock projeté en fin de semaine (demande retenue = la plus grande valeur) ?`,
            answer: stock + prod - retained,
            unit: "unités",
            digits: 0,
            explain: `Demande retenue = max(${forecast} ; ${orders}) = ${retained}. Stock projeté = ${stock} + ${prod} − ${retained} = ${stock + prod - retained}.`,
            wrong: [stock + prod - Math.min(forecast, orders), stock + prod, stock - retained, stock + prod + retained],
          })
        },
        () => {
          const projected = int(40, 120, 5)
          const promised = int(10, 40, 5)
          return numQuestion({
            q: `Le stock projeté disponible en semaine 3 est de ${projected} unités, dont ${promised} sont déjà promises à d'autres clients. Quel est l'ATP de cette semaine ?`,
            answer: projected - promised,
            unit: "unités",
            digits: 0,
            explain: `ATP = ${projected} − ${promised} = ${projected - promised} unités que l'on peut promettre à un nouveau client.`,
            wrong: [projected, projected + promised, promised, projected - promised * 2],
          })
        },
        {
          q: "Que précise le PDP ?",
          choices: ["Les produits finis à fabriquer, par quantité et par date", "Les salaires et les primes des équipes de production", "Le prix de vente des produits proposés aux clients", "Le choix des fournisseurs de matières premières et de leurs contrats"],
          answer: 0,
          explain: "Le PDP est le plan détaillé des produits finis à fabriquer : il traduit le plan à moyen terme en quantités et dates précises.",
        },
        {
          q: "Quel est le rôle de la zone gelée du PDP ?",
          choices: ["Stabiliser le plan proche, déjà lancé en production", "Réserver des produits pour les clients les plus importants", "Stocker les produits finis à basse température", "Annuler automatiquement toutes les commandes en retard"],
          answer: 0,
          explain: "Modifier un plan trop proche de la date de production désorganise tout : la zone gelée protège les opérations déjà engagées.",
        },
        {
          q: "Que représente le stock projeté ?",
          choices: ["Le stock attendu à la fin de chaque période selon le plan", "Le stock compté lors du dernier inventaire annuel physique", "Le stock maximal autorisé dans tout l'entrepôt central", "Le stock de sécurité fixé librement par le fournisseur"],
          answer: 0,
          explain: "Le stock projeté simule l'évolution du stock : s'il devient négatif, le plan de production est insuffisant pour la période.",
        },
        {
          q: "Que signifie ATP ?",
          choices: ["Quantité disponible à la promesse", "Approvisionnement total prévu des fournisseurs", "Analyse du temps de production moyen", "Accord de transport préalable du client"],
          answer: 0,
          explain: "L'ATP (Available To Promise) indique ce que l'on peut promettre à un nouveau client sans toucher aux commandes déjà acceptées.",
        },
        {
          q: "Dans quel ordre vont les niveaux de planification, du plus global au plus détaillé ?",
          choices: ["PIC, PDP, MRP, ordonnancement", "MRP, PIC, ordonnancement, PDP", "Ordonnancement, MRP, PDP, PIC", "PDP, PIC, ordonnancement, MRP"],
          answer: 0,
          explain: "On part du plan global par familles (PIC), puis par articles (PDP), puis par composants (MRP), jusqu'au détail des machines (ordonnancement).",
        },
        {
          q: "Pourquoi retient-on la plus grande valeur entre prévision et commandes fermes ?",
          choices: ["Pour ne pas sous-estimer la demande quand les commandes sont déjà là", "Pour toujours produire beaucoup plus que nécessaire chaque semaine", "Pour ignorer complètement les commandes fermes des clients", "Pour réduire systématiquement le stock projeté à zéro"],
          answer: 0,
          explain: "Si les commandes fermes dépassent la prévision, la demande réelle est supérieure : le plan doit en tenir compte.",
        },
      ],
    },

    {
      id: "nomenclatures",
      title: "Les nomenclatures",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "La recette du produit",
          body: "Une **nomenclature** (BOM, Bill Of Materials) liste les **composants** et leurs **quantités** nécessaires pour fabriquer **une unité** d'un produit. Elle est structurée en **arbre** : le produit fini (niveau 0), puis ses sous-ensembles, puis les composants et matières premières.\n\nC'est la base du calcul des besoins : sans nomenclature fiable, impossible de savoir quoi acheter.",
        },
        {
          type: "list",
          title: "Le vocabulaire",
          items: [
            ["Parent et enfant", "Le parent est l'ensemble (une roue), l'enfant est un de ses composants (une jante)."],
            ["Coefficient", "La quantité d'un composant nécessaire pour une unité de son parent."],
            ["Niveau", "La profondeur dans l'arbre : produit fini = 0, ses composants = 1, etc."],
            ["Article acheté ou fabriqué", "Un composant est soit acheté à un fournisseur, soit fabriqué en interne."],
          ],
        },
        {
          type: "example",
          title: "Exemple : un vélo",
          body: "Un **vélo** comprend 1 cadre, 2 roues, 1 guidon et 1 selle. Chaque **roue** comprend 1 jante, 36 rayons et 1 pneu.\n\nPour fabriquer **100 vélos** : 100 cadres, 100 guidons, 100 selles, **200 roues**, donc 200 jantes, 200 pneus et **7 200 rayons** (200 × 36).",
        },
        {
          type: "formula",
          title: "L'éclatement de la nomenclature",
          formula: "Besoin brut d'un composant = quantité du parent × coefficient",
          legend: [
            ["Coefficient", "Quantité du composant par unité de parent."],
            ["Cumul", "Si un composant est utilisé dans plusieurs parents, on additionne les besoins."],
          ],
          example: "200 roues × 36 rayons par roue = 7 200 rayons.",
        },
        {
          type: "list",
          title: "Nomenclature et gamme",
          items: [
            ["Nomenclature", "Dit QUOI : les composants et les quantités."],
            ["Gamme", "Dit COMMENT : les opérations, les postes de travail et les temps."],
            ["Ensemble", "La nomenclature et la gamme permettent de calculer à la fois les besoins en matières et les charges des machines."],
          ],
        },
        {
          type: "key",
          points: [
            "Nomenclature = composants et quantités pour une unité de produit, en arbre.",
            "Besoin brut = quantité du parent × coefficient ; on cumule si plusieurs parents.",
            "Nomenclature = quoi ; gamme = comment (opérations, temps).",
          ],
        },
      ],
      quiz: [
        () => {
          const bikes = int(50, 400, 10)
          const spokes = pick([32, 36])
          return numQuestion({
            q: `Un vélo a 2 roues et chaque roue a ${spokes} rayons. Combien de rayons faut-il pour fabriquer ${bikes} vélos ?`,
            answer: bikes * 2 * spokes,
            unit: "rayons",
            digits: 0,
            explain: `${bikes} vélos × 2 roues = ${bikes * 2} roues ; ${bikes * 2} × ${spokes} rayons = ${fmt(bikes * 2 * spokes, 0)} rayons.`,
            wrong: [bikes * spokes, bikes * 2, bikes + 2 * spokes, bikes * 2 * spokes * 2],
          })
        },
        () => {
          const chairs = int(20, 200, 10)
          const legsPerChair = 4
          const tablesNeeded = int(5, 40, 5)
          const legsPerTable = 4
          const total = chairs * legsPerChair + tablesNeeded * legsPerTable
          return numQuestion({
            q: `Une chaise utilise ${legsPerChair} pieds identiques et une table aussi ${legsPerTable}. Pour fabriquer ${chairs} chaises et ${tablesNeeded} tables, combien de pieds faut-il au total ?`,
            answer: total,
            unit: "pieds",
            digits: 0,
            explain: `Besoin cumulé = ${chairs} × ${legsPerChair} + ${tablesNeeded} × ${legsPerTable} = ${chairs * legsPerChair} + ${tablesNeeded * legsPerTable} = ${total} pieds.`,
            wrong: [chairs * legsPerChair, tablesNeeded * legsPerTable, chairs + tablesNeeded, total + 4],
          })
        },
        {
          q: "Que contient une nomenclature ?",
          choices: ["Les composants et leurs quantités pour une unité", "Les opérations, les postes de travail et leurs temps standards", "Le prix de vente conseillé du produit fini au client", "La liste complète des clients qui achètent le produit"],
          answer: 0,
          explain: "La nomenclature dit de quoi est fait un produit et en quelle quantité ; les opérations et les temps sont dans la gamme.",
        },
        {
          q: "Qu'appelle-t-on le niveau 0 d'une nomenclature ?",
          choices: ["Le produit fini", "Les matières premières", "Les sous-ensembles", "Les emballages"],
          answer: 0,
          explain: "Le niveau 0 est le sommet de l'arbre : le produit fini. Ses composants directs sont au niveau 1, et ainsi de suite.",
        },
        {
          q: "Que représente le coefficient d'un composant ?",
          choices: ["La quantité nécessaire pour une unité du parent", "Le prix d'achat unitaire négocié du composant", "Le délai de livraison moyen du fournisseur", "Le poids total du produit fini emballé"],
          answer: 0,
          explain: "Le coefficient (ou quantité liée) permet de passer du besoin du parent au besoin du composant par simple multiplication.",
        },
        {
          q: "Que dit la gamme d'un produit ?",
          choices: ["Les opérations, les postes de travail et les temps", "La liste des composants et matières du produit fini", "Le stock de sécurité à conserver en magasin", "Le plan de transport routier vers tous les clients"],
          answer: 0,
          explain: "La gamme décrit le « comment » : les opérations successives, les machines utilisées et le temps de chacune.",
        },
        {
          q: "Que fait-on si un composant est utilisé dans plusieurs produits ?",
          choices: ["On additionne les besoins de chaque produit", "On ne garde que le plus grand besoin parmi les produits", "On calcule simplement la moyenne des besoins des produits", "On l'ignore dans le calcul des besoins du produit"],
          answer: 0,
          explain: "Le besoin brut total d'un composant est la somme des besoins de tous les parents qui l'utilisent.",
        },
        {
          q: "Pourquoi la fiabilité de la nomenclature est-elle essentielle ?",
          choices: ["Une erreur fausse tous les besoins calculés", "Elle fixe automatiquement le prix de vente du produit", "Elle remplace entièrement le plan de production annuel", "Elle détermine la couleur et la forme des emballages"],
          answer: 0,
          explain: "Si un coefficient est faux, le MRP commande trop ou trop peu de composants : ruptures de production ou surstock.",
        },
      ],
    },

    {
      id: "mrp",
      title: "Le calcul des besoins (MRP)",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "Quoi, combien, quand ?",
          body: "Le **MRP** (Material Requirements Planning) calcule, à partir du PDP et des nomenclatures, **quels composants commander ou fabriquer, en quelle quantité et à quelle date**.\n\nIl compare ce qui est nécessaire avec ce qu'on a déjà (stock et commandes en cours), et décale le lancement des ordres du **délai** d'approvisionnement ou de fabrication.",
        },
        {
          type: "list",
          title: "Les données du MRP",
          items: [
            ["PDP", "Les besoins en produits finis, par période."],
            ["Nomenclatures", "Les composants et leurs coefficients."],
            ["Stocks", "Les quantités disponibles."],
            ["Réceptions prévues", "Les commandes déjà passées, qui arriveront à une date connue."],
            ["Délais et règles de lot", "Durée d'obtention, quantité minimale ou multiple de commande."],
          ],
        },
        {
          type: "formula",
          title: "Le besoin net",
          formula: "Besoin net = max(0 ; besoin brut − stock disponible − réceptions prévues)",
          legend: [
            ["Besoin brut", "La quantité nécessaire dans la période."],
            ["Stock disponible", "Le stock projeté en début de période."],
            ["Lancement", "Semaine de lancement = semaine du besoin − délai ; quantité = besoin net arrondi au lot."],
          ],
          example: "Besoin brut 90, stock 30, réception 20 → besoin net = 90 − 30 − 20 = 40. Lot minimal 25, délai 2 semaines : on lance 50 (2 lots de 25) deux semaines plus tôt.",
        },
        {
          type: "example",
          title: "Exemple sur 4 semaines",
          body: "Stock initial **45**. Besoins bruts : **20, 30, 10, 40**. Réception de **15** en semaine 2.\n\n• S1 : 45 − 20 = **25**\n• S2 : 25 + 15 − 30 = **10**\n• S3 : 10 − 10 = **0**\n• S4 : 0 − 40 = **−40** → **besoin net de 40**\n\nAvec un lot de 50 et un délai de 2 semaines, on **lance 50 en semaine 2**.",
        },
        {
          type: "list",
          title: "Les limites du MRP",
          items: [
            ["Capacité", "Le MRP de base suppose que les machines et les personnes suffisent : il faut ensuite vérifier la charge."],
            ["Qualité des données", "Nomenclatures, stocks, délais : une donnée fausse fausse tout le plan."],
            ["Nervosité", "De petits changements de la demande modifient beaucoup d'ordres."],
          ],
        },
        {
          type: "key",
          points: [
            "MRP : calcule quoi, combien et quand lancer, à partir du PDP et des nomenclatures.",
            "Besoin net = max(0 ; brut − stock − réceptions prévues).",
            "Semaine de lancement = semaine du besoin − délai ; quantité arrondie au lot.",
            "Il faut ensuite vérifier la capacité et la fiabilité des données.",
          ],
        },
      ],
      quiz: [
        () => {
          const stock = int(10, 50, 5)
          const receipt = int(0, 40, 10)
          const gross = stock + receipt + int(20, 100, 10)
          return numQuestion({
            q: `Besoin brut ${gross}, stock disponible ${stock}, réception prévue ${receipt}. Quel est le besoin net ?`,
            answer: gross - stock - receipt,
            unit: "unités",
            digits: 0,
            explain: `Besoin net = ${gross} − ${stock} − ${receipt} = ${gross - stock - receipt} unités.`,
            wrong: [gross - stock, gross, gross - receipt, gross + stock + receipt],
          })
        },
        () => {
          const lot = pick([25, 50, 100])
          let net = int(20, 260, 10)
          if (net % lot === 0) net += 10
          const order = Math.ceil(net / lot) * lot
          return numQuestion({
            q: `Le besoin net est de ${net} unités et l'article se commande par multiples de ${lot}. Quelle quantité lances-tu ?`,
            answer: order,
            unit: "unités",
            digits: 0,
            explain: `${net} / ${lot} = ${fmt(net / lot, 1)} lots : on arrondit au lot supérieur, soit ${order / lot} × ${lot} = ${order} unités.`,
            wrong: [net, order + lot, order - lot, Math.floor(net / lot) * lot],
          })
        },
        () => {
          const need = int(5, 12)
          const lead = int(1, 4)
          return numQuestion({
            q: `Le besoin net apparaît en semaine ${need}. Le délai d'approvisionnement est de ${lead} semaine${lead > 1 ? "s" : ""}. En quelle semaine faut-il lancer la commande ?`,
            answer: need - lead,
            unit: "",
            digits: 0,
            explain: `Semaine de lancement = ${need} − ${lead} = ${need - lead} : il faut commander ${lead} semaine${lead > 1 ? "s" : ""} avant le besoin.`,
            wrong: [need, need + lead, need - lead - 1, need - lead + 1],
          })
        },
        {
          q: "À quoi sert le MRP ?",
          choices: ["Calculer quoi commander ou fabriquer, en quelle quantité et quand", "Fixer le prix de vente des produits finis du catalogue", "Choisir les transporteurs et les tarifs de l'entreprise", "Mesurer la satisfaction des clients après la livraison"],
          answer: 0,
          explain: "Le MRP transforme les besoins en produits finis en besoins de composants, avec des quantités et des dates de lancement.",
        },
        {
          q: "Pourquoi décale-t-on le lancement du délai ?",
          choices: ["Pour que le composant arrive quand on en a besoin", "Pour commander toujours beaucoup plus que nécessaire, par sécurité", "Pour éviter définitivement de calculer le besoin net", "Pour retarder volontairement la production des produits finis"],
          answer: 0,
          explain: "Si un composant met 2 semaines à arriver, il faut le commander 2 semaines avant la date où on en a besoin.",
        },
        {
          q: "Quelle est une limite du MRP de base ?",
          choices: ["Il ne vérifie pas que la capacité est suffisante", "Il ne connaît pas les nomenclatures des produits", "Il ignore totalement le stock disponible en magasin", "Il ne calcule aucune date de lancement des ordres"],
          answer: 0,
          explain: "Le MRP de base calcule des quantités et des dates sans vérifier les capacités : un contrôle de charge doit suivre.",
        },
        {
          q: "Que contiennent les « réceptions prévues » ?",
          choices: ["Les commandes déjà passées qui arriveront bientôt", "Les ventes prévues pour tout le mois prochain", "Les stocks de sécurité à reconstituer en urgence", "Les retours de clients insatisfaits de la qualité"],
          answer: 0,
          explain: "Ce sont les commandes en cours : elles réduisent le besoin net, car la marchandise arrive déjà.",
        },
        {
          q: "Que se passe-t-il si une donnée de stock est fausse dans le MRP ?",
          choices: ["Les besoins calculés sont faux : ruptures ou surstocks", "Rien : le MRP corrige toujours automatiquement les erreurs de données", "Les dates de lancement des ordres deviennent aléatoires", "Le plan de production est automatiquement annulé"],
          answer: 0,
          explain: "Le MRP fait confiance à ses données : un stock surestimé fait commander trop peu, un stock sous-estimé fait commander trop.",
        },
      ],
    },

    {
      id: "charge",
      title: "Charge et capacité",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Peut-on vraiment le produire ?",
          body: "Un plan de production n'a de sens que si les **machines** et les **personnes** peuvent le réaliser. On compare donc la **charge** (le travail à faire) à la **capacité** (le travail possible).\n\nUne charge supérieure à la capacité provoque des retards ; une charge très inférieure laisse des ressources inutilisées.",
        },
        {
          type: "formula",
          title: "Charge, capacité et taux de charge",
          formula: "Taux de charge = charge / capacité × 100",
          legend: [
            ["Charge (h)", "Quantité × temps unitaire (+ temps de réglage)."],
            ["Capacité (h)", "Postes × heures par poste × taux de disponibilité."],
            ["Taux de charge", "Au-dessus de 100 %, le plan est irréalisable tel quel."],
          ],
          example: "4 000 pièces × 3 min = 200 h de charge. Capacité : 2 machines × 8 h × 5 jours × 90 % = 72 h par semaine. Taux = 200 / 72 = 278 % : il faut environ 2,8 semaines.",
        },
        {
          type: "list",
          title: "Lire un taux de charge",
          items: [
            ["Moins de 85 %", "Marge confortable pour les aléas, mais ressources peu utilisées."],
            ["85 % à 100 %", "Zone tendue : le moindre incident crée du retard."],
            ["Plus de 100 %", "Surcharge : il faut agir."],
          ],
        },
        {
          type: "list",
          title: "Que faire en cas de surcharge ?",
          items: [
            ["Augmenter la capacité", "Heures supplémentaires, deuxième équipe, machine supplémentaire."],
            ["Externaliser", "Confier une partie à un sous-traitant."],
            ["Lisser la charge", "Avancer ou reculer des ordres, répartir sur d'autres semaines."],
            ["Réduire la charge", "Améliorer les temps (réglages, méthodes) ou limiter les engagements."],
          ],
        },
        {
          type: "text",
          title: "Le goulot",
          body: "Le **goulot d'étranglement** est la ressource la moins capable de toute la chaîne : c'est lui qui **limite le débit de l'usine**. Perdre une heure sur le goulot, c'est perdre une heure de production de toute l'usine.\n\nOn protège donc le goulot (jamais d'arrêt faute de matière) et on adapte le rythme des autres postes au sien : c'est l'idée de la **théorie des contraintes**.",
        },
        {
          type: "key",
          points: [
            "Taux de charge = charge / capacité ; au-dessus de 100 % le plan est irréalisable.",
            "Capacité = postes × heures × taux de disponibilité.",
            "Surcharge : capacité, sous-traitance, lissage ou réduction de la charge.",
            "Le goulot limite le débit de toute l'usine : on le protège.",
          ],
        },
      ],
      quiz: [
        () => {
          const qty = int(500, 5000, 100)
          const min = pick([2, 3, 4, 5])
          return numQuestion({
            q: `Il faut fabriquer ${fmt(qty)} pièces à ${min} minutes par pièce. Quelle est la charge, en heures ?`,
            answer: (qty * min) / 60,
            unit: "heures",
            digits: 1,
            explain: `Charge = ${fmt(qty)} × ${min} minutes = ${fmt(qty * min)} minutes, soit ${fmt((qty * min) / 60, 1)} heures.`,
            wrong: [qty * min, qty / min, (qty * min) / 100, (qty * min) / 60 * 2],
          })
        },
        () => {
          const machines = int(2, 6)
          const hours = pick([7, 8])
          const days = 5
          const avail = pick([85, 90, 95])
          return numQuestion({
            q: `${machines} machines travaillent ${hours} heures par jour, ${days} jours par semaine, avec ${avail} % de disponibilité. Quelle est la capacité hebdomadaire, en heures ?`,
            answer: (machines * hours * days * avail) / 100,
            unit: "heures",
            digits: 1,
            explain: `Capacité = ${machines} × ${hours} × ${days} × ${avail} % = ${fmt((machines * hours * days * avail) / 100, 1)} heures.`,
            wrong: [machines * hours * days, machines * hours * avail / 100, machines * days * avail / 100, (machines * hours * days * avail) / 100 * 1.2],
          })
        },
        () => {
          const capacity = int(60, 200, 10)
          const load = Math.round(capacity * (int(60, 140) / 100))
          return numQuestion({
            q: `La charge de la semaine est de ${load} heures pour une capacité de ${capacity} heures. Quel est le taux de charge ?`,
            answer: (load / capacity) * 100,
            unit: "%",
            digits: 0,
            explain: `Taux = ${load} / ${capacity} × 100 ≈ ${fmt((load / capacity) * 100, 0)} %.`,
            wrong: [(capacity / load) * 100, load - capacity, (load / capacity) * 10, ((load / capacity) * 100) / 2],
          })
        },
        {
          q: "Que signifie un taux de charge de 120 % ?",
          choices: ["La charge dépasse la capacité : le plan est irréalisable", "La capacité est utilisée à 20 % seulement : il y a de la marge", "Les machines sont toutes en panne depuis 120 minutes", "Le plan est parfaitement équilibré, sans aucune marge"],
          answer: 0,
          explain: "Au-delà de 100 %, il y a plus de travail que de capacité : il faut ajouter de la capacité ou revoir le plan.",
        },
        {
          q: "Qu'est-ce que le goulot d'étranglement d'une usine ?",
          choices: ["La ressource la moins capable, qui limite le débit global", "La machine la plus récente et la plus chère de l'atelier", "L'entrée principale du magasin de stockage", "Le poste où travaille le plus grand nombre de salariés"],
          answer: 0,
          explain: "Le goulot est le maillon le plus faible du flux de production : tout ce qui est produit par l'usine passe par lui.",
        },
        {
          q: "Pourquoi protège-t-on le goulot ?",
          choices: ["Chaque heure perdue sur lui est perdue pour toute l'usine", "Parce qu'il est la machine la plus bruyante de l'atelier", "Parce qu'il est le moins cher à remplacer en cas de panne", "Parce qu'il fabrique toujours les pièces de meilleure qualité"],
          answer: 0,
          explain: "Le débit de l'usine est celui du goulot : un arrêt du goulot arrête la production de tout le système.",
        },
        {
          q: "Quelle solution peut réduire une surcharge ponctuelle ?",
          choices: ["Des heures supplémentaires ou la sous-traitance", "Une réduction importante du nombre de machines", "Une augmentation des stocks de matières premières", "Un arrêt complet de la maintenance préventive"],
          answer: 0,
          explain: "Les heures supplémentaires, une deuxième équipe ou la sous-traitance ajoutent de la capacité à court terme.",
        },
        {
          q: "Que contient la capacité d'un poste ?",
          choices: ["Le nombre de postes, les heures et la disponibilité", "Le nombre de clients qui commandent le produit chaque mois", "Le prix des matières consommées par la machine", "Le salaire de l'opérateur et ses primes mensuelles"],
          answer: 0,
          explain: "Capacité = nombre de postes × heures de travail × taux de disponibilité (pannes et arrêts déduits).",
        },
      ],
    },

    {
      id: "ordonnancement",
      title: "L'ordonnancement",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "Dans quel ordre fabriquer ?",
          body: "L'**ordonnancement** décide de l'**ordre** et des **horaires** de passage des ordres de fabrication sur les machines. Plus détaillé que le MRP (qui raisonne en semaines), il travaille au **jour**, à l'**heure**.\n\nUn bon ordonnancement respecte les **dates promises**, limite les **attentes** et les **changements de série**, et protège le goulot.",
        },
        {
          type: "list",
          title: "Les règles de priorité",
          items: [
            ["FIFO", "Premier arrivé, premier servi : simple et équitable."],
            ["SPT (temps le plus court d'abord)", "On commence par les travaux les plus rapides : réduit le temps d'attente moyen."],
            ["EDD (échéance la plus proche d'abord)", "On privilégie la date promise la plus proche : limite les retards."],
            ["Ratio critique", "Mesure l'urgence en comparant le temps restant au travail restant."],
          ],
        },
        {
          type: "formula",
          title: "Le ratio critique",
          formula: "RC = (date d'échéance − date du jour) / temps de production restant",
          legend: [
            ["RC < 1", "En retard : il faut accélérer ce travail."],
            ["RC = 1", "Juste à temps."],
            ["RC > 1", "En avance : on peut attendre."],
          ],
          example: "Une commande due dans 10 jours avec 8 jours de travail restant : RC = 10 / 8 = 1,25 (en avance). Due dans 6 jours avec 8 jours de travail : RC = 0,75 (en retard).",
        },
        {
          type: "example",
          title: "SPT contre EDD sur trois travaux",
          body: "Travaux : **A** (2 jours, échéance J+5), **B** (4 jours, échéance J+6), **C** (1 jour, échéance J+3).\n\n• **SPT** : C (1 j) → A (2 j) → B (4 j). Fins : J1, J3, J7 → B en retard de 1 jour.\n• **EDD** : C (J+3) → A (J+5) → B (J+6). Fins : J1, J3, J7 → mêmes résultats ici.\n\nLe choix de la règle dépend de l'objectif : **rapidité moyenne** (SPT) ou **respect des dates** (EDD).",
        },
        {
          type: "key",
          points: [
            "Ordonnancer = décider l'ordre et les horaires des fabrications sur les machines.",
            "FIFO, SPT (le plus court d'abord), EDD (échéance la plus proche), ratio critique.",
            "Ratio critique : RC < 1 = en retard ; RC > 1 = en avance.",
            "La meilleure règle dépend de l'objectif : vitesse moyenne ou respect des dates.",
          ],
        },
      ],
      quiz: [
        () => {
          const due = int(4, 14)
          const work = int(3, 12)
          return numQuestion({
            q: `Une commande est due dans ${due} jours et il reste ${work} jours de travail. Quel est son ratio critique ?`,
            answer: due / work,
            unit: "",
            digits: 2,
            explain: `RC = ${due} / ${work} = ${fmt(due / work, 2)}. ${due / work < 1 ? "Inférieur à 1 : la commande est en retard." : "Supérieur ou égal à 1 : la commande est dans les temps."}`,
            wrong: [work / due, due - work, due * work, due / work + 0.5],
          })
        },
        () => {
          const a = int(1, 4)
          const b = int(1, 4)
          const c = int(2, 5)
          const order = [a, b, c].sort((x, y) => x - y)
          const completion = order[0] + (order[0] + order[1]) + (order[0] + order[1] + order[2])
          return numQuestion({
            q: `Trois travaux durent ${a}, ${b} et ${c} jours. En les passant dans l'ordre SPT (le plus court d'abord), quelle est la somme des dates de fin des trois travaux ?`,
            answer: completion,
            unit: "jours",
            digits: 0,
            explain: `Ordre SPT : ${order.join(", ")}. Fins : ${order[0]}, ${order[0] + order[1]}, ${order[0] + order[1] + order[2]} → somme = ${completion} jours.`,
            wrong: [a + b + c, completion + 3, (a + b + c) * 3, completion - 2],
          })
        },
        {
          q: "Que signifie la règle SPT ?",
          choices: ["Passer d'abord le travail le plus court", "Passer d'abord le travail le plus ancien", "Passer d'abord le travail le plus cher", "Passer d'abord le travail le plus long"],
          answer: 0,
          explain: "SPT (Shortest Processing Time) termine rapidement beaucoup de petits travaux : le temps d'attente moyen diminue.",
        },
        {
          q: "Que privilégie la règle EDD ?",
          choices: ["La date d'échéance la plus proche", "Le temps de production le plus court", "Le client qui a commandé en premier", "Le produit dont le prix est le plus élevé"],
          answer: 0,
          explain: "EDD (Earliest Due Date) traite d'abord les travaux dont la date promise est la plus proche, pour limiter les retards.",
        },
        {
          q: "Un ratio critique de 0,7 indique…",
          choices: ["Une commande en retard", "Une commande très en avance", "Une commande juste à temps", "Une commande déjà livrée"],
          answer: 0,
          explain: "RC inférieur à 1 : le temps restant avant l'échéance est inférieur au travail restant, la commande est en retard.",
        },
        {
          q: "En quoi l'ordonnancement diffère-t-il du MRP ?",
          choices: ["Il décide l'ordre et les horaires précis sur les machines", "Il calcule les besoins en composants et matières", "Il fixe la politique de prix de l'entreprise pour l'année", "Il choisit les fournisseurs de matières premières"],
          answer: 0,
          explain: "Le MRP raisonne en semaines et en quantités ; l'ordonnancement affecte chaque ordre à une machine et à un horaire précis.",
        },
        {
          q: "Pourquoi limiter les changements de série ?",
          choices: ["Chaque changement coûte du temps où la machine ne produit pas", "Parce qu'ils augmentent toujours la qualité des produits finis", "Parce qu'ils réduisent automatiquement le stock de composants", "Parce qu'ils sont interdits par la loi dans toutes les usines"],
          answer: 0,
          explain: "Un changement de série (réglage, nettoyage) immobilise la machine : en regroupant les travaux similaires, on réduit ces pertes.",
        },
        {
          q: "Quel est un inconvénient de la règle SPT ?",
          choices: ["Les longs travaux peuvent attendre très longtemps", "Elle augmente toujours le temps d'attente moyen des travaux", "Elle oublie systématiquement les travaux les plus courts", "Elle ne peut s'appliquer qu'à une seule machine à la fois"],
          answer: 0,
          explain: "SPT favorise les travaux courts : les travaux longs peuvent être sans cesse repoussés et finir en retard.",
        },
      ],
    },

    {
      id: "trs",
      title: "Le TRS : le rendement des machines",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "Mesurer ce que la machine produit vraiment",
          body: "Une machine « disponible 8 heures » ne produit pas pendant 8 heures de pièces bonnes à pleine cadence : il y a des pannes, des ralentissements, des rebuts. Le **TRS** (taux de rendement synthétique, ou **OEE** en anglais) mesure la part du temps où la machine produit **des pièces bonnes à la cadence idéale**.\n\nIl combine **trois facteurs**, tous exprimés en pourcentage.",
        },
        {
          type: "formula",
          title: "Les trois facteurs du TRS",
          formula: "TRS = disponibilité × performance × qualité",
          legend: [
            ["Disponibilité", "Temps de marche / temps requis : pénalisé par les pannes et les réglages."],
            ["Performance", "(Pièces produites × temps de cycle idéal) / temps de marche : pénalisé par les ralentissements et micro-arrêts."],
            ["Qualité", "Pièces bonnes / pièces produites : pénalisé par les rebuts et retouches."],
          ],
          example: "Temps requis 480 min, arrêts 60 min → marche 420 min : D = 87,5 %. Cycle idéal 0,5 min, 700 pièces produites → P = 350 / 420 = 83,3 %. 672 pièces bonnes → Q = 96 %. TRS = 0,875 × 0,833 × 0,96 ≈ 70 %.",
        },
        {
          type: "list",
          title: "Les grandes pertes",
          items: [
            ["Disponibilité", "Pannes, changements de série, réglages."],
            ["Performance", "Micro-arrêts, ralentissements, cadence inférieure à l'idéale."],
            ["Qualité", "Rebuts, retouches, pertes au démarrage."],
          ],
        },
        {
          type: "text",
          title: "Que signifie un bon TRS ?",
          body: "On cite souvent un TRS de **85 %** comme objectif de niveau mondial, alors que beaucoup d'ateliers tournent autour de **60 %**. Mais le chiffre compte moins que sa **décomposition** : savoir si la perte vient de la disponibilité, de la performance ou de la qualité indique **où agir**.\n\nAttention aux noms : en France, TRS, **TRG** et **TRE** ne se calculent pas tout à fait de la même façon (temps de référence différent).",
        },
        {
          type: "key",
          points: [
            "TRS = disponibilité × performance × qualité.",
            "Disponibilité : pannes et réglages ; performance : ralentissements ; qualité : rebuts.",
            "Un TRS de 85 % est un objectif mondial ; beaucoup d'ateliers sont vers 60 %.",
            "On agit sur le facteur qui perd le plus.",
          ],
        },
      ],
      quiz: [
        () => {
          const required = 480
          const stops = int(30, 120, 10)
          return numQuestion({
            q: `Une machine doit tourner ${required} minutes mais s'arrête ${stops} minutes (pannes et réglages). Quelle est sa disponibilité ?`,
            answer: ((required - stops) / required) * 100,
            unit: "%",
            digits: 1,
            max: 100,
            explain: `Disponibilité = (${required} − ${stops}) / ${required} = ${required - stops} / ${required} = ${fmt(((required - stops) / required) * 100, 1)} %.`,
          })
        },
        () => {
          const run = int(380, 440, 10)
          const ideal = pick([0.4, 0.5, 0.6])
          const produced = Math.round((run / ideal) * (int(75, 95) / 100))
          return numQuestion({
            q: `Temps de marche ${run} minutes, cycle idéal ${fmt(ideal)} min par pièce, ${fmt(produced)} pièces produites. Quelle est la performance ?`,
            answer: ((produced * ideal) / run) * 100,
            unit: "%",
            digits: 1,
            max: 100,
            explain: `Performance = (${fmt(produced)} × ${fmt(ideal)}) / ${run} = ${fmt(produced * ideal, 1)} / ${run} = ${fmt(((produced * ideal) / run) * 100, 1)} %.`,
          })
        },
        () => {
          const a = int(80, 95)
          const p = int(75, 95)
          const q = int(92, 99)
          return numQuestion({
            q: `Disponibilité ${a} %, performance ${p} %, qualité ${q} %. Quel est le TRS ?`,
            answer: (a * p * q) / 10000,
            unit: "%",
            digits: 1,
            explain: `TRS = ${a} % × ${p} % × ${q} % = ${fmt((a * p * q) / 10000, 1)} %.`,
            wrong: [(a + p + q) / 3, Math.min(a, p, q), a * p / 100, (a * p * q) / 10000 + 10],
          })
        },
        {
          q: "Que signifie OEE en anglais ?",
          choices: ["Overall Equipment Effectiveness (le TRS)", "Operational Energy Evaluation of Machines", "Order Entry Efficiency of Customers", "Official Equipment Evaluation Process"],
          answer: 0,
          explain: "OEE (Overall Equipment Effectiveness) est l'équivalent anglais du TRS : disponibilité × performance × qualité.",
        },
        {
          q: "Quel facteur du TRS est pénalisé par les pannes et les changements de série ?",
          choices: ["La disponibilité", "La performance", "La qualité", "Aucun facteur"],
          answer: 0,
          explain: "Un arrêt de la machine réduit son temps de marche par rapport au temps requis : c'est la disponibilité qui baisse.",
        },
        {
          q: "Que pénalisent les micro-arrêts et les ralentissements ?",
          choices: ["La performance", "La disponibilité", "La qualité", "Le coût d'achat des matières"],
          answer: 0,
          explain: "La machine tourne, mais plus lentement que sa cadence idéale ou avec de petits arrêts : c'est la performance qui diminue.",
        },
        {
          q: "Que pénalisent les rebuts et les retouches ?",
          choices: ["La qualité", "La disponibilité", "La performance", "Le délai de livraison seulement"],
          answer: 0,
          explain: "Les pièces non conformes ne comptent pas comme production utile : c'est la qualité qui baisse.",
        },
        {
          q: "Pourquoi décompose-t-on le TRS en trois facteurs ?",
          choices: ["Pour savoir où se situent les pertes et où agir", "Pour obtenir artificiellement un chiffre plus élevé", "Pour éviter de devoir mesurer les pannes", "Pour supprimer progressivement les contrôles qualité"],
          answer: 0,
          explain: "Un TRS global de 60 % ne dit pas pourquoi : la décomposition indique si l'on doit traiter les arrêts, la cadence ou les rebuts.",
        },
      ],
    },
  ],
}
