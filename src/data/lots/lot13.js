// Lot 13 — Supply chain durable : Atelier (2 formules, 3 défis Excel, 2 études de cas) + Anglais (développement durable, faux amis 2).
import { fmt, int, pick } from '../gen.js'

export default {
  formulas: [
    {
      id: 'co2-transport',
      title: 'Émissions de CO₂ du transport',
      short: 'Émissions = tonnes × km × facteur / 1 000',
      course: {
        purpose:
          "Pour réduire l'empreinte carbone du transport, il faut d'abord la **calculer** : elle dépend de la **masse**, de la **distance** et du **mode**. On compare ensuite les modes et on chiffre ce que gagne un **report modal**.",
        formulas: ['Émissions (kg CO₂e) = masse (t) × distance (km) × facteur (g CO₂e/t.km) / 1 000', 'Économie = émissions du mode actuel − émissions du mode choisi', 'Intensité = émissions / chiffre d\'affaires (ou par colis)'],
        terms: [
          ['Tonne-kilomètre', 'Une tonne transportée sur un kilomètre.'],
          ['Facteur d\'émission', 'g CO₂e par tonne-kilomètre : environ 10-20 (mer), 20-30 (rail), 60-100 (route), 600-1 000 (avion).'],
          ['Report modal', 'Passage d\'un mode émetteur vers un mode plus sobre.'],
        ],
        example: {
          statement: '20 tonnes sur 1 000 km : camion à 80 g/t.km ou train à 25 g/t.km.',
          steps: ['Camion : 20 × 1 000 × 80 / 1 000 = 1 600 kg', 'Train : 20 × 1 000 × 25 / 1 000 = 500 kg', 'Économie = 1 100 kg CO₂e, soit 69 %'],
          result: 'Le train évite près de 70 % des émissions sur ce trajet.',
        },
        exercises: [
          () => {
            const t = int(5, 30)
            const km = int(2, 20) * 100
            const f = pick([60, 80, 100])
            return {
              kind: 'number',
              statement: 'Calcule les émissions d\'un transport routier.',
              data: [['Masse', `${t} t`], ['Distance', `${fmt(km)} km`], ['Facteur', `${f} g CO₂e/t.km`]],
              question: 'Émissions (en kg CO₂e) ?',
              answer: (t * km * f) / 1000,
              unit: 'kg',
              tolerance: 1,
              steps: [`${t} × ${fmt(km)} = ${fmt(t * km, 0)} t.km`, `${fmt(t * km, 0)} × ${f} / 1 000 = ${fmt((t * km * f) / 1000, 0)} kg CO₂e`],
              conclusion: 'On multiplie la masse par la distance, puis par le facteur du mode (en g, divisé par 1 000 pour les kg).',
            }
          },
          () => {
            const t = int(10, 30)
            const km = int(5, 20) * 100
            return {
              kind: 'number',
              statement: 'Calcule les kg de CO₂e économisés en passant du camion (80 g/t.km) au train (25 g/t.km).',
              data: [['Masse', `${t} t`], ['Distance', `${fmt(km)} km`]],
              question: 'Économie (en kg CO₂e) ?',
              answer: (t * km * 55) / 1000,
              unit: 'kg',
              tolerance: 1,
              steps: [`Camion : ${fmt((t * km * 80) / 1000, 0)} kg`, `Train : ${fmt((t * km * 25) / 1000, 0)} kg`, `Économie = ${fmt((t * km * 55) / 1000, 0)} kg`],
              conclusion: 'Le report modal est d\'autant plus rentable que la distance est longue.',
            }
          },
          () => {
            const t = int(1, 5)
            const km = int(5, 12) * 1000
            return {
              kind: 'number',
              statement: 'Compare l\'avion (800 g/t.km) et le bateau (15 g/t.km) : calcule le rapport entre leurs émissions.',
              data: [['Masse', `${t} t`], ['Distance', `${fmt(km)} km`]],
              question: 'L\'avion émet combien de fois plus que le bateau ?',
              answer: 800 / 15,
              unit: 'fois',
              tolerance: 0.5,
              steps: [`Avion : ${fmt((t * km * 800) / 1000, 0)} kg`, `Bateau : ${fmt((t * km * 15) / 1000, 0)} kg`, 'Rapport = 800 / 15 ≈ 53'],
              conclusion: 'À masse et distance égales, le rapport ne dépend que des facteurs d\'émission.',
            }
          },
          () => {
            const shipments = int(80, 400, 20)
            const kgPer = int(40, 150, 10)
            return {
              kind: 'number',
              statement: 'Calcule l\'intensité carbone moyenne par colis.',
              data: [['Colis expédiés', fmt(shipments)], ['Émissions totales', `${fmt(shipments * kgPer)} kg CO₂e`]],
              question: 'Émissions par colis (en kg CO₂e) ?',
              answer: kgPer,
              unit: 'kg',
              tolerance: 0.5,
              steps: [`${fmt(shipments * kgPer)} / ${fmt(shipments)} = ${fmt(kgPer, 0)} kg par colis`],
              conclusion: 'Cet indicateur permet de suivre l\'efficacité carbone sans dépendre du volume.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 't', label: 'Masse transportée', unit: 't', value: 20 },
            { key: 'km', label: 'Distance', unit: 'km', value: 1000 },
            { key: 'f1', label: 'Facteur mode actuel', unit: 'g/t.km', value: 80 },
            { key: 'f2', label: 'Facteur mode alternatif', unit: 'g/t.km', value: 25 },
          ],
          outputs: [
            { label: 'Émissions du mode actuel', unit: 'kg CO₂e', digits: 0, fn: (n) => (n.t * n.km * n.f1) / 1000 },
            { label: 'Émissions du mode alternatif', unit: 'kg CO₂e', digits: 0, fn: (n) => (n.t * n.km * n.f2) / 1000 },
            { label: 'Économie', unit: 'kg CO₂e', digits: 0, highlight: true, fn: (n) => (n.t * n.km * (n.f1 - n.f2)) / 1000 },
          ],
          steps: (n) => [`Actuel = ${fmt(n.t)} × ${fmt(n.km)} × ${fmt(n.f1)} / 1 000 = ${fmt((n.t * n.km * n.f1) / 1000, 0)} kg`],
          note: 'Les facteurs sont des ordres de grandeur : utilise ceux de ta base de données (ADEME) pour un vrai bilan.',
        },
      },
    },

    {
      id: 'taux-vide-emballage',
      title: 'Taux de vide et remplissage',
      short: 'Taux de vide = (volume carton − volume produit) / volume carton',
      course: {
        purpose:
          "Transporter de l'air coûte de l'argent et du carbone. Le **taux de vide** mesure la part d'un emballage qui ne contient pas de produit ; réduire ce taux permet de **charger plus de colis** par palette et par camion.",
        formulas: ['Taux de vide = (volume du carton − volume du produit) / volume du carton × 100', 'Colis par palette ≈ volume utile de la palette / volume du carton', 'Camions économisés = 1 − (anciens colis / nouveaux colis par camion)'],
        terms: [
          ['Volume du carton', 'Volume intérieur ou extérieur de l\'emballage (en litres ou dm³).'],
          ['Volume du produit', 'Volume réel occupé par le produit.'],
          ['Calage', 'Matériau qui occupe le vide pour protéger le produit.'],
        ],
        example: {
          statement: 'Carton de 60 L pour un produit de 24 L, remplacé par un carton de 36 L. Une palette contient 20 cartons de 60 L.',
          steps: ['Taux de vide initial = (60 − 24) / 60 = 60 %', 'Taux de vide final = (36 − 24) / 36 = 33 %', 'Cartons de 36 L par palette : 20 × 60 / 36 ≈ 33'],
          result: 'Le petit carton permet de passer de 20 à 33 colis par palette, soit 65 % de plus.',
        },
        exercises: [
          () => {
            const box = pick([40, 50, 60, 80])
            const product = Math.round(box * (int(30, 60) / 100))
            return {
              kind: 'number',
              statement: 'Calcule le taux de vide du carton.',
              data: [['Volume du carton', `${box} L`], ['Volume du produit', `${product} L`]],
              question: 'Taux de vide (en %) ?',
              answer: ((box - product) / box) * 100,
              unit: '%',
              tolerance: 0.3,
              steps: [`Vide = ${box} − ${product} = ${box - product} L`, `Taux = ${box - product} / ${box} × 100 = ${fmt(((box - product) / box) * 100, 1)} %`],
              conclusion: 'Un taux de vide élevé signale un emballage trop grand pour le produit.',
            }
          },
          () => {
            const old = pick([60, 80, 100])
            const neu = old - pick([20, 30, 40])
            const perPallet = int(15, 30)
            return {
              kind: 'number',
              statement: 'Un carton plus petit permet de charger plus de colis sur la même palette (volume utile constant).',
              data: [['Ancien carton', `${old} L`], ['Nouveau carton', `${neu} L`], ['Colis par palette (ancien)', String(perPallet)]],
              question: 'Colis par palette avec le nouveau carton (arrondi à l\'entier) ?',
              answer: Math.round((perPallet * old) / neu),
              unit: 'colis',
              tolerance: 0.5,
              steps: [`Volume utile = ${perPallet} × ${old} = ${perPallet * old} L`, `${perPallet * old} / ${neu} = ${fmt((perPallet * old) / neu, 1)} ≈ ${Math.round((perPallet * old) / neu)} colis`],
              conclusion: 'Un gain de volume par carton se transforme en nombre de colis par palette.',
            }
          },
          () => {
            const parcels = int(2, 12) * 1000
            const old = pick([24, 30, 40])
            const gain = pick([20, 25, 33, 40])
            const neu = old * (1 + gain / 100)
            return {
              kind: 'number',
              statement: 'Un meilleur remplissage permet de charger plus de colis par camion. Combien de camions économise-t-on ?',
              data: [['Colis à expédier', fmt(parcels)], ['Colis par camion (ancien)', String(old * 10)], ['Gain de chargement', `${gain} %`]],
              question: 'Camions économisés (arrondi à l\'entier) ?',
              answer: Math.round(parcels / (old * 10) - parcels / (old * 10 * (1 + gain / 100))),
              unit: 'camions',
              tolerance: 1,
              steps: [`Avant : ${fmt(parcels)} / ${old * 10} = ${fmt(parcels / (old * 10), 1)} camions`, `Après : ${fmt(parcels)} / ${fmt(old * 10 * (1 + gain / 100), 0)} = ${fmt(parcels / (old * 10 * (1 + gain / 100)), 1)} camions`, `Économie ≈ ${Math.round(parcels / (old * 10) - parcels / (old * 10 * (1 + gain / 100)))} camions`],
              conclusion: 'Moins de camions signifie moins de coûts, d\'émissions et de trafic.',
            }
          },
          () => {
            const parcels = int(10, 50) * 1000
            const saving = pick([0.1, 0.15, 0.2, 0.25])
            return {
              kind: 'number',
              statement: 'Un emballage plus petit réduit le coût de transport par colis. Calcule l\'économie annuelle.',
              data: [['Colis par an', fmt(parcels)], ['Économie par colis', `${fmt(saving)} €`]],
              question: 'Économie annuelle (en €) ?',
              answer: parcels * saving,
              unit: '€',
              tolerance: 5,
              steps: [`${fmt(parcels)} × ${fmt(saving)} = ${fmt(parcels * saving, 0)} €`],
              conclusion: 'Quelques centimes par colis représentent plusieurs milliers d\'euros à l\'échelle d\'une année.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'box', label: 'Volume du carton', unit: 'L', value: 60 },
            { key: 'prod', label: 'Volume du produit', unit: 'L', value: 24 },
            { key: 'box2', label: 'Nouveau carton', unit: 'L', value: 36 },
          ],
          outputs: [
            { label: 'Taux de vide actuel', unit: '%', digits: 0, fn: (n) => (n.box > 0 ? ((n.box - n.prod) / n.box) * 100 : 0) },
            { label: 'Taux de vide du nouveau carton', unit: '%', digits: 0, fn: (n) => (n.box2 > 0 ? ((n.box2 - n.prod) / n.box2) * 100 : 0) },
            { label: 'Gain de colis par palette', unit: '%', digits: 0, highlight: true, fn: (n) => (n.box2 > 0 ? (n.box / n.box2 - 1) * 100 : 0) },
          ],
          steps: (n) => [`Gain = ${fmt(n.box)} / ${fmt(n.box2)} − 1 = ${fmt(n.box2 > 0 ? (n.box / n.box2 - 1) * 100 : 0, 0)} %`],
          note: 'Le nouveau carton doit rester assez grand pour protéger le produit.',
        },
      },
    },
  ],

  excel: [
    {
      id: 'co2-expeditions',
      fn: 'SOMMEPROD',
      level: 3,
      tier: 5,
      title: 'Les émissions de plusieurs expéditions',
      context: 'Tu calcules les émissions des expéditions du mois : chaque ligne donne une masse, une distance et le facteur du mode.',
      instruction: 'En **E7**, calcule les **émissions totales en kg CO₂e** : somme de (tonnes × km × facteur) ÷ 1 000.',
      generate() {
        const modes = [['Route', 80], ['Rail', 25], ['Mer', 15], ['Route', 80], ['Rail', 25]]
        return { rows: [['Expédition', 'Tonnes', 'Km', 'Facteur (g/t.km)'], ...modes.map((m, i) => [`${m[0]} ${i + 1}`, int(5, 30), int(2, 20) * 100, m[1]])], extra: { E1: 'Total kg CO₂e', D7: 'Total' } }
      },
      target: 'E7',
      solution: '=SOMMEPROD(B2:B6;C2:C6;D2:D6)/1000',
      mustUse: ['SOMMEPROD'],
      hints: ['SOMMEPROD accepte trois plages : tonnes, km, facteurs.', 'Divise le résultat par 1 000 pour passer des grammes aux kilogrammes.'],
      explain: 'SOMMEPROD multiplie les trois colonnes ligne par ligne puis additionne : on obtient la somme des g CO₂e, à diviser par 1 000 pour les kg.',
    },
    {
      id: 'mode-moins-emetteur',
      minResults: 3,
      fn: 'MIN',
      level: 2,
      tier: 3,
      title: 'Le mode le moins émetteur',
      context: 'Tu compares les émissions de plusieurs modes pour une même expédition.',
      instruction: 'En **B7**, indique le **nom du mode le moins émetteur** (utilise INDEX et EQUIV avec MIN).',
      generate() {
        const t = int(10, 30)
        const modes = [['Route', int(60, 100, 5)], ['Rail', int(20, 30)], ['Fluvial', int(30, 40)], ['Mer', int(10, 18)], ['Air', int(600, 900, 50)]]
        const rows = modes.map((m) => [m[0], Math.round((t * int(3, 15) * 100 * m[1]) / 1000)])
        return { rows: [['Mode', 'Émissions (kg CO₂e)'], ...rows], extra: { A7: 'Mode le plus sobre' } }
      },
      target: 'B7',
      solution: '=INDEX(A2:A6;EQUIV(MIN(B2:B6);B2:B6;0))',
      mustUse: ['INDEX', 'EQUIV', 'MIN'],
      hints: ['MIN(B2:B6) donne la plus petite émission.', 'EQUIV(...;B2:B6;0) trouve sa position, INDEX(A2:A6;position) renvoie le nom du mode.'],
      explain: 'On cherche d\'abord la valeur minimale, puis sa ligne avec EQUIV, enfin le nom correspondant avec INDEX : une combinaison classique pour retrouver « qui a le minimum ».',
    },
    {
      id: 'taux-vide-excel',
      fn: 'ARRONDI',
      level: 2,
      tier: 5,
      title: 'Le taux de vide',
      context: 'Tu mesures le remplissage des cartons d\'expédition.',
      instruction: 'En **B4**, calcule le **taux de vide en %** : (volume du carton − volume du produit) ÷ volume du carton × 100, **arrondi à l\'entier**.',
      generate() {
        const box = pick([40, 50, 60, 80])
        return { rows: [['Volume du carton (L)', box], ['Volume du produit (L)', Math.round(box * (int(30, 60) / 100))], ['Colis par palette', int(15, 30)]], extra: { A4: 'Taux de vide (%)' } }
      },
      target: 'B4',
      solution: '=ARRONDI((B1-B2)/B1*100;0)',
      mustUse: ['ARRONDI'],
      hints: ['Le volume vide est B1 − B2.', 'Divise-le par B1, multiplie par 100 et arrondis à l\'entier.'],
      explain: 'Le taux de vide rapporte le volume vide au volume du carton : un taux de 50 % signifie que la moitié du colis est de l\'air.',
    },
  ],

  cases: [
    {
      id: 'choix-mode-co2',
      title: 'Camion, train ou bateau ?',
      role: "Responsable transport d'un fabricant de meubles",
      lesson: 'durable/transport-bas-carbone',
      generate() {
        const t = int(15, 25)
        const km = int(6, 12) * 100
        const roadDays = 2
        const railDays = pick([3, 4])
        const road = (t * km * 80) / 1000
        const rail = (t * km * 25) / 1000
        const roadCost = int(900, 1500, 50)
        const railCost = roadCost - int(100, 300, 50)
        return {
          intro: `Tu expédies ${t} tonnes de meubles sur ${fmt(km)} km. Le camion (80 g CO₂e/t.km) coûte ${fmt(roadCost)} € et arrive en ${roadDays} jours. Le train combiné (25 g CO₂e/t.km) coûte ${fmt(railCost)} € et arrive en ${railDays} jours. L'entreprise s'est fixé un objectif de réduction de ses émissions de transport.`,
          steps: [
            {
              situation: 'Quelle économie d\'émissions apporte le train ?',
              better: `Camion : ${t} × ${fmt(km)} × 80 / 1 000 = ${fmt(road, 0)} kg ; train : ${fmt(rail, 0)} kg. Économie : ${fmt(road - rail, 0)} kg CO₂e, soit ${fmt(((road - rail) / road) * 100, 0)} %.`,
              choices: [
                { text: `${fmt(road - rail, 0)} kg de CO₂e, soit ${fmt(((road - rail) / road) * 100, 0)} %.`, points: 3, feedback: `${fmt(road, 0)} − ${fmt(rail, 0)} = ${fmt(road - rail, 0)} kg : le train émet environ ${fmt((rail / road) * 100, 0)} % de ce que le camion émet.` },
                { text: `${fmt(rail, 0)} kg : c'est tout ce qu'émet le train.`, points: 1, feedback: 'Ce sont les émissions du train, pas l\'économie : il faut soustraire celles du camion.' },
                { text: 'Aucune économie : les deux modes émettent pareil.', points: 0, feedback: 'Les facteurs sont très différents (80 contre 25 g/t.km) : l\'écart est important.' },
              ],
            },
            {
              situation: `Le train est ${fmt(roadCost - railCost)} € moins cher mais ${railDays - roadDays} jour${railDays - roadDays > 1 ? 's' : ''} plus lent. Quelle décision prends-tu ?`,
              better: `Le train est à la fois moins cher et beaucoup moins émetteur. Le délai supplémentaire est acceptable si le client peut l'absorber ; sinon on garde le camion pour les urgences. Ici, on peut passer au train pour les expéditions planifiées.`,
              choices: [
                { text: 'Je passe au train pour les expéditions planifiées et je garde le camion pour les urgences.', points: 3, feedback: 'Un mix de modes combine économie, réduction des émissions et réactivité.' },
                { text: 'Je garde le camion partout : le délai est plus court.', points: 1, feedback: 'Pour les envois non urgents, le délai supplémentaire est sans conséquence et le train coûte moins cher.' },
                { text: 'Je passe tout en avion pour être plus rapide.', points: 0, feedback: 'L\'avion émet 10 à 50 fois plus et coûte beaucoup plus : à l\'inverse de l\'objectif.' },
              ],
            },
            {
              situation: 'Comment suis-tu les résultats ?',
              better: "En suivant les émissions par mode et par client (kg CO₂e par tonne ou par colis), le taux de remplissage et le respect des délais. Les chiffres alimentent le bilan carbone et le reporting RSE.",
              choices: [
                { text: 'Un suivi des émissions par mode, du remplissage et des délais.', points: 3, feedback: 'Mesurer permet de vérifier la réduction obtenue et de la valoriser dans le reporting RSE.' },
                { text: 'Je ne mesure rien : on a changé de mode, cela suffit.', points: 0, feedback: 'Sans mesure, on ne peut ni prouver la baisse ni détecter une dérive.' },
                { text: 'Je mesure uniquement le prix.', points: 1, feedback: 'Le prix compte, mais l\'objectif initial portait sur les émissions : il faut les suivre aussi.' },
              ],
            },
          ],
          debrief: `Le train évite ${fmt(road - rail, 0)} kg de CO₂e sur ce trajet (${fmt(((road - rail) / road) * 100, 0)} %) tout en coûtant moins cher. On l'utilise pour les flux planifiés, on garde le camion pour les urgences et on mesure les résultats.`,
        }
      },
    },
    {
      id: 'emballage-vide',
      title: 'Trop d\'air dans les cartons',
      role: "Responsable logistique d'un site e-commerce de cosmétiques",
      lesson: 'durable/emballages',
      generate() {
        const box = pick([48, 60, 72])
        const product = Math.round(box * 0.4)
        const neu = Math.round(product * 1.4)
        const vide1 = ((box - product) / box) * 100
        const vide2 = ((neu - product) / neu) * 100
        const parcels = int(5, 20) * 10000
        const saving = pick([0.15, 0.2, 0.25])
        const eco = parcels * saving
        return {
          intro: `Ton site expédie ${fmt(parcels)} colis par an dans des cartons de ${box} litres pour des produits de ${product} litres. Un fournisseur propose un carton de ${neu} litres, un peu plus cher à l'achat mais qui réduirait le coût de transport de ${fmt(saving)} € par colis.`,
          steps: [
            {
              situation: 'Quel est le taux de vide actuel, et celui du nouveau carton ?',
              better: `Aujourd'hui : (${box} − ${product}) / ${box} = ${fmt(vide1, 0)} % de vide. Avec le carton de ${neu} L : (${neu} − ${product}) / ${neu} = ${fmt(vide2, 0)} %. On transporte beaucoup moins d'air.`,
              choices: [
                { text: `${fmt(vide1, 0)} % aujourd'hui, ${fmt(vide2, 0)} % avec le nouveau carton.`, points: 3, feedback: `(${box} − ${product}) / ${box} = ${fmt(vide1, 0)} % ; (${neu} − ${product}) / ${neu} = ${fmt(vide2, 0)} %.` },
                { text: `${fmt((product / box) * 100, 0)} % : le rapport produit sur carton.`, points: 1, feedback: 'C\'est le taux de remplissage, pas le taux de vide : le vide est son complément à 100 %.' },
                { text: 'Impossible à calculer sans connaître la couleur du carton.', points: 0, feedback: 'Seuls les volumes comptent pour calculer le taux de vide.' },
              ],
            },
            {
              situation: `Le nouveau carton coûte plus cher à l'achat. Comment décides-tu ?`,
              better: `Économie de transport : ${fmt(parcels)} × ${fmt(saving)} € = ${fmt(eco, 0)} € par an. Il faut la comparer au surcoût d'achat du carton, mais aussi aux gains annexes (moins de calage, moins de camions, moins de matière).`,
              choices: [
                { text: `Je compare l'économie (${fmt(eco, 0)} € par an) au surcoût d'achat et je compte les gains annexes.`, points: 3, feedback: 'Un raisonnement en coût total : transport, matière, calage, émissions.' },
                { text: 'Je regarde uniquement le prix du carton.', points: 0, feedback: 'Le transport représente souvent plus que l\'emballage : on risquerait de refuser une économie nette.' },
                { text: 'J\'accepte sans calcul : plus petit, c\'est toujours mieux.', points: 1, feedback: 'Il faut vérifier la protection du produit et le coût total avant de décider.' },
              ],
            },
            {
              situation: 'Quelle précaution prends-tu avant le déploiement ?',
              better: "Un carton trop juste augmente la casse et les retours. On teste le nouveau carton sur un échantillon (essais de chute, taux de casse, avis clients) avant de généraliser.",
              choices: [
                { text: 'Un test sur un échantillon avec mesure de la casse avant de généraliser.', points: 3, feedback: 'Le gain de transport serait vite annulé par une hausse de la casse et des retours.' },
                { text: 'Aucun test : le fournisseur garantit tout.', points: 0, feedback: 'Seul un essai dans vos conditions réelles confirme la protection du produit.' },
                { text: 'Je réduis aussi le calage au minimum sans test.', points: 1, feedback: 'Réduire le calage sans test expose le produit à la casse.' },
              ],
            },
          ],
          debrief: `Le taux de vide passerait de ${fmt(vide1, 0)} % à ${fmt(vide2, 0)} %, pour ${fmt(eco, 0)} € d'économie de transport par an. On compare au surcoût du carton et on teste la protection avant de généraliser.`,
        }
      },
    },
  ],

  english: {
    units: [
      {
        id: 'durable-en',
        title: 'Développement durable',
        icon: 'cart',
        color: 'emerald',
        lessons: [
          {
            id: 'durable-mots',
            title: 'Vocabulaire du développement durable',
            level: 2,
            items: [
              { en: 'carbon footprint', fr: 'empreinte carbone', def: "Quantité totale de gaz à effet de serre émise par une activité ou un produit.", ex: 'We measure our carbon footprint every year.', exFr: 'Nous mesurons notre empreinte carbone chaque année.' },
              { en: 'emissions', fr: 'émissions', def: "Gaz rejetés dans l'air par des machines, des véhicules ou des usines.", ex: 'Emissions fell by ten percent.', exFr: 'Les émissions ont baissé de dix pour cent.' },
              { en: 'sustainable', fr: 'durable', def: "Qui répond aux besoins actuels sans abîmer l'environnement pour les générations futures.", ex: 'We want a sustainable supply chain.', exFr: 'Nous voulons une chaîne logistique durable.' },
              { en: 'renewable energy', fr: 'énergie renouvelable', def: "Énergie qui vient de sources qui ne s'épuisent pas, comme le soleil ou le vent.", ex: 'The warehouse uses renewable energy.', exFr: 'L\'entrepôt utilise de l\'énergie renouvelable.' },
              { en: 'recycling', fr: 'recyclage', def: "Transformation de déchets en nouvelles matières ou nouveaux produits.", ex: 'Recycling is part of our policy.', exFr: 'Le recyclage fait partie de notre politique.' },
              { en: 'waste', fr: 'déchets (gaspillage)', def: "Ce qui est jeté parce qu'on ne l'utilise plus ; ou ressources perdues inutilement.", ex: 'We try to reduce waste.', exFr: 'Nous essayons de réduire les déchets.' },
              { en: 'reusable', fr: 'réutilisable', def: "Que l'on peut utiliser plusieurs fois.", ex: 'These pallets are reusable.', exFr: 'Ces palettes sont réutilisables.' },
              { en: 'energy efficiency', fr: 'efficacité énergétique', def: "Capacité à fournir le même service en consommant moins d'énergie.", ex: 'Energy efficiency saves money.', exFr: 'L\'efficacité énergétique fait économiser de l\'argent.' },
            ],
          },
          {
            id: 'durable-phrases',
            title: 'Parler de durabilité',
            level: 3,
            items: [
              { en: 'We aim to cut our emissions by thirty percent.', fr: 'Nous visons à réduire nos émissions de trente pour cent.', blank: 'aim' },
              { en: 'Rail transport produces fewer emissions than road transport.', fr: 'Le transport ferroviaire produit moins d\'émissions que le transport routier.', blank: 'fewer' },
              { en: 'Our suppliers must follow environmental standards.', fr: 'Nos fournisseurs doivent respecter des normes environnementales.', blank: 'standards' },
              { en: 'We are switching to electric vehicles.', fr: 'Nous passons aux véhicules électriques.', blank: 'switching' },
              { en: 'Please use recycled cardboard for the boxes.', fr: 'Veuillez utiliser du carton recyclé pour les boîtes.', blank: 'recycled' },
              { en: 'The report shows a clear reduction in waste.', fr: 'Le rapport montre une nette réduction des déchets.', blank: 'reduction' },
            ],
          },
        ],
      },
      {
        id: 'faux-amis-2',
        title: 'Les faux amis (suite)',
        icon: 'alert',
        color: 'orange',
        lessons: [
          {
            id: 'faux-amis-suite',
            title: 'Encore des pièges',
            level: 2,
            items: [
              { en: 'sensible', fr: 'raisonnable', def: "Qui montre du bon sens, qui est raisonnable.", ex: 'That is a sensible decision.', exFr: 'C\'est une décision raisonnable.', note: 'Piège : « sensible » en français se dit « sensitive ».' },
              { en: 'location', fr: 'emplacement (lieu)', def: "Endroit précis où se trouve quelque chose ou quelqu'un.", ex: 'The location of the warehouse is perfect.', exFr: 'L\'emplacement de l\'entrepôt est parfait.', note: 'Piège : « location » (louer) se dit « rental ».' },
              { en: 'ignore', fr: 'ne pas tenir compte de', def: "Choisir de ne pas faire attention à quelque chose.", ex: 'Please do not ignore this alert.', exFr: "Merci de ne pas ignorer cette alerte.", note: "Piège : « ignorer » (ne pas savoir) se dit « not to know »." },
              { en: 'commodity', fr: 'matière première (produit de base)', def: "Produit de base échangé en grande quantité, comme le pétrole ou le blé.", ex: 'Oil is a commodity.', exFr: 'Le pétrole est une matière première.', note: 'Piège : « commodité » (confort) se dit « convenience ».' },
              { en: 'fabric', fr: 'tissu', def: "Matière textile utilisée pour fabriquer des vêtements ou des housses.", ex: 'This fabric is made in Portugal.', exFr: 'Ce tissu est fabriqué au Portugal.', note: 'Piège : « fabrique » (usine) se dit « factory ».' },
              { en: 'lecture', fr: 'cours magistral', def: "Exposé fait par un enseignant devant des étudiants.", ex: 'The lecture starts at nine.', exFr: 'Le cours magistral commence à neuf heures.', note: 'Piège : « lecture » (action de lire) se dit « reading ».' },
              { en: 'journey', fr: 'trajet (voyage)', def: "Déplacement d'un endroit à un autre, souvent assez long.", ex: 'The journey takes two days.', exFr: 'Le trajet dure deux jours.', note: 'Piège : « journée » se dit « day ».' },
              { en: 'sympathetic', fr: 'compatissant', def: "Qui comprend et partage la peine de quelqu'un d'autre.", ex: 'The manager was sympathetic.', exFr: 'Le responsable s\'est montré compréhensif.', note: 'Piège : « sympathique » se dit « nice » ou « friendly ».' },
            ],
          },
        ],
      },
    ],
  },
}
