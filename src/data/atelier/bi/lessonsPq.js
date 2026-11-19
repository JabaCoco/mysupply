// Leçons Power Query : mini-cours + exercices à données aléatoires (nouvelles données à chaque série).
import { choice, number, tbl, fmt, int, pick, sample, shuffle } from './helpers.js'

const ARTICLES = ['Palette EUR', 'Carton 40x30', 'Film étirable', 'Étiquettes', 'Cerclage', 'Caisse mixte', 'Housse', 'Intercalaire']
const FICHIERS = ['l’export du WMS', 'le fichier du transporteur', 'l’extraction de l’ERP', 'le relevé des réceptions']

export const PQ_LESSONS = [
  // ───────────────────────── 1. À quoi ça sert ─────────────────────────
  {
    id: 'pq-intro',
    track: 'pq',
    title: 'Power Query : à quoi ça sert ?',
    short: 'Préparer les données une fois, les rejouer à chaque fois',
    course: {
      purpose:
        '**Power Query** est l’outil qui **importe, nettoie et transforme des données** avant de les analyser. Il est intégré à **Excel** (onglet *Données* → *Obtenir des données*) et à **Power BI** (bouton *Transformer les données*).\n\nLa phrase à retenir pour un entretien : « Power Query **automatise la préparation des données** : je décris les transformations une seule fois, et elles se rejouent à chaque actualisation. »',
      sections: [
        {
          title: 'Le problème qu’il résout',
          text: 'Chaque semaine, un export arrive : WMS, ERP, fichier du transporteur. Il est rarement propre : colonnes en trop, espaces, nombres écrits comme du texte, lignes vides…\n\nSans Power Query, tu refais **les mêmes manipulations à la main** à chaque fois (30 minutes, et des oublis possibles). Avec Power Query, tu cliques **une fois** : chaque action est enregistrée, et la semaine suivante il suffit de cliquer sur **Actualiser**.',
        },
        {
          title: 'Power Query ou formules Excel ?',
          text: '**Formules Excel** : elles calculent cellule par cellule dans la feuille. Idéal pour des calculs et des analyses ponctuelles.\n\n**Power Query** : il transforme des **tables entières** *avant* qu’elles arrivent dans la feuille. Il ne modifie **jamais le fichier source**, il garde la **liste des étapes**, et il encaisse de gros volumes.\n\nRègle simple : **Power Query prépare la table, les formules (ou le DAX en Power BI) calculent dessus.**',
        },
        {
          title: 'L’éditeur Power Query',
          text: 'Au centre : l’**aperçu** des données. À gauche : la liste des **requêtes** (une requête = une table). À droite : le volet **Étapes appliquées**, qui liste chaque transformation dans l’ordre. En haut : la barre de formule, qui montre le code de l’étape.\n\nPour sortir : **Fermer et charger** (les données arrivent dans Excel ou dans le modèle Power BI).',
        },
        {
          title: 'Le langage M',
          text: 'Chaque clic écrit une ligne dans un langage appelé **M**. Tu n’as pas besoin de l’apprendre par cœur pour débuter, mais **savoir le lire** est un vrai plus en entretien (on le voit dans l’*Éditeur avancé*).',
        },
      ],
      recall: [
        ['Source', 'Les données d’origine : Power Query ne les modifie jamais.'],
        ['Étapes appliquées', 'La liste des transformations, rejouées dans l’ordre à chaque actualisation.'],
        ['Actualiser', 'Rejoue toutes les étapes sur les nouvelles données.'],
        ['M', 'Le langage dans lequel Power Query écrit les étapes.'],
      ],
    },
    exercises: [
      () => {
        const f = pick(FICHIERS)
        return choice({
          statement: `Chaque lundi, tu reçois ${f} au même format, avec les mêmes défauts (espaces, colonnes inutiles, nombres en texte). Tu le nettoies à la main à chaque fois.`,
          question: 'Quelle solution te fait gagner du temps durablement ?',
          correct: 'Power Query : enregistrer les étapes une fois et cliquer sur Actualiser chaque semaine',
          wrongs: ['Recopier à la main les mêmes formules et manipulations dans chaque nouveau fichier reçu', 'Mettre en forme les cellules en couleur pour repérer les erreurs au fur et à mesure', 'Imprimer chaque fichier et corriger les valeurs fausses au stylo avant de les ressaisir'],
          steps: ['Le problème est répétitif : même source, mêmes défauts, même nettoyage.', 'Power Query mémorise chaque transformation dans « Étapes appliquées ».', 'La semaine suivante, « Actualiser » rejoue les étapes sur le nouveau fichier.'],
          conclusion: 'Power Query sert à automatiser les préparations de données répétitives.',
        })
      },
      () => {
        const n = int(3, 8)
        const m = int(10, 25)
        const total = n * m - 2
        return number({
          statement: `Tu nettoies ${n} fichiers par semaine à la main, à ${m} minutes par fichier. Avec Power Query, l’actualisation de l’ensemble prend 2 minutes.`,
          question: 'Combien de minutes gagnes-tu chaque semaine ?',
          answer: total,
          unit: 'min',
          steps: [`Temps à la main : ${n} fichiers × ${m} min = ${n * m} min.`, 'Temps avec Power Query : 2 min.', `Gain : ${n * m} − 2 = ${total} min par semaine.`],
          conclusion: `Soit environ ${fmt((total * 4) / 60, 1)} heures par mois (4 semaines).`,
        })
      },
      () =>
        choice({
          statement: 'Tu viens de nettoyer un fichier Excel dans Power Query (suppression de colonnes, filtres…).',
          question: 'Que devient le fichier source d’origine ?',
          correct: 'Il reste inchangé : Power Query ne modifie jamais la source',
          wrongs: ['Il est écrasé par la version nettoyée dès que tu fermes l’éditeur Power Query', 'Il est supprimé automatiquement après le chargement des données dans la feuille', 'Il est modifié seulement si tu fermes Excel sans enregistrer le classeur'],
          steps: ['Power Query lit la source et applique les étapes sur une COPIE en mémoire.', 'Le résultat est chargé dans Excel ou Power BI.', 'La source n’est jamais modifiée.'],
          conclusion: 'C’est une sécurité : tu peux toujours revenir aux données brutes.',
        }),
      () =>
        choice({
          statement: 'Un collègue te demande : « Qu’est-ce que tu as fait exactement à ce fichier ? »',
          question: 'Où retrouves-tu la liste de toutes les transformations dans Power Query ?',
          correct: 'Dans le volet « Étapes appliquées »',
          wrongs: ['Dans l’onglet Mise en page', 'Dans la liste des formules de la feuille', 'Dans le fichier source, en bas de la feuille'],
          steps: ['Chaque action (filtre, type, fractionnement…) crée une étape.', 'Les étapes sont listées dans l’ordre, à droite de l’éditeur.', 'Cliquer sur une étape montre l’aperçu des données à ce moment-là.'],
          conclusion: 'C’est ce qui rend le traitement transparent et vérifiable.',
        }),
      () => {
        const good = pick(['Fractionner une colonne « PAL-LYO » en deux colonnes', 'Supprimer les doublons d’un export', 'Dépivoter des colonnes de mois', 'Fusionner un fichier de commandes avec une liste de fournisseurs'])
        return choice({
          statement: 'On te demande de préparer des données avant une analyse.',
          question: 'Laquelle de ces tâches est un travail typique de Power Query ?',
          correct: good,
          wrongs: ['Mettre une cellule en rouge si elle dépasse un seuil', 'Imprimer un rapport en PDF', 'Calculer un taux de remise dans une seule cellule isolée'],
          steps: ['Power Query transforme des tables entières : colonnes, lignes, fusions, formes du tableau.', 'La mise en forme, l’impression ou un calcul dans une cellule isolée relèvent d’Excel.'],
          conclusion: 'Power Query = préparation et transformation de tables.',
        })
      },
      () =>
        choice({
          statement: 'Ta requête Power Query est terminée. Le lendemain, un nouvel export arrive au même format et remplace l’ancien.',
          question: 'Que se passe-t-il quand tu cliques sur « Actualiser » ?',
          correct: 'Les étapes enregistrées sont rejouées dans l’ordre sur les nouvelles données',
          wrongs: ['Il faut refaire chacune des transformations à la main sur le nouveau fichier reçu', 'Le fichier source est écrasé par le résultat nettoyé de la dernière actualisation', 'Seules les anciennes données sont nettoyées, pas les nouvelles lignes arrivées'],
          steps: ['Une requête = une source + une liste d’étapes.', '« Actualiser » relit la source, puis rejoue chaque étape dans l’ordre.', 'Le résultat est mis à jour sans aucune action manuelle.'],
          conclusion: 'C’est la notion de traitement « répétable ».',
        }),
    ],
  },

  // ───────────────────────── 2. Types de colonnes ─────────────────────────
  {
    id: 'pq-types',
    track: 'pq',
    title: 'Importer des données et types de colonnes',
    short: 'Texte, nombre entier, décimal, date : pourquoi le type compte',
    course: {
      purpose:
        'Chaque colonne a un **type** : texte, nombre entier, nombre décimal, date… Le type décide de ce que tu peux faire : **additionner, comparer, trier, calculer des dates**. Un nombre stocké comme du texte est **la cause n°1 des erreurs** de calcul.',
      sections: [
        {
          title: 'Importer',
          text: 'Dans Excel ou Power BI : **Obtenir des données** → *Depuis un fichier* (Excel, CSV), *depuis un dossier*, *depuis le Web*, *depuis une base de données*… Un aperçu s’ouvre : tu peux **Charger** tout de suite ou **Transformer les données** pour passer par l’éditeur (le bon réflexe).',
        },
        {
          title: 'Les types usuels',
          text: '**Nombre entier** : quantités, nombre de palettes.\n**Nombre décimal** : prix, coûts, poids.\n**Texte** : noms, codes, références.\n**Date** : dates de commande, de livraison.\n\nL’icône à gauche de l’en-tête montre le type (ABC pour le texte, 123 pour un entier, 1.2 pour un décimal, un calendrier pour une date). « ABC123 » signifie « type non défini ».',
        },
        {
          title: 'Les pièges classiques',
          text: '**Les zéros initiaux** : le code « 00452 » doit rester du **texte** ; en nombre il deviendrait 452.\n\n**Les dates** : « 04/05/2026 » est le 4 mai en France mais le 5 avril aux États-Unis. Il faut indiquer les **paramètres régionaux** pour la conversion (*Changer le type → Utiliser les paramètres régionaux*).\n\n**Les nombres écrits « 1 250,50 »** arrivent en texte (espace et virgule) : on les convertit en nombre décimal.',
        },
        {
          title: 'Les erreurs de conversion',
          text: 'Si une cellule contient « N/A » et que tu convertis la colonne en nombre, Power Query affiche **Error** dans cette cellule. Solution : **remplacer la valeur d’abord** (par 0 ou par null), puis changer le type.',
          code: 'Table.TransformColumnTypes(Source, {{"Quantité", Int64.Type}, {"Prix", type number}})',
        },
      ],
      recall: [
        ['Entier', 'Nombres sans décimales : quantités.'],
        ['Décimal', 'Prix, coûts, poids.'],
        ['Texte', 'Codes et références (zéros initiaux conservés).'],
        ['Error', 'Conversion impossible : remplace ou nettoie la valeur AVANT de changer le type.'],
      ],
    },
    exercises: [
      () => {
        const cases = [
          { col: 'Quantité commandée', sample: ['12', '40', '7'], answer: 'Nombre entier' },
          { col: 'Prix unitaire (€)', sample: ['12,50', '8,90', '103,20'], answer: 'Nombre décimal' },
          { col: 'Code article', sample: ['00452', '00017', '01230'], answer: 'Texte' },
          { col: 'Date de livraison', sample: ['03/04/2026', '17/04/2026', '02/05/2026'], answer: 'Date' },
          { col: 'N° de commande', sample: ['CMD-1020', 'CMD-1021', 'CMD-1022'], answer: 'Texte' },
        ]
        const c = pick(cases)
        const all = ['Nombre entier', 'Nombre décimal', 'Texte', 'Date']
        const why = { 'Nombre entier': 'des quantités sans virgule', 'Nombre décimal': 'des montants avec des centimes', Texte: 'un code ou une référence : on n’additionne pas des codes et les zéros du début comptent', Date: 'des dates à comparer et à trier chronologiquement' }
        return choice({
          statement: 'Tu importes un fichier. Voici quelques valeurs d’une colonne :',
          tables: [tbl([c.col], c.sample.map((v) => [v]))],
          question: `Quel type donner à la colonne « ${c.col} » ?`,
          correct: c.answer,
          wrongs: all.filter((t) => t !== c.answer),
          steps: [`Les valeurs sont ${why[c.answer]}.`, `Le type adapté est donc : ${c.answer}.`],
          conclusion: 'Choisis le type d’après l’usage de la colonne (calculer, trier, identifier).',
        })
      },
      () => {
        const col = pick(['Quantité', 'Montant', 'Poids'])
        return choice({
          statement: `Dans ta table, la colonne « ${col} » affiche des valeurs alignées à gauche, et le total de la colonne est impossible alors que les valeurs ressemblent à des nombres.`,
          question: 'Quelle est la cause la plus probable ?',
          correct: 'La colonne est de type Texte : il faut la convertir en nombre',
          wrongs: ['Le fichier source est trop volumineux : il faut le découper en plusieurs classeurs', 'Il manque une relation entre deux tables du modèle de données de la feuille', 'Les en-têtes sont écrits en majuscules, ce qui bloque les calculs sur la colonne'],
          steps: ['Un nombre aligné à gauche est le signe d’un type texte.', 'Une somme demande un type nombre.', 'On corrige avec « Changer le type » → Nombre entier ou décimal.'],
          conclusion: 'Premier réflexe devant un calcul impossible : vérifier le type de la colonne.',
        })
      },
      () => {
        const code = `00${int(100, 999)}`
        const n = String(Number(code))
        return choice({
          statement: `Une colonne « Code article » contient « ${code} ». Par erreur, tu la convertis en Nombre entier.`,
          question: 'Que devient la valeur ?',
          correct: n,
          wrongs: [code, `0${n}`, `${n.slice(0, 1)},${n.slice(1)}`],
          steps: ['Un nombre entier n’a pas de zéros initiaux.', `« ${code} » devient donc ${n}.`, 'L’information « 00 » du code est perdue.'],
          conclusion: 'Les codes et références (avec zéros initiaux) restent en Texte.',
        })
      },
      () => {
        const col = pick(['Quantité', 'Coût', 'Poids'])
        return choice({
          statement: `Tu convertis la colonne « ${col} » en nombre. Certaines cellules affichent alors « Error » : elles contenaient « N/A ».`,
          question: 'Quelle est la bonne correction ?',
          correct: 'Remplacer « N/A » par 0 (ou null) AVANT de changer le type',
          wrongs: ['Supprimer toute la colonne, puisqu’elle contient des valeurs impossibles à convertir', 'Changer le type en Texte et laisser les cellules en erreur dans le tableau final', 'Recopier toutes les valeurs à la main directement dans le fichier source d’origine'],
          steps: ['« N/A » n’est pas un nombre : la conversion échoue pour ces cellules.', 'On ajoute une étape « Remplacer les valeurs » (N/A → 0 ou null) avant la conversion.', 'Puis on change le type : plus d’erreur.'],
          conclusion: 'Nettoie d’abord, convertis ensuite : l’ordre des étapes compte.',
        })
      },
      () => {
        const vals = Array.from({ length: 3 }, () => ({ k: int(1, 9), c: int(100, 999), d: pick([0, 25, 50, 75]) }))
        const txt = vals.map((v) => `${v.k} ${v.c},${String(v.d).padStart(2, '0')}`)
        const nums = vals.map((v) => v.k * 1000 + v.c + v.d / 100)
        const total = nums.reduce((s, x) => s + x, 0)
        return number({
          statement: 'Les montants arrivent en texte (espace pour les milliers, virgule pour les centimes). Tu convertis la colonne en Nombre décimal.',
          tables: [tbl(['Montant (texte)'], txt.map((t) => [t]))],
          question: 'Quelle est la somme des trois montants une fois convertis ?',
          answer: total,
          unit: '€',
          digits: 2,
          steps: txt.map((t, i) => `« ${t} » → ${fmt(nums[i], 2)}`).concat([`Somme : ${nums.map((x) => fmt(x, 2)).join(' + ')} = ${fmt(total, 2)}`]),
          conclusion: 'Une fois convertis en nombres, les montants peuvent être additionnés.',
        })
      },
      () =>
        choice({
          statement: 'Après l’import, la date « 04/05/2026 » (4 mai, format français) est lue comme le 5 avril.',
          question: 'Quelle est la cause et la correction ?',
          correct: 'Lecture au format américain : changer le type en indiquant les paramètres régionaux français',
          wrongs: ['Le fichier source est corrompu : il faut redemander un nouvel export complet au service concerné', 'Le jour et le mois sont inversés dans la source, et ce genre de décalage ne se corrige jamais', 'La colonne doit être convertie en Nombre entier pour que Power Query lise correctement la date'],
          steps: ['Le format jj/mm/aaaa (France) et mm/jj/aaaa (États-Unis) sont ambigus.', 'Sans paramètres régionaux explicites, Power Query peut lire la date dans le mauvais ordre.', 'On utilise « Changer le type » → « Utiliser les paramètres régionaux » → Date, Français (France).'],
          conclusion: 'Vérifie toujours quelques dates dont le jour est supérieur à 12 après la conversion.',
        }),
    ],
  },

  // ───────────────────────── 3. Nettoyer des données ─────────────────────────
  {
    id: 'pq-nettoyage',
    track: 'pq',
    title: 'Filtrer, fractionner, remplacer : nettoyer des données sales',
    short: 'Un bouton pour presque chaque problème (et l’ordre compte)',
    course: {
      purpose:
        'Les données réelles sont **sales** : espaces en trop, doublons, lignes vides, colonnes inutiles, valeurs « N/A »… Power Query a une transformation pour presque chaque problème. **L’ordre des étapes compte** : on nettoie avant de filtrer, on convertit le type avant de comparer des nombres.',
      sections: [
        {
          title: 'Filtrer et supprimer',
          text: '**Filtrer les lignes** : la flèche de l’en-tête (comme dans Excel) permet de garder « Livré » seulement.\n**Supprimer des colonnes** : clic droit sur l’en-tête → *Supprimer* (ou *Supprimer les autres colonnes* pour n’en garder que quelques-unes).\n**Supprimer les lignes vides** et **supprimer les doublons** : menu *Accueil → Supprimer les lignes*, ou clic droit sur la colonne.',
          code: 'Table.SelectRows(Source, each [Statut] = "Livré")',
        },
        {
          title: 'Fractionner une colonne',
          text: 'Une colonne « PAL-LYO » contient deux informations. *Transformer → Fractionner la colonne → Par délimiteur* (ici « - ») crée deux colonnes (« Article » et « Site ») à la place de l’originale.',
          code: 'Table.SplitColumn(Source, "Référence", Splitter.SplitTextByDelimiter("-"), {"Article", "Site"})',
        },
        {
          title: 'Remplacer des valeurs',
          text: '*Transformer → Remplacer les valeurs* : « N/A » devient 0, un code ancien devient le nouveau code. On peut aussi remplacer **null** (cellule vide). **Renseigner vers le bas** recopie la valeur du dessus dans les cellules vides (cellules fusionnées d’un export).',
        },
        {
          title: 'Nettoyer le texte',
          text: '*Transformer → Format* : **supprimer les espaces** en début et en fin de texte, passer en **majuscules/minuscules**, **nettoyer** les caractères invisibles. « Livré » et « Livré␣ » (espace final) sont **deux valeurs différentes** pour un filtre !',
          code: 'Table.TransformColumns(Source, {{"Statut", Text.Trim, type text}})',
        },
        {
          title: 'L’ordre des étapes',
          text: '1. Promouvoir les en-têtes, puis nettoyer le texte (espaces).\n2. Remplacer les valeurs parasites, puis changer les types.\n3. Seulement ensuite : filtrer, supprimer les doublons.\n\nExemple : filtrer « Livré » **avant** de supprimer les espaces fait perdre toutes les lignes « Livré␣ ».',
        },
      ],
      recall: [
        ['Espaces parasites', 'Format → Supprimer les espaces (avant de filtrer).'],
        ['« N/A » dans des nombres', 'Remplacer les valeurs, puis changer le type.'],
        ['Deux infos dans une colonne', 'Fractionner la colonne par délimiteur.'],
        ['Cellules vides à remplir', 'Renseigner vers le bas.'],
      ],
    },
    exercises: [
      () => {
        const items = [
          { pb: 'Des statuts s’écrivent « Livré » et « Livré␣ » (espace à la fin).', ok: 'Supprimer les espaces en trop (Format)' },
          { pb: 'Des quantités contiennent « N/A » à la place d’un nombre.', ok: 'Remplacer les valeurs (« N/A » par 0), puis changer le type' },
          { pb: 'Une colonne contient « PAL-LYO » : l’article et le site sont collés.', ok: 'Fractionner la colonne par délimiteur' },
          { pb: 'Le fichier contient des lignes entièrement vides entre les blocs.', ok: 'Supprimer les lignes vides' },
          { pb: 'La même ligne apparaît deux fois à l’identique.', ok: 'Supprimer les doublons' },
          { pb: 'Le nom de l’entrepôt n’est écrit que sur la première ligne de chaque bloc.', ok: 'Renseigner vers le bas' },
        ]
        const it = pick(items)
        const wrongs = sample(items.filter((x) => x !== it).map((x) => x.ok), 3)
        return choice({
          statement: it.pb,
          question: 'Quelle transformation Power Query utiliser ?',
          correct: it.ok,
          wrongs,
          steps: [`Problème : ${it.pb}`, `Transformation adaptée : ${it.ok}.`],
          conclusion: 'Repère le défaut dans les données, puis choisis la transformation qui lui correspond.',
        })
      },
      () => {
        const n = int(7, 9)
        const vals = Array.from({ length: n }, () => pick(['Livré', 'Livré', 'En cours', 'Retard']))
        vals[0] = 'Livré' // position 0 = espace final : garantit au moins une ligne perdue sans nettoyage
        const shown = vals.map((v, i) => (v === 'Livré' && i % 2 === 0 ? 'Livré␣' : v === 'Livré' && i % 3 === 1 ? '␣Livré' : v))
        const exact = shown.filter((v) => v === 'Livré').length
        const all = vals.filter((v) => v === 'Livré').length
        const before = Math.random() < 0.5
        return number({
          statement: 'Dans le tableau, « ␣ » représente un espace invisible. Tu filtres la colonne Statut sur « Livré ».',
          tables: [tbl(['N°', 'Statut'], shown.map((v, i) => [`E${i + 1}`, v]))],
          question: before ? 'Combien de lignes restent si tu filtres AVANT de supprimer les espaces ?' : 'Combien de lignes restent si tu filtres APRÈS avoir supprimé les espaces ?',
          answer: before ? exact : all,
          unit: 'lignes',
          steps: before
            ? ['Sans nettoyage, seules les cellules exactement égales à « Livré » correspondent.', `« Livré␣ » et « ␣Livré » sont écartées : ${exact} ligne(s) restent.`]
            : ['Après « Supprimer les espaces », « Livré␣ » et « ␣Livré » deviennent « Livré ».', `Toutes les lignes livrées correspondent : ${all} ligne(s).`],
          conclusion: 'Nettoie le texte avant de filtrer.',
        })
      },
      () => {
        const arts = sample(ARTICLES, 4)
        const rows = arts.map((a) => [a, int(10, 90)])
        const dups = int(1, 3)
        for (let k = 0; k < dups; k++) rows.push([...pick(rows)])
        const shuffled = shuffle(rows)
        return number({
          statement: 'Tu appliques « Supprimer les doublons » sur toute la table (deux lignes sont doublons si TOUTES leurs colonnes sont identiques).',
          tables: [tbl(['Article', 'Quantité'], shuffled)],
          question: 'Combien de lignes restent ?',
          answer: new Set(shuffled.map((r) => r.join('|'))).size,
          unit: 'lignes',
          steps: [`La table a ${shuffled.length} lignes.`, 'On ne garde qu’un exemplaire de chaque ligne strictement identique.', `Lignes différentes : ${new Set(shuffled.map((r) => r.join('|'))).size}.`],
          conclusion: 'Un doublon se juge sur l’ensemble des colonnes choisies.',
        })
      },
      () => {
        const base = sample(ARTICLES, 4).map((a) => [a, int(10, 90)])
        const rows = [...base, ['', ''], ['', ''], [...base[0]]]
        const shuffled = shuffle(rows)
        const blank = shuffled.filter((r) => r[0] === '').length
        const rest = shuffled.filter((r) => r[0] !== '')
        const uniq = new Set(rest.map((r) => r.join('|'))).size
        return number({
          statement: 'Tu supprimes d’abord les lignes vides, puis les doublons.',
          tables: [tbl(['Article', 'Quantité'], shuffled.map((r) => r.map((c) => (c === '' ? '(vide)' : c))))],
          question: 'Combien de lignes restent à la fin ?',
          answer: uniq,
          unit: 'lignes',
          steps: [`Au départ : ${shuffled.length} lignes.`, `Lignes vides supprimées : ${blank} → ${rest.length} lignes.`, `Doublons supprimés : ${rest.length - uniq} → ${uniq} lignes.`],
          conclusion: 'Chaque étape travaille sur le résultat de la précédente.',
        })
      },
      () => {
        const parts = int(2, 4)
        const items = ['PAL', 'LYO', 'A12', 'B07'].slice(0, parts)
        const code = items.join('-')
        return number({
          statement: `La colonne « Référence » contient « ${code} ». Tu la fractionnes par le délimiteur « - ».`,
          question: 'Combien de nouvelles colonnes obtiens-tu ?',
          answer: parts,
          unit: 'colonnes',
          steps: [`« ${code} » contient ${parts - 1} délimiteur(s) « - ».`, `Il y a donc ${parts} morceaux : ${items.join(' | ')}.`, 'La colonne d’origine est remplacée par ces colonnes.'],
          conclusion: 'Nombre de colonnes = nombre de délimiteurs + 1.',
        })
      },
      () => {
        const snippets = [
          { code: 'Table.SelectRows(Source, each [Statut] = "Livré")', ok: 'Garde seulement les lignes dont le statut est « Livré »' },
          { code: 'Table.RemoveColumns(Source, {"Commentaire"})', ok: 'Supprime la colonne « Commentaire »' },
          { code: 'Table.Distinct(Source)', ok: 'Supprime les lignes en doublon' },
          { code: 'Table.TransformColumnTypes(Source, {{"Quantité", Int64.Type}})', ok: 'Convertit la colonne « Quantité » en nombre entier' },
        ]
        const s = pick(snippets)
        return choice({
          statement: 'Voici une ligne de code M générée par Power Query :',
          code: s.code,
          question: 'Que fait cette étape ?',
          correct: s.ok,
          wrongs: snippets.filter((x) => x !== s).map((x) => x.ok),
          steps: [`Le nom de la fonction indique l’action : ${s.code.split('(')[0]}.`, s.ok + '.'],
          conclusion: 'Les noms des fonctions M sont en anglais mais très parlants (SelectRows, RemoveColumns, Distinct…).',
        })
      },
      () => {
        const word = pick(['Livré', 'Expédié', 'Réceptionné'])
        return choice({
          statement: `Tu veux garder uniquement les lignes « ${word} », mais la colonne contient des espaces parasites (« ${word}␣ »).`,
          question: 'Quel ordre d’étapes est correct ?',
          correct: `Supprimer les espaces, puis filtrer sur « ${word} »`,
          wrongs: [`Filtrer sur « ${word} », puis supprimer les espaces`, 'Supprimer les doublons, puis changer le type en nombre', `Filtrer sur « ${word} » deux fois pour être sûr`],
          steps: ['Le filtre compare le texte exact des cellules.', 'Si les espaces sont encore là, certaines lignes ne correspondent pas.', 'On nettoie donc d’abord, on filtre ensuite.'],
          conclusion: 'Nettoyer avant de filtrer.',
        })
      },
    ],
  },

  // ───────────────────────── 4. Fusionner et ajouter ─────────────────────────
  {
    id: 'pq-fusion',
    track: 'pq',
    title: 'Fusionner et ajouter des requêtes',
    short: 'L’équivalent d’un RECHERCHEX, et l’empilement de fichiers',
    course: {
      purpose:
        'Deux façons de combiner des tables. **Ajouter** = empiler des **lignes** (fichiers mensuels de même structure). **Fusionner** = ajouter des **colonnes** d’une autre table grâce à une **clé commune** — l’équivalent d’un **RECHERCHEX** (ou RECHERCHEV).',
      sections: [
        {
          title: 'Ajouter des requêtes (empiler)',
          text: '*Accueil → Ajouter des requêtes*. Les colonnes sont associées **par leur nom** : janvier + février + mars = un seul tableau plus long. On peut même combiner **tous les fichiers d’un dossier**.',
          code: 'Table.Combine({Janvier, Fevrier})',
        },
        {
          title: 'Fusionner des requêtes (RECHERCHEX)',
          text: '*Accueil → Fusionner des requêtes* : tu choisis les deux tables, la **colonne clé de chacune** (ex. le code fournisseur), et le **type de jointure**. Une nouvelle colonne apparaît : on la **développe** (icône à deux flèches) pour choisir les colonnes à ramener (nom, pays).',
          code: 'Table.NestedJoin(Commandes, {"Code fournisseur"}, Fournisseurs, {"Code"}, "Fournisseurs", JoinKind.LeftOuter)',
        },
        {
          title: 'Les types de jointure',
          text: '**Externe gauche** : garde TOUTES les lignes de la 1re table, ajoute les infos de la 2e quand il y a une correspondance (sinon null). C’est le comportement du RECHERCHEX — le plus courant.\n**Interne** : ne garde que les lignes qui ont une correspondance des deux côtés.\n**Anti-jointure gauche** : garde les lignes de la 1re table SANS correspondance (« quelles commandes n’ont pas de fournisseur référencé ? »).\n(Il existe aussi externe droite et externe complète.)',
        },
        {
          title: 'RECHERCHEX ou fusion ?',
          text: 'Le RECHERCHEX se recalcule cellule par cellule dans la feuille : lent et fragile sur de gros volumes. La fusion traite **toute la table d’un coup**, et se **rejoue** à chaque actualisation.\n\n**Pièges** : la clé doit avoir le même type et le même format des deux côtés (pas d’espace parasite). Si la clé est **en doublon dans la table de droite**, les lignes de gauche sont **dupliquées**.',
        },
      ],
      recall: [
        ['Ajouter', 'Empile des LIGNES (même structure).'],
        ['Fusionner', 'Ajoute des COLONNES via une clé (comme RECHERCHEX).'],
        ['Externe gauche', 'Toutes les lignes de gauche, null si pas de correspondance.'],
        ['Interne', 'Seulement les lignes avec correspondance.'],
      ],
    },
    exercises: [
      () => {
        const cases = [
          { s: 'Tu as un fichier de commandes par mois et tu veux un seul tableau de toute l’année.', ok: 'Ajouter des requêtes' },
          { s: 'Tu as une liste de commandes avec un code fournisseur, et tu veux ajouter le nom du fournisseur depuis une autre table.', ok: 'Fusionner des requêtes' },
          { s: 'Tu reçois le fichier de décembre, de même structure que celui de novembre, à mettre à la suite.', ok: 'Ajouter des requêtes' },
          { s: 'Tu veux ramener le prix de chaque article depuis un tarif, grâce à la référence article.', ok: 'Fusionner des requêtes' },
        ]
        const c = pick(cases)
        const other = c.ok === 'Ajouter des requêtes' ? 'Fusionner des requêtes' : 'Ajouter des requêtes'
        return choice({
          statement: c.s,
          question: 'Quelle opération Power Query faut-il utiliser ?',
          correct: c.ok,
          wrongs: [other, 'Dépivoter les colonnes', 'Fractionner la colonne'],
          steps: c.ok === 'Ajouter des requêtes' ? ['Les tables ont la même structure : on veut PLUS DE LIGNES.', 'C’est le rôle de « Ajouter des requêtes ».'] : ['Il faut des INFORMATIONS EN PLUS (colonnes) venant d’une autre table.', 'Grâce à une clé commune : c’est « Fusionner des requêtes » (comme un RECHERCHEX).'],
          conclusion: 'Ajouter = lignes en plus ; fusionner = colonnes en plus.',
        })
      },
      () => {
        const a = int(40, 300)
        const b = int(40, 300)
        const c = int(40, 300)
        return number({
          statement: 'Tu ajoutes (empiles) trois fichiers mensuels de même structure.',
          tables: [tbl(['Fichier', 'Lignes'], [['Janvier', a], ['Février', b], ['Mars', c]])],
          question: 'Combien de lignes contient le tableau final ?',
          answer: a + b + c,
          unit: 'lignes',
          steps: [`${a} + ${b} + ${c} = ${a + b + c}`],
          conclusion: 'Ajouter des requêtes additionne les lignes (les colonnes restent les mêmes).',
        })
      },
      () => {
        const cases = [
          { s: 'Garder toutes les commandes, même celles dont le fournisseur n’est pas dans le référentiel.', ok: 'Externe gauche' },
          { s: 'Ne garder que les commandes dont le fournisseur est connu dans le référentiel.', ok: 'Interne' },
          { s: 'Lister les commandes dont le fournisseur est ABSENT du référentiel (à corriger).', ok: 'Anti-jointure gauche' },
        ]
        const c = pick(cases)
        return choice({
          statement: c.s,
          question: 'Quel type de jointure choisir (la table de commandes est la table de gauche) ?',
          correct: c.ok,
          wrongs: ['Externe gauche', 'Interne', 'Anti-jointure gauche'].filter((x) => x !== c.ok).concat(['Ajouter des requêtes']),
          steps: {
            'Externe gauche': ['On veut conserver TOUTES les lignes de gauche.', 'Sans correspondance, les colonnes ajoutées valent null : c’est la jointure externe gauche (comportement du RECHERCHEX).'],
            Interne: ['On ne veut que les lignes avec correspondance.', 'C’est la jointure interne : les commandes sans fournisseur connu disparaissent.'],
            'Anti-jointure gauche': ['On veut seulement les lignes de gauche SANS correspondance.', 'C’est l’anti-jointure gauche.'],
          }[c.ok],
          conclusion: 'Le type de jointure décide de ce qu’on fait des lignes sans correspondance.',
        })
      },
      () => {
        const codes = ['F01', 'F02', 'F03', 'F04']
        const known = sample(codes, 3)
        const orders = Array.from({ length: int(6, 9) }, (_, i) => [`C${100 + i}`, pick([...known, ...known, 'F09'])])
        const inner = orders.filter((o) => known.includes(o[1])).length
        const leftOuter = orders.length
        const inn = Math.random() < 0.5
        return number({
          statement: `Chaque code de la table « Fournisseurs » est unique. Tu fusionnes « Commandes » (table de gauche) avec « Fournisseurs » sur le code, en jointure ${inn ? 'interne' : 'externe gauche'}.`,
          tables: [tbl(['N° commande', 'Code fournisseur'], orders, 'Commandes'), tbl(['Code', 'Fournisseur'], known.map((k) => [k, `Fournisseur ${k}`]), 'Fournisseurs')],
          question: 'Combien de lignes contient le résultat ?',
          answer: inn ? inner : leftOuter,
          unit: 'lignes',
          steps: inn
            ? [`Codes connus : ${known.join(', ')}.`, `Commandes avec un code connu : ${inner}.`, 'La jointure interne écarte les autres commandes (code absent, ex. F09).']
            : [`La jointure externe gauche garde toutes les commandes : ${leftOuter}.`, 'Les commandes dont le code est inconnu auront null dans les colonnes du fournisseur.'],
          conclusion: inn ? 'Interne : seulement les lignes avec correspondance.' : 'Externe gauche : aucune ligne de gauche n’est perdue.',
        })
      },
      () => {
        const orders = Array.from({ length: int(5, 7) }, (_, i) => [`C${100 + i}`, pick(['F01', 'F02', 'F03'])])
        const dup = pick(['F01', 'F02', 'F03'])
        const sup = [['F01', 'Site A'], ['F02', 'Site A'], ['F03', 'Site A'], [dup, 'Site B']]
        const extra = orders.filter((o) => o[1] === dup).length
        return number({
          statement: `Attention : le code ${dup} apparaît DEUX fois dans la table « Fournisseurs » (deux sites). Tu fais une fusion externe gauche de « Commandes » avec « Fournisseurs » sur le code.`,
          tables: [tbl(['N° commande', 'Code'], orders, 'Commandes'), tbl(['Code', 'Site'], sup, 'Fournisseurs')],
          question: 'Combien de lignes contient le résultat ?',
          answer: orders.length + extra,
          unit: 'lignes',
          steps: [`Commandes au départ : ${orders.length}.`, `Commandes portant le code ${dup} : ${extra}. Chacune trouve 2 correspondances → ${extra} ligne(s) en plus.`, `Total : ${orders.length} + ${extra} = ${orders.length + extra}.`],
          conclusion: 'Une clé en doublon dans la table de droite duplique les lignes : vérifie l’unicité des clés.',
        })
      },
      () =>
        choice({
          statement: 'En Excel, tu utilises RECHERCHEX pour ramener le nom du fournisseur à côté de chaque commande, ligne par ligne.',
          question: 'Quelle opération Power Query remplace ce travail ?',
          correct: 'Fusionner les requêtes (externe gauche) puis développer la colonne du fournisseur',
          wrongs: ['Dépivoter les autres colonnes de la table de commandes pour obtenir un format long', 'Fractionner la colonne du code fournisseur par délimiteur en plusieurs colonnes', 'Supprimer les doublons de la table des commandes puis trier par code'],
          steps: ['RECHERCHEX = « va chercher dans une autre table la valeur qui correspond à cette clé ».', 'C’est exactement une fusion sur la clé, en jointure externe gauche.', 'On développe ensuite la colonne pour choisir les champs à ramener.'],
          conclusion: 'La fusion fait tout d’un coup, sur toute la table, et se rejoue à l’actualisation.',
        }),
    ],
  },

  // ───────────────────────── 5. Pivoter et dépivoter ─────────────────────────
  {
    id: 'pq-pivot',
    track: 'pq',
    title: 'Pivoter et dépivoter',
    short: 'Passer d’un tableau « large » à un tableau « long » (et inversement)',
    course: {
      purpose:
        'Pivoter et dépivoter changent la **forme** du tableau. Format **large** : une colonne par mois (Janv, Févr, Mars…), pratique à lire. Format **long** : une ligne par produit **et** par mois, avec une colonne « Mois » et une colonne « Valeur ». Les outils d’analyse (Power BI, tableaux croisés) **préfèrent le format long**.',
      sections: [
        {
          title: 'Dépivoter',
          text: 'Tu sélectionnes la ou les colonnes à **garder** (Produit), clic droit → **Dépivoter les autres colonnes**. Les colonnes de mois deviennent deux colonnes : **Attribut** (le mois) et **Valeur** (le chiffre) que tu renommes. Les cellules vides ne produisent pas de ligne.',
          code: 'Table.UnpivotOtherColumns(Source, {"Produit"}, "Mois", "Stock")',
        },
        {
          title: 'Pourquoi « les autres colonnes » ?',
          text: 'Si tu choisis « Dépivoter les autres colonnes » (et non « les colonnes sélectionnées »), le mois suivant — **une nouvelle colonne Avril** — sera dépivoté automatiquement à la prochaine actualisation. C’est la méthode robuste.',
        },
        {
          title: 'Pivoter',
          text: '*Transformer → Colonne dynamique* (« Pivoter la colonne ») fait l’inverse : les valeurs d’une colonne (les mois) deviennent des **en-têtes**. Tu choisis la colonne des valeurs et une **agrégation** (somme, moyenne…). Utile pour produire un tableau lisible ; dans Power BI, on laisse plutôt une **matrice** faire ce travail.',
          code: 'Table.Pivot(Source, List.Distinct(Source[Mois]), "Mois", "Ventes", List.Sum)',
        },
        {
          title: 'Compter les lignes',
          text: 'Dépivoter k produits sur m colonnes de mois (toutes remplies) donne **k × m lignes**. Si une colonne parasite (comme « Total ») est dans les « autres colonnes », elle est dépivotée aussi, ce qui fausse les calculs.',
        },
      ],
      recall: [
        ['Dépivoter', 'Colonnes de mois → colonnes Attribut / Valeur (format long).'],
        ['Pivoter', 'Valeurs d’une colonne → en-têtes (format large).'],
        ['Format long', 'Le plus adapté à Power BI et aux tableaux croisés.'],
        ['Autres colonnes', 'Option robuste : les nouvelles colonnes sont prises en compte.'],
      ],
    },
    exercises: [
      () => {
        const prods = sample(ARTICLES, int(3, 5))
        const months = ['Janv', 'Févr', 'Mars', 'Avr'].slice(0, int(2, 4))
        const rows = prods.map((p) => [p, ...months.map(() => (Math.random() < 0.2 ? null : int(10, 200)))])
        const filled = rows.reduce((s, r) => s + r.slice(1).filter((v) => v !== null).length, 0)
        return number({
          statement: 'Tu dépivotes toutes les colonnes sauf « Produit ». Rappel : une cellule vide (null) ne produit aucune ligne.',
          tables: [tbl(['Produit', ...months], rows)],
          question: 'Combien de lignes contient le tableau dépivoté ?',
          answer: filled,
          unit: 'lignes',
          steps: [`${prods.length} produits × ${months.length} mois = ${prods.length * months.length} cases.`, `Cases vides (null) : ${prods.length * months.length - filled}.`, `Lignes obtenues : ${filled}.`],
          conclusion: 'Une ligne par valeur non vide : produit, mois, valeur.',
        })
      },
      () => {
        const prods = sample(ARTICLES, 3)
        const months = ['Janv', 'Févr', 'Mars', 'Avr', 'Mai'].slice(0, int(2, 5))
        const rows = prods.flatMap((p) => months.map((m) => [p, m, int(10, 200)]))
        return number({
          statement: 'Tu pivotes la colonne « Mois » (valeurs : somme de « Ventes »). La colonne « Produit » est conservée.',
          tables: [tbl(['Produit', 'Mois', 'Ventes'], rows.slice(0, 6), 'Extrait (le tableau compte ' + rows.length + ' lignes)')],
          question: 'Combien de colonnes contient le tableau pivoté (Produit comprise) ?',
          answer: months.length + 1,
          unit: 'colonnes',
          steps: [`Mois différents : ${months.join(', ')} → ${months.length} colonnes.`, `+ la colonne « Produit » = ${months.length + 1} colonnes.`],
          conclusion: 'Chaque valeur distincte de la colonne pivotée devient une colonne.',
        })
      },
      () => {
        const wide = Math.random() < 0.5
        return choice({
          statement: wide
            ? 'Tu as un tableau avec les colonnes : Produit | Janv | Févr | Mars. Tu veux en faire un graphique de l’évolution par mois dans Power BI.'
            : 'Tu as un tableau avec les colonnes : Produit | Mois | Stock (une ligne par produit et par mois).',
          question: wide ? 'Quelle opération faut-il faire avant de construire le visuel ?' : 'Ce format est-il adapté à Power BI ?',
          correct: wide ? 'Dépivoter les autres colonnes pour obtenir Produit | Mois | Valeur' : 'Oui : c’est le format long, idéal pour filtrer et regrouper',
          wrongs: wide
            ? ['Pivoter la colonne Produit pour obtenir une colonne par produit', 'Supprimer les doublons de la colonne Produit puis trier', 'Fusionner avec une table de dates qui n’a aucune clé commune avec celle-ci']
            : ['Non : il faut obligatoirement une colonne par mois pour que Power BI fonctionne', 'Non : il faut tout regrouper dans une seule colonne de texte séparé par des virgules', 'Oui, mais seulement dans Excel : Power BI exige un autre format de données'],
          steps: wide
            ? ['Les mois sont des noms de colonnes : impossible de les mettre sur un axe ou de les filtrer.', 'On dépivote : les noms de colonnes deviennent des valeurs d’une colonne « Mois ».']
            : ['Une colonne « Mois » existe : on peut la mettre en axe, filtrer, regrouper.', 'Ajouter un mois = ajouter des lignes, pas des colonnes.'],
          conclusion: 'Power BI préfère les tables longues (une ligne = une observation).',
        })
      },
      () => {
        const toLong = Math.random() < 0.5
        return choice({
          statement: toLong ? 'Tu veux passer des colonnes « Janv, Févr, Mars » à deux colonnes « Mois » et « Valeur ».' : 'Tu veux passer d’une colonne « Mois » (valeurs répétées) à une colonne par mois.',
          question: 'Quelle opération faut-il appliquer ?',
          correct: toLong ? 'Dépivoter' : 'Pivoter',
          wrongs: [toLong ? 'Pivoter' : 'Dépivoter', 'Fusionner', 'Ajouter'],
          steps: toLong ? ['Colonnes → lignes : c’est le dépivotage.'] : ['Valeurs d’une colonne → en-têtes de colonnes : c’est le pivotage.'],
          conclusion: 'Dépivoter : large → long. Pivoter : long → large.',
        })
      },
      () =>
        choice({
          statement: 'Ton tableau a une colonne par mois. Chaque mois, une nouvelle colonne est ajoutée à droite par le service qui l’alimente.',
          question: 'Pourquoi choisir « Dépivoter les autres colonnes » plutôt que « Dépivoter les colonnes sélectionnées » ?',
          correct: 'Les nouvelles colonnes de mois seront dépivotées automatiquement à l’actualisation',
          wrongs: ['C’est plus rapide à exécuter, sans aucune autre différence sur le résultat obtenu', 'La première option supprime les doublons en même temps que le dépivotage des colonnes', 'Les deux options sont identiques dans tous les cas, même quand de nouveaux mois arrivent'],
          steps: ['« Dépivoter les autres colonnes » mémorise la colonne à GARDER (Produit).', 'Toute nouvelle colonne est donc traitée comme un mois.', '« Colonnes sélectionnées » mémorise les noms des mois existants : un nouveau mois serait ignoré.'],
          conclusion: 'C’est la méthode robuste quand la source évolue.',
        }),
      () => {
        const k = int(3, 5)
        const m = int(3, 6)
        return number({
          statement: `Un tableau a ${k} produits et ${m} colonnes de mois, plus une colonne « Total » (somme des mois) qu’on a oublié de retirer. Toutes les cellules sont remplies. Tu dépivotes toutes les colonnes sauf « Produit ».`,
          question: 'Combien de lignes obtiens-tu ?',
          answer: k * (m + 1),
          unit: 'lignes',
          steps: [`Colonnes dépivotées : ${m} mois + « Total » = ${m + 1}.`, `${k} produits × ${m + 1} = ${k * (m + 1)} lignes.`, 'Le « Total » est devenu un « mois » : un calcul global le compterait en double.'],
          conclusion: 'Supprime les colonnes parasites (Total) avant de dépivoter.',
        })
      },
    ],
  },

  // ───────────────────────── 6. Étapes appliquées ─────────────────────────
  {
    id: 'pq-etapes',
    track: 'pq',
    title: 'Les étapes appliquées : un traitement répétable',
    short: 'Pourquoi Power Query rend le travail rejouable et vérifiable',
    course: {
      purpose:
        'Chaque action que tu fais est mémorisée comme une **étape** dans le volet **Étapes appliquées**. C’est ce qui rend le traitement **répétable** (actualiser = rejouer), **vérifiable** (on voit tout ce qui a été fait) et **modifiable** (on peut changer, supprimer ou réorganiser une étape).',
      sections: [
        {
          title: 'Rejouer à chaque actualisation',
          text: 'Nouvelle donnée dans la source → **Actualiser**. Power Query relit la source, puis rejoue chaque étape **dans l’ordre**. Aucun clic à refaire. C’est la réponse à « pourquoi c’est mieux que de le faire à la main ? ».',
        },
        {
          title: 'Modifier, supprimer, réordonner',
          text: 'Cliquer sur une étape montre les données **telles qu’elles étaient à ce moment-là**. La croix supprime l’étape ; le glisser-déposer la déplace. Attention : si une étape suivante utilise une colonne que tu viens de supprimer, tu obtiens une erreur du type « La colonne X de la table est introuvable ».',
        },
        {
          title: 'Lire le code M',
          text: 'Dans l’**Éditeur avancé**, chaque étape est une ligne. Le résultat de la requête est la dernière étape, après le mot **in**.',
          code: 'let\n    Source = Excel.Workbook(File.Contents("export.xlsx")),\n    Filtre = Table.SelectRows(Source, each [Statut] = "Livré"),\n    Types = Table.TransformColumnTypes(Filtre, {{"Quantité", Int64.Type}})\nin\n    Types',
        },
        {
          title: 'Bonnes pratiques',
          text: '• **Renommer les étapes** (clic droit) pour les rendre lisibles : « Garder les livrés ».\n• Ne jamais modifier le résultat à la main dans la feuille : il sera écrasé à l’actualisation.\n• Garder des **noms de colonnes stables** dans la source.\n• Une requête = une préparation ; on peut en enchaîner plusieurs.',
        },
        {
          title: 'Les limites',
          text: 'Si la source change de forme (colonne renommée ou supprimée), l’étape qui l’utilise tombe en **erreur** à l’actualisation. Il faut alors corriger l’étape. C’est pour cela qu’on teste et qu’on documente.',
        },
      ],
      recall: [
        ['Étape', 'Une transformation mémorisée, rejouée dans l’ordre.'],
        ['Éditeur avancé', 'Affiche le code M complet de la requête (let … in).'],
        ['in', 'Le résultat de la requête : le nom de la dernière étape.'],
        ['Erreur d’étape', 'Souvent une colonne introuvable : source modifiée ou étape mal ordonnée.'],
      ],
    },
    exercises: [
      () =>
        choice({
          statement: 'Ta requête est terminée. La semaine suivante, tu reçois un nouveau fichier avec exactement la même structure.',
          question: 'Que fais-tu ?',
          correct: 'Je remplace la source par le nouveau fichier et je clique sur Actualiser',
          wrongs: ['Je recrée toutes les transformations depuis zéro, comme pour le premier fichier', 'Je copie-colle à la main les données propres sur l’ancien résultat de la requête', 'Je supprime la requête existante et j’en crée une identique à partir du nouveau fichier'],
          steps: ['Les étapes sont mémorisées dans la requête.', 'Il suffit de pointer la source vers le nouveau fichier (ou de le déposer au même endroit).', '« Actualiser » rejoue toutes les étapes.'],
          conclusion: 'Traitement répétable : une préparation, des dizaines d’utilisations.',
        }),
      () => {
        const col = pick(['Coût', 'Commentaire', 'Statut', 'Poids'])
        return choice({
          statement: `Une requête a deux étapes dans cet ordre : 1) Supprimer la colonne « ${col} » ; 2) Changer le type de « ${col} » en nombre.`,
          question: 'Que se passe-t-il ?',
          correct: `L’étape 2 est en erreur : la colonne « ${col} » n’existe plus`,
          wrongs: ['Tout fonctionne normalement, car les étapes sont indépendantes les unes des autres', 'L’étape 1 est annulée automatiquement pour que la deuxième puisse s’exécuter', 'La colonne supprimée est recréée automatiquement avec des valeurs vides pour l’étape 2'],
          steps: ['Les étapes se rejouent dans l’ordre.', `Après l’étape 1, « ${col} » a disparu.`, 'L’étape 2 cherche une colonne introuvable : erreur d’expression.'],
          conclusion: 'L’ordre des étapes compte : on utilise une colonne avant de la supprimer.',
        })
      },
      () => {
        const names = sample(['Garder les livrés', 'Typage', 'Nettoyage', 'Colonnes utiles', 'Résultat'], 3)
        return choice({
          statement: 'Voici le code M d’une requête (Éditeur avancé) :',
          code: `let\n    Source = Excel.Workbook(File.Contents("export.xlsx")),\n    #"${names[0]}" = Table.SelectRows(Source, each [Statut] = "Livré"),\n    #"${names[1]}" = Table.TransformColumnTypes(#"${names[0]}", {{"Quantité", Int64.Type}}),\n    #"${names[2]}" = Table.RemoveColumns(#"${names[1]}", {"Commentaire"})\nin\n    #"${names[2]}"`,
          question: 'Quelle étape donne le résultat final de la requête ?',
          correct: `« ${names[2]} » (l’étape après « in »)`,
          wrongs: [`« ${names[0]} » (la première étape après « Source »)`, '« Source » (le fichier Excel lu au tout début)', `« ${names[1]} » (l’étape située au milieu de la requête)`],
          steps: ['Le mot « in » désigne ce que la requête renvoie.', `Ici : ${names[2]}, la dernière étape.`, 'Les étapes précédentes sont ses ingrédients, chacune utilise le résultat de la précédente.'],
          conclusion: 'Lire le M : chaque ligne = une étape ; « in » = le résultat.',
        })
      },
      () =>
        choice({
          statement: 'Dans le fichier source, quelqu’un renomme la colonne « Statut » en « État ». Ta requête filtre sur la colonne « Statut ».',
          question: 'Que se passe-t-il à la prochaine actualisation ?',
          correct: 'L’étape de filtre passe en erreur : la colonne « Statut » est introuvable',
          wrongs: ['Power Query détecte le renommage dans la source et adapte le filtre tout seul sans rien afficher', 'Le filtre est ignoré silencieusement et toutes les lignes de la source sont conservées', 'Le fichier source est corrigé automatiquement pour retrouver l’ancien nom de colonne'],
          steps: ['L’étape mémorise le NOM de la colonne.', 'Ce nom n’existe plus dans la source.', 'Il faut corriger l’étape (ou demander à garder des noms stables).'],
          conclusion: 'Le traitement est répétable tant que la structure de la source reste stable.',
        }),
      () => {
        const good = pick([
          'Je peux relire exactement ce qui a été fait aux données',
          'Je peux supprimer ou modifier une étape sans tout refaire',
        ])
        return choice({
          statement: 'Tu défends Power Query face à une préparation manuelle dans Excel.',
          question: 'Quel argument est correct ?',
          correct: good,
          wrongs: ['Power Query modifie directement le fichier source pour le garder propre à chaque fois', 'Il n’y a plus jamais d’erreur, même si la structure de la source change entre deux envois', 'Il n’est utile que pour les petits tableaux de quelques dizaines de lignes'],
          steps: ['Les étapes appliquées documentent le traitement.', 'On peut modifier une étape, la supprimer ou la déplacer.', 'La source n’est jamais modifiée, et un changement de structure peut faire échouer une étape.'],
          conclusion: 'Répétable, traçable, modifiable : les trois arguments clés.',
        })
      },
      () =>
        choice({
          statement: 'Tu veux voir le code M complet d’une requête, avec toutes ses étapes.',
          question: 'Où le trouves-tu ?',
          correct: 'Dans l’Éditeur avancé de Power Query',
          wrongs: ['Dans l’onglet Mise en page d’Excel', 'Dans la vue Données de Power BI uniquement', 'Dans le fichier source, en ouvrant les propriétés'],
          steps: ['L’éditeur Power Query a un bouton « Éditeur avancé » (onglet Accueil).', 'Il affiche la requête complète : let … in.'],
          conclusion: 'Savoir lire le M montre que tu maîtrises ce qui se passe derrière les clics.',
        }),
    ],
  },
]
