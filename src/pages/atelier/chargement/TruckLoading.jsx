import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Check, Shuffle, Snowflake, Undo2, X, Zap } from 'lucide-react'
import Page from '../../../components/Page.jsx'
import SubHeader from '../../../components/SubHeader.jsx'
import { atelierFav } from '../../../lib/favorites.js'
import { Table } from '../simulateur/SituationModal.jsx'
import { COLS, ROWS, canStack, clonePlan, emptyPlan, evaluate, generateLoad, suggestPlan } from '../../../lib/truckLoading.js'
import { recordScoreGame, useWorkshop } from '../../../lib/atelier.js'
import { celebrate } from '../../../lib/confetti.js'

const kg = (n) => `${Math.round(n).toLocaleString('fr-FR')} kg`
const CLIENT_STYLE = { A: 'border-sky-400 bg-sky-400/15', B: 'border-amber-400 bg-amber-400/15', C: 'border-pink-400 bg-pink-400/15' }

export default function TruckLoading() {
  const workshop = useWorkshop()
  const [load, setLoad] = useState(generateLoad)
  const [plan, setPlan] = useState(emptyPlan)
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null)
  const [xp, setXp] = useState(null)
  const best = workshop?.get('chargement')
  const saved = useRef(false)

  const byId = Object.fromEntries(load.pallets.map((p) => [p.id, p]))
  const placedIds = new Set(plan.flat().flatMap((s) => [s.bottom, s.top].filter(Boolean)))
  const waiting = load.pallets.filter((p) => !placedIds.has(p.id))
  const live = evaluate(load, plan)

  useEffect(() => {
    if (!result || saved.current) return
    saved.current = true
    recordScoreGame('chargement', result.score).then(setXp)
    if (result.score >= 90) celebrate()
  }, [result])

  function place(r, c, level) {
    if (result || selected === null) return
    const pallet = byId[selected]
    const slot = plan[r][c]
    const next = clonePlan(plan)
    if (level === 0 && !slot.bottom) next[r][c].bottom = pallet.id
    else if (level === 1 && slot.bottom && !slot.top && canStack(byId[slot.bottom], pallet)) next[r][c].top = pallet.id
    else return
    setPlan(next)
    setSelected(null)
  }

  function remove(r, c, level) {
    if (result) return
    const next = clonePlan(plan)
    if (level === 1) next[r][c].top = null
    else if (!next[r][c].top) next[r][c].bottom = null
    else return // il faut d'abord enlever la palette du dessus
    setPlan(next)
  }

  function restart() {
    saved.current = false
    setLoad(generateLoad())
    setPlan(emptyPlan())
    setSelected(null)
    setResult(null)
    setXp(null)
    window.scrollTo({ top: 0 })
  }

  const selectedPallet = selected !== null ? byId[selected] : null
  const overPct = Math.min(100, Math.round(live.loadRate * 100))

  return (
    <Page>
      <SubHeader back="/atelier" title="Plan de chargement" subtitle="Charge le camion sans rien casser ni perdre de temps" fav={atelierFav({ key: 'chargement', title: 'Plan de chargement', sub: 'Atelier · camion et palettes', to: '/atelier/chargement' })} />
      <div className="space-y-4">
        {!result && (
          <p className="text-[15px] leading-relaxed">
            Le camion livre les clients <span className="font-semibold">dans l'ordre A, puis B, puis C</span>. Place toutes les palettes : touche une palette de la liste, puis une place du camion.
          </p>
        )}
        <details className="rounded-2xl border border-line bg-card p-3 text-sm" open={!result && !best?.games}>
          <summary className="cursor-pointer font-semibold">Les règles du chargement</summary>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
            <li>
              <span className="font-semibold text-fg">Dernier livré, premier chargé :</span> les palettes de C vont au fond (côté cabine), celles de A près de la porte, sinon il faut tout décharger.
            </li>
            <li>
              <span className="font-semibold text-fg">Charge utile :</span> le poids total ne doit pas dépasser {kg(load.payload)}.
            </li>
            <li>
              <span className="font-semibold text-fg">Lourd en bas et vers l'avant :</span> au moins 45 % et au plus 75 % du poids dans la moitié avant du camion.
            </li>
            <li>
              <span className="font-semibold text-fg">Palette fragile</span> (<Snowflake size={12} className="inline" />) : rien dessus. Une palette ne se pose que sur une palette plus lourde.
            </li>
          </ul>
        </details>

        <Table
          title="Ton chargement"
          rows={[
            ['Palettes à charger', `${load.pallets.length}`],
            ['Charge utile du camion', kg(load.payload)],
            ['Places au sol', `${ROWS * COLS} (2 niveaux si la palette du dessous le permet)`],
          ]}
        />

        {/* Indicateurs en direct */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className={`rounded-xl border p-2 ${live.overweight ? 'border-red-500' : 'border-line'} bg-card`}>
            <p className="text-muted">Poids</p>
            <p className={`text-sm font-extrabold ${live.overweight ? 'text-red-400' : ''}`}>
              {live.overweight && '! '}
              {kg(live.weight)}
            </p>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line">
              <div className={`h-full ${live.overweight ? 'bg-red-500' : 'bg-violet-500'}`} style={{ width: `${overPct}%` }} />
            </div>
          </div>
          <div className="rounded-xl border border-line bg-card p-2">
            <p className="text-muted">Chargées</p>
            <p className="text-sm font-extrabold">
              {live.placed.length} / {load.pallets.length}
            </p>
          </div>
          <div className={`rounded-xl border p-2 ${live.unbalanced ? 'border-orange-500' : 'border-line'} bg-card`}>
            <p className="text-muted">Poids à l'avant</p>
            <p className="text-sm font-extrabold">{live.weight ? `${Math.round(live.frontShare * 100)} %` : '—'}</p>
            {live.unbalanced && <p className="text-[10px] font-semibold text-orange-400">hors 45–75 %</p>}
          </div>
        </div>

        {/* Camion : cabine en haut, porte en bas */}
        <div className="rounded-2xl border border-line bg-card p-3">
          <p className="mb-1 text-center text-[11px] font-bold tracking-wider text-muted uppercase">Cabine</p>
          <div className="space-y-1.5">
            {Array.from({ length: ROWS }, (_, k) => ROWS - 1 - k).map((r) => (
              <div key={r} className="grid grid-cols-2 gap-1.5">
                {Array.from({ length: COLS }, (_, c) => (
                  <Slot key={c} slot={plan[r][c]} byId={byId} selected={selectedPallet} onPlace={(level) => place(r, c, level)} onRemove={(level) => remove(r, c, level)} locked={!!result} />
                ))}
              </div>
            ))}
          </div>
          <p className="mt-1 text-center text-[11px] font-bold tracking-wider text-muted uppercase">Porte arrière (déchargement)</p>
        </div>

        {!result && (
          <>
            <div>
              <p className="mb-1.5 text-xs font-bold tracking-wider text-muted uppercase">À charger ({waiting.length})</p>
              {waiting.length === 0 ? (
                <p className="rounded-2xl border border-line bg-card p-3 text-sm text-muted">Toutes les palettes sont placées.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {waiting.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelected(selected === p.id ? null : p.id)}
                      aria-pressed={selected === p.id}
                      className={`rounded-xl border-2 px-2.5 py-1.5 text-left text-xs ${CLIENT_STYLE[p.client]} ${selected === p.id ? 'ring-2 ring-violet-500' : ''}`}
                    >
                      <span className="block font-extrabold">
                        Client {p.client} {p.fragile && <Snowflake size={12} className="inline" aria-label="fragile" />}
                      </span>
                      <span className="block">{kg(p.weight)}</span>
                    </button>
                  ))}
                </div>
              )}
              {selectedPallet && <p className="mt-2 text-xs text-violet-300">Palette {selectedPallet.client} · {kg(selectedPallet.weight)} sélectionnée : touche « sol » ou « dessus » dans le camion.</p>}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setPlan(emptyPlan()); setSelected(null) }} className="flex h-12 items-center justify-center gap-1.5 rounded-2xl border border-line px-4 font-semibold">
                <Undo2 size={18} /> Tout vider
              </button>
              <button type="button" disabled={waiting.length === load.pallets.length} onClick={() => setResult(evaluate(load, plan))} className="h-12 flex-1 rounded-2xl bg-violet-500 font-bold text-white disabled:opacity-40">
                Valider le chargement
              </button>
            </div>
            {best?.games > 0 && <p className="text-sm text-muted">{best.games} partie(s) · meilleur score : <span className="font-bold text-fg">{best.bestScore} / 100</span></p>}
          </>
        )}

        {result && <Result load={load} result={result} xp={xp} onRestart={restart} />}
      </div>
    </Page>
  )
}

