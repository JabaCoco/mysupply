import { useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'motion/react'
import { ArrowRight, GraduationCap } from 'lucide-react'
import Page from '../../components/Page.jsx'
import { MODULES } from '../../data/courses/index.js'
import { useCourseProgress } from '../../lib/courses.js'
import { moduleStyle } from './moduleStyle.js'
import ModuleCard from './ModuleCard.jsx'

export default function Cours() {
  const progress = useCourseProgress()
  // Module ouvert par l'utilisateur ; sinon, celui de la prochaine leçon
  const [openId, setOpenId] = useState(undefined)
  if (!progress) return null

  const { next, doneCount, total } = progress
  const currentOpen = openId === undefined ? next?.module.id : openId

  return (
    <Page>
      <div className="space-y-4">
        <header>
          <h1 className="text-3xl font-extrabold tracking-tight">Cours</h1>
          <p className="text-sm text-muted">
            {doneCount} / {total} leçons terminées
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
            <motion.div
              className="h-full rounded-full bg-violet-500"
              initial={{ width: 0 }}
              animate={{ width: `${(doneCount / total) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </header>

        {next ? <ContinueCard lesson={next} /> : <AllDone />}

        <h2 className="pt-1 font-bold">Programme</h2>
        <div className="space-y-3">
          {MODULES.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              number={index + 1}
              progress={progress}
              open={currentOpen === module.id}
              onToggle={() => setOpenId(currentOpen === module.id ? null : module.id)}
            />
          ))}
        </div>
      </div>
    </Page>
  )
}

// Grande carte "Continuer" vers la prochaine leçon
function ContinueCard({ lesson }) {
  const { Icon, color } = moduleStyle(lesson.module)
  return (
    <Link
      to={`/cours/${lesson.key}`}
      className={`flex items-center gap-4 rounded-3xl p-5 text-white shadow-lg transition-transform active:scale-[0.98] ${color.solid}`}
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/20">
        <Icon size={24} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold tracking-wider text-white/80 uppercase">Continuer · {lesson.module.short}</span>
        <span className="block text-lg leading-snug font-extrabold">{lesson.title}</span>
        <span className="text-xs text-white/80">{lesson.minutes} min · {lesson.cards.length} cartes + quiz</span>
      </span>
      <ArrowRight size={22} className="shrink-0" />
    </Link>
  )
}

function AllDone() {
  return (
    <div className="flex items-center gap-4 rounded-3xl border border-line bg-card p-5">
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-amber-400 text-slate-900">
        <GraduationCap size={24} />
      </span>
      <p className="text-sm">
        <span className="block font-bold">Bravo, programme terminé !</span>
        <span className="text-muted">Refais les leçons pour améliorer tes scores.</span>
      </p>
    </div>
  )
}
