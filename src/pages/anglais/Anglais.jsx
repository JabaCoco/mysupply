import { Link } from 'react-router'
import { motion } from 'motion/react'
import { ArrowRight, BookA, Check, ChevronRight, GraduationCap, Mic } from 'lucide-react'
import Page from '../../components/Page.jsx'
import { ALL_EN_LESSONS, ALL_WORDS, LEVEL_LABELS, UNITS } from '../../data/anglais/units.js'
import { useEnglish } from '../../lib/english.js'
import { canListen } from '../../lib/speech.js'
import DailyWords from './DailyWords.jsx'
import { unitStyle } from './unitStyle.js'

export default function Anglais() {
  const en = useEnglish()
  if (!en) return null
  const doneCount = en.done.size

  return (
    <Page full>
      <div className="space-y-5">
        <header>
          <h1 className="text-3xl font-extrabold tracking-tight">Anglais</h1>
          <p className="text-sm text-muted">
            L'anglais de la supply chain · {en.learned} / {ALL_WORDS.length} mots vus · {doneCount} / {ALL_EN_LESSONS.length} leçons
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
            <motion.div className="h-full rounded-full bg-indigo-500" initial={{ width: 0 }} animate={{ width: `${(doneCount / ALL_EN_LESSONS.length) * 100}%` }} />
          </div>
        </header>

        {/* Écran large : les mots du jour sur toute la largeur, puis la suite du parcours et le lexique côte à côte */}
        <div className="space-y-5">
        <div className="min-w-0">
          <DailyWords words={en.dailyWords} status={en.status} />
        </div>
        <div className="space-y-5 lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-5 lg:space-y-0">
        {en.next ? (
          <Link to={`/anglais/${en.next.key}`} className="flex items-center gap-4 rounded-3xl bg-indigo-500 p-5 text-white shadow-lg transition-transform active:scale-[0.98]">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/20">
              <GraduationCap size={24} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold tracking-wider text-white/80 uppercase">Continuer · {en.next.unit.title}</span>
              <span className="block text-lg leading-snug font-extrabold">{en.next.title}</span>
              <span className="text-xs text-white/80">
                {LEVEL_LABELS[en.next.level]} · {en.next.items.length} {en.next.level === 3 ? 'phrases' : 'mots'} + 10 exercices
              </span>
            </span>
            <ArrowRight size={22} className="shrink-0" />
          </Link>
        ) : (
          <p className="rounded-3xl border border-line bg-card p-5 font-bold">Parcours terminé, well done ! Refais les leçons pour t'entraîner.</p>
        )}

        <Link to="/anglais/lexique" className="flex items-center gap-3 rounded-2xl border border-line bg-card p-4">
          <span className="grid size-10 place-items-center rounded-xl bg-indigo-500/15 text-indigo-400">
            <BookA size={20} />
          </span>
          <span className="flex-1">
            <span className="block font-bold">Mon lexique</span>
            <span className="text-xs text-muted">Tous tes mots, avec ceux à revoir</span>
          </span>
          <ChevronRight size={18} className="text-muted" />
        </Link>

        {!canListen() && (
          <p className="flex gap-2 rounded-2xl bg-amber-400/10 p-3 text-sm leading-snug lg:col-span-2">
            <Mic size={18} className="shrink-0 text-amber-400" />
            Ton navigateur ne gère pas la reconnaissance vocale : les exercices de prononciation pourront être passés. Pour les faire, utilise Chrome ou Edge.
          </p>
        )}
        </div>
        </div>

        <h2 className="font-bold">Le parcours</h2>
        <ol className="space-y-3 md:grid md:grid-cols-2 md:items-start md:gap-3 md:space-y-0 xl:grid-cols-3 2xl:grid-cols-4">
          {UNITS.map((unit, u) => {
            const { Icon, color } = unitStyle(unit)
            const lessonsDone = unit.lessons.filter((l) => en.done.has(`${unit.id}/${l.id}`)).length
            return (
              <li key={unit.id} className="overflow-hidden rounded-3xl border border-line bg-card">
                <div className="flex items-center gap-3 p-4">
                  <span className={`grid size-12 shrink-0 place-items-center rounded-2xl text-white ${color.solid}`}>
                    {lessonsDone === unit.lessons.length ? <Check size={22} strokeWidth={3} /> : <Icon size={22} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-semibold ${color.text}`}>
                      Unité {u + 1} · {LEVEL_LABELS[Math.max(...unit.lessons.map((l) => l.level))]}
                    </p>
                    <p className="font-bold">{unit.title}</p>
                  </div>
                  <span className="text-xs text-muted">
                    {lessonsDone}/{unit.lessons.length}
                  </span>
                </div>
                <ul className="border-t border-line">
                  {unit.lessons.map((lesson, i) => {
                    const key = `${unit.id}/${lesson.id}`
                    const result = en.byId.get(`lesson/${key}`)
                    const isNext = en.next?.key === key
                    return (
                      <li key={key}>
                        <Link to={`/anglais/${key}`} className={`flex items-center gap-3 px-4 py-3 hover:bg-line/40 ${isNext ? color.soft : ''}`}>
                          <span
                            className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${
                              result ? `${color.solid} text-white` : `border-2 ${isNext ? color.border : 'border-line'} text-muted`
                            }`}
                          >
                            {result ? <Check size={16} strokeWidth={3} /> : i + 1}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold">{lesson.title}</span>
                            <span className="text-xs text-muted">
                              {lesson.items
                                .slice(0, 3)
                                .map((it) => (it.ex ? it.en : `${it.en.split(' ').slice(0, 3).join(' ')}…`))
                                .join(' · ')}
                              {result && ` · meilleur score ${result.bestScore}/${result.total}`}
                            </span>
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
            )
          })}
        </ol>
      </div>
    </Page>
  )
}
