import { motion } from 'motion/react'
import Flame from './Flame.jsx'

const LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

function circleClass(day) {
  if (day.done) return 'bg-orange-500 shadow-md shadow-orange-500/30'
  if (day.isToday) return 'border-2 border-dashed border-orange-400'
  if (day.isFuture) return 'bg-line/50'
  return 'border border-line bg-bg' // jour passé sans objectif
}

function dayLabel(day) {
  const name = day.date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric' })
  if (day.done) return `${name} : objectif atteint`
  if (day.isToday) return `${name} : aujourd'hui, objectif pas encore atteint`
  if (day.isFuture) return `${name} : à venir`
  return `${name} : objectif manqué`
}

// Calendrier de la semaine façon Duolingo : une flamme par jour d'objectif atteint
export default function WeekCalendar({ week, streak }) {
  return (
    <section className="rounded-3xl border border-line bg-card p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="font-bold">Ta semaine</h2>
        <p className="text-sm text-muted">
          <span className="font-bold text-orange-400">{streak}</span> jour{streak > 1 ? 's' : ''} de série
        </p>
      </div>

      <ol className="grid grid-cols-7 gap-1 text-center">
        {week.map((day, i) => (
          <li key={day.key} className="flex flex-col items-center gap-1.5" aria-label={dayLabel(day)}>
            <span className={`text-xs font-semibold ${day.isToday ? 'text-orange-400' : 'text-muted'}`}>
              {LETTERS[i]}
            </span>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 400, damping: 18 }}
              className={`grid size-9 place-items-center rounded-full ${circleClass(day)}`}
            >
              {day.done && (
                <Flame size={18} animated={day.isToday} iconClassName="fill-white text-white" />
              )}
              {!day.done && day.isToday && <span className="size-2 rounded-full bg-orange-400" />}
            </motion.span>
            <span className={`text-[10px] ${day.isToday ? 'font-bold text-fg' : 'text-muted'}`}>
              {day.date.getDate()}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
