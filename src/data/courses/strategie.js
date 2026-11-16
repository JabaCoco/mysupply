// Lot 16 — Nouveau module : Stratégie et innovation (5 leçons).
import { fmt, int, numQuestion, pick } from '../gen.js'

export default {
  id: "strategie",
  title: "Stratégie et innovation",
  short: "Stratégie",
  icon: "compass",
  color: "indigo",
  lessons: [
    {
      id: "strategie-sc",
      title: "La stratégie de supply chain",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "Une supply chain au service de la stratégie",
          body: "Une supply chain n'est pas bonne ou mauvaise dans l'absolu : elle est **adaptée ou non** à la stratégie de l'entreprise et à la **nature de ses produits**. Un fabricant de papier toilette et une marque de mode n'ont pas besoin de la même organisation.",
        },
        {
          type: "list",
          title: "Deux grandes approches (Fisher)",
          items: [
            ["Supply chain efficiente", "Pour des produits fonctionnels, à demande stable et prévisible (lait, pâtes, papier). Objectif : coût minimal, forte rotation, stocks bas."],
            ["Supply chain réactive", "Pour des produits innovants, à demande incertaine (mode, high-tech). Objectif : réactivité, flexibilité, capacité de réserve, stocks tampons."],
          ],
        },
        {
          type: "list",
          title: "Les arbitrages de base",
          items: [
            ["Coût ou service", "Plus de réactivité coûte de l'argent."],
            ["Stock ou rapidité", "Un stock protège ; un flux rapide demande de la flexibilité."],
            ["Centralisation ou proximité", "Peu de sites : moins de stock ; plus de sites : livraisons plus rapides."],
            ["Spécialisation ou polyvalence", "Des usines spécialisées sont plus efficaces, mais moins agiles."],
          ],
        },
        {
          type: "text",
          title: "Les priorités concurrentielles",
          body: "Une entreprise choisit ce qui la distingue : **le coût** (prix bas), **la qualité**, **le délai** (rapidité), **la flexibilité** (variété, personnalisation) ou **la durabilité**. Elle ne peut pas être la meilleure sur tout : sa supply chain doit **soutenir sa priorité**. Un discounter cherche des coûts très bas ; un site de luxe, le service et la qualité.",
        },
        {
          type: "key",
          points: [
            "La supply chain doit être alignée sur la stratégie et le type de produit.",
            "Produit fonctionnel (demande stable) : supply chain efficiente. Produit innovant (demande incertaine) : supply chain réactive.",
            "Les arbitrages : coût / service, stock / rapidité, centralisation / proximité.",
          ],
        },
      ],
      quiz: [
        () => {
          const demand = int(1000, 5000, 500)
          const dev = pick([10, 20, 40, 60])
          return numQuestion({
            q: `Une prévision de ${fmt(demand)} unités peut se tromper de ±${dev} % (produit innovant). Quel est l'écart maximal en unités ?`,
            answer: (demand * dev) / 100,
            unit: "unités",
            digits: 0,
            explain: `${fmt(demand)} × ${dev} % = ${fmt((demand * dev) / 100, 0)} unités : c'est la marge de réactivité qu'il faut prévoir.`,
            wrong: [demand - (demand * dev) / 100, demand * dev, demand / dev, (demand * dev) / 10],
          })
        },
        () => {
          const low = int(2, 5)
          const high = int(8, 15)
          return numQuestion({
            q: `Un produit fonctionnel est prévu avec ${low} % d'erreur, un produit innovant avec ${high} % d'erreur. De combien de points l'erreur est-elle plus grande pour le produit innovant ?`,
            answer: high - low,
            unit: "points",
            digits: 0,
            explain: `${high} − ${low} = ${high - low} points : l'incertitude est plus forte, d'où le besoin de réactivité.`,
            wrong: [high + low, high, low, (high - low) * 2],
          })
        },
        {
          q: "Quel produit relève d'une supply chain efficiente ?",
          choices: ["Un paquet de pâtes", "Un smartphone nouvelle génération", "Un vêtement de mode très tendance", "Un jouet vedette de Noël"],
          answer: 0,
          explain: "Les produits fonctionnels, à demande stable et prévisible, visent le coût minimal.",
        },
        {
          q: "Quel objectif caractérise une supply chain réactive ?",
          choices: ["La flexibilité face à une demande incertaine", "Le coût le plus bas possible, quel que soit le service", "La rotation maximale des stocks à tout prix", "L'absence totale de capacité de réserve dans les usines"],
          answer: 0,
          explain: "Pour des produits innovants, mieux vaut être réactif que minimiser le coût au détriment du service.",
        },
        {
          q: "Pourquoi une supply chain doit-elle être alignée sur la stratégie ?",
          choices: ["Pour soutenir la priorité concurrentielle de l'entreprise", "Pour réduire volontairement le nombre de clients servis", "Pour supprimer tous les arbitrages de coûts de l'entreprise", "Pour éviter de devoir mesurer les résultats obtenus"],
          answer: 0,
          explain: "Un discounter et une marque de luxe n'ont pas la même priorité : leurs chaînes d'approvisionnement non plus.",
        },
        {
          q: "Quel arbitrage oppose coût et service ?",
          choices: ["Plus de réactivité coûte plus cher", "Plus de service réduit toujours les coûts", "Le coût ne dépend jamais du service", "Un stock bas améliore toujours le service"],
          answer: 0,
          explain: "Capacité de réserve, stocks tampons et livraisons rapides ont un coût qu'il faut justifier.",
        },
        {
          q: "Que gagne-t-on en augmentant le nombre de sites de distribution ?",
          choices: ["Des livraisons plus rapides, mais plus de stock", "Moins de stock et moins de coûts fixes pour l'entreprise", "Des trajets beaucoup plus longs vers tous les clients", "Une meilleure efficience économique dans tous les cas"],
          answer: 0,
          explain: "La proximité raccourcit les délais mais multiplie les stocks et les frais fixes.",
        },
        {
          q: "Que signifie flexibilité pour une supply chain ?",
          choices: ["S'adapter vite aux changements de demande", "Produire toujours la même quantité, quelle que soit la demande", "Ne jamais changer de fournisseur, même en cas de problème", "Réduire fortement la variété des produits proposés"],
          answer: 0,
          explain: "Une chaîne flexible ajuste volumes, variantes et délais quand le marché change.",
        },
      ],
    },

    {
      id: "design-reseau",
      title: "Concevoir son réseau logistique",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "Où implanter les sites ?",
          body: "Le **design de réseau** consiste à décider **combien de sites** (usines, entrepôts), **où les placer**, **quoi y stocker** et **quels flux** les relient. Ces décisions engagent l'entreprise pour des années : on les évalue donc avec des **calculs** et des **simulations**.",
        },
        {
          type: "list",
          title: "Les critères de choix d'un site",
          items: [
            ["Proximité des clients", "Délais et coûts de livraison."],
            ["Accès au transport", "Autoroutes, ports, gares de fret."],
            ["Coûts", "Terrain, main-d'œuvre, énergie, taxes."],
            ["Main-d'œuvre", "Disponibilité et compétences."],
            ["Risques", "Inondations, instabilité, dépendance à un territoire."],
            ["Durabilité", "Émissions, énergie renouvelable, impact local."],
          ],
        },
        {
          type: "formula",
          title: "Le centre de gravité",
          formula: "X = Σ (volume × x) / Σ volume ; Y = Σ (volume × y) / Σ volume",
          legend: [
            ["x, y", "Coordonnées de chaque point de livraison (client, magasin)."],
            ["Volume", "Quantités à livrer à chaque point."],
            ["Résultat", "Un point d'implantation qui minimise le transport pondéré (première approximation)."],
          ],
          example: "Trois clients : A (x = 10 ; 100 unités), B (x = 30 ; 300 unités), C (x = 50 ; 100 unités). X = (10×100 + 30×300 + 50×100) / 500 = 15 000 / 500 = 30. Le site idéal est plus près de B, qui reçoit le plus.",
        },
        {
          type: "text",
          title: "Une méthode de décision : la notation pondérée",
          body: "On liste les critères, on leur donne un **poids** (par importance), on **note** chaque site de 1 à 5, puis on calcule une **note pondérée** (somme des notes × poids). Le meilleur score désigne le site préféré. La méthode force à expliciter les priorités et facilite la discussion.",
        },
        {
          type: "key",
          points: [
            "Design de réseau : nombre, lieu et rôle des sites.",
            "Critères : clients, transport, coûts, main-d'œuvre, risques, durabilité.",
            "Centre de gravité = moyenne des coordonnées pondérée par les volumes.",
            "Notation pondérée : somme des notes × poids de chaque critère.",
          ],
        },
      ],
      quiz: [
        () => {
          const v = [int(1, 5) * 100, int(1, 5) * 100, int(1, 5) * 100]
          const x = [int(1, 5) * 10, int(1, 5) * 10, int(1, 5) * 10]
          const total = v[0] + v[1] + v[2]
          const gx = (v[0] * x[0] + v[1] * x[1] + v[2] * x[2]) / total
          return numQuestion({
            q: `Trois clients aux positions x = ${x.join(', ')} reçoivent ${v.join(', ')} unités. Quelle est la coordonnée x du centre de gravité ?`,
            answer: gx,
            unit: "",
            digits: 1,
            explain: `(${x[0]}×${v[0]} + ${x[1]}×${v[1]} + ${x[2]}×${v[2]}) / ${total} = ${fmt(gx, 1)}.`,
            wrong: [(x[0] + x[1] + x[2]) / 3, Math.max(...x), Math.min(...x), gx + 5],
          })
        },
        () => {
          const w = [0.5, 0.3, 0.2]
          const n = [int(2, 5), int(2, 5), int(2, 5)]
          const score = n[0] * w[0] + n[1] * w[1] + n[2] * w[2]
          return numQuestion({
            q: `Un site obtient ${n.join(', ')} (sur 5) sur trois critères de poids 50 %, 30 % et 20 %. Quelle est sa note pondérée ?`,
            answer: score,
            unit: "/5",
            digits: 2,
            explain: `${n[0]}×0,5 + ${n[1]}×0,3 + ${n[2]}×0,2 = ${fmt(score, 2)}.`,
            wrong: [(n[0] + n[1] + n[2]) / 3, n[0] + n[1] + n[2], score + 0.5, Math.max(...n)],
          })
        },
        () => {
          const km = int(50, 300, 10)
          const trips = int(100, 500, 50)
          const cost = pick([1.2, 1.5, 1.8])
          return numQuestion({
            q: `Un site est à ${km} km des clients. Il faut ${trips} livraisons par mois à ${fmt(cost, 1)} € du km (aller simple compté). Quel est le coût de transport mensuel ?`,
            answer: km * trips * cost,
            unit: "€",
            digits: 0,
            explain: `${km} × ${trips} × ${fmt(cost, 1)} = ${fmt(km * trips * cost, 0)} €.`,
            wrong: [km * trips, km * cost, trips * cost, km * trips * cost * 2],
          })
        },
        {
          q: "Que fait le design de réseau ?",
          choices: ["Décider du nombre, du lieu et du rôle des sites", "Choisir la couleur et la décoration des entrepôts", "Fixer le prix de vente des produits aux clients", "Embaucher les chauffeurs et les préparateurs de commandes"],
          answer: 0,
          explain: "Il détermine la structure physique de la chaîne : sites, flux et rôles.",
        },
        {
          q: "Que calcule la méthode du centre de gravité ?",
          choices: ["Un point proche des gros volumes à livrer", "Le prix moyen d'un produit vendu aux clients", "Le nombre de salariés nécessaires dans chaque site", "Le coût d'un loyer moyen pour un entrepôt de la région"],
          answer: 0,
          explain: "Chaque point est pondéré par son volume : le résultat est tiré vers les clients les plus importants.",
        },
        {
          q: "Pourquoi pondérer les critères d'une notation ?",
          choices: ["Tous n'ont pas la même importance", "Pour obtenir toujours la même note", "Pour supprimer certains critères", "Pour éviter de comparer les sites"],
          answer: 0,
          explain: "Le poids traduit les priorités de l'entreprise : la proximité des clients peut compter plus que le loyer.",
        },
        {
          q: "Quel critère concerne le risque d'un site ?",
          choices: ["L'exposition aux inondations", "Le nombre de places de parking", "La couleur du bâtiment", "Le nombre de bureaux"],
          answer: 0,
          explain: "Un site en zone inondable peut être bloqué : le risque fait partie du choix.",
        },
        {
          q: "Pourquoi les décisions de réseau sont-elles délicates ?",
          choices: ["Elles engagent l'entreprise pour des années", "Elles se changent facilement chaque semaine sans coût", "Elles n'ont aucun coût pour l'entreprise ni pour ses clients", "Elles ne concernent que les transports de marchandises"],
          answer: 0,
          explain: "Une usine ou un entrepôt se construit pour dix ans ou plus : mieux vaut simuler avant de décider.",
        },
        {
          q: "Que signifie un score pondéré élevé ?",
          choices: ["Le site répond mieux aux priorités fixées", "Le site coûte forcément moins cher que tous les autres", "Le site est le plus proche de l'usine principale", "Le site est sans aucun risque naturel ni économique"],
          answer: 0,
          explain: "Le score combine plusieurs critères selon leur importance : le plus élevé est le meilleur compromis.",
        },
      ],
    },

    {
      id: "faire-ou-faire-faire",
      title: "Faire ou faire faire (make or buy)",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "Produire soi-même ou acheter ?",
          body: "L'entreprise doit décider quelles activités **garder en interne** (*make*) et lesquelles **confier à un tiers** (*buy*) : fabrication d'une pièce, transport, stockage, informatique. La décision repose sur les **coûts**, la **compétence**, le **contrôle** et le **risque**.",
        },
        {
          type: "list",
          title: "Arguments pour faire soi-même",
          items: [
            ["Savoir-faire stratégique", "L'activité fait la différence face aux concurrents."],
            ["Contrôle", "Qualité, délais et confidentialité maîtrisés."],
            ["Capacité disponible", "Des machines ou des équipes inoccupées."],
            ["Coût plus bas à fort volume", "Les frais fixes sont amortis."],
          ],
        },
        {
          type: "list",
          title: "Arguments pour faire faire (externalisation)",
          items: [
            ["Expertise externe", "Un spécialiste est plus efficace."],
            ["Flexibilité", "On ajuste les volumes sans investir."],
            ["Coût variable", "On paie à l'unité plutôt que d'immobiliser du capital."],
            ["Concentration sur le cœur de métier", "Les équipes se focalisent sur ce qui compte."],
          ],
        },
        {
          type: "formula",
          title: "Le seuil de rentabilité du « faire »",
          formula: "Quantité seuil = frais fixes annuels / (prix d'achat − coût variable de fabrication)",
          legend: [
            ["Frais fixes", "Machines, outillage, personnel dédié (€ par an)."],
            ["Coût variable", "Matière et main-d'œuvre par unité fabriquée."],
            ["Règle", "Au-dessus de la quantité seuil, fabriquer coûte moins cher ; en dessous, acheter coûte moins cher."],
          ],
          example: "Fabriquer coûte 60 000 € de frais fixes et 8 € par pièce ; acheter coûte 14 €. Seuil = 60 000 / (14 − 8) = 10 000 pièces. Pour 15 000 pièces, fabriquer est avantageux ; pour 6 000, mieux vaut acheter.",
        },
        {
          type: "key",
          points: [
            "Make or buy : coûts, compétences, contrôle, risque.",
            "Seuil = frais fixes / (prix d'achat − coût variable).",
            "On garde en interne ce qui est stratégique ; le reste se confie à des spécialistes.",
          ],
        },
      ],
      quiz: [
        () => {
          const fixed = int(2, 9) * 20000
          const buy = int(10, 20)
          const variable = buy - pick([2, 4, 5])
          return numQuestion({
            q: `Fabriquer coûte ${fmt(fixed)} € de frais fixes et ${variable} € par pièce ; acheter coûte ${buy} € la pièce. Quelle est la quantité seuil ?`,
            answer: fixed / (buy - variable),
            unit: "pièces",
            digits: 0,
            explain: `${fmt(fixed)} / (${buy} − ${variable}) = ${fmt(fixed / (buy - variable), 0)} pièces.`,
            wrong: [fixed / buy, fixed / variable, fixed * (buy - variable), fixed / (buy + variable)],
          })
        },
        () => {
          const fixed = int(3, 10) * 10000
          const variable = int(5, 10)
          const q = int(5, 20) * 1000
          return numQuestion({
            q: `Fabriquer ${fmt(q)} pièces coûte ${fmt(fixed)} € de frais fixes plus ${variable} € par pièce. Quel est le coût total ?`,
            answer: fixed + variable * q,
            unit: "€",
            digits: 0,
            explain: `${fmt(fixed)} + ${variable} × ${fmt(q)} = ${fmt(fixed + variable * q, 0)} €.`,
            wrong: [variable * q, fixed * variable, fixed + variable + q, (fixed + variable * q) / 2],
          })
        },
        () => {
          const q = int(5, 20) * 1000
          const buy = int(10, 20)
          return numQuestion({
            q: `Acheter ${fmt(q)} pièces à ${buy} € l'une coûte combien au total ?`,
            answer: q * buy,
            unit: "€",
            digits: 0,
            explain: `${fmt(q)} × ${buy} = ${fmt(q * buy, 0)} €.`,
            wrong: [q + buy, q / buy, q * buy * 2, q * (buy - 2)],
          })
        },
        {
          q: "Que signifie make or buy ?",
          choices: ["Faire en interne ou acheter à l'extérieur", "Fabriquer en grande série ou en petite série", "Vendre en ligne ou en magasin", "Exporter ou importer"],
          answer: 0,
          explain: "La décision concerne une activité : on la réalise soi-même ou on la confie à un tiers.",
        },
        {
          q: "Quel argument plaide pour faire soi-même ?",
          choices: ["Un savoir-faire stratégique à protéger", "Un manque total de compétence interne et de machines", "Un volume très faible et irrégulier toute l'année", "L'absence de machines disponibles dans l'usine actuelle"],
          answer: 0,
          explain: "Une activité qui fait la différence face aux concurrents est rarement externalisée.",
        },
        {
          q: "Quel argument plaide pour faire faire ?",
          choices: ["Un spécialiste plus efficace et plus flexible", "Un besoin de contrôle total du savoir-faire et des plans", "Un très gros volume stable et prévisible toute l'année", "Des machines inoccupées dans l'usine pendant des mois"],
          answer: 0,
          explain: "L'expertise externe et la souplesse sur les volumes sont les atouts classiques de l'externalisation.",
        },
        {
          q: "Au-dessus de la quantité seuil, que vaut-il mieux faire ?",
          choices: ["Fabriquer soi-même", "Acheter à l'extérieur", "Ne rien produire", "Doubler les achats"],
          answer: 0,
          explain: "Au-delà du seuil, les frais fixes sont assez répartis pour que fabriquer coûte moins par pièce.",
        },
        {
          q: "Que représentent les frais fixes de fabrication ?",
          choices: ["Machines, outillage et personnel dédié", "La matière consommée par pièce fabriquée", "Le prix d'achat d'une pièce chez un fournisseur", "Le transport d'une commande vers un client"],
          answer: 0,
          explain: "Ils existent quel que soit le volume ; plus on produit, plus ils sont répartis.",
        },
        {
          q: "Pourquoi s'intéresser au « cœur de métier » ?",
          choices: ["Pour concentrer les équipes sur ce qui fait la valeur", "Pour externaliser toutes les activités de l'entreprise", "Pour supprimer définitivement les achats extérieurs", "Pour réduire volontairement la qualité des produits"],
          answer: 0,
          explain: "On garde en interne ce qui différencie l'entreprise et on externalise le reste.",
        },
      ],
    },

    {
      id: "technologies",
      title: "IA, data et technologies de la supply chain",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "Des outils qui changent le métier",
          body: "Les **données** et les **technologies** transforment la supply chain : les systèmes peuvent **prévoir**, **optimiser**, **automatiser** et **tracer** plus vite et plus précisément. Un responsable doit savoir **ce que chaque technologie apporte** et **à quelles conditions**.",
        },
        {
          type: "list",
          title: "Les principales technologies",
          items: [
            ["Data analytics et IA", "Prévisions de la demande, détection d'anomalies, optimisation des tournées et des stocks."],
            ["IoT (objets connectés)", "Capteurs de position, température, choc sur les palettes, conteneurs, véhicules."],
            ["Robotique et automatisation", "Robots de préparation, convoyeurs, chariots autonomes."],
            ["Jumeau numérique", "Modèle virtuel d'un entrepôt ou d'une chaîne pour simuler des scénarios avant d'agir."],
            ["Blockchain", "Registre partagé et infalsifiable pour tracer l'origine d'un produit (usages encore limités)."],
            ["Drones et véhicules autonomes", "Livraisons ou inventaires en cours d'expérimentation."],
          ],
        },
        {
          type: "text",
          title: "L'IA générative et les assistants",
          body: "Les **assistants basés sur l'IA** aident à rédiger des mails, résumer des contrats, analyser des retards ou interroger des données en langage courant. Ils font **gagner du temps** mais peuvent se **tromper** : les décisions importantes restent **vérifiées par un humain**, et les **données confidentielles** ne doivent pas être confiées à n'importe quel outil.",
        },
        {
          type: "list",
          title: "Les conditions de réussite",
          items: [
            ["Des données fiables", "Sans données propres, aucune technologie ne tient ses promesses."],
            ["Un problème clair", "On part du besoin, pas de la technologie à la mode."],
            ["Un test à petite échelle", "Pilote, mesure des gains, puis généralisation."],
            ["Des équipes formées", "Les personnes doivent comprendre et accepter l'outil."],
          ],
        },
        {
          type: "key",
          points: [
            "Technologies : IA et analyse de données, IoT, robotique, jumeau numérique, blockchain.",
            "L'IA aide à décider, mais ne remplace pas la vérification humaine.",
            "On part d'un besoin, avec des données fiables, et on teste d'abord à petite échelle.",
          ],
        },
      ],
      quiz: [
        () => {
          const err = int(15, 25)
          const gain = pick([20, 30, 40])
          return numQuestion({
            q: `Une IA réduit l'erreur de prévision de ${err} % de ${gain} % (en relatif). Quelle est la nouvelle erreur ?`,
            answer: err * (1 - gain / 100),
            unit: "%",
            digits: 1,
            explain: `${err} × (1 − ${gain} %) = ${fmt(err * (1 - gain / 100), 1)} %.`,
            wrong: [err - gain, err, err * (1 + gain / 100), err * gain / 100],
          })
        },
        () => {
          const orders = int(100, 800, 50)
          const sec = pick([30, 45, 60])
          return numQuestion({
            q: `Un robot de préparation fait gagner ${sec} secondes sur chacune des ${orders} commandes du jour. Combien de minutes sont gagnées ?`,
            answer: (orders * sec) / 60,
            unit: "minutes",
            digits: 0,
            explain: `${orders} × ${sec} s = ${fmt(orders * sec)} s, soit ${fmt((orders * sec) / 60, 0)} minutes.`,
            wrong: [orders * sec, orders / sec, (orders * sec) / 600, ((orders * sec) / 60) * 2],
          })
        },
        () => {
          const sensors = int(100, 500, 50)
          const price = int(15, 60, 5)
          return numQuestion({
            q: `Équiper ${sensors} palettes de capteurs IoT à ${price} € l'unité coûte combien au total ?`,
            answer: sensors * price,
            unit: "€",
            digits: 0,
            explain: `${sensors} × ${price} = ${fmt(sensors * price, 0)} €.`,
            wrong: [sensors + price, sensors / price, sensors * price * 2, sensors * (price - 5)],
          })
        },
        {
          q: "À quoi sert un jumeau numérique ?",
          choices: ["Simuler des scénarios sur un modèle virtuel", "Remplacer tous les salariés de la logistique", "Fabriquer des produits identiques en grande série", "Signer des contrats automatiquement sans contrôle"],
          answer: 0,
          explain: "Le jumeau numérique reproduit un site ou une chaîne : on teste avant d'agir dans la réalité.",
        },
        {
          q: "Que mesurent les capteurs IoT sur un conteneur ?",
          choices: ["Position, température et chocs", "Les salaires versés aux chauffeurs du transporteur", "Le prix des matières premières achetées", "Le nombre de clients livrés chaque jour"],
          answer: 0,
          explain: "Ils suivent l'état et la position des marchandises en temps réel.",
        },
        {
          q: "Que fait la blockchain en logistique ?",
          choices: ["Elle trace l'origine dans un registre partagé", "Elle remplace les camions et les entrepôts", "Elle fabrique les produits à la demande", "Elle fixe les prix du fret maritime mondial"],
          answer: 0,
          explain: "Un registre partagé et infalsifiable aide à prouver l'origine et les étapes d'un produit.",
        },
        {
          q: "Quelle précaution prendre avec un assistant basé sur l'IA ?",
          choices: ["Vérifier les résultats importants", "Lui confier toutes les décisions", "Ne jamais lire ses réponses", "Lui donner les données confidentielles"],
          answer: 0,
          explain: "Ces outils peuvent se tromper ou inventer : un humain valide ce qui a un impact.",
        },
        {
          q: "Par quoi commence-t-on un projet technologique ?",
          choices: ["Par un besoin clair et des données fiables", "Par l'achat de la technologie la plus récente", "Par une généralisation immédiate", "Par la suppression des équipes"],
          answer: 0,
          explain: "Une technologie sans besoin précis ni données fiables apporte rarement de la valeur.",
        },
        {
          q: "Pourquoi tester à petite échelle ?",
          choices: ["Pour mesurer les gains avant de généraliser", "Pour retarder la décision indéfiniment sans raison", "Pour éviter de devoir former les équipes concernées", "Pour augmenter volontairement le coût du projet"],
          answer: 0,
          explain: "Un pilote limite le risque et fournit des chiffres pour décider de la suite.",
        },
      ],
    },

    {
      id: "tendances",
      title: "Les grandes tendances de demain",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Une supply chain en mouvement",
          body: "Plusieurs forces redessinent la supply chain : les **crises répétées**, les **attentes des clients** (livraison rapide, personnalisation), la **pression environnementale** et la **révolution des données**. Connaître ces tendances aide à **orienter ses compétences** et à **comprendre les choix** des entreprises.",
        },
        {
          type: "list",
          title: "Les tendances clés",
          items: [
            ["Résilience et agilité", "Plus de sources, de stocks stratégiques, de visibilité : on accepte un peu de coût pour mieux résister."],
            ["Relocalisation et proximité", "Rapprocher production et marchés (nearshoring, reshoring) pour réduire délais et risques."],
            ["Durabilité", "Mesurer et réduire les émissions, économie circulaire, reporting obligatoire."],
            ["Personnalisation et rapidité", "Livraison en un jour, produits sur mesure, retours simplifiés."],
            ["Automatisation et données", "Robots, IA, jumeaux numériques, tours de contrôle."],
            ["Collaboration", "Partage de données avec les fournisseurs et les clients pour mieux planifier."],
          ],
        },
        {
          type: "list",
          title: "Les métiers qui évoluent",
          items: [
            ["Analyste de données supply chain", "Exploite les données pour prévoir et optimiser."],
            ["Responsable résilience / risques", "Cartographie les risques et prépare les plans."],
            ["Responsable supply chain durable", "Pilote les émissions et la conformité."],
            ["Planificateur S&OP", "Fait le lien entre ventes, production et finance."],
            ["Responsable automatisation", "Choisit et déploie les robots et systèmes."],
          ],
        },
        {
          type: "text",
          title: "Cultiver ses compétences",
          body: "Les compétences recherchées combinent **techniques** (calcul, Excel, outils, données), **de gestion** (coûts, finance, risques) et **humaines** (négociation, communication, anglais, travail en équipe). Apprendre à **calculer**, **expliquer** et **décider avec des chiffres** reste la base, quelles que soient les technologies.",
        },
        {
          type: "key",
          points: [
            "Tendances : résilience, proximité, durabilité, personnalisation, automatisation, collaboration.",
            "Les métiers se tournent vers les données, les risques et la durabilité.",
            "Les compétences de fond (calcul, finance, communication, anglais) restent essentielles.",
          ],
        },
      ],
      quiz: [
        () => {
          const days = int(30, 90, 5)
          const cut = pick([20, 30, 40])
          return numQuestion({
            q: `Une relocalisation (nearshoring) réduit un délai d'approvisionnement de ${days} jours de ${cut} %. Quel est le nouveau délai ?`,
            answer: days * (1 - cut / 100),
            unit: "jours",
            digits: 1,
            explain: `${days} × (1 − ${cut} %) = ${fmt(days * (1 - cut / 100), 1)} jours.`,
            wrong: [days - cut, days * (1 + cut / 100), days * cut / 100, days / 2 + 5],
          })
        },
        () => {
          const orders = int(2, 10) * 1000
          const share = pick([20, 30, 40, 50])
          return numQuestion({
            q: `Sur ${fmt(orders)} commandes, ${share} % sont des produits personnalisés. Combien de commandes personnalisées cela fait-il ?`,
            answer: (orders * share) / 100,
            unit: "commandes",
            digits: 0,
            explain: `${fmt(orders)} × ${share} % = ${fmt((orders * share) / 100, 0)} commandes.`,
            wrong: [orders - (orders * share) / 100, orders * share, orders / share, (orders * share) / 10],
          })
        },
        {
          q: "Que signifie reshoring ?",
          choices: ["Ramener la production dans son pays d'origine", "Envoyer toute la production à l'autre bout du monde", "Réduire les stocks de conteneurs dans les ports", "Changer la marque des produits vendus au détail"],
          answer: 0,
          explain: "Le reshoring (ou relocalisation) rapproche la production du marché pour réduire délais et dépendance.",
        },
        {
          q: "Quelle tendance résulte directement des crises récentes ?",
          choices: ["La recherche de résilience et de visibilité", "La suppression de tous les stocks de sécurité", "La concentration des achats sur un seul fournisseur", "La baisse de la demande de données et d'indicateurs"],
          answer: 0,
          explain: "Les chocs ont montré le danger de chaînes tendues : on cherche plus de robustesse et d'information.",
        },
        {
          q: "Que cherche la durabilité en supply chain ?",
          choices: ["Réduire les émissions et les déchets", "Augmenter la vitesse maximale des camions", "Supprimer tous les fournisseurs étrangers du réseau", "Réduire le nombre de clients"],
          answer: 0,
          explain: "Mesurer et réduire l'empreinte carbone, développer l'économie circulaire et respecter le reporting sont les enjeux.",
        },
        {
          q: "Quel métier utilise surtout les données pour prévoir et optimiser ?",
          choices: ["Analyste de données supply chain", "Conducteur de chariot élévateur en entrepôt", "Agent de sécurité du site logistique", "Comptable fournisseurs du service financier"],
          answer: 0,
          explain: "Ce métier exploite les données pour améliorer prévisions, stocks et transports.",
        },
        {
          q: "Quelle compétence reste essentielle malgré l'IA ?",
          choices: ["Décider avec des chiffres et communiquer", "Écrire à la main tous les documents de l'entreprise", "Mémoriser toutes les formules de gestion par cœur", "Éviter tout travail en équipe avec les autres services"],
          answer: 0,
          explain: "Les outils calculent, mais il faut savoir interpréter, expliquer et décider.",
        },
        {
          q: "Pourquoi partager des données avec ses fournisseurs ?",
          choices: ["Pour mieux planifier ensemble", "Pour supprimer tous les contrats avec les fournisseurs", "Pour réduire volontairement la qualité des produits", "Pour cacher des informations aux fournisseurs"],
          answer: 0,
          explain: "Partager prévisions et stocks réduit l'effet coup de fouet et améliore le service pour tous.",
        },
      ],
    },
  ],
}
