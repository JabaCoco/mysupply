import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { Check, CheckCircle2, ChevronDown, ChevronRight, Eraser, Eye, Lightbulb, Plus, RotateCcw, Trophy, Undo2, X, XCircle, Zap } from 'lucide-react'
import Page from '../../../components/Page.jsx'
import SubHeader from '../../../components/SubHeader.jsx'
import { atelierFav } from '../../../lib/favorites.js'
import { PQ_SCENARIOS } from '../../../data/atelier/bi/index.js'
import { makePqGame } from '../../../data/atelier/bi/pqScenarios.js'
import { STEP_INFO, describeStep, diffTables, mCode, runSteps, stepNames } from '../../../lib/powerQuery.js'
import { completePqSim, useWorkshop } from '../../../lib/atelier.js'
import { celebrate } from '../../../lib/confetti.js'
import { Code, DataTable, SimulationNotice } from './shared.jsx'

// Liste des scénarios (/atelier/bi/simulateur)
export function PqList() {
  const workshop = useWorkshop()
  if (!workshop) return null
  return (
    <Page>
      <SubHeader back="/atelier/bi" title="Simulateur Power Query" subtitle="Clique sur les transformations dans le bon ordre" />
      <SimulationNotice className="mb-4" />
      <ul className="space-y-2.5">
        {PQ_SCENARIOS.map((s) => (
          <li key={s.id}>
            <Link to={`/atelier/bi/simulateur/${s.id}`} className="flex items-center gap-3 rounded-2xl border border-line bg-card p-4">
              <span className="min-w-0 flex-1">
                <span className="block font-bold">{s.title}</span>
                <span className="line-clamp-2 text-xs text-muted">{s.intro}</span>
                {workshop.has(`bi/${s.id}`) && (
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                    <Check size={12} strokeWidth={3} /> Réussi
                  </span>
                )}
              </span>
              <ChevronRight size={18} className="shrink-0 text-muted" />
            </Link>
          </li>
        ))}
      </ul>
    </Page>
  )
}

// Un scénario (/atelier/bi/simulateur/:id)
export function PqGamePage() {
  const { id } = useParams()
  const scenario = PQ_SCENARIOS.find((s) => s.id === id)
  if (!scenario) return <Navigate to="/atelier/bi/simulateur" replace />
  return <PqGame key={scenario.id} scenario={scenario} />
}

