// Lot 1 — Bases (Fondamentaux) : Atelier (défis Excel, étude de cas) + Anglais (chiffres/dates, bureau).
import { eur, int, pick, sample } from '../gen.js'

const ARTICLES = ['Palette bois', 'Carton 40x30', 'Film étirable', 'Ruban adhésif', 'Étiquettes', 'Caisse plastique', 'Cerclage', 'Gants', 'Cutter', 'Housse', 'Sangle', 'Intercalaire']

export default {
  excel: [
    {
      id: 'nb-recus',
      fn: 'NB',
      level: 1,
      tier: 1,
      title: 'Combien de lignes saisies ?',
      context: "Le magasinier a saisi les quantités reçues, mais certaines lignes sont restées vides.",
      instruction: 'En **C11**, compte les lignes pour lesquelles une quantité reçue a été saisie (colonne C).',
      generate() {
        const empty = new Set(sample([0, 1, 2, 3, 4, 5, 6, 7], int(1, 5)))
        const rows = [['Réf', 'Article', 'Qté reçue'], ...sample(ARTICLES, 8).map((name, i) => [`R-${101 + i}`, name, empty.has(i) ? '' : int(10, 400, 10)])]
        return { rows, extra: { B11: 'Lignes saisies' } }
      },
      target: 'C11',
      solution: '=NB(C2:C9)',
      mustUse: ['NB'],
      hints: ['La fonction NB compte les cellules qui contiennent un nombre.', 'La colonne C va de C2 à C9 : on écrit C2:C9.'],
      explain: 'NB(C2:C9) compte uniquement les cellules contenant un nombre : les cellules vides ne sont pas comptées. Ne pas confondre avec NBVAL, qui compte aussi le texte.',
    },
    {
      id: 'taux-service-pct',
      fn: 'ARRONDI',
      level: 1,
      tier: 1,
      title: 'Le taux de service du mois',
      context: 'Ton responsable veut le taux de service du mois, en pourcentage, avec une décimale.',
      instruction: 'En **B5**, calcule le taux de service en % (commandes servies / commandes reçues × 100), **arrondi à 1 décimale**.',
      generate() {
        const total = int(200, 1200, 50)
        const lost = int(Math.round(total * 0.02), Math.round(total * 0.12))
        return { rows: [['Commandes reçues', total], ['Commandes servies', total - lost], ['Commandes en rupture', lost]], extra: { A5: 'Taux de service (%)' } }
      },
      target: 'B5',
      solution: '=ARRONDI(B2/B1*100;1)',
      mustUse: ['ARRONDI'],
      hints: ['Le taux de service = commandes servies divisées par commandes reçues, multiplié par 100.', 'ARRONDI(nombre ; nombre de décimales) : ici une seule décimale.'],
      explain: 'On divise les commandes servies (B2) par les commandes reçues (B1), on multiplie par 100 pour obtenir un pourcentage, puis ARRONDI(…;1) garde une décimale.',
    },
    {
      id: 'palettes-necessaires',
      fn: 'ARRONDI.SUP',
      level: 1,
      tier: 1,
      title: 'Combien de palettes ?',
      context: "Tu prépares l'expédition : il faut savoir combien de palettes réserver au transporteur.",
      instruction: 'En **B4**, calcule le nombre de palettes nécessaires (une palette incomplète compte comme une palette entière).',
      generate() {
        const per = pick([24, 30, 36, 40, 48])
        let qty = int(200, 2000, 10)
        if (qty % per === 0) qty += int(1, per - 1)
        return { rows: [['Colis à expédier', qty], ['Colis par palette', per]], extra: { A4: 'Palettes nécessaires' } }
      },
      target: 'B4',
      solution: '=ARRONDI.SUP(B1/B2;0)',
      mustUse: ['ARRONDI.SUP'],
      hints: ['Divise le nombre de colis par le nombre de colis par palette.', 'ARRONDI.SUP(nombre ; 0) arrondit toujours à l\'entier supérieur.'],
      explain: 'Une palette à moitié pleine occupe quand même une place : on arrondit toujours au-dessus avec ARRONDI.SUP(…;0), même si la division tombe à 12,1.',
    },
  ],

  cases: [
    {
      id: 'mode-production',
      title: 'Quel mode de production choisir ?',
      role: "Responsable supply chain d'un fabricant de produits configurables",
      lesson: 'bases/flux-pousses-tires',
      generate() {
        const product = pick([
          { name: 'des ordinateurs de bureau configurables', comp: 'processeurs, cartes mères, boîtiers' },
          { name: 'des vélos électriques personnalisables', comp: 'cadres, moteurs, batteries' },
          { name: 'des canapés modulables', comp: 'structures, mousses, tissus' },
        ])
        const variants = int(12, 40)
        const tol = int(5, 10) // jours de délai acceptés par le client
        const fab = int(15, 30) // jours pour tout fabriquer à la commande
        const asm = int(2, 4) // jours d'assemblage final
        const perVariant = int(20, 50, 5)
        const unit = int(200, 900, 50)
        const idle = variants * perVariant * unit
        const pct = int(20, 60)
        return {
          intro: `Ton entreprise vend ${product.name} : ${variants} configurations possibles. Les clients acceptent d'attendre ${tol} jours. Fabriquer un produit en entier prend ${fab} jours ; l'assemblage final à partir de composants prêts ne prend que ${asm} jours.`,
          steps: [
            {
              situation: 'Quel mode de production choisis-tu ?',
              better: `Le mode ATO tient le délai (${asm} jours ≤ ${tol} jours) avec bien moins de stock. En MTS, ${variants} configurations × ${perVariant} unités × ${eur(unit, 0)} représenteraient ${eur(idle, 0)} de produits finis, alors que quelques composants communs (${product.comp}) suffisent.`,
              choices: [
                { text: 'Tout fabriquer à la commande (MTO).', points: 0, feedback: `La fabrication complète prend ${fab} jours alors que tes clients n'acceptent que ${tol} jours d'attente : tu perdrais les ventes.` },
                { text: 'Stocker des produits finis pour chaque configuration (MTS).', points: 1, feedback: `Le délai serait bon, mais ${variants} configurations × ${perVariant} unités × ${eur(unit, 0)} immobiliseraient environ ${eur(idle, 0)}, dont une partie ne se vendrait jamais.` },
                { text: 'Stocker les composants et assembler à la commande (ATO).', points: 3, feedback: `Les composants sont déjà là : il ne reste que ${asm} jours d'assemblage, sous les ${tol} jours acceptés. Le stock porte sur quelques composants communs, pas sur ${variants} configurations.` },
              ],
            },
            {
              situation: 'Où places-tu le point de découplage ?',
              better: `Le point de découplage sépare le flux poussé (composants achetés sur prévision) du flux tiré (assemblage sur commande). Le placer juste avant l'assemblage final ramène le délai à ${asm} jours sans stocker de produits finis.`,
              choices: [
                { text: "Juste avant l'assemblage final : composants en stock, assemblage sur commande.", points: 3, feedback: `C'est le bon compromis : tout ce qui précède se prépare sur prévision, et seule la dernière étape (${asm} jours) attend la commande.` },
                { text: 'Tout au début, chez les fournisseurs de matières premières.', points: 0, feedback: `Tout le reste se ferait sur commande : tu reviendrais à ${fab} jours de délai, bien au-dessus des ${tol} jours acceptés.` },
                { text: "Après l'emballage, au plus près du client.", points: 1, feedback: 'Le délai serait minimal, mais tu retombes dans le MTS : un stock maximal de produits finis et un fort risque d\'invendus.' },
              ],
            },
            {
              situation: `Une promotion fait monter la demande de ${pct} % pendant deux semaines. Que fais-tu ?`,
              better: `Avec l'ATO, la variété est gérée par l'assemblage et non par le stock. Une hausse de ${pct} % se traite en renforçant les composants partagés par toutes les configurations, au lieu de deviner lesquelles des ${variants} configurations vont se vendre.`,
              choices: [
                { text: 'Je lance la fabrication de produits finis dans toutes les configurations.', points: 1, feedback: `Tu stockerais des configurations qui ne seront pas toutes demandées : risque d'invendus une fois la promotion terminée.` },
                { text: 'Je réapprovisionne en priorité les composants communs les plus utilisés.', points: 3, feedback: 'Les composants communs servent à toutes les configurations : les sécuriser protège toutes les ventes possibles, quelle que soit la configuration choisie.' },
                { text: 'Je refuse les commandes au-delà de la capacité habituelle.', points: 0, feedback: 'Une promotion bien préparée doit être servie : refuser des commandes, c\'est perdre des ventes et abîmer la relation avec les clients.' },
              ],
            },
          ],
          debrief: `Le bon mode de production dépend du délai accepté par le client (${tol} jours), de la variété (${variants} configurations) et du coût du stock. Ici, l'ATO (composants en stock, assemblage en ${asm} jours) combine délai court et stock raisonnable.`,
        }
      },
    },
  ],

  english: {
    units: [
      {
        id: 'chiffres',
        title: 'Chiffres, unités et dates',
        icon: 'ruler',
        color: 'teal',
        lessons: [
          {
            id: 'quantites',
            title: 'Quantités et pourcentages',
            level: 1,
            items: [
              { en: 'quantity', fr: 'quantité', def: "Nombre d'unités d'un produit, commandées, stockées ou livrées.", ex: 'What quantity do you need?', exFr: 'Quelle quantité vous faut-il ?' },
              { en: 'total', fr: 'total', def: "Résultat d'une addition : la somme de plusieurs quantités ou montants.", ex: 'The total is two hundred euros.', exFr: 'Le total est de deux cents euros.' },
              { en: 'average', fr: 'moyenne', def: "Valeur obtenue en divisant le total par le nombre d'éléments.", ex: 'The average delivery time is three days.', exFr: 'Le délai de livraison moyen est de trois jours.' },
              { en: 'percentage', fr: 'pourcentage', alt: ['percent'], def: 'Proportion exprimée sur 100, écrite avec le signe %.', ex: 'What percentage of orders arrive late?', exFr: 'Quel pourcentage de commandes arrive en retard ?' },
              { en: 'increase', fr: 'augmentation', def: "Hausse d'un chiffre : il devient plus grand qu'avant.", ex: 'We expect an increase in demand.', exFr: 'Nous attendons une augmentation de la demande.' },
              { en: 'decrease', fr: 'baisse', def: "Diminution d'un chiffre : il devient plus petit qu'avant.", ex: 'There was a decrease in stock last month.', exFr: 'Il y a eu une baisse du stock le mois dernier.' },
            ],
          },
          {
            id: 'mesures',
            title: 'Poids, dimensions et volumes',
            level: 1,
            items: [
              { en: 'weight', fr: 'poids', def: "Mesure de la masse d'un colis ou d'une marchandise, en kilos ou en tonnes.", ex: 'The weight of each box is ten kilos.', exFr: 'Le poids de chaque carton est de dix kilos.' },
              { en: 'length', fr: 'longueur', def: "Dimension la plus grande d'un objet, d'un bout à l'autre.", ex: 'The length of the pallet is one meter twenty.', exFr: 'La longueur de la palette est de un mètre vingt.' },
              { en: 'width', fr: 'largeur', def: "Dimension d'un objet mesurée d'un côté à l'autre.", ex: 'Check the width of the door first.', exFr: "Vérifie d'abord la largeur de la porte." },
              { en: 'height', fr: 'hauteur', def: "Dimension d'un objet mesurée de bas en haut.", ex: 'The maximum height is two meters.', exFr: 'La hauteur maximale est de deux mètres.' },
              { en: 'volume', fr: 'volume', def: "Espace occupé par un colis ou une marchandise, souvent en mètres cubes.", ex: 'The volume of the shipment is five cubic meters.', exFr: "Le volume de l'envoi est de cinq mètres cubes." },
              { en: 'net weight', fr: 'poids net', def: "Poids de la marchandise seule, sans l'emballage.", ex: 'The net weight is five hundred kilos.', exFr: 'Le poids net est de cinq cents kilos.', note: 'À côté du « gross weight » (poids brut), qui inclut l\'emballage.' },
            ],
          },
          {
            id: 'dates',
            title: 'Dates et délais',
            level: 1,
            items: [
              { en: 'deadline', fr: 'date limite', def: "Date ou heure avant laquelle une tâche doit être terminée.", ex: 'The deadline for the order is Friday.', exFr: 'La date limite de la commande est vendredi.' },
              { en: 'schedule', fr: 'planning', def: 'Calendrier qui indique quand chaque chose doit avoir lieu.', ex: 'The delivery schedule changed this week.', exFr: 'Le planning de livraison a changé cette semaine.', note: 'Piège : « schedule » = planning ; « programme » se dit plutôt « program » ou « plan ».' },
              { en: 'due date', fr: "date d'échéance", def: "Date à laquelle un paiement ou une livraison est attendu.", ex: 'The due date of the invoice is the thirtieth.', exFr: "La date d'échéance de la facture est le trente." },
              { en: 'on time', fr: "à l'heure", def: "À la date ou à l'heure prévue, sans retard.", ex: 'The truck arrived on time.', exFr: "Le camion est arrivé à l'heure." },
              { en: 'overdue', fr: 'en retard (échu)', def: "Qui aurait dû être payé ou fait avant : la date limite est dépassée.", ex: 'This invoice is overdue.', exFr: 'Cette facture est en retard de paiement.' },
              { en: 'in advance', fr: "à l'avance", def: "Avant le moment prévu, pour se préparer.", ex: 'Please send the order in advance.', exFr: "Merci d'envoyer la commande à l'avance." },
            ],
          },
        ],
      },
      {
        id: 'bureau',
        title: 'Au bureau',
        icon: 'briefcase',
        color: 'sky',
        lessons: [
          {
            id: 'equipe',
            title: 'Équipe et tâches',
            level: 1,
            items: [
              { en: 'colleague', fr: 'collègue', def: "Personne avec qui l'on travaille dans la même entreprise.", ex: 'My colleague will call you tomorrow.', exFr: 'Mon collègue vous appellera demain.' },
              { en: 'manager', fr: 'responsable', def: "Personne qui dirige une équipe ou un service.", ex: 'I will ask my manager.', exFr: 'Je vais demander à mon responsable.', note: 'Piège : « manager » = responsable, pas toujours « directeur ».' },
              { en: 'team', fr: 'équipe', def: "Groupe de personnes qui travaillent ensemble pour un même objectif.", ex: 'Our team works in the warehouse.', exFr: "Notre équipe travaille à l'entrepôt." },
              { en: 'task', fr: 'tâche', def: "Travail précis à réaliser, souvent avec une date limite.", ex: 'This task takes two hours.', exFr: 'Cette tâche prend deux heures.' },
              { en: 'meeting', fr: 'réunion', def: "Rencontre entre plusieurs personnes pour discuter ou décider.", ex: 'The meeting starts at nine.', exFr: 'La réunion commence à neuf heures.' },
              { en: 'report', fr: 'rapport', def: "Document qui présente des résultats ou des informations.", ex: 'I will send the weekly report.', exFr: 'Je vais envoyer le rapport hebdomadaire.' },
            ],
          },
          {
            id: 'outils',
            title: 'Au quotidien',
            level: 1,
            items: [
              { en: 'spreadsheet', fr: 'tableur', def: "Logiciel ou fichier qui organise des données en lignes et en colonnes, comme Excel.", ex: 'I update the spreadsheet every morning.', exFr: 'Je mets à jour le tableur chaque matin.' },
              { en: 'attachment', fr: 'pièce jointe', def: 'Fichier envoyé avec un message électronique.', ex: 'Please open the attachment.', exFr: 'Merci d\'ouvrir la pièce jointe.' },
              { en: 'folder', fr: 'dossier', def: "Espace qui regroupe des fichiers sur un ordinateur ou un serveur.", ex: 'Save the file in the shared folder.', exFr: 'Enregistre le fichier dans le dossier partagé.' },
              { en: 'password', fr: 'mot de passe', def: "Suite de caractères secrète qui permet d'accéder à un compte.", ex: 'I forgot my password.', exFr: "J'ai oublié mon mot de passe." },
              { en: 'calendar', fr: 'agenda', def: 'Outil qui affiche les rendez-vous et les réunions jour par jour.', ex: 'Check the calendar before you book the meeting.', exFr: "Regarde l'agenda avant de réserver la réunion.", note: 'Piège : « agenda » en anglais veut dire « ordre du jour » d\'une réunion.' },
              { en: 'update', fr: 'mise à jour', def: "Nouvelle version d'une information ou d'un logiciel, plus récente.", ex: 'We need an update on the order.', exFr: 'Nous avons besoin d\'un point sur la commande.', note: 'Aussi verbe : « to update » = mettre à jour.' },
            ],
          },
        ],
      },
    ],
  },
}
