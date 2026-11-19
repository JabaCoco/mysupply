import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, ChevronLeft, ChevronRight, Eye, Mic, RotateCcw, ThumbsDown, ThumbsUp, Zap } from 'lucide-react'
import Page from '../../../components/Page.jsx'
import SubHeader from '../../../components/SubHeader.jsx'
import RichText from '../../../components/RichText.jsx'
import { INTERVIEW } from '../../../data/atelier/bi/index.js'
import { INTERVIEW_TOPICS } from '../../../data/atelier/bi/interview.js'
import { recordInterview, useWorkshop } from '../../../lib/atelier.js'
import { SimulationNotice } from './shared.jsx'

// Questions d'entretien (/atelier/bi/entretien) : on réfléchit, on affiche la réponse, on s'auto-évalue
export default function Interview() {
  const workshop = useWorkshop()
  const [topic, setTopic] = useState('Tous')
  const [index, setIndex] = useState(0)
  const [shown, setShown] = useState(false)
  const [gain, setGain] = useState(0)

  const list = useMemo(() => (topic === 'Tous' ? INTERVIEW : INTERVIEW.filter((q) => q.topic === topic)), [topic])
  if (!workshop) return null
  const q = list[Math.min(index, list.length - 1)]
  const status = (id) => workshop.get(`bi/ent/${id}`)?.status
  const known = INTERVIEW.filter((x) => status(x.id) === 'known').length

  const go = (delta) => {
    setIndex((i) => (i + delta + list.length) % list.length)
    setShown(false)
    setGain(0)
  }
  async function rate(isKnown) {
    const xp = await recordInterview(q.id, isKnown)
    setGain(xp)
    if (isKnown && list.length > 1) setTimeout(() => go(1), xp ? 900 : 350)
  }

  return (
    <Page>
      <SubHeader back="/atelier/bi" title="Questions d’entretien" subtitle={`${known} / ${INTERVIEW.length} maîtrisées`} />
      <div className="space-y-4">
        <div className="flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Thème">
          {['Tous', ...INTERVIEW_TOPICS].map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={topic === t}
              onClick={() => {
                setTopic(t)
                setIndex(0)
                setShown(false)
                setGain(0)
              }}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold ${topic === t ? 'border-violet-500 bg-violet-500 text-white' : 'border-line bg-card text-muted'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs font-bold tracking-wider text-muted uppercase">
          <span>
            Question {Math.min(index, list.length - 1) + 1} / {list.length} · {q.topic}
          </span>
          {status(q.id) === 'known' && (
            <span className="flex items-center gap-1 text-emerald-400">
              <Check size={14} strokeWidth={3} /> Maîtrisée
            </span>
          )}
          {status(q.id) === 'review' && <span className="text-amber-400">À revoir</span>}
        </div>

        <motion.div key={q.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <h2 className="rounded-3xl border border-line bg-card p-5 text-xl leading-snug font-extrabold">{q.question}</h2>

          {!shown ? (
            <div className="space-y-3">
              <p className="text-center text-sm text-muted">Formule ta réponse à voix haute, comme en entretien, puis compare.</p>
              <button type="button" onClick={() => setShown(true)} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-violet-500 font-bold text-white">
                <Eye size={18} /> Afficher la réponse attendue
              </button>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <div className="rounded-2xl border-2 border-violet-500 bg-violet-500/10 p-4">
                  <p className="mb-1 flex items-center gap-1.5 text-xs font-bold tracking-wider text-violet-300 uppercase">
                    <Mic size={14} /> À dire à l’oral (20 secondes)
                  </p>
                  <p className="text-[15px] leading-relaxed font-semibold">{q.pitch}</p>
                </div>
                <div className="rounded-2xl border border-line bg-card p-4">
                  <p className="mb-2 text-xs font-bold tracking-wider text-muted uppercase">Réponse détaillée</p>
                  <RichText text={q.detail} className="text-[15px] leading-relaxed text-fg/90" />
                </div>
                <div className="rounded-2xl border border-line bg-card p-4">
                  <p className="mb-2 text-xs font-bold tracking-wider text-muted uppercase">Les idées à citer</p>
                  <ul className="list-disc space-y-0.5 pl-5 text-[15px]">
                    {q.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => rate(false)} className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-line bg-card font-bold">
                    <ThumbsDown size={18} /> À revoir
                  </button>
                  <button type="button" onClick={() => rate(true)} className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-500 font-bold text-white">
                    <ThumbsUp size={18} /> Je savais
                  </button>
                </div>
                {gain > 0 && (
                  <p className="flex items-center justify-center gap-1 font-extrabold text-amber-400">
                    <Zap size={18} className="fill-amber-400" />+{gain} XP
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>

        <div className="flex gap-2">
          <button type="button" onClick={() => go(-1)} className="flex h-11 flex-1 items-center justify-center gap-1 rounded-xl border border-line bg-card text-sm font-semibold">
            <ChevronLeft size={16} /> Précédente
          </button>
          <button type="button" onClick={() => go(1)} className="flex h-11 flex-1 items-center justify-center gap-1 rounded-xl border border-line bg-card text-sm font-semibold">
            Suivante <ChevronRight size={16} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            setIndex(Math.floor(Math.random() * list.length))
            setShown(false)
            setGain(0)
          }}
          className="mx-auto flex items-center gap-1.5 text-sm font-semibold text-muted"
        >
          <RotateCcw size={15} /> Question au hasard
        </button>
        <SimulationNotice />
      </div>
    </Page>
  )
}
