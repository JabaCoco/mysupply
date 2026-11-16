import { useState } from 'react'
import { motion } from 'motion/react'
import { CheckCircle2, XCircle } from 'lucide-react'

// Mélange les réponses pour que la bonne ne soit jamais toujours au même endroit
function shuffledIndexes(length) {
  const order = Array.from({ length }, (_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

// Une question de quiz : choix, correction, explication, puis bouton Continuer
export default function QuizQuestion({ question, number, total, onNext }) {
  const [order] = useState(() => shuffledIndexes(question.choices.length))
  const [selected, setSelected] = useState(null)
  const answered = selected !== null
  const correct = selected === question.answer

  function style(index) {
    if (!answered) return 'border-line bg-card hover:border-violet-400'
    if (index === question.answer) return 'border-emerald-500 bg-emerald-500/15'
    if (index === selected) return 'border-red-500 bg-red-500/15'
    return 'border-line bg-card opacity-50'
  }

  return (
    <div className="flex min-h-full flex-col">
      <p className="text-xs font-bold tracking-wider text-violet-400 uppercase">
        Question {number} / {total}
      </p>
      <h2 className="mt-2 mb-5 text-xl leading-snug font-extrabold">{question.q}</h2>

      <ul className="space-y-2.5">
        {order.map((index) => (
          <li key={index}>
            <button
              type="button"
              disabled={answered}
              onClick={() => setSelected(index)}
              className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3.5 text-left text-[15px] leading-snug font-semibold transition-colors ${style(index)}`}
            >
              <span className="flex-1">{question.choices[index]}</span>
              {answered && index === question.answer && <CheckCircle2 size={20} className="shrink-0 text-emerald-400" />}
              {answered && index === selected && !correct && <XCircle size={20} className="shrink-0 text-red-400" />}
            </button>
          </li>
        ))}
      </ul>

      {answered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-5 rounded-2xl p-4 ${correct ? 'bg-emerald-500/15' : 'bg-red-500/15'}`}
          role="status"
        >
          <p className={`font-extrabold ${correct ? 'text-emerald-400' : 'text-red-400'}`}>
            {correct ? 'Bonne réponse !' : 'Pas tout à fait…'}
          </p>
          <p className="mt-1 text-[15px] leading-snug text-fg/85">{question.explain}</p>
        </motion.div>
      )}

      <div className="mt-auto pt-6">
        <button
          type="button"
          disabled={!answered}
          onClick={() => onNext(correct)}
          className={`h-12 w-full rounded-2xl font-bold text-white transition-colors disabled:bg-line disabled:text-muted ${
            correct ? 'bg-emerald-500' : 'bg-violet-500'
          }`}
        >
          {number === total ? 'Voir mon résultat' : 'Continuer'}
        </button>
      </div>
    </div>
  )
}
