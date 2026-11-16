import { Link } from 'react-router'
import { motion } from 'motion/react'
import { ArrowRight, RotateCcw, Trophy, Zap } from 'lucide-react'

// Écran de fin de leçon : score, XP gagnés, et suite
export default function LessonEnd({ score, total, xp, nextLesson, onRestart }) {
  const ratio = score / total
  const message = ratio >= 0.8 ? 'Excellent !' : ratio >= 0.5 ? 'Bien joué !' : 'Continue, ça va venir !'

  return (
    <div className="flex min-h-full flex-col items-center text-center">
      <motion.span
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 14 }}
        className="mt-6 grid size-24 place-items-center rounded-full bg-amber-400 text-slate-900 shadow-lg shadow-amber-500/30"
      >
        <Trophy size={44} />
      </motion.span>

      <h2 className="mt-5 text-3xl font-extrabold">{message}</h2>
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

      <div className="mt-auto w-full space-y-2.5 pt-8">
        {nextLesson && (
          <Link
            to={`/cours/${nextLesson.key}`}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-violet-500 font-bold text-white"
          >
            Leçon suivante <ArrowRight size={18} />
          </Link>
        )}
        <button
          type="button"
          onClick={onRestart}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-line bg-card font-bold"
        >
          <RotateCcw size={18} /> Refaire la leçon
        </button>
        <Link to="/cours" className="block py-2 text-sm font-semibold text-muted">
          Retour aux cours
        </Link>
      </div>
    </div>
  )
}
