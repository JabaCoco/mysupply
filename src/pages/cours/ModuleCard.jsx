import { Link } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { Check, ChevronDown, ChevronRight } from 'lucide-react'
import { moduleStyle } from './moduleStyle.js'

// Carte d'un module : en-tête cliquable + liste de ses leçons (dépliable)
// `selected` (true / false) : mode « liste à gauche » du grand écran (le détail s'affiche à droite) → pas de dépliage, une flèche et un contour.
export default function ModuleCard({ module, number, progress, open, onToggle, selected }) {
  const { Icon, color } = moduleStyle(module)
  const stats = progress.modules[module.id]
  const complete = stats.done === stats.total

  return (
    <section className={`overflow-hidden rounded-3xl border bg-card ${selected ? 'border-violet-500 ring-1 ring-violet-500/60' : 'border-line'}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={selected === undefined ? open : undefined}
        aria-current={selected ? 'true' : undefined}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <span className={`grid size-12 shrink-0 place-items-center rounded-2xl text-white ${color.solid}`}>
          {complete ? <Check size={22} strokeWidth={3} /> : <Icon size={22} />}
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block text-xs font-semibold ${color.text}`}>Module {number}</span>
          <span className="block leading-snug font-bold">{module.title}</span>
          <span className="mt-1.5 flex items-center gap-2">
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
              <span
                className={`block h-full rounded-full ${color.solid}`}
                style={{ width: `${(stats.done / stats.total) * 100}%` }}
              />
            </span>
            <span className="text-xs text-muted">
              {stats.done}/{stats.total}
            </span>
          </span>
        </span>
        {selected === undefined ? (
          <ChevronDown size={20} className={`shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
        ) : (
          <ChevronRight size={20} className={`shrink-0 ${selected ? 'text-violet-400' : 'text-muted'}`} />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ol
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-line"
          >
            {module.lessons.map((lesson, i) => {
              const key = `${module.id}/${lesson.id}`
              const result = progress.byKey.get(key)
              const isNext = progress.next?.key === key
              return (
                <li key={key}>
                  <Link
                    to={`/cours/${key}`}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-line/40 ${isNext ? color.soft : ''}`}
                  >
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${
                        result ? `${color.solid} text-white` : `border-2 ${isNext ? color.border : 'border-line'} text-muted`
                      }`}
                    >
                      {result ? <Check size={16} strokeWidth={3} /> : i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm leading-snug font-semibold">{lesson.title}</span>
                      <span className="text-xs text-muted">
                        {lesson.minutes} min
                        {result && ` · meilleur score ${result.bestScore}/${result.total}`}
                        {isNext && !result && ' · à faire'}
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </motion.ol>
        )}
      </AnimatePresence>
    </section>
  )
}
