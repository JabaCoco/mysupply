import { motion } from 'motion/react'

// Largeur du contenu selon l'écran (téléphone vertical : colonne étroite ; tablette / PC : plus large, toujours centré).
// `wide` : pages en grille (Accueil, Actu, Atelier, Cours) qui profitent d'un grand écran.
const WIDTHS = 'max-w-xl rail:max-w-2xl lg:max-w-3xl'
const WIDTHS_WIDE = 'max-w-xl rail:max-w-2xl lg:max-w-5xl xl:max-w-6xl'

// Enveloppe commune à toutes les pages : titre (facultatif) + petite animation d'apparition
export default function Page({ title, wide = false, children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`mx-auto px-4 pt-6 pb-28 rail:px-6 rail:pt-8 rail:pb-10 ${wide ? WIDTHS_WIDE : WIDTHS}`}
    >
      {title && <h1 className="mb-4 text-2xl font-bold">{title}</h1>}
      {children}
    </motion.main>
  )
}
