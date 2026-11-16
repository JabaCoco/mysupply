import { motion, useReducedMotion } from 'motion/react'
import { Flame as FlameIcon } from 'lucide-react'

// Flamme qui "vacille" en boucle
export default function Flame({ size = 18, animated = true, iconClassName = 'fill-orange-400 text-orange-500' }) {
  const reduceMotion = useReducedMotion()
  const flicker = animated && !reduceMotion

  return (
    <motion.span
      className="inline-flex origin-bottom"
      animate={flicker ? { scale: [1, 1.12, 0.95, 1.08, 1], rotate: [0, -4, 3, -2, 0] } : undefined}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <FlameIcon size={size} className={iconClassName} />
    </motion.span>
  )
}
