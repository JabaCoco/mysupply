// Lot 5 — Achats : Atelier (3 défis Excel, 2 études de cas) + Anglais (contrats, demande de devis, négociation).
import { eur, fmt, int, pick, sample } from '../gen.js'

const SUPPLIERS = ['Valmont', 'Nordik', 'Eurotech', 'Plastiva', 'Metalis', 'Cartonor', 'Sudpack']
const FAMILIES = ['Emballages', 'Transport', 'Informatique', 'Fournitures', 'Maintenance']

export default {
  excel: [
    {
      id: 'note-fournisseur-sp',
      fn: 'SOMMEPROD',
      level: 3,
      tier: 5,
      title: 'La note pondérée d\'un fournisseur',
      context: 'Tu évalues un fournisseur avec une grille : chaque critère a un poids et une note.',
      instruction: 'En **C7**, calcule la **note finale** du fournisseur (somme des poids × notes), **arrondie à 2 décimales**.',
      generate() {
        const weights = pick([[0.4, 0.3, 0.2, 0.1], [0.3, 0.3, 0.2, 0.2], [0.35, 0.25, 0.25, 0.15]])
        const labels = ['Qualité', 'Coût', 'Délai', 'RSE']
        return { rows: [['Critère', 'Poids', 'Note'], ...labels.map((l, i) => [l, weights[i], int(3, 10)])], extra: { B7: 'Note finale' } }
      },
      target: 'C7',
      solution: '=ARRONDI(SOMMEPROD(B2:B5;C2:C5);2)',
      mustUse: ['SOMMEPROD', 'ARRONDI'],
      hints: ['SOMMEPROD(plage1 ; plage2) multiplie les valeurs ligne par ligne puis additionne le tout.', 'Les poids sont en B2:B5 et les notes en C2:C5. Entoure le résultat de ARRONDI(…;2).'],
      explain: 'SOMMEPROD calcule d\'un coup poids × note pour chaque critère puis additionne : c\'est la formule de la grille de notation pondérée, sans colonne intermédiaire.',
    },
    {
      id: 'offre-moins-chere',
      fn: 'RECHERCHEX',
      level: 2,
      tier: 3,
      title: 'Le fournisseur le moins cher au TCO',
      context: 'Tu as calculé le TCO unitaire de chaque offre : il faut retrouver le nom du fournisseur le plus avantageux.',
      instruction: 'En **G2**, affiche le **nom du fournisseur** dont le TCO est le plus bas, avec RECHERCHEX et MIN.',
      generate() {
        const names = sample(SUPPLIERS, 5)
        const tcos = sample(Array.from({ length: 30 }, (_, i) => 80 + i * 2), 5)
        return { rows: [['Fournisseur', 'Prix (€)', 'Transport (€)', 'Qualité (€)', 'TCO (€)'], ...names.map((n, i) => { const price = tcos[i] - 12; return [n, price, 8, 4, tcos[i]] })], extra: { G1: 'Meilleure offre' } }
      },
      target: 'G2',
      solution: '=RECHERCHEX(MIN(E2:E6);E2:E6;A2:A6)',
      mustUse: ['RECHERCHEX', 'MIN'],
      hints: ['MIN(E2:E6) donne le TCO le plus bas.', 'RECHERCHEX(valeur cherchée ; colonne où chercher ; colonne à renvoyer) : cherche ce minimum dans E2:E6 et renvoie le nom dans A2:A6.'],
      explain: 'MIN trouve le plus petit TCO, RECHERCHEX retrouve sa ligne dans la colonne des TCO et renvoie le nom du fournisseur situé sur la même ligne.',
    },
    {
      id: 'part-economies',
      fn: 'SOMME.SI',
      level: 2,
      tier: 4,
      title: 'La part des économies par famille',
      context: 'Ton directeur veut savoir quelle part des économies de l\'année vient de la famille « Emballages ».',
      instruction: 'En **E1**, calcule la **part des économies** de la famille « Emballages » dans le total, en **%**, **arrondie à 1 décimale**.',
      generate() {
        const fams = ['Emballages', ...Array.from({ length: 7 }, () => pick(FAMILIES))]
        const rows = [['Famille', 'Économie (€)'], ...sample(fams, fams.length).map((f) => [f, int(2, 40) * 500])]
        return { rows, extra: { D1: 'Part Emballages (%)' } }
      },
      target: 'E1',
      solution: '=ARRONDI(SOMME.SI(A2:A9;"Emballages";B2:B9)/SOMME(B2:B9)*100;1)',
      mustUse: ['SOMME.SI', 'SOMME', 'ARRONDI'],
      hints: ['SOMME.SI(A2:A9;"Emballages";B2:B9) additionne les économies de cette famille.', 'Divise par SOMME(B2:B9), multiplie par 100, puis entoure le tout de ARRONDI(…;1).'],
      explain: 'SOMME.SI isole le total d\'une famille, SOMME donne le total général : leur rapport, multiplié par 100, est la part en pourcentage.',
    },
  ],

  cases: [
    {
      id: 'appel-offres-chiffre',
      title: "Le résultat de l'appel d'offres",
      role: "Acheteur dans une entreprise industrielle",
      lesson: 'achats/sourcing',
      generate() {
        const base = int(50, 120)
        const tB = base * (1 + int(8, 12) / 100)
        const tC = tB * (1 + int(5, 9) / 100)
        const tA = tC * (1 + int(5, 9) / 100)
        const eA = tA / base - 1
        const eB = int(3, 6) / 100
        const pB = tB / (1 + eB)
        const eC = int(8, 12) / 100
        const pC = tC / (1 + eC)
        const V = int(10, 50) * 1000
        const gap = (tA - tB) * V
        const nego = tB * V * 0.03
        const pct = (n) => `${Math.round(n * 100)} %`
        return {
          intro: `Trois fournisseurs répondent à ton appel d'offres pour ${fmt(V)} pièces par an. A : ${eur(base, 2)} la pièce, frais annexes (transport, douane, défauts) estimés à +${pct(eA)}. B : ${eur(pB, 2)}, frais annexes +${pct(eB)}. C : ${eur(pC, 2)}, frais annexes +${pct(eC)}.`,
          steps: [
            {
              situation: 'Sur quelle base compares-tu ces trois offres ?',
              better: `TCO unitaire : A = ${eur(tA, 2)}, B = ${eur(tB, 2)}, C = ${eur(tC, 2)}. Le fournisseur A est le moins cher à l'achat mais le plus cher au total : choisir A au prix seul coûterait ${eur(gap, 0)} de plus par an que B.`,
              choices: [
                { text: 'Le TCO : prix plus frais annexes.', points: 3, feedback: `Le TCO de B (${eur(tB, 2)}) est le plus bas : B fait économiser ${eur(gap, 0)} par an par rapport à A.` },
                { text: "Le prix d'achat seul.", points: 0, feedback: `A est le moins cher à l'achat, mais ses frais annexes portent son coût à ${eur(tA, 2)} : tu perdrais ${eur(gap, 0)} par an.` },
                { text: "L'offre de B parce que je travaille déjà avec lui.", points: 1, feedback: "Bon résultat, mais pour une mauvaise raison : un choix doit reposer sur le coût total et la grille de critères, pas sur l'habitude." },
              ],
            },
            {
              situation: 'Tu retiens B. Que négocies-tu avec lui ?',
              better: `Un engagement de volume sur 2 ans contre une baisse de 3 % vaut ${eur(nego, 0)} par an (3 % de ${eur(tB * V, 0)}), sans faire fuir le fournisseur : il y gagne en visibilité. Exiger −15 % sans contrepartie risque de dégrader la qualité ou de rompre la discussion.`,
              choices: [
                { text: "Un engagement de volume sur 2 ans contre une baisse de prix de 3 %.", points: 3, feedback: `Chacun y gagne : le fournisseur sécurise ses ventes, toi une économie d'environ ${eur(nego, 0)} par an.` },
                { text: 'Une baisse de 15 % sans aucune contrepartie.', points: 1, feedback: 'Le fournisseur risque de refuser, ou de compenser en rognant sur la qualité ou les délais.' },
                { text: 'Rien : j\'accepte son offre telle quelle.', points: 0, feedback: `Tu renonces à une économie possible d'environ ${eur(nego, 0)} par an, sans même essayer.` },
              ],
            },
            {
              situation: 'Quelle clause du contrat protège le mieux ton service ?',
              better: "Des pénalités de retard plafonnées et une garantie qualité transforment les engagements du fournisseur en obligations mesurables. Une exclusivité totale te lierait à lui sans protection, et sans contrat tu n'aurais aucun recours en cas de problème.",
              choices: [
                { text: 'Des pénalités de retard plafonnées et une garantie qualité.', points: 3, feedback: 'Les délais et la qualité deviennent des engagements mesurables, avec une sanction proportionnée si le fournisseur y manque.' },
                { text: "Une exclusivité totale, sans aucune contrepartie.", points: 0, feedback: "Tu t'enfermerais chez un fournisseur unique sans garantie : une dépendance risquée." },
                { text: 'Aucune clause : la confiance suffit.', points: 1, feedback: 'La confiance aide, mais en cas de litige sans clause écrite, tu n\'as presque aucun recours.' },
              ],
            },
          ],
          debrief: `On choisit un fournisseur au coût total (ici B à ${eur(tB, 2)}), pas au prix affiché. On négocie avec des contreparties (volume, durée), puis on sécurise avec un contrat clair : délais, qualité, pénalités.`,
        }
      },
    },
    {
      id: 'fournisseur-dominant',
      title: 'Le fournisseur en position de force',
      role: "Responsable achats d'un fabricant d'équipements",
      lesson: 'achats/fournisseurs',
      intro:
        "Ton fournisseur unique de composants électroniques (45 % de tes achats) annonce une hausse de prix de 8 % dès le mois prochain. Aucune autre source n'est qualifiée aujourd'hui : un changement de fournisseur prendrait environ 9 mois.",
      steps: [
        {
          situation: 'Que fais-tu en priorité ?',
          better:
            "Tu ne peux pas changer de fournisseur dans l'immédiat, mais tu peux préparer la sortie : lancer la qualification d'une 2e source (9 mois) tout en négociant crée une alternative crédible. Accepter sans réagir te laisserait à sa merci pour les prochaines hausses.",
          choices: [
            { text: 'Je lance la qualification d\'une 2e source et je négocie avec l\'actuel.', points: 3, feedback: 'Tu travailles sur deux tableaux : négociation immédiate, et alternative crédible à moyen terme qui réduit ta dépendance.' },
            { text: 'J\'accepte la hausse pour ne pas risquer une rupture.', points: 1, feedback: 'Une rupture est évitée à court terme, mais tu restes dépendant : d\'autres hausses peuvent suivre.' },
            { text: 'Je menace d\'arrêter tous mes achats dès demain.', points: 0, feedback: 'Sans alternative prête, la menace n\'est pas crédible : tu risques une rupture que tu ne pourrais pas compenser.' },
          ],
        },
        {
          situation: 'Comment négocies-tu avec lui ?',
          better:
            "Tu pèses 45 % de tes achats : tu es un client important pour lui aussi. Offrir un engagement de volume et de durée contre un gel (ou une hausse limitée) lui donne de la visibilité et protège ton coût. Un refus de discuter te fermerait toute marge de manœuvre.",
          choices: [
            { text: 'Je propose un engagement de volume et de durée contre un gel ou une hausse limitée.', points: 3, feedback: 'Tu donnes de la visibilité en échange d\'un prix stable : un échange équilibré qui protège ta marge.' },
            { text: 'Je demande à voir ses coûts internes pour comprendre sa hausse.', points: 1, feedback: 'La transparence des coûts est un bon levier, mais seule, elle ne garantit pas de résultat concret.' },
            { text: 'Je refuse de discuter tant qu\'il maintient la hausse.', points: 0, feedback: 'Sans alternative, bloquer la discussion ne te sert pas : le fournisseur sait que tu dépends de lui.' },
          ],
        },
        {
          situation: 'Comment réduire durablement ta dépendance ?',
          better:
            "Trois actions combinées font baisser le risque : une 2e source qualifiée, des pièces standardisées (donc plus faciles à approvisionner ailleurs) et un stock de sécurité adapté pendant la transition. Augmenter les stocks seuls coûte cher sans régler la dépendance.",
          choices: [
            { text: 'Qualifier une 2e source, standardiser les pièces, adapter le stock de sécurité.', points: 3, feedback: 'Tu agis sur la cause (une seule source) et sur la transition (stock), avec des pièces plus simples à approvisionner.' },
            { text: 'Augmenter tous mes stocks, sans autre action.', points: 1, feedback: 'Un gros stock immobilise de l\'argent sans supprimer la dépendance au fournisseur unique.' },
            { text: 'Ne rien faire tant qu\'il n\'y a pas de rupture.', points: 0, feedback: 'Attendre la rupture, c\'est subir : un changement de fournisseur prend 9 mois, trop long pour réagir à chaud.' },
          ],
        },
      ],
      debrief:
        "Face à un fournisseur dominant, on combine une négociation avec contreparties et la construction d'une alternative : deuxième source, standardisation, stock adapté. La dépendance se réduit avant la crise, pas pendant.",
    },
  ],

  english: {
    units: [
      {
        id: 'negociation',
        title: 'Négocier et commander',
        icon: 'handshake',
        color: 'amber',
        lessons: [
          {
            id: 'devis',
            title: 'Demander un devis',
            level: 3,
            items: [
              { en: 'Could you send us a quote for these items?', fr: 'Pourriez-vous nous envoyer un devis pour ces articles ?', blank: 'quote' },
              { en: 'What is your lead time for this order?', fr: 'Quel est votre délai pour cette commande ?', blank: 'lead' },
              { en: 'Is the price valid for thirty days?', fr: 'Le prix est-il valable trente jours ?', blank: 'valid' },
              { en: 'Do you offer a discount for larger quantities?', fr: 'Proposez-vous une remise pour de plus grandes quantités ?', blank: 'discount' },
              { en: 'Please include the delivery costs in your offer.', fr: 'Merci d\'inclure les frais de livraison dans votre offre.', blank: 'include' },
            ],
          },
          {
            id: 'prix',
            title: 'Négocier un prix',
            level: 3,
            items: [
              { en: 'Your price is higher than our budget.', fr: 'Votre prix est supérieur à notre budget.', blank: 'budget' },
              { en: 'Could you improve your offer?', fr: 'Pourriez-vous améliorer votre offre ?', blank: 'improve' },
              { en: 'We can order more if you reduce the price.', fr: 'Nous pouvons commander davantage si vous baissez le prix.', blank: 'reduce' },
              { en: "Let's find a solution that works for both of us.", fr: 'Trouvons une solution qui convienne à nous deux.', blank: 'solution' },
              { en: 'We would like to sign a long-term agreement.', fr: 'Nous souhaiterions signer un accord à long terme.', blank: 'agreement' },
            ],
          },
        ],
      },
    ],
    extend: {
      achats: [
        {
          id: 'contrats-en',
          title: 'Contrats et appels d\'offres',
          level: 2,
          items: [
            { en: 'contract', fr: 'contrat', def: "Accord écrit qui fixe les droits et les obligations des deux parties.", ex: 'We signed the contract last week.', exFr: 'Nous avons signé le contrat la semaine dernière.' },
            { en: 'tender', fr: "appel d'offres", def: "Procédure par laquelle un acheteur demande des offres à plusieurs fournisseurs.", ex: 'The company launched a tender for packaging.', exFr: "L'entreprise a lancé un appel d'offres pour les emballages." },
            { en: 'bid', fr: 'offre (soumission)', def: "Proposition de prix et de conditions envoyée en réponse à un appel d'offres.", ex: 'We submitted our bid on Monday.', exFr: 'Nous avons remis notre offre lundi.' },
            { en: 'clause', fr: 'clause', def: "Article d'un contrat qui règle un point précis, comme les pénalités.", ex: 'This clause covers late deliveries.', exFr: 'Cette clause couvre les retards de livraison.' },
            { en: 'penalty', fr: 'pénalité', def: "Somme à payer quand une obligation du contrat n'est pas respectée.", ex: 'A penalty applies for each day of delay.', exFr: 'Une pénalité s\'applique pour chaque jour de retard.' },
            { en: 'warranty', fr: 'garantie', def: "Engagement du fournisseur de réparer ou de remplacer un produit défectueux pendant une durée.", ex: 'The warranty lasts two years.', exFr: 'La garantie dure deux ans.', note: 'Piège : « garantie » = warranty (produit) ; « guarantee » existe aussi, plus général.' },
          ],
        },
      ],
    },
  },
}
