import { Check, Play } from 'lucide-react'
import { timeAgo } from '../../lib/dates.js'
import { THEMES } from '../../lib/themes.js'
import LangBadge from '../../components/LangBadge.jsx'

// Thèmes mis en avant par un badge sur les vignettes : IA, Géopolitique, Tech / Panne
const HIGHLIGHTED = THEMES.filter((t) => t.highlight)

// Grille de vidéos (format vertical)
export default function ShortsGrid({ shorts, seen, onOpen }) {
  if (shorts.length === 0) {
    return (
      <p className="rounded-3xl border border-line bg-card p-4 text-sm text-muted">
        Pas de vidéo sur ce thème cette semaine.
      </p>
    )
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {shorts.map((video, index) => {
        const isSeen = seen.has(video.id)
        const badges = HIGHLIGHTED.filter((t) => video.themes.includes(t.id))
        return (
          <li key={video.id}>
            <button
              type="button"
              onClick={() => onOpen(index)}
              className="relative block aspect-[9/16] w-full overflow-hidden rounded-2xl bg-card text-left transition-transform active:scale-95"
            >
              <img
                src={video.thumbnail}
                alt=""
                loading="lazy"
                className={`absolute inset-0 size-full object-cover ${isSeen ? 'opacity-50' : ''}`}
              />
              <span className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

              {/* Badges en haut à gauche : langue, thèmes mis en avant, format long */}
              <span className="absolute top-2.5 right-11 left-2.5 flex flex-wrap gap-1">
                <LangBadge lang={video.lang} />
                {badges.map((t) => (
                  <span
                    key={t.id}
                    className={`rounded-md px-1.5 py-0.5 text-[10px] leading-none font-bold text-white ${t.solid}`}
                  >
                    {t.label}
                  </span>
                ))}
                {!video.isShort && (
                  <span className="rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] leading-none font-bold text-white">
                    Format long
                  </span>
                )}
              </span>

              <span className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-black/50 text-white">
                {isSeen ? <Check size={14} aria-label="Déjà vue" /> : <Play size={12} className="fill-white" />}
              </span>
              <span className="absolute inset-x-2.5 bottom-2.5 text-white">
                <span className="line-clamp-3 text-sm leading-tight font-semibold">{video.title}</span>
                <span className="mt-1 block truncate text-[11px] text-white/70">
                  {video.source} · {timeAgo(new Date(video.date))}
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
