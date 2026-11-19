// Scénarios du mini-simulateur Power Query (/atelier/bi/simulateur).
// Chaque scénario fabrique, à chaque essai, une table « sale » aux données tirées au hasard, l'objectif à atteindre
// (= résultat des étapes idéales rejouées dans le moteur) et des transformations proposées (les bonnes + des pièges).
import { int, pick, sample, shuffle } from '../../gen.js'
import { runSteps } from '../../../lib/powerQuery.js'

const T = (names, rows) => ({ cols: names.map((name) => ({ name, type: 'any' })), rows })
const ideal = (id, step) => ({ id, step, ideal: true })
const trap = (id, step) => ({ id, step, ideal: false })

const SITES = ['Lyon', 'Lille', 'Nantes', 'Marseille', 'Rennes']
const ARTICLES = ['Palette EUR', 'Carton 40x30', 'Film étirable', 'Étiquettes', 'Cerclage', 'Caisse mixte', 'Housse', 'Intercalaire']
const CITIES = ['Paris', 'Bordeaux', 'Toulouse', 'Lille', 'Nice', 'Metz', 'Dijon', 'Rouen']
const comma = (min, max) => `${int(min, max)},${pick(['00', '20', '50', '90'])}`

// Pour garantir qu'un élément du hasard apparaisse au moins une fois
function mustContain(arr, value, count = 1) {
  const have = arr.filter((v) => v === value).length
  for (let k = have; k < count; k++) arr[int(0, arr.length - 1)] = value
  return arr
}

