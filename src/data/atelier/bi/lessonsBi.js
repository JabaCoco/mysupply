// Leçons Power BI : mini-cours + exercices à données aléatoires.
// La syntaxe DAX montrée est standard ; certains détails (séparateur d'arguments selon la langue, noms de menus)
// sont signalés dans A_VERIFIER.md.
import { choice, number, tbl, deliveries, deliveriesTable, fmt, int, pick, sample, pct, SUPPLIERS, WAREHOUSES } from './helpers.js'
import * as kpi from '../../../lib/biKpi.js'

export const BI_LESSONS = [
  // ───────────────────────── 1. Vue d'ensemble ─────────────────────────
  {
    id: 'bi-intro',
    track: 'bi',
    title: 'Power BI : vue d’ensemble',
    short: 'Du fichier brut au tableau de bord partagé',
    course: {
      purpose:
        '**Power BI** est l’outil de Microsoft qui transforme des données en **tableaux de bord interactifs**. On construit dans **Power BI Desktop** (application gratuite pour Windows), puis on **publie** vers le **service Power BI** (en ligne) pour partager avec son équipe.\n\nIl réunit trois briques : **Power Query** (préparer les données), le **modèle de données et le DAX** (calculer), et les **visuels** (montrer).',
      sections: [
        {
          title: 'Le parcours en 5 étapes',
          text: '1. **Obtenir** les données (Excel, CSV, base de données, ERP…).\n2. **Transformer** avec Power Query (nettoyer, fusionner).\n3. **Modéliser** : relier les tables et écrire les mesures DAX.\n4. **Visualiser** : construire les graphiques et les cartes.\n5. **Publier et partager** : service Power BI, actualisation planifiée.',
        },
        {
          title: 'Power BI ou Excel ?',
          text: '**Excel** : un classeur, des calculs cellule par cellule, parfait pour une analyse ponctuelle.\n**Power BI** : des millions de lignes, **plusieurs tables reliées**, des visuels **interactifs** (un clic filtre toute la page), une **actualisation automatique** et le **partage**.\n\nLes deux se complètent : un classeur Excel peut être une **source** de Power BI.',
        },
        {
          title: 'Les trois vues de Power BI Desktop',
          text: '**Vue Rapport** : on place les visuels sur la page.\n**Vue Données** : on consulte le contenu des tables.\n**Vue Modèle** : on voit les tables et on crée les **relations** entre elles.',
        },
        {
          title: 'Desktop et service',
          text: '**Power BI Desktop** sert à **créer**. Le **service Power BI** (en ligne) sert à **partager**, à programmer l’**actualisation** des données et à gérer les accès. Le partage avec d’autres personnes demande en général une licence adaptée (à vérifier selon l’entreprise).',
        },
      ],
      recall: [
        ['Desktop', 'Création du rapport (gratuit, Windows).'],
        ['Service', 'Partage en ligne et actualisation planifiée.'],
        ['Modèle', 'Tables + relations + mesures DAX.'],
        ['Visuel', 'Un graphique, une carte, un tableau, un segment…'],
      ],
    },
    exercises: [
      () =>
        choice({
          statement: 'Tu as importé tes données et nettoyé les tables dans Power Query (types, doublons, fusions).',
          question: 'Quelle est l’étape logique suivante dans Power BI ?',
          correct: 'Modéliser : relier les tables et créer les mesures DAX',
          wrongs: ['Publier tout de suite le rapport sur le service en ligne, avant même de créer des visuels', 'Retourner supprimer toutes les relations entre les tables pour repartir de zéro', 'Imprimer les tables nettoyées pour les vérifier à la main avant de continuer'],
          steps: ['Ordre habituel : obtenir → transformer → modéliser → visualiser → publier.', 'Les visuels s’appuient sur un modèle propre (relations et mesures).'],
          conclusion: 'On prépare, on modélise, puis on visualise.',
        }),
      () =>
        choice({
          statement: 'Dans Power BI, tes données arrivent avec des espaces en trop et des nombres en texte.',
          question: 'Où les nettoies-tu ?',
          correct: 'Dans Power Query (« Transformer les données »)',
          wrongs: ['Dans la vue Rapport, en réglant les visuels', 'Avec une mesure DAX uniquement', 'Dans le service Power BI après publication, à la main'],
          steps: ['Le nettoyage de données est le rôle de Power Query, intégré à Power BI.', 'Le DAX sert à calculer, les visuels à montrer.'],
          conclusion: 'Power Query = préparer ; DAX = calculer ; visuels = montrer.',
        }),
      () =>
        choice({
          statement: 'Ton rapport est prêt dans Power BI Desktop. Ton équipe doit pouvoir le consulter, et les données doivent s’actualiser chaque nuit.',
          question: 'Que fais-tu ?',
          correct: 'Je le publie sur le service Power BI et je programme l’actualisation',
          wrongs: ['J’envoie le fichier .pbix à chacun à chaque fois, et ils actualisent à la main', 'Je recopie les visuels dans un e-mail', 'J’imprime le rapport chaque matin'],
          steps: ['Desktop sert à créer ; le service en ligne sert à partager.', 'L’actualisation planifiée se configure sur le service.'],
          conclusion: 'Desktop pour créer, service pour partager et actualiser.',
        }),
      () => {
        const rows = int(2, 9)
        return choice({
          statement: `Tu dois analyser ${rows} millions de lignes de mouvements de stock, reliées à 5 tables (produits, entrepôts, dates…), avec des filtres interactifs pour un comité.`,
          question: 'Quel outil est le plus adapté ?',
          correct: 'Power BI : modèle de plusieurs tables, gros volumes, visuels interactifs',
          wrongs: ['Une grande feuille Excel avec des RECHERCHEV recopiés sur toutes les lignes et tous les onglets', 'Un document Word mis à jour à la main avant chaque comité, avec des tableaux collés', 'Une présentation PowerPoint avec des captures d’écran refaites à chaque nouvelle version des chiffres'],
          steps: ['Beaucoup de lignes et plusieurs tables reliées dépassent le confort d’une feuille Excel.', 'Power BI gère le modèle, l’interactivité et l’actualisation.'],
          conclusion: 'Excel pour l’analyse ponctuelle ; Power BI pour le pilotage récurrent à grande échelle.',
        })
      },
      () => {
        const cases = [
          { need: 'Créer et voir les relations entre les tables', ok: 'Vue Modèle' },
          { need: 'Placer des graphiques et des cartes sur la page', ok: 'Vue Rapport' },
          { need: 'Consulter le contenu des lignes d’une table', ok: 'Vue Données' },
        ]
        const c = pick(cases)
        return choice({
          statement: c.need + '.',
          question: 'Quelle vue de Power BI Desktop faut-il ouvrir ?',
          correct: c.ok,
          wrongs: ['Vue Rapport', 'Vue Données', 'Vue Modèle'].filter((x) => x !== c.ok).concat(['Vue Impression']),
          steps: ['Rapport = les visuels ; Données = le contenu des tables ; Modèle = les relations.', `Ici : ${c.ok}.`],
          conclusion: 'Trois vues, trois usages.',
        })
      },
    ],
  },

  // ───────────────────────── 2. Modèle de données ─────────────────────────
  {
    id: 'bi-modele',
    track: 'bi',
    title: 'Le modèle de données : faits, dimensions, relations',
    short: 'Le schéma en étoile',
    course: {
      purpose:
        'Le **modèle de données** décrit les **tables** et les **relations** entre elles. Un bon modèle suit le **schéma en étoile** : une **table de faits** au centre (les événements : livraisons, ventes, mouvements de stock — beaucoup de lignes, des chiffres), entourée de **tables de dimensions** (les axes d’analyse : fournisseurs, produits, entrepôts, dates — peu de lignes, des descriptions).',
      sections: [
        {
          title: 'Faits et dimensions',
          text: '**Table de faits** : une ligne = un événement mesurable. Ex. *Livraisons* (une ligne par livraison, avec quantité, retard, coût).\n**Table de dimensions** : une ligne = un élément qu’on décrit. Ex. *Fournisseurs* (une ligne par fournisseur, avec nom et pays), *Produits*, *Entrepôts*, *Calendrier*.\n\nOn **mesure** dans les faits, on **découpe** avec les dimensions.',
        },
        {
          title: 'Les relations',
          text: 'Une **relation** relie une colonne **clé** de la dimension (valeurs **uniques**) à la colonne correspondante de la table de faits (valeurs **répétées**). C’est une relation **un à plusieurs** (1 → *). Le filtre circule **de la dimension vers les faits** : filtrer un fournisseur filtre ses livraisons.',
        },
        {
          title: 'Pourquoi pas une seule grosse table ?',
          text: 'Une table unique répète partout le nom du fournisseur et son pays : lourde, source d’erreurs, difficile à corriger. Avec une dimension, on modifie une information **à un seul endroit**, et le modèle reste rapide.',
        },
        {
          title: 'La table Calendrier',
          text: 'Pour analyser **dans le temps** (mois, trimestre, même période l’an dernier), on ajoute une table **Calendrier** : une ligne par jour, sans trou, reliée à la date de la table de faits, et marquée comme **table de dates**.',
        },
        {
          title: 'Les pièges',
          text: '• Une clé en **doublon** dans la dimension rend la relation 1-* impossible : nettoie d’abord (Power Query).\n• Les relations **plusieurs-à-plusieurs** et le filtre **bidirectionnel** sont à utiliser avec précaution : ils donnent des résultats ambigus.\n• Les colonnes clés doivent avoir le **même type** des deux côtés.',
        },
      ],
      recall: [
        ['Fait', 'Événements chiffrés (livraisons, ventes) : beaucoup de lignes.'],
        ['Dimension', 'Axe d’analyse (fournisseur, produit, date) : peu de lignes, clé unique.'],
        ['1 → *', 'Un côté (dimension) vers plusieurs lignes de faits.'],
        ['Étoile', 'Faits au centre, dimensions autour.'],
      ],
    },
    exercises: [
      () => {
        const items = [
          { t: 'Livraisons', d: 'une ligne par livraison reçue (date, quantité, retard, coût)', ok: 'Table de faits' },
          { t: 'Mouvements de stock', d: 'une ligne par entrée ou sortie de stock (quantité, date)', ok: 'Table de faits' },
          { t: 'Fournisseurs', d: 'une ligne par fournisseur (nom, pays, délai standard)', ok: 'Table de dimension' },
          { t: 'Produits', d: 'une ligne par référence (désignation, famille, poids)', ok: 'Table de dimension' },
          { t: 'Entrepôts', d: 'une ligne par site (nom, région, surface)', ok: 'Table de dimension' },
          { t: 'Commandes clients', d: 'une ligne par ligne de commande (quantité, montant)', ok: 'Table de faits' },
        ]
        const it = pick(items)
        return choice({
          statement: `La table « ${it.t} » contient ${it.d}.`,
          question: 'Est-ce une table de faits ou une table de dimension ?',
          correct: it.ok,
          wrongs: [it.ok === 'Table de faits' ? 'Table de dimension' : 'Table de faits', 'Ni l’un ni l’autre : elle ne doit pas être dans le modèle'],
          steps: it.ok === 'Table de faits' ? ['Chaque ligne est un événement mesurable, avec des chiffres.', 'Ces tables ont beaucoup de lignes : ce sont les faits.'] : ['Chaque ligne décrit un élément (qui, où, quoi), avec peu de chiffres.', 'Ces tables servent d’axe de découpage : ce sont des dimensions.'],
          conclusion: 'Faits = ce qu’on mesure ; dimensions = comment on le découpe.',
        })
      },
      () => {
        const dim = pick([['Fournisseurs', 'Code fournisseur', 'Livraisons'], ['Produits', 'Référence', 'Mouvements de stock'], ['Entrepôts', 'Code site', 'Commandes']])
        return choice({
          statement: `Tu relies la table « ${dim[0]} » (une ligne par élément, « ${dim[1]} » unique) à la table « ${dim[2]} » (le même code répété sur de nombreuses lignes).`,
          question: 'Quelle est la cardinalité de la relation ?',
          correct: `Un à plusieurs (1 → *), le côté « un » étant la table « ${dim[0]} »`,
          wrongs: ['Un à un (1 → 1)', `Un à plusieurs, le côté « un » étant la table « ${dim[2]} »`, 'Plusieurs à plusieurs (* → *)'],
          steps: ['Dans la dimension, chaque clé apparaît une seule fois.', 'Dans la table de faits, la même clé apparaît sur plusieurs lignes.', `Relation 1 → * : « ${dim[0]} » est du côté « un ».`],
          conclusion: 'Dimension = côté « un » ; faits = côté « plusieurs ».',
        })
      },
      () => {
        const f = pick(SUPPLIERS)
        return choice({
          statement: `Ta page contient un segment « Fournisseur » et un visuel du nombre de livraisons. Les tables Fournisseurs (dimension) et Livraisons (faits) sont reliées par une relation 1 → *. Tu sélectionnes « ${f} » dans le segment.`,
          question: 'Que se passe-t-il pour le visuel ?',
          correct: `Il ne compte que les livraisons de ${f} : le filtre passe de la dimension vers les faits`,
          wrongs: ['Il compte toutes les livraisons de tous les fournisseurs : un segment ne filtre jamais les faits', `Il compte les fournisseurs filtrés, mais pas les livraisons de ${f} reliées par la relation`, 'Le filtre passe des faits vers la dimension et supprime définitivement des fournisseurs du modèle'],
          steps: ['Le segment filtre la table Fournisseurs sur une seule ligne.', 'La relation 1 → * propage le filtre vers les Livraisons correspondantes.', 'Le visuel recalcule sur ces seules livraisons.'],
          conclusion: 'Les filtres des dimensions descendent vers les faits.',
        })
      },
      () => {
        const nb = int(2, 6)
        const lignes = int(50, 400)
        return number({
          statement: `La table Fournisseurs compte ${nb} fournisseurs, la table Livraisons ${lignes} lignes (tous les fournisseurs ont livré). Tu construis un histogramme « Nombre de livraisons par fournisseur » (axe : Fournisseurs[Nom]).`,
          question: 'Combien de barres contient l’histogramme ?',
          answer: nb,
          unit: 'barres',
          steps: ['Une barre par valeur de l’axe, donc par fournisseur.', `Il y a ${nb} fournisseurs : ${nb} barres (peu importe les ${lignes} lignes de faits).`],
          conclusion: 'L’axe vient de la dimension ; la hauteur des barres vient de la mesure sur les faits.',
        })
      },
      () => {
        const ref = pick(['P12', 'P27', 'P08'])
        return choice({
          statement: `La table Produits contient deux fois la référence « ${ref} » (une erreur de saisie). Tu veux la relier à la table des ventes par cette référence.`,
          question: 'Quelle est la conséquence et la bonne démarche ?',
          correct: 'La relation un à plusieurs est impossible : on supprime d’abord le doublon (Power Query)',
          wrongs: ['Aucune conséquence, car Power BI choisit automatiquement une des deux lignes en doublon sans rien dire', 'Les ventes sont comptées deux fois dans les totaux, mais c’est un comportement normal du modèle', 'Il faut supprimer entièrement la table des ventes, puis la recharger depuis la source'],
          steps: ['Le côté « un » d’une relation 1 → * exige des valeurs uniques.', 'Un doublon crée de l’ambiguïté : quelle ligne produit retenir ?', 'On nettoie la dimension (Supprimer les doublons) avant de relier.'],
          conclusion: 'Clés uniques dans les dimensions : c’est un contrôle à faire avant de modéliser.',
        })
      },
      () =>
        choice({
          statement: 'On te demande de comparer les ventes du mois avec le même mois de l’an dernier.',
          question: 'De quoi as-tu besoin dans le modèle ?',
          correct: 'D’une table Calendrier (dates continues) reliée à la table de faits',
          wrongs: ['D’une simple colonne texte « Mois » recopiée dans chacune des tables du modèle de données', 'D’une deuxième copie complète de la table de faits, décalée d’une année pour comparer les deux', 'De rien de plus : le DAX devine les dates tout seul à partir des valeurs de la table de faits'],
          steps: ['Les calculs dans le temps (même période l’an dernier, cumul annuel) demandent une table de dates sans trou.', 'On la relie à la date de la table de faits et on la marque comme table de dates.'],
          conclusion: 'Calendrier = base de toutes les analyses dans le temps.',
        }),
      () =>
        choice({
          statement: 'Un collègue range tout dans une seule table géante : une ligne par livraison, avec le nom, l’adresse et le pays du fournisseur répétés à chaque ligne.',
          question: 'Quel est le principal avantage d’une dimension Fournisseurs séparée ?',
          correct: 'Les informations du fournisseur sont stockées une fois et modifiables à un seul endroit',
          wrongs: ['La table devient plus grosse, donc plus précise dans toutes les analyses, quel que soit le volume', 'On peut se passer complètement des relations, puisque tout est dans une seule table', 'Les mesures DAX deviennent inutiles, car toutes les valeurs sont déjà calculées dans les lignes'],
          steps: ['Une dimension évite la répétition des mêmes informations.', 'Moins de volume, moins d’erreurs, filtres plus simples.'],
          conclusion: 'Le schéma en étoile garde le modèle léger, clair et rapide.',
        }),
    ],
  },

  // ───────────────────────── 3. DAX : bases ─────────────────────────
  {
    id: 'bi-dax-bases',
    track: 'bi',
    title: 'DAX : mesures, colonnes calculées et fonctions de base',
    short: 'SUM, COUNTROWS, DIVIDE… et le contexte de filtre',
    course: {
      purpose:
        '**DAX** (*Data Analysis Expressions*) est le langage de formules de Power BI. Deux usages : la **colonne calculée** (valeur calculée **ligne par ligne**, stockée dans la table) et la **mesure** (calculée **à la volée** selon le **contexte de filtre** du visuel, jamais stockée).\n\nRègle d’or : un **total, un taux, un KPI** → une **mesure**. Une valeur propre à **chaque ligne** (marge d’une vente) → une **colonne calculée**.',
      sections: [
        {
          title: 'Écrire une mesure',
          text: 'Onglet *Modélisation* → **Nouvelle mesure**. La syntaxe est « Nom = formule ». Une colonne s’écrit **Table[Colonne]**, une mesure **[Mesure]**.',
          code: 'Total livré = SUM(Livraisons[QteLivrée])\nNb livraisons = COUNTROWS(Livraisons)\nFournisseurs actifs = DISTINCTCOUNT(Livraisons[Fournisseur])\nRetard moyen = AVERAGE(Livraisons[JoursRetard])',
        },
        {
          title: 'Les fonctions de base',
          text: '**SUM**, **AVERAGE**, **MIN**, **MAX** : agrègent une colonne.\n**COUNTROWS**(table) : nombre de lignes.\n**DISTINCTCOUNT**(colonne) : nombre de valeurs différentes.\n**DIVIDE**(numérateur, dénominateur, [valeur si 0]) : division sécurisée.',
        },
        {
          title: 'DIVIDE plutôt que « / »',
          text: 'Avec « / », une division par zéro produit une erreur ou un « infini ». **DIVIDE** renvoie **vide** (ou la valeur alternative que tu indiques) : le visuel reste propre.',
          code: 'Taux de service = DIVIDE([Total livré], [Total commandé])\nTaux de service (0 si vide) = DIVIDE([Total livré], [Total commandé], 0)',
        },
        {
          title: 'La colonne calculée',
          text: 'Une colonne calculée ajoute une colonne à la table, avec **une valeur par ligne**. **RELATED** ramène une valeur de la dimension liée.',
          code: 'Marge = Ventes[PrixVente] - Ventes[CoûtAchat]\nPays fournisseur = RELATED(Fournisseurs[Pays])',
        },
        {
          title: 'Le contexte de filtre',
          text: 'Une même mesure donne un résultat **différent selon l’endroit où elle est affichée** : la ligne « Lyon » d’une matrice ne calcule que les lignes de Lyon, une carte sans filtre calcule tout. Le **contexte de filtre** (filtres du visuel, segments, relations) est ce qui rend les mesures puissantes.',
        },
      ],
      recall: [
        ['Mesure', 'Calculée à la volée selon les filtres : totaux, taux, KPI.'],
        ['Colonne calculée', 'Une valeur par ligne, stockée dans la table.'],
        ['DIVIDE', 'Division sans erreur si le dénominateur vaut 0.'],
        ['Contexte de filtre', 'Les filtres actifs là où la mesure est affichée.'],
      ],
    },
    exercises: [
      () => {
        const items = [
          { n: 'le taux de service global d’un fournisseur', ok: 'Une mesure' },
          { n: 'le montant de chaque ligne de commande (quantité × prix)', ok: 'Une colonne calculée' },
          { n: 'l’OTIF affiché par mois', ok: 'Une mesure' },
          { n: 'le pays du fournisseur recopié sur chaque livraison', ok: 'Une colonne calculée' },
          { n: 'le coût de transport total par entrepôt', ok: 'Une mesure' },
          { n: 'un indicateur « en retard / à l’heure » pour chaque livraison', ok: 'Une colonne calculée' },
        ]
        const it = pick(items)
        return choice({
          statement: `Tu dois calculer ${it.n}.`,
          question: 'Faut-il créer une mesure ou une colonne calculée ?',
          correct: it.ok,
          wrongs: [it.ok === 'Une mesure' ? 'Une colonne calculée' : 'Une mesure', 'Une relation'],
          steps: it.ok === 'Une mesure' ? ['Le résultat dépend des filtres (par fournisseur, mois, entrepôt…).', 'Un indicateur agrégé qui change selon le contexte est une mesure.'] : ['Il faut une valeur pour chaque ligne de la table.', 'C’est le rôle d’une colonne calculée.'],
          conclusion: 'Agrégat dépendant des filtres → mesure ; valeur par ligne → colonne calculée.',
        })
      },
      () => {
        const col = pick([['Total livré', 'QteLivrée'], ['Total commandé', 'QteCommandée'], ['Coût total', 'CoûtTransport']])
        return choice({
          statement: `Tu veux créer la mesure « ${col[0]} » = somme de la colonne ${col[1]} de la table Livraisons.`,
          question: 'Quelle formule DAX est correcte ?',
          correct: `${col[0]} = SUM(Livraisons[${col[1]}])`,
          wrongs: [`${col[0]} = SUM[${col[1]}]`, `${col[0]} = SUM(${col[1]})`, `${col[0]} = TOTAL(Livraisons[${col[1]}])`],
          steps: ['SUM prend une colonne entre parenthèses.', 'Une colonne s’écrit Table[Colonne].', `Formule : ${col[0]} = SUM(Livraisons[${col[1]}]).`],
          conclusion: 'Retiens la forme : FONCTION(Table[Colonne]).',
        })
      },
      () => {
        const rows = deliveries(int(5, 6))
        const kind = pick(['sum', 'avg', 'max', 'rows'])
        const spec = {
          sum: { code: 'Total livré = SUM(Livraisons[QteLivrée])', val: rows.reduce((s, r) => s + r.qteLiv, 0), d: 0, unit: 'unités', how: `Somme des quantités livrées : ${rows.map((r) => r.qteLiv).join(' + ')}` },
          avg: { code: 'Retard moyen = AVERAGE(Livraisons[JoursRetard])', val: rows.reduce((s, r) => s + r.retard, 0) / rows.length, d: 1, unit: 'jours', how: `(${rows.map((r) => r.retard).join(' + ')}) / ${rows.length}` },
          max: { code: 'Plus grosse commande = MAX(Livraisons[QteCommandée])', val: Math.max(...rows.map((r) => r.qteCom)), d: 0, unit: 'unités', how: `Plus grande valeur de ${rows.map((r) => r.qteCom).join(', ')}` },
          rows: { code: 'Nb livraisons = COUNTROWS(Livraisons)', val: rows.length, d: 0, unit: 'livraisons', how: 'Nombre de lignes de la table' },
        }[kind]
        return number({
          statement: 'Voici la table Livraisons (sans aucun filtre actif) et une mesure DAX :',
          tables: [deliveriesTable(rows)],
          code: spec.code,
          question: 'Quelle valeur affiche une carte avec cette mesure (arrondie à 1 décimale si besoin) ?',
          answer: spec.val,
          unit: spec.unit,
          digits: spec.d,
          steps: [spec.how, `Résultat : ${fmt(spec.val, spec.d)}.`],
          conclusion: 'Sans filtre, la mesure s’applique à toute la table.',
        })
      },
      () =>
        choice({
          statement: 'Ta mesure divise le total livré par le total commandé. Pour un nouveau fournisseur sans commande, le total commandé vaut 0.',
          question: 'Pourquoi préférer DIVIDE([Total livré], [Total commandé]) à [Total livré] / [Total commandé] ?',
          correct: 'DIVIDE gère la division par zéro (résultat vide ou valeur alternative) sans afficher d’erreur',
          wrongs: ['DIVIDE arrondit systématiquement le résultat à l’entier le plus proche, ce que « / » ne fait pas', 'Le symbole « / » n’existe pas en DAX : toutes les divisions passent obligatoirement par DIVIDE', 'DIVIDE est plus lent à calculer, mais il est obligatoire pour toutes les mesures qui contiennent un ratio'],
          steps: ['Avec « / », 0 au dénominateur produit une erreur ou l’infini.', 'DIVIDE renvoie vide (BLANK) ou la valeur que tu précises en 3e argument.', 'Le visuel reste propre.'],
          conclusion: 'Pour tous les taux et ratios : DIVIDE.',
        }),
      () => {
        const rows = deliveries(int(4, 5))
        const liv = rows.reduce((s, r) => s + r.qteLiv, 0)
        const com = rows.reduce((s, r) => s + r.qteCom, 0)
        return number({
          statement: 'Tu écris la mesure ci-dessous sur la table Livraisons (aucun filtre actif).',
          tables: [deliveriesTable(rows)],
          code: 'Taux de service = DIVIDE(SUM(Livraisons[QteLivrée]), SUM(Livraisons[QteCommandée]))',
          question: 'Quel taux de service en % (arrondi à 1 décimale) la carte affiche-t-elle ?',
          answer: (liv / com) * 100,
          unit: '%',
          digits: 1,
          steps: [`Quantités livrées : ${liv}`, `Quantités commandées : ${com}`, `${liv} / ${com} = ${fmt(liv / com, 4)} soit ${fmt((liv / com) * 100, 1)} %`],
          conclusion: 'Le taux de service se calcule sur les quantités (somme / somme), pas en moyennant des pourcentages.',
        })
      },
      () => {
        const rows = deliveries(int(6, 8), { suppliers: sample(SUPPLIERS, int(2, 4)) })
        const n = new Set(rows.map((r) => r.fournisseur)).size
        return number({
          statement: 'Voici la table Livraisons. On veut savoir combien de fournisseurs DIFFÉRENTS ont livré.',
          tables: [deliveriesTable(rows)],
          code: 'Fournisseurs actifs = DISTINCTCOUNT(Livraisons[Fournisseur])',
          question: 'Que renvoie cette mesure (sans filtre) ?',
          answer: n,
          unit: 'fournisseurs',
          steps: [`Lignes : ${rows.length} (COUNTROWS renverrait ${rows.length}).`, `Fournisseurs différents : ${[...new Set(rows.map((r) => r.fournisseur))].join(', ')} = ${n}.`],
          conclusion: 'DISTINCTCOUNT compte les valeurs différentes, COUNTROWS compte les lignes.',
        })
      },
      () => {
        const whs = sample(WAREHOUSES, 3)
        const rows = deliveries(int(7, 9), { warehouses: whs })
        const target = rows[0].entrepot
        const v = rows.filter((r) => r.entrepot === target).reduce((s, r) => s + r.qteLiv, 0)
        return number({
          statement: `Tu affiches la mesure « Total livré = SUM(Livraisons[QteLivrée]) » dans une matrice avec les entrepôts en lignes.`,
          tables: [deliveriesTable(rows)],
          question: `Quelle valeur apparaît sur la ligne « ${target} » ?`,
          answer: v,
          unit: 'unités',
          steps: [`Le contexte de filtre de cette ligne est : Entrepôt = ${target}.`, `On additionne la quantité livrée des lignes de ${target} seulement : ${rows.filter((r) => r.entrepot === target).map((r) => r.qteLiv).join(' + ')}.`, `Total : ${v}.`],
          conclusion: 'La mesure est la même, mais son résultat dépend du contexte de filtre de chaque ligne.',
        })
      },
    ],
  },

  // ───────────────────────── 4. DAX : CALCULATE ─────────────────────────
  {
    id: 'bi-dax-calculate',
    track: 'bi',
    title: 'DAX : CALCULATE et les filtres',
    short: 'Modifier le contexte de filtre : « combien… quand… ? »',
    course: {
      purpose:
        '**CALCULATE** est la fonction la plus importante du DAX : elle **calcule une mesure en modifiant le contexte de filtre**. Forme : **CALCULATE( mesure ; filtre1 ; filtre2… )**. Elle répond aux questions « combien… *quand*… ? » : combien de livraisons *en retard* ? combien livré *à Lyon* ?',
      sections: [
        {
          title: 'Un filtre simple',
          text: 'On ajoute une condition sur une colonne. Plusieurs filtres sont combinés par un **ET**.',
          code: 'Retards = CALCULATE(COUNTROWS(Livraisons), Livraisons[JoursRetard] > 0)\nLivré à Lyon = CALCULATE([Total livré], Livraisons[Entrepôt] = "Lyon")',
        },
        {
          title: 'Plusieurs colonnes : FILTER',
          text: 'Une condition qui compare deux colonnes de la même ligne (livré ≥ commandé) s’écrit avec **FILTER**, qui parcourt la table ligne par ligne. C’est la base de l’**OTIF**.',
          code: 'Livraisons OTIF =\nCOUNTROWS(\n    FILTER(\n        Livraisons,\n        Livraisons[JoursRetard] <= 0 && Livraisons[QteLivrée] >= Livraisons[QteCommandée]\n    )\n)',
        },
        {
          title: 'ALL : retirer des filtres',
          text: '**ALL**(table) supprime les filtres sur la table : indispensable pour calculer une **part du total** (un % de l’ensemble).',
          code: 'Part du total = DIVIDE([Total livré], CALCULATE([Total livré], ALL(Livraisons)))',
        },
        {
          title: 'Comparer à l’an dernier',
          text: 'Avec une table **Calendrier** correctement reliée et marquée comme table de dates, on décale la période.',
          code: 'Livré N-1 = CALCULATE([Total livré], SAMEPERIODLASTYEAR(Calendrier[Date]))',
        },
        {
          title: 'Erreurs courantes',
          text: '• Une colonne s’écrit toujours avec sa table : **Livraisons[Entrepôt]**.\n• Le texte est entre **guillemets doubles** ; l’égalité s’écrit avec un seul **=**.\n• Les noms de fonctions restent en anglais.\n• Le **séparateur d’arguments** (virgule ou point-virgule) peut dépendre de la langue et des paramètres régionaux de ton poste.',
        },
      ],
      recall: [
        ['CALCULATE', 'Mesure + filtres : change le contexte de filtre.'],
        ['FILTER', 'Parcourt la table ligne par ligne (conditions entre colonnes).'],
        ['ALL', 'Enlève les filtres (pour un % du total).'],
        ['SAMEPERIODLASTYEAR', 'Même période l’an dernier (table Calendrier requise).'],
      ],
    },
    exercises: [
      () => {
        const whs = sample(WAREHOUSES, 3)
        const rows = deliveries(int(7, 9), { warehouses: whs })
        const t = rows[0].entrepot
        const sel = rows.filter((r) => r.entrepot === t)
        return number({
          statement: 'Voici la table Livraisons et une mesure DAX (aucun autre filtre actif).',
          tables: [deliveriesTable(rows)],
          code: `Livré ${t} = CALCULATE(SUM(Livraisons[QteLivrée]), Livraisons[Entrepôt] = "${t}")`,
          question: 'Quelle valeur renvoie cette mesure ?',
          answer: sel.reduce((s, r) => s + r.qteLiv, 0),
          unit: 'unités',
          steps: [`CALCULATE ajoute le filtre Entrepôt = ${t}.`, `Lignes concernées : ${sel.map((r) => r.id).join(', ')}.`, `Somme de QteLivrée : ${sel.map((r) => r.qteLiv).join(' + ')} = ${sel.reduce((s, r) => s + r.qteLiv, 0)}.`],
          conclusion: 'CALCULATE restreint le calcul aux lignes qui respectent le filtre.',
        })
      },
      () => {
        const rows = deliveries(int(7, 9))
        const late = rows.filter((r) => r.retard > 0)
        return number({
          statement: 'Voici la table Livraisons et une mesure DAX.',
          tables: [deliveriesTable(rows)],
          code: 'Retards = CALCULATE(COUNTROWS(Livraisons), Livraisons[JoursRetard] > 0)',
          question: 'Combien de livraisons en retard compte la mesure ?',
          answer: late.length,
          unit: 'livraisons',
          steps: [`Filtre : JoursRetard > 0.`, `Lignes en retard : ${late.length ? late.map((r) => r.id).join(', ') : 'aucune'}.`, `COUNTROWS compte ces lignes : ${late.length}.`],
          conclusion: 'CALCULATE(COUNTROWS(…), condition) = nombre de lignes qui respectent la condition.',
        })
      },
      () => {
        const rows = deliveries(int(8, 10))
        const ok = rows.filter(kpi.isOtif)
        return number({
          statement: 'Voici la table Livraisons et une mesure DAX qui compte les livraisons « à l’heure ET complètes ».',
          tables: [deliveriesTable(rows)],
          code: 'Livraisons OTIF =\nCOUNTROWS(\n    FILTER(\n        Livraisons,\n        Livraisons[JoursRetard] <= 0 && Livraisons[QteLivrée] >= Livraisons[QteCommandée]\n    )\n)',
          question: 'Que renvoie cette mesure ?',
          answer: ok.length,
          unit: 'livraisons',
          steps: ['FILTER garde les lignes qui respectent LES DEUX conditions (&& = ET) : retard ≤ 0 et quantité livrée ≥ commandée.', `Lignes retenues : ${ok.length ? ok.map((r) => r.id).join(', ') : 'aucune'}.`, `COUNTROWS : ${ok.length}.`],
          conclusion: 'Pour comparer deux colonnes d’une même ligne, on passe par FILTER.',
        })
      },
      () => {
        const whs = sample(WAREHOUSES, 3)
        const rows = deliveries(int(8, 10), { warehouses: whs })
        const t = rows[0].entrepot
        const total = rows.reduce((s, r) => s + r.qteLiv, 0)
        const part = rows.filter((r) => r.entrepot === t).reduce((s, r) => s + r.qteLiv, 0)
        return number({
          statement: `Tu affiches la mesure ci-dessous dans une matrice avec les entrepôts en lignes. Regarde la ligne « ${t} ».`,
          tables: [deliveriesTable(rows)],
          code: 'Part du total = DIVIDE([Total livré], CALCULATE([Total livré], ALL(Livraisons)))',
          question: `Quel pourcentage (arrondi à 1 décimale) apparaît sur la ligne « ${t} » ?`,
          answer: (part / total) * 100,
          unit: '%',
          digits: 1,
          steps: [`Numérateur (contexte ${t}) : ${part}.`, `Dénominateur : ALL(Livraisons) supprime les filtres, donc total = ${total}.`, `${part} / ${total} = ${fmt((part / total) * 100, 1)} %.`],
          conclusion: 'ALL permet de comparer une partie au total : c’est la base des « parts de ».',
        })
      },
      () => {
        const f = pick(SUPPLIERS)
        return choice({
          statement: `Tu veux la mesure « nombre de livraisons en retard du fournisseur ${f} ».`,
          question: 'Quelle formule DAX est correcte ?',
          correct: `CALCULATE(COUNTROWS(Livraisons), Livraisons[Fournisseur] = "${f}", Livraisons[JoursRetard] > 0)`,
          wrongs: [`COUNTROWS(Livraisons) WHERE Livraisons[Fournisseur] = "${f}" AND Livraisons[JoursRetard] > 0`, `CALCULATE(COUNTROWS(Livraisons), Fournisseur = "${f}", JoursRetard > 0)`, `SUMX(Livraisons, Livraisons[Fournisseur] = "${f}" && Livraisons[JoursRetard] > 0, Livraisons[QteLivrée], Livraisons[QteCommandée])`],
          steps: ['CALCULATE( mesure ; filtre1 ; filtre2 ) : les filtres sont combinés par un ET.', 'Chaque colonne est qualifiée par sa table : Livraisons[Fournisseur].', 'WHERE n’existe pas en DAX ; SUM ne s’applique pas à une condition.'],
          conclusion: 'Forme à retenir : CALCULATE( mesure ; Table[Colonne] opérateur valeur ).',
        })
      },
      () =>
        choice({
          statement: 'Dans le modèle, tu as une table Calendrier reliée à la date des livraisons et marquée comme table de dates.',
          question: 'Que permet une mesure CALCULATE([Total livré], SAMEPERIODLASTYEAR(Calendrier[Date])) ?',
          correct: 'Afficher le total livré sur la même période l’année précédente, pour comparer',
          wrongs: ['Additionner toutes les années de la table Calendrier pour obtenir un cumul global', 'Supprimer tous les filtres de date pour afficher les totaux sur l’ensemble des périodes', 'Compter le nombre de jours du mois en cours pour calculer une moyenne journalière'],
          steps: ['SAMEPERIODLASTYEAR décale le filtre de date d’un an en arrière.', 'CALCULATE recalcule la mesure sur cette période décalée.', 'Elle ne fonctionne que si la table Calendrier est continue et correctement reliée.'],
          conclusion: 'Sans table Calendrier propre, les calculs dans le temps ne fonctionnent pas.',
        }),
      () =>
        choice({
          statement: 'Un collègue te demande à quoi sert CALCULATE.',
          question: 'Quelle est la réponse la plus juste ?',
          correct: 'Elle évalue une mesure après avoir modifié le contexte de filtre',
          wrongs: ['Elle calcule uniquement des sommes sur une colonne, sans jamais tenir compte des filtres', 'Elle crée une colonne calculée dans la table, avec une valeur stockée pour chaque ligne', 'Elle importe des données depuis une source externe vers le modèle à chaque actualisation'],
          steps: ['Le contexte de filtre dit quelles lignes sont prises en compte.', 'CALCULATE change ce contexte, puis évalue la mesure.', 'C’est ce qui permet « combien… quand… ? ».'],
          conclusion: 'CALCULATE = la fonction qui change les règles du jeu du filtre.',
        }),
    ],
  },

  // ───────────────────────── 5. Visuels ─────────────────────────
  {
    id: 'bi-visuels',
    track: 'bi',
    title: 'Les visuels et le tableau de bord',
    short: 'Choisir le bon graphique pour répondre à une question',
    course: {
      purpose:
        'Un visuel doit **répondre à une question**. Le bon type de graphique permet de comprendre en **5 secondes**. Un bon tableau de bord tient sur **une page**, répond à **une question métier**, contient **3 à 6 visuels** : les chiffres clés en haut, les détails en dessous, les filtres sur le côté.',
      sections: [
        {
          title: 'Le bon visuel pour la bonne question',
          text: '**Carte** : un chiffre clé (OTIF : 94 %).\n**Histogramme / barres** : comparer des catégories (retard moyen par fournisseur).\n**Courbe** : une évolution dans le temps (taux de service par mois).\n**Secteurs / anneau** : les parts d’un tout, avec **peu de parts** (5 maximum).\n**Tableau / matrice** : le détail chiffré, les croisements.\n**Segment** : un filtre cliquable (entrepôt, période).\n**Jauge** : une valeur face à un objectif.',
        },
        {
          title: 'Construire un visuel',
          text: 'On glisse des champs dans les zones du visuel : **Axe** (la dimension : fournisseur, mois), **Valeurs** (la mesure : retard moyen), **Légende** (une 2e dimension, avec parcimonie). Puis on met en forme : titre explicite, unité, couleurs sobres.',
        },
        {
          title: 'Les interactions',
          text: 'Cliquer sur un élément d’un visuel **filtre ou met en surbrillance** les autres visuels de la page (filtre croisé). Les **segments** filtrent toute la page. Les **hiérarchies** (année → trimestre → mois) permettent d’explorer en détail (*drill-down*).',
        },
        {
          title: 'Les bonnes pratiques',
          text: '• **Un message par visuel**, avec un titre qui dit lequel (« Retard moyen par fournisseur, en jours »).\n• Les **KPI en haut**, les détails en bas.\n• **Peu de couleurs** ; ne pas signaler une alerte par la seule couleur (ajouter une icône ou un libellé).\n• Éviter les secteurs à nombreuses parts : préférer un histogramme **trié**.\n• Toujours indiquer l’**unité** et la **période**.',
        },
      ],
      recall: [
        ['Carte', 'Un chiffre clé.'],
        ['Histogramme', 'Comparer des catégories.'],
        ['Courbe', 'Évolution dans le temps.'],
        ['Segment', 'Filtre interactif pour toute la page.'],
      ],
    },
    exercises: [
      () => {
        const needs = [
          { n: 'afficher l’OTIF global du mois en un chiffre bien visible', ok: 'Carte' },
          { n: 'suivre l’évolution du taux de service mois par mois', ok: 'Courbe' },
          { n: 'comparer le retard moyen de chaque fournisseur', ok: 'Histogramme (barres)' },
          { n: 'laisser l’utilisateur filtrer toute la page par entrepôt', ok: 'Segment' },
          { n: 'montrer la part de chaque transporteur (3 transporteurs) dans le coût total', ok: 'Anneau / secteurs' },
          { n: 'consulter le détail chiffré des livraisons par fournisseur et par mois', ok: 'Tableau ou matrice' },
        ]
        const n = pick(needs)
        const all = ['Carte', 'Courbe', 'Histogramme (barres)', 'Segment', 'Anneau / secteurs', 'Tableau ou matrice']
        return choice({
          statement: `Tu veux ${n.n}.`,
          question: 'Quel visuel est le plus adapté ?',
          correct: n.ok,
          wrongs: sample(all.filter((x) => x !== n.ok), 3),
          steps: [`Besoin : ${n.n}.`, `Le visuel le plus lisible pour cela est : ${n.ok}.`],
          conclusion: 'Choisis le visuel d’après la question à laquelle il répond.',
        })
      },
      () =>
        choice({
          statement: 'Ton tableau de bord comporte quatre graphiques. Le comité veut pouvoir regarder tout d’un coup « uniquement l’entrepôt de Lyon », puis « uniquement Lille ».',
          question: 'Quel élément ajouter ?',
          correct: 'Un segment (filtre) sur le champ Entrepôt',
          wrongs: ['Un cinquième histogramme avec une barre par entrepôt, à placer sous les autres visuels', 'Une carte qui affiche le nom de l’entrepôt, à modifier à la main avant chaque réunion', 'Une jauge distincte par entrepôt, ajoutée à côté des quatre graphiques déjà présents'],
          steps: ['Un segment est un filtre cliquable qui s’applique à tous les visuels de la page.', 'On le branche sur la colonne Entrepôt de la dimension Entrepôts.'],
          conclusion: 'Segment = filtre interactif pour toute la page.',
        }),
      () => {
        const n = int(10, 15)
        return choice({
          statement: `Un collègue propose un graphique en secteurs avec ${n} fournisseurs pour comparer leurs retards.`,
          question: 'Que lui conseilles-tu ?',
          correct: 'Un histogramme trié : les secteurs deviennent illisibles avec autant de parts',
          wrongs: ['Garder les secteurs et ajouter une couleur différente à chaque fournisseur pour les distinguer', 'Passer le graphique en 3D pour mieux voir les parts et leurs écarts relatifs', 'Supprimer tous les libellés pour alléger le graphique et ne garder que les couleurs'],
          steps: [`${n} parts de tailles proches sont impossibles à comparer à l’œil.`, 'Des barres alignées et triées se comparent immédiatement.', 'Les secteurs sont réservés à quelques parts d’un tout.'],
          conclusion: 'Comparer = barres. Parts d’un tout (peu de catégories) = secteurs.',
        })
      },
      () =>
        choice({
          statement: 'Quatre propositions de page pour un comité logistique du lundi :',
          question: 'Laquelle est la mieux construite ?',
          correct: 'Cartes KPI en haut, évolution au milieu, détail en bas, segment d’entrepôt sur le côté',
          wrongs: ['Vingt visuels de formes différentes placés sans ordre sur la page, sans titres ni légendes', 'Un seul gros tableau de 500 lignes sans aucun filtre, à faire défiler pendant la réunion', 'Des graphiques en 3D très colorés, sans unités, avec un dégradé de couleurs différent par visuel'],
          steps: ['Un bon tableau de bord guide la lecture : chiffres clés, tendance, détail.', 'Chaque visuel a un titre et une unité ; les filtres sont accessibles.'],
          conclusion: 'Une page, une question, peu de visuels, lisibles.',
        }),
      () => {
        const f = pick(SUPPLIERS)
        return choice({
          statement: `Sur ta page, un histogramme « Retard moyen par fournisseur » et une courbe « Taux de service par mois ». Tu cliques sur la barre du fournisseur ${f}.`,
          question: 'Que se passe-t-il par défaut ?',
          correct: `Les autres visuels se filtrent ou se mettent en surbrillance sur ${f}`,
          wrongs: ['Rien ne se passe : un clic sur un visuel ne change jamais les autres visuels de la page', 'Le fichier source est modifié pour ne plus garder que les données de ce fournisseur', `Le fournisseur ${f} est supprimé définitivement du modèle de données du rapport`],
          steps: ['Les visuels d’une page sont reliés par le modèle de données.', 'Cliquer sur un élément applique un filtre croisé (ou une mise en surbrillance) sur les autres visuels.'],
          conclusion: 'L’interactivité est ce qui distingue un tableau de bord d’une image de graphique.',
        })
      },
      () => {
        const cases = [
          { q: 'Quel entrepôt a le moins bon taux de service ?', ok: 'Histogramme · Axe : Entrepôt · Valeur : Taux de service', w: ['Carte · Valeur : Nombre de livraisons', 'Courbe · Axe : Fournisseur · Valeur : Coût total', 'Segment · Valeur : Taux de service'] },
          { q: 'Comment évolue l’OTIF au fil des mois ?', ok: 'Courbe · Axe : Mois · Valeur : OTIF', w: ['Histogramme · Axe : Fournisseur · Valeur : Coût total', 'Carte · Valeur : Nombre de livraisons', 'Anneau · Axe : Mois · Valeur : Retard moyen'] },
          { q: 'Combien coûte le transport au total ce trimestre ?', ok: 'Carte · Valeur : Coût de transport', w: ['Courbe · Axe : Fournisseur · Valeur : OTIF', 'Segment · Valeur : Coût de transport', 'Histogramme · Axe : Mois · Valeur : Taux de service'] },
        ]
        const c = pick(cases)
        return choice({
          statement: `Question métier : « ${c.q} »`,
          question: 'Quelle configuration de visuel y répond le mieux ?',
          correct: c.ok,
          wrongs: c.w,
          steps: ['Identifie la mesure demandée, puis l’axe (la dimension) éventuel.', 'Choisis le visuel : un chiffre = carte ; comparaison = barres ; évolution = courbe.', `Configuration retenue : ${c.ok}.`],
          conclusion: 'Question → mesure → axe → visuel.',
        })
      },
    ],
  },

  // ───────────────────────── 6. KPI supply chain ─────────────────────────
  {
    id: 'bi-kpi',
    track: 'bi',
    title: 'KPI supply chain : OTIF, service, rotation, coûts, retards',
    short: 'Calculer et exprimer en DAX les indicateurs de l’entretien',
    course: {
      purpose:
        'Cinq indicateurs reviennent sans cesse en logistique : **OTIF**, **taux de service**, **rotation des stocks**, **coûts de transport** et **retards fournisseurs**. Pour chacun : savoir **le définir**, **le calculer** et **l’écrire en mesure DAX**.',
      sections: [
        {
          title: 'OTIF (On Time In Full)',
          text: 'Part des livraisons **à l’heure ET complètes**. = livraisons à l’heure et complètes / nombre total de livraisons. Une livraison compte comme réussie seulement si les deux conditions sont remplies.',
          code: 'OTIF =\nDIVIDE(\n    COUNTROWS(FILTER(Livraisons, Livraisons[JoursRetard] <= 0 && Livraisons[QteLivrée] >= Livraisons[QteCommandée])),\n    COUNTROWS(Livraisons)\n)',
        },
        {
          title: 'Taux de service',
          text: 'Quantités livrées / quantités commandées (une autre définition compte les lignes de commande complètes : précise toujours laquelle tu utilises).',
          code: 'Taux de service = DIVIDE(SUM(Livraisons[QteLivrée]), SUM(Livraisons[QteCommandée]))',
        },
        {
          title: 'Rotation des stocks',
          text: '**Rotation** = coût des ventes (ou consommations) / **stock moyen** : combien de fois le stock se renouvelle sur la période. **Couverture** (en jours) = nombre de jours de la période / rotation.',
          code: 'Rotation = DIVIDE(SUM(Stocks[CoûtDesVentes]), AVERAGE(Stocks[Stock]))',
        },
        {
          title: 'Coûts de transport',
          text: 'Total, **par unité livrée** (coût / quantités livrées), par tonne, par kilomètre, ou en **% du chiffre d’affaires**. Le coût par unité permet de comparer des volumes différents.',
          code: 'Coût par unité = DIVIDE(SUM(Livraisons[CoûtTransport]), SUM(Livraisons[QteLivrée]))',
        },
        {
          title: 'Retards fournisseurs',
          text: '**Retard moyen** (jours, 0 pour une livraison à l’heure) et **% de livraisons en retard**. À croiser avec le fournisseur pour repérer qui tire l’indicateur vers le bas.',
          code: 'Retard moyen = AVERAGE(Livraisons[JoursRetard])\n% en retard = DIVIDE(CALCULATE(COUNTROWS(Livraisons), Livraisons[JoursRetard] > 0), COUNTROWS(Livraisons))',
        },
        {
          title: 'Le piège de la moyenne des pourcentages',
          text: 'Pour un taux global, on **recalcule sur les lignes** (somme / somme) : on ne fait **jamais la moyenne de pourcentages mensuels** si les volumes sont différents. C’est une raison de plus d’écrire des **mesures** plutôt que d’agréger des colonnes déjà en %.',
        },
      ],
      recall: [
        ['OTIF', 'À l’heure ET complètes / total des livraisons.'],
        ['Taux de service', 'Quantité livrée / quantité commandée.'],
        ['Rotation', 'Coût des ventes / stock moyen.'],
        ['Couverture', 'Jours de la période / rotation.'],
      ],
    },
    exercises: [
      () => {
        const rows = deliveries(int(8, 10))
        const ok = rows.filter(kpi.isOtif).length
        return number({
          statement: 'Livraisons de la semaine (OTIF = à l’heure, c’est-à-dire retard 0, ET complète, c’est-à-dire quantité livrée ≥ commandée).',
          tables: [deliveriesTable(rows)],
          question: 'Quel est l’OTIF en % (arrondi à 1 décimale) ?',
          answer: (ok / rows.length) * 100,
          unit: '%',
          digits: 1,
          steps: [`Livraisons réussies (retard 0 ET complète) : ${ok} (${rows.filter(kpi.isOtif).map((r) => r.id).join(', ') || 'aucune'}).`, `Total des livraisons : ${rows.length}.`, `${ok} / ${rows.length} = ${pct(ok / rows.length)}.`],
          conclusion: 'Une livraison en retard OU incomplète fait baisser l’OTIF.',
        })
      },
      () => {
        const rows = deliveries(int(6, 8))
        const v = kpi.tauxService(rows)
        return number({
          statement: 'Livraisons de la période.',
          tables: [deliveriesTable(rows)],
          question: 'Quel est le taux de service (quantités livrées / quantités commandées) en %, arrondi à 1 décimale ?',
          answer: v * 100,
          unit: '%',
          digits: 1,
          steps: [`Quantités livrées : ${rows.reduce((s, r) => s + r.qteLiv, 0)}.`, `Quantités commandées : ${rows.reduce((s, r) => s + r.qteCom, 0)}.`, `Taux de service = ${pct(v)}.`],
          conclusion: 'Le taux de service mesure la part des quantités demandées qui a bien été livrée.',
        })
      },
      () => {
        const ventes = int(6, 18, 2) * 10000
        const stocks = Array.from({ length: 6 }, () => int(20, 60, 5) * 1000)
        const avg = stocks.reduce((s, x) => s + x, 0) / stocks.length
        const rot = ventes / avg
        const cov = Math.random() < 0.5
        return number({
          statement: `Sur 6 mois (180 jours), le coût des ventes est de ${fmt(ventes)} €. Stock fin de mois (en €) : ${stocks.map((s) => fmt(s)).join(' ; ')}. Rotation = coût des ventes / stock moyen${cov ? ' ; couverture = 180 jours / rotation' : ''}.`,
          question: cov ? 'Quelle est la couverture du stock, en jours (arrondie à 1 décimale) ?' : 'Quelle est la rotation sur la période (arrondie à 2 décimales) ?',
          answer: cov ? 180 / rot : rot,
          unit: cov ? 'jours' : 'tours',
          digits: cov ? 1 : 2,
          steps: [`Stock moyen = ${fmt(avg, 0)} €.`, `Rotation = ${fmt(ventes)} / ${fmt(avg, 0)} = ${fmt(rot, 2)}.`, ...(cov ? [`Couverture = 180 / ${fmt(rot, 2)} = ${fmt(180 / rot, 1)} jours.`] : [])],
          conclusion: cov ? 'Plus la rotation est élevée, plus la couverture (en jours) est faible.' : 'La rotation dit combien de fois le stock s’est renouvelé sur la période.',
        })
      },
      () => {
        const rows = deliveries(int(5, 7))
        const v = kpi.coutParUnite(rows)
        return number({
          statement: 'Coûts de transport des livraisons (colonne « Coût » en €).',
          tables: [{ title: 'Livraisons', cols: ['N°', 'Qté livrée', 'Coût (€)'], rows: rows.map((r) => [r.id, String(r.qteLiv), String(r.cout)]) }],
          question: 'Quel est le coût de transport par unité livrée (en €, arrondi à 2 décimales) ?',
          answer: v,
          unit: '€',
          digits: 2,
          steps: [`Coût total : ${rows.map((r) => r.cout).join(' + ')} = ${kpi.coutTransport(rows)} €.`, `Quantité livrée totale : ${rows.reduce((s, r) => s + r.qteLiv, 0)}.`, `${kpi.coutTransport(rows)} / ${rows.reduce((s, r) => s + r.qteLiv, 0)} = ${fmt(v, 2)} € par unité.`],
          conclusion: 'Le coût par unité permet de comparer des transporteurs ou des périodes de volumes différents.',
        })
      },
      () => {
        const sups = sample(SUPPLIERS, 2)
        const rows = deliveries(int(8, 10), { suppliers: sups })
        const t = rows[0].fournisseur
        const sel = rows.filter((r) => r.fournisseur === t)
        const v = sel.reduce((s, r) => s + r.retard, 0) / sel.length
        return number({
          statement: `Mesure : Retard moyen = AVERAGE(Livraisons[JoursRetard]). Un segment est positionné sur le fournisseur « ${t} ».`,
          tables: [deliveriesTable(rows)],
          question: 'Quelle valeur affiche la mesure (en jours, arrondie à 1 décimale) ?',
          answer: v,
          unit: 'jours',
          digits: 1,
          steps: [`Lignes de ${t} : ${sel.map((r) => r.id).join(', ')}.`, `Retards : ${sel.map((r) => r.retard).join(' + ')} = ${sel.reduce((s, r) => s + r.retard, 0)} jours.`, `Moyenne : ${sel.reduce((s, r) => s + r.retard, 0)} / ${sel.length} = ${fmt(v, 1)} jours.`],
          conclusion: 'Le segment modifie le contexte de filtre : la mesure ne voit que ce fournisseur.',
        })
      },
      () => {
        const a = { lines: int(50, 150), rate: int(80, 98) }
        const b = { lines: int(200, 400), rate: int(60, 80) }
        const good = (a.lines * a.rate + b.lines * b.rate) / (a.lines + b.lines)
        return number({
          statement: 'Taux de service mensuel de deux mois :',
          tables: [tbl(['Mois', 'Lignes de commande', 'Taux de service (%)'], [['Janvier', a.lines, a.rate], ['Février', b.lines, b.rate]])],
          question: 'Quel est le taux de service global sur les deux mois, en % (arrondi à 1 décimale) ?',
          answer: good,
          unit: '%',
          digits: 1,
          steps: [`Lignes servies en janvier : ${a.lines} × ${a.rate} % = ${fmt((a.lines * a.rate) / 100, 1)}.`, `Lignes servies en février : ${b.lines} × ${b.rate} % = ${fmt((b.lines * b.rate) / 100, 1)}.`, `Total servi / total commandé = ${fmt((a.lines * a.rate + b.lines * b.rate) / 100, 1)} / ${a.lines + b.lines} = ${fmt(good, 1)} %.`, `(La moyenne simple des deux taux, ${fmt((a.rate + b.rate) / 2, 1)} %, serait fausse : les volumes sont différents.)`],
          conclusion: 'Un taux global se recalcule sur les volumes, jamais en moyennant des pourcentages.',
        })
      },
      () => {
        const items = [
          { k: 'le taux de service', ok: 'DIVIDE(SUM(Livraisons[QteLivrée]), SUM(Livraisons[QteCommandée]))', w: ['AVERAGE(Livraisons[QteLivrée]) / AVERAGE(Livraisons[QteCommandée]) * 100', 'SUM(Livraisons[QteLivrée]) - SUM(Livraisons[QteCommandée])', 'COUNTROWS(Livraisons) / SUM(Livraisons[QteCommandée])'] },
          { k: 'le retard moyen', ok: 'AVERAGE(Livraisons[JoursRetard])', w: ['SUM(Livraisons[JoursRetard])', 'COUNTROWS(Livraisons[JoursRetard])', 'MAX(Livraisons[JoursRetard])'] },
          { k: 'le coût de transport par unité livrée', ok: 'DIVIDE(SUM(Livraisons[CoûtTransport]), SUM(Livraisons[QteLivrée]))', w: ['SUM(Livraisons[CoûtTransport]) * SUM(Livraisons[QteLivrée])', 'AVERAGE(Livraisons[CoûtTransport])', 'DIVIDE(COUNTROWS(Livraisons), SUM(Livraisons[CoûtTransport]))'] },
        ]
        const it = pick(items)
        return choice({
          statement: `Tu dois écrire la mesure DAX qui calcule ${it.k}.`,
          question: 'Quelle expression est correcte ?',
          correct: it.ok,
          wrongs: it.w,
          steps: ['Identifie le numérateur et le dénominateur (ou l’agrégat) de l’indicateur.', 'Utilise DIVIDE pour les ratios, SUM/AVERAGE pour les agrégats.', `Expression correcte : ${it.ok}.`],
          conclusion: 'Définition d’abord, formule DAX ensuite.',
        })
      },
    ],
  },
]
