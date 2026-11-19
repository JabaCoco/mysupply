import { useState } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { BookOpen, CheckCircle2, ChevronDown, Lightbulb, PenLine, RotateCcw, Sigma, Trophy, XCircle, Zap } from 'lucide-react'
import Page from '../../../components/Page.jsx'
import SubHeader from '../../../components/SubHeader.jsx'
import RichText from '../../../components/RichText.jsx'
import { findBiLesson, generateBiExercises } from '../../../data/atelier/bi/index.js'
import { checkBiNumber, formatBiAnswer } from '../../../data/atelier/bi/helpers.js'
import { recordBiExercise } from '../../../lib/atelier.js'
import { celebrate } from '../../../lib/confetti.js'
import { Code, DataTable, SimulationNotice } from './shared.jsx'

const TABS = [
  { id: 'cours', label: 'Mini-cours', icon: BookOpen },
  { id: 'exercices', label: 'Exercices', icon: PenLine },
]

// Une leçon (/atelier/bi/cours/:id?onglet=cours|exercices)
export default function BiLesson() {
  const { id } = useParams()
  const [params, setParams] = useSearchParams()
  const lesson = findBiLesson(id)
  if (!lesson) return <Navigate to="/atelier/bi" replace />
  const tab = TABS.some((t) => t.id === params.get('onglet')) ? params.get('onglet') : 'cours'
  const go = (t) => {
    setParams({ onglet: t }, { replace: true })
    window.scrollTo({ top: 0 })
  }
  return (
    <Page>
      <SubHeader back="/atelier/bi" title={lesson.title} subtitle={lesson.track === 'pq' ? 'Power Query' : 'Power BI'} />
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-2xl border border-line bg-card p-1" role="tablist">
        {TABS.map(({ id: t, label, icon: Icon }) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => go(t)}
            className={`relative flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-semibold ${tab === t ? 'text-white' : 'text-muted'}`}
          >
            {tab === t && <motion.span layoutId="bi-tab" className="absolute inset-0 rounded-xl bg-violet-500" />}
            <Icon size={15} className="relative" />
            <span className="relative">{label}</span>
          </button>
        ))}
      </div>
      {tab === 'cours' ? <Course lesson={lesson} onStart={() => go('exercices')} /> : <Exercises key={lesson.id} lesson={lesson} />}
    </Page>
  )
}

// Rappel des points clés (cours ET indice des exercices)
function Recall({ recall }) {
  return (
    <dl className="space-y-1.5">
      {recall.map(([term, meaning]) => (
        <div key={term} className="flex gap-3 text-sm leading-snug">
          <dt className="w-28 shrink-0 font-bold text-violet-400">{term}</dt>
          <dd className="text-fg/85">{meaning}</dd>
        </div>
      ))}
    </dl>
  )
}

function Course({ lesson, onStart }) {
  const { course } = lesson
  return (
    <div className="space-y-5">
      <RichText text={course.purpose} className="rounded-2xl border border-line bg-card p-4 text-[15px] leading-relaxed text-fg/90" />
      {course.sections.map((s) => (
        <section key={s.title} className="space-y-2">
          <h2 className="text-lg font-extrabold">{s.title}</h2>
          <RichText text={s.text} className="text-[15px] leading-relaxed text-fg/85" />
          {s.code && <Code>{s.code}</Code>}
        </section>
      ))}
      <section>
        <h2 className="mb-2 flex items-center gap-2 text-lg font-extrabold">
          <Sigma size={20} className="text-muted" /> À retenir
        </h2>
        <div className="rounded-2xl border-2 border-violet-500 bg-card p-3">
          <Recall recall={course.recall} />
        </div>
      </section>
      <SimulationNotice />
      <button type="button" onClick={onStart} className="h-12 w-full rounded-2xl bg-violet-500 font-bold text-white">
        Passer aux exercices
      </button>
    </div>
  )
}

