import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Minus, PackageCheck, PackageX, Plus, Shuffle, Truck, Inbox, Zap } from 'lucide-react'
import Page from '../../../components/Page.jsx'
import SubHeader from '../../../components/SubHeader.jsx'
import { BEER_PROFILES, HOLDING, BACKLOG, LEAD, PLAYER, STAGES, WEEKS, newBeerGame, playBeerWeek, playerView, simulateAuto, summarizeBeer } from '../../../lib/beerGame.js'
import { recordBeerGame, useWorkshop } from '../../../lib/atelier.js'
import { celebrate } from '../../../lib/confetti.js'
import { Table } from './SituationModal.jsx'
import BeerChart from './BeerChart.jsx'

const euros = (n) => `${n.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} €`
const gapText = (gap) => `${gap > 0 ? '+' : ''}${Math.round(gap * 100)} %`

export default function BeerGame() {
  const workshop = useWorkshop()
  const [profile, setProfile] = useState('classique')
  const [game, setGame] = useState(null)
  const [order, setOrder] = useState(null)
  const [xp, setXp] = useState(null)
  const saved = useRef(false)
  const best = workshop?.get('biere')
  const finished = game && game.week >= WEEKS

  useEffect(() => {
    if (!finished || saved.current) return
    saved.current = true
    const mine = summarizeBeer(game).stages[PLAYER].cost
    const auto = summarizeBeer(simulateAuto(game.profile, false)).stages[PLAYER].cost
    const gap = auto > 0 ? (mine - auto) / auto : 0
    recordBeerGame({ gap }).then(setXp)
    if (mine <= auto) celebrate()
  }, [finished, game])

  function start() {
    saved.current = false
    setXp(null)
    const g = newBeerGame(profile)
    setGame(g)
    setOrder(g.flow)
  }

  if (!game) return <Intro profile={profile} onProfile={setProfile} onStart={start} best={best} />
  if (finished) return <Results game={game} xp={xp} onRestart={() => setGame(null)} />

  const view = playerView(game)
  const week = game.week + 1
  const s = game.stages[PLAYER]
  const quick = [0, view.incoming, view.incoming * 2, view.incoming * 3].filter((q, i, a) => a.indexOf(q) === i)
  const last = game.history.at(-1)?.stages[PLAYER]

  return (
    <Page>
      <SubHeader back="/atelier" title="Le jeu de la bière" subtitle={`Tu es le grossiste · semaine ${week} / ${WEEKS}`} />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2.5">
          <Box icon={Inbox} label="Commande reçue" value={view.incoming} detail="du détaillant, cette semaine" />
          <Box icon={PackageCheck} label="En stock" value={view.inv} detail={view.received > 0 ? `dont ${view.received} reçues ce matin` : 'avant livraison aux clients'} align="right" />
          <Box icon={Truck} label="Commandes en route" value={view.owed} detail="à recevoir de l'usine" />
          <Box
            icon={PackageX}
            label="En retard de livraison"
            value={view.backlogBefore}
            detail={view.backlogBefore > 0 ? 'à livrer dès que possible' : 'aucun retard'}
            level={view.backlogBefore > 0 ? 'bad' : undefined}
            align="right"
          />
        </div>
        <p className="rounded-2xl border border-line bg-card p-3 text-sm leading-snug">
          Cette semaine tu peux livrer <span className="font-bold">{view.ship}</span> caisses
          {view.backlogAfter > 0 ? <span className="font-semibold text-red-400"> · ! il en manquera {view.backlogAfter} (retard)</span> : ''}. Stock après livraison : <span className="font-bold">{view.invAfter}</span>.
        </p>

        {last && (
          <motion.div key={game.week} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-line bg-card p-3 text-sm">
            <p className="font-bold">Bilan de la semaine {game.week}</p>
            <p className="text-muted">
              Reçu {last.incoming} · livré {last.shipped} · stock {last.inv} · retard {last.backlog} · coût {euros(last.cost)}
            </p>
          </motion.div>
        )}

        {game.history.length > 1 && <BeerChart game={game} />}

        <div className="rounded-3xl border-2 border-violet-500 bg-card p-4">
          <p className="font-bold">Combien commandes-tu à l'usine ?</p>
          <p className="text-xs text-muted">
            Arrivée début S{week + LEAD} · stock {HOLDING} € par caisse en fin de semaine · retard {BACKLOG} € par caisse · ta dernière commande : {view.lastOrder}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button type="button" onClick={() => setOrder((q) => Math.max(0, q - 1))} className="grid size-11 place-items-center rounded-xl border border-line" aria-label="Moins 1">
              <Minus size={18} />
            </button>
            <input
              value={order}
              onChange={(e) => setOrder(Math.max(0, Number(e.target.value.replace(/\D/g, '')) || 0))}
              inputMode="numeric"
              className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-bg text-center text-xl font-extrabold"
              aria-label="Quantité à commander"
            />
            <button type="button" onClick={() => setOrder((q) => q + 1)} className="grid size-11 place-items-center rounded-xl border border-line" aria-label="Plus 1">
              <Plus size={18} />
            </button>
          </div>
          <div className="mt-2 flex gap-1.5">
            {quick.map((q) => (
              <button key={q} type="button" onClick={() => setOrder(q)} className={`h-8 flex-1 rounded-lg text-sm font-semibold ${order === q ? 'bg-violet-500 text-white' : 'border border-line'}`}>
                {q === view.incoming ? `${q} (= reçue)` : q}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              const next = playBeerWeek(game, order)
              setGame(next)
              setOrder(playerView(next.week < WEEKS ? next : game).incoming)
            }}
            className="mt-3 h-12 w-full rounded-2xl bg-violet-500 font-bold text-white"
          >
            Valider la semaine {week}
          </button>
        </div>
        <p className="text-center text-xs text-muted">
          Stock actuel {s.inv} · le détaillant, le distributeur et l'usine commandent seuls : tu ne vois que ce que ton client te demande.
        </p>
      </div>
    </Page>
  )
}

function Box({ icon: Icon, label, value, detail, align, level }) {
  return (
    <div className={`rounded-2xl border bg-card p-3 ${level === 'bad' ? 'border-red-500' : 'border-line'} ${align === 'right' ? '' : ''}`}>
      <p className="flex items-center gap-1.5 text-xs font-semibold text-muted">
        <Icon size={14} /> {label}
      </p>
      <p className={`mt-1 text-3xl font-extrabold ${level === 'bad' ? 'text-red-400' : ''}`}>
        {level === 'bad' && <span aria-hidden="true">! </span>}
        {value}
      </p>
      <p className="text-[11px] text-muted">{detail}</p>
    </div>
  )
}

function Intro({ profile, onProfile, onStart, best }) {
  return (
    <Page>
      <SubHeader back="/atelier" title="Le jeu de la bière" subtitle="Découvre l'effet coup de fouet" />
      <div className="space-y-4">
        <p className="text-[15px] leading-relaxed">
          Une chaîne de 4 maillons livre de la bière : <span className="font-semibold">détaillant → grossiste → distributeur → usine</span>. <span className="font-semibold">Tu es le grossiste.</span> Chaque semaine, tu
          décides combien de caisses commander à l'usine. Les 3 autres maillons commandent seuls.
        </p>
        <Table
          title="Les règles"
          rows={[
            ['Durée', `${WEEKS} semaines`],
            ['Délai de livraison', `${LEAD} semaines (commande en S → reçue début S+${LEAD})`],
            ['Coût de stockage', `${euros(HOLDING)} par caisse en stock en fin de semaine`],
            ['Coût de retard', `${euros(BACKLOG)} par caisse non livrée (elle reste à livrer)`],
            ['Ce que tu vois', 'Seulement la commande de ton client, ton stock et tes commandes en route'],
          ]}
        />
        <div>
          <p className="mb-1.5 text-xs font-bold tracking-wider text-muted uppercase">Profil de la demande des clients</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(BEER_PROFILES).map(([id, pr]) => (
              <button key={id} type="button" onClick={() => onProfile(id)} aria-pressed={profile === id} className={`h-9 rounded-xl px-3 text-sm font-semibold ${profile === id ? 'bg-violet-500 text-white' : 'border border-line'}`}>
                {pr.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">{BEER_PROFILES[profile].text}</p>
        </div>
        <div className="rounded-2xl bg-amber-400/10 p-3.5 text-sm leading-snug">
          <p className="font-bold">À observer</p>
          <p>
            Quand un changement de la demande remonte la chaîne, il se <span className="font-semibold">amplifie</span> à chaque maillon : c'est l'<span className="font-semibold">effet coup de fouet</span>. À la fin, tu verras
            les commandes de chaque maillon sur un graphique et tu pourras comparer ton résultat avec une chaîne qui partage l'information.
          </p>
        </div>
        {best?.games > 0 && (
          <p className="text-sm text-muted">
            {best.games} partie(s) jouée(s)
            {best.bestGap !== undefined && (
              <>
                {' '}
                · ton meilleur écart de coût avec la règle automatique : <span className="font-bold text-fg">{gapText(best.bestGap)}</span>
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
  const mine = summarizeBeer(game)
  const auto = summarizeBeer(simulateAuto(game.profile, false))
  const shared = summarizeBeer(simulateAuto(game.profile, true))
  const me = mine.stages[PLAYER].cost
  const won = me <= auto.stages[PLAYER].cost
  const rows = mine.stages.map((s, i) => [`${s.name}${i === PLAYER ? ' (toi)' : ''}`, `×${s.ratio.toFixed(1)}`, euros(s.cost)])
  const upstreamRatio = mine.stages.at(-1).ratio
  return (
    <Page>
      <SubHeader back="/atelier" title="Résultat" subtitle={`Jeu de la bière · ${BEER_PROFILES[game.profile].label}`} />
      <div className="space-y-4">
        <div className={`rounded-3xl p-5 text-white ${won ? 'bg-emerald-500' : 'bg-violet-500'}`}>
          <p className="text-sm text-white/85">Ton coût (grossiste)</p>
          <p className="text-4xl font-extrabold">{euros(me)}</p>
          <p className="mt-1 text-sm">
            {won
              ? `Tu as fait mieux que la règle automatique (${euros(auto.stages[PLAYER].cost)}) !`
              : `La règle automatique aurait coûté ${euros(auto.stages[PLAYER].cost)} à ta place (${gapText((me - auto.stages[PLAYER].cost) / auto.stages[PLAYER].cost)}).`}
          </p>
          {xp > 0 && (
            <p className="mt-2 flex items-center gap-1 font-extrabold text-amber-200">
              <Zap size={16} className="fill-amber-200" />+{xp} XP
            </p>
          )}
        </div>

        <BeerChart game={game} />

        <div className="overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-card text-xs text-muted">
              <tr>
                <th className="p-2 text-left">Maillon</th>
                <th className="p-2 text-right">Amplification des commandes</th>
                <th className="p-2 text-right">Coût</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, a, b]) => (
                <tr key={label} className="border-t border-line">
                  <td className="p-2">{label}</td>
                  <td className="p-2 text-right font-semibold">{a}</td>
                  <td className="p-2 text-right">{b}</td>
                </tr>
              ))}
              <tr className="border-t border-line bg-card font-bold">
                <td className="p-2">Toute la chaîne</td>
                <td className="p-2 text-right" />
                <td className="p-2 text-right">{euros(mine.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted">
          Amplification = écart-type des commandes du maillon ÷ écart-type de la demande des clients. ×1 = pas d'amplification ; l'usine a ici un coup de fouet de ×{upstreamRatio.toFixed(1)}.
        </p>

        <div className="rounded-2xl border border-line bg-card p-3.5 text-sm leading-snug">
          <p className="font-bold">Et si tout le monde partageait l'information ?</p>
          <p className="mt-1 text-muted">Chaque maillon voit directement la demande des clients au lieu de deviner à partir des commandes de son voisin.</p>
          <dl className="mt-2 space-y-1">
            <Line label="Coût de toute la chaîne (ta partie)" value={euros(mine.total)} />
            <Line label="Chaîne automatique, sans partage" value={euros(auto.total)} />
            <Line label="Chaîne automatique, avec partage" value={euros(shared.total)} strong />
            <Line label="Amplification de l'usine, avec partage" value={`×${shared.stages.at(-1).ratio.toFixed(1)}`} strong />
          </dl>
        </div>

        <div className="rounded-2xl bg-amber-400/10 p-3.5 text-sm leading-snug">
          <p className="font-bold">Pourquoi cet effet coup de fouet ?</p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>
              <span className="font-semibold">Chacun prévoit à partir des commandes de l'aval</span>, pas de la vraie demande : une hausse de 4 à 8 devient 12, puis 20…
            </li>
            <li>
              <span className="font-semibold">Les délais</span> ({LEAD} semaines) font réagir trop tard, puis trop fort : on commande plus pour rattraper le retard, puis la livraison arrive en bloc.
            </li>
            <li>
              <span className="font-semibold">Les commandes de précaution</span> gonflent la demande quand on craint la rupture.
            </li>
            <li>
              <span className="font-semibold">Le remède :</span> partager l'information sur la demande réelle, raccourcir les délais, lisser les commandes, éviter les promotions à répétition.
            </li>
          </ul>
        </div>

        <details className="rounded-2xl border border-line bg-card p-3 text-sm">
          <summary className="cursor-pointer font-semibold">Ton détail semaine par semaine</summary>
          <table className="mt-2 w-full text-xs">
            <thead className="text-muted">
              <tr>
                <th className="p-1 text-left">Sem.</th>
                <th className="p-1 text-right">Clients</th>
                <th className="p-1 text-right">Reçu</th>
                <th className="p-1 text-right">Commandé</th>
                <th className="p-1 text-right">Stock</th>
                <th className="p-1 text-right">Retard</th>
              </tr>
            </thead>
            <tbody>
              {game.history.map((h) => (
                <tr key={h.week} className="border-t border-line">
                  <td className="p-1">S{h.week}</td>
                  <td className="p-1 text-right">{h.demand}</td>
                  <td className="p-1 text-right">{h.stages[PLAYER].incoming}</td>
                  <td className="p-1 text-right">{h.stages[PLAYER].ordered}</td>
                  <td className="p-1 text-right">{h.stages[PLAYER].inv}</td>
                  <td className={`p-1 text-right ${h.stages[PLAYER].backlog ? 'font-bold text-red-400' : ''}`}>{h.stages[PLAYER].backlog}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>

        <button type="button" onClick={onRestart} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-violet-500 font-bold text-white">
          <Shuffle size={18} /> Rejouer (autre profil possible)
        </button>
        <p className="text-center text-xs text-muted">{STAGES.length} maillons · {WEEKS} semaines</p>
      </div>
    </Page>
  )
}

function Line({ label, value, strong }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className={strong ? 'font-extrabold text-emerald-400' : 'font-semibold'}>{value}</dd>
    </div>
  )
}
