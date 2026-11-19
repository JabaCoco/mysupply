// Indicateurs supply chain utilisés par les exercices et le constructeur de tableau de bord Power BI.
// Ce sont des fonctions JavaScript qui font le même calcul que les mesures DAX montrées dans l'appli.
// Livraison = { fournisseur, entrepot, transporteur, mois, qteCom, qteLiv, retard (jours, 0 = à l'heure), cout }
// Ligne de stock = { mois, entrepot, categorie, coutVentes, stock }

const sum = (rows, key) => rows.reduce((s, r) => s + r[key], 0)

// Division sécurisée (comme DIVIDE en DAX) : renvoie `alt` si le dénominateur vaut 0
export const divide = (a, b, alt = null) => (b === 0 ? alt : a / b)

export const isOtif = (r) => r.retard <= 0 && r.qteLiv >= r.qteCom
// OTIF = livraisons à l'heure ET complètes / toutes les livraisons
export const otif = (rows) => divide(rows.filter(isOtif).length, rows.length)
// Taux de service = quantité livrée / quantité commandée
export const tauxService = (rows) => divide(sum(rows, 'qteLiv'), sum(rows, 'qteCom'))
// Retard moyen par livraison (en jours, 0 pour une livraison à l'heure)
export const retardMoyen = (rows) => divide(sum(rows, 'retard'), rows.length)
export const partEnRetard = (rows) => divide(rows.filter((r) => r.retard > 0).length, rows.length)
export const coutTransport = (rows) => sum(rows, 'cout')
// Coût de transport par unité livrée
export const coutParUnite = (rows) => divide(sum(rows, 'cout'), sum(rows, 'qteLiv'))
export const nbLivraisons = (rows) => rows.length

// Stocks (une ligne par mois, entrepôt et catégorie ; « stock » = valeur du stock en fin de mois).
// Rotation mensuelle = coût des ventes du mois / stock (somme / somme, valable à tous les niveaux de regroupement) ;
// couverture (jours) = 30 jours / rotation mensuelle ; stock moyen = stock total de fin de mois, en moyenne sur les mois.
export const coutVentes = (rows) => sum(rows, 'coutVentes')
export const rotation = (rows) => divide(sum(rows, 'coutVentes'), sum(rows, 'stock'))
export const couverture = (rows, jours = 30) => divide(jours, rotation(rows))
export const stockMoyen = (rows) => divide(sum(rows, 'stock'), new Set(rows.map((r) => r.mois)).size)