function Exercises({ lesson }) {
  const [series, setSeries] = useState(() => generateBiExercises(lesson.id))
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [xpTotal, setXpTotal] = useState(0)
  const finished = index >= series.length

  async function onAnswered(correct) {
    if (correct) setScore((s) => s + 1)
    const xp = await recordBiExercise(lesson.id, correct)
    setXpTotal((t) => t + xp)
  }

  function newSeries() {
    setSeries(generateBiExercises(lesson.id))
    setIndex(0)
    setScore(0)
    setXpTotal(0)
  }

  if (finished) {
    return (
      <div className="space-y-4 text-center">
        <Trophy size={48} className="mx-auto text-amber-400" />
        <p className="text-3xl font-extrabold">
          {score} / {series.length}
        </p>
        <p className="text-muted">{score === series.length ? 'Sans faute, bravo !' : score >= series.length / 2 ? 'Bien joué, continue à t’entraîner.' : 'Relis le mini-cours et retente une série.'}</p>
        {xpTotal > 0 && (
          <p className="flex items-center justify-center gap-1 font-extrabold text-amber-400">
            <Zap size={18} className="fill-amber-400" />+{xpTotal} XP
          </p>
        )}
        <button type="button" onClick={newSeries} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-violet-500 font-bold text-white">
          <RotateCcw size={18} /> Nouvelle série (nouvelles données)
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5" aria-label={`Exercice ${index + 1} sur ${series.length}`}>
        {series.map((_, i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= index ? 'bg-violet-500' : 'bg-line'}`} />
        ))}
      </div>
      <Exercise
        key={`${index}-${series[index].statement}-${series[index].question}`}
        exercise={series[index]}
        number={index + 1}
        total={series.length}
        recall={lesson.course.recall}
        onAnswered={onAnswered}
        onNext={() => {
          setIndex((i) => i + 1)
          if (index === series.length - 1 && score === series.length) celebrate()
        }}
      />
    </div>
  )
}

function Exercise({ exercise, number, total, recall, onAnswered, onNext }) {
  const [value, setValue] = useState('')
  const [choice, setChoice] = useState(null)
  const [result, setResult] = useState(null)
  const [hint, setHint] = useState(false)
  const [invalid, setInvalid] = useState(false)

  function validate(event) {
    event?.preventDefault()
    let correct
    if (exercise.kind === 'choice') {
      if (choice === null) return
      correct = choice === exercise.answer
    } else {
      correct = checkBiNumber(value, exercise)
      if (correct === null) {
        setInvalid(true)
        return
      }
    }
    setInvalid(false)
    setResult(correct)
    onAnswered(correct)
  }

  const answered = result !== null

  return (
    <form onSubmit={validate} className="space-y-3">
      <p className="text-xs font-bold tracking-wider text-violet-400 uppercase">
        Exercice {number} / {total}
      </p>
      <p className="text-[15px] leading-snug">{exercise.statement}</p>
      {exercise.tables.map((t, i) => (
        <DataTable key={i} title={t.title} cols={t.cols} rows={t.rows} small />
      ))}
      {exercise.code && <Code>{exercise.code}</Code>}
      <p className="text-lg leading-snug font-extrabold">{exercise.question}</p>

      {exercise.kind === 'number' ? (
        <label className="flex items-center rounded-2xl border-2 border-line bg-card focus-within:border-violet-500">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={answered}
            inputMode="decimal"
            autoComplete="off"
            placeholder="Ta réponse"
            className="h-12 min-w-0 flex-1 bg-transparent px-4 text-lg font-bold outline-none"
            aria-label="Ta réponse"
          />
          <span className="pr-4 text-sm text-muted">{exercise.unit}</span>
        </label>
      ) : (
        <ul className="space-y-2">
          {exercise.choices.map((text, i) => {
            const tone = !answered
              ? choice === i
                ? 'border-violet-500 bg-violet-500/10'
                : 'border-line bg-card'
              : i === exercise.answer
                ? 'border-emerald-500 bg-emerald-500/15'
                : i === choice
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-line bg-card opacity-50'
            return (
              <li key={text}>
                <button type="button" disabled={answered} onClick={() => setChoice(i)} className={`w-full rounded-2xl border-2 p-3 text-left text-[15px] leading-snug font-semibold ${tone}`}>
                  {text}
                </button>
              </li>
            )
          })}
        </ul>
      )}
      {invalid && <p className="text-sm text-red-400">Écris un nombre (la virgule est acceptée).</p>}

      {/* Rappel / indice : les points clés du mini-cours, sans la réponse */}
      {!answered && (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5">
          <button type="button" onClick={() => setHint((h) => !h)} aria-expanded={hint} className="flex w-full items-center gap-2 p-3 text-sm font-semibold text-amber-400">
            <Lightbulb size={18} /> Rappel / indice
            <ChevronDown size={18} className={`ml-auto transition-transform ${hint ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence initial={false}>
            {hint && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="px-3 pb-3">
                  <Recall recall={recall} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {!answered ? (
        <button type="submit" className="h-12 w-full rounded-2xl bg-violet-500 font-bold text-white disabled:opacity-50" disabled={exercise.kind === 'choice' ? choice === null : !value.trim()}>
          Valider
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className={`rounded-2xl p-4 ${result ? 'bg-emerald-500/15' : 'bg-red-500/10'}`} role="status">
            <p className={`flex items-center gap-2 font-extrabold ${result ? 'text-emerald-400' : 'text-red-400'}`}>
              {result ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
              {result ? 'Bonne réponse !' : 'Pas tout à fait…'}
            </p>
            <p className="mt-1 text-sm">
              Réponse attendue : <span className="font-bold">{formatBiAnswer(exercise)}</span>
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-card p-4">
            <p className="mb-2 text-xs font-bold tracking-wider text-muted uppercase">Correction détaillée</p>
            <ol className="space-y-1.5">
              {exercise.steps.map((step, i) => (
                <li key={step} className="flex gap-2 text-[14px] leading-relaxed">
                  <span className="shrink-0 font-bold text-violet-400">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            {exercise.conclusion && <p className="mt-2 text-sm leading-snug font-semibold">{exercise.conclusion}</p>}
          </div>
          <button type="button" onClick={onNext} className="h-12 w-full rounded-2xl bg-violet-500 font-bold text-white">
            {number === total ? 'Voir mon score' : 'Exercice suivant'}
          </button>
        </motion.div>
      )}
    </form>
  )
}