function Slot({ slot, byId, selected, onPlace, onRemove, locked }) {
  const bottom = slot.bottom ? byId[slot.bottom] : null
  const top = slot.top ? byId[slot.top] : null
  const canTop = !!selected && !!bottom && !top && canStack(bottom, selected)
  const canBottom = !!selected && !bottom
  return (
    <div className="space-y-0.5 rounded-xl bg-bg p-0.5">
      <Cell pallet={top} kind="dessus" active={canTop} onPlace={() => onPlace(1)} onRemove={() => onRemove(1)} locked={locked} />
      <Cell pallet={bottom} kind="sol" active={canBottom} onPlace={() => onPlace(0)} onRemove={() => onRemove(0)} locked={locked} />
    </div>
  )
}

function Cell({ pallet, kind, active, onPlace, onRemove, locked }) {
  if (pallet)
    return (
      <button type="button" disabled={locked} onClick={onRemove} className={`flex h-7 w-full items-center justify-between rounded-lg border-2 px-1.5 text-[11px] font-bold ${CLIENT_STYLE[pallet.client]}`} aria-label={`Retirer la palette ${pallet.client} ${pallet.weight} kg`}>
        <span>
          {pallet.client} {pallet.fragile && <Snowflake size={10} className="inline" aria-label="fragile" />}
        </span>
        <span>{pallet.weight}</span>
      </button>
    )
  return (
    <button type="button" disabled={!active || locked} onClick={onPlace} className={`h-7 w-full rounded-lg border border-dashed text-[10px] ${active ? 'border-violet-400 bg-violet-500/15 font-bold text-violet-300' : 'border-line text-muted/60'}`}>
      {kind}
    </button>
  )
}

