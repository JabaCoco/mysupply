import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Handshake, Shuffle, User, Zap } from 'lucide-react'
import Page from '../../../components/Page.jsx'
import SubHeader from '../../../components/SubHeader.jsx'
import { atelierFav } from '../../../lib/favorites.js'
import { Table } from '../simulateur/SituationModal.jsx'
import { LEVERS, MAX_ROUNDS, applyLever, bestSequence, generateNegotiation, initialState, playSequence, scoreNegotiation, totalCost } from '../../../lib/negotiation.js'
import { recordScoreGame, useWorkshop } from '../../../lib/atelier.js'
import { celebrate } from '../../../lib/confetti.js'

const euros = (n, d = 0) => `${n.toLocaleString('fr-FR', { maximumFractionDigits: d })} €`
const label = (id) => LEVERS.find((l) => l.id === id).label

export default function Negotiation() {
  const workshop = useWorkshop()
  const [scn, setScn] = useState(generateNegotiation)
  const [state, setState] = useState(() => initialState(scn))
  const [done, setDone] = useState(false)
  const [xp, setXp] = useState(null)
  const saved = useRef(false)
  const best = workshop?.get('negociation')
  const endRef = useRef(null)

  const score = done ? scoreNegotiation(scn, state) : 0

  useEffect(() => {
    if (!done || saved.current) return
    saved.current = true
    recordScoreGame('negociation', score).then(setXp)
    if (score >= 90) celebrate()
  }, [done, score])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [state.log.length])

  function restart() {
    const s = generateNegotiation()
    saved.current = false
    setScn(s)
    setState(initialState(s))
    setDone(false)
    setXp(null)
    window.scrollTo({ top: 0 })
  }

  const start = totalCost(scn, initialState(scn))
  const now = totalCost(scn, state)
  const left = MAX_ROUNDS - state.used.length

  return (
    <Page>
      <SubHeader back="/atelier" title="Négociation avec un fournisseur" subtitle={done ? 'Accord conclu' : `Levier ${Math.min(state.used.length + 1, MAX_ROUNDS)} / ${MAX_ROUNDS}`} fav={atelierFav({ key: 'negociation', title: 'Négociation avec un fournisseur', sub: 'Atelier · leviers de négociation', to: '/atelier/negociation' })} />
      <div className="space-y-4">
        {!done && state.used.length === 0 && (
          <>
            <p className="text-[15px] leading-relaxed">
              Tu es acheteur et tu renouvelles ton contrat annuel pour {scn.product}. Tu as <span className="font-semibold">{MAX_ROUNDS} leviers à jouer au maximum</span>, dans l'ordre de ton choix.{' '}
              <span className="font-semibold">Objectif : le coût total annuel le plus bas</span>, pas seulement le prix.
            </p>
            <Table
              title="Le dossier"
              rows={[
                ['Besoin annuel', `${scn.need.toLocaleString('fr-FR')} unités`],
                ['Prix catalogue proposé', `${euros(scn.price, 2)} l'unité`],
                ['Paiement proposé', `${scn.pay0} jours`],
                ['Délai de livraison', `${scn.lead0} jours`],
                ["Coût de l'argent", `${Math.round(scn.rate * 100)} % par an (payer plus tôt coûte)`],
                ['Coût de possession du stock', `${Math.round(scn.holding * 100)} % par an (un délai plus long = plus de stock)`],
              ]}
            />
            {best?.games > 0 && (
              <p className="text-sm text-muted">
                {best.games} partie(s) · meilleur score : <span className="font-bold text-fg">{best.bestScore} / 100</span>
              </p>
            )}
          </>
        )}

        {/* Situation en cours */}
        <div className="rounded-2xl border border-line bg-card p-3 text-sm">
          <p className="mb-1.5 text-xs font-bold tracking-wider text-muted uppercase">Où en est l'accord</p>
          <dl className="grid grid-cols-2 gap-x-3 gap-y-1">
            <Pair k="Prix" v={euros(state.price, 2)} />
            <Pair k="Paiement" v={`${state.pay} jours`} />
            <Pair k="Livraison" v={`${state.lead} jours`} />
            <Pair k="Engagement" v={`${Math.round(state.commit * 100)} % du besoin`} />
          </dl>
          <p className="mt-2 border-t border-line pt-2">
            Coût total annuel estimé : <span className="font-extrabold">{euros(now.total)}</span>{' '}
            <span className={now.total < start.total ? 'font-semibold text-emerald-400' : 'text-muted'}>
              ({now.total <= start.total ? '−' : '+'}
              {euros(Math.abs(start.total - now.total))} par rapport au départ)
            </span>
          </p>
        </div>

        {/* Échanges */}
        {state.log.length > 0 && (
          <div className="space-y-2.5" aria-live="polite">
            {state.log.map((m, i) => (
              <div key={i} className="space-y-1.5">
                <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="ml-8 flex items-start justify-end gap-2">
                  <p className="rounded-2xl rounded-tr-sm bg-violet-500 px-3 py-2 text-sm text-white">{label(m.id)}</p>
                  <User size={18} className="mt-2 shrink-0 text-muted" aria-label="Toi" />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="mr-8 flex items-start gap-2">
                  <Handshake size={18} className="mt-2 shrink-0 text-amber-400" aria-label="Fournisseur" />
                  <p className="rounded-2xl rounded-tl-sm border border-line bg-card px-3 py-2 text-sm">{m.reply}</p>
                </motion.div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        )}

        {!done && (
          <>
            <div className="rounded-3xl border-2 border-violet-500 bg-card p-3.5">
              <p className="font-bold">{left > 0 ? `Quel levier joues-tu ? (${left} restant${left > 1 ? 's' : ''})` : 'Tous tes leviers sont joués'}</p>
              <div className="mt-2 space-y-1.5">
                {LEVERS.map((l) => {
                  const used = state.used.includes(l.id)
                  return (
                    <button
                      key={l.id}
                      type="button"
                      disabled={used || left === 0}
                      onClick={() => setState((s) => applyLever(scn, s, l.id))}
                      className="w-full rounded-xl border border-line px-3 py-2 text-left disabled:opacity-40"
                    >
                      <span className="block text-sm font-semibold">{l.label}</span>
                      <span className="block text-xs text-muted">{l.hint}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <button type="button" disabled={state.used.length === 0} onClick={() => setDone(true)} className="h-12 w-full rounded-2xl bg-violet-500 font-bold text-white disabled:opacity-40">
              Conclure l'accord
            </button>
          </>
        )}

        {done && <Result scn={scn} state={state} score={score} xp={xp} onRestart={restart} />}
      </div>
    </Page>
  )
}

function Pair({ k, v }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-muted">{k}</dt>
      <dd className="font-semibold">{v}</dd>
    </div>
  )
}

function Result({ scn, state, score, xp, onRestart }) {
  const start = totalCost(scn, initialState(scn))
  const mine = totalCost(scn, state)
  const best = bestSequence(scn)
  const bestState = playSequence(scn, best.seq, false)
  const bestCost = totalCost(scn, bestState)
  const rows = [
    ['Achat (prix × besoin)', start.base, mine.base, bestCost.base],
    ['Avantage de trésorerie (délai de paiement)', -start.financing, -mine.financing, -bestCost.financing],
    ['Coût de stock lié au délai de livraison', start.leadCost, mine.leadCost, bestCost.leadCost],
    ["Engagement non consommé", start.penalty, mine.penalty, bestCost.penalty],
    ['Coût total annuel', start.total, mine.total, bestCost.total],
  ]
  return (
    <div className="space-y-4">
      <div className={`rounded-3xl p-5 text-white ${score >= 90 ? 'bg-emerald-500' : 'bg-violet-500'}`}>
        <p className="text-sm text-white/85">Ton score</p>
        <p className="text-4xl font-extrabold">{score} / 100</p>
        <p className="mt-1 text-sm">
          Tu as économisé {euros(start.total - mine.total)} par an sur {euros(start.total - bestCost.total)} possibles.
        </p>
        {xp > 0 && (
          <p className="mt-2 flex items-center gap-1 font-extrabold text-amber-200">
            <Zap size={16} className="fill-amber-200" />+{xp} XP
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-line">
        <table className="w-full text-xs">
          <thead className="bg-card text-muted">
            <tr>
              <th className="p-2 text-left" />
              <th className="p-2 text-right">Départ</th>
              <th className="p-2 text-right">Toi</th>
              <th className="p-2 text-right">Meilleur</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, a, b, c], i) => (
              <tr key={name} className={`border-t border-line ${i === rows.length - 1 ? 'bg-card font-bold' : ''}`}>
                <td className="p-2">{name}</td>
                <td className="p-2 text-right">{euros(a)}</td>
                <td className="p-2 text-right">{euros(b)}</td>
                <td className="p-2 text-right text-muted">{euros(c)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-line bg-card p-3.5 text-sm leading-snug">
        <p className="font-bold">Le meilleur enchaînement possible ici</p>
        <ol className="mt-1 list-decimal space-y-0.5 pl-5">
          {best.seq.map((id) => (
            <li key={id}>{label(id)}</li>
          ))}
        </ol>
        <p className="mt-2 text-xs text-muted">
          {scn.competitor ? `Un concurrent proposait ${euros(scn.competitor, 2)}` : 'Il n\'y avait pas de concurrent moins cher'} · prix plancher du fournisseur : {euros(scn.floor, 2)} (il ne descendra jamais plus bas).
        </p>
      </div>

      <div className="rounded-2xl bg-amber-400/10 p-3.5 text-sm leading-snug">
        <p className="font-bold">Ce qu'il faut retenir</p>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>
            <span className="font-semibold">Prépare-toi :</span> avec des faits (benchmark), une demande de remise vaut presque trois fois plus.
          </li>
          <li>
            <span className="font-semibold">Échange, ne demande pas seulement :</span> volume, paiement et délai sont des monnaies d'échange.
          </li>
          <li>
            <span className="font-semibold">Regarde le coût total :</span> un bon prix peut cacher un stock plus cher, une trésorerie sous tension ou un engagement que tu ne consommeras pas.
          </li>
          <li>
            <span className="font-semibold">Ne bluffe pas :</span> un faux devis concurrent fait perdre la moitié des concessions suivantes.
          </li>
        </ul>
      </div>

      <button type="button" onClick={onRestart} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-violet-500 font-bold text-white">
        <Shuffle size={18} /> Nouvelle négociation
      </button>
    </div>
  )
}
