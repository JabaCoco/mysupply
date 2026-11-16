import { ExternalLink, Newspaper } from 'lucide-react'
import { timeAgo } from '../../lib/dates.js'

export default function ArticleCard({ article, loading }) {
  return (
    <section className="rounded-3xl border border-line bg-card p-4">
      <p className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-amber-400 uppercase">
        <Newspaper size={14} /> Article du jour
      </p>

      {loading && (
        <div className="mt-3 animate-pulse space-y-2" aria-label="Chargement">
          <div className="h-3 w-1/3 rounded bg-line" />
          <div className="h-4 w-full rounded bg-line" />
          <div className="h-4 w-2/3 rounded bg-line" />
        </div>
      )}

      {!loading && !article && (
        <p className="mt-2 text-sm text-muted">
          Aucun article disponible pour l'instant. Vérifie ta connexion Internet.
        </p>
      )}

      {!loading && article && (
        <ArticleBody article={article} />
      )}
    </section>
  )
}

function ArticleBody({ article }) {
  const body = (
    <>
      <p className="mt-2 text-xs text-muted">
        {article.source} · {timeAgo(new Date(article.date))}
      </p>
      <p className="mt-1 text-lg leading-snug font-bold group-hover:underline">{article.title}</p>
      {article.link && (
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-violet-400">
          Lire l'article <ExternalLink size={14} />
        </span>
      )}
    </>
  )

  return article.link ? (
    <a href={article.link} target="_blank" rel="noopener noreferrer" className="group block">
      {body}
    </a>
  ) : (
    <div>{body}</div>
  )
}
