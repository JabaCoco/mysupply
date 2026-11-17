import { useEffect, useRef } from 'react'
import Page from '../../components/Page.jsx'
import { celebrate } from '../../lib/confetti.js'
import { markCelebrated, useProgress } from '../../lib/progress.js'
import { recentShorts, useNews, useSeen } from '../../lib/news.js'
import Header from './Header.jsx'
import FlashTicker from './FlashTicker.jsx'
import CafeCard from './CafeCard.jsx'
import GoalCard from './GoalCard.jsx'
import WeekCalendar from './WeekCalendar.jsx'
import ResumeCard from './ResumeCard.jsx'
import QuickGrid from './QuickGrid.jsx'
import FigureCard from './FigureCard.jsx'
import ArticleCard from './ArticleCard.jsx'

export default function Home() {
  const progress = useProgress()
  const news = useNews()
  const seen = useSeen()

  // Confettis une seule fois par jour, au moment où l'objectif est atteint
  const hasCelebrated = useRef(false)
  const shouldCelebrate = progress?.goalReached && !progress.celebrated
  const todayKey = progress?.todayKey
  useEffect(() => {
    if (!shouldCelebrate || hasCelebrated.current) return
    hasCelebrated.current = true
    celebrate()
    markCelebrated(todayKey)
  }, [shouldCelebrate, todayKey])

  if (!progress) return null

  // news.items est déjà trié du plus récent au plus ancien
  const articles = news.items.filter((i) => i.kind === 'article')
  const loading = news.status === 'loading'

  // Article du jour : le plus récent de Supply Chain Magazine, sinon les autres sites en secours
  const article =
    ['scm', 'wk', 'scdive', 'lemonde-eco']
      .map((id) => articles.find((a) => a.sourceId === id))
      .find(Boolean) ?? null

  // Flash info : les 8 titres d'articles les plus récents
  const flash = articles.filter((a) => a !== article).slice(0, 8)

  return (
    <Page wide>
      <div className="space-y-4">
        <Header streak={progress.streak} />
        <FlashTicker items={flash} />
        {/* Téléphone : une colonne (même ordre qu'avant). Grand écran : deux colonnes équilibrées. */}
        <div className="space-y-4 lg:columns-2 lg:gap-4 lg:space-y-0 lg:*:mb-4 lg:*:break-inside-avoid">
          <CafeCard shorts={recentShorts(news.items)} seen={seen} loading={loading} />
          <GoalCard xp={progress.todayXp} level={progress.level} goalReached={progress.goalReached} />
          <WeekCalendar week={progress.week} streak={progress.streak} />
          <ResumeCard />
          <QuickGrid />
          <FigureCard />
          <ArticleCard article={article} loading={loading} />
        </div>
      </div>
    </Page>
  )
}
