import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { motion } from 'motion/react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db.js'
import { CheckCircle2, RotateCcw, X, XCircle, Zap } from 'lucide-react'
import Page from '../../components/Page.jsx'
import { Inline } from '../../components/RichText.jsx'
import { cardKey, reviewCard, useRevisions } from '../../lib/revStore.js'
import { cardsOf } from '../../lib/revFormat.js'
import { pickSession } from '../../lib/revSrs.js'
import { celebrate } from '../../lib/confetti.js'
import { cardFav } from '../../lib/favorites.js'
import FavButton from '../../components/FavButton.jsx'
import RichBlock from './RichBlock.jsx'

const TYPE_OF_MODE = { flash: 'flashcard', qcm: 'qcm', qa: 'qa' }
const shuffle = (a) => {
  const x = [...a]
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[x[i], x[j]] = [x[j], x[i]]
  }
  return x
}

// Séance de révision : flashcards (dans les deux sens), QCM et questions-réponses, avec répétition espacée
export default function Study() {
  const { scope, mode } = useParams()
  const [search] = useSearchParams()
  const data = useRevisions()
  const [session, setSession] = useState(null)
  const started = useRef(false)
  const busy = useRef(false)
  // Réglage retenu : 'recto' (recto d'abord, par défaut) ou 'both' (dans les deux sens, au hasard)
  const flashMode = useLiveQuery(async () => (await db.meta.get('rvFlashMode'))?.value ?? 'recto', [])

  const back = scope === 'tous' ? '/revisions' : `/revisions/lot/${scope}`

  // Toutes les cartes de la portée choisie (un lot ou tous), filtrées par mode
  const universe = useMemo(() => {
    if (!data || !flashMode) return []
    const wanted = TYPE_OF_MODE[mode]
    return data.lots
      .filter((l) => scope === 'tous' || l.id === scope)
      .flatMap((lot) => {
        const byId = new Map(lot.items.map((it) => [it.id, it]))
        return cardsOf(lot)
          .map((c) => ({ key: cardKey(lot.id, c.itemId, c.dir), item: byId.get(c.itemId), dir: c.dir, lot }))
          .filter((c) => !wanted || c.item.type === wanted)
          // « Recto d'abord » : on ne propose pas les cartes dans le sens verso → recto
          .filter((c) => flashMode === 'both' || c.item.type !== 'flashcard' || c.dir === 'f')
      })
  }, [data, scope, mode, flashMode])

  async function chooseFlashMode(value) {
    if (value === flashMode) return
    started.current = false // la séance est recomposée avec le nouveau réglage
    await db.meta.put({ key: 'rvFlashMode', value })
  }

  function begin(keys) {
    setSession({ queue: keys, index: 0, known: 0, review: 0, xp: 0, requeued: [], missed: [] })
  }

  useEffect(() => {
    if (!data || !flashMode || started.current) return
    started.current = true
    const withProgress = universe.map((c) => ({ key: c.key, progress: data.progress.get(c.key) }))
    const all = search.get('tout') === '1'
    const keys = all ? shuffle(universe.map((c) => c.key)) : pickSession(withProgress, data.today, { limit: mode === 'jour' ? 20 : 40 })
    begin(keys)
  }, [data, universe, mode, search, flashMode])

  if (!data || !session || !flashMode) return null
  const hasFlash = universe.some((c) => c.item.type === 'flashcard')
  const byKey = new Map(universe.map((c) => [c.key, c]))
  const total = session.queue.length
  const done = session.index >= total
  const current = !done ? byKey.get(session.queue[session.index]) : null

  async function answer(known) {
    if (busy.current || !current) return
    busy.current = true
    try {
      const xp = await reviewCard(current.key, known, current.item.type === 'qcm' ? 'qcm' : 'card')
      setSession((s) => {
        const key = s.queue[s.index]
        const again = !known && !s.requeued.includes(key)
        return {
          ...s,
          queue: again ? [...s.queue, key] : s.queue,
          requeued: again ? [...s.requeued, key] : s.requeued,
          missed: known ? s.missed : [...new Set([...s.missed, key])],
          index: s.index + 1,
          known: s.known + (known ? 1 : 0),
          review: s.review + (known ? 0 : 1),
          xp: s.xp + xp,
        }
      })
    } finally {
      busy.current = false
    }
  }

  return (
    <Page>
      <div className="mb-4 flex items-center gap-3">
        <Link to={back} className="grid size-10 shrink-0 place-items-center rounded-full text-muted hover:bg-card" aria-label="Quitter la séance">
          <X size={22} />
        </Link>
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-card" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={Math.min(session.index, total)}>
          <motion.div className="h-full rounded-full bg-orange-500" animate={{ width: `${total ? (Math.min(session.index, total) / total) * 100 : 0}%` }} />
        </div>
        <span className="w-12 text-right text-xs font-bold text-muted">
          {Math.min(session.index + 1, total)} / {total}
        </span>
      </div>

      {hasFlash && session.index === 0 && (
        <div className="mb-3 flex rounded-2xl border border-line bg-card p-1 text-sm font-bold" role="radiogroup" aria-label="Sens des flashcards">
          {[
            ['recto', 'Recto d\'abord'],
            ['both', 'Dans les deux sens'],
          ].map(([value, label]) => (
            <button key={value} type="button" role="radio" aria-checked={flashMode === value} onClick={() => chooseFlashMode(value)} className={`h-10 flex-1 rounded-xl ${flashMode === value ? 'bg-violet-500 text-white' : 'text-muted'}`}>
              {label}
            </button>
          ))}
        </div>
      )}
      {total === 0 && <Empty back={back} hasCards={universe.length > 0} onAll={() => begin(shuffle(universe.map((c) => c.key)))} />}
      {total > 0 && done && <Summary session={session} back={back} onRetry={() => begin(shuffle(session.missed))} />}
      {current && (
        <div key={`${session.index}-${current.key}`}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="min-w-0 text-xs font-bold tracking-wider text-orange-400 uppercase">{current.lot.title}</p>
            <FavButton item={cardFav(current.lot, current.item)} className="-my-1.5 -mr-2" />
          </div>
          {current.item.type === 'flashcard' && <Flash item={current.item} dir={current.dir} onAnswer={answer} />}
          {current.item.type === 'qa' && <QaCard item={current.item} onAnswer={answer} />}
          {current.item.type === 'qcm' && <QcmCard item={current.item} onAnswer={answer} />}
        </div>
      )}
    </Page>
  )
}

