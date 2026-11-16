// Lot 15 — Finance et supply chain : Atelier (3 formules, 3 défis Excel, 2 études de cas) + Anglais (présenter son entreprise et son poste).
import { fmt, int, pick } from '../gen.js'

export default {
  formulas: [
    {
      id: 'bfr-cash-to-cash',
      title: 'BFR et cycle cash-to-cash',
      short: 'BFR = stocks + créances − dettes ; C2C = DIO + DSO − DPO',
      course: {
        purpose:
          "Le **BFR** mesure l'argent immobilisé par l'activité ; le **cycle cash-to-cash** l'exprime en **jours**. Ensemble, ils chiffrent l'effet des stocks, des délais clients et des délais fournisseurs sur la trésorerie.",
        formulas: ['BFR = stocks + créances clients − dettes fournisseurs', 'DIO = stock moyen / coût des ventes × 365', 'DSO = créances clients / CA × 365', 'DPO = dettes fournisseurs / achats × 365', 'Cash-to-cash = DIO + DSO − DPO'],
        terms: [
          ['DIO', 'Nombre de jours de stock.'],
          ['DSO', 'Délai moyen de paiement des clients.'],
          ['DPO', 'Délai moyen de paiement des fournisseurs.'],
        ],
        example: {
          statement: 'Stock 400 000 €, coût des ventes 3 000 000 €, créances 600 000 €, CA 4 000 000 €, dettes 500 000 €, achats 2 400 000 €.',
          steps: ['BFR = 400 + 600 − 500 = 500 000 €', 'DIO = 400 / 3 000 × 365 ≈ 49 jours', 'DSO = 600 / 4 000 × 365 ≈ 55 jours', 'DPO = 500 / 2 400 × 365 ≈ 76 jours', 'Cash-to-cash = 49 + 55 − 76 = 28 jours'],
          result: 'Il s\'écoule en moyenne 28 jours entre le paiement des fournisseurs et l\'encaissement des clients.',
        },
        exercises: [
          () => {
            const stock = int(2, 8) * 100000
            const cred = int(3, 9) * 100000
            const dettes = int(2, 7) * 100000
            return {
              kind: 'number',
              statement: 'Calcule le BFR.',
              data: [['Stocks', `${fmt(stock)} €`], ['Créances clients', `${fmt(cred)} €`], ['Dettes fournisseurs', `${fmt(dettes)} €`]],
              question: 'BFR (en €) ?',
              answer: stock + cred - dettes,
              unit: '€',
              tolerance: 1,
              steps: [`${fmt(stock)} + ${fmt(cred)} − ${fmt(dettes)} = ${fmt(stock + cred - dettes, 0)} €`],
              conclusion: 'Le BFR est l\'argent que l\'entreprise doit financer entre ses dépenses et ses encaissements.',
            }
          },
          () => {
            const stock = int(2, 8) * 100000
            const cogs = int(10, 40) * 100000
            return {
              kind: 'number',
              statement: 'Calcule le nombre de jours de stock (DIO).',
              data: [['Stock moyen', `${fmt(stock)} €`], ['Coût des ventes annuel', `${fmt(cogs)} €`]],
              question: 'DIO (en jours) ?',
              answer: (stock / cogs) * 365,
              unit: 'jours',
              tolerance: 0.5,
              steps: [`${fmt(stock)} / ${fmt(cogs)} × 365 = ${fmt((stock / cogs) * 365, 1)} jours`],
              conclusion: 'Le DIO est le pendant « jours » de la rotation : 365 / rotation.',
            }
          },
          () => {
            const dio = int(30, 70)
            const dso = int(30, 60)
            const dpo = int(30, 80)
            return {
              kind: 'number',
              statement: 'Calcule le cycle cash-to-cash.',
              data: [['DIO', `${dio} jours`], ['DSO', `${dso} jours`], ['DPO', `${dpo} jours`]],
              question: 'Cash-to-cash (en jours, avec son signe) ?',
              answer: dio + dso - dpo,
              unit: 'jours',
              tolerance: 0.1,
              steps: [`${dio} + ${dso} − ${dpo} = ${dio + dso - dpo} jours`],
              conclusion: dio + dso - dpo > 0 ? 'Cycle positif : l\'entreprise doit financer cet écart.' : 'Cycle négatif : l\'entreprise encaisse avant de payer.',
            }
          },
          () => {
            const ca = int(10, 50) * 100000
            const days = int(5, 15)
            return {
              kind: 'number',
              statement: 'Un projet réduit le cash-to-cash. Estime la trésorerie libérée (année de 365 jours).',
              data: [['Chiffre d\'affaires annuel', `${fmt(ca)} €`], ['Réduction du cycle', `${days} jours`]],
              question: 'Trésorerie libérée (en €) ?',
              answer: (ca / 365) * days,
              unit: '€',
              tolerance: 50,
              steps: [`CA par jour = ${fmt(ca)} / 365 = ${fmt(ca / 365, 0)} €`, `× ${days} jours = ${fmt((ca / 365) * days, 0)} €`],
              conclusion: 'Chaque jour gagné sur le cycle libère l\'équivalent d\'un jour de chiffre d\'affaires.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'stock', label: 'Stock moyen', unit: '€', value: 400000 },
            { key: 'cogs', label: 'Coût des ventes annuel', unit: '€', value: 3000000 },
            { key: 'cred', label: 'Créances clients', unit: '€', value: 600000 },
            { key: 'ca', label: 'Chiffre d\'affaires annuel', unit: '€', value: 4000000 },
            { key: 'dettes', label: 'Dettes fournisseurs', unit: '€', value: 500000 },
            { key: 'achats', label: 'Achats annuels', unit: '€', value: 2400000 },
          ],
          outputs: [
            { label: 'BFR', unit: '€', digits: 0, fn: (n) => n.stock + n.cred - n.dettes },
            { label: 'DIO', unit: 'jours', digits: 0, fn: (n) => (n.cogs > 0 ? (n.stock / n.cogs) * 365 : 0) },
            { label: 'DSO', unit: 'jours', digits: 0, fn: (n) => (n.ca > 0 ? (n.cred / n.ca) * 365 : 0) },
            { label: 'DPO', unit: 'jours', digits: 0, fn: (n) => (n.achats > 0 ? (n.dettes / n.achats) * 365 : 0) },
            { label: 'Cash-to-cash', unit: 'jours', digits: 0, highlight: true, fn: (n) => (n.cogs > 0 && n.ca > 0 && n.achats > 0 ? (n.stock / n.cogs) * 365 + (n.cred / n.ca) * 365 - (n.dettes / n.achats) * 365 : 0) },
          ],
          steps: (n) => [`BFR = ${fmt(n.stock)} + ${fmt(n.cred)} − ${fmt(n.dettes)} = ${fmt(n.stock + n.cred - n.dettes)} €`],
          note: 'Les ratios sont calculés sur une année de 365 jours.',
        },
      },
    },

    {
      id: 'van-projet',
      title: 'VAN et délai de retour',
      short: 'VAN = Σ flux/(1+t)^n − investissement',
      course: {
        purpose:
          "Pour décider d'un investissement, on compare ce qu'il coûte à ce qu'il rapportera **en tenant compte du temps** : un gain lointain vaut moins qu'un gain proche. La **VAN** (valeur actuelle nette) chiffre la valeur créée ; le **délai de retour** donne le temps de récupération.",
        formulas: ['Valeur actuelle d\'un flux = flux / (1 + taux)^n', 'VAN = somme des valeurs actuelles − investissement', 'Délai de retour = investissement / gain annuel net'],
        terms: [
          ['Taux d\'actualisation', 'Taux utilisé pour ramener les gains futurs à aujourd\'hui (8 % par exemple).'],
          ['n', 'Numéro de l\'année du flux (1, 2, 3…).'],
          ['VAN positive', 'Le projet crée de la valeur.'],
        ],
        example: {
          statement: 'Investissement 100 000 € ; gains de 40 000 € par an pendant 3 ans ; taux 8 %.',
          steps: ['Année 1 : 40 000 / 1,08 = 37 037 €', 'Année 2 : 40 000 / 1,08² = 34 294 €', 'Année 3 : 40 000 / 1,08³ = 31 753 €', 'VAN = 103 084 − 100 000 = 3 084 €'],
          result: 'VAN légèrement positive : le projet est acceptable, mais très sensible aux hypothèses.',
        },
        exercises: [
          () => {
            const flow = int(2, 8) * 10000
            const rate = pick([5, 8, 10])
            const n = int(1, 3)
            return {
              kind: 'number',
              statement: 'Calcule la valeur actuelle d\'un gain futur.',
              data: [['Gain', `${fmt(flow)} €`], ['Dans', `${n} an${n > 1 ? 's' : ''}`], ['Taux d\'actualisation', `${rate} %`]],
              question: 'Valeur actuelle (en €) ?',
              answer: flow / (1 + rate / 100) ** n,
              unit: '€',
              tolerance: 5,
              steps: [`(1 + ${rate} %)^${n} = ${fmt((1 + rate / 100) ** n, 4)}`, `${fmt(flow)} / ${fmt((1 + rate / 100) ** n, 4)} = ${fmt(flow / (1 + rate / 100) ** n, 0)} €`],
              conclusion: 'Plus le gain est lointain et le taux élevé, plus sa valeur actuelle est faible.',
            }
          },
          () => {
            const inv = int(6, 15) * 10000
            const gain = int(3, 7) * 10000
            const rate = pick([6, 8, 10])
            const v = gain / (1 + rate / 100) + gain / (1 + rate / 100) ** 2 + gain / (1 + rate / 100) ** 3
            return {
              kind: 'number',
              statement: 'Calcule la VAN d\'un projet sur 3 ans (gain identique chaque année).',
              data: [['Investissement', `${fmt(inv)} €`], ['Gain annuel net', `${fmt(gain)} €`], ['Durée', '3 ans'], ['Taux', `${rate} %`]],
              question: 'VAN (en €, avec son signe) ?',
              answer: v - inv,
              unit: '€',
              tolerance: 10,
              steps: [`Année 1 : ${fmt(gain / (1 + rate / 100), 0)} €`, `Année 2 : ${fmt(gain / (1 + rate / 100) ** 2, 0)} €`, `Année 3 : ${fmt(gain / (1 + rate / 100) ** 3, 0)} €`, `VAN = ${fmt(v, 0)} − ${fmt(inv)} = ${fmt(v - inv, 0)} €`],
              conclusion: v - inv >= 0 ? 'VAN positive : le projet crée de la valeur.' : 'VAN négative : le projet ne rembourse pas sa mise au taux demandé.',
            }
          },
          () => {
            const inv = int(8, 20) * 10000
            const gain = int(2, 5) * 10000
            return {
              kind: 'number',
              statement: 'Calcule le délai de retour sur investissement.',
              data: [['Investissement', `${fmt(inv)} €`], ['Gain annuel net', `${fmt(gain)} €`]],
              question: 'Délai de retour (en années) ?',
              answer: inv / gain,
              unit: 'ans',
              tolerance: 0.05,
              steps: [`${fmt(inv)} / ${fmt(gain)} = ${fmt(inv / gain, 2)} ans`],
              conclusion: 'Le délai de retour est simple mais ignore la valeur du temps et les gains après la récupération.',
            }
          },
          () => {
            const saving = int(2, 10) * 50000
            const margin = pick([2, 3, 4, 5, 8])
            return {
              kind: 'number',
              statement: 'Calcule le chiffre d\'affaires équivalent d\'une économie de coûts.',
              data: [['Économie', `${fmt(saving)} €`], ['Marge nette', `${margin} %`]],
              question: 'CA équivalent (en €) ?',
              answer: (saving * 100) / margin,
              unit: '€',
              tolerance: 10,
              steps: [`${fmt(saving)} / ${fmt(margin / 100, 2)} = ${fmt((saving * 100) / margin, 0)} €`],
              conclusion: 'Une économie de coûts équivaut à beaucoup de ventes supplémentaires : un levier puissant sur le résultat.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'inv', label: 'Investissement', unit: '€', value: 100000 },
            { key: 'gain', label: 'Gain annuel net', unit: '€', value: 40000 },
            { key: 'years', label: 'Durée', unit: 'ans', value: 3, help: '1 à 10' },
            { key: 'rate', label: 'Taux d\'actualisation', unit: '%', value: 8 },
          ],
          outputs: [
            { label: 'Valeur actuelle des gains', unit: '€', digits: 0, fn: (n) => Array.from({ length: Math.max(0, Math.min(10, Math.round(n.years))) }, (_, i) => n.gain / (1 + n.rate / 100) ** (i + 1)).reduce((a, b) => a + b, 0) },
            { label: 'VAN', unit: '€', digits: 0, highlight: true, fn: (n) => Array.from({ length: Math.max(0, Math.min(10, Math.round(n.years))) }, (_, i) => n.gain / (1 + n.rate / 100) ** (i + 1)).reduce((a, b) => a + b, 0) - n.inv },
            { label: 'Délai de retour', unit: 'ans', digits: 1, fn: (n) => (n.gain > 0 ? n.inv / n.gain : 0) },
          ],
          steps: (n) => [`Taux d'actualisation : ${fmt(n.rate)} %`],
          note: 'Durée limitée à 10 ans dans ce calculateur.',
        },
      },
    },
  ],

  excel: [
    {
      id: 'bfr-excel',
      fn: 'SOMME',
      level: 2,
      tier: 5,
      title: 'Calculer le BFR',
      context: 'Tu prépares l\'analyse de trésorerie pour la direction financière.',
      instruction: 'En **B5**, calcule le **BFR** : stocks + créances clients − dettes fournisseurs.',
      generate() {
        return { rows: [['Stocks (€)', int(2, 8) * 100000], ['Créances clients (€)', int(3, 9) * 100000], ['Dettes fournisseurs (€)', int(2, 7) * 100000], ['Trésorerie (€)', int(1, 5) * 100000]], extra: { A5: 'BFR (€)' } }
      },
      target: 'B5',
      solution: '=SOMME(B1:B2)-B3',
      mustUse: ['SOMME'],
      hints: ['La trésorerie (B4) ne fait pas partie du BFR d\'exploitation.', 'SOMME(B1:B2) additionne les stocks et les créances ; retire ensuite les dettes B3.'],
      explain: 'Le BFR d\'exploitation additionne stocks et créances et retire les dettes fournisseurs ; la trésorerie est le résultat du financement, elle n\'en fait pas partie.',
    },
    {
      id: 'cash-to-cash-excel',
      fn: 'ARRONDI',
      level: 3,
      tier: 5,
      title: 'Le cycle cash-to-cash',
      context: 'Tu calcules le cycle de conversion de trésorerie de l\'entreprise.',
      instruction: 'En **B7**, calcule le **cash-to-cash** : DIO + DSO − DPO, avec DIO = stock ÷ coût des ventes × 365, DSO = créances ÷ CA × 365, DPO = dettes ÷ achats × 365. **Arrondi à l\'entier.**',
      generate() {
        return { rows: [['Stock (€)', int(2, 8) * 100000], ['Coût des ventes (€)', int(15, 40) * 100000], ['Créances clients (€)', int(3, 9) * 100000], ['CA (€)', int(30, 60) * 100000], ['Dettes fournisseurs (€)', int(2, 7) * 100000], ['Achats (€)', int(12, 30) * 100000]], extra: { A7: 'Cash-to-cash (jours)' } }
      },
      target: 'B7',
      solution: '=ARRONDI(B1/B2*365+B3/B4*365-B5/B6*365;0)',
      mustUse: ['ARRONDI'],
      hints: ['DIO = B1/B2*365 ; DSO = B3/B4*365 ; DPO = B5/B6*365.', 'Additionne DIO et DSO, retire DPO, puis arrondis à l\'entier.'],
      explain: 'Les trois ratios se calculent sur une année de 365 jours. Le crédit fournisseurs (DPO) est soustrait, car il finance une partie du cycle.',
    },
    {
      id: 'van-excel',
      fn: 'ARRONDI',
      level: 3,
      tier: 5,
      title: 'La VAN sur 3 ans',
      context: 'Tu évalues un projet d\'automatisation avec des gains identiques sur 3 ans.',
      instruction: 'En **B5**, calcule la **VAN** : somme des gains annuels actualisés (années 1, 2, 3) − investissement, **arrondie à l\'entier**.',
      generate() {
        return { rows: [['Taux d\'actualisation', pick([0.06, 0.08, 0.1])], ['Gain annuel (€)', int(3, 7) * 10000], ['Durée (années)', 3], ['Investissement (€)', int(6, 15) * 10000]], extra: { A5: 'VAN (€)' } }
      },
      target: 'B5',
      solution: '=ARRONDI(B2/(1+B1)+B2/(1+B1)^2+B2/(1+B1)^3-B4;0)',
      mustUse: ['ARRONDI'],
      hints: ['Chaque année n vaut B2/(1+B1)^n.', 'Additionne les 3 années, retire l\'investissement B4, puis arrondis.'],
      explain: 'On ramène chaque gain à sa valeur d\'aujourd\'hui en le divisant par (1 + taux)^n, puis on retire l\'investissement : une VAN positive signifie que le projet crée de la valeur.',
    },
  ],

  cases: [
    {
      id: 'reduire-bfr',
      title: 'Libérer de la trésorerie',
      role: "Directeur supply chain d'un distributeur de matériel sportif",
      lesson: 'finance/bfr',
      generate() {
        const stock = int(6, 14) * 100000
        const cut = pick([15, 20, 25])
        const rate = pick([12, 15, 20])
        const freed = (stock * cut) / 100
        const eco = (freed * rate) / 100
        const sales = int(30, 60) * 100000
        return {
          intro: `Ton stock moyen est de ${fmt(stock)} €. Le directeur financier te demande un plan pour libérer de la trésorerie. Le coût de possession du stock est de ${rate} % par an. Tu envisages de réduire le stock de ${cut} % en traitant les références à faible rotation, sans dégrader le service (chiffre d'affaires : ${fmt(sales)} €).`,
          steps: [
            {
              situation: 'Quelle trésorerie libérerait cette réduction ?',
              better: `${fmt(stock)} × ${cut} % = ${fmt(freed, 0)} € libérés une fois, auxquels s'ajoute une économie annuelle de ${fmt(eco, 0)} € de coût de possession (${fmt(freed, 0)} × ${rate} %).`,
              choices: [
                { text: `${fmt(freed, 0)} € libérés, plus ${fmt(eco, 0)} € d'économie par an.`, points: 3, feedback: `${fmt(stock)} × ${cut} % = ${fmt(freed, 0)} € ; ${fmt(freed, 0)} × ${rate} % = ${fmt(eco, 0)} € de coûts évités chaque année.` },
                { text: `${fmt(stock, 0)} € : tout le stock.`, points: 0, feedback: `Seule une partie (${cut} %) du stock est réduite : ${fmt(freed, 0)} €.` },
                { text: `Uniquement ${fmt(eco, 0)} € : l'économie annuelle.`, points: 1, feedback: 'Tu oublies la trésorerie libérée une fois, qui est le bénéfice principal pour le directeur financier.' },
              ],
            },
            {
              situation: 'Sur quelles références agis-tu en premier ?',
              better: "On cible les stocks qui coûtent cher sans rapporter : références à rotation très faible ou dormantes (classe C), surstocks liés à des prévisions erronées, produits en fin de vie. Les références A (fortes ventes) sont protégées pour maintenir le service.",
              choices: [
                { text: 'Les références dormantes ou à faible rotation, en protégeant les références A.', points: 3, feedback: 'On libère du cash là où le stock ne sert presque pas, sans risquer les ruptures sur les produits importants.' },
                { text: 'Toutes les références, de 20 % uniformément.', points: 1, feedback: 'Une baisse uniforme risque de créer des ruptures sur les produits qui se vendent et de laisser le surstock inutile.' },
                { text: 'Uniquement les meilleures ventes.', points: 0, feedback: 'Réduire les stocks des meilleures ventes ferait chuter le taux de service et les ventes.' },
              ],
            },
            {
              situation: 'Comment mesures-tu le succès du plan ?',
              better: "En suivant ensemble la rotation (ou les jours de stock), le taux de service et la trésorerie libérée. Baisser les stocks en dégradant le service serait un faux gain : il faut les deux indicateurs.",
              choices: [
                { text: 'La rotation, le taux de service et la trésorerie libérée, ensemble.', points: 3, feedback: 'Un gain de trésorerie est durable seulement si le service reste bon.' },
                { text: 'Uniquement le niveau de stock.', points: 1, feedback: 'Un stock bas avec des ruptures n\'est pas un succès : le service doit être suivi aussi.' },
                { text: 'Aucun indicateur : le plan se juge à l\'œil.', points: 0, feedback: 'Sans chiffres, ni la direction ni les équipes ne peuvent valider les résultats.' },
              ],
            },
          ],
          debrief: `Réduire le stock de ${cut} % libère ${fmt(freed, 0)} € de trésorerie et économise ${fmt(eco, 0)} € par an. On cible les références dormantes en protégeant le service, et on suit rotation, service et cash ensemble.`,
        }
      },
    },
    {
      id: 'projet-robot-van',
      title: "Faut-il automatiser le picking ?",
      role: "Responsable logistique d'une entreprise de vente en ligne",
      lesson: 'finance/investissements',
      generate() {
        const inv = int(10, 20) * 10000
        const gain = int(4, 8) * 10000
        const rate = pick([6, 8, 10])
        const v = gain / (1 + rate / 100) + gain / (1 + rate / 100) ** 2 + gain / (1 + rate / 100) ** 3
        const van = v - inv
        const payback = inv / gain
        return {
          intro: `Un système d'automatisation du picking coûte ${fmt(inv)} € et fait économiser ${fmt(gain)} € par an (net des coûts de maintenance) pendant 3 ans. Le taux d'actualisation retenu par l'entreprise est de ${rate} %.`,
          steps: [
            {
              situation: 'Quel est le délai de retour, et la VAN sur 3 ans ?',
              better: `Délai de retour = ${fmt(inv)} / ${fmt(gain)} = ${fmt(payback, 1)} ans. VAN = ${fmt(v, 0)} − ${fmt(inv)} = ${fmt(van, 0)} € (${van >= 0 ? 'positive' : 'négative'}).`,
              choices: [
                { text: `Retour en ${fmt(payback, 1)} ans, VAN de ${fmt(van, 0)} €.`, points: 3, feedback: `Gains actualisés : ${fmt(v, 0)} € ; moins l'investissement de ${fmt(inv)} € = ${fmt(van, 0)} €.` },
                { text: `Retour en ${fmt(payback, 1)} ans, VAN de ${fmt(gain * 3 - inv, 0)} € (sans actualiser).`, points: 1, feedback: `Ce calcul oublie la valeur du temps : au taux de ${rate} %, la VAN est ${fmt(van, 0)} €.` },
                { text: 'Impossible de conclure.', points: 0, feedback: 'Avec ces chiffres, le délai de retour et la VAN se calculent directement.' },
              ],
            },
            {
              situation: van >= 0 ? 'La VAN est positive. Que recommandes-tu ?' : 'La VAN est négative. Que recommandes-tu ?',
              better: van >= 0
                ? "La VAN positive indique que le projet crée de la valeur sur la durée retenue. Avant de décider, on teste un scénario prudent (gains réduits de 20 %) pour vérifier qu'elle reste positive, et on regarde les bénéfices non chiffrés (qualité, ergonomie)."
                : "La VAN négative montre que, sur 3 ans, le projet ne rembourse pas son coût au taux demandé. On regarde si la durée de vie réelle est plus longue, si les gains peuvent croître (volumes), ou si une solution moins chère existe, avant de décider.",
              choices: [
                { text: van >= 0 ? 'Je teste un scénario prudent avant de valider.' : 'Je teste la durée de vie, les gains possibles et les alternatives avant de refuser.', points: 3, feedback: 'Une décision prudente teste les hypothèses clés au lieu de s\'appuyer sur un seul chiffre.' },
                { text: van >= 0 ? 'Je valide immédiatement sans test.' : 'Je valide quand même, car l\'automatisation est moderne.', points: 0, feedback: 'La modernité n\'est pas un critère financier : les hypothèses doivent être testées.' },
                { text: 'Je refuse sans analyse complémentaire.', points: 1, feedback: 'Une décision hâtive peut faire rater un projet utile ou en valider un mauvais.' },
              ],
            },
            {
              situation: 'Quels autres éléments prends-tu en compte ?',
              better: "Les bénéfices non chiffrés (réduction des erreurs et de la pénibilité, capacité à absorber une hausse des volumes), les risques (panne du système, dépendance à un fournisseur) et la qualité du déploiement (formation, arrêts pendant l'installation).",
              choices: [
                { text: 'Erreurs et pénibilité, capacité de croissance, risques de panne et déploiement.', points: 3, feedback: 'La VAN n\'est qu\'un critère : les effets qualitatifs et les risques complètent la décision.' },
                { text: 'Rien : seule la VAN compte.', points: 1, feedback: 'La VAN est essentielle mais incomplète : certains effets ne se chiffrent pas facilement.' },
                { text: 'Uniquement l\'avis du fournisseur du système.', points: 0, feedback: 'Un fournisseur a intérêt à vendre : la décision doit s\'appuyer sur des données indépendantes.' },
              ],
            },
          ],
          debrief: `Délai de retour de ${fmt(payback, 1)} ans et VAN de ${fmt(van, 0)} € au taux de ${rate} %. On teste des scénarios prudents et on complète par les bénéfices non chiffrés et les risques avant de décider.`,
        }
      },
    },
  ],

  english: {
    units: [
      {
        id: 'entreprise-en',
        title: 'Présenter son entreprise et son poste',
        icon: 'briefcase',
        color: 'indigo',
        lessons: [
          {
            id: 'entreprise-mots',
            title: "L'entreprise et ses services",
            level: 2,
            items: [
              { en: 'headquarters', fr: 'siège social', def: "Bureau principal d'une entreprise, où se prennent les grandes décisions.", ex: 'Our headquarters are in Lyon.', exFr: 'Notre siège social est à Lyon.' },
              { en: 'subsidiary', fr: 'filiale', def: "Entreprise détenue et contrôlée par une autre, plus grande.", ex: 'This is a subsidiary of a large group.', exFr: 'C\'est une filiale d\'un grand groupe.' },
              { en: 'annual revenue', fr: "chiffre d'affaires annuel", def: "Total des ventes réalisées par une entreprise sur une année.", ex: 'Our annual revenue is ten million euros.', exFr: "Notre chiffre d'affaires annuel est de dix millions d'euros." },
              { en: 'employees', fr: 'salariés (effectif)', def: "Personnes qui travaillent pour une entreprise avec un contrat.", ex: 'We have two hundred employees.', exFr: 'Nous avons deux cents salariés.' },
              { en: 'department', fr: 'service (département)', def: "Partie d'une entreprise spécialisée dans une activité, comme les achats ou la logistique.", ex: 'I work in the logistics department.', exFr: 'Je travaille dans le service logistique.' },
              { en: 'customers', fr: 'clients', def: "Personnes ou entreprises qui achètent les produits ou les services.", ex: 'Our customers are retailers.', exFr: 'Nos clients sont des détaillants.' },
              { en: 'branch', fr: 'agence (site)', def: "Établissement secondaire d'une entreprise, dans une autre ville ou région.", ex: 'We opened a new branch in Spain.', exFr: 'Nous avons ouvert une nouvelle agence en Espagne.' },
              { en: 'founded', fr: 'fondé(e)', def: "Créé à une date précise, en parlant d'une entreprise.", ex: 'The company was founded in 1985.', exFr: 'L\'entreprise a été fondée en 1985.' },
            ],
          },
          {
            id: 'poste-mots',
            title: 'Mon poste et mes missions',
            level: 2,
            items: [
              { en: 'job title', fr: 'intitulé du poste', def: "Nom officiel de la fonction occupée, comme « responsable logistique ».", ex: 'My job title is supply planner.', exFr: 'Mon intitulé de poste est planificateur.' },
              { en: 'responsibilities', fr: 'responsabilités (missions)', def: "Tâches et obligations liées à un poste.", ex: 'My responsibilities include forecasting.', exFr: 'Mes responsabilités incluent les prévisions.' },
              { en: 'workload', fr: 'charge de travail', def: "Quantité de travail qu'une personne ou une équipe doit réaliser.", ex: 'My workload is heavy this month.', exFr: "Ma charge de travail est lourde ce mois-ci." },
              { en: 'supervisor', fr: 'superviseur (chef direct)', def: "Personne qui surveille et organise le travail d'une équipe au quotidien.", ex: 'My supervisor checks the schedule.', exFr: "Mon superviseur vérifie le planning." },
              { en: 'in charge of', fr: 'responsable de', def: "Qui a la charge de quelque chose : c'est à lui ou elle de le gérer.", ex: 'I am in charge of inbound transport.', exFr: "Je suis responsable du transport entrant." },
              { en: 'to report to', fr: 'être sous la responsabilité de', def: "Avoir quelqu'un pour supérieur direct, à qui l'on rend compte.", ex: 'I report to the plant manager.', exFr: 'Je suis sous la responsabilité du directeur d\'usine.' },
              { en: 'skills', fr: 'compétences', def: "Capacités acquises par la formation ou l'expérience.", ex: 'Communication skills are important.', exFr: 'Les compétences en communication sont importantes.' },
              { en: 'work placement', fr: 'stage', def: "Période de travail en entreprise pour apprendre, pendant les études.", ex: 'I am doing a work placement.', exFr: 'Je fais un stage.' },
            ],
          },
          {
            id: 'presentation-phrases',
            title: 'Se présenter en entreprise',
            level: 3,
            items: [
              { en: 'I work for a company that makes car parts.', fr: 'Je travaille pour une entreprise qui fabrique des pièces automobiles.', blank: 'makes' },
              { en: 'My main task is to plan the deliveries.', fr: 'Ma mission principale est de planifier les livraisons.', blank: 'task' },
              { en: 'We export to more than twenty countries.', fr: 'Nous exportons vers plus de vingt pays.', blank: 'export' },
              { en: 'I have been working here for two years.', fr: 'Je travaille ici depuis deux ans.', blank: 'working' },
              { en: 'I am currently a student in supply chain management.', fr: 'Je suis actuellement étudiant en gestion de la supply chain.', blank: 'currently' },
              { en: 'My department is responsible for purchasing and logistics.', fr: 'Mon service est responsable des achats et de la logistique.', blank: 'purchasing' },
            ],
          },
        ],
      },
    ],
  },
}
