import { motion } from 'motion/react'

// Largeur du contenu selon l'écran.
// - par défaut (écrans de détail : jeux, formulaires, lectures) : colonne centrée, plus large sur tablette et PC
// - `full` (les 6 onglets principaux) : sur tablette, PC et téléphone couché, le contenu occupe toute la largeur
//   à côté de la navigation, et les pages s'organisent en colonnes. Téléphone vertical : colonne étroite (inchangé).
const WIDTHS = 'max-w-xl rail:max-w-2xl lg:max-w-3xl rail:px-6'
const WIDTHS_FULL = 'max-w-xl rail:max-w-none rail:px-6 lg:px-8 2xl:px-10'

// Enveloppe commune à toutes les pages : titre (facultatif) + petite animation d'apparition
export default function Page({ title, full = false, children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`mx-auto px-4 pt-6 pb-28 rail:pt-8 rail:pb-10 ${full ? WIDTHS_FULL : WIDTHS}`}
    >
      {title && <h1 className="mb-4 text-2xl font-bold">{title}</h1>}
      {children}
    </motion.main>
  )
}
