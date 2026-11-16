// Graphique en lignes : demande des clients et commandes passées par chaque maillon.
// Chaque ligne a un style de trait différent ET un libellé direct (jamais la couleur seule).
const W = 320
const H = 190
const PAD = { top: 12, right: 8, bottom: 22, left: 30 }

const SERIES = [
  { key: 'demand', label: 'Clients', stroke: 'stroke-muted', dash: '2 3', width: 2.5 },
  { key: 0, label: 'Détaillant', stroke: 'stroke-sky-400', dash: '', width: 1.5 },
  { key: 1, label: 'Grossiste (toi)', stroke: 'stroke-violet-500', dash: '', width: 3 },
  { key: 2, label: 'Distributeur', stroke: 'stroke-amber-400', dash: '6 3', width: 1.5 },
  { key: 3, label: 'Usine', stroke: 'stroke-pink-500', dash: '1 3', width: 2 },
]

export default function BeerChart({ game }) {
  const n = game.history.length
  const values = (key) => game.history.map((h) => (key === 'demand' ? h.demand : h.stages[key].ordered))
  const max = Math.max(10, ...SERIES.flatMap((s) => values(s.key)))
  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const x = (i) => PAD.left + (n > 1 ? (i / (n - 1)) * plotW : 0)
  const y = (v) => PAD.top + plotH - (v / max) * plotH
  const step = max > 60 ? 20 : max > 30 ? 10 : 5
  const ticks = Array.from({ length: Math.floor(max / step) + 1 }, (_, k) => k * step)

  return (
    <figure className="rounded-2xl border border-line bg-card p-3">
      <figcaption className="mb-1 text-xs font-semibold text-muted">Commandes passées chaque semaine (caisses)</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Commandes passées par chaque maillon de la chaîne, comparées à la demande des clients">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className="stroke-line" strokeWidth="1" />
            <text x={PAD.left - 4} y={y(t) + 3} textAnchor="end" className="fill-muted" fontSize="9">
              {t}
            </text>
          </g>
        ))}
        {[0, Math.floor((n - 1) / 2), n - 1].filter((i, k, a) => i >= 0 && a.indexOf(i) === k).map((i) => (
          <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="9" className="fill-muted">
            S{i + 1}
          </text>
        ))}
        {SERIES.map((s) => {
          const vals = values(s.key)
          const d = vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
          return <path key={s.key} d={d} fill="none" className={s.stroke} strokeWidth={s.width} strokeDasharray={s.dash} strokeLinecap="round" strokeLinejoin="round" />
        })}
      </svg>
      <ul className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
        {SERIES.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5">
            <svg width="26" height="8" aria-hidden="true">
              <line x1="1" x2="25" y1="4" y2="4" className={s.stroke} strokeWidth={s.width} strokeDasharray={s.dash} strokeLinecap="round" />
            </svg>
            <span>
              {s.label} · max {Math.max(...values(s.key))}
            </span>
          </li>
        ))}
      </ul>
    </figure>
  )
}
