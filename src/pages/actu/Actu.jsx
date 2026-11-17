import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Newspaper, PlaySquare, RotateCw } from 'lucide-react'
import Page from '../../components/Page.jsx'
import { XP_PER_SHORT, recentVideos, useNews, useSeen } from '../../lib/news.js'
import { timeAgo } from '../../lib/dates.js'
import ThemeChips from './ThemeChips.jsx'
import ShortsGrid from './ShortsGrid.jsx'
import NewsList from './NewsList.jsx'
import VideoPlayer from './VideoPlayer.jsx'

const WEEK = 7 * 24 // heures

function Skeleton({ view }) {
  return view === 'videos' ? (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {[0, 1, 2, 3].map((n) => (
        <div key={n} className="aspect-[9/16] animate-pulse rounded-2xl bg-card" />
      ))}
    </div>
  ) : (
    <div className="space-y-3">
      {[0, 1, 2, 3].map((n) => (
        <div key={n} className="h-24 animate-pulse rounded-3xl bg-card" />
      ))}
    </div>
  )
}

export default function Actu() {
  const news = useNews()
  const seen = useSeen()
  const [view, setView] = useState('videos') // 'videos' ou 'articles'
  const [theme, setTheme] = useState('all')
  const [player, setPlayer] = useState(null) // { videos, index } quand une vidéo est ouverte

  const matches = (item) => theme === 'all' || item.themes.includes(theme)
  const shorts = recentVideos(news.items, WEEK).filter(matches)
  const articles = news.items.filter((i) => i.kind === 'article' && matches(i)).slice(0, 50)

  const views = [
    { id: 'videos', label: 'Vidéos', icon: PlaySquare, count: shorts.length },
    { id: 'articles', label: 'Articles', icon: Newspaper, count: articles.length },
  ]

  return (
    <Page wide>
      <div className="space-y-4">
        <header className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Actu</h1>
            <p className="text-sm text-muted">
              {news.updatedAt ? `Mis à jour ${timeAgo(new Date(news.updatedAt))}` : 'Supply chain, éco et tech'}
            </p>
          </div>
          <button
            type="button"
            onClick={news.refresh}
            disabled={news.status !== 'ready'}
            className="mt-1 grid size-9 place-items-center rounded-full border border-line bg-card"
            aria-label="Actualiser"
          >
            <RotateCw size={16} className={news.status === 'ready' ? '' : 'animate-spin'} />
          </button>
        </header>

        {/* Choix Vidéos / Articles */}
        <div className="grid grid-cols-2 gap-1 rounded-2xl border border-line bg-card p-1" role="tablist">
          {views.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={view === id}
              onClick={() => setView(id)}
              className={`relative flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition-colors ${
                view === id ? 'text-white' : 'text-muted'
              }`}
            >
              {view === id && <motion.span layoutId="actu-view" className="absolute inset-0 rounded-xl bg-violet-500" />}
              <Icon size={16} className="relative" />
              <span className="relative">
                {label}
                {news.status !== 'loading' && <span className="ml-1 opacity-70">{count}</span>}
              </span>
            </button>
          ))}
        </div>

        <ThemeChips value={theme} onChange={setTheme} />

        {view === 'videos' && (
          <p className="text-xs text-muted">
            Les vidéos de la semaine · <span className="font-bold">EN</span> = sous-titres en français · +
            {XP_PER_SHORT} XP par vidéo vue
          </p>
        )}

        {news.status === 'loading' ? (
          <Skeleton view={view} />
        ) : view === 'videos' ? (
          <ShortsGrid shorts={shorts} seen={seen} onOpen={(index) => setPlayer({ videos: shorts, index })} />
        ) : (
          <NewsList items={articles} />
        )}
      </div>

      <AnimatePresence>
        {player && (
          <VideoPlayer
            videos={player.videos}
            index={player.index}
            onIndexChange={(index) => setPlayer((p) => ({ ...p, index }))}
            onClose={() => setPlayer(null)}
          />
        )}
      </AnimatePresence>
    </Page>
  )
}
