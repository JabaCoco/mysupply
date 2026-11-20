import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { AnimatePresence } from 'motion/react'
import { ExternalLink, GraduationCap, Hammer, Heart, Languages, Layers, Newspaper, PlaySquare, Search } from 'lucide-react'
import Page from '../../components/Page.jsx'
import SubHeader from '../../components/SubHeader.jsx'
import FavButton from '../../components/FavButton.jsx'
import VideoPlayer from '../actu/VideoPlayer.jsx'
import { FAV_TYPES, useFavorites } from '../../lib/favorites.js'

const TYPE_STYLE = {
  video: { Icon: PlaySquare, color: 'bg-rose-500' },
  article: { Icon: Newspaper, color: 'bg-sky-500' },
  lesson: { Icon: GraduationCap, color: 'bg-violet-500' },
  card: { Icon: Layers, color: 'bg-orange-500' },
  word: { Icon: Languages, color: 'bg-pink-500' },
  atelier: { Icon: Hammer, color: 'bg-emerald-500' },
}
const LABEL = Object.fromEntries(FAV_TYPES.map((t) => [t.id, t.label]))

// Page « Mes favoris » : tout ce qu'on a mis en cœur, avec filtres par type et recherche.
// Les vidéos et articles de l'Actu gardent leur titre, leur lien et leur miniature : ils restent ouverts même s'ils ne sont plus dans le flux.
export default function Favoris() {
  const favorites = useFavorites()
  const [type, setType] = useState('all')
  const [query, setQuery] = useState('')
  const [player, setPlayer] = useState(null) // index dans la liste des vidéos affichées

  const shown = useMemo(() => {
    if (!favorites) return []
    const q = query.trim().toLowerCase()
    return favorites
      .filter((f) => type === 'all' || f.type === type)
      .filter((f) => !q || [f.title, f.sub, f.text].some((s) => s?.toLowerCase().includes(q)))
  }, [favorites, type, query])

  if (!favorites) return null
  const videos = shown.filter((f) => f.type === 'video' && f.data).map((f) => f.data)
  const count = (id) => (id === 'all' ? favorites.length : favorites.filter((f) => f.type === id).length)

  return (
    <Page>
      <SubHeader back="/" title="Mes favoris" subtitle={`${favorites.length} favori${favorites.length > 1 ? 's' : ''}`} />

      {favorites.length === 0 ? (
        <div className="rounded-3xl border border-line bg-card p-6 text-center">
          <Heart size={36} className="mx-auto text-rose-400" />
          <p className="mt-3 font-bold">Pas encore de favori</p>
          <p className="mt-1 text-sm text-muted">Touche le cœur sur une vidéo ou un article de l'Actu, une leçon, une carte de révision, un mot d'anglais ou une activité de l'Atelier : tu le retrouveras ici.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <label className="flex items-center gap-2 rounded-2xl border border-line bg-card px-3 focus-within:border-rose-400">
            <Search size={18} className="text-muted" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Chercher dans mes favoris" aria-label="Chercher dans mes favoris" className="h-11 flex-1 bg-transparent outline-none" />
          </label>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par type">
            {[{ id: 'all', label: 'Tout' }, ...FAV_TYPES].map((t) => {
              const n = count(t.id)
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  aria-pressed={type === t.id}
                  disabled={n === 0 && t.id !== 'all'}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-semibold disabled:opacity-40 ${type === t.id ? 'bg-rose-500 text-white' : 'border border-line bg-card text-muted'}`}
                >
                  {t.label} <span className="opacity-70">{n}</span>
                </button>
              )
            })}
          </div>

          {shown.length === 0 && <p className="rounded-2xl border border-line bg-card p-4 text-sm text-muted">Aucun favori ne correspond.</p>}

          <ul className="grid gap-2.5 md:grid-cols-2">
            {shown.map((fav) => (
              <FavCard key={fav.id} fav={fav} onPlay={() => setPlayer(videos.findIndex((v) => v.id === fav.data?.id))} />
            ))}
          </ul>
        </div>
      )}

      <AnimatePresence>
        {player !== null && player >= 0 && videos[player] && <VideoPlayer videos={videos} index={player} onIndexChange={setPlayer} onClose={() => setPlayer(null)} />}
      </AnimatePresence>
    </Page>
  )
}

function FavCard({ fav, onPlay }) {
  const { Icon, color } = TYPE_STYLE[fav.type] ?? TYPE_STYLE.atelier
  const body = (
    <>
      {fav.thumb ? (
        <img src={fav.thumb} alt="" loading="lazy" className="aspect-[9/16] w-14 shrink-0 rounded-xl bg-line object-cover" />
      ) : (
        <span className={`grid size-11 shrink-0 place-items-center rounded-xl text-white ${color}`}>
          <Icon size={20} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-bold tracking-wide text-muted uppercase">{LABEL[fav.type] ?? fav.type}</span>
        <span className="line-clamp-3 block leading-snug font-bold">{fav.title}</span>
        {fav.sub && <span className="block truncate text-xs text-muted">{fav.sub}</span>}
        {fav.text && <span className="mt-1 line-clamp-3 block text-sm text-muted">{fav.text}</span>}
      </span>
    </>
  )
  const cls = 'flex min-w-0 flex-1 items-start gap-3 rounded-l-2xl p-3 text-left'
  let main
  if (fav.type === 'video' && fav.data) {
    main = (
      <button type="button" onClick={onPlay} className={cls}>
        {body}
      </button>
    )
  } else if (fav.to) {
    main = (
      <Link to={fav.to} className={cls}>
        {body}
      </Link>
    )
  } else if (fav.url) {
    main = (
      <a href={fav.url} target="_blank" rel="noopener noreferrer" className={cls}>
        {body}
      </a>
    )
  } else {
    main = <div className={cls}>{body}</div>
  }
  return (
    <li className="flex items-start rounded-2xl border border-line bg-card">
      {main}
      <div className="flex flex-col items-center py-1 pr-1">
        <FavButton item={fav} />
        {fav.url && fav.type !== 'article' && (
          <a href={fav.url} target="_blank" rel="noopener noreferrer" aria-label="Ouvrir le lien" className="grid size-10 place-items-center rounded-full text-muted hover:bg-line/50">
            <ExternalLink size={16} />
          </a>
        )}
      </div>
    </li>
  )
}
