import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CalendarClock, CalendarRange, ClipboardList, Minus, PackageCheck, Plus, Shuffle, Truck, Zap } from 'lucide-react'
import Page from '../../../components/Page.jsx'
import SubHeader from '../../../components/SubHeader.jsx'
import { forecast, generateScenario, newGame, playReference, playWeek, referenceFor, summarize } from '../../../lib/simulation.js'
import { recordSimulation, useWorkshop } from '../../../lib/atelier.js'
import { celebrate } from '../../../lib/confetti.js'
import SimCourse, { scenarioRows } from './SimCourse.jsx'
import SituationModal, { Table } from './SituationModal.jsx'
import StockBox, { stockLevel } from './StockBox.jsx'
import StockChart from './StockChart.jsx'

const euros = (n) => `${Math.round(n).toLocaleString('fr-FR')} €`
const gapText = (gap) => `${gap > 0 ? '+' : ''}${Math.round(gap * 100)} %`

export default function Simulator() {
  const workshop = useWorkshop()
  // Nouveau scénario (demande, délai, coûts…) à chaque partie
  const [scenario, setScenario] = useState(generateScenario)
  const [game, setGame] = useState(null)
  const [order, setOrder] = useState(0)
  const [xp, setXp] = useState(null)
  const [showSituation, setShowSituation] = useState(false)
  const [help, setHelp] = useState(null) // case dont la bulle d'aide est ouverte
  const saved = useRef(false)
  const best = workshop?.get('simulateur')

  const finished = game && game.week >= game.params.weeks

  // Fin de partie : on enregistre une seule fois
  useEffect(() => {
    if (!finished || saved.current) return
    saved.current = true
    const mine = summarize(game.history)
    const ref = summarize(playReference(game.params, game.demand).history)
    recordSimulation({ cost: mine.cost, service: mine.service, gap: (mine.cost - ref.cost) / ref.cost }).then(setXp)
    if (mine.cost <= ref.cost) celebrate()
  }, [finished, game])

  function start() {
    saved.current = false
    setXp(null)
    setOrder(0)
    setHelp(null)
    setGame(newGame(scenario))
  }

  function newScenario() {
    setScenario(generateScenario())
    setGame(null)
    window.scrollTo({ top: 0 })
  }

  if (!game) return <Intro params={scenario} onStart={start} onShuffle={() => setScenario(generateScenario())} best={best} />
  if (finished) return <Results game={game} xp={xp} onRestart={newScenario} />

  const p = game.params
  const ref = referenceFor(p)
  const ss = ref.safetyStock
  const onOrder = game.pipeline.reduce((s, o) => s + o.qty, 0)
  const f = forecast(game, order)
  const last = game.history.at(-1)
  const week = game.week + 1
  const toggle = (id) => setHelp((h) => (h === id ? null : id))
  const quick = [0, ...[0.5, 1, 1.5, 2, 3].map((k) => Math.round((p.mean * k) / 10) * 10)].filter((q, i, a) => a.indexOf(q) === i).slice(0, 5)

  return (
    <Page>
      <SubHeader back="/atelier" title="Simulateur de stock" subtitle={`${p.product} · semaine ${week} / ${p.weeks}`} />
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setShowSituation(true)}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-line bg-card text-sm font-semibold"
        >
          <ClipboardList size={18} /> Revoir la situation
        </button>
        <AnimatePresence>{showSituation && <SituationModal game={game} onClose={() => setShowSituation(false)} />}</AnimatePresence>

        {/* Les 4 cases du tableau de bord */}
        <div className="grid grid-cols-2 gap-2.5">
          <StockBox
            icon={PackageCheck}
            label="En stock"
            value={game.stock}
            level={stockLevel(game.stock, ss)}
            helpOpen={help === 'stock'}
            onToggleHelp={() => toggle('stock')}
            detail={game.lastReceived > 0 ? `dont ${game.lastReceived} u. reçues ce matin` : 'disponible maintenant'}
            help={
              <>
                <p>Quantité disponible maintenant, au début de la semaine {week}.</p>
                <p>Les livraisons prévues pour cette semaine sont déjà rangées et comptées{game.lastReceived > 0 ? ` (+${game.lastReceived} u.)` : ''}.</p>
                <p className="text-muted">Orange sous {ss} u. (stock de sécurité), rouge à 0.</p>
              </>
            }
          />
          <StockBox
            icon={Truck}
            label="En commande"
            value={onOrder}
            align="right"
            helpOpen={help === 'order'}
            onToggleHelp={() => toggle('order')}
            detail={
              game.pipeline.length ? (
                <ul>
                  {game.pipeline.map((o, i) => (
                    <li key={i} className="font-semibold text-fg/85">
                      {o.qty} u. → début S{o.arrival + 1}
                    </li>
                  ))}
                </ul>
              ) : (
                'aucune commande en route'
              )
            }
            help={
              <>
                <p>Quantités déjà commandées mais pas encore reçues.</p>
                <p>
                  Délai de {p.lead} semaine{p.lead > 1 ? 's' : ''} : une commande passée en semaine S arrive au début de la semaine S + {p.lead}. Ta commande de cette semaine arrivera début S{week + p.lead}.
                </p>
              </>
            }
          />
          <StockBox
            icon={CalendarClock}
            label="Stock fin de semaine"
            value={Math.max(0, f.endOfWeek)}
            level={stockLevel(f.endOfWeek, ss)}
            helpOpen={help === 'end'}
            onToggleHelp={() => toggle('end')}
            detail={f.endOfWeek < 0 ? `il manquerait ~${-f.endOfWeek} u.` : 'estimation'}
            help={
              <>
                <p>Estimation à la fin de la semaine {week} :</p>
                <p className="font-mono text-xs">
                  en stock {game.stock} − demande moyenne {p.mean} = {f.endOfWeek}
                </p>
                <p>Les livraisons de cette semaine sont déjà dans « En stock ». La vraie demande peut varier (± {p.sd} environ).</p>
              </>
            }
          />
          <StockBox
            icon={CalendarRange}
            label="Stock prévu semaine prochaine"
            value={Math.max(0, f.nextWeekEnd)}
            level={stockLevel(f.nextWeekEnd, ss)}
            align="right"
            helpOpen={help === 'next'}
            onToggleHelp={() => toggle('next')}
            detail={f.nextWeekEnd < 0 ? `il manquerait ~${-f.nextWeekEnd} u.` : `fin S${week + 1}${f.arrivingNext ? `, avec +${f.arrivingNext} reçues` : ''}`}
            help={
              <>
                <p>Estimation à la fin de la semaine {week + 1} :</p>
                <p className="font-mono text-xs">
                  stock fin de semaine {Math.max(0, f.endOfWeek)} + livraisons début S{week + 1} {f.arrivingNext} − demande moyenne {p.mean} = {f.nextWeekEnd}
                </p>
                {p.lead === 1 && <p>Avec 1 semaine de délai, la quantité que tu es en train de commander est incluse dans les livraisons.</p>}
              </>
            }
          />
        </div>
        <p className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted">
          <span>
            <span className="mr-1 inline-block size-2 rounded-full bg-orange-500" />
            sous le stock de sécurité ({ss} u.)
          </span>
          <span>
            <span className="mr-1 inline-block size-2 rounded-full bg-red-500" />
            rupture (0)
          </span>
          <span>ⓘ = comment c'est calculé</span>
        </p>

        {last && (
          <motion.div key={last.week} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-line bg-card p-3 text-sm">
            <p className="font-bold">Bilan de la semaine {last.week}</p>
            <p className="text-muted">
              Demande réelle {last.demand} · vendu {last.sold}
              {last.lost > 0 && <span className="font-semibold text-red-400"> · ! {last.lost} ventes perdues</span>} · coût {euros(last.cost)}
            </p>
          </motion.div>
        )}

        <StockChart history={game.history} weeks={p.weeks} reorderPoint={ref.reorderPoint} />

        {/* Décision de la semaine */}
        <div className="rounded-3xl border-2 border-violet-500 bg-card p-4">
          <p className="font-bold">Combien commandes-tu cette semaine ?</p>
          <p className="text-xs text-muted">
            Arrivée début S{week + p.lead} · {euros(p.orderCost)} par commande · position de stock actuelle : {game.stock + onOrder} u.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button type="button" onClick={() => setOrder((q) => Math.max(0, q - 10))} className="grid size-11 place-items-center rounded-xl border border-line" aria-label="Moins 10">
              <Minus size={18} />
            </button>
            <input
              value={order}
              onChange={(e) => setOrder(Math.max(0, Number(e.target.value.replace(/\D/g, '')) || 0))}
              inputMode="numeric"
              className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-bg text-center text-xl font-extrabold"
              aria-label="Quantité à commander"
            />
            <button type="button" onClick={() => setOrder((q) => q + 10)} className="grid size-11 place-items-center rounded-xl border border-line" aria-label="Plus 10">
              <Plus size={18} />
            </button>
          </div>
          <div className="mt-2 flex gap-1.5">
            {quick.map((q) => (
              <button key={q} type="button" onClick={() => setOrder(q)} className={`h-8 flex-1 rounded-lg text-sm font-semibold ${order === q ? 'bg-violet-500 text-white' : 'border border-line'}`}>
                {q}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setGame(playWeek(game, order))
              setOrder(0)
              setHelp(null)
            }}
            className="mt-3 h-12 w-full rounded-2xl bg-violet-500 font-bold text-white"
          >
            Valider la semaine {week}
          </button>
        </div>
      </div>
    </Page>
  )
}

