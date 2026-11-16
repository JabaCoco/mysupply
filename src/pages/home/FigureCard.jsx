import { Hash } from 'lucide-react'
import { figures, pickOfDay } from '../../data/daily.js'

export default function FigureCard() {
  const figure = pickOfDay(figures)

  return (
    <section className="rounded-3xl border border-line bg-card p-4">
      <p className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-sky-400 uppercase">
        <Hash size={14} /> Chiffre du jour
      </p>
      <p className="mt-2 bg-linear-to-r from-sky-400 to-violet-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
        {figure.value}
      </p>
      <p className="mt-1 text-sm leading-snug">{figure.text}</p>
      <p className="mt-2 text-xs text-muted">Source : {figure.source}</p>
    </section>
  )
}
