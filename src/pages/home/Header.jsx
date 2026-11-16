import { useEffect, useRef } from 'react'
import { useAnimate } from 'motion/react'
import { Moon, Sun } from 'lucide-react'
import { longDate } from '../../lib/dates.js'
import { useTheme } from '../../lib/theme.js'
import Flame from './Flame.jsx'

export default function Header({ streak }) {
  const { theme, toggle } = useTheme()
  const now = new Date()
  const greeting = now.getHours() >= 18 ? 'Bonsoir !' : 'Bonjour !'

  // Quand la série augmente, le badge flamme fait un petit "saut"
  const [scope, animate] = useAnimate()
  const previous = useRef(streak)
  useEffect(() => {
    if (streak > previous.current) {
      animate(scope.current, { scale: [1, 1.4, 1] }, { duration: 0.6 })
    }
    previous.current = streak
  }, [streak, animate, scope])

  return (
    <header className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm text-muted">{longDate(now)}</p>
        <h1 className="text-3xl font-extrabold tracking-tight">{greeting}</h1>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <div
          ref={scope}
          className="flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 font-bold text-orange-400"
          aria-label={`Série de ${streak} jours`}
        >
          <Flame size={16} />
          {streak}
        </div>
        <button
          type="button"
          onClick={toggle}
          className="grid size-9 place-items-center rounded-full border border-line bg-card text-fg transition-transform active:scale-90"
          aria-label={theme === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre'}
        >
          {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </header>
  )
}
