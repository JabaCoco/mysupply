// Parcours d'anglais de la supply chain.
// La difficulté monte au fil des unités : level 1 = mots simples, 2 = mots en contexte, 3 = phrases et mails.
//
// Élément d'une leçon :
//   mot    : { en, fr, ex, exFr, alt?, note? }  — ex/exFr = phrase d'exemple (sert aussi aux exercices)
//   phrase : { en, fr, blank }                   — blank = mot clé à trouver dans les exercices "à trous"
// alt : autres réponses acceptées quand on tape le mot ; note : remarque affichée (faux amis…)

export const UNITS = [
  {
    id: 'bases',
    title: 'Les bases',
    icon: 'network',
    color: 'violet',
    lessons: [
      {
        id: 'acteurs',
        title: 'Les acteurs de la chaîne',
        level: 1,
        items: [
          { en: 'supplier', fr: 'fournisseur', ex: 'We have a new supplier in Spain.', exFr: 'Nous avons un nouveau fournisseur en Espagne.', alt: ['vendor'] },
          { en: 'customer', fr: 'client', ex: 'The customer wants a faster delivery.', exFr: 'Le client veut une livraison plus rapide.', alt: ['client'] },
          { en: 'manufacturer', fr: 'fabricant', ex: 'The manufacturer produces five hundred bikes a day.', exFr: 'Le fabricant produit cinq cents vélos par jour.' },
          { en: 'retailer', fr: 'détaillant', ex: 'The retailer sells our products in its stores.', exFr: 'Le détaillant vend nos produits dans ses magasins.' },
          { en: 'wholesaler', fr: 'grossiste', ex: 'The wholesaler buys large quantities.', exFr: 'Le grossiste achète de grandes quantités.' },
          { en: 'carrier', fr: 'transporteur', ex: 'The carrier picks up the goods in the morning.', exFr: 'Le transporteur enlève la marchandise le matin.' },
        ],
      },
      {
        id: 'commandes',
        title: 'Commandes et livraisons',
        level: 1,
        items: [
          { en: 'order', fr: 'commande', ex: 'The order is ready to ship.', exFr: 'La commande est prête à être expédiée.' },
          { en: 'delivery', fr: 'livraison', ex: 'Delivery takes two days.', exFr: 'La livraison prend deux jours.' },
          { en: 'shipment', fr: 'envoi (expédition)', ex: 'The shipment left the warehouse this morning.', exFr: "L'envoi a quitté l'entrepôt ce matin." },
          { en: 'goods', fr: 'marchandises', ex: 'The goods arrived in good condition.', exFr: 'Les marchandises sont arrivées en bon état.' },
          { en: 'lead time', fr: "délai d'approvisionnement", ex: 'The lead time is three weeks.', exFr: "Le délai d'approvisionnement est de trois semaines." },
          { en: 'demand', fr: 'demande', ex: 'Demand is high in December.', exFr: 'La demande est forte en décembre.' },
        ],
      },
    ],
  },
  {
    id: 'transport',
    title: 'Transport et douane',
    icon: 'truck',
    color: 'emerald',
    lessons: [
      {
        id: 'modes',
        title: 'Les modes de transport',
        level: 1,
        items: [
          { en: 'freight', fr: 'fret', ex: 'Sea freight is cheaper than air freight.', exFr: 'Le fret maritime est moins cher que le fret aérien.' },
          { en: 'truck', fr: 'camion', ex: 'The truck is fully loaded.', exFr: 'Le camion est chargé à plein.', alt: ['lorry'], note: 'En anglais britannique, on dit aussi « lorry ».' },
          { en: 'vessel', fr: 'navire', ex: 'The vessel arrives in Le Havre on Monday.', exFr: 'Le navire arrive au Havre lundi.', alt: ['ship'] },
          { en: 'container', fr: 'conteneur', ex: 'We need a forty foot container.', exFr: "Nous avons besoin d'un conteneur de quarante pieds." },
          { en: 'port', fr: 'port', ex: 'The port is very busy today.', exFr: 'Le port est très encombré aujourd’hui.' },
          { en: 'route', fr: 'itinéraire', ex: 'The ship took a longer route.', exFr: 'Le navire a pris un itinéraire plus long.' },
        ],
      },
      {
        id: 'documents',
        title: 'Documents et douane',
        level: 2,
        items: [
          { en: 'bill of lading', fr: 'connaissement', ex: 'The bill of lading proves the goods were loaded.', exFr: 'Le connaissement prouve que la marchandise a été chargée.', note: 'Abrégé « B/L » : le document clé du transport maritime.' },
          { en: 'invoice', fr: 'facture', ex: 'Please send us the invoice.', exFr: 'Merci de nous envoyer la facture.' },
          { en: 'customs', fr: 'douane', ex: 'The goods are held at customs.', exFr: 'La marchandise est bloquée en douane.' },
          { en: 'customs clearance', fr: 'dédouanement', ex: 'Customs clearance took two days.', exFr: 'Le dédouanement a pris deux jours.' },
          { en: 'freight forwarder', fr: 'transitaire', ex: 'Our freight forwarder books the containers.', exFr: 'Notre transitaire réserve les conteneurs.', alt: ['forwarder'] },
          { en: 'packing list', fr: 'liste de colisage', ex: 'The packing list shows twenty pallets.', exFr: 'La liste de colisage indique vingt palettes.' },
        ],
      },
    ],
  },
  {
    id: 'entrepot',
    title: 'Stocks et entrepôt',
    icon: 'warehouse',
    color: 'orange',
    lessons: [
      {
        id: 'stocks',
        title: 'Gérer les stocks',
        level: 2,
        items: [
          { en: 'warehouse', fr: 'entrepôt', ex: 'The warehouse is open seven days a week.', exFr: "L'entrepôt est ouvert sept jours sur sept." },
          { en: 'inventory', fr: 'stock', ex: 'We check the inventory every month.', exFr: 'Nous vérifions le stock chaque mois.', alt: ['stock'], note: '« Inventory » désigne le stock lui-même, pas seulement l’inventaire (le comptage).' },
          { en: 'stockout', fr: 'rupture de stock', ex: 'A stockout means lost sales.', exFr: 'Une rupture de stock signifie des ventes perdues.', alt: ['stock out', 'stock-out'] },
          { en: 'safety stock', fr: 'stock de sécurité', ex: 'We keep a safety stock of fifty units.', exFr: 'Nous gardons un stock de sécurité de cinquante unités.' },
          { en: 'reorder point', fr: 'point de commande', ex: 'We order when stock reaches the reorder point.', exFr: 'Nous commandons quand le stock atteint le point de commande.' },
          { en: 'item', fr: 'article', ex: 'This item is out of stock.', exFr: 'Cet article est en rupture de stock.' },
        ],
      },
      {
        id: 'operations',
        title: "Dans l'entrepôt",
        level: 2,
        items: [
          { en: 'picking', fr: 'préparation de commandes', ex: 'Picking is the most expensive task.', exFr: 'La préparation de commandes est la tâche la plus coûteuse.' },
          { en: 'pallet', fr: 'palette', ex: 'Put the boxes on the pallet.', exFr: 'Mets les cartons sur la palette.' },
          { en: 'forklift', fr: 'chariot élévateur', ex: 'Only trained staff can drive the forklift.', exFr: 'Seul le personnel formé peut conduire le chariot élévateur.' },
          { en: 'loading dock', fr: 'quai de chargement', ex: 'The truck is waiting at the loading dock.', exFr: 'Le camion attend au quai de chargement.' },
          { en: 'shelf', fr: 'étagère', ex: 'The item is on the top shelf.', exFr: "L'article est sur l'étagère du haut." },
          { en: 'label', fr: 'étiquette', ex: 'Each parcel needs a label.', exFr: 'Chaque colis a besoin d’une étiquette.' },
        ],
      },
    ],
  },
  {
    id: 'achats',
    title: 'Achats',
    icon: 'cart',
    color: 'sky',
    lessons: [
      {
        id: 'acheter',
        title: 'Acheter et négocier',
        level: 2,
        items: [
          { en: 'purchase order', fr: 'bon de commande', ex: 'We sent the purchase order yesterday.', exFr: 'Nous avons envoyé le bon de commande hier.', note: 'Abrégé « PO » dans les mails.' },
          { en: 'quote', fr: 'devis', ex: 'Can you send us a quote?', exFr: 'Pouvez-vous nous envoyer un devis ?', alt: ['quotation'] },
          { en: 'price', fr: 'prix', ex: 'The price includes delivery.', exFr: 'Le prix inclut la livraison.' },
          { en: 'discount', fr: 'remise', ex: 'They offer a discount for large orders.', exFr: 'Ils proposent une remise pour les grosses commandes.' },
          { en: 'payment terms', fr: 'conditions de paiement', ex: 'Our payment terms are thirty days.', exFr: 'Nos conditions de paiement sont de trente jours.' },
          { en: 'negotiate', fr: 'négocier', ex: 'We need to negotiate a better price.', exFr: 'Nous devons négocier un meilleur prix.', alt: ['to negotiate'] },
        ],
      },
    ],
  },
  {
    id: 'prevision',
    title: 'Prévision et planification',
    icon: 'trend',
    color: 'pink',
    lessons: [
      {
        id: 'planifier',
        title: 'Prévoir et planifier',
        level: 2,
        items: [
          { en: 'forecast', fr: 'prévision', ex: 'The sales forecast is too optimistic.', exFr: 'La prévision des ventes est trop optimiste.' },
          { en: 'capacity', fr: 'capacité', ex: 'The factory is running at full capacity.', exFr: "L'usine tourne à pleine capacité." },
          { en: 'bottleneck', fr: "goulot d'étranglement", ex: 'Packing is the bottleneck of the line.', exFr: "L'emballage est le goulot d'étranglement de la ligne." },
          { en: 'backorder', fr: 'commande en attente', ex: 'These items are on backorder.', exFr: 'Ces articles sont en commande en attente.', alt: ['back order'], note: 'Une commande acceptée mais pas encore servie, faute de stock.' },
          { en: 'peak season', fr: 'haute saison', ex: 'We hire extra staff for the peak season.', exFr: 'Nous embauchons du personnel en plus pour la haute saison.' },
          { en: 'shortage', fr: 'pénurie', ex: 'There is a shortage of chips.', exFr: 'Il y a une pénurie de puces.' },
        ],
      },
    ],
  },
  {
    id: 'faux-amis',
    title: 'Les faux amis',
    icon: 'alert',
    color: 'fuchsia',
    lessons: [
      {
        id: 'pieges',
        title: 'Les pièges à éviter',
        level: 2,
        items: [
          { en: 'delay', fr: 'retard', ex: 'Sorry for the delay.', exFr: 'Désolé pour le retard.', note: 'Piège : « delay » = retard. Le « délai » se dit « lead time ».' },
          { en: 'actually', fr: 'en fait', ex: 'Actually, the order is complete.', exFr: 'En fait, la commande est complète.', note: 'Piège : « actuellement » se dit « currently ».' },
          { en: 'eventually', fr: 'finalement', ex: 'The goods eventually arrived.', exFr: 'La marchandise est finalement arrivée.', note: 'Piège : « éventuellement » se dit « possibly ».' },
          { en: 'training', fr: 'formation', ex: 'New staff need forklift training.', exFr: "Le nouveau personnel a besoin d'une formation au chariot.", note: 'Piège : « formation » en anglais veut dire « disposition, arrangement ».' },
          { en: 'internship', fr: 'stage', ex: 'I am looking for an internship in logistics.', exFr: 'Je cherche un stage en logistique.', note: 'Piège : « stage » en anglais veut dire « étape » ou « scène ».' },
          { en: 'attend', fr: 'assister à', ex: 'I will attend the meeting.', exFr: "J'assisterai à la réunion.", alt: ['to attend'], note: 'Piège : « to assist » veut dire « aider ».' },
        ],
      },
    ],
  },
  {
    id: 'communication',
    title: 'Communiquer au travail',
    icon: 'mail',
    color: 'cyan',
    lessons: [
      {
        id: 'relance',
        title: 'Écrire un mail de relance',
        level: 3,
        items: [
          { en: 'I am writing to follow up on our order.', fr: 'Je vous écris pour faire le suivi de notre commande.', blank: 'follow' },
          { en: 'Could you please confirm the delivery date?', fr: 'Pourriez-vous confirmer la date de livraison ?', blank: 'confirm' },
          { en: 'Please find attached the purchase order.', fr: 'Veuillez trouver ci-joint le bon de commande.', blank: 'attached' },
          { en: 'I look forward to hearing from you.', fr: 'Dans l’attente de votre réponse.', blank: 'forward' },
          { en: 'Thank you in advance for your help.', fr: "Merci d'avance pour votre aide.", blank: 'advance' },
        ],
      },
      {
        id: 'retard',
        title: 'Annoncer un retard',
        level: 3,
        items: [
          { en: 'Unfortunately, the shipment has been delayed.', fr: "Malheureusement, l'envoi a été retardé.", blank: 'delayed' },
          { en: 'We apologize for the inconvenience.', fr: 'Nous vous prions de nous excuser pour la gêne occasionnée.', blank: 'apologize' },
          { en: 'The new estimated time of arrival is Friday.', fr: "La nouvelle date d'arrivée estimée est vendredi.", blank: 'arrival' },
          { en: 'The delay is due to a strike at the port.', fr: 'Le retard est dû à une grève au port.', blank: 'strike' },
          { en: 'We will keep you updated.', fr: 'Nous vous tiendrons informé.', blank: 'updated' },
        ],
      },
      {
        id: 'telephone',
        title: 'Au téléphone et en réunion',
        level: 3,
        items: [
          { en: 'Could you repeat that, please?', fr: "Pourriez-vous répéter, s'il vous plaît ?", blank: 'repeat' },
          { en: 'Let me check and get back to you.', fr: 'Je vérifie et je reviens vers vous.', blank: 'check' },
          { en: 'What is the status of the order?', fr: 'Où en est la commande ?', blank: 'status' },
          { en: 'Can we schedule a call tomorrow?', fr: 'Pouvons-nous prévoir un appel demain ?', blank: 'schedule' },
          { en: 'I will send you a summary by email.', fr: 'Je vous enverrai un résumé par mail.', blank: 'summary' },
        ],
      },
    ],
  },
]

export const LEVEL_LABELS = { 1: 'Mots', 2: 'Mots en contexte', 3: 'Phrases et mails' }

// Toutes les leçons à la suite, dans l'ordre du parcours
export const ALL_EN_LESSONS = UNITS.flatMap((unit) => unit.lessons.map((lesson) => ({ ...lesson, key: `${unit.id}/${lesson.id}`, unit })))

export const findEnLesson = (unitId, lessonId) => ALL_EN_LESSONS.find((l) => l.key === `${unitId}/${lessonId}`) ?? null

// Tous les mots (pas les phrases), pour les mots du jour et le lexique
export const ALL_WORDS = ALL_EN_LESSONS.flatMap((l) => l.items.filter((i) => i.ex).map((i) => ({ ...i, lessonKey: l.key })))

export const wordId = (en) => `word/${en.toLowerCase()}`
