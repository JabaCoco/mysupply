import { motion } from 'motion/react'
import { Zap } from 'lucide-react'
import { DAILY_GOAL, addXp } from '../../lib/progress.js'

const RADIUS = 24
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function GoalCard({ xp, level, goalReached }) {
  const ratio = Math.min(xp / DAILY_GOAL, 1)

  return (
    <section className="rounded-3xl border border-line bg-card p-4">
      <div className="flex items-center gap-4">
        {/* Anneau de progression */}
        <div className="relative size-14 shrink-0">
          <svg viewBox="0 0 56 56" className="size-full -rotate-90">
            <circle cx="28" cy="28" r={RADIUS} fill="none" strokeWidth="5" className="stroke-line" />
            <motion.circle
              cx="28"
              cy="28"
              r={RADIUS}
              fill="none"
              strokeWidth="5"
              strokeLinecap="round"
              className="stroke-amber-400"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - ratio) }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </svg>
          <Zap size={20} className="absolute inset-0 m-auto fill-amber-400 text-amber-400" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="font-bold">Objectif du jour</h2>
            <p className="text-sm">
              <span className="font-bold">{xp}</span>
              <span className="text-muted"> / {DAILY_GOAL} XP</span>
            </p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
            <motion.div
              className="h-full rounded-full bg-amber-400"
              initial={{ width: 0 }}
              animate={{ width: `${ratio * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-2 text-xs text-muted">
            Niveau {level} ·{' '}
            {goalReached ? 'objectif atteint, série sauvée !' : `encore ${DAILY_GOAL - xp} XP pour garder ta série`}
          </p>
        </div>
      </div>

      {/* Bouton de test, visible uniquement avec `npm run dev` */}
      {import.meta.env.DEV && (
        <button
          type="button"
          onClick={() => addXp(10)}
          className="mt-3 w-full rounded-xl border border-dashed border-line py-1.5 text-xs text-muted"
        >
          +10 XP (test, visible seulement en développement)
        </button>
      )}
    </section>
  )
}
