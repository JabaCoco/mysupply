// Études de cas : une situation, puis des décisions successives.
// Chaque choix rapporte de 0 à 3 points et affiche une explication.
// `lesson` : leçon du cours à revoir (clé module/leçon).

export const CASES = [
  {
    id: 'ruptures',
    title: 'Ruptures avant le Black Friday',
    role: 'Responsable approvisionnement chez un e-commerçant de petit électroménager',
    intro:
      "Il reste 3 semaines avant le Black Friday. Ton taux de rupture est déjà de 12 % sur les références phares, et la direction commerciale prévoit des ventes multipliées par 3 pendant la semaine de promotion.",
    lesson: 'stocks/stock-securite',
    steps: [
      {
        situation: 'Par où commences-tu ?',
        better:
          "Avec l'ABC, environ 20 % des références font 80 % des ventes : sur 500 références, l'effort se concentre sur une centaine. Tripler tout le stock immobiliserait aussi de l'argent sur les 400 autres, qui ne pèsent qu'environ 20 % des ventes et risquent de finir en invendus.",
        choices: [
          { text: 'Je commande 3 fois plus de tout, tout de suite.', points: 0, feedback: "Commander 3 fois plus sur toutes les références, c'est risquer un surstock énorme sur les articles qui se vendent peu. Le cash immobilisé et les invendus coûteront cher." },
          { text: "Je fais une analyse ABC pour cibler les références qui pèsent le plus dans les ventes.", points: 3, feedback: "Bonne approche : les quelques références A font l'essentiel du chiffre. C'est là que l'effort d'approvisionnement doit se concentrer." },
          { text: "J'attends de voir les ventes de la première semaine.", points: 1, feedback: "Avec des délais fournisseurs de plusieurs semaines, attendre revient à subir les ruptures pendant le pic." },
        ],
      },
      {
        situation: 'Ton principal fournisseur annonce un délai de 5 semaines au lieu de 3. Que fais-tu ?',
        better:
          "Le stock de sécurité dépend de √L : passer de 3 à 5 semaines le multiplie par √(5/3) ≈ 1,29, soit +29 %. Et le point de commande augmente de 2 semaines de demande. Sans recalcul, tu commandes trop tard. Une 2e source sur les références A réduit le risque, pour un coût bien inférieur à l'aérien, plusieurs fois plus cher que le maritime.",
        choices: [
          { text: 'Je recalcule mon stock de sécurité avec le nouveau délai et je cherche un fournisseur de secours pour les références A.', points: 3, feedback: "Le délai entre dans la formule du stock de sécurité (√L) : il faut le recalculer. Une deuxième source réduit le risque sur les articles critiques." },
          { text: "Je ne change rien : le délai finira par revenir à la normale.", points: 0, feedback: "Ignorer un allongement du délai, c'est la rupture assurée : ton point de commande est devenu trop bas." },
          { text: "Je passe toutes les commandes en transport aérien.", points: 1, feedback: "L'aérien peut sauver quelques références urgentes, mais pour tout le volume, le coût exploserait la marge de la promotion." },
        ],
      },
      {
        situation: 'Le Black Friday est passé. Comment évites-tu de revivre ça ?',
        better:
          "Le S&OP traite la cause : une promotion connue 2 mois à l'avance est intégrée aux prévisions et aux commandes. À l'inverse, garder 3 mois de stock partout coûte cher : pour 1 M€ de consommation annuelle, c'est environ 250 k€ de stock, soit 50 k€ par an avec un taux de possession de 20 %.",
        choices: [
          { text: "Je mets en place un processus S&OP mensuel avec les commerciaux pour anticiper les promotions.", points: 3, feedback: "Le S&OP aligne ventes et supply chain : les promotions sont connues à l'avance et intégrées aux prévisions et aux approvisionnements." },
          { text: 'Je garde en permanence 3 mois de stock sur tout.', points: 1, feedback: "Ça évite les ruptures, mais le coût de possession (15 à 30 % de la valeur par an) devient énorme." },
          { text: 'Je demande aux commerciaux de ne plus faire de promotions.', points: 0, feedback: "Les promotions font partie du business. Le rôle de la supply chain est de les anticiper, pas de les interdire." },
        ],
      },
    ],
    debrief:
      "Les trois réflexes : cibler l'effort (ABC), recalculer les paramètres quand le contexte change (délai → stock de sécurité), et partager l'information avec les commerciaux (S&OP).",
  },
  {
    id: 'conteneur',
    title: 'Le conteneur bloqué',
    role: "Responsable transport d'un importateur de mobilier",
    intro:
      "Un conteneur de 40 pieds de canapés venant d'Asie devait arriver au Havre dans 10 jours. Suite à des tensions en mer Rouge, le navire est dérouté par le cap de Bonne-Espérance : 12 jours de retard. Ton plus gros client attend la livraison pour l'ouverture d'un magasin.",
    lesson: 'transport/modes',
    steps: [
      {
        situation: 'Quelle est ta première action ?',
        better:
          "Le détour par le cap de Bonne-Espérance ajoute environ 6 000 km et une dizaine de jours : le retard est certain, il ne se rattrapera pas. Prévenir tout de suite laisse au client une dizaine de jours pour réorganiser son ouverture ; attendre réduit cette marge à zéro.",
        choices: [
          { text: 'Je préviens tout de suite le client, avec une nouvelle date estimée et des solutions.', points: 3, feedback: "La transparence avant tout : un client prévenu tôt peut s'organiser. Un client qui découvre le retard le jour J est perdu." },
          { text: "J'attends d'avoir une date sûre avant de prévenir le client.", points: 1, feedback: "Plus tu attends, moins le client a de marge pour s'adapter. Mieux vaut une estimation honnête qu'un silence." },
          { text: 'Je ne dis rien et j\'espère que le navire rattrape son retard.', points: 0, feedback: 'Un détour par le cap de Bonne-Espérance ajoute des milliers de kilomètres : le retard ne se rattrapera pas.' },
        ],
      },
      {
        situation: "Le client a absolument besoin de 20 canapés d'exposition pour l'ouverture. Que proposes-tu ?",
        better:
          "Prendre 20 canapés dans le stock français : livraison en 1 ou 2 jours, pour un coût presque nul. En aérien, un canapé est facturé à son poids volumétrique (plusieurs m³ chacun) : la facture se compterait en milliers d'euros pour des produits peu chers au kilo.",
        choices: [
          { text: "Je prélève 20 canapés sur le stock de mon entrepôt français, quitte à décaler d'autres commandes moins urgentes.", points: 3, feedback: 'Réaffecter le stock disponible selon les priorités clients est la solution la plus rapide et la moins chère.' },
          { text: 'J\'envoie les 20 canapés par avion depuis l\'Asie.', points: 1, feedback: "Possible mais très cher pour des produits volumineux et peu chers au kilo : l'aérien est taxé au poids volumétrique." },
          { text: "Je refuse : ce n'est pas de ma faute s'il y a des tensions en mer Rouge.", points: 0, feedback: "Ce n'est pas ta faute, mais c'est ton problème : le client retiendra surtout que tu ne l'as pas aidé." },
        ],
      },
      {
        situation: 'Qui supporte le risque pendant le transport ? La marchandise a été achetée en FOB Shanghai.',
        better:
          "FOB = Free On Board : le vendeur a rempli son obligation dès que la marchandise est à bord, à Shanghai. Tout ce qui arrive ensuite (retard, avarie) est le risque de l'acheteur, qui a choisi et payé le transport principal. C'est pourquoi un acheteur en FOB a intérêt à assurer sa marchandise.",
        choices: [
          { text: 'Le fournisseur chinois, jusqu\'à l\'arrivée au Havre.', points: 0, feedback: "Non : en FOB, le risque passe à l'acheteur dès que la marchandise est à bord du navire au port de départ." },
          { text: "C'est nous, l'acheteur, depuis le chargement à bord à Shanghai.", points: 3, feedback: "Exact. En FOB, c'est l'acheteur qui organise et paie le transport principal, et qui porte le risque dès le chargement à bord." },
          { text: 'Le transporteur maritime, dans tous les cas.', points: 1, feedback: "Le transporteur a une responsabilité limitée et peut invoquer des circonstances exceptionnelles. Le risque commercial reste celui que définit l'Incoterm." },
        ],
      },
    ],
    debrief:
      "Face à une crise de transport : prévenir tôt, prioriser les clients avec le stock disponible, et connaître son Incoterm pour savoir qui porte le risque.",
  },
  {
    id: 'fournisseur',
    title: 'Choisir un nouveau fournisseur',
    role: "Acheteur dans une PME qui fabrique des vélos électriques",
    intro:
      "Tu dois choisir un fournisseur de cadres en aluminium. Fournisseur Asie : 82 € le cadre, délai 10 semaines, taux de défaut annoncé 3 %. Fournisseur Portugal : 95 € le cadre, délai 2 semaines, taux de défaut 0,5 %.",
    lesson: 'achats/fournisseurs',
    steps: [
      {
        situation: 'Sur quel critère principal compares-tu les deux offres ?',
        better:
          "Le cadre à 82 € coûte plus que son prix : 3 % de défauts représentent déjà 82 × 3 % ≈ 2,46 € par cadre, contre 95 × 0,5 % ≈ 0,48 € au Portugal. Il faut encore ajouter le transport depuis l'Asie, la douane et le stock imposé par 10 semaines de délai. Seul le TCO compare les deux offres sur une base juste.",
        choices: [
          { text: 'Le prix unitaire : 82 € contre 95 €.', points: 0, feedback: "Le prix n'est qu'une partie du coût. Transport, douane, stock et défauts peuvent inverser le classement." },
          { text: 'Le TCO : prix + transport + douane + stock + coût de la non-qualité.', points: 3, feedback: 'Le coût total de possession (TCO) est la bonne base de comparaison entre deux fournisseurs.' },
          { text: 'Le fournisseur le plus proche, toujours.', points: 1, feedback: "La proximité a des avantages (délais, réactivité), mais ce n'est pas un critère suffisant à lui seul." },
        ],
      },
      {
        situation: "Avec 10 semaines de délai, que se passe-t-il pour ton stock si tu choisis l'Asie ?",
        better:
          "SS = z × σ × √L : passer de 2 à 10 semaines multiplie le stock de sécurité par √(10/2) = √5 ≈ 2,24. Ce stock supplémentaire a un coût de possession, qui doit être ajouté au TCO du fournisseur asiatique.",
        choices: [
          { text: 'Rien ne change.', points: 0, feedback: 'Le délai entre dans le calcul du stock de sécurité et du point de commande : il a un impact direct.' },
          { text: "Il faut un stock de sécurité plus important, car le délai est plus long et plus incertain.", points: 3, feedback: "SS = z × σ × √L : un délai 5 fois plus long multiplie le stock de sécurité par environ √5 ≈ 2,2." },
          { text: 'Il faut moins de stock, car on commande en plus gros volumes.', points: 1, feedback: "Commander en gros augmente au contraire le stock moyen (Q/2). Et le délai long augmente le stock de sécurité." },
        ],
      },
      {
        situation: 'Les cadres sont un composant clé, coûteux, et peu de fournisseurs savent les produire. Dans la matrice de Kraljic, c\'est…',
        better:
          "Composant cher (fort impact financier) + peu de fournisseurs (fort risque) = quadrant « stratégique ». Un partenariat durable sécurise l'approvisionnement. Mettre en concurrence agressivement des fournisseurs rares risque au contraire de les faire partir… et de bloquer ta production de vélos.",
        choices: [
          { text: 'Un achat simple : on automatise.', points: 0, feedback: "Non : impact financier fort et risque fort, ce n'est pas un achat simple." },
          { text: 'Un achat levier : on met en concurrence au maximum.', points: 1, feedback: 'La mise en concurrence suppose beaucoup de fournisseurs disponibles. Ici, ils sont rares.' },
          { text: 'Un achat stratégique : on construit un partenariat durable, avec éventuellement une double source.', points: 3, feedback: 'Fort impact et fort risque : on sécurise la relation avec le fournisseur et on limite la dépendance.' },
        ],
      },
    ],
    debrief:
      "Un bon acheteur compare au TCO, intègre l'effet du délai sur les stocks, et adapte sa stratégie au type d'achat (Kraljic).",
  },
  {
    id: 'panne-wms',
    title: 'Panne du WMS un lundi matin',
    role: "Responsable d'un entrepôt de 200 000 commandes par mois",
    intro:
      "Lundi, 7 h. Le WMS ne répond plus : impossible de savoir où sont les produits ni d'imprimer les étiquettes. 6 000 commandes doivent partir avant 16 h. L'éditeur parle d'une cyberattaque possible.",
    lesson: 'outils/erp-wms-tms',
    steps: [
      {
        situation: 'Que fais-tu en premier ?',
        better:
          "Une cyberattaque peut se propager en quelques minutes dans le réseau : isoler les systèmes limite les dégâts. La cellule de crise réunit informatique, opérations et service client pour décider vite, avec une seule source d'information.",
        choices: [
          { text: "J'active la cellule de crise : informatique, direction, service client, et je fais isoler le système si c'est une cyberattaque.", points: 3, feedback: "Face à une possible cyberattaque, il faut d'abord contenir (isoler) et coordonner. Chaque minute de propagation coûte cher." },
          { text: 'Je redémarre tous les ordinateurs de l\'entrepôt.', points: 1, feedback: 'Redémarrer peut aider sur une panne simple, mais en cas de cyberattaque, on risque de détruire des traces utiles ou de propager le problème.' },
          { text: "Je renvoie les équipes chez elles en attendant.", points: 0, feedback: "Trop tôt : il existe souvent des modes dégradés qui permettent de continuer une partie de l'activité." },
        ],
      },
      {
        situation: 'Le WMS restera coupé toute la journée. Comment continues-tu à expédier ?',
        better:
          "Même si le mode dégradé ne tourne qu'à 30 ou 40 % de la cadence normale, c'est environ 2 000 commandes servies sur 6 000 au lieu de zéro, en priorisant les clients les plus critiques. C'est tout l'intérêt de préparer à l'avance des exports d'emplacements et des procédures papier.",
        choices: [
          { text: "J'utilise le plan de continuité : export de la veille des emplacements, préparation sur listes papier pour les clients prioritaires.", points: 3, feedback: "Un mode dégradé préparé à l'avance (exports réguliers, procédures papier) permet de servir les commandes les plus critiques." },
          { text: 'Les préparateurs cherchent les produits de mémoire.', points: 1, feedback: 'Possible pour quelques articles connus, mais très lent et source d\'erreurs sur des milliers de références.' },
          { text: "On n'expédie rien tant que le système n'est pas revenu.", points: 0, feedback: 'Zéro expédition, c\'est 6 000 clients mécontents. Il faut prioriser et servir au moins les commandes critiques.' },
        ],
      },
      {
        situation: "Le système est revenu le lendemain. Quelle est la priorité pour l'avenir ?",
        better:
          "Sans retour d'expérience, les mêmes failles restent ouvertes. Tester le plan de continuité chaque trimestre et renforcer sauvegardes et accès raccourcit nettement la prochaine panne. Changer de logiciel à chaud, c'est des mois de projet sans traiter la vraie cause.",
        choices: [
          { text: "Faire un retour d'expérience, tester le plan de continuité chaque trimestre et renforcer la cybersécurité (sauvegardes, accès).", points: 3, feedback: "C'est l'amélioration continue appliquée aux risques : on apprend de la crise et on s'entraîne pour la suivante." },
          { text: 'Changer immédiatement de logiciel WMS.', points: 1, feedback: "Une décision à chaud n'est pas forcément la bonne : la panne peut venir d'une cause extérieure au logiciel." },
          { text: 'Rien : une panne pareille n\'arrive qu\'une fois.', points: 0, feedback: 'Les pannes et cyberattaques touchant la logistique sont de plus en plus fréquentes : il faut s\'y préparer.' },
        ],
      },
    ],
    debrief:
      "Une panne informatique se gère comme toute crise : contenir, coordonner, basculer en mode dégradé préparé à l'avance, puis tirer les leçons.",
  },
]
