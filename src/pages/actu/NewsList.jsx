import { ExternalLink } from 'lucide-react'
import { THEMES } from '../../lib/themes.js'
import { timeAgo } from '../../lib/dates.js'

const themeById = Object.fromEntries(THEMES.map((t) => [t.id, t]))

// Liste d'articles de presse (ouverts dans un nouvel onglet du navigateur)
export default function NewsList({ items }) {
  if (items.length === 0) {
    return (
      <p className="rounded-3xl border border-line bg-card p-4 text-sm text-muted">
        Rien à afficher sur ce thème pour l'instant.
      </p>
    )
  }

  return (
    <ul className="space-y-3 md:grid md:grid-cols-2 md:gap-3 md:space-y-0 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={item.link ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
            className="block space-y-1.5 rounded-3xl border border-line bg-card p-4 transition-transform active:scale-[0.98]"
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
        </li>
      ))}
    </ul>
  )
}
