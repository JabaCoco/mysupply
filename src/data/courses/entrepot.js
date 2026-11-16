export default {
  id: 'entrepot',
  title: "L'entrepôt",
  short: 'Entrepôt',
  icon: 'warehouse',
  color: 'amber',
  lessons: [
    {
      id: 'etapes',
      title: "Les étapes d'un entrepôt",
      minutes: 4,
      cards: [
        {
          type: 'list',
          title: 'Le parcours d\'un produit',
          items: [
            ['1. Réception', 'Déchargement des camions, contrôle des quantités et de la qualité par rapport à la commande.'],
            ['2. Mise en stock', 'Rangement à un emplacement précis, enregistré dans le système.'],
            ['3. Stockage', 'Sur racks, au sol, en étagères… selon le produit et la rotation.'],
            ['4. Préparation (picking)', 'Prélèvement des articles pour constituer chaque commande.'],
            ['5. Emballage et expédition', 'Colisage, étiquetage, chargement dans le bon camion.'],
          ],
        },
        {
          type: 'text',
          title: 'Bien placer les produits',
          body:
            "Les produits qui sortent le plus souvent (forte **rotation**) sont placés **près des quais** et à hauteur d'homme, pour réduire les déplacements.\n\nC'est souvent la **méthode ABC appliquée aux sorties** : les A sont dans la « zone d'or ».",
        },
        {
          type: 'text',
          title: "Le WMS, cerveau de l'entrepôt",
          body:
            "Le **WMS** (Warehouse Management System) est le logiciel qui pilote l'entrepôt : il sait **où se trouve chaque produit**, indique où ranger, génère les listes de préparation et trace chaque mouvement grâce aux **codes-barres** ou à la **RFID**.",
        },
        {
          type: 'example',
          title: 'Chiffre clé',
          body:
            "La **préparation de commandes** est souvent l'activité **la plus coûteuse** de l'entrepôt : plus de la moitié des coûts d'exploitation, surtout à cause des **déplacements** des préparateurs.",
        },
        {
          type: 'key',
          points: [
            'Réception → mise en stock → stockage → préparation → expédition.',
            'Produits à forte rotation près des quais.',
            'Le WMS localise et trace tout.',
            'Le picking est le poste le plus coûteux.',
          ],
        },
      ],
      quiz: [
        {
          q: 'Quelle étape consiste à prélever les articles pour constituer une commande ?',
          choices: ['La réception', 'Le picking', 'La mise en stock', "L'inventaire"],
          answer: 1,
          explain: 'Le picking (préparation de commandes) consiste à aller chercher les articles demandés.',
        },
        {
          q: 'Où place-t-on les produits qui sortent le plus souvent ?',
          choices: ['Tout en haut des racks', 'Au fond de l\'entrepôt', 'Près des quais, à hauteur d\'homme', 'Dans un autre entrepôt'],
          answer: 2,
          explain: 'On réduit ainsi les déplacements, qui coûtent cher en temps.',
        },
        {
          q: 'Que signifie WMS ?',
          choices: ['World Maritime Service', 'Warehouse Management System', 'Weekly Material Stock', 'Wholesale Market Store'],
          answer: 1,
          explain: "Le WMS est le logiciel de gestion d'entrepôt.",
        },
        {
          q: 'Pourquoi le picking coûte-t-il si cher ?',
          choices: ['À cause des déplacements des préparateurs', 'À cause des loyers', 'À cause des camions', 'Il ne coûte rien'],
          answer: 0,
          explain: 'Les préparateurs passent une grande partie de leur temps à se déplacer entre les emplacements.',
        },
      ],
    },
    {
      id: 'picking',
      title: 'Picking et cross-docking',
      minutes: 5,
      cards: [
        {
          type: 'list',
          title: 'Deux grandes logiques',
          items: [
            ['Homme vers produit', 'Le préparateur se déplace dans les allées avec un chariot ou un terminal.'],
            ['Produit vers homme', 'Des robots ou convoyeurs amènent les bacs au préparateur, qui reste à son poste (ex. robots Amazon, AutoStore).'],
          ],
        },
        {
          type: 'list',
          title: 'Les méthodes de préparation',
          items: [
            ['Par commande', 'Une commande à la fois : simple, mais beaucoup de trajets.'],
            ['Par lots (batch)', 'Plusieurs commandes prélevées en même temps, puis triées.'],
            ['Par zones', 'Chaque préparateur gère sa zone ; la commande passe de zone en zone.'],
            ['Par vagues', 'Les commandes sont lancées par vagues, par exemple selon l\'heure de départ des camions.'],
          ],
        },
        {
          type: 'text',
          title: 'Le cross-docking',
          body:
            "Avec le **cross-docking**, la marchandise **ne passe pas par le stockage** : elle arrive sur un quai, est triée, puis repart presque aussitôt (souvent en **moins de 24 h**) vers sa destination.\n\nRésultat : moins de stock, moins de manutention, des livraisons plus rapides.",
        },
        {
          type: 'example',
          title: 'Exemple : la grande distribution',
          body:
            "Plusieurs fournisseurs livrent une plateforme régionale. Les palettes y sont **éclatées et regroupées par magasin**, puis repartent le jour même. Chaque magasin reçoit un seul camion au lieu de dizaines de livraisons.",
        },
        {
          type: 'key',
          points: [
            'Homme vers produit ou produit vers homme (automatisation).',
            'Picking par commande, par lots, par zones ou par vagues.',
            'Cross-docking = transit sans stockage, en moins de 24 h.',
          ],
        },
      ],
      quiz: [
        {
          q: 'Un entrepôt où des robots apportent les bacs au préparateur fonctionne en…',
          choices: ['Homme vers produit', 'Produit vers homme', 'Cross-docking', 'Flux poussé'],
          answer: 1,
          explain: 'Le préparateur reste fixe, ce sont les produits qui viennent à lui.',
        },
        {
          q: 'Le cross-docking consiste à…',
          choices: [
            'Stocker longtemps la marchandise',
            'Faire transiter la marchandise sans la stocker',
            'Fabriquer des produits sur mesure',
            'Compter le stock une fois par an',
          ],
          answer: 1,
          explain: 'La marchandise est réceptionnée, triée et réexpédiée rapidement, sans passer par le stockage.',
        },
        {
          q: 'Préparer 10 commandes en un seul passage puis les trier, c\'est le picking…',
          choices: ['Par commande', 'Par lots', 'Par vagues', 'Inversé'],
          answer: 1,
          explain: 'On regroupe plusieurs commandes (un batch) pour réduire les trajets.',
        },
        {
          q: 'Principal avantage du cross-docking ?',
          choices: ['Plus de stock', 'Moins de stock et des livraisons plus rapides', 'Des produits plus chers', 'Plus de manutention'],
          answer: 1,
          explain: 'Sans stockage, on réduit les stocks, les manipulations et le délai.',
        },
      ],
    },
  ],
}
