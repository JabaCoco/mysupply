// Lot 12 — Nouveau module : Lean et amélioration continue (6 leçons).
import { fmt, int, numQuestion, pick } from '../gen.js'

export default {
  id: "lean",
  title: "Lean et amélioration continue",
  short: "Lean",
  icon: "repeat",
  color: "yellow",
  lessons: [
    {
      id: "cinq-s",
      title: "Les 5S et les 7 gaspillages",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Chasser ce qui ne sert à rien",
          body: "Le **lean** (« au plus juste ») cherche à créer de la **valeur pour le client** en éliminant les **gaspillages** (en japonais *muda*). Deux outils de base : les **7 gaspillages** pour repérer ce qui est inutile, et les **5S** pour organiser le poste de travail.",
        },
        {
          type: "list",
          title: "Les 7 gaspillages",
          items: [
            ["Surproduction", "Produire plus ou plus tôt que nécessaire."],
            ["Attente", "Personnes ou machines qui attendent."],
            ["Transport", "Déplacements inutiles de produits."],
            ["Sur-traitement", "Faire plus que le client ne demande."],
            ["Stocks", "Stocks excessifs qui immobilisent de l'argent."],
            ["Mouvements", "Gestes inutiles des opérateurs."],
            ["Défauts", "Erreurs, retouches, rebuts."],
          ],
        },
        {
          type: "list",
          title: "Les 5S",
          items: [
            ["Seiri : trier", "Garder uniquement l'utile, retirer le reste."],
            ["Seiton : ranger", "Une place pour chaque chose, chaque chose à sa place."],
            ["Seiso : nettoyer", "Nettoyer et contrôler en même temps."],
            ["Seiketsu : standardiser", "Définir des règles communes (marquage, couleurs)."],
            ["Shitsuke : maintenir", "Faire de ces règles une habitude, avec des audits."],
          ],
        },
        {
          type: "example",
          title: "Un exemple en entrepôt",
          body: "Au poste d'emballage, les opérateurs cherchent du ruban adhésif et des étiquettes (**mouvements**, **attente**). Après les 5S : on retire les outils inutiles (trier), on dessine l'emplacement de chaque outil au sol (ranger), on nettoie chaque fin de poste (nettoyer), on utilise les mêmes marquages partout (standardiser), et un audit hebdomadaire maintient le résultat.",
        },
        {
          type: "key",
          points: [
            "Lean : créer de la valeur en éliminant les gaspillages (muda).",
            "7 gaspillages : surproduction, attente, transport, sur-traitement, stocks, mouvements, défauts.",
            "5S : trier, ranger, nettoyer, standardiser, maintenir.",
          ],
        },
      ],
      quiz: [
        () => {
          const searches = int(5, 20)
          const sec = int(20, 60, 5)
          const ops = int(5, 30)
          return numQuestion({
            q: `Un opérateur cherche un outil ${searches} fois par jour, pendant ${sec} secondes à chaque fois. Avec ${ops} opérateurs, combien de minutes par jour perd-on en recherches ?`,
            answer: (searches * sec * ops) / 60,
            unit: "minutes",
            digits: 0,
            explain: `${searches} × ${sec} s × ${ops} opérateurs = ${fmt(searches * sec * ops)} s, soit ${fmt((searches * sec * ops) / 60, 0)} minutes par jour.`,
            wrong: [searches * sec * ops, searches * sec, (searches * sec * ops) / 600, ((searches * sec * ops) / 60) * 2],
          })
        },
        () => {
          const stock = int(10, 80) * 1000
          const cut = pick([20, 30, 40, 50])
          const rate = pick([8, 10, 12])
          return numQuestion({
            q: `Un stock de ${fmt(stock)} € coûte ${rate} % par an à détenir. Une action lean le réduit de ${cut} %. Quelle économie annuelle cela représente-t-il ?`,
            answer: (stock * cut * rate) / 10000,
            unit: "€",
            digits: 0,
            explain: `Stock réduit = ${fmt(stock)} × ${cut} % = ${fmt((stock * cut) / 100, 0)} € ; économie = ${fmt((stock * cut) / 100, 0)} × ${rate} % = ${fmt((stock * cut * rate) / 10000, 0)} €.`,
            wrong: [(stock * cut) / 100, (stock * rate) / 100, stock * cut * rate, (stock * cut * rate) / 1000],
          })
        },
        {
          q: "Que signifie muda ?",
          choices: ["Gaspillage", "Qualité", "Marge", "Stock de sécurité"],
          answer: 0,
          explain: "Muda signifie gaspillage en japonais : tout ce qui consomme des ressources sans créer de valeur pour le client.",
        },
        {
          q: "Que désigne le premier S (Seiri) ?",
          choices: ["Trier : retirer l'inutile", "Ranger : une place pour chaque chose", "Nettoyer le poste de travail", "Standardiser les règles de l'atelier"],
          answer: 0,
          explain: "Seiri consiste à trier : on ne garde au poste que ce qui sert vraiment.",
        },
        {
          q: "Quel gaspillage correspond à produire plus que la demande ?",
          choices: ["La surproduction", "L'attente des opérateurs entre deux tâches", "Le transport des pièces entre deux ateliers", "Les mouvements inutiles des opérateurs au poste"],
          answer: 0,
          explain: "La surproduction est souvent considérée comme le pire gaspillage : elle entraîne stocks, manutentions et défauts.",
        },
        {
          q: "Un opérateur attend la livraison d'une pièce sans rien faire. De quel gaspillage s'agit-il ?",
          choices: ["L'attente", "La surproduction des pièces", "Les défauts de qualité", "Le sur-traitement des pièces"],
          answer: 0,
          explain: "Une personne ou une machine qui attend produit du coût sans produire de valeur.",
        },
        {
          q: "Pourquoi le dernier S (Shitsuke) est-il le plus difficile ?",
          choices: ["Il demande de maintenir les règles dans la durée", "Il nécessite des machines très coûteuses et des experts externes", "Il supprime tous les audits de l'atelier et de l'entrepôt", "Il dépend uniquement du directeur de l'usine et de ses assistants"],
          answer: 0,
          explain: "Après un grand rangement, l'enjeu est de conserver les bonnes habitudes avec discipline et audits réguliers.",
        },
        {
          q: "Quel est le but du lean ?",
          choices: ["Créer plus de valeur avec moins de gaspillages", "Réduire les effectifs à tout prix pour baisser les coûts", "Produire en très grande série sans contrôle de la demande", "Augmenter tous les stocks pour garantir plus de sécurité"],
          answer: 0,
          explain: "Le lean part de la valeur voulue par le client et supprime tout ce qui n'y contribue pas.",
        },
      ],
    },

    {
      id: "kanban",
      title: "Le Kanban et le flux tiré",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "Produire ce qui est consommé",
          body: "Dans un **flux poussé**, on produit selon un plan, qu'un client le demande ou non. Dans un **flux tiré**, on ne produit que **ce que l'étape suivante consomme**. Le **Kanban** (« étiquette » en japonais) est le signal qui déclenche la production ou le réapprovisionnement : une carte ou un bac vide qui revient demande « remplis-moi ».",
        },
        {
          type: "list",
          title: "Les règles du Kanban",
          items: [
            ["Une carte, un bac", "Chaque carte est attachée à une quantité fixe de produits."],
            ["On produit sur signal", "Pas de carte, pas de production."],
            ["On ne livre que du bon", "Aucun défaut n'est envoyé à l'étape suivante."],
            ["On ajuste le nombre de cartes", "Moins de cartes = moins de stock, mais plus de risque de rupture."],
          ],
        },
        {
          type: "formula",
          title: "Le nombre de cartes Kanban",
          formula: "N = (D × L × (1 + S)) / C",
          legend: [
            ["D", "Consommation par heure (ou par jour)."],
            ["L", "Délai de réapprovisionnement ou de production (même unité que D)."],
            ["S", "Coefficient de sécurité (par exemple 0,1 pour 10 %)."],
            ["C", "Quantité par bac (capacité d'une carte)."],
          ],
          example: "D = 120 pièces/h, L = 2 h, S = 0,10, C = 50 pièces. N = (120 × 2 × 1,1) / 50 = 5,28 → 6 cartes (on arrondit au supérieur).",
        },
        {
          type: "text",
          title: "Avantages et limites",
          body: "**Avantages** : stocks plafonnés (le nombre de cartes est un maximum), production alignée sur la consommation réelle, problèmes visibles.\n**Limites** : adapté aux **flux réguliers** et aux produits **répétitifs** ; moins adapté à une demande très irrégulière ou à des produits sur mesure.",
        },
        {
          type: "key",
          points: [
            "Flux poussé : on produit sur prévision ; flux tiré : on produit sur consommation.",
            "Kanban : signal qui déclenche la production ou le réapprovisionnement.",
            "N = D × L × (1 + S) / C, arrondi au supérieur.",
            "Adapté aux flux réguliers et répétitifs.",
          ],
        },
      ],
      quiz: [
        () => {
          const D = int(60, 240, 20)
          const L = pick([1, 2, 3])
          const S = pick([0.1, 0.2])
          const C = pick([25, 40, 50, 60])
          const n = (D * L * (1 + S)) / C
          return numQuestion({
            q: `Consommation ${D} pièces/h, délai ${L} h, coefficient de sécurité ${fmt(S)}, ${C} pièces par bac. Combien de cartes Kanban faut-il (arrondi au supérieur) ?`,
            answer: Math.ceil(n),
            unit: "cartes",
            digits: 0,
            explain: `N = (${D} × ${L} × ${fmt(1 + S)}) / ${C} = ${fmt(n, 2)} → ${Math.ceil(n)} cartes.`,
            wrong: [Math.floor(n), Math.ceil(n) + 1, Math.ceil(n) - 1, Math.ceil(n) * 2],
          })
        },
        () => {
          const cards = int(4, 12)
          const C = pick([20, 25, 40, 50])
          return numQuestion({
            q: `Un circuit Kanban compte ${cards} cartes de ${C} pièces. Quel est le stock maximal dans le circuit ?`,
            answer: cards * C,
            unit: "pièces",
            digits: 0,
            explain: `${cards} × ${C} = ${fmt(cards * C, 0)} pièces : le nombre de cartes plafonne le stock.`,
            wrong: [cards + C, cards * C * 2, C, cards * (C / 2)],
          })
        },
        {
          q: "Que signifie un flux tiré ?",
          choices: ["On produit ce que l'étape suivante consomme", "On produit selon un plan sans tenir compte des clients", "On produit le plus possible pour avoir du stock", "On arrête toute production en fin de semaine"],
          answer: 0,
          explain: "Le flux tiré part de la demande réelle : chaque étape ne produit que pour remplacer ce qui a été utilisé.",
        },
        {
          q: "À quoi sert une carte Kanban ?",
          choices: ["À signaler un besoin de production", "À payer automatiquement le fournisseur du composant", "À mesurer la qualité d'une pièce sur la ligne", "À suivre le temps de pause de chaque opérateur"],
          answer: 0,
          explain: "La carte (ou le bac vide) signale qu'il faut produire ou réapprovisionner une quantité précise.",
        },
        {
          q: "Que se passe-t-il si on réduit le nombre de cartes ?",
          choices: ["Le stock baisse, mais le risque de rupture monte", "Le stock augmente sans aucun risque de rupture ni de défaut", "La qualité des pièces baisse automatiquement chez le fournisseur", "Les clients reçoivent plus de produits que prévu à chaque commande"],
          answer: 0,
          explain: "Moins de cartes, c'est moins de stock en circulation, mais moins de marge face aux aléas.",
        },
        {
          q: "Pour quel type de flux le Kanban convient-il le mieux ?",
          choices: ["Un flux régulier et répétitif", "Des produits uniques sur mesure", "Une demande très irrégulière", "Des commandes occasionnelles"],
          answer: 0,
          explain: "La régularité de la consommation permet de dimensionner les cartes ; l'irrégularité rend le système difficile à régler.",
        },
        {
          q: "Quelle règle du Kanban protège la qualité ?",
          choices: ["On ne livre que des produits conformes", "On envoie les défauts à l'étape suivante", "On produit sans contrôler", "On double chaque bac par prudence"],
          answer: 0,
          explain: "Un défaut envoyé à l'étape suivante déclenche des perturbations en cascade : la règle impose la qualité à chaque étape.",
        },
        {
          q: "Que représente C dans la formule du nombre de cartes ?",
          choices: ["La quantité contenue dans un bac", "Le coût d'impression d'une carte du circuit", "La capacité totale de production de l'usine entière", "Le coefficient de sécurité appliqué à la demande"],
          answer: 0,
          explain: "C est la quantité par bac : plus les bacs sont grands, moins on a besoin de cartes.",
        },
      ],
    },

    {
      id: "vsm",
      title: "La cartographie des flux (VSM)",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Dessiner le chemin du produit",
          body: "La **VSM** (*Value Stream Mapping*, cartographie de la chaîne de valeur) représente **tout le parcours** d'un produit, de la commande du client à la livraison : étapes, stocks, attentes et circulation de l'information. On mesure pour chaque étape le **temps de traitement** et pour chaque stock le **temps d'attente**.",
        },
        {
          type: "list",
          title: "Les deux temps essentiels",
          items: [
            ["Temps à valeur ajoutée (TVA)", "Le temps pendant lequel le produit est vraiment transformé."],
            ["Délai total (lead time)", "Temps entre le début et la fin, attentes et stocks compris."],
          ],
        },
        {
          type: "formula",
          title: "Le ratio de valeur ajoutée",
          formula: "Ratio VA = temps à valeur ajoutée / délai total × 100",
          legend: [
            ["TVA", "Somme des temps de traitement utiles."],
            ["Délai total", "Somme des temps de traitement et des temps d'attente."],
          ],
          example: "Délai total 10 jours, temps de traitement utile 4 heures (soit 0,5 jour en journée de 8 h) : ratio VA = 0,5 / 10 = 5 %. Les 95 % restants sont de l'attente.",
        },
        {
          type: "text",
          title: "De l'état actuel à l'état cible",
          body: "On dessine d'abord l'**état actuel** (la réalité), on repère les gaspillages (stocks entre étapes, attentes, retouches), puis on construit l'**état cible** : un flux plus court avec moins de stocks intermédiaires. Un plan d'actions (Kaizen) permet d'y arriver.",
        },
        {
          type: "key",
          points: [
            "VSM : cartographie du flux de la commande à la livraison.",
            "On compare le temps à valeur ajoutée au délai total.",
            "Ratio VA souvent très faible : l'essentiel du temps est de l'attente.",
            "État actuel → gaspillages → état cible → plan d'actions.",
          ],
        },
      ],
      quiz: [
        () => {
          const leadDays = int(5, 20)
          const hours = pick([2, 3, 4, 6])
          return numQuestion({
            q: `Délai total : ${leadDays} jours (jours de 8 h). Temps à valeur ajoutée : ${hours} heures. Quel est le ratio de valeur ajoutée ?`,
            answer: (hours / (leadDays * 8)) * 100,
            unit: "%",
            digits: 1,
            max: 100,
            explain: `Délai = ${leadDays} × 8 = ${leadDays * 8} h ; ratio = ${hours} / ${leadDays * 8} = ${fmt((hours / (leadDays * 8)) * 100, 1)} %.`,
          })
        },
        () => {
          const steps = [int(2, 8), int(2, 8), int(2, 8)]
          const waits = [int(10, 40), int(10, 40)]
          const total = steps.reduce((a, b) => a + b, 0) + waits.reduce((a, b) => a + b, 0)
          return numQuestion({
            q: `Trois étapes durent ${steps.join(', ')} heures, avec deux attentes de ${waits.join(' et ')} heures entre elles. Quel est le délai total ?`,
            answer: total,
            unit: "heures",
            digits: 0,
            explain: `${steps.join(' + ')} + ${waits.join(' + ')} = ${total} heures.`,
            wrong: [steps.reduce((a, b) => a + b, 0), waits.reduce((a, b) => a + b, 0), total + 10, total - 5],
          })
        },
        {
          q: "Que représente une VSM ?",
          choices: ["La carte du flux de la commande à la livraison", "Le plan de salaire détaillé d'une équipe de production", "Le budget annuel de fonctionnement de l'usine", "La liste complète des fournisseurs agréés par la direction"],
          answer: 0,
          explain: "La VSM décrit toutes les étapes et les attentes du flux, avec leurs temps, pour repérer les gaspillages.",
        },
        {
          q: "Que mesure le temps à valeur ajoutée ?",
          choices: ["Le temps où le produit est réellement transformé", "Le temps total écoulé entre la commande et la livraison", "Le temps des pauses prises par les opérateurs chaque jour", "Le temps de réparation des machines après chaque panne"],
          answer: 0,
          explain: "Seul le temps où l'on transforme le produit crée de la valeur pour le client.",
        },
        {
          q: "Que révèle souvent une VSM sur le délai total ?",
          choices: ["Une grande part est de l'attente", "Il est presque entièrement utile", "Il est toujours inférieur à une heure", "Il dépend uniquement du transport"],
          answer: 0,
          explain: "Dans beaucoup d'usines, plus de 90 % du délai est constitué d'attentes et de stocks entre étapes.",
        },
        {
          q: "Qu'est-ce que l'état cible ?",
          choices: ["Le flux amélioré que l'on veut atteindre", "Le flux actuel tel qu'il est observé sur le terrain aujourd'hui", "Le flux des concurrents du même secteur uniquement", "Le budget annuel des investissements de l'usine"],
          answer: 0,
          explain: "On dessine d'abord l'état actuel, puis l'état cible, avec moins de stocks et d'attentes.",
        },
        {
          q: "Pourquoi inclure le flux d'information sur une VSM ?",
          choices: ["Les commandes et plannings déclenchent la production", "Pour décorer la carte du flux avec des couleurs", "Pour remplacer tous les indicateurs de qualité du site", "Pour supprimer toutes les réunions de l'équipe projet"],
          answer: 0,
          explain: "La manière dont les ordres circulent (planning, Kanban, email) influence directement les attentes.",
        },
        {
          q: "Que signifie Kaizen ?",
          choices: ["Amélioration continue", "Production en grande série", "Stock tampon de sécurité", "Contrôle final du produit fini"],
          answer: 0,
          explain: "Kaizen signifie « changer pour le mieux » : de petites améliorations régulières, menées par tous.",
        },
      ],
    },

    {
      id: "pdca-dmaic",
      title: "PDCA, DMAIC et résolution de problèmes",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "Améliorer avec méthode",
          body: "Corriger un problème sans en trouver la cause fait qu'il revient. Des **méthodes structurées** guident l'équipe : **PDCA** pour l'amélioration continue, **DMAIC** pour les projets plus lourds, et des outils d'analyse comme les **5 pourquoi** et le **diagramme d'Ishikawa**.",
        },
        {
          type: "list",
          title: "Le cycle PDCA (roue de Deming)",
          items: [
            ["Plan", "Planifier : analyser le problème, fixer l'objectif et préparer l'action."],
            ["Do", "Faire : mettre en œuvre l'action, souvent à petite échelle."],
            ["Check", "Vérifier : mesurer si le résultat est atteint."],
            ["Act", "Agir : standardiser si cela marche, sinon corriger et recommencer."],
          ],
        },
        {
          type: "list",
          title: "Le DMAIC (Six Sigma)",
          items: [
            ["Define", "Définir le problème et l'objectif."],
            ["Measure", "Mesurer la situation actuelle."],
            ["Analyze", "Analyser les causes racines."],
            ["Improve", "Améliorer : mettre en œuvre des solutions."],
            ["Control", "Contrôler : maintenir les gains dans le temps."],
          ],
        },
        {
          type: "list",
          title: "Les outils d'analyse",
          items: [
            ["5 pourquoi", "Demander « pourquoi ? » plusieurs fois, jusqu'à la cause racine."],
            ["Ishikawa (arête de poisson)", "Classer les causes par famille : main-d'œuvre, méthode, matériel, matière, milieu (les 5M)."],
            ["Pareto", "Repérer les quelques causes qui expliquent la majorité des défauts (80/20)."],
          ],
        },
        {
          type: "example",
          title: "5 pourquoi : une palette tombée",
          body: "Pourquoi la palette est-elle tombée ? Elle était mal filmée. Pourquoi ? Le film a cassé. Pourquoi ? La machine de filmage tendait trop. Pourquoi ? Le réglage n'a pas été fait au changement de produit. Pourquoi ? Il n'y a pas de procédure.\n\n**Cause racine** : l'absence de procédure de réglage. L'action durable est d'en écrire une, pas seulement de refilmer la palette.",
        },
        {
          type: "key",
          points: [
            "PDCA : Plan, Do, Check, Act (amélioration continue).",
            "DMAIC : Define, Measure, Analyze, Improve, Control.",
            "5 pourquoi, Ishikawa, Pareto : trouver et hiérarchiser les causes.",
            "On traite la cause racine, pas le symptôme.",
          ],
        },
      ],
      quiz: [
        () => {
          const total = int(100, 400, 20)
          const share = pick([60, 70, 80])
          return numQuestion({
            q: `Sur ${total} défauts relevés, ${share} % viennent de 2 causes (analyse de Pareto). Combien de défauts ces 2 causes expliquent-elles ?`,
            answer: (total * share) / 100,
            unit: "défauts",
            digits: 0,
            explain: `${total} × ${share} % = ${fmt((total * share) / 100, 0)} défauts : traiter ces 2 causes élimine l'essentiel du problème.`,
            wrong: [total - (total * share) / 100, total * share, total / share, (total * share) / 10],
          })
        },
        () => {
          const before = int(40, 120, 10)
          const cut = pick([30, 40, 50, 60])
          return numQuestion({
            q: `Après une action PDCA, le nombre d'erreurs par mois passe de ${before} à ${Math.round(before * (1 - cut / 100))}. Quelle baisse en % a-t-on obtenue ?`,
            answer: ((before - Math.round(before * (1 - cut / 100))) / before) * 100,
            unit: "%",
            digits: 0,
            explain: `(${before} − ${Math.round(before * (1 - cut / 100))}) / ${before} × 100 ≈ ${fmt(((before - Math.round(before * (1 - cut / 100))) / before) * 100, 0)} %.`,
            wrong: [cut + 10, before - Math.round(before * (1 - cut / 100)), 100 - cut + 10, cut / 2],
          })
        },
        {
          q: "Que signifient les lettres PDCA ?",
          choices: ["Plan, Do, Check, Act", "Produce, Deliver, Control, Archive", "Prepare, Design, Create, Apply", "Plan, Decide, Count, Adjust"],
          answer: 0,
          explain: "PDCA : planifier, faire, vérifier, agir. C'est la roue de l'amélioration continue.",
        },
        {
          q: "Que fait-on à l'étape Act du PDCA ?",
          choices: ["On standardise ce qui marche, sinon on corrige", "On planifie le prochain budget annuel du service", "On arrête définitivement le projet d'amélioration en cours", "On cherche un nouveau fournisseur de composants"],
          answer: 0,
          explain: "Si le résultat est bon, on généralise et on standardise ; sinon, on ajuste et on recommence le cycle.",
        },
        {
          q: "À quoi servent les 5 pourquoi ?",
          choices: ["À trouver la cause racine d'un problème", "À fixer le prix de vente d'un produit sur le marché", "À former les nouveaux salariés du service qualité", "À calculer le stock de sécurité de chaque référence"],
          answer: 0,
          explain: "En demandant « pourquoi ? » plusieurs fois, on remonte du symptôme à la cause qu'il faut traiter.",
        },
        {
          q: "Que signifie la lettre C de DMAIC ?",
          choices: ["Control : maintenir les gains", "Create : créer un nouveau produit", "Calculate : calculer les coûts", "Choose : choisir un fournisseur"],
          answer: 0,
          explain: "À la dernière étape, on met en place des contrôles pour que l'amélioration dure.",
        },
        {
          q: "Que classe un diagramme d'Ishikawa ?",
          choices: ["Les causes possibles d'un problème par familles", "Les clients de l'entreprise selon leur chiffre d'affaires", "Les fournisseurs de l'entreprise selon leur prix d'achat", "Les stocks de l'entrepôt selon leur valeur annuelle"],
          answer: 0,
          explain: "Les familles habituelles sont les 5M : main-d'œuvre, méthode, matériel, matière, milieu.",
        },
        {
          q: "Que montre un diagramme de Pareto ?",
          choices: ["Les causes les plus fréquentes, classées", "Les gains financiers attendus du projet d'amélioration", "L'organigramme complet de l'usine et de ses équipes", "Le planning de production de la semaine à venir"],
          answer: 0,
          explain: "On traite d'abord les quelques causes qui expliquent la majorité des problèmes (règle des 80/20).",
        },
      ],
    },

    {
      id: "smed",
      title: "Le SMED : réduire les temps de réglage",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Changer de série en un clin d'œil",
          body: "Le **SMED** (*Single Minute Exchange of Die*, « changement d'outil en moins de 10 minutes ») réduit le **temps de changement de série**. Des changements courts permettent de produire de **petits lots**, donc de réduire les stocks et de répondre plus vite aux clients.",
        },
        {
          type: "list",
          title: "Opérations internes et externes",
          items: [
            ["Opérations internes", "Possibles seulement quand la machine est arrêtée (changer le moule)."],
            ["Opérations externes", "Possibles pendant que la machine tourne (préparer l'outil suivant, apporter les matières)."],
          ],
        },
        {
          type: "list",
          title: "Les étapes du SMED",
          items: [
            ["1. Observer", "Filmer et chronométrer un changement actuel."],
            ["2. Séparer", "Distinguer internes et externes."],
            ["3. Convertir", "Transformer en externe tout ce qui peut l'être."],
            ["4. Réduire", "Simplifier les opérations restantes (fixations rapides, repères)."],
            ["5. Standardiser", "Écrire la nouvelle procédure et la former."],
          ],
        },
        {
          type: "formula",
          title: "Le gain de capacité",
          formula: "Gain = nombre de changements × minutes gagnées par changement",
          legend: [
            ["Minutes gagnées", "Temps d'avant moins temps d'après pour un changement."],
            ["Conversion en valeur", "Minutes gagnées × coût de la machine par minute (ou marge par minute)."],
          ],
          example: "Une machine fait 12 changements par semaine à 45 minutes. Avec le SMED : 25 minutes. Gain = 12 × 20 = 240 minutes, soit 4 heures de production en plus chaque semaine.",
        },
        {
          type: "key",
          points: [
            "SMED : réduire le temps de changement de série.",
            "Séparer opérations internes (machine arrêtée) et externes (machine en marche).",
            "Convertir un maximum d'internes en externes, puis simplifier.",
            "Gain = changements × minutes gagnées.",
          ],
        },
      ],
      quiz: [
        () => {
          const changes = int(6, 20)
          const before = int(40, 90, 5)
          const after = before - int(10, 30, 5)
          return numQuestion({
            q: `${changes} changements de série par semaine passent de ${before} à ${after} minutes grâce au SMED. Combien d'heures de production sont gagnées par semaine ?`,
            answer: (changes * (before - after)) / 60,
            unit: "heures",
            digits: 1,
            explain: `${changes} × ${before - after} min = ${changes * (before - after)} min = ${fmt((changes * (before - after)) / 60, 1)} heures.`,
            wrong: [changes * (before - after), (before - after) / 60, changes * before / 60, (changes * (before - after)) / 100],
          })
        },
        () => {
          const mins = int(20, 120, 10)
          const cost = int(2, 8)
          return numQuestion({
            q: `Une machine immobilisée coûte ${cost} € par minute. Un changement de série dure ${mins} minutes. Quel est le coût d'un changement ?`,
            answer: mins * cost,
            unit: "€",
            digits: 0,
            explain: `${mins} × ${cost} € = ${fmt(mins * cost, 0)} €.`,
            wrong: [mins + cost, mins / cost, mins * cost * 2, mins * cost / 2],
          })
        },
        {
          q: "Que signifie SMED ?",
          choices: ["Changement d'outil en moins de 10 minutes", "Stock maximum de matières premières et d'emballages autorisé", "Suivi mensuel des délais de livraison des fournisseurs", "Système de maintenance électronique des machines de l'atelier"],
          answer: 0,
          explain: "Single Minute Exchange of Die : l'objectif est un changement de série à un chiffre de minutes.",
        },
        {
          q: "Qu'est-ce qu'une opération externe en SMED ?",
          choices: ["Une opération faite pendant que la machine tourne", "Une opération réalisée par un sous-traitant extérieur à l'usine", "Une opération faite en dehors de l'usine, chez un partenaire", "Une opération qui arrête la machine de production pendant un long moment"],
          answer: 0,
          explain: "Préparer l'outil suivant pendant la production est une opération externe : elle ne coûte pas de temps machine.",
        },
        {
          q: "Que fait-on à l'étape « convertir » ?",
          choices: ["On transforme des opérations internes en externes", "On change la marque de la machine pour un modèle plus récent", "On convertit les devises des fournisseurs étrangers", "On supprime toute la production de la série concernée"],
          answer: 0,
          explain: "Tout ce qui peut être préparé machine en marche doit sortir du temps d'arrêt.",
        },
        {
          q: "Pourquoi réduire les temps de réglage permet-il de réduire les stocks ?",
          choices: ["On peut produire de plus petits lots", "On produit toujours plus de pièces à chaque série lancée", "On supprime les clients les plus exigeants du portefeuille", "On n'utilise plus aucune matière première dans l'atelier"],
          answer: 0,
          explain: "Quand changer de série coûte peu, il devient rentable de fabriquer des petits lots, donc de stocker moins.",
        },
        {
          q: "Quelle est la première étape d'un projet SMED ?",
          choices: ["Observer et chronométrer un changement réel", "Acheter une nouvelle machine plus rapide pour la ligne", "Réduire les effectifs de l'équipe de réglage", "Augmenter la taille des lots de production de chaque série"],
          answer: 0,
          explain: "On filme un changement réel pour voir ce qui prend du temps avant de chercher des améliorations.",
        },
        {
          q: "Quel équipement aide à réduire un temps de réglage ?",
          choices: ["Des fixations rapides et des repères de position", "Des vis supplémentaires plus longues et plus nombreuses", "Des notices techniques plus volumineuses et détaillées", "Des outils stockés à l'autre bout de l'usine, loin du poste"],
          answer: 0,
          explain: "Des fixations à serrage rapide et des repères évitent les réglages longs par essais successifs.",
        },
      ],
    },

    {
      id: "six-sigma",
      title: "Six Sigma et la qualité",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "Presque zéro défaut",
          body: "**Six Sigma** est une démarche qui vise à **réduire la variabilité** d'un processus pour atteindre un niveau de qualité très élevé : **3,4 défauts par million d'opportunités** (DPMO) au niveau « 6 sigma ». Plus le niveau sigma est élevé, moins il y a de défauts.",
        },
        {
          type: "formula",
          title: "Le DPMO",
          formula: "DPMO = défauts / (unités × opportunités de défaut par unité) × 1 000 000",
          legend: [
            ["Défauts", "Nombre total de défauts constatés."],
            ["Opportunités", "Nombre de façons dont une unité peut être défectueuse (champs d'une commande, par exemple)."],
          ],
          example: "250 erreurs sur 2 000 commandes comportant chacune 5 champs à remplir : DPMO = 250 / (2 000 × 5) × 1 000 000 = 25 000.",
        },
        {
          type: "list",
          title: "Quelques repères de niveau sigma (approximatifs)",
          items: [
            ["3 sigma", "environ 66 800 DPMO (93,3 % sans défaut)"],
            ["4 sigma", "environ 6 200 DPMO (99,4 %)"],
            ["5 sigma", "environ 230 DPMO (99,98 %)"],
            ["6 sigma", "3,4 DPMO (99,99966 %)"],
          ],
        },
        {
          type: "text",
          title: "Lean et Six Sigma",
          body: "Le **lean** vise à supprimer les **gaspillages** et à accélérer le flux. **Six Sigma** vise à supprimer la **variabilité** et les **défauts**. Beaucoup d'entreprises combinent les deux : le **Lean Six Sigma**. Les experts sont classés par « ceintures » (jaune, verte, noire).",
        },
        {
          type: "key",
          points: [
            "Six Sigma : réduire la variabilité et les défauts (6 sigma = 3,4 DPMO).",
            "DPMO = défauts / (unités × opportunités) × 1 000 000.",
            "Lean : supprimer les gaspillages ; Six Sigma : supprimer les défauts.",
          ],
        },
      ],
      quiz: [
        () => {
          const units = int(1000, 5000, 500)
          const opp = pick([3, 4, 5, 8])
          const defects = int(20, 200, 10)
          return numQuestion({
            q: `${defects} erreurs relevées sur ${fmt(units)} commandes comportant chacune ${opp} opportunités d'erreur. Quel est le DPMO ?`,
            answer: (defects / (units * opp)) * 1000000,
            unit: "DPMO",
            digits: 0,
            explain: `${defects} / (${fmt(units)} × ${opp}) × 1 000 000 = ${fmt((defects / (units * opp)) * 1000000, 0)} DPMO.`,
            wrong: [(defects / units) * 1000000, (defects / (units * opp)) * 100, defects * units * opp, (defects / (units * opp)) * 10000],
          })
        },
        () => {
          const dpmo = pick([5000, 10000, 20000, 50000])
          return numQuestion({
            q: `Un processus a un DPMO de ${fmt(dpmo)}. Quel pourcentage d'opportunités est sans défaut ?`,
            answer: 100 - dpmo / 10000,
            unit: "%",
            digits: 1,
            max: 100,
            explain: `${fmt(dpmo)} / 1 000 000 = ${fmt(dpmo / 10000, 1)} % de défauts ; sans défaut : ${fmt(100 - dpmo / 10000, 1)} %.`,
          })
        },
        {
          q: "Combien de DPMO correspondent au niveau 6 sigma ?",
          choices: ["3,4", "34", "340", "3 400"],
          answer: 0,
          explain: "Six sigma = 3,4 défauts par million d'opportunités, soit 99,99966 % sans défaut.",
        },
        {
          q: "Que cherche à réduire Six Sigma ?",
          choices: ["La variabilité et les défauts", "Le nombre de clients actifs de l'entreprise", "La taille des entrepôts de stockage du groupe", "Le délai de paiement accordé aux clients"],
          answer: 0,
          explain: "Six Sigma vise un processus stable, qui donne toujours le même résultat conforme.",
        },
        {
          q: "Que signifie DPMO ?",
          choices: ["Défauts par million d'opportunités", "Délai de paiement moyen observé", "Débit de production mesuré en ligne", "Détail des pertes par mois et par origine"],
          answer: 0,
          explain: "Cet indicateur compare le nombre de défauts au nombre total de possibilités d'erreur.",
        },
        {
          q: "Quelle est la différence entre lean et Six Sigma ?",
          choices: ["Le lean vise les gaspillages, Six Sigma les défauts", "Le lean vise uniquement les défauts, Six Sigma uniquement les stocks", "Ils sont strictement identiques dans leurs objectifs et leurs outils", "Le lean est réservé aux entrepôts de stockage uniquement"],
          answer: 0,
          explain: "Les deux sont complémentaires : l'un accélère et simplifie le flux, l'autre le fiabilise.",
        },
        {
          q: "Que représente une « ceinture noire » ?",
          choices: ["Un expert de Six Sigma", "Un débutant en logistique", "Un chauffeur de poids lourd", "Un auditeur de la douane"],
          answer: 0,
          explain: "Les ceintures (jaune, verte, noire) indiquent le niveau de formation en Six Sigma.",
        },
        {
          q: "Pourquoi compter les opportunités de défaut ?",
          choices: ["Pour comparer des processus de complexité différente", "Pour augmenter artificiellement le nombre de défauts mesurés", "Pour éviter de devoir mesurer la qualité des produits", "Pour fixer le prix de vente des produits finis"],
          answer: 0,
          explain: "Une commande à 20 champs offre plus de chances d'erreur qu'une commande à 3 champs : le DPMO en tient compte.",
        },
      ],
    },
  ],
}
