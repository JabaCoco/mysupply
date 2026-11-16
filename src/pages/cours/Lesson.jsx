import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, X } from 'lucide-react'
import { ALL_LESSONS, findLesson } from '../../data/courses/index.js'
import { completeLesson, setLastLesson } from '../../lib/courses.js'
import { celebrate } from '../../lib/confetti.js'
import { drawQuiz } from '../../lib/quiz.js'
import { moduleStyle } from './moduleStyle.js'
import LessonCard from './LessonCard.jsx'
import QuizQuestion from './QuizQuestion.jsx'
import LessonEnd from './LessonEnd.jsx'

// Page /cours/:moduleId/:lessonId
export default function Lesson() {
  const { moduleId, lessonId } = useParams()
  const lesson = findLesson(moduleId, lessonId)
  if (!lesson) return <Navigate to="/cours" replace />
  // key : on repart de zéro quand on change de leçon
  return <LessonPlayer key={lesson.key} lesson={lesson} />
}

// Animation de glissement entre deux étapes (vers la gauche quand on avance)
const slide = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
}

function LessonPlayer({ lesson }) {
  const { color } = moduleStyle(lesson.module)
  const nCards = lesson.cards.length
  // 5 questions tirées au hasard dans la banque de la leçon (les questions de calcul ont des chiffres aléatoires)
  const [quiz, setQuiz] = useState(() => drawQuiz(lesson.quiz))
  const nQuiz = quiz.length
  const totalSteps = nCards + nQuiz // + l'écran de fin

  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [score, setScore] = useState(0)
  const [xp, setXp] = useState(null)
  const saved = useRef(false)

  const nextLesson = ALL_LESSONS[ALL_LESSONS.findIndex((l) => l.key === lesson.key) + 1] ?? null
  const isCard = step < nCards
  const isEnd = step >= totalSteps

  useEffect(() => {
    setLastLesson(lesson.key)
  }, [lesson.key])

  function go(delta) {
    setDirection(delta)
    setStep((s) => Math.min(Math.max(s + delta, 0), totalSteps))
  }

  async function answer(correct) {
    const newScore = score + (correct ? 1 : 0)
    setScore(newScore)
    go(1)
    if (step === totalSteps - 1 && !saved.current) {
      saved.current = true
      setXp(await completeLesson(lesson.key, newScore, nQuiz))
      if (newScore / nQuiz >= 0.8) celebrate()
    }
  }

  function restart() {
    saved.current = false
    setQuiz(drawQuiz(lesson.quiz))
    setScore(0)
    setXp(null)
    setDirection(-1)
    setStep(0)
  }

  // Balayer une carte du doigt : vers la gauche = suivante, vers la droite = précédente
  function onDragEnd(_, info) {
    if (info.offset.x < -80) go(1)
    else if (info.offset.x > 80 && step > 0) go(-1)
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
      {/* En-tête : fermer + barre de progression */}
      <header className="flex items-center gap-3">
        <Link to="/cours" className="grid size-9 shrink-0 place-items-center rounded-full text-muted hover:bg-card" aria-label="Quitter la leçon">
          <X size={22} />
        </Link>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={step} aria-valuemax={totalSteps}>
          <motion.div
            className={`h-full rounded-full ${isCard ? color.solid : 'bg-emerald-500'}`}
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </header>
      <p className={`mt-3 text-xs font-bold tracking-wider uppercase ${color.text}`}>
        {lesson.module.short} · {lesson.title}
      </p>

      {/* Contenu de l'étape */}
      <main className="relative mt-4 flex flex-1 flex-col overflow-x-hidden">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
            drag={isCard ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={isCard ? onDragEnd : undefined}
            className="flex flex-1 flex-col"
          >
            {isCard && <LessonCard card={lesson.cards[step]} color={color} />}
            {!isCard && !isEnd && (
              <QuizQuestion
                question={quiz[step - nCards]}
                number={step - nCards + 1}
                total={nQuiz}
                onNext={answer}
              />
            )}
            {isEnd && <LessonEnd score={score} total={nQuiz} xp={xp} nextLesson={nextLesson} onRestart={restart} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Boutons des cartes */}
      {isCard && (
        <footer className="flex items-center gap-2 pt-5">
          {step > 0 && (
            <button
              type="button"
              onClick={() => go(-1)}
              className="grid size-12 shrink-0 place-items-center rounded-2xl border border-line bg-card"
              aria-label="Carte précédente"
            >
              <ChevronLeft size={22} />
            </button>
          )}
          <button type="button" onClick={() => go(1)} className={`h-12 flex-1 rounded-2xl font-bold text-white ${color.solid}`}>
            {step === nCards - 1 ? 'Passer au quiz' : 'Continuer'}
          </button>
        </footer>
      )}
    </div>
  )
}
