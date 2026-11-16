import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { AlertTriangle, ArrowRight, CheckCircle2, RotateCcw, Trophy, X, XCircle, Zap } from 'lucide-react'
import { ALL_EN_LESSONS, findEnLesson } from '../../data/anglais/units.js'
import { buildExercises } from '../../lib/englishExercises.js'
import { completeEnglishLesson, setLastEnLesson } from '../../lib/english.js'
import { speak } from '../../lib/speech.js'
import { celebrate } from '../../lib/confetti.js'
import SpeakButton from './SpeakButton.jsx'
import { ChoiceExercise, OrderExercise, PairsExercise, SpeakExercise, TypeExercise } from './EnExercises.jsx'
import { unitStyle } from './unitStyle.js'

const COMPONENTS = { choice: ChoiceExercise, pairs: PairsExercise, order: OrderExercise, type: TypeExercise, speak: SpeakExercise }

// Page /anglais/:unitId/:lessonId
export default function EnglishLesson() {
  const { unitId, lessonId } = useParams()
  const lesson = findEnLesson(unitId, lessonId)
  if (!lesson) return <Navigate to="/anglais" replace />
  return <Player key={lesson.key} lesson={lesson} />
}

function Player({ lesson }) {
  const { color } = unitStyle(lesson.unit)
  const [exercises, setExercises] = useState(() => buildExercises(lesson))
  const nDiscover = lesson.items.length
  const totalSteps = nDiscover + exercises.length

  const [step, setStep] = useState(0)
  const [result, setResult] = useState(null) // { correct, note } après une réponse
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(0) // exercices comptés (hors exercices passés)
  const [xp, setXp] = useState(null)
  const saved = useRef(false)

  const isDiscover = step < nDiscover
  const isEnd = step >= totalSteps
  const exercise = !isDiscover && !isEnd ? exercises[step - nDiscover] : null
  const next = ALL_EN_LESSONS[ALL_EN_LESSONS.findIndex((l) => l.key === lesson.key) + 1] ?? null

  useEffect(() => {
    setLastEnLesson(lesson.key)
  }, [lesson.key])

  async function advance(finalScore = score, finalAnswered = answered) {
    setResult(null)
    setStep((s) => s + 1)
    if (step === totalSteps - 1 && !saved.current) {
      saved.current = true
      setXp(await completeEnglishLesson(lesson, finalScore, finalAnswered))
      if (finalAnswered && finalScore / finalAnswered >= 0.8) celebrate()
    }
  }

  function onAnswer(correct, extra = {}) {
    setResult({ correct, ...extra })
    setAnswered((a) => a + 1)
    if (correct) setScore((s) => s + 1)
    if (correct && exercise.type !== 'speak') speak(exercise.speakAfter ?? exercise.solution)
  }

  function restart() {
    saved.current = false
    setExercises(buildExercises(lesson))
    setStep(0)
    setScore(0)
    setAnswered(0)
    setXp(null)
    setResult(null)
  }

  const Exercise = exercise && COMPONENTS[exercise.type]

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))]">
      <header className="flex items-center gap-3">
        <Link to="/anglais" className="grid size-9 shrink-0 place-items-center rounded-full text-muted hover:bg-card" aria-label="Quitter la leçon">
          <X size={22} />
        </Link>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={step} aria-valuemax={totalSteps}>
          <motion.div className={`h-full rounded-full ${color.solid}`} initial={{ width: 0 }} animate={{ width: `${(step / totalSteps) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>
      </header>
      <p className={`mt-3 text-xs font-bold tracking-wider uppercase ${color.text}`}>
        {lesson.unit.title} · {lesson.title}
      </p>

      <main className="mt-4 flex-1 pb-56">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.18 }}>
            {isDiscover && <DiscoverCard item={lesson.items[step]} color={color} />}
            {Exercise && (
              <Exercise
                exercise={exercise}
                locked={result !== null}
                onAnswer={onAnswer}
                onSkip={() => advance()}
              />
            )}
            {isEnd && <End score={score} total={answered} xp={xp} next={next} onRestart={restart} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Barre du bas : "Continuer" pendant la découverte, correction après une réponse */}
      {isDiscover && (
        <footer className="fixed inset-x-0 bottom-0 border-t border-line bg-bg/95 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur">
          <div className="mx-auto max-w-xl">
            <button type="button" onClick={() => advance()} className={`h-12 w-full rounded-2xl font-bold text-white ${color.solid}`}>
              {step === nDiscover - 1 ? "C'est parti pour les exercices !" : 'Continuer'}
            </button>
          </div>
        </footer>
      )}
      <AnimatePresence>
        {result && exercise && (
          <motion.footer
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            exit={{ y: 120 }}
            className={`fixed inset-x-0 bottom-0 z-20 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] ${result.correct ? 'bg-emerald-950' : 'bg-red-950'}`}
            role="status"
          >
            <div className="mx-auto max-w-xl space-y-2">
              <p className={`flex items-center gap-2 text-lg font-extrabold ${result.correct ? 'text-emerald-300' : 'text-red-300'}`}>
                {result.correct ? <CheckCircle2 size={22} /> : <XCircle size={22} />}
                {result.correct ? (exercise.type === 'speak' ? 'Bonne prononciation !' : 'Bravo !') : 'Réponse attendue :'}
              </p>
              {!result.correct && exercise.type !== 'pairs' && (
                <p className="flex items-center gap-2 text-[15px] font-semibold text-white">
                  <SpeakButton text={exercise.speakAfter ?? exercise.solution} size="sm" />
                  {exercise.solution}
                </p>
              )}
              {result.note && <p className="text-sm text-white/80">{result.note}</p>}
              <button
                type="button"
                onClick={() => advance(score, answered)}
                className={`mt-1 h-12 w-full rounded-2xl font-bold text-white ${result.correct ? 'bg-emerald-500' : 'bg-red-500'}`}
                autoFocus
              >
                Continuer
              </button>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  )
}

// Carte de découverte d'un mot ou d'une phrase (lu automatiquement)
function DiscoverCard({ item, color }) {
  useEffect(() => {
    speak(item.en)
  }, [item.en])
  const isWord = Boolean(item.ex)
  return (
    <div className="space-y-4">
      <p className="text-xs font-bold tracking-wider text-muted uppercase">{isWord ? 'Nouveau mot' : 'Nouvelle phrase'}</p>
      <div className={`rounded-3xl p-5 ${color.soft}`}>
        <div className="flex items-start gap-3">
          <SpeakButton text={item.en} slow />
          <div className="min-w-0">
            <p className={`${isWord ? 'text-4xl' : 'text-2xl leading-snug'} font-extrabold`} lang="en">
              {isWord ? item.en : highlight(item.en, item.blank, color.text)}
            </p>
            <p className="mt-1 text-lg text-fg/85">{item.fr}</p>
          </div>
        </div>
      </div>
      {isWord && (
        <div className="rounded-2xl border border-line bg-card p-4">
          <p className="mb-1 text-xs font-bold tracking-wider text-muted uppercase">Exemple</p>
          <div className="flex items-start gap-2">
            <SpeakButton text={item.ex} size="sm" />
            <div>
              <p className="font-semibold" lang="en">
                {highlight(item.ex, item.en, color.text)}
              </p>
              <p className="text-sm text-muted">{item.exFr}</p>
            </div>
          </div>
        </div>
      )}
      {item.note && (
        <p className="flex gap-2 rounded-2xl bg-amber-400/10 p-3.5 text-sm leading-snug">
          <AlertTriangle size={18} className="shrink-0 text-amber-400" />
          {item.note}
        </p>
      )}
    </div>
  )
}

// Met en couleur le mot clé dans une phrase
function highlight(sentence, word, cls) {
  if (!word) return sentence
  const i = sentence.toLowerCase().indexOf(word.toLowerCase())
  if (i < 0) return sentence
  return (
    <>
      {sentence.slice(0, i)}
      <span className={cls}>{sentence.slice(i, i + word.length)}</span>
      {sentence.slice(i + word.length)}
    </>
  )
}

function End({ score, total, xp, next, onRestart }) {
  const ratio = total ? score / total : 1
  return (
    <div className="flex flex-col items-center pt-6 text-center">
      <motion.span
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 14 }}
        className="grid size-24 place-items-center rounded-full bg-amber-400 text-slate-900 shadow-lg shadow-amber-500/30"
      >
        <Trophy size={44} />
      </motion.span>
      <h2 className="mt-5 text-3xl font-extrabold">{ratio >= 0.8 ? 'Excellent !' : ratio >= 0.5 ? 'Well done!' : 'Keep going!'}</h2>
      <p className="mt-1 text-muted">Leçon terminée</p>
      <div className="mt-6 grid w-full grid-cols-2 gap-3">
        <div className="rounded-2xl border border-line bg-card p-4">
          <p className="text-xs text-muted">Score</p>
          <p className="text-2xl font-extrabold">
            {score} / {total}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-4">
          <p className="text-xs text-muted">Gagné</p>
          <p className="flex items-center justify-center gap-1 text-2xl font-extrabold text-amber-400">
            <Zap size={20} className="fill-amber-400" />
            {xp === null ? '…' : `+${xp} XP`}
          </p>
        </div>
      </div>
      <div className="mt-8 w-full space-y-2.5">
        {next && (
          <Link to={`/anglais/${next.key}`} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-500 font-bold text-white">
            Leçon suivante <ArrowRight size={18} />
          </Link>
        )}
        <button type="button" onClick={onRestart} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-line bg-card font-bold">
          <RotateCcw size={18} /> Refaire la leçon
        </button>
        <Link to="/anglais" className="block py-2 text-sm font-semibold text-muted">
          Retour au parcours
        </Link>
      </div>
    </div>
  )
}
