import { useEffect, useRef, useState } from 'react'
import { Check, Shuffle, Undo2, X, Zap } from 'lucide-react'
import Page from '../../../components/Page.jsx'
import SubHeader from '../../../components/SubHeader.jsx'
import { Table } from '../simulateur/SituationModal.jsx'
import { KM_PER_UNIT, LEVELS, crossings, generateTour, nearestNeighbor, optimalTour, routeLength, scoreTour, toKm } from '../../../lib/tour.js'
import { recordScoreGame, useWorkshop } from '../../../lib/atelier.js'
import { celebrate } from '../../../lib/confetti.js'

const km = (units, d = 1) => `${toKm(units).toLocaleString('fr-FR', { maximumFractionDigits: d })} km`
const euros = (n) => `${n.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} €`
const LEVEL_LABEL = { facile: 'Facile (6 clients)', moyen: 'Moyen (8 clients)', difficile: 'Difficile (10 clients)' }

export default function DeliveryTour() {
  const workshop = useWorkshop()
  const [level, setLevel] = useState('facile')
  const [tour, setTour] = useState(null)
  const [order, setOrder] = useState([])
  const [done, setDone] = useState(false)
  const [xp, setXp] = useState(null)
  const saved = useRef(false)
  const best = workshop?.get('tournee')

  const result = done && tour ? summary(tour, order) : null

  useEffect(() => {
    if (!result || saved.current) return
    saved.current = true
    recordScoreGame('tournee', result.score).then(setXp)
    if (result.score >= 90) celebrate()
  }, [result])

  function start(lv = level) {
    saved.current = false
    setTour(generateTour(LEVELS[lv]))
    setOrder([])
    setDone(false)
    setXp(null)
    window.scrollTo({ top: 0 })
  }

  if (!tour)
    return (
      <Page>
        <SubHeader back="/atelier" title="Tournée de livraison" subtitle="Trouve le chemin le plus court" />
        <div className="space-y-4">
          <p className="text-[15px] leading-relaxed">
            Ton camion part du dépôt, livre <span className="font-semibold">tous les clients une seule fois</span> puis revient au dépôt. <span className="font-semibold">Objectif : le moins de kilomètres possible</span>, car
            chaque kilomètre coûte du carburant, du temps et du CO₂.
          </p>
          <Table
            title="Les règles"
            rows={[
              ['Départ et retour', 'Au dépôt (carré)'],
              ['Visites', 'Touche les clients dans l\'ordre que tu choisis'],
              ['Échelle', `1 case de la carte = ${KM_PER_UNIT} km`],
              ['Comparaison', 'Avec le plus proche voisin et la tournée optimale'],
            ]}
          />
          <div>
            <p className="mb-1.5 text-xs font-bold tracking-wider text-muted uppercase">Niveau</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(LEVELS).map((lv) => (
                <button key={lv} type="button" onClick={() => setLevel(lv)} aria-pressed={level === lv} className={`h-9 rounded-xl px-3 text-sm font-semibold ${level === lv ? 'bg-violet-500 text-white' : 'border border-line'}`}>
                  {LEVEL_LABEL[lv]}
                </button>
              ))}
            </div>
          </div>
          {best?.games > 0 && (
            <p className="text-sm text-muted">
              {best.games} partie(s) · meilleur score : <span className="font-bold text-fg">{best.bestScore} / 100</span>
            </p>
          )}
          <button type="button" onClick={() => start()} className="h-12 w-full rounded-2xl bg-violet-500 font-bold text-white">
            Commencer
          </button>
        </div>
      </Page>
    )

  const n = tour.points.length - 1
  const so = order.length ? routeLengthPartial(tour.points, order) : 0
  const remaining = n - order.length
  const full = remaining === 0

  return (
    <Page>
      <SubHeader back="/atelier" title="Tournée de livraison" subtitle={done ? 'Résultat' : `${order.length} / ${n} clients visités`} />
      <div className="space-y-4">
        <Map points={tour.points} routes={done ? result.routes : [{ id: 'me', order, style: 'solid', closed: false }]} order={order} onPick={(i) => !done && !order.includes(i) && setOrder([...order, i])} done={done} />

        {!done && (
          <>
            <div className="grid grid-cols-2 gap-2 text-center text-sm">
              <div className="rounded-xl border border-line bg-card p-2">
                <p className="text-xs text-muted">Distance parcourue</p>
                <p className="text-lg font-extrabold">{km(so)}</p>
              </div>
              <div className="rounded-xl border border-line bg-card p-2">
                <p className="text-xs text-muted">Coût estimé</p>
                <p className="text-lg font-extrabold">{euros(toKm(so) * tour.costPerKm)}</p>
              </div>
            </div>
            <p className="text-sm text-muted">
              {order.length === 0 ? 'Touche le premier client à livrer.' : full ? `Tous les clients sont visités. Le retour au dépôt est inclus à la validation (${km(routeLength(tour.points, order))} au total).` : `Prochain client : touche-le sur la carte (${remaining} restant${remaining > 1 ? 's' : ''}).`}
            </p>
            <div className="flex gap-2">
              <button type="button" disabled={order.length === 0} onClick={() => setOrder(order.slice(0, -1))} className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-2xl border border-line font-semibold disabled:opacity-40">
                <Undo2 size={18} /> Annuler le dernier
              </button>
              <button type="button" disabled={!full} onClick={() => setDone(true)} className="h-12 flex-1 rounded-2xl bg-violet-500 font-bold text-white disabled:opacity-40">
                Valider la tournée
              </button>
            </div>
          </>
        )}

        {done && result && <Result tour={tour} result={result} xp={xp} onRestart={() => setTour(null)} onReplay={() => start()} />}
      </div>
    </Page>
  )
}

