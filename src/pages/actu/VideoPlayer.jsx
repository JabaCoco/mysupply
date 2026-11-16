import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react'
import { markSeen } from '../../lib/news.js'
import { timeAgo } from '../../lib/dates.js'
import YouTubeEmbed from './YouTubeEmbed.jsx'
import LangBadge from '../../components/LangBadge.jsx'

// Lecteur plein écran : lit les vidéos YouTube dans l'appli, avec Précédent / Suivant
export default function VideoPlayer({ videos, index, onIndexChange, onClose }) {
  const video = videos[index]
  const hasPrev = index > 0
  const hasNext = index < videos.length - 1

  // Compte la vidéo comme vue (et donne les XP la première fois)
  useEffect(() => {
    markSeen(video)
  }, [video])

  // Clavier : Échap pour fermer, flèches pour changer de vidéo
  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight' && hasNext) onIndexChange(index + 1)
      if (event.key === 'ArrowLeft' && hasPrev) onIndexChange(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, hasNext, hasPrev, onClose, onIndexChange])

  // Empêche la page derrière de défiler
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  const navButton =
    'grid size-11 shrink-0 place-items-center rounded-full bg-white/10 transition-opacity disabled:opacity-30'

  // createPortal : le lecteur est placé directement dans <body>, par-dessus tout le reste
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-black text-white"
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
    >
      <div className="flex items-center justify-between p-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <span className="text-sm text-white/70">
          {index + 1} / {videos.length}
        </span>
        <button type="button" onClick={onClose} className={navButton} aria-label="Fermer la vidéo">
          <X size={20} />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-3">
        <div className={video.isShort ? 'aspect-[9/16] h-full max-w-full' : 'aspect-video w-full max-w-3xl'}>
          {/* key : un lecteur tout neuf à chaque vidéo */}
          <YouTubeEmbed key={video.videoId} video={video} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-xl p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <p className="flex items-center gap-2 text-xs text-white/60">
          <LangBadge lang={video.lang} />
          <span>
            {video.source} · {timeAgo(new Date(video.date))}
            {video.lang === 'en' && ' · sous-titres en français'}
          </span>
        </p>
        <p className="mt-1 line-clamp-2 leading-snug font-bold">{video.title}</p>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            className={navButton}
            disabled={!hasPrev}
            onClick={() => onIndexChange(index - 1)}
            aria-label="Vidéo précédente"
          >
            <ChevronLeft size={22} />
          </button>
          <a
            href={video.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-white/10 text-sm font-semibold"
          >
            Ouvrir sur YouTube <ExternalLink size={14} />
          </a>
          <button
            type="button"
            className={navButton}
            disabled={!hasNext}
            onClick={() => onIndexChange(index + 1)}
            aria-label="Vidéo suivante"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </motion.div>,
    document.body,
  )
}