function Answers({ onAnswer, labels = ['À revoir', 'Je connais'] }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2.5">
      <button type="button" onClick={() => onAnswer(false)} className="flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-orange-500 font-bold text-orange-400">
        <RotateCcw size={18} /> {labels[0]}
      </button>
      <button type="button" onClick={() => onAnswer(true)} className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-500 font-bold text-white">
        <CheckCircle2 size={18} /> {labels[1]}
      </button>
    </div>
  )
}

const FACE = { backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }

function Flash({ item, dir, onAnswer }) {
  const [flipped, setFlipped] = useState(false)
  const front = dir === 'f' ? item.recto : item.verso
  const back = dir === 'f' ? item.verso : item.recto
  return (
    <div>
      <p className="mb-2 text-center text-xs text-muted">{dir === 'f' ? 'Recto → verso' : 'Verso → recto'} · touche la carte pour la retourner</p>
      <div style={{ perspective: 1000 }}>
        <motion.button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.45 }}
          style={{ transformStyle: 'preserve-3d', display: 'grid' }}
          className="min-h-64 w-full text-left"
          aria-label={flipped ? 'Retourner la carte (voir la question)' : 'Retourner la carte (voir la réponse)'}
        >
          <div style={{ ...FACE, gridArea: '1 / 1' }} className="grid place-items-center rounded-3xl border-2 border-violet-500 bg-card p-6 text-center">
            <div>
              <p className="mb-3 text-xs font-bold tracking-wider text-violet-400 uppercase">Question</p>
              <p className="text-2xl leading-snug font-extrabold">
                <Inline text={front} />
              </p>
            </div>
          </div>
          <div style={{ ...FACE, gridArea: '1 / 1', transform: 'rotateY(180deg)' }} className="grid place-items-center rounded-3xl border-2 border-emerald-500 bg-card p-6 text-center">
            <div>
              <p className="mb-3 text-xs font-bold tracking-wider text-emerald-400 uppercase">Réponse</p>
              <p className="text-2xl leading-snug font-extrabold">
                <Inline text={back} />
              </p>
              {item.note && dir === 'f' && <p className="mt-3 text-sm text-muted">{item.note}</p>}
            </div>
          </div>
        </motion.button>
      </div>
      {flipped ? <Answers onAnswer={onAnswer} /> : <p className="mt-4 text-center text-sm text-muted">Essaie de répondre dans ta tête, puis retourne la carte.</p>}
    </div>
  )
}

function QaCard({ item, onAnswer }) {
  const [mine, setMine] = useState('')
  const [shown, setShown] = useState(false)
  return (
    <div className="space-y-3">
      <div className="rounded-3xl border-2 border-violet-500 bg-card p-5">
        <p className="mb-2 text-xs font-bold tracking-wider text-violet-400 uppercase">Question</p>
        <p className="text-xl leading-snug font-extrabold">
          <Inline text={item.question} />
        </p>
      </div>
      {!shown ? (
        <>
          <textarea value={mine} onChange={(e) => setMine(e.target.value)} rows={4} placeholder="Écris ta réponse pour te tester (facultatif)" className="w-full rounded-2xl border border-line bg-card p-3 text-[16px] outline-none focus:border-violet-400" aria-label="Ta réponse" />
          <button type="button" onClick={() => setShown(true)} className="h-12 w-full rounded-2xl bg-violet-500 font-bold text-white">
            Voir la réponse
          </button>
        </>
      ) : (
        <>
          {mine.trim() && (
            <div className="rounded-2xl border border-line bg-card p-3 text-sm">
              <p className="text-xs font-bold tracking-wider text-muted uppercase">Ta réponse</p>
              <p className="whitespace-pre-wrap">{mine}</p>
            </div>
          )}
          <div className="rounded-3xl border-2 border-emerald-500 bg-card p-5">
            <p className="mb-2 text-xs font-bold tracking-wider text-emerald-400 uppercase">Réponse attendue</p>
            <RichBlock text={item.reponse} />
            {item.explication && <RichBlock text={item.explication} className="mt-3 border-t border-line pt-3 text-muted" />}
          </div>
          <Answers onAnswer={onAnswer} labels={['À revoir', "J'avais bon"]} />
        </>
      )}
    </div>
  )
}