function Intro({ params, onStart, onShuffle, best }) {
  return (
    <Page>
      <SubHeader back="/atelier" title="Simulateur de stock" subtitle="12 semaines pour gérer ton stock au meilleur coût" />
      <div className="space-y-4">
        <p className="text-[15px] leading-relaxed">
          Tu gères le stock d'un produit. Chaque semaine, tu décides combien commander. <span className="font-semibold">Objectif : le coût total le plus bas.</span> Les données
          changent à chaque partie.
        </p>
        <Table title="Ta mission" rows={scenarioRows(params)} />
        <button type="button" onClick={onShuffle} className="flex items-center gap-1.5 text-sm font-semibold text-violet-400">
          <Shuffle size={16} /> Tirer un autre scénario
        </button>
        <div>
          <p className="mb-2 font-extrabold">Avant de jouer : le rappel de cours</p>
          <SimCourse key={JSON.stringify(params)} params={params} defaultOpen />
        </div>
        {best?.games > 0 && (
          <p className="text-sm text-muted">
            {best.games} partie(s) jouée(s)
            {best.bestGap !== undefined && (
              <>
                {' '}
                · ton meilleur écart avec la méthode du cours : <span className="font-bold text-fg">{gapText(best.bestGap)}</span>
              </>
            )}
          </p>
        )}
        <button type="button" onClick={onStart} className="h-12 w-full rounded-2xl bg-violet-500 font-bold text-white">
          Commencer la partie
        </button>
      </div>
    </Page>
  )
}

