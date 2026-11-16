// Lot 4 — Entrepôt : Atelier (productivité de préparation, 3 défis Excel, 2 études de cas) + Anglais (équipements, sécurité).
import { eur, fmt, int, pick, sample } from '../gen.js'

const NAMES = ['Amélie', 'Bastien', 'Chloé', 'David', 'Emma', 'Farid', 'Gaëlle', 'Hugo', 'Inès']

export default {
  formulas: [
    {
      id: 'productivite-picking',
      title: 'Productivité de la préparation',
      short: 'Productivité = lignes / heures',
      course: {
        purpose:
          "La **productivité de préparation** mesure combien de lignes de commande un préparateur prélève par heure. Elle sert à dimensionner les équipes, à calculer le **coût par ligne** et à mesurer l'effet d'une amélioration (nouvelle implantation, picking vocal, automatisation).",
        formulas: [
          'Productivité = lignes préparées / heures travaillées',
          'Nombre de préparateurs = lignes à préparer / (productivité × heures par préparateur)',
          'Coût par ligne = coût horaire chargé / productivité',
        ],
        terms: [
          ['Ligne', 'Une ligne de commande = un article demandé dans une commande (quelle que soit la quantité).'],
          ['Productivité', 'Lignes préparées par heure et par préparateur.'],
          ['Heures de préparation', 'Heures réellement consacrées à préparer (hors pauses et réunions).'],
          ['Coût horaire chargé', 'Salaire plus charges patronales, par heure travaillée.'],
          ['Arrondi', 'Pour le nombre de personnes, on arrondit à l\'entier supérieur : on ne peut pas embaucher 2,86 personnes.'],
        ],
        example: {
          statement: 'Il faut préparer 1 800 lignes par jour. Productivité : 90 lignes/heure. Chaque préparateur prépare 7 heures par jour. Coût horaire chargé : 28 €.',
          steps: ['Lignes par préparateur et par jour = 90 × 7 = 630', 'Nombre de préparateurs = 1 800 / 630 = 2,86 → 3 personnes', 'Coût par ligne = 28 / 90 = 0,31 €'],
          result: 'Il faut 3 préparateurs, pour un coût d\'environ 0,31 € par ligne.',
        },
        exercises: [
          () => {
            const lines = int(300, 900, 10)
            const hours = int(4, 8)
            return {
              kind: 'number',
              statement: 'Calcule la productivité d\'une équipe de préparation.',
              data: [['Lignes préparées', fmt(lines)], ['Heures travaillées', `${hours} h`]],
              question: 'Productivité (en lignes par heure) ?',
              answer: lines / hours,
              unit: 'lignes/h',
              tolerance: 0.5,
              steps: [`Productivité = lignes / heures = ${fmt(lines)} / ${hours} = ${fmt(lines / hours, 1)}`],
              conclusion: `L'équipe prépare environ ${fmt(lines / hours, 0)} lignes chaque heure.`,
            }
          },
          () => {
            const lines = int(800, 4000, 100)
            const prod = int(60, 120, 5)
            const hours = pick([6, 7, 7.5, 8])
            const perPerson = prod * hours
            return {
              kind: 'number',
              statement: 'Combien de préparateurs faut-il (arrondi au supérieur) ?',
              data: [['Lignes à préparer par jour', fmt(lines)], ['Productivité', `${prod} lignes/h`], ['Heures de préparation par personne', `${fmt(hours)} h/jour`]],
              question: 'Nombre de préparateurs ?',
              answer: Math.ceil(lines / perPerson),
              unit: 'personnes',
              tolerance: 0.5,
              steps: [`Lignes par personne et par jour = ${prod} × ${fmt(hours)} = ${fmt(perPerson)}`, `Préparateurs = ${fmt(lines)} / ${fmt(perPerson)} = ${fmt(lines / perPerson, 2)}`, `On arrondit au supérieur : ${Math.ceil(lines / perPerson)}`],
              conclusion: 'On arrondit toujours à la personne supérieure, sinon la charge ne serait pas couverte.',
            }
          },
          () => {
            const wage = int(24, 36)
            const prod = int(60, 140, 5)
            return {
              kind: 'number',
              statement: 'Calcule le coût de préparation d\'une ligne.',
              data: [['Coût horaire chargé', eur(wage)], ['Productivité', `${prod} lignes/h`]],
              question: 'Coût par ligne (en €) ?',
              answer: wage / prod,
              unit: '€',
              tolerance: 0.005,
              steps: [`Coût par ligne = coût horaire / productivité = ${wage} / ${prod} = ${eur(wage / prod, 3)}`],
              conclusion: 'Plus la productivité augmente, plus le coût de chaque ligne diminue.',
            }
          },
          () => {
            const before = int(60, 100, 5)
            const gain = int(10, 60)
            const after = Math.round(before * (1 + gain / 100))
            return {
              kind: 'number',
              statement: 'Une nouvelle organisation améliore la préparation. Calcule le gain de productivité.',
              data: [['Avant', `${before} lignes/h`], ['Après', `${after} lignes/h`]],
              question: 'Gain de productivité (en %) ?',
              answer: ((after - before) / before) * 100,
              unit: '%',
              tolerance: 0.2,
              steps: [`Écart = ${after} − ${before} = ${after - before}`, `Gain = ${after - before} / ${before} × 100 = ${fmt(((after - before) / before) * 100, 1)} %`],
              conclusion: 'Le gain se calcule toujours par rapport à la valeur de départ.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'lines', label: 'Lignes à préparer par jour', value: 1800 },
            { key: 'prod', label: 'Productivité', unit: 'lignes/h', value: 90 },
            { key: 'hours', label: 'Heures de préparation par personne', unit: 'h/jour', value: 7 },
            { key: 'wage', label: 'Coût horaire chargé', unit: '€', value: 28 },
          ],
          outputs: [
            { label: 'Lignes par personne', unit: 'lignes/jour', digits: 0, fn: (n) => n.prod * n.hours },
            { label: 'Préparateurs nécessaires', unit: 'personnes', digits: 0, highlight: true, fn: (n) => Math.ceil(n.lines / (n.prod * n.hours)) },
            { label: 'Coût par ligne', unit: '€', digits: 3, fn: (n) => n.wage / n.prod },
            { label: 'Coût journalier', unit: '€', digits: 0, fn: (n) => (n.lines / n.prod) * n.wage },
          ],
          steps: (n) => [`Par personne : ${fmt(n.prod)} × ${fmt(n.hours)} = ${fmt(n.prod * n.hours)} lignes par jour`, `Personnes = ${fmt(n.lines)} / ${fmt(n.prod * n.hours)} = ${fmt(n.lines / (n.prod * n.hours), 2)} → arrondi au supérieur`, `Coût par ligne = ${fmt(n.wage)} / ${fmt(n.prod)} = ${fmt(n.wage / n.prod, 3)} €`],
          note: 'Le coût journalier est calculé sur les heures nécessaires (lignes / productivité), pas sur les heures payées.',
        },
      },
    },
  ],

  excel: [
    {
      id: 'productivite-equipe',
      fn: 'SOMME',
      level: 2,
      tier: 4,
      title: 'La productivité de l\'équipe',
      context: 'Tu veux la productivité globale de l\'équipe de préparation : total des lignes divisé par total des heures.',
      instruction: 'En **D8**, calcule la **productivité de l\'équipe** en lignes par heure (total des lignes ÷ total des heures), **arrondie à 1 décimale**.',
      generate() {
        const names = sample(NAMES, 6)
        return { rows: [['Préparateur', 'Lignes', 'Heures'], ...names.map((n) => [n, int(250, 700, 10), int(5, 8)])], extra: { C8: 'Productivité' } }
      },
      target: 'D8',
      solution: '=ARRONDI(SOMME(B2:B7)/SOMME(C2:C7);1)',
      mustUse: ['SOMME', 'ARRONDI'],
      hints: ['Additionne les lignes avec SOMME(B2:B7) et les heures avec SOMME(C2:C7).', 'Divise le total des lignes par le total des heures, puis entoure de ARRONDI(…;1).'],
      explain: 'La productivité d\'équipe est un rapport de totaux (lignes ÷ heures), pas une moyenne des productivités individuelles : les personnes qui travaillent plus longtemps comptent davantage.',
    },
    {
      id: 'taux-occupation-xl',
      fn: 'NB.SI',
      level: 2,
      tier: 4,
      title: 'Le taux d\'occupation des emplacements',
      context: 'Tu suis l\'occupation des emplacements palettes de ta zone de stockage.',
      instruction: 'En **D2**, calcule le **taux d\'occupation en %** : emplacements « Occupé » ÷ nombre total d\'emplacements, **arrondi à 1 décimale**.',
      generate() {
        const rows = [['Emplacement', 'Allée', 'Statut'], ...Array.from({ length: 12 }, (_, i) => [`E-${i + 1}`, `A${1 + Math.floor(i / 4)}`, Math.random() < int(40, 90) / 100 ? 'Occupé' : 'Libre'])]
        return { rows, extra: { E1: 'Taux d\'occupation (%)', D1: 'Résultat' } }
      },
      target: 'D2',
      solution: '=ARRONDI(NB.SI(C2:C13;"Occupé")/NBVAL(C2:C13)*100;1)',
      mustUse: ['NB.SI', 'NBVAL'],
      hints: ['NB.SI(C2:C13;"Occupé") compte les emplacements occupés.', 'NBVAL(C2:C13) compte toutes les cellules non vides, donc le nombre total d\'emplacements.'],
      explain: 'On divise les emplacements occupés par le total (NBVAL compte toutes les lignes remplies) et on multiplie par 100 pour obtenir un pourcentage.',
    },
    {
      id: 'meilleur-preparateur',
      fn: 'INDEX',
      level: 3,
      tier: 3,
      title: 'Qui est le plus productif ?',
      context: 'Pour la prime d\'équipe, tu cherches le nom du préparateur dont la productivité est la plus élevée.',
      instruction: 'En **F2**, affiche le **nom du préparateur** ayant la productivité maximale (colonne D), avec INDEX et EQUIV.',
      generate() {
        const names = sample(NAMES, 7)
        const prods = sample(Array.from({ length: 40 }, (_, i) => 55 + i * 2), 7)
        return { rows: [['Préparateur', 'Lignes', 'Heures', 'Productivité'], ...names.map((n, i) => [n, prods[i] * 7, 7, prods[i]])], extra: { F1: 'Le plus productif' } }
      },
      target: 'F2',
      solution: '=INDEX(A2:A8;EQUIV(MAX(D2:D8);D2:D8;0))',
      mustUse: ['INDEX', 'EQUIV', 'MAX'],
      hints: ['MAX(D2:D8) donne la plus grande productivité.', 'EQUIV(valeur ; plage ; 0) trouve sa position, et INDEX(A2:A8 ; position) renvoie le nom à cette position.'],
      explain: 'MAX trouve la meilleure productivité, EQUIV donne sa ligne, INDEX récupère le nom sur cette ligne. C\'est la méthode classique pour « retrouver le nom associé au maximum ».',
    },
  ],

  cases: [
    {
      id: 'zonage-entrepot',
      title: 'Où placer les références ?',
      role: "Responsable d'exploitation d'un entrepôt e-commerce",
      lesson: 'entrepot/implantation',
      intro:
        "Ton entrepôt prépare 3 000 lignes par jour. Les 300 références de classe A font 80 % des sorties mais sont rangées au fond du bâtiment, à 60 mètres des quais d'expédition. Les préparateurs parcourent en moyenne 12 km par jour.",
      steps: [
        {
          situation: 'Que fais-tu des références de classe A ?',
          better:
            "Chaque ligne A prélevée séparément impose environ 60 m de trajet : sur 2 400 lignes A par jour (80 % de 3 000), cela peut aller jusqu'à 144 km parcourus. Les rapprocher à 15 m des quais divise ce trajet par quatre : c'est le levier de productivité le plus fort.",
          choices: [
            { text: 'Je les rapproche des quais d\'expédition, à hauteur d\'homme.', points: 3, feedback: 'Les articles les plus demandés sont les plus faciles d\'accès : les trajets raccourcissent pour la majorité des lignes préparées.' },
            { text: 'Je les place au dernier niveau des racks pour libérer le sol.', points: 1, feedback: 'Les articles A seraient difficiles à atteindre : plus de temps par prélèvement et davantage de risques.' },
            { text: 'Je ne change rien : un entrepôt, ça se mémorise.', points: 0, feedback: 'La mémoire des préparateurs ne remplace pas une bonne implantation : les kilomètres parcourus restent les mêmes.' },
          ],
        },
        {
          situation: 'Tu dois ranger des cartons de 25 kg. Où les places-tu ?',
          better:
            "Soulever 25 kg au-dessus de la taille augmente fortement le risque de TMS. En les plaçant bas ou à hauteur de taille, tu réduis l'effort et les accidents, sans perdre de productivité : le temps d'un prélèvement ne change presque pas.",
          choices: [
            { text: 'En bas ou à hauteur de taille.', points: 3, feedback: 'La charge se manipule sans lever les bras : moins d\'efforts, moins de blessures, un prélèvement toujours rapide.' },
            { text: 'Au dernier niveau pour gagner de la place au sol.', points: 0, feedback: 'Un carton lourd en hauteur est difficile et dangereux à manipuler : risque de chute et de blessure.' },
            { text: 'Dans la réserve haute, avec un chariot à chaque prélèvement.', points: 1, feedback: 'Un chariot pour chaque carton ralentit énormément la préparation et complique le flux.' },
          ],
        },
        {
          situation: 'Deux références (une coque de téléphone et son verre de protection) sont commandées ensemble dans 70 % des cas. Que fais-tu ?',
          better:
            "Dans 70 % des commandes, le préparateur ira chercher les deux articles : les placer côte à côte lui évite un aller-retour. L'éloigner ou les séparer rallonge le trajet pour sept commandes sur dix.",
          choices: [
            { text: 'Je les range côte à côte.', points: 3, feedback: 'Un seul arrêt pour deux articles dans 70 % des cas : le trajet est raccourci et la productivité augmente.' },
            { text: 'Je les éloigne pour mieux répartir les préparateurs dans l\'entrepôt.', points: 0, feedback: 'Chaque commande contenant les deux articles demanderait un double trajet : exactement l\'inverse de l\'objectif.' },
            { text: 'Je les range dans l\'ordre alphabétique.', points: 1, feedback: 'L\'ordre alphabétique est simple pour retrouver un produit, mais ignore la façon dont ils sont commandés.' },
          ],
        },
      ],
      debrief:
        "Une bonne implantation range les articles selon leur rotation (A près des quais, à hauteur d'homme), leur poids (lourds en bas) et leurs associations (articles commandés ensemble côte à côte). Elle réduit les kilomètres parcourus, les efforts et les erreurs.",
    },
    {
      id: 'automatiser-entrepot',
      title: 'Automatiser ou pas ?',
      role: "Directeur logistique d'un prestataire 3PL",
      lesson: 'entrepot/automatisation',
      generate() {
        const fte = int(6, 20)
        const cost = int(36, 45) * 1000
        const saving = Math.round(fte * cost * 0.8)
        const invest = int(8, 20) * 100000
        const maint = Math.round(invest * 0.08)
        const net = saving - maint
        const payback = invest / net
        const contract = Math.max(1, Math.floor(payback) - int(1, 2))
        return {
          intro: `Un fournisseur te propose un système de préparation « goods-to-person » pour ${eur(invest, 0)}. Il supprime ${fte} postes de préparateurs (environ ${eur(cost, 0)} par poste et par an) : les économies de main-d'œuvre sont estimées à ${eur(saving, 0)} par an (80 % du coût des postes, le reste étant redéployé). La maintenance coûte ${eur(maint, 0)} par an. Ton principal client a signé un contrat de ${contract} an${contract > 1 ? 's' : ''}.`,
          steps: [
            {
              situation: 'Que calcules-tu en premier ?',
              better: `Le gain net annuel est ${eur(saving, 0)} − ${eur(maint, 0)} = ${eur(net, 0)}. Le retour sur investissement est ${eur(invest, 0)} / ${eur(net, 0)} = ${fmt(payback, 1)} ans. C'est ce chiffre qu'on compare à la durée des contrats, pas le prix d'achat seul.`,
              choices: [
                { text: 'Le gain annuel net (économies − maintenance) et le délai de retour.', points: 3, feedback: `Gain net ${eur(net, 0)} par an, soit un retour en ${fmt(payback, 1)} ans : l'indicateur clé pour décider.` },
                { text: 'Le coût d\'achat seul.', points: 0, feedback: `Le coût d'achat (${eur(invest, 0)}) n'a de sens que rapporté aux économies et à la maintenance : sans ça, on ne sait pas si le projet se rembourse.` },
                { text: 'Le nombre de robots du système.', points: 1, feedback: 'Cette information technique ne dit rien de la rentabilité du projet.' },
              ],
            },
            {
              situation: `Le projet se rembourse en ${fmt(payback, 1)} ans, mais ton contrat principal ne dure que ${contract} an${contract > 1 ? 's' : ''}. Que fais-tu ?`,
              better: `Avec un retour en ${fmt(payback, 1)} ans et un contrat de ${contract}, tu risques d'être engagé sur ${eur(invest, 0)} sans garantie d'activité pour le rembourser. Négocier une durée plus longue, ou phaser l'investissement, réduit ce risque.`,
              choices: [
                { text: 'Je négocie un contrat plus long ou je phase l\'investissement.', points: 3, feedback: 'Tu alignes la durée d\'engagement sur celle du remboursement, ou tu limites la somme engagée au départ.' },
                { text: 'Je signe tout de suite : le système est moderne.', points: 1, feedback: `Un système moderne ne suffit pas : si le contrat s'arrête avant le retour (${fmt(payback, 1)} ans), tu perds de l'argent.` },
                { text: 'Je refuse toute automatisation, par principe.', points: 0, feedback: `Le projet est rentable à long terme (${eur(net, 0)} de gain net par an) : refuser par principe prive l'entreprise d'un vrai gain.` },
              ],
            },
            {
              situation: 'Comment réduis-tu le risque du projet ?',
              better: `Un pilote sur une partie de l'activité permet de vérifier les gains réels avant d'engager les ${eur(invest, 0)}. Acheter tout d'un coup rend le projet difficile à corriger si les volumes baissent.`,
              choices: [
                { text: 'Je démarre par un pilote sur une partie de l\'activité.', points: 3, feedback: 'Un pilote prouve les gains réels (productivité, qualité) avant l\'investissement complet et laisse le temps d\'ajuster.' },
                { text: 'J\'achète le système complet pour être sûr d\'en profiter.', points: 1, feedback: 'Un achat complet immédiat engage toute la somme avant d\'avoir validé les gains : aucune marge de correction.' },
                { text: 'J\'attends que les concurrents le fassent d\'abord.', points: 0, feedback: 'Attendre sans analyse fait perdre un avantage éventuel, sans réduire le risque d\'un futur investissement.' },
              ],
            },
          ],
          debrief: `L'automatisation se juge sur le retour (${fmt(payback, 1)} ans ici) comparé à la durée d'engagement (${contract} an${contract > 1 ? 's' : ''}). La bonne décision combine un calcul de gain net, une durée de contrat cohérente et un déploiement progressif.`,
        }
      },
    },
  ],

  english: {
    extend: {
      entrepot: [
        {
          id: 'equipements',
          title: 'Équipements et préparation',
          level: 2,
          items: [
            { en: 'rack', fr: 'rack (rayonnage)', def: "Structure métallique qui porte les palettes sur plusieurs niveaux.", ex: 'The pallets are stored on the racks.', exFr: 'Les palettes sont stockées sur les racks.' },
            { en: 'aisle', fr: 'allée', def: "Passage entre deux rangées de racks ou d'étagères.", ex: 'Do not block the aisle.', exFr: "Ne bloquez pas l'allée." },
            { en: 'conveyor', fr: 'convoyeur', def: "Tapis ou rouleaux qui déplacent les colis automatiquement.", ex: 'The parcels travel on the conveyor.', exFr: 'Les colis circulent sur le convoyeur.' },
            { en: 'barcode', fr: 'code-barres', def: "Suite de traits lisible par un scanner, qui identifie un produit.", ex: 'Scan the barcode on the label.', exFr: "Scanne le code-barres de l'étiquette." },
            { en: 'scanner', fr: 'scanner (lecteur)', def: "Appareil qui lit les codes-barres des produits et des emplacements.", ex: 'The picker uses a handheld scanner.', exFr: 'Le préparateur utilise un scanner portatif.' },
            { en: 'trolley', fr: 'chariot (à main)', def: "Petit chariot poussé à la main pour déplacer des colis ou des bacs.", ex: 'Take a trolley for the boxes.', exFr: 'Prends un chariot pour les cartons.', note: 'À ne pas confondre avec « forklift » (chariot élévateur).' },
          ],
        },
        {
          id: 'securite-en',
          title: 'Sécurité et consignes',
          level: 2,
          items: [
            { en: 'safety', fr: 'sécurité', def: "Ensemble des mesures qui protègent les personnes contre les accidents.", ex: 'Safety comes first.', exFr: 'La sécurité passe avant tout.', note: 'Piège : « sécurité » se dit « safety » (accidents) ou « security » (menaces, vols).' },
            { en: 'hazard', fr: 'danger', def: "Source possible de blessure ou de dommage.", ex: 'Report any hazard immediately.', exFr: 'Signalez tout danger immédiatement.' },
            { en: 'helmet', fr: 'casque', def: "Équipement qui protège la tête contre les chocs.", ex: 'You must wear a helmet in this area.', exFr: 'Vous devez porter un casque dans cette zone.' },
            { en: 'safety vest', fr: 'gilet de sécurité', def: "Gilet de couleur vive qui rend visible la personne qui le porte.", ex: 'Wear a safety vest at all times.', exFr: 'Portez un gilet de sécurité en permanence.' },
            { en: 'emergency exit', fr: 'issue de secours', def: "Sortie réservée à l'évacuation en cas de danger, qui doit rester libre.", ex: 'Keep the emergency exit clear.', exFr: "Laissez l'issue de secours dégagée." },
            { en: 'fire extinguisher', fr: 'extincteur', def: "Appareil qui projette un produit pour éteindre un début d'incendie.", ex: 'The fire extinguisher is near the door.', exFr: "L'extincteur est près de la porte." },
          ],
        },
      ],
    },
  },
}