// Distance du dépôt jusqu'au dernier client visité (sans le retour)
function routeLengthPartial(points, order) {
  let total = 0
  let prev = 0
  for (const i of order) {
    total += Math.hypot(points[prev].x - points[i].x, points[prev].y - points[i].y)
    prev = i
  }
  return total
}

function summary(tour, order) {
  const nn = nearestNeighbor(tour.points)
  const opt = optimalTour(tour.points)
  return {
    order,
    mine: routeLength(tour.points, order),
    nn: routeLength(tour.points, nn),
    opt: routeLength(tour.points, opt),
    crossings: crossings(tour.points, order),
    score: scoreTour(tour.points, order),
    routes: [
      { id: 'me', label: 'Ta tournée', order, style: 'solid' },
      { id: 'nn', label: 'Plus proche voisin', order: nn, style: 'dash' },
      { id: 'opt', label: 'Tournée optimale', order: opt, style: 'dot' },
    ],
  }
}

const STROKE = { solid: { cls: 'stroke-violet-500', dash: '', w: 3 }, dash: { cls: 'stroke-amber-400', dash: '6 4', w: 2 }, dot: { cls: 'stroke-emerald-400', dash: '1.5 3.5', w: 2.5 } }

function Map({ points, routes, order, onPick, done }) {
  const visited = new Set(order)
  return (
    <figure className="rounded-2xl border border-line bg-card p-2">
      <svg viewBox="0 0 100 100" className="w-full touch-manipulation short:mx-auto short:h-[72dvh] short:w-auto" role="img" aria-label="Carte des clients et du dépôt">
        <rect x="0" y="0" width="100" height="100" rx="4" className="fill-bg" />
        {[25, 50, 75].map((g) => (
          <g key={g} className="stroke-line" strokeWidth="0.3">
            <line x1={g} y1="0" x2={g} y2="100" />
            <line x1="0" y1={g} x2="100" y2={g} />
          </g>
        ))}
        {routes.map((r) => {
          const path = (r.closed === false ? [0, ...r.order] : [0, ...r.order, 0]).map((i) => points[i])
          if (path.length < 2) return null
          const s = STROKE[r.style]
          return <polyline key={r.id} points={path.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" className={s.cls} strokeWidth={s.w / 2.5} strokeDasharray={s.dash} strokeLinecap="round" strokeLinejoin="round" />
        })}
        {/* Dépôt */}
        <rect x={points[0].x - 3.5} y={points[0].y - 3.5} width="7" height="7" rx="1" className="fill-fg" />
        <text x={points[0].x} y={points[0].y + 1.3} textAnchor="middle" fontSize="4" fontWeight="800" className="fill-bg">
          D
        </text>
        {/* Clients */}
        {points.slice(1).map((p, k) => {
          const i = k + 1
          const rank = order.indexOf(i)
          return (
            <g key={i} onClick={() => onPick(i)} className={done ? '' : 'cursor-pointer'} role="button" aria-label={`Client ${i}${visited.has(i) ? `, visité en position ${rank + 1}` : ''}`}>
              <circle cx={p.x} cy={p.y} r="6" fill="transparent" />
              <circle cx={p.x} cy={p.y} r="4" className={visited.has(i) ? 'fill-violet-500' : 'fill-card stroke-violet-400'} strokeWidth="0.8" />
              <text x={p.x} y={p.y + 1.4} textAnchor="middle" fontSize="4" fontWeight="800" className={visited.has(i) ? 'fill-white' : 'fill-fg'}>
                {visited.has(i) ? rank + 1 : i}
              </text>
            </g>
          )
        })}
      </svg>
      {done ? (
        <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
          {routes.map((r) => (
            <li key={r.id} className="flex items-center gap-1.5">
              <svg width="28" height="8" aria-hidden="true">
                <line x1="1" x2="27" y1="4" y2="4" className={STROKE[r.style].cls} strokeWidth={STROKE[r.style].w} strokeDasharray={STROKE[r.style].dash} strokeLinecap="round" />
              </svg>
              {r.label}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-center text-[11px] text-muted">Carré D = dépôt · les numéros violets plein = ordre de visite</p>
      )}
    </figure>
  )
}

function Result({ tour, result, xp, onRestart, onReplay }) {
  const extra = (result.mine / result.opt - 1) * 100
  const rows = [
    ['Ta tournée', result.mine],
    ['Plus proche voisin', result.nn],
    ['Tournée optimale', result.opt],
  ]
  return (
    <div className="space-y-4">
      <div className={`rounded-3xl p-5 text-white ${result.score >= 90 ? 'bg-emerald-500' : 'bg-violet-500'}`}>
        <p className="text-sm text-white/85">Ton score</p>
        <p className="text-4xl font-extrabold">{result.score} / 100</p>
        <p className="mt-1 text-sm">{extra < 0.05 ? 'Tu as trouvé la tournée optimale !' : `Tu parcours ${extra.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} % de kilomètres de plus que la tournée optimale.`}</p>
        {xp > 0 && (
          <p className="mt-2 flex items-center gap-1 font-extrabold text-amber-200">
            <Zap size={16} className="fill-amber-200" />+{xp} XP
          </p>
        )}
      </div>
      <div className="overflow-hidden rounded-2xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-card text-xs text-muted">
            <tr>
              <th className="p-2 text-left" />
              <th className="p-2 text-right">Distance</th>
              <th className="p-2 text-right">Coût</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, d]) => (
              <tr key={name} className="border-t border-line">
                <td className="p-2">{name}</td>
                <td className="p-2 text-right font-semibold">{km(d)}</td>
                <td className="p-2 text-right">{euros(toKm(d) * tour.costPerKm)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted">Coût du kilomètre : {euros(tour.costPerKm)} (carburant, chauffeur, usure).</p>
      <div className="flex items-start gap-2 rounded-2xl border border-line bg-card p-3 text-sm">
        {result.crossings === 0 ? <Check size={18} className="mt-0.5 shrink-0 text-emerald-400" /> : <X size={18} className="mt-0.5 shrink-0 text-red-400" />}
        <span>
          <span className="font-bold">{result.crossings === 0 ? 'Bien : ' : 'À revoir : '}</span>
          {result.crossings === 0 ? 'ta tournée ne se croise pas. Une tournée optimale n\'a jamais de croisement.' : `ta tournée se croise ${result.crossings} fois. Un croisement se supprime presque toujours en inversant un morceau de trajet, et raccourcit la tournée.`}
        </span>
      </div>
      <div className="rounded-2xl bg-amber-400/10 p-3.5 text-sm leading-snug">
        <p className="font-bold">Ce qu'il faut retenir</p>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>
            <span className="font-semibold">Le plus proche voisin</span> (aller toujours au client le plus proche) est simple mais pas optimal : {result.nn > result.opt + 1e-6 ? `ici il fait ${(((result.nn / result.opt) - 1) * 100).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} % de plus que l'optimum.` : 'ici il tombe sur l\'optimum.'}
          </li>
          <li>
            <span className="font-semibold">Le nombre de tournées possibles explose</span> : pour 10 clients, il y en a plus de 3 millions. Les logiciels de tournées (TMS) utilisent des méthodes de calcul pour trouver de très bonnes solutions rapidement.
          </li>
          <li>
            <span className="font-semibold">Chaque kilomètre économisé</span> réduit le coût, le temps de conduite et les émissions.
          </li>
        </ul>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onRestart} className="h-12 flex-1 rounded-2xl border border-line font-semibold">
          Changer de niveau
        </button>
        <button type="button" onClick={onReplay} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-violet-500 font-bold text-white">
          <Shuffle size={18} /> Nouvelle carte
        </button>
      </div>
    </div>
  )
}
