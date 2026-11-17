import { useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'motion/react'
import { ArrowRight, Check, GraduationCap } from 'lucide-react'
import { useMedia } from '../../lib/useMedia.js'
import Page from '../../components/Page.jsx'
import { MODULES } from '../../data/courses/index.js'
import { useCourseProgress } from '../../lib/courses.js'
import { moduleStyle } from './moduleStyle.js'
import ModuleCard from './ModuleCard.jsx'

export default function Cours() {
  const progress = useCourseProgress()
  // Module ouvert par l'utilisateur ; sinon, celui de la prochaine leçon
  const [openId, setOpenId] = useState(undefined)
  // Grand écran : module affiché à droite (par défaut, celui de la prochaine leçon)
  const isWide = useMedia('(min-width: 1024px)')
  const [pickedId, setPickedId] = useState(undefined)
  if (!progress) return null

  const { next, doneCount, total } = progress
  const currentOpen = openId === undefined ? next?.module.id : openId
  const selectedId = pickedId ?? next?.module.id ?? MODULES[0].id

  return (
    <Page full>
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

        {isWide ? (
          // Grand écran : la liste des modules à gauche, le module choisi (ses leçons) à droite
          <div className="grid grid-cols-[minmax(18rem,24rem)_1fr] items-start gap-6">
            <nav aria-label="Modules" className="sticky top-6 max-h-[calc(100dvh-3rem)] space-y-3 overflow-y-auto pr-1">
              {MODULES.map((module, index) => (
                <ModuleCard key={module.id} module={module} number={index + 1} progress={progress} selected={selectedId === module.id} onToggle={() => setPickedId(module.id)} />
              ))}
            </nav>
            <div className="space-y-4">
              {next ? <ContinueCard lesson={next} /> : <AllDone />}
              <ModuleDetail module={MODULES.find((m) => m.id === selectedId)} number={MODULES.findIndex((m) => m.id === selectedId) + 1} progress={progress} />
            </div>
          </div>
        ) : (
          <>
            {next ? <ContinueCard lesson={next} /> : <AllDone />}

            <h2 className="pt-1 font-bold">Programme</h2>
            <div className="space-y-3 md:grid md:grid-cols-2 md:items-start md:gap-3 md:space-y-0">
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
          </>
        )}
      </div>
    </Page>
  )
}

// Détail d'un module (grand écran) : ses leçons en cartes, sur une ou deux colonnes
function ModuleDetail({ module, number, progress }) {
  const { Icon, color } = moduleStyle(module)
  const stats = progress.modules[module.id]
  return (
    <section className="rounded-3xl border border-line bg-card p-5">
      <div className="flex items-center gap-4">
        <span className={`grid size-14 shrink-0 place-items-center rounded-2xl text-white ${color.solid}`}>
          <Icon size={26} />
        </span>
        <div className="min-w-0 flex-1">
          <p className={`text-xs font-semibold ${color.text}`}>Module {number}</p>
          <h2 className="text-xl leading-snug font-extrabold">{module.title}</h2>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-line">
              <span className={`block h-full rounded-full ${color.solid}`} style={{ width: `${(stats.done / stats.total) * 100}%` }} />
            </span>
            <span className="text-xs text-muted">
              {stats.done}/{stats.total} leçons
            </span>
          </div>
        </div>
      </div>
      <ol className="mt-4 grid gap-2 xl:grid-cols-2">
        {module.lessons.map((lesson, i) => {
          const key = `${module.id}/${lesson.id}`
          const result = progress.byKey.get(key)
          const isNext = progress.next?.key === key
          return (
            <li key={key}>
              <Link to={`/cours/${key}`} className={`flex h-full items-center gap-3 rounded-2xl border p-3 transition-colors hover:bg-line/40 ${isNext ? `${color.soft} ${color.border}` : 'border-line'}`}>
                <span className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold ${result ? `${color.solid} text-white` : `border-2 ${isNext ? color.border : 'border-line'} text-muted`}`}>
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
                <ArrowRight size={16} className="shrink-0 text-muted" />
              </Link>
            </li>
          )
        })}
      </ol>
    </section>
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