export const PQ_SCENARIOS = [
  {
    id: 'pq-s1',
    title: 'Le fichier du transporteur',
    intro: 'Un transporteur t’envoie chaque semaine un fichier d’envois. Les en-têtes sont sur la première ligne, des espaces parasites traînent dans les statuts, les coûts sont écrits avec une virgule. Il te faut seulement les envois livrés, avec un coût utilisable en calcul.',
    recall: [
      ['En-têtes', 'À l’import, la 1re ligne arrive parfois comme une ligne de données : « Utiliser la première ligne comme en-têtes ».'],
      ['Espaces', '« Livré » et « Livré␣ » (espace à la fin) sont deux valeurs différentes pour un filtre : nettoie avant de filtrer.'],
      ['Type', 'Pour calculer ou comparer des nombres, la colonne doit être de type nombre (décimal pour les virgules).'],
    ],
    make() {
      const status = mustContain(Array.from({ length: int(8, 10) }, () => pick(['Livré', 'Livré', 'En cours', 'Retard'])), 'Livré', 4)
      status[0] = 'Livré '
      status[1] = ' Livré'
      status[2] = 'En cours'
      const dests = sample(CITIES, 8)
      const rows = status.map((s, i) => [`E${int(1000, 9999)}`, dests[i % dests.length], s, comma(40, 900), pick(['RAS', '', 'Appel client'])])
      rows[0][3] = '45,50' // un envoi livré à moins de 100 € : le piège « coût > 100 » fait toujours perdre au moins une ligne
      const source = T(['Column1', 'Column2', 'Column3', 'Column4', 'Column5'], [['N° envoi', 'Destination', 'Statut', 'Coût (€)', 'Commentaire'], ...rows])
      return {
        source,
        ideal: [
          ideal('a', { op: 'promoteHeaders' }),
          ideal('b', { op: 'trim', col: 'Statut' }),
          ideal('c', { op: 'filter', col: 'Statut', cmp: 'eq', value: 'Livré' }),
          ideal('d', { op: 'changeType', col: 'Coût (€)', type: 'dec' }),
          ideal('e', { op: 'removeCols', cols: ['Commentaire'] }),
        ],
        traps: [
          trap('t1', { op: 'filter', col: 'Statut', cmp: 'eq', value: 'Retard' }),
          trap('t2', { op: 'removeCols', cols: ['Destination'] }),
          trap('t3', { op: 'changeType', col: 'Statut', type: 'int' }),
          trap('t4', { op: 'filter', col: 'Coût (€)', cmp: 'gt', value: 100 }),
        ],
        problems: ['La première ligne contient les titres mais est traitée comme une ligne de données (colonnes « Column1… »).', 'Des statuts ont un espace au début ou à la fin.', 'Les coûts sont du texte avec une virgule.', 'Une colonne « Commentaire » ne sert pas.'],
        expectedRows: status.filter((s) => s.trim() === 'Livré').length,
      }
    },
  },
  {
    id: 'pq-s2',
    title: 'L’export WMS aux cellules fusionnées',
    intro: 'Un export de l’entrepôt (WMS) a été copié depuis un tableau à cellules fusionnées : le nom de l’entrepôt n’est écrit que sur la première ligne de chaque bloc, il y a des lignes vides entre les blocs, une ligne en double, et « N/A » à la place de quelques quantités. Prépare une table propre.',
    recall: [
      ['Lignes vides', '« Supprimer les lignes vides » retire les lignes où toutes les cellules sont vides.'],
      ['Renseigner vers le bas', 'Recopie la dernière valeur non vide vers les cellules vides en dessous (pratique pour les cellules fusionnées).'],
      ['Doublons', 'Deux lignes sont doublons si toutes leurs colonnes sont identiques : fais-le quand chaque ligne est complète.'],
      ['Remplacer puis typer', 'Un texte comme « N/A » provoque une erreur à la conversion en nombre : remplace-le avant de changer le type.'],
    ],
    make() {
      const [w0, w1, w2] = sample(SITES, 3)
      const [a, b, c, d] = sample(ARTICLES, 4)
      const q = () => String(int(5, 90))
      const shared = [b, q()]
      const g0 = [[a, q()], shared, shared]
      const g1 = [[c, q()], shared]
      const g2 = [[d, 'N/A'], [a, q()]]
      const rows = []
      for (const [w, g] of [[w0, g0], [w1, g1], [w2, g2]]) {
        g.forEach((item, i) => rows.push([i === 0 ? w : null, item[0], item[1]]))
        rows.push([null, null, null])
      }
      rows.pop() // pas de ligne vide à la fin
      const source = T(['Entrepôt', 'Article', 'Quantité'], rows)
      return {
        source,
        ideal: [
          ideal('a', { op: 'removeBlankRows' }),
          ideal('b', { op: 'fillDown', col: 'Entrepôt' }),
          ideal('c', { op: 'removeDuplicates' }),
          ideal('d', { op: 'replace', col: 'Quantité', from: 'N/A', to: '0' }),
          ideal('e', { op: 'changeType', col: 'Quantité', type: 'int' }),
        ],
        traps: [
          trap('t1', { op: 'removeCols', cols: ['Article'] }),
          trap('t2', { op: 'replace', col: 'Quantité', from: 'N/A', to: '' }),
          trap('t3', { op: 'filter', col: 'Quantité', cmp: 'gt', value: 0 }),
          trap('t4', { op: 'removeDuplicates', cols: ['Article'] }),
        ],
        problems: ['Le nom de l’entrepôt n’est écrit qu’une fois par bloc (cellules vides en dessous).', 'Des lignes sont entièrement vides.', 'Une ligne apparaît deux fois de suite.', '« N/A » est écrit à la place d’un nombre dans « Quantité ».'],
        expectedRows: g0.length - 1 + g1.length + g2.length,
      }
    },
  },
  {
    id: 'pq-s3',
    title: 'Les références collées',
    intro: 'Dans un fichier de réception, la colonne « Référence » colle l’article et le site (ex. « PAL-LYO »). Tu veux deux colonnes séparées, les quantités en nombres, et seulement les lignes d’un site précis qui atteignent au moins 100 unités.',
    recall: [
      ['Fractionner', '« Fractionner la colonne » par délimiteur crée une colonne par morceau et remplace la colonne d’origine.'],
      ['Ordre', 'Tu ne peux filtrer sur « Site » qu’une fois la colonne créée par le fractionnement.'],
      ['Comparer', 'Un filtre « supérieur ou égal à » ne marche que sur une colonne de type nombre : change d’abord le type.'],
    ],
    make() {
      const all = ['LYO', 'LIL', 'NAN']
      const site = pick(all)
      const other = pick(all.filter((s) => s !== site))
      const codes = ['PAL', 'CAR', 'FIL', 'ETI', 'CER']
      // 3 premières lignes imposées : site voulu < 100, site voulu ≥ 100, autre site ≥ 100 (chaque filtre est donc nécessaire)
      const sites = [site, site, other, ...Array.from({ length: int(4, 6) }, () => pick(all))]
      const rows = sites.map((s, i) => [`${codes[i % codes.length]}-${s}`, String(i === 0 ? 50 : i === 1 ? 250 : i === 2 ? 300 : int(10, 400))])
      return {
        source: T(['Référence', 'Quantité'], rows),
        ideal: [
          ideal('a', { op: 'split', col: 'Référence', sep: '-', names: ['Article', 'Site'] }),
          ideal('b', { op: 'changeType', col: 'Quantité', type: 'int' }),
          ideal('c', { op: 'filter', col: 'Site', cmp: 'eq', value: site }),
          ideal('d', { op: 'filter', col: 'Quantité', cmp: 'ge', value: 100 }),
        ],
        traps: [
          trap('t1', { op: 'filter', col: 'Référence', cmp: 'eq', value: site }),
          trap('t2', { op: 'split', col: 'Référence', sep: ' ', names: ['Article', 'Site'] }),
          trap('t3', { op: 'removeCols', cols: ['Quantité'] }),
          trap('t4', { op: 'changeType', col: 'Référence', type: 'int' }),
        ],
        problems: ['Deux informations (article et site) sont collées dans une même colonne, séparées par « - ».', 'Les quantités sont du texte.', `On ne veut que le site ${site}, avec au moins 100 unités.`],
        expectedRows: rows.filter((r, i) => sites[i] === site && Number(r[1]) >= 100).length,
      }
    },
  },
  {
    id: 'pq-s4',
    title: 'Retrouver le fournisseur de chaque commande',
    intro: 'Tu as une liste de commandes avec seulement un code fournisseur, et une autre requête « Fournisseurs » (code, nom, pays). Ajoute le nom et le pays à chaque commande, sans perdre aucune commande (même si un code est inconnu), puis écarte les commandes des fournisseurs chinois. C’est l’équivalent d’un RECHERCHEX.',
    recall: [
      ['Fusionner', '« Fusionner les requêtes » ajoute des COLONNES d’une autre table en s’appuyant sur une clé commune (comme RECHERCHEX).'],
      ['Externe gauche', 'Garde toutes les lignes de la table de gauche ; sans correspondance, les nouvelles colonnes valent null. « Interne » ne garde que les correspondances.'],
      ['Clé', 'La colonne de gauche et celle de droite doivent contenir les mêmes codes, avec le même type.'],
    ],
    make() {
      const codes = ['F01', 'F02', 'F03', 'F04']
      const noms = sample(['Nordic Parts', 'Sud Emballages', 'Dupont Logistique', 'Eurofilm', 'Packline'], 4)
      const pays = ['Chine', ...sample(['France', 'Allemagne', 'Pologne', 'Espagne'], 3)] // F01 est le fournisseur chinois
      const fournisseurs = T(['Code', 'Fournisseur', 'Pays'], codes.map((c, i) => [c, noms[i], pays[i]]))
      const used = Array.from({ length: int(6, 8) }, () => pick(codes))
      used[0] = 'F01'
      used[1] = 'F02'
      used[used.length - 1] = 'F09' // code inconnu : la jointure externe gauche le garde, l'interne le perd
      const rows = used.map((c, i) => [`C${200 + i}`, c, `${int(1, 9)} ${String(int(0, 9))}${int(10, 99)},${pick(['00', '50'])}`])
      return {
        source: T(['N° commande', 'Code fournisseur', 'Montant'], rows),
        tables: { Fournisseurs: fournisseurs },
        ideal: [
          ideal('a', { op: 'merge', right: 'Fournisseurs', leftKey: 'Code fournisseur', rightKey: 'Code', join: 'leftouter', take: ['Fournisseur', 'Pays'] }),
          ideal('b', { op: 'changeType', col: 'Montant', type: 'dec' }),
          ideal('c', { op: 'filter', col: 'Pays', cmp: 'ne', value: 'Chine' }),
        ],
        traps: [
          trap('t1', { op: 'merge', right: 'Fournisseurs', leftKey: 'Code fournisseur', rightKey: 'Code', join: 'inner', take: ['Fournisseur', 'Pays'] }),
          trap('t2', { op: 'merge', right: 'Fournisseurs', leftKey: 'N° commande', rightKey: 'Code', join: 'leftouter', take: ['Fournisseur', 'Pays'] }),
          trap('t3', { op: 'append', with: 'Fournisseurs' }),
          trap('t4', { op: 'filter', col: 'Montant', cmp: 'gt', value: 500 }),
        ],
        problems: ['Les commandes n’ont que le code fournisseur : nom et pays sont dans une autre requête.', 'Une commande porte un code absent de la table « Fournisseurs » : il ne faut pas la perdre.', 'Les montants sont du texte (virgule, espace).', 'Les commandes des fournisseurs chinois doivent être écartées (le pays n’existe qu’après la fusion).'],
        expectedRows: used.filter((c) => c !== 'F01').length, // les commandes F01 (Chine) sont écartées ; le code inconnu F09 est gardé (Pays = null)
      }
    },
  },
  {
    id: 'pq-s5',
    title: 'Un stock en colonnes par mois',
    intro: 'Le tableau de stock a une colonne par mois (Janv, Févr, Mars) : pratique à lire, mais inexploitable pour un graphique ou un modèle. Transforme-le en une table « longue » (une ligne par produit et par mois), avec des nombres, et sans le mois de janvier.',
    recall: [
      ['Dépivoter', '« Dépivoter les autres colonnes » : garde les colonnes sélectionnées (ici Produit) et transforme toutes les autres en deux colonnes Attribut / Valeur.'],
      ['Valeurs vides', 'Les cellules vides ne produisent aucune ligne après le dépivotage.'],
      ['Format long', 'Power BI préfère des tables longues : une ligne = une mesure d’un produit à une date.'],
    ],
    make() {
      const produits = sample(ARTICLES, int(3, 4))
      const rows = produits.map((p) => [p, String(int(20, 300)), String(int(20, 300)), String(int(20, 300))])
      rows[0][3] = null // un stock non renseigné : aucune ligne après le dépivotage
      return {
        source: T(['Produit', 'Janv', 'Févr', 'Mars'], rows),
        ideal: [
          ideal('a', { op: 'unpivot', keep: ['Produit'], attr: 'Mois', value: 'Stock' }),
          ideal('b', { op: 'changeType', col: 'Stock', type: 'int' }),
          ideal('c', { op: 'filter', col: 'Mois', cmp: 'ne', value: 'Janv' }),
        ],
        traps: [
          trap('t1', { op: 'unpivot', keep: ['Produit', 'Janv'], attr: 'Mois', value: 'Stock' }),
          trap('t2', { op: 'removeCols', cols: ['Févr'] }),
          trap('t3', { op: 'pivot', attr: 'Produit', value: 'Janv' }),
          trap('t4', { op: 'filter', col: 'Stock', cmp: 'gt', value: 100 }),
        ],
        problems: ['Les mois sont des noms de colonnes : il faut une colonne « Mois » et une colonne « Stock ».', 'Les stocks sont du texte.', 'Le mois de janvier ne doit pas rester.'],
        expectedRows: rows.reduce((s, r) => s + r.slice(2).filter((v) => v !== null).length, 0),
      }
    },
  },
  {
    id: 'pq-s6',
    title: 'Deux fichiers mensuels à assembler',
    intro: 'Tu reçois un fichier « Janvier » et un fichier « Fevrier » de même structure. Des commandes passées fin janvier apparaissent dans les deux. Fais une seule table sans doublon, avec les montants en nombres.',
    recall: [
      ['Ajouter', '« Ajouter des requêtes » empile les LIGNES de deux tables de même structure (c’est l’inverse de fusionner, qui ajoute des colonnes).'],
      ['Doublons', 'Supprime les doublons sur les lignes entières, pas sur une seule colonne : un même client peut avoir plusieurs commandes.'],
    ],
    make() {
      const clients = sample(['Axiom', 'Becker', 'Cordier', 'Delmas', 'Eyraud', 'Fabre'], 6)
      const line = (n, c) => [`C${n}`, c, `${int(100, 2000)},${pick(['00', '50'])}`]
      const jan = Array.from({ length: 4 }, (_, i) => line(300 + i, clients[i]))
      const fev = Array.from({ length: 3 }, (_, i) => line(310 + i, clients[(i + 2) % 6]))
      fev.push([...jan[3]]) // la commande de fin janvier est ré-exportée en février
      fev.push([...jan[2]])
      const cols = ['Commande', 'Client', 'Montant']
      return {
        source: T(cols, jan),
        tables: { Fevrier: T(cols, fev) },
        ideal: [
          ideal('a', { op: 'append', with: 'Fevrier' }),
          ideal('b', { op: 'removeDuplicates' }),
          ideal('c', { op: 'changeType', col: 'Montant', type: 'dec' }),
        ],
        traps: [
          trap('t1', { op: 'removeDuplicates', cols: ['Client'] }),
          trap('t2', { op: 'merge', right: 'Fevrier', leftKey: 'Commande', rightKey: 'Commande', join: 'inner', take: ['Montant'] }),
          trap('t3', { op: 'changeType', col: 'Client', type: 'dec' }),
          trap('t4', { op: 'removeCols', cols: ['Client'] }),
        ],
        problems: ['Les commandes sont dans deux requêtes séparées de même structure.', 'Deux commandes sont présentes dans les deux fichiers.', 'Les montants sont du texte (virgule).'],
        expectedRows: jan.length + fev.length - 2,
      }
    },
  },
  {
    id: 'pq-s7',
    title: 'Des ventes à mettre en colonnes',
    intro: 'Tu as des ventes en lignes (produit, mois, ventes) et tu veux un tableau avec une colonne par mois, comme dans un tableau croisé. Les ventes sont encore du texte.',
    recall: [
      ['Pivoter', '« Pivoter la colonne » : les valeurs d’une colonne (les mois) deviennent des en-têtes ; il faut choisir la colonne de valeurs (ventes) et une agrégation (somme).'],
      ['Type', 'Pour agréger (somme), la colonne de valeurs doit être de type nombre.'],
    ],
    make() {
      const produits = sample(ARTICLES, 3)
      const mois = ['Janv', 'Févr', 'Mars']
      const rows = []
      produits.forEach((p, pi) => mois.forEach((m, mi) => { if (!(pi === 2 && mi === 1)) rows.push([p, m, String(int(10, 200))]) }))
      return {
        source: T(['Produit', 'Mois', 'Ventes'], rows),
        ideal: [ideal('a', { op: 'changeType', col: 'Ventes', type: 'int' }), ideal('b', { op: 'pivot', attr: 'Mois', value: 'Ventes' })],
        traps: [
          trap('t1', { op: 'pivot', attr: 'Produit', value: 'Ventes' }),
          trap('t2', { op: 'removeCols', cols: ['Mois'] }),
          trap('t3', { op: 'unpivot', keep: ['Produit'], attr: 'Attribut', value: 'Valeur' }),
          trap('t4', { op: 'changeType', col: 'Mois', type: 'int' }),
        ],
        problems: ['Les mois sont répétés en lignes : on veut une colonne par mois.', 'Les ventes sont du texte : impossible de les additionner.', 'Une combinaison produit / mois n’existe pas : elle restera vide (null).'],
        expectedRows: produits.length,
      }
    },
  },
]

// Prépare une partie : source, objectif, transformations proposées (mélangées) et étapes idéales
export function makePqGame(scenario) {
  const g = scenario.make()
  const tables = g.tables ?? {}
  const { final: target } = runSteps(g.source, g.ideal.map((c) => c.step), tables)
  return { ...g, tables, target, candidates: shuffle([...g.ideal, ...g.traps]) }
}
