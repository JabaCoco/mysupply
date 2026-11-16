import { useState } from 'react'

// Graphique en barres : stock en fin de semaine.
// Une seule série (pas de légende) ; les semaines de rupture sont signalées par un "!" rouge
// avec un libellé dans l'infobulle (jamais la couleur seule). Ligne pointillée = point de commande.
const W = 320
const H = 150
const PAD = { top: 12, right: 8, bottom: 22, left: 30 }

export default function StockChart({ history, weeks, reorderPoint }) {
  const [hover, setHover] = useState(null)
  const max = Math.max(reorderPoint * 1.25, ...history.map((h) => h.endStock), 10)
  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const slot = plotW / weeks
  const barW = Math.max(slot - 6, 4)
  const y = (v) => PAD.top + plotH - (v / max) * plotH
  const ticks = [0, Math.round(max / 2 / 50) * 50, Math.round(max / 50) * 50].filter((t, i, a) => a.indexOf(t) === i && t <= max)
  const active = hover !== null ? history[hover] : null

  return (
    <figure className="relative rounded-2xl border border-line bg-card p-3">
      <figcaption className="mb-1 text-xs font-semibold text-muted">Stock en fin de semaine (unités)</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Évolution du stock en fin de semaine">
        {/* Grille et axe : discrets */}
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className="stroke-line" strokeWidth="1" />
            <text x={PAD.left - 4} y={y(t) + 3} textAnchor="end" className="fill-muted" fontSize="9">
              {t}
            </text>
          </g>
        ))}
        {/* Point de commande */}
        <line x1={PAD.left} x2={W - PAD.right} y1={y(reorderPoint)} y2={y(reorderPoint)} className="stroke-muted" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x={W - PAD.right} y={y(reorderPoint) - 3} textAnchor="end" className="fill-muted" fontSize="9">
          point de commande {reorderPoint}
        </text>

        {Array.from({ length: weeks }, (_, i) => {
          const h = history[i]
          const x = PAD.left + i * slot + (slot - barW) / 2
          return (
            <g key={i}>
              {h && h.endStock > 0 && (
                <path
                  d={`M${x},${y(0)} V${Math.min(y(h.endStock), y(0) - 4) + 3} q0,-3 3,-3 h${barW - 6} q3,0 3,3 V${y(0)} Z`}
                  className={hover === i ? 'fill-violet-400' : 'fill-violet-500'}
                />
              )}
              {h && h.lost > 0 && (
                <text x={x + barW / 2} y={y(0) - 4} textAnchor="middle" fontSize="11" fontWeight="800" className="fill-red-400">
                  !
                </text>
              )}
              <text x={x + barW / 2} y={H - 8} textAnchor="middle" fontSize="9" className={i % 2 === 0 ? 'fill-muted' : 'fill-transparent'}>
                S{i + 1}
              </text>
              {/* Zone de survol plus grande que la barre */}
              {h && (
                <rect
                  x={PAD.left + i * slot}
                  y={PAD.top}
                  width={slot}
                  height={plotH}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setHover(hover === i ? null : i)}
                />
              )}
            </g>
          )
        })}
      </svg>
      {active && (
        <div className="pointer-events-none absolute top-2 right-2 rounded-xl border border-line bg-bg px-3 py-2 text-xs shadow-lg">
          <p className="font-bold">Semaine {active.week}</p>
          <p>Stock fin : {active.endStock}</p>
          <p>Demande : {active.demand}</p>
          {active.lost > 0 && <p className="font-semibold text-red-400">! Rupture : {active.lost} ventes perdues</p>}
        </div>
      )}
    </figure>
  )
}
