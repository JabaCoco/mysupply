import { dayOfYear } from '../lib/dates.js'

// Choisit un élément de la liste selon le jour : change chaque jour, identique toute la journée
export function pickOfDay(list, date = new Date()) {
  return list[dayOfYear(date) % list.length]
}

// Chiffres clés (ordres de grandeur arrondis)
export const figures = [
  {
    value: '80 %',
    text: 'du commerce mondial (en volume) voyage par la mer.',
    source: 'CNUCED',
  },
  {
    value: '1956',
    text: "L'Ideal X de Malcom McLean transporte les premiers conteneurs modernes, de Newark à Houston.",
    source: 'Histoire du conteneur',
  },
  {
    value: '24 000 EVP',
    text: "C'est la capacité des plus grands porte-conteneurs actuels. 1 EVP = un conteneur de 20 pieds.",
    source: 'Armateurs',
  },
  {
    value: '≈ 12 %',
    text: 'du commerce mondial passe par le canal de Suez.',
    source: 'Autorité du canal de Suez',
  },
  {
    value: '49 millions',
    text: "d'EVP traités en 2023 par Shanghai, premier port à conteneurs du monde.",
    source: 'Port de Shanghai',
  },
  {
    value: '33 m³',
    text: "C'est le volume intérieur d'un conteneur standard de 20 pieds (environ 6 m de long).",
    source: 'Norme ISO',
  },
]

// Contenus provisoires : ils seront remplacés par les vraies données
// quand l'onglet Révisions sera construit.
export const placeholders = {
  cardsToReview: 8,
  badges: { won: 4, total: 30 },
}