function QcmCard({ item, onAnswer }) {
  const [order] = useState(() => shuffle(item.choices.map((_, i) => i)))
  const [selected, setSelected] = useState(null)
  const answered = selected !== null
  const ok = selected === item.answer
  const style = (i) => {
    if (!answered) return 'border-line bg-card hover:border-violet-400'
    if (i === item.answer) return 'border-emerald-500 bg-emerald-500/15'
    if (i === selected) return 'border-red-500 bg-red-500/15'
    return 'border-line bg-card opacity-50'
  }
  return (
    <div>
      <h2 className="mb-4 text-xl leading-snug font-extrabold">
        <Inline text={item.question} />
      </h2>
      <ul className="space-y-2.5">
        {order.map((i) => (
          <li key={i}>
            <button type="button" disabled={answered} onClick={() => setSelected(i)} className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3.5 text-left text-[15px] leading-snug font-semibold ${style(i)}`}>
              <span className="flex-1">{item.choices[i]}</span>
              {answered && i === item.answer && <CheckCircle2 size={20} className="shrink-0 text-emerald-400" aria-label="Bonne réponse" />}
              {answered && i === selected && !ok && <XCircle size={20} className="shrink-0 text-red-400" aria-label="Ta réponse" />}
            </button>
          </li>
        ))}
      </ul>
      {answered && (
        <div className={`mt-4 rounded-2xl p-3.5 text-sm ${ok ? 'bg-emerald-500/15' : 'bg-red-500/15'}`}>
          <p className="font-bold">{ok ? 'Bonne réponse !' : 'Pas tout à fait.'}</p>
          {item.explication && <RichBlock text={item.explication} className="mt-1" />}
          <button type="button" onClick={() => onAnswer(ok)} className="mt-3 h-12 w-full rounded-2xl bg-violet-500 font-bold text-white">
            Continuer
          </button>
        </div>
      )}
    </div>
  )
}

function Summary({ session, back, onRetry }) {
  const total = session.known + session.review
  const celebrated = useRef(false)
  useEffect(() => {
    if (!celebrated.current && session.known >= Math.ceil(session.queue.length * 0.6)) {
      celebrated.current = true
      celebrate()
    }
  }, [session])
  return (
    <div className="space-y-4 text-center">
      <p className="text-5xl" aria-hidden="true">
        🎉
      </p>
      <h2 className="text-2xl font-extrabold">Séance terminée !</h2>
      <p className="text-muted">
        {session.known} connue{session.known > 1 ? 's' : ''} · {session.review} à revoir (sur {total} réponses)
      </p>
      {session.xp > 0 && (
        <p className="flex items-center justify-center gap-1 text-lg font-extrabold text-amber-400">
          <Zap size={18} className="fill-amber-400" />+{session.xp} XP
        </p>
      )}
      <p className="text-sm text-muted">Les cartes à revoir reviendront demain, puis de plus en plus tard quand tu les connais.</p>
      {session.missed.length > 0 && (
        <button type="button" onClick={onRetry} className="h-12 w-full rounded-2xl border-2 border-orange-500 font-bold text-orange-400">
          Revoir les {session.missed.length} carte{session.missed.length > 1 ? 's' : ''} ratée{session.missed.length > 1 ? 's' : ''}
        </button>
      )}
      <Link to={back} className="flex h-12 items-center justify-center rounded-2xl bg-violet-500 font-bold text-white">
        Terminer
      </Link>
    </div>
  )
}

function Empty({ back, hasCards, onAll }) {
  return (
    <div className="space-y-4 text-center">
      <p className="text-5xl" aria-hidden="true">
        ✅
      </p>
      <h2 className="text-2xl font-extrabold">{hasCards ? 'Rien à réviser pour le moment' : 'Aucune carte ici'}</h2>
      <p className="text-muted">{hasCards ? 'Toutes tes cartes sont à jour. Reviens demain, ou revois-les quand même.' : 'Importe un lot avec des flashcards, des QCM ou des questions-réponses.'}</p>
      {hasCards && (
        <button type="button" onClick={onAll} className="h-12 w-full rounded-2xl border-2 border-orange-500 font-bold text-orange-400">
          Tout revoir quand même
        </button>
      )}
      <Link to={back} className="flex h-12 items-center justify-center rounded-2xl bg-violet-500 font-bold text-white">
        Retour
      </Link>
    </div>
  )
}
