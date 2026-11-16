import { motion } from 'motion/react'

// Enveloppe commune à toutes les pages : titre (facultatif) + petite animation d'apparition
export default function Page({ title, children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mx-auto max-w-xl px-4 pt-6 pb-28"
    >
      {title && <h1 className="mb-4 text-2xl font-bold">{title}</h1>}
      {children}
    </motion.main>
  )
}