function Results({ game, xp, onRestart }) {
  const p = game.params
  const ref = referenceFor(p)
  const mine = summarize(game.history)
  const refGame = summarize(playReference(p, game.demand).history)
  const won = mine.cost <= refGame.cost
  const rows = [
    ['Coût total', euros(mine.cost), euros(refGame.cost)],
    ['Stockage', euros(mine.holding), euros(refGame.holding)],
    ['Ruptures', euros(mine.shortage), euros(refGame.shortage)],
    ['Commandes passées', `${mine.orders} (${euros(mine.order)})`, `${refGame.orders} (${euros(refGame.order)})`],
    ['Taux de service', `${(mine.service * 100).toFixed(1)} %`, `${(refGame.service * 100).toFixed(1)} %`],
  ]
  return (
    <Page>
      <SubHeader back="/atelier" title="Résultat" subtitle={`Simulateur · ${p.product}`} />
      <div className="space-y-4">
        <div className={`rounded-3xl p-5 text-white ${won ? 'bg-emerald-500' : 'bg-violet-500'}`}>
          <p className="text-sm text-white/85">Ton coût total</p>
          <p className="text-4xl font-extrabold">{euros(mine.cost)}</p>
          <p className="mt-1 text-sm">
            {mine.cost === refGame.cost
              ? 'Tu as fait exactement aussi bien que la méthode du cours !'
              : won
                ? `Bravo, tu as battu la méthode du cours de ${euros(refGame.cost - mine.cost)} !`
                : `La méthode du cours aurait coûté ${euros(refGame.cost)}, soit ${euros(mine.cost - refGame.cost)} de moins (${gapText((mine.cost - refGame.cost) / refGame.cost)}).`}
          </p>
          {xp > 0 && (
            <p className="mt-2 flex items-center gap-1 font-extrabold text-amber-200">
              <Zap size={16} className="fill-amber-200" />+{xp} XP
            </p>
          )}
        </div>

        <StockChart history={game.history} weeks={p.weeks} reorderPoint={ref.reorderPoint} />

        <div className="overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-card text-xs text-muted">
              <tr>
                <th className="p-2 text-left" />
                <th className="p-2 text-right">Toi</th>
                <th className="p-2 text-right">Méthode du cours</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, a, b]) => (
                <tr key={label} className="border-t border-line">
                  <td className="p-2">{label}</td>
                  <td className="p-2 text-right font-semibold">{a}</td>
                  <td className="p-2 text-right text-muted">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="rounded-2xl bg-amber-400/10 p-3.5 text-sm leading-snug">
          <span className="font-bold">La méthode du cours :</span> commander {ref.quantity} unités (Wilson : √(2 × {p.mean} × {p.orderCost} / {p.holding})) dès que la position de stock passe sous{' '}
          {ref.reorderPoint} (point de commande : {p.mean} × {p.lead} + 1,65 × {p.sd} × √{p.lead}).
        </p>

        <details className="rounded-2xl border border-line bg-card p-3 text-sm">
          <summary className="cursor-pointer font-semibold">Détail semaine par semaine</summary>
          <table className="mt-2 w-full text-xs">
            <thead className="text-muted">
              <tr>
                <th className="p-1 text-left">Sem.</th>
                <th className="p-1 text-right">Commandé</th>
                <th className="p-1 text-right">Demande</th>
                <th className="p-1 text-right">Perdu</th>
                <th className="p-1 text-right">Stock fin</th>
                <th className="p-1 text-right">Coût</th>
              </tr>
            </thead>
            <tbody>
              {game.history.map((h) => (
                <tr key={h.week} className="border-t border-line">
                  <td className="p-1">S{h.week}</td>
                  <td className="p-1 text-right">{h.ordered}</td>
                  <td className="p-1 text-right">{h.demand}</td>
                  <td className={`p-1 text-right ${h.lost ? 'font-bold text-red-400' : ''}`}>{h.lost}</td>
                  <td className="p-1 text-right">{h.endStock}</td>
                  <td className="p-1 text-right">{euros(h.cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>

        <button type="button" onClick={onRestart} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-violet-500 font-bold text-white">
          <Shuffle size={18} /> Rejouer avec un nouveau scénario
        </button>
      </div>
    </Page>
  )
}
