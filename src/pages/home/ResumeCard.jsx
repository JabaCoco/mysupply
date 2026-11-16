import { Link } from 'react-router'
import { ChevronRight, GraduationCap } from 'lucide-react'
import { MODULES } from '../../data/courses/index.js'
import { useCourseProgress } from '../../lib/courses.js'
import { moduleStyle } from '../cours/moduleStyle.js'

// Carte "Reprendre" : la prochaine leçon à faire, avec la progression de son module
export default function ResumeCard() {
  const progress = useCourseProgress()
  if (!progress) return null
  const { next } = progress

  if (!next) {
    return (
      <section>
        <h2 className="mb-2 font-bold">Reprendre</h2>
        <Link to="/cours" className="flex items-center gap-3 rounded-3xl border border-line bg-card p-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-amber-400 text-slate-900">
            <GraduationCap size={22} />
          </span>
          <span className="flex-1 font-bold">Programme terminé, bravo !</span>
          <ChevronRight size={20} className="shrink-0 text-muted" />
        </Link>
      </section>
    )
  }

  const { Icon, color } = moduleStyle(next.module)
  const moduleNumber = MODULES.indexOf(next.module) + 1
  const lessonNumber = next.module.lessons.findIndex((l) => l.id === next.id) + 1
  const stats = progress.modules[next.module.id]

  return (
    <section>
      <h2 className="mb-2 font-bold">Reprendre</h2>
      <Link
        to={`/cours/${next.key}`}
        className="flex items-center gap-3 rounded-3xl border border-line bg-card p-4 transition-transform active:scale-[0.98]"
      >
        <span className={`grid size-12 shrink-0 place-items-center rounded-2xl text-white ${color.solid}`}>
          <Icon size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <p className={`text-xs font-semibold ${color.text}`}>
            Module {moduleNumber} · {next.module.short}
          </p>
          <p className="truncate font-bold">
            Leçon {lessonNumber} : {next.title}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
            <div className={`h-full rounded-full ${color.solid}`} style={{ width: `${(stats.done / stats.total) * 100}%` }} />
          </div>
        </div>
        <ChevronRight size={20} className="shrink-0 text-muted" />
      </Link>
    </section>
  )
}