function PqGame({ scenario }) {
  const [game, setGame] = useState(() => makePqGame(scenario))
  const [applied, setApplied] = useState([]) // ids des transformations choisies, dans l'ordre
  const [view, setView] = useState(null) // étape affichée en aperçu (null = la dernière)
  const [hint, setHint] = useState(false)
  const [solution, setSolution] = useState(false)
  const [usedSolution, setUsedSolution] = useState(false)
  const [checked, setChecked] = useState(false)
  const [xp, setXp] = useState(null)
  const [showM, setShowM] = useState(false)
  const saved = useRef(false)

  const byId = useMemo(() => new Map(game.candidates.map((c) => [c.id, c])), [game])
  const steps = useMemo(() => applied.map((id) => byId.get(id).step), [applied, byId])
  const run = useMemo(() => runSteps(game.source, steps, game.tables), [game, steps])
  const names = stepNames(steps)
  const diffs = run.final ? diffTables(run.final, game.target) : []
  const success = Boolean(run.final) && applied.length > 0 && diffs.length === 0
  const lastIdx = applied.length - 1
  const shown = view ?? lastIdx // -1 = table d'origine

  useEffect(() => {
    if (!success || saved.current) return
    saved.current = true
    completePqSim(scenario.id, usedSolution).then(setXp)
    celebrate()
  }, [success, scenario.id, usedSolution])

  function add(id) {
    if (success) return
    setApplied((a) => [...a, id])
    setView(null)
    setChecked(false)
  }
  const remove = (i) => {
    setApplied((a) => a.filter((_, k) => k !== i))
    setView(null)
    setChecked(false)
  }
  const reset = () => {
    setApplied([])
    setView(null)
    setChecked(false)
  }
  function restart() {
    saved.current = false
    setGame(makePqGame(scenario))
    reset()
    setHint(false)
    setSolution(false)
    setUsedSolution(false)
    setXp(null)
    window.scrollTo({ top: 0 })
  }

  // Aperçu de l'étape sélectionnée
  const preview = shown < 0 ? { ok: true, table: game.source } : run.results[shown]
  const prevName = shown <= 0 ? 'Source' : names[shown - 1]
  const mLine = shown >= 0 ? STEP_INFO[steps[shown].op].m(steps[shown], /[\s]/.test(prevName) ? `#"${prevName}"` : prevName) : null
  const idealOrder = game.ideal.map((c) => c.step)

  return (
    <Page>
      <SubHeader back="/atelier/bi/simulateur" title={scenario.title} subtitle="Simulateur Power Query" fav={atelierFav({ key: `bi/${scenario.id}`, title: scenario.title, sub: 'Simulateur Power Query', to: `/atelier/bi/simulateur/${scenario.id}` })} />
      <div className="space-y-4">
        <p className="rounded-2xl border border-line bg-card p-4 text-[15px] leading-relaxed">{scenario.intro}</p>

        <DataTable title="Objectif : obtenir ce tableau" cols={game.target.cols} rows={game.target.rows} small />

        {/* Aperçu Power Query */}
        <section className="space-y-2">
          <h2 className="text-xs font-bold tracking-wider text-muted uppercase">{shown < 0 ? 'Aperçu : table d’origine (Source)' : `Aperçu : après « ${names[shown]} »`}</h2>
          {preview.ok ? (
            <DataTable cols={preview.table.cols} rows={preview.table.rows} small />
          ) : (
            <div className="flex gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-sm" role="alert">
              <XCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
              <span>
                <span className="font-bold text-red-400">Expression.Error : </span>
                {preview.error}
              </span>
            </div>
          )}
          {mLine && (
            <p className="overflow-x-auto rounded-xl border border-line bg-card px-3 py-2 font-mono text-xs whitespace-pre text-fg/85" aria-label="Barre de formule">
              <span className="mr-2 font-bold text-violet-400">fx</span>= {mLine}
            </p>
          )}
        </section>

        {/* Étapes appliquées */}
        <section className="space-y-2">
          <h2 className="text-xs font-bold tracking-wider text-muted uppercase">Étapes appliquées</h2>
          <ol className="overflow-hidden rounded-2xl border border-line">
            <li>
              <button type="button" onClick={() => setView(-1)} className={`flex w-full items-center gap-2 border-b border-line px-3 py-2 text-left text-sm ${shown === -1 ? 'bg-violet-500/15 font-bold' : 'bg-card'}`}>
                Source
              </button>
            </li>
            {applied.map((id, i) => {
              const r = run.results[i]
              return (
                <li key={`${id}-${i}`} className={`flex items-center border-b border-line last:border-b-0 ${shown === i ? 'bg-violet-500/15' : 'bg-card'}`}>
                  <button type="button" onClick={() => setView(i)} className="flex min-w-0 flex-1 items-start gap-2 px-3 py-2 text-left text-sm">
                    {r.ok ? <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-400" /> : <XCircle size={16} className="mt-0.5 shrink-0 text-red-400" />}
                    <span className="min-w-0">
                      <span className={`block font-semibold ${r.ok ? '' : 'text-red-400'}`}>{names[i]}</span>
                      <span className="block text-xs text-muted">{describeStep(steps[i])}</span>
                    </span>
                  </button>
                  {!success && (
                    <button type="button" onClick={() => remove(i)} aria-label={`Supprimer l’étape ${names[i]}`} className="grid size-10 shrink-0 place-items-center text-muted">
                      <X size={16} />
                    </button>
                  )}
                </li>
              )
            })}
          </ol>
          {applied.length > 0 && !success && (
            <div className="flex gap-2">
              <button type="button" onClick={() => remove(lastIdx)} className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-line bg-card text-sm font-semibold">
                <Undo2 size={15} /> Annuler la dernière
              </button>
              <button type="button" onClick={reset} className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-line bg-card text-sm font-semibold">
                <Eraser size={15} /> Tout effacer
              </button>
            </div>
          )}
          {applied.length > 0 && (
            <div>
              <button type="button" onClick={() => setShowM((s) => !s)} aria-expanded={showM} className="flex items-center gap-1.5 text-sm font-semibold text-violet-400">
                Éditeur avancé (code M) <ChevronDown size={16} className={`transition-transform ${showM ? 'rotate-180' : ''}`} />
              </button>
              {showM && <div className="mt-2"><Code>{mCode(steps)}</Code></div>}
            </div>
          )}
        </section>

        {/* Transformations disponibles */}
        {!success && (
          <section className="space-y-2">
            <h2 className="text-xs font-bold tracking-wider text-muted uppercase">Transformations disponibles : choisis les bonnes, dans le bon ordre</h2>
            <ul className="space-y-2">
              {game.candidates.map((c) => {
                const used = applied.includes(c.id)
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      disabled={used}
                      onClick={() => add(c.id)}
                      className={`flex w-full items-center gap-2 rounded-2xl border p-3 text-left text-sm leading-snug font-semibold ${used ? 'border-line bg-card opacity-40' : 'border-line bg-card hover:border-violet-400'}`}
                    >
                      <Plus size={16} className="shrink-0 text-violet-400" />
                      <span>{describeStep(c.step)}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {/* Vérification */}
        {!success && applied.length > 0 && (
          <div className="space-y-2">
            <button type="button" onClick={() => setChecked(true)} className="h-12 w-full rounded-2xl bg-violet-500 font-bold text-white">
              Vérifier mon résultat
            </button>
            {checked && (
              <div className="rounded-2xl border border-amber-400/40 bg-amber-400/10 p-3 text-sm" role="status">
                <p className="font-extrabold text-amber-400">Ce n’est pas encore le tableau attendu.</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-5">
                  {(run.final ? diffs : ['Une étape est en erreur : clique dessus pour lire le message, puis supprime-la ou change l’ordre.']).map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Rappel / indice */}
        {!success && (
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
                      <p className="mb-1 text-xs font-bold tracking-wider text-muted uppercase">À repérer dans les données</p>
                      <ul className="list-disc space-y-0.5 pl-5 text-sm">
                        {game.problems.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </div>
                    <dl className="space-y-1.5">
                      {scenario.recall.map(([term, meaning]) => (
                        <div key={term} className="flex gap-3 text-sm leading-snug">
                          <dt className="w-28 shrink-0 font-bold text-violet-400">{term}</dt>
                          <dd className="text-fg/85">{meaning}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Solution (réduit les XP) */}
        {!success && (
          <div>
            {!solution ? (
              <button
                type="button"
                onClick={() => {
                  setSolution(true)
                  setUsedSolution(true)
                }}
                className="flex items-center gap-1.5 text-sm font-semibold text-muted"
              >
                <Eye size={16} /> Voir la solution (XP réduits)
              </button>
            ) : (
              <div className="space-y-2 rounded-2xl border border-line bg-card p-3">
                <p className="text-xs font-bold tracking-wider text-muted uppercase">Solution : les étapes dans l’ordre</p>
                <ol className="space-y-1">
                  {idealOrder.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="shrink-0 font-bold text-violet-400">{i + 1}.</span>
                      <span>{describeStep(s)}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Réussite */}
        {success && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center gap-4 rounded-3xl bg-violet-500 p-5 text-white">
              <Trophy size={40} className="shrink-0" />
              <div>
                <p className="text-xl font-extrabold">Tableau obtenu !</p>
                <p className="text-sm text-white/85">
                  {applied.length} étape{applied.length > 1 ? 's' : ''} (idéal : {game.ideal.length}).
                </p>
              </div>
              {xp > 0 && (
                <span className="ml-auto flex items-center gap-1 font-extrabold text-amber-300">
                  <Zap size={18} className="fill-amber-300" />+{xp}
                </span>
              )}
            </div>
            <div className="space-y-2 rounded-2xl border border-line bg-card p-4">
              <p className="text-xs font-bold tracking-wider text-muted uppercase">À retenir : ton code M</p>
              <Code>{mCode(steps)}</Code>
              <p className="text-sm text-muted">Dans le vrai Power Query, ce code est généré tout seul par tes clics et se rejoue à chaque actualisation.</p>
            </div>
            <button type="button" onClick={restart} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-line bg-card font-bold">
              <RotateCcw size={18} /> Rejouer avec de nouvelles données
            </button>
            <Link to="/atelier/bi/simulateur" className="block py-1 text-center text-sm font-semibold text-muted">
              Autres scénarios
            </Link>
          </motion.div>
        )}

        <SimulationNotice />
      </div>
    </Page>
  )
}
