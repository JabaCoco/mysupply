// Lot 14 — Nouveau module : Risques et résilience (5 leçons).
import { fmt, int, numQuestion, pick } from '../gen.js'

export default {
  id: "risques",
  title: "Risques et résilience",
  short: "Risques",
  icon: "shield",
  color: "red",
  lessons: [
    {
      id: "cartographie-risques",
      title: "Identifier et classer les risques",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "Une chaîne longue, des risques nombreux",
          body: "Plus une chaîne d'approvisionnement est **longue**, **mondiale** et **optimisée au plus juste**, plus elle est exposée aux **perturbations** : catastrophes naturelles, pannes, grèves, cyberattaques, défaillance d'un fournisseur, tensions géopolitiques, pandémies. La **gestion des risques** consiste à les **identifier**, les **évaluer**, puis à décider comment les **traiter**.",
        },
        {
          type: "list",
          title: "Les grandes familles de risques",
          items: [
            ["Offre", "Défaillance ou retard d'un fournisseur, pénurie de matières."],
            ["Demande", "Chute ou pic imprévu des ventes."],
            ["Opérations", "Panne, incendie, grève, erreur de qualité."],
            ["Transport", "Accident, blocage de port ou de canal, piraterie."],
            ["Externes", "Catastrophes naturelles, guerres, sanctions, pandémies, cyberattaques."],
            ["Financiers", "Faillite d'un partenaire, variation du change ou des prix."],
          ],
        },
        {
          type: "formula",
          title: "La criticité d'un risque",
          formula: "Criticité = probabilité × gravité",
          legend: [
            ["Probabilité", "Chance que le risque survienne (par exemple de 1 à 5, ou en %)."],
            ["Gravité", "Impact si le risque survient (par exemple de 1 à 5, ou en €)."],
            ["Perte espérée", "Probabilité × impact financier : un coût moyen annuel du risque."],
          ],
          example: "Une panne d'entrepôt : probabilité 2 sur 5, gravité 4 sur 5 → criticité 8. Un retard de transporteur : 4 × 2 = 8. Les deux demandent une attention comparable.",
        },
        {
          type: "list",
          title: "Les quatre façons de traiter un risque",
          items: [
            ["Éviter", "Supprimer l'activité ou la source du risque."],
            ["Réduire", "Diminuer la probabilité ou la gravité (prévention, double sourcing)."],
            ["Transférer", "Faire porter le risque par un tiers (assurance, contrat)."],
            ["Accepter", "Ne rien faire de plus, si le risque est faible ou trop coûteux à traiter."],
          ],
        },
        {
          type: "key",
          points: [
            "Chaîne longue et tendue = plus exposée aux perturbations.",
            "Criticité = probabilité × gravité ; perte espérée = probabilité × impact en €.",
            "Traiter : éviter, réduire, transférer ou accepter.",
            "On concentre les efforts sur les risques les plus critiques.",
          ],
        },
      ],
      quiz: [
        () => {
          const p = int(1, 5)
          const g = int(1, 5)
          return numQuestion({
            q: `Un risque a une probabilité de ${p} sur 5 et une gravité de ${g} sur 5. Quelle est sa criticité ?`,
            answer: p * g,
            unit: "",
            digits: 0,
            explain: `${p} × ${g} = ${p * g} (sur un maximum de 25).`,
            wrong: [p + g, p * g + 5, Math.max(p, g), p * g * 2],
          })
        },
        () => {
          const prob = pick([2, 5, 10, 20])
          const impact = int(5, 40, 5) * 10000
          return numQuestion({
            q: `Un incendie d'entrepôt a ${prob} % de chances de survenir en une année et coûterait ${fmt(impact)} €. Quelle est la perte espérée annuelle ?`,
            answer: (impact * prob) / 100,
            unit: "€",
            digits: 0,
            explain: `${fmt(impact)} × ${prob} % = ${fmt((impact * prob) / 100, 0)} € par an en moyenne.`,
            wrong: [impact, impact * prob, impact / prob, (impact * prob) / 10],
          })
        },
        () => {
          const prob = pick([5, 10, 20])
          const impact = int(10, 50, 10) * 10000
          const prime = Math.round(((impact * prob) / 100) * pick([1.2, 1.5]))
          return numQuestion({
            q: `Un risque a une perte espérée de ${fmt((impact * prob) / 100, 0)} € par an. Une assurance coûte ${fmt(prime, 0)} € par an. Quel est le surcoût de l'assurance par rapport à la perte espérée ?`,
            answer: prime - (impact * prob) / 100,
            unit: "€",
            digits: 0,
            explain: `${fmt(prime, 0)} − ${fmt((impact * prob) / 100, 0)} = ${fmt(prime - (impact * prob) / 100, 0)} € : c'est le prix de la tranquillité (transfert du risque).`,
            wrong: [prime, (impact * prob) / 100, prime + (impact * prob) / 100, (prime - (impact * prob) / 100) * 2],
          })
        },
        {
          q: "Comment calcule-t-on la criticité d'un risque ?",
          choices: ["Probabilité multipliée par gravité", "Probabilité plus gravité", "Gravité divisée par probabilité", "Probabilité moins gravité"],
          answer: 0,
          explain: "On multiplie la chance que le risque survienne par son impact : un risque fréquent et grave est le plus critique.",
        },
        {
          q: "Que signifie transférer un risque ?",
          choices: ["Le faire porter par un tiers, comme un assureur", "Le supprimer en arrêtant l'activité", "Ne rien faire du tout", "Le cacher aux clients"],
          answer: 0,
          explain: "L'assurance ou un contrat transfèrent tout ou partie de l'impact financier à un tiers.",
        },
        {
          q: "Quel risque relève de la famille « externe » ?",
          choices: ["Une catastrophe naturelle", "Une erreur de saisie en entrepôt", "Un retard de préparation", "Un défaut de calage"],
          answer: 0,
          explain: "Les risques externes échappent à l'entreprise : catastrophes, guerres, sanctions, pandémies.",
        },
        {
          q: "Pourquoi une chaîne « au plus juste » est-elle plus exposée ?",
          choices: ["Elle a peu de stock pour absorber un choc", "Elle utilise toujours plus de fournisseurs", "Elle a des délais plus longs partout", "Elle n'a jamais de plan de secours"],
          answer: 0,
          explain: "Sans stock tampon, un retard ou une panne se répercute immédiatement sur la production ou la livraison.",
        },
        {
          q: "Que fait-on face à un risque faible et très coûteux à traiter ?",
          choices: ["On peut l'accepter en le surveillant", "On l'ignore sans le noter", "On arrête toute l'entreprise", "On le transfère obligatoirement"],
          answer: 0,
          explain: "Accepter un risque est une décision consciente, documentée et revue régulièrement.",
        },
        {
          q: "Quelle est la première étape de la gestion des risques ?",
          choices: ["Identifier les risques", "Acheter une assurance", "Réduire les stocks", "Changer de fournisseur"],
          answer: 0,
          explain: "On ne peut ni évaluer ni traiter un risque que l'on n'a pas identifié.",
        },
      ],
    },

    {
      id: "crises-celebres",
      title: "Les grandes crises logistiques",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "Apprendre des chocs passés",
          body: "Plusieurs événements récents ont montré la **fragilité** des chaînes mondiales. Les étudier aide à comprendre les **mécanismes** : dépendance à un site ou un pays, absence de stocks, effets en cascade.",
        },
        {
          type: "list",
          title: "Quelques exemples",
          items: [
            ["Tsunami et séisme au Japon (2011)", "Des usines de composants sont à l'arrêt : l'industrie automobile mondiale manque de pièces, car un petit nombre de sites fournissaient certains composants clés."],
            ["Inondations en Thaïlande (2011)", "Des usines de disques durs sont sous l'eau : pénurie mondiale d'ordinateurs et prix en hausse, car la production était fortement concentrée dans quelques zones."],
            ["Pandémie de Covid-19 (2020-2021)", "Usines et ports fermés, puis explosion de la demande de biens : les conteneurs manquent, les prix du fret explosent."],
            ["Pénurie de semi-conducteurs (2020-2022)", "Les constructeurs automobiles manquent de puces : des usines s'arrêtent, car les commandes avaient été annulées au début de la crise et les capacités attribuées à d'autres secteurs."],
            ["Blocage du canal de Suez (mars 2021)", "Un porte-conteneurs bloque le canal pendant près d'une semaine : des centaines de navires sont retardés. Environ 12 % du commerce mondial passe par ce canal."],
            ["Tensions en mer Rouge (depuis fin 2023)", "Des navires évitent le canal de Suez et contournent l'Afrique : trajets plus longs de plusieurs jours et coûts en hausse."],
          ],
        },
        {
          type: "text",
          title: "Ce que ces crises ont en commun",
          body: "• **Concentration** : un site, un fournisseur ou un point de passage unique.\n• **Visibilité limitée** : on ignorait où se trouvaient les sous-traitants de rang 2 ou 3.\n• **Stocks minimaux** : aucun tampon pour gagner du temps.\n• **Effet en cascade** : un petit composant bloque un produit à plusieurs milliers d'euros.\n• **Effet coup de fouet** : les commandes de panique amplifient les tensions.",
        },
        {
          type: "key",
          points: [
            "Les crises récentes montrent le danger de la concentration et des stocks minimaux.",
            "Un composant bon marché peut bloquer un produit entier.",
            "Visibilité sur les sous-traitants de rang 2 et 3 : un point faible fréquent.",
          ],
        },
      ],
      quiz: [
        () => {
          const normal = int(10, 20)
          const detour = int(8, 14)
          return numQuestion({
            q: `Un trajet normal dure ${normal} jours. Le contournement d'une zone bloquée ajoute ${detour} jours. Quelle est la nouvelle durée ?`,
            answer: normal + detour,
            unit: "jours",
            digits: 0,
            explain: `${normal} + ${detour} = ${normal + detour} jours : le stock en transit et les besoins de stock augmentent d'autant.`,
            wrong: [normal, detour, normal - detour, (normal + detour) * 2],
          })
        },
        () => {
          const ships = int(100, 400, 50)
          const share = pick([30, 40, 50, 60])
          return numQuestion({
            q: `${ships} navires attendent à l'entrée d'un canal bloqué. ${share} % transportent des conteneurs. Combien de navires porte-conteneurs cela représente-t-il ?`,
            answer: (ships * share) / 100,
            unit: "navires",
            digits: 0,
            explain: `${ships} × ${share} % = ${fmt((ships * share) / 100, 0)} navires.`,
            wrong: [ships - (ships * share) / 100, ships * share, ships / share, (ships * share) / 10],
          })
        },
        {
          q: "Que s'est-il passé dans le canal de Suez en mars 2021 ?",
          choices: ["Un porte-conteneurs l'a bloqué pendant plusieurs jours", "Le canal a été fermé pendant un an", "Une grève a arrêté les ports égyptiens", "Un incendie a détruit les écluses"],
          answer: 0,
          explain: "Un navire échoué en travers du canal a bloqué la circulation près d'une semaine, retardant des centaines de navires.",
        },
        {
          q: "Pourquoi la crise des semi-conducteurs a-t-elle arrêté des usines automobiles ?",
          choices: ["Les puces manquaient et les capacités étaient limitées", "Les voitures n'avaient plus besoin de puces", "Les puces coûtaient trop peu cher", "Les usines refusaient de les commander"],
          answer: 0,
          explain: "Quelques usines mondiales produisent la majorité des puces : la demande a dépassé les capacités, et les constructeurs ont été servis après d'autres secteurs.",
        },
        {
          q: "Que montrent les inondations thaïlandaises de 2011 ?",
          choices: ["Les dangers de la concentration géographique", "Les avantages du transport aérien", "L'intérêt de l'automatisation", "Les bienfaits du stock minimal"],
          answer: 0,
          explain: "Une part importante de la production de disques durs se trouvait dans quelques zones : une inondation a touché tout le marché mondial.",
        },
        {
          q: "Que signifie « rang 2 » pour un fournisseur ?",
          choices: ["Le fournisseur de votre fournisseur", "Un fournisseur classé deuxième en prix", "Un fournisseur de secours uniquement", "Un fournisseur situé à l'étranger"],
          answer: 0,
          explain: "Les fournisseurs de rang 2 (et 3) sont les sous-traitants cachés : leur défaillance peut bloquer toute la chaîne.",
        },
        {
          q: "Quel effet ont les commandes de panique en période de pénurie ?",
          choices: ["Elles amplifient la tension sur l'offre", "Elles font baisser les prix du fret", "Elles améliorent la prévision de la demande", "Elles réduisent les stocks des clients"],
          answer: 0,
          explain: "En commandant plus que nécessaire par peur de manquer, chacun aggrave la pénurie (effet coup de fouet).",
        },
        {
          q: "Que provoque un contournement de plusieurs jours d'une zone bloquée ?",
          choices: ["Des coûts et des délais plus élevés", "Un transport moins cher", "Une baisse du stock en transit", "Une meilleure visibilité des flux"],
          answer: 0,
          explain: "Plus de jours de mer, plus de carburant, de navires immobilisés et de stock en route.",
        },
      ],
    },

    {
      id: "double-sourcing",
      title: "Diversifier ses sources",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Ne pas mettre tous ses œufs dans le même panier",
          body: "Dépendre d'un **fournisseur unique** (*single sourcing*) est économique en temps normal (volumes concentrés, prix bas, relation forte), mais très risqué si ce fournisseur défaille. La **diversification** consiste à avoir **plusieurs sources**, en acceptant un surcoût en échange de sécurité.",
        },
        {
          type: "list",
          title: "Les stratégies",
          items: [
            ["Single sourcing", "Un seul fournisseur : prix et relation optimisés, risque maximum."],
            ["Double sourcing", "Deux fournisseurs, par exemple 70 % / 30 % : sécurité et pression concurrentielle."],
            ["Multi-sourcing", "Plus de deux fournisseurs : plus de sécurité, mais moins de volume chez chacun."],
            ["Sourcing géographique", "Fournisseurs dans des zones ou pays différents pour limiter les risques locaux."],
            ["Nearshoring / relocalisation", "Rapprocher des sources de production du marché pour réduire les distances."],
          ],
        },
        {
          type: "formula",
          title: "Mesurer la dépendance",
          formula: "Part d'un fournisseur = achats chez ce fournisseur / achats totaux × 100",
          legend: [
            ["Seuil d'alerte", "Au-delà de 50 % chez un seul fournisseur, la dépendance est forte (repère courant)."],
            ["Indice de concentration", "La somme des carrés des parts (de 0 à 10 000) mesure la concentration : plus il est élevé, plus la dépendance est forte."],
          ],
          example: "Un acheteur répartit 1 000 000 € ainsi : 700 000 € chez A, 200 000 € chez B, 100 000 € chez C. Part de A : 70 %. Indice = 70² + 20² + 10² = 4 900 + 400 + 100 = 5 400.",
        },
        {
          type: "text",
          title: "Le prix de la sécurité",
          body: "Le double sourcing a un **coût** : volumes moins concentrés (prix un peu plus élevés), qualification de deux fournisseurs, gestion plus complexe. Pour savoir s'il vaut la peine, on compare ce **surcoût annuel** à la **perte espérée** en cas de défaillance (probabilité × impact).",
        },
        {
          type: "key",
          points: [
            "Single sourcing : économique mais très risqué.",
            "Double ou multi-sourcing : sécurité en échange d'un surcoût.",
            "Part d'un fournisseur > 50 % = dépendance forte.",
            "On compare le surcoût de diversification à la perte espérée.",
          ],
        },
      ],
      quiz: [
        () => {
          const a = int(40, 80, 10)
          const total = int(10, 50, 5) * 100000
          return numQuestion({
            q: `Sur ${fmt(total)} € d'achats, ${a} % vont au fournisseur A. Quel montant cela représente-t-il ?`,
            answer: (total * a) / 100,
            unit: "€",
            digits: 0,
            explain: `${fmt(total)} × ${a} % = ${fmt((total * a) / 100, 0)} €.`,
            wrong: [total - (total * a) / 100, total * a, total / a, (total * a) / 10],
          })
        },
        () => {
          const parts = pick([[70, 20, 10], [60, 30, 10], [50, 30, 20], [80, 10, 10]])
          const hhi = parts.reduce((s, p) => s + p * p, 0)
          return numQuestion({
            q: `Trois fournisseurs se partagent vos achats à ${parts.join(' %, ')} %. Quel est l'indice de concentration (somme des carrés des parts) ?`,
            answer: hhi,
            unit: "",
            digits: 0,
            explain: `${parts.map((p) => `${p}²`).join(' + ')} = ${parts.map((p) => p * p).join(' + ')} = ${hhi}.`,
            wrong: [parts.reduce((s, p) => s + p, 0), Math.max(...parts) * 100, hhi + 1000, Math.round(hhi / 2)],
          })
        },
        () => {
          const extra = pick([2, 3, 4, 5])
          const volume = int(5, 40, 5) * 100000
          const loss = int(5, 20, 5) * 100000
          const prob = pick([5, 10, 20])
          return numQuestion({
            q: `Un double sourcing coûte ${extra} % de plus sur ${fmt(volume)} € d'achats. Une défaillance du fournisseur unique coûterait ${fmt(loss)} € avec ${prob} % de chances par an. Quelle est la perte espérée évitée (en €) ?`,
            answer: (loss * prob) / 100,
            unit: "€",
            digits: 0,
            explain: `${fmt(loss)} × ${prob} % = ${fmt((loss * prob) / 100, 0)} € par an, à comparer au surcoût de ${fmt((volume * extra) / 100, 0)} €.`,
            wrong: [loss, (volume * extra) / 100, loss * prob, (loss * prob) / 10],
          })
        },
        {
          q: "Qu'est-ce que le single sourcing ?",
          choices: ["Acheter auprès d'un seul fournisseur", "Acheter auprès de deux fournisseurs", "Acheter uniquement à l'étranger", "Acheter sans contrat"],
          answer: 0,
          explain: "Un seul fournisseur simplifie la relation mais concentre tout le risque sur lui.",
        },
        {
          q: "Quel est l'inconvénient du double sourcing ?",
          choices: ["Un coût plus élevé et plus de gestion", "Un risque de rupture plus fort", "Moins de pression sur les prix", "Moins de qualification nécessaire"],
          answer: 0,
          explain: "Qualifier et gérer deux fournisseurs coûte du temps et fait souvent perdre un peu en prix.",
        },
        {
          q: "Que signifie nearshoring ?",
          choices: ["Rapprocher les sources du marché", "Éloigner la production des clients", "Supprimer les stocks", "Changer de transporteur"],
          answer: 0,
          explain: "On relocalise ou on choisit des fournisseurs plus proches pour réduire délais, distances et risques.",
        },
        {
          q: "Pourquoi diversifier géographiquement les fournisseurs ?",
          choices: ["Pour éviter qu'un seul événement local bloque tout", "Pour réduire toujours les coûts de transport", "Pour simplifier les contrats", "Pour supprimer les audits"],
          answer: 0,
          explain: "Une catastrophe, une grève ou des sanctions ne touchent qu'une zone : les autres sources continuent à livrer.",
        },
        {
          q: "À partir de quelle part d'achats la dépendance est-elle souvent jugée forte ?",
          choices: ["Plus de 50 % chez un seul fournisseur", "Plus de 5 %", "Plus de 15 %", "Plus de 25 % uniquement"],
          answer: 0,
          explain: "Au-delà de la moitié des achats chez un seul fournisseur, sa défaillance met l'entreprise en danger.",
        },
        {
          q: "Comment décider si le double sourcing vaut son coût ?",
          choices: ["Comparer le surcoût à la perte espérée évitée", "Choisir toujours le moins cher", "Ne jamais diversifier les sources", "Demander l'avis du transporteur"],
          answer: 0,
          explain: "Un raisonnement de risque : le surcoût est-il inférieur à la perte moyenne qu'il permet d'éviter ?",
        },
      ],
    },

    {
      id: "stocks-strategiques",
      title: "Stocks de sécurité et temps de survie",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Gagner du temps face à une crise",
          body: "Un stock **stratégique** (ou de crise) sert à tenir pendant une perturbation grave, au-delà du stock de sécurité habituel (qui couvre les variations normales). Il coûte cher à détenir : on le réserve aux **composants critiques**, difficiles à remplacer.",
        },
        {
          type: "list",
          title: "Deux durées essentielles",
          items: [
            ["TTR (time to recover)", "Temps nécessaire pour retrouver un fonctionnement normal après une défaillance (réparer un site, qualifier un autre fournisseur)."],
            ["TTS (time to survive)", "Durée pendant laquelle l'entreprise peut tenir sans ce composant ou ce site, grâce aux stocks et aux solutions de contournement."],
          ],
        },
        {
          type: "formula",
          title: "La règle simple",
          formula: "Risque de rupture si TTS < TTR",
          legend: [
            ["TTS", "Stock disponible / consommation journalière (en jours)."],
            ["TTR", "Délai estimé pour revenir à la normale."],
            ["Marge", "TTS − TTR : si elle est négative, il y aura une rupture d'autant de jours."],
          ],
          example: "Stock de 6 000 pièces, consommation 400 par jour : TTS = 15 jours. Si le TTR est de 30 jours, il manque 15 jours de production. Il faut soit plus de stock, soit un second fournisseur.",
        },
        {
          type: "list",
          title: "À stocker en priorité",
          items: [
            ["Composants uniques", "Un seul fournisseur, pas d'alternative qualifiée."],
            ["Délais d'approvisionnement très longs", "Plusieurs mois."],
            ["Pièces à fort impact", "Un composant bon marché qui arrête une ligne entière."],
            ["Produits stratégiques", "Santé, énergie, défense : des États constituent des stocks nationaux."],
          ],
        },
        {
          type: "key",
          points: [
            "Stock stratégique : tenir pendant une perturbation grave, pour les composants critiques.",
            "TTS = stock / consommation journalière ; TTR = délai de retour à la normale.",
            "Rupture si TTS < TTR, d'autant de jours que l'écart.",
          ],
        },
      ],
      quiz: [
        () => {
          const stock = int(2, 20) * 1000
          const daily = pick([200, 250, 400, 500, 1000])
          return numQuestion({
            q: `Un stock de ${fmt(stock)} pièces, avec une consommation de ${fmt(daily)} pièces par jour. Quel est le TTS (temps de survie) ?`,
            answer: stock / daily,
            unit: "jours",
            digits: 1,
            explain: `${fmt(stock)} / ${fmt(daily)} = ${fmt(stock / daily, 1)} jours.`,
            wrong: [stock * daily, daily / stock, (stock / daily) * 2, stock - daily],
          })
        },
        () => {
          const tts = int(8, 30)
          const ttr = tts + int(5, 25)
          return numQuestion({
            q: `Le temps de survie est de ${tts} jours et le temps de reprise de ${ttr} jours. Combien de jours de rupture faut-il craindre ?`,
            answer: ttr - tts,
            unit: "jours",
            digits: 0,
            explain: `${ttr} − ${tts} = ${ttr - tts} jours sans composant.`,
            wrong: [tts, ttr, ttr + tts, tts - 5],
          })
        },
        () => {
          const daily = pick([200, 300, 400, 500])
          const gap = int(5, 20)
          return numQuestion({
            q: `Pour combler ${gap} jours de rupture avec une consommation de ${daily} pièces par jour, quel stock supplémentaire faut-il constituer ?`,
            answer: daily * gap,
            unit: "pièces",
            digits: 0,
            explain: `${daily} × ${gap} = ${fmt(daily * gap, 0)} pièces.`,
            wrong: [daily + gap, daily / gap, daily * gap * 2, daily * (gap - 3)],
          })
        },
        {
          q: "Que signifie TTR ?",
          choices: ["Le temps pour revenir à un fonctionnement normal", "Le temps de transport routier", "Le taux de remplissage total", "Le temps de traitement des retours"],
          answer: 0,
          explain: "TTR (time to recover) est la durée de remise en état d'un site ou de qualification d'une autre source.",
        },
        {
          q: "Que représente le TTS ?",
          choices: ["La durée pendant laquelle on peut tenir sans le composant", "Le temps total de stockage d'un produit", "Le taux de transport standard", "Le temps de signature du contrat"],
          answer: 0,
          explain: "TTS (time to survive) mesure le temps avant que la rupture n'ait des conséquences, grâce aux stocks et aux contournements.",
        },
        {
          q: "Quand une rupture est-elle à craindre ?",
          choices: ["Quand le TTS est inférieur au TTR", "Quand le TTS est supérieur au TTR", "Quand le stock de sécurité est rempli", "Quand la demande est stable"],
          answer: 0,
          explain: "Si l'on ne peut pas tenir aussi longtemps que la reprise, il y aura un manque.",
        },
        {
          q: "À quels composants réserve-t-on un stock stratégique ?",
          choices: ["Les composants critiques sans alternative", "Tous les articles sans distinction", "Les produits qui se vendent le mieux", "Les emballages standards"],
          answer: 0,
          explain: "Stocker coûte cher : on le réserve aux composants dont l'absence arrête la production et qu'on ne peut pas remplacer.",
        },
        {
          q: "Quelle différence avec le stock de sécurité classique ?",
          choices: ["Il couvre une crise grave et non la variabilité normale", "Il est toujours plus petit", "Il n'est jamais utilisé", "Il remplace le stock de roulement"],
          answer: 0,
          explain: "Le stock de sécurité absorbe les variations courantes ; le stock stratégique protège contre un choc exceptionnel.",
        },
      ],
    },

    {
      id: "pca",
      title: "Le plan de continuité d'activité",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Continuer à fonctionner malgré la crise",
          body: "Le **plan de continuité d'activité (PCA)** décrit comment l'entreprise **maintient ses activités essentielles** pendant une perturbation grave (incendie, panne informatique, cyberattaque, pandémie) et **redémarre** ensuite. Un plan écrit, connu et **testé** permet de réagir vite, sans improviser.",
        },
        {
          type: "list",
          title: "Les étapes d'un PCA",
          items: [
            ["1. Analyser l'impact (BIA)", "Identifier les activités critiques et ce que coûte leur arrêt, heure par heure."],
            ["2. Fixer les objectifs", "RTO : durée maximale d'interruption acceptable ; RPO : perte de données maximale acceptable."],
            ["3. Choisir les solutions", "Site de repli, double sourcing, stocks, télétravail, sauvegardes."],
            ["4. Rédiger le plan", "Qui fait quoi, qui prévenir, dans quel ordre."],
            ["5. Tester et améliorer", "Exercices réguliers, mise à jour après chaque incident."],
          ],
        },
        {
          type: "formula",
          title: "Le coût d'un arrêt",
          formula: "Coût d'arrêt = durée de l'arrêt × coût par heure (ou par jour)",
          legend: [
            ["Coût par heure", "Marge perdue + frais fixes continuant à courir + pénalités éventuelles."],
            ["RTO", "S'il est de 4 h, le plan doit permettre un redémarrage en moins de 4 heures."],
          ],
          example: "Un entrepôt à l'arrêt coûte 12 000 € par jour. Un site de repli opérationnel en 2 jours au lieu de 7 évite 5 × 12 000 = 60 000 € de pertes.",
        },
        {
          type: "text",
          title: "La cybersécurité, un risque majeur",
          body: "Les **cyberattaques** (rançongiciels) paralysent des entrepôts et des transporteurs : plus de système de gestion, plus d'étiquettes, plus de commandes. Le PCA doit prévoir des **sauvegardes hors ligne**, des **procédures dégradées** (travailler sur papier un temps) et la **sensibilisation** des équipes.",
        },
        {
          type: "key",
          points: [
            "PCA : maintenir les activités essentielles et redémarrer vite.",
            "BIA, RTO (durée d'arrêt acceptable), RPO (perte de données acceptable).",
            "Un plan non testé est un plan qui échouera.",
            "Cyberattaques : sauvegardes hors ligne et procédures dégradées.",
          ],
        },
      ],
      quiz: [
        () => {
          const days = int(2, 10)
          const cost = int(5, 20, 5) * 1000
          return numQuestion({
            q: `Un entrepôt à l'arrêt coûte ${fmt(cost)} € par jour. L'arrêt dure ${days} jours. Quel est le coût de l'arrêt ?`,
            answer: days * cost,
            unit: "€",
            digits: 0,
            explain: `${days} × ${fmt(cost)} = ${fmt(days * cost, 0)} €.`,
            wrong: [days + cost, cost / days, days * cost * 2, (days - 1) * cost],
          })
        },
        () => {
          const cost = int(5, 20, 5) * 1000
          const before = int(5, 10)
          const after = int(1, 3)
          return numQuestion({
            q: `Un site de repli ramène la durée d'arrêt de ${before} jours à ${after} jour${after > 1 ? 's' : ''}. L'arrêt coûte ${fmt(cost)} € par jour. Quelle perte évite-t-on ?`,
            answer: (before - after) * cost,
            unit: "€",
            digits: 0,
            explain: `(${before} − ${after}) × ${fmt(cost)} = ${fmt((before - after) * cost, 0)} €.`,
            wrong: [before * cost, after * cost, (before + after) * cost, cost],
          })
        },
        () => {
          const rto = pick([4, 8, 24, 48])
          const real = rto + int(2, 24, 2)
          return numQuestion({
            q: `Le RTO fixé est de ${rto} heures, mais un test de reprise a pris ${real} heures. De combien d'heures le RTO est-il dépassé ?`,
            answer: real - rto,
            unit: "heures",
            digits: 0,
            explain: `${real} − ${rto} = ${real - rto} heures de retard sur l'objectif : le plan doit être amélioré.`,
            wrong: [real, rto, real + rto, real - rto + 2],
          })
        },
        {
          q: "Que signifie PCA ?",
          choices: ["Plan de continuité d'activité", "Plan de croissance annuel", "Plateforme de commande automatique", "Prévision du chiffre d'affaires"],
          answer: 0,
          explain: "Le PCA décrit comment maintenir et reprendre les activités essentielles en cas de crise.",
        },
        {
          q: "Que représente le RTO ?",
          choices: ["La durée d'interruption maximale acceptable", "Le coût total de l'opération", "Le nombre de salariés mobilisés", "Le taux d'occupation du stock"],
          answer: 0,
          explain: "RTO (Recovery Time Objective) : en combien de temps l'activité doit avoir redémarré.",
        },
        {
          q: "À quoi sert le BIA ?",
          choices: ["Évaluer l'impact d'un arrêt sur chaque activité", "Calculer les droits de douane", "Choisir la couleur des palettes", "Mesurer la satisfaction des clients"],
          answer: 0,
          explain: "Le BIA (Business Impact Analysis) identifie les activités critiques et leur coût d'arrêt.",
        },
        {
          q: "Pourquoi tester régulièrement un PCA ?",
          choices: ["Un plan non testé risque d'échouer en cas de crise", "Pour réduire le nombre de risques", "Pour supprimer l'assurance", "Pour éviter de former les équipes"],
          answer: 0,
          explain: "Les exercices révèlent les oublis (contacts, accès, sauvegardes) avant qu'ils ne coûtent cher.",
        },
        {
          q: "Que prévoit-on en cas de cyberattaque sur le système de l'entrepôt ?",
          choices: ["Des sauvegardes hors ligne et des procédures dégradées", "L'arrêt définitif de l'activité", "Un doublement des stocks de sécurité", "Une baisse des prix pour les clients"],
          answer: 0,
          explain: "Avec des sauvegardes hors ligne et des méthodes de secours (papier), l'activité peut continuer à faible allure.",
        },
        {
          q: "Que désigne le RPO ?",
          choices: ["La perte de données maximale acceptable", "Le délai de livraison promis", "Le coût du plan de continuité", "Le nombre de sites de repli"],
          answer: 0,
          explain: "RPO (Recovery Point Objective) : jusqu'à quel point dans le passé on accepte de perdre des données.",
        },
      ],
    },
  ],
}
