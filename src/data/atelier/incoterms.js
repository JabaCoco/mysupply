// Incoterms 2020 : qui fait quoi, et où le risque change de main (simplifié pour l'apprentissage)
const S = 'Vendeur'
const B = 'Acheteur'

export const INCOTERM_ROWS = [
  'Chargement au départ',
  'Dédouanement export',
  'Transport principal',
  'Assurance transport',
  'Déchargement à destination',
  'Dédouanement import et droits',
]

export const INCOTERMS = [
  { code: 'EXW', name: 'Ex Works', maritime: false, risk: 'Dans les locaux du vendeur, dès la mise à disposition (le vendeur ne charge même pas).', rows: [B, B, B, `${B} (facultatif)`, B, B] },
  { code: 'FCA', name: 'Free Carrier', maritime: false, risk: "À la remise au transporteur choisi par l'acheteur.", rows: [S, S, B, `${B} (facultatif)`, B, B] },
  { code: 'FAS', name: 'Free Alongside Ship', maritime: true, risk: 'Quand la marchandise est le long du navire, au port de départ.', rows: [S, S, B, `${B} (facultatif)`, B, B] },
  { code: 'FOB', name: 'Free On Board', maritime: true, risk: 'Quand la marchandise est à bord du navire, au port de départ.', rows: [S, S, B, `${B} (facultatif)`, B, B] },
  { code: 'CFR', name: 'Cost and Freight', maritime: true, risk: 'À bord du navire au port de départ (même si le vendeur paie le fret).', rows: [S, S, S, `${B} (facultatif)`, B, B] },
  { code: 'CIF', name: 'Cost, Insurance and Freight', maritime: true, risk: 'À bord du navire au port de départ (même si le vendeur paie fret et assurance).', rows: [S, S, S, `${S} (obligatoire, couverture minimale)`, B, B] },
  { code: 'CPT', name: 'Carriage Paid To', maritime: false, risk: 'À la remise au premier transporteur, au départ.', rows: [S, S, S, `${B} (facultatif)`, B, B] },
  { code: 'CIP', name: 'Carriage and Insurance Paid To', maritime: false, risk: 'À la remise au premier transporteur, au départ.', rows: [S, S, S, `${S} (obligatoire, couverture étendue)`, B, B] },
  { code: 'DAP', name: 'Delivered At Place', maritime: false, risk: 'À destination, marchandise prête à être déchargée.', rows: [S, S, S, `${S} (dans son intérêt)`, B, B] },
  { code: 'DPU', name: 'Delivered at Place Unloaded', maritime: false, risk: 'À destination, une fois la marchandise déchargée.', rows: [S, S, S, `${S} (dans son intérêt)`, S, B] },
  { code: 'DDP', name: 'Delivered Duty Paid', maritime: false, risk: 'À destination, marchandise prête à être déchargée.', rows: [S, S, S, `${S} (dans son intérêt)`, B, S] },
]

export const isSeller = (who) => who.startsWith(S)
