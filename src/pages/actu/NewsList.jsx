import { Check, ExternalLink, Eye } from 'lucide-react'
import { THEMES } from '../../lib/themes.js'
import { timeAgo } from '../../lib/dates.js'
import { toggleRead } from '../../lib/news.js'
import { articleFav } from '../../lib/favorites.js'
import FavButton from '../../components/FavButton.jsx'
import ShareButton from '../../components/ShareButton.jsx'

const themeById = Object.fromEntries(THEMES.map((t) => [t.id, t]))

// Liste d'articles de presse (ouverts dans un nouvel onglet du navigateur).
// Sous chaque article : « Lu » (marque l'article comme lu, sans XP), favori, partager.
export default function NewsList({ items, seen }) {
  if (items.length === 0) {
    return (
      <p className="rounded-3xl border border-line bg-card p-4 text-sm text-muted">
        Rien à afficher sur ce thème pour l'instant.
      </p>
    )
  }

  return (
    <ul className="space-y-3 md:grid md:grid-cols-2 md:gap-3 md:space-y-0 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map((item) => {
        const read = seen.has(item.id)
        return (
          <li key={item.id} className="flex flex-col rounded-3xl border border-line bg-card">
            <a
              href={item.link ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className={`block flex-1 space-y-1.5 rounded-t-3xl p-4 pb-2 transition-opacity ${read ? 'opacity-60' : ''}`}
            >
              <span className="block text-xs text-muted">
                {item.source} · {timeAgo(new Date(item.date))}
              </span>
              <span className="block leading-snug font-bold">{item.title}</span>
              <span className="flex items-center justify-between gap-2">
                <span className="flex flex-wrap gap-1">
                  {item.themes.map((id) => (
                    <span key={id} className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${themeById[id].badge}`}>
                      {themeById[id].label}
                    </span>
                  ))}
                </span>
                {item.link && <ExternalLink size={14} className="shrink-0 text-muted" />}
              </span>
            </a>
            <div className="flex items-center gap-1 px-2 pb-2">
              <button
                type="button"
                onClick={() => toggleRead(item.id)}
                aria-pressed={read}
                className={`flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors ${read ? 'bg-emerald-500/15 text-emerald-400' : 'text-muted hover:bg-line/50'}`}
              >
                {read ? <Check size={14} /> : <Eye size={14} />}
                {read ? 'Lu' : 'Marquer comme lu'}
              </button>
              <span className="flex-1" />
              <FavButton item={articleFav(item)} size={17} className="size-9!" />
              <ShareButton title={item.title} url={item.link} size={17} className="size-9 rounded-full text-muted hover:bg-line/50" />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
