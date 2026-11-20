import { motion } from 'motion/react'
import { Heart } from 'lucide-react'
import { toggleFavorite, useFavoriteIds } from '../lib/favorites.js'

// Bouton cœur : ajoute / retire un favori. `item` vient des fabriques de src/lib/favorites.js (videoFav, lessonFav…).
// variant « overlay » : rond sombre posé sur une image ; « plain » : discret, sur une carte ou un en-tête.
export default function FavButton({ item, variant = 'plain', size = 18, className = '' }) {
  const on = useFavoriteIds().has(item.id)
  const look =
    variant === 'overlay'
      ? `size-7 bg-black/50 ${on ? 'text-rose-400' : 'text-white'}`
      : variant === 'dark' // sur un fond noir (lecteur vidéo)
        ? `size-11 bg-white/10 ${on ? 'text-rose-400' : 'text-white'}`
        : `size-10 hover:bg-line/50 ${on ? 'text-rose-500' : 'text-muted'}`
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      title={on ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      onClick={(event) => {
        // utilisable au-dessus d'une carte cliquable : on n'ouvre pas la carte
        event.preventDefault()
        event.stopPropagation()
        toggleFavorite(item)
      }}
      className={`grid shrink-0 place-items-center rounded-full transition-transform active:scale-90 ${look} ${className}`}
    >
      {/* key : la petite animation « pop » se rejoue à chaque changement */}
      <motion.span key={on ? 'on' : 'off'} initial={{ scale: on ? 0.5 : 1 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 12 }} className="grid place-items-center">
        <Heart size={variant === 'overlay' ? 14 : size} fill={on ? 'currentColor' : 'none'} />
      </motion.span>
    </button>
  )
}
