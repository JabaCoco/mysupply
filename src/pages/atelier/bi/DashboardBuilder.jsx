import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { Check, CheckCircle2, ChartColumn, ChartLine, ChartPie, ChevronDown, ChevronRight, Hash, Lightbulb, RotateCcw, SlidersHorizontal, Table2, Trophy, XCircle, Zap } from 'lucide-react'
import Page from '../../../components/Page.jsx'
import SubHeader from '../../../components/SubHeader.jsx'
import { atelierFav } from '../../../lib/favorites.js'
import { DASHBOARDS } from '../../../data/atelier/bi/index.js'
import { FAMILIES, FORMATS, VISUALS, dashboardMax, dimValues, findDashboard, makeDashboardData, needMax, scoreNeed, series } from '../../../data/atelier/bi/dashboards.js'
import { completeDashboard, useWorkshop } from '../../../lib/atelier.js'
import { celebrate } from '../../../lib/confetti.js'
import { Code, SimulationNotice } from './shared.jsx'

const ICONS = { card: Hash, bar: ChartColumn, line: ChartLine, donut: ChartPie, table: Table2, slicer: SlidersHorizontal }
const PALETTE = ['#8b5cf6', '#f59e0b', '#10b981', '#ec4899', '#38bdf8', '#f97316']
const visualLabel = (id) => VISUALS.find((v) => v.id === id)?.label ?? '—'

// Liste (/atelier/bi/tableau)
export function DashList() {
  const workshop = useWorkshop()
  if (!workshop) return null
  return (
    <Page>
      <SubHeader back="/atelier/bi" title="Constructeur de tableau de bord" subtitle="Choisis les visuels et les mesures pour répondre à la question" />
      <SimulationNotice className="mb-4" />
      <ul className="space-y-2.5">
        {DASHBOARDS.map((d) => {
          const r = workshop.get(`bi/${d.id}`)
          return (
            <li key={d.id}>
              <Link to={`/atelier/bi/tableau/${d.id}`} className="flex items-center gap-3 rounded-2xl border border-line bg-card p-4">
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{d.title}</span>
                  <span className="line-clamp-2 text-xs text-muted">{d.context}</span>
                  {r && (
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                      <Check size={12} strokeWidth={3} /> Meilleur score {r.bestScore}/{r.max}
                    </span>
                  )}
                </span>
                <ChevronRight size={18} className="shrink-0 text-muted" />
              </Link>
            </li>
          )
        })}
      </ul>
    </Page>
  )
}

export function DashPage() {
  const { id } = useParams()
  const dash = findDashboard(id)
  if (!dash) return <Navigate to="/atelier/bi/tableau" replace />
  return <Builder key={dash.id} dash={dash} />
}

const emptyPicks = (d) => d.needs.map(() => ({ visual: null, measure: '', dim: '' }))