function Result({ load, result, xp, onRestart }) {
  const [showPlan, setShowPlan] = useState(false)
  const suggested = suggestPlan(load)
  const byId = Object.fromEntries(load.pallets.map((p) => [p.id, p]))
  const ev = evaluate(load, suggested)
  const checks = [
    { ok: result.missing === 0, text: result.missing === 0 ? 'Toutes les palettes sont chargées' : `${result.missing} palette(s) non chargée(s) : −${result.missing * 8} points` },
    { ok: !result.overweight, text: result.overweight ? `Surcharge : ${kg(result.weight)} pour ${kg(load.payload)} autorisés : −30 points` : `Poids respecté (${kg(result.weight)} sur ${kg(load.payload)})` },
    {
      ok: result.conflicts.length === 0,
      text: result.conflicts.length === 0 ? 'Ordre de livraison respecté : aucun déchargement inutile' : `${result.conflicts.length} blocage(s) au déchargement (une palette livrée plus tard est devant ou sur une autre) : −${Math.min(36, result.conflicts.length * 6)} points`,
    },
    { ok: !result.unbalanced, text: result.unbalanced ? `Répartition du poids déséquilibrée : ${Math.round(result.frontShare * 100)} % à l'avant (visé : 45 à 75 %) : −10 points` : `Poids bien réparti (${Math.round(result.frontShare * 100)} % à l'avant)` },
  ]
  return (
    <div className="space-y-4">
      <div className={`rounded-3xl p-5 text-white ${result.score >= 90 ? 'bg-emerald-500' : 'bg-violet-500'}`}>
        <p className="text-sm text-white/85">Ton score</p>
        <p className="text-4xl font-extrabold">{result.score} / 100</p>
        <p className="mt-1 text-sm">
          Remplissage du sol : {Math.round(result.fill * 100)} % · charge utile utilisée : {Math.round(result.loadRate * 100)} %
        </p>
        {xp > 0 && (
          <p className="mt-2 flex items-center gap-1 font-extrabold text-amber-200">
            <Zap size={16} className="fill-amber-200" />+{xp} XP
          </p>
        )}
      </div>
      <ul className="space-y-2">
        {checks.map((c) => (
          <motion.li key={c.text} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2 rounded-2xl border border-line bg-card p-3 text-sm">
            {c.ok ? <Check size={18} className="mt-0.5 shrink-0 text-emerald-400" /> : <X size={18} className="mt-0.5 shrink-0 text-red-400" />}
            <span>
              <span className="font-bold">{c.ok ? 'Bien : ' : 'À revoir : '}</span>
              {c.text}
            </span>
          </motion.li>
        ))}
      </ul>
      <button type="button" onClick={() => setShowPlan((v) => !v)} className="h-11 w-full rounded-2xl border border-line font-semibold">
        {showPlan ? 'Masquer' : 'Voir'} un plan possible (score {ev.score})
      </button>
      {showPlan && (
        <div className="rounded-2xl border border-line bg-card p-3">
          <p className="mb-2 text-sm text-muted">On charge d'abord le dernier client (C) côté cabine, les palettes les plus lourdes en premier, puis B, puis A près de la porte.</p>
          <div className="space-y-1.5">
            {Array.from({ length: ROWS }, (_, k) => ROWS - 1 - k).map((r) => (
              <div key={r} className="grid grid-cols-2 gap-1.5">
                {suggested[r].map((slot, c) => (
                  <div key={c} className={`flex h-7 items-center justify-between rounded-lg border-2 px-1.5 text-[11px] font-bold ${slot.bottom ? CLIENT_STYLE[byId[slot.bottom].client] : 'border-dashed border-line'}`}>
                    {slot.bottom ? (
                      <>
                        <span>{byId[slot.bottom].client}</span>
                        <span>{byId[slot.bottom].weight}</span>
                      </>
                    ) : (
                      <span className="text-muted/60">vide</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      <button type="button" onClick={onRestart} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-violet-500 font-bold text-white">
        <Shuffle size={18} /> Nouveau chargement
      </button>
    </div>
  )
}