function Builder({ dash }) {
  const fam = FAMILIES[dash.family]
  const [rows, setRows] = useState(() => makeDashboardData(dash))
  const [picks, setPicks] = useState(() => emptyPicks(dash))
  const [done, setDone] = useState(false)
  const [xp, setXp] = useState(null)
  const [hint, setHint] = useState(false)
  const saved = useRef(false)

  const results = picks.map((p, i) => scoreNeed(dash.needs[i], { visual: p.visual, measure: p.measure || null, dim: p.dim || null }))
  const score = results.reduce((s, r) => s + r.total, 0)
  const max = dashboardMax(dash)
  const complete = picks.every((p) => p.visual && (p.visual === 'slicer' || p.measure))

  useEffect(() => {
    if (!done || saved.current) return
    saved.current = true
    completeDashboard(dash.id, score, max).then(setXp)
    if (score / max >= 0.8) celebrate()
  }, [done, dash.id, score, max])

  const setPick = (i, patch) => setPicks((all) => all.map((p, k) => (k === i ? { ...p, ...patch } : p)))
  function restart() {
    saved.current = false
    setRows(makeDashboardData(dash))
    setPicks(emptyPicks(dash))
    setDone(false)
    setXp(null)
    window.scrollTo({ top: 0 })
  }

  return (
    <Page>
      <SubHeader back="/atelier/bi/tableau" title={dash.title} subtitle="Constructeur de tableau de bord" fav={atelierFav({ key: `bi/${dash.id}`, title: dash.title, sub: 'Tableau de bord Power BI', to: `/atelier/bi/tableau/${dash.id}` })} />
      <div className="space-y-4">
        <p className="rounded-2xl border border-line bg-card p-4 text-[15px] leading-relaxed">{dash.context}</p>
        <p className="text-sm text-muted">
          Table de faits disponible : <span className="font-semibold text-fg">{fam.table}</span> ({rows.length} lignes tirées au hasard). Pour chaque besoin, choisis le visuel, la mesure et l’axe.
        </p>

        {!done && (
          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5">
            <button type="button" onClick={() => setHint((h) => !h)} aria-expanded={hint} className="flex w-full items-center gap-2 p-3 text-sm font-semibold text-amber-400">
              <Lightbulb size={18} /> Rappel / indice
              <ChevronDown size={18} className={`ml-auto transition-transform ${hint ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence initial={false}>
              {hint && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="space-y-3 px-3 pb-3">
                    <div>
                      <p className="mb-1 text-xs font-bold tracking-wider text-muted uppercase">Quel visuel pour quoi ?</p>
                      <ul className="space-y-0.5 text-sm">
                        {VISUALS.map((v) => (
                          <li key={v.id}>
                            <span className="font-bold text-violet-400">{v.label}</span> : {v.hint}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-bold tracking-wider text-muted uppercase">Les mesures du modèle</p>
                      <ul className="space-y-1 text-sm">
                        {fam.measures.map((m) => (
                          <li key={m.id}>
                            <span className="font-bold text-violet-400">{m.label}</span> : {m.note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {dash.needs.map((need, i) => (
          <NeedCard key={need.id} number={i + 1} total={dash.needs.length} need={need} pick={picks[i]} result={results[i]} done={done} rows={rows} family={dash.family} onPick={(patch) => setPick(i, patch)} />
        ))}

        {!done ? (
          <button type="button" disabled={!complete} onClick={() => setDone(true)} className="h-12 w-full rounded-2xl bg-violet-500 font-bold text-white disabled:opacity-50">
            Valider mon tableau de bord
          </button>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center gap-4 rounded-3xl bg-violet-500 p-5 text-white">
              <Trophy size={40} className="shrink-0" />
              <div>
                <p className="text-3xl font-extrabold">
                  {score} / {max}
                </p>
                <p className="text-sm text-white/85">{score / max >= 0.8 ? 'Un tableau de bord prêt pour le comité !' : score / max >= 0.5 ? 'De bons réflexes, à affiner.' : 'Relis les corrections et réessaie.'}</p>
              </div>
              {xp > 0 && (
                <span className="ml-auto flex items-center gap-1 font-extrabold text-amber-300">
                  <Zap size={18} className="fill-amber-300" />+{xp}
                </span>
              )}
            </div>
            <button type="button" onClick={restart} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-line bg-card font-bold">
              <RotateCcw size={18} /> Rejouer avec de nouvelles données
            </button>
            <Link to="/atelier/bi/tableau" className="block py-1 text-center text-sm font-semibold text-muted">
              Autres tableaux de bord
            </Link>
          </motion.div>
        )}

        <SimulationNotice />
      </div>
    </Page>
  )
}

const selectClass = 'h-11 w-full rounded-xl border-2 border-line bg-card px-3 text-sm font-semibold outline-none focus:border-violet-500 disabled:opacity-50'

function NeedCard({ number, total, need, pick, result, done, rows, family, onPick }) {
  const fam = FAMILIES[family]
  const measure = fam.measures.find((m) => m.id === pick.measure)
  const expectedMeasure = fam.measures.find((m) => m.id === need.measure)
  const expectedDim = fam.dims.find((d) => d.id === need.dim)
  const max = needMax(need)

  return (
    <section className="space-y-3 rounded-3xl border border-line bg-card p-4">
      <p className="text-xs font-bold tracking-wider text-violet-400 uppercase">
        Besoin {number} / {total}
      </p>
      <p className="text-[15px] leading-snug font-semibold">{need.ask}</p>

      <div role="radiogroup" aria-label="Type de visuel" className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
        {VISUALS.map((v) => {
          const Icon = ICONS[v.id]
          const on = pick.visual === v.id
          return (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={on}
              disabled={done}
              onClick={() => onPick({ visual: v.id, ...(v.id === 'slicer' ? { measure: '' } : {}) })}
              className={`flex flex-col items-center gap-1 rounded-xl border-2 px-1 py-2 text-xs font-semibold ${on ? 'border-violet-500 bg-violet-500/10 text-violet-300' : 'border-line'}`}
            >
              <Icon size={18} />
              {v.label}
            </button>
          )
        })}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block text-xs font-bold tracking-wider text-muted uppercase">
          Mesure (Valeurs)
          <select value={pick.measure} disabled={done || pick.visual === 'slicer'} onChange={(e) => onPick({ measure: e.target.value })} className={`${selectClass} mt-1 normal-case`}>
            <option value="">{pick.visual === 'slicer' ? 'Aucune (un segment n’a pas de mesure)' : 'Choisis une mesure…'}</option>
            {fam.measures.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-bold tracking-wider text-muted uppercase">
          Axe (dimension)
          <select value={pick.dim} disabled={done} onChange={(e) => onPick({ dim: e.target.value })} className={`${selectClass} mt-1 normal-case`}>
            <option value="">Aucun (valeur totale)</option>
            {fam.dims.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Preview visual={pick.visual} measure={measure} dim={pick.dim} rows={rows} family={family} />

      {done && (
        <div className="space-y-2 rounded-2xl border border-line p-3 text-sm" role="status">
          <p className="flex items-center gap-2 font-extrabold">
            {result.total === max ? <CheckCircle2 size={18} className="text-emerald-400" /> : <XCircle size={18} className="text-amber-400" />}
            {result.total} / {max} points
          </p>
          <ul className="space-y-0.5">
            <li>Visuel : {result.visual}/2 {result.visual === 2 ? '(le meilleur choix)' : result.visual === 1 ? '(acceptable, mais pas le plus lisible)' : '(pas adapté)'}</li>
            {need.measure && <li>Mesure : {result.measure}/3 {result.measure === 3 ? '(juste)' : '(ce n’est pas la mesure demandée)'}</li>}
            <li>Axe : {result.dim}/1 {result.dim === 1 ? '(juste)' : '(à revoir)'}</li>
          </ul>
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3">
            <p className="font-extrabold text-emerald-400">La réponse attendue</p>
            <p className="mt-1">
              <span className="font-semibold">{visualLabel(need.visual)}</span>
              {expectedMeasure && <> · Mesure : <span className="font-semibold">{expectedMeasure.label}</span></>}
              {' · '}Axe : <span className="font-semibold">{expectedDim?.label ?? 'aucun (valeur totale)'}</span>
            </p>
            <p className="mt-1 text-fg/85">{need.why}</p>
            {need.ok.length > 0 && <p className="mt-1 text-xs text-muted">Visuels acceptables : {[need.visual, ...need.ok.filter((x) => x !== need.visual)].map(visualLabel).join(', ')}.</p>}
          </div>
          {expectedMeasure && (
            <div>
              <p className="mb-1 text-xs font-bold tracking-wider text-muted uppercase">La mesure DAX correspondante</p>
              <Code>{expectedMeasure.dax}</Code>
            </div>
          )}
          <Insight need={need} rows={rows} family={family} />
        </div>
      )}
    </section>
  )
}

// Ce que dit le tableau de bord, calculé sur les données tirées au hasard
function Insight({ need, rows, family }) {
  if (!need.insight || !need.dim || !need.measure) return null
  const s = series(rows, family, need.measure, need.dim)
  if (!s.length) return null
  const pickOne = need.insight === 'low' ? s.reduce((a, b) => (b.value < a.value ? b : a)) : s.reduce((a, b) => (b.value > a.value ? b : a))
  const m = FAMILIES[family].measures.find((x) => x.id === need.measure)
  return (
    <p className="rounded-xl bg-violet-500/10 p-3">
      <span className="font-bold text-violet-300">Ce que montre ton tableau de bord : </span>
      {need.insight === 'low' ? 'la valeur la plus basse' : 'la valeur la plus haute'} est <span className="font-semibold">{pickOne.label}</span> ({FORMATS[m.fmt](pickOne.value)}). C’est là qu’il faudrait creuser.
    </p>
  )
}

// Aperçu du visuel choisi, avec les données tirées au hasard
function Preview({ visual, measure, dim, rows, family }) {
  if (!visual) return <p className="rounded-xl border border-dashed border-line p-3 text-center text-sm text-muted">Choisis un visuel pour voir un aperçu.</p>
  const fam = FAMILIES[family]
  const dimLabel = fam.dims.find((d) => d.id === dim)?.label

  if (visual === 'slicer') {
    if (!dim) return <p className="rounded-xl border border-dashed border-line p-3 text-center text-sm text-muted">Choisis l’axe sur lequel filtrer (ex. Entrepôt).</p>
    return (
      <div className="rounded-xl border border-line p-3">
        <p className="mb-2 text-xs font-bold text-muted">{dimLabel}</p>
        <div className="flex flex-wrap gap-1.5">
          {dimValues(rows, family, dim).map((v) => (
            <span key={v} className="rounded-full border border-line px-2.5 py-1 text-xs font-semibold">
              {v}
            </span>
          ))}
        </div>
      </div>
    )
  }
  if (!measure) return <p className="rounded-xl border border-dashed border-line p-3 text-center text-sm text-muted">Choisis une mesure pour voir l’aperçu.</p>

  const fmtv = FORMATS[measure.fmt]
  const data = series(rows, family, measure.id, visual === 'card' ? null : dim || null)
  const title = `${measure.label}${visual !== 'card' && dimLabel ? ` par ${dimLabel.toLowerCase()}` : ''}`

  return (
    <figure className="rounded-xl border border-line p-3">
      <figcaption className="mb-2 text-xs font-bold text-muted">{title}</figcaption>
      {visual === 'card' && (
        <div className="py-2 text-center">
          <p className="text-4xl font-extrabold tabular-nums">{fmtv(data[0].value)}</p>
          {dim && <p className="mt-1 text-xs text-muted">Une carte affiche un seul chiffre : l’axe est ignoré.</p>}
        </div>
      )}
      {visual === 'bar' && <Bars data={data} fmtv={fmtv} />}
      {visual === 'line' && <Line data={data} fmtv={fmtv} />}
      {visual === 'donut' && <Donut data={data} fmtv={fmtv} />}
      {visual === 'table' && (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-muted">
              <th className="py-1 font-bold">{dimLabel ?? 'Total'}</th>
              <th className="py-1 text-right font-bold">{measure.label}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.label} className="border-b border-line last:border-b-0">
                <td className="py-1">{p.label}</td>
                <td className="py-1 text-right font-semibold tabular-nums">{fmtv(p.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </figure>
  )
}

function Bars({ data, fmtv }) {
  const top = Math.max(...data.map((p) => p.value), 1e-9)
  return (
    <div className="flex h-40 items-end gap-2" role="img" aria-label={data.map((p) => `${p.label} : ${fmtv(p.value)}`).join(', ')}>
      {data.map((p) => (
        <div key={p.label} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1">
          <span className="text-[10px] font-semibold tabular-nums">{fmtv(p.value)}</span>
          <div className="w-full rounded-t-md bg-violet-500" style={{ height: `${Math.max(4, (p.value / top) * 100)}px` }} />
          <span className="w-full truncate text-center text-[10px] text-muted">{p.label}</span>
        </div>
      ))}
    </div>
  )
}

function Line({ data, fmtv }) {
  const W = 300
  const H = 110
  const values = data.map((p) => p.value)
  const lo = Math.min(...values)
  const hi = Math.max(...values)
  const span = hi - lo || 1
  const pts = data.map((p, i) => [data.length === 1 ? W / 2 : 10 + (i * (W - 20)) / (data.length - 1), 10 + (1 - (p.value - lo) / span) * (H - 20)])
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={data.map((p) => `${p.label} : ${fmtv(p.value)}`).join(', ')}>
        <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinejoin="round" />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3.5" fill="#8b5cf6" />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-muted">
        {data.map((p) => (
          <span key={p.label}>{p.label}</span>
        ))}
      </div>
      <p className="mt-1 text-[11px] text-muted">
        De {fmtv(data[0].value)} à {fmtv(data[data.length - 1].value)} (échelle ajustée entre {fmtv(lo)} et {fmtv(hi)})
      </p>
    </div>
  )
}

function Donut({ data, fmtv }) {
  const total = data.reduce((s, p) => s + p.value, 0) || 1
  const stops = data.map((p, i) => {
    const before = data.slice(0, i).reduce((s, x) => s + x.value, 0)
    return `${PALETTE[i % PALETTE.length]} ${(before / total) * 100}% ${((before + p.value) / total) * 100}%`
  })
  return (
    <div className="flex items-center gap-4">
      <div className="size-24 shrink-0 rounded-full" style={{ background: `conic-gradient(${stops.join(', ')})`, mask: 'radial-gradient(circle, transparent 38%, #000 40%)', WebkitMask: 'radial-gradient(circle, transparent 38%, #000 40%)' }} role="img" aria-label="Anneau" />
      <ul className="min-w-0 flex-1 space-y-1 text-xs">
        {data.map((p, i) => (
          <li key={p.label} className="flex items-center gap-2">
            <span className="size-2.5 shrink-0 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
            <span className="min-w-0 flex-1 truncate">{p.label}</span>
            <span className="font-semibold tabular-nums">{fmtv(p.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
