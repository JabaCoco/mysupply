import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { motion } from 'motion/react'
import { BookOpen, Check, CheckCircle2, ChevronRight, CircleDot, Trophy, Zap } from 'lucide-react'
import Page from '../../../components/Page.jsx'
import SubHeader from '../../../components/SubHeader.jsx'
import { CASES } from '../../../data/atelier/cases.js'
import { findLesson } from '../../../data/courses/index.js'
import { completeCase, useWorkshop } from '../../../lib/atelier.js'
import { celebrate } from '../../../lib/confetti.js'

// Ordre aléatoire des choix, pour que la bonne réponse ne soit pas toujours au même endroit
function shuffledOrders(study) {
  return study.steps.map((s) => {
    const order = s.choices.map((_, i) => i)
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    return order
  })
}

const maxScore = (c) => c.steps.reduce((s, step) => s + Math.max(...step.choices.map((ch) => ch.points)), 0)

// Liste des études de cas (/atelier/cas)
export function CaseList() {
  const workshop = useWorkshop()
  if (!workshop) return null
  return (
    <Page>
      <SubHeader back="/atelier" title="Études de cas" subtitle="Prends les décisions, découvre leurs conséquences" />
      <ul className="space-y-2.5">
        {CASES.map((c) => {
          const result = workshop.get(`cas/${c.id}`)
          return (
            <li key={c.id}>
              <Link to={`/atelier/cas/${c.id}`} className="flex items-center gap-3 rounded-2xl border border-line bg-card p-4">
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{c.title}</span>
                  <span className="block text-xs text-muted">{c.role}</span>
                  {result && (
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                      <Check size={12} strokeWidth={3} /> Meilleur score {result.bestScore}/{result.max}
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

// Une étude de cas (/atelier/cas/:id)
export function CasePage() {
  const { id } = useParams()
  const study = CASES.find((c) => c.id === id)
  if (!study) return <Navigate to="/atelier/cas" replace />
  return <CasePlayer key={study.id} study={study} />
}

function CasePlayer({ study }) {
  const [step, setStep] = useState(0) // index de la décision en cours ; = nb d'étapes à la fin
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [xp, setXp] = useState(null)
  const [orders, setOrders] = useState(() => shuffledOrders(study))
  const max = maxScore(study)
  const finished = step >= study.steps.length
  const current = study.steps[step]
  const lesson = findLesson(...study.lesson.split('/'))

  async function next() {
    const gained = current.choices[picked].points
    const newScore = score + gained
    setScore(newScore)
    setPicked(null)
    setStep((s) => s + 1)
    if (step === study.steps.length - 1) {
      setXp(await completeCase(study.id, newScore, max))
      if (newScore / max >= 0.8) celebrate()
    }
  }

  function restart() {
    setStep(0)
    setScore(0)
    setPicked(null)
    setXp(null)
    setOrders(shuffledOrders(study))
  }

  return (
    <Page>
      <SubHeader back="/atelier/cas" title={study.title} subtitle={study.role} />

      {!finished && (
        <div className="space-y-4">
          {step === 0 && <p className="rounded-2xl border border-line bg-card p-4 text-[15px] leading-relaxed">{study.intro}</p>}

          <div className="flex gap-1.5" aria-label={`Décision ${step + 1} sur ${study.steps.length}`}>
            {study.steps.map((_, i) => (
              <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-violet-500' : 'bg-line'}`} />
            ))}
          </div>

          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
            <p className="text-xs font-bold tracking-wider text-violet-400 uppercase">
              Décision {step + 1} / {study.steps.length}
            </p>
            <h2 className="text-lg leading-snug font-extrabold">{current.situation}</h2>
            <ul className="space-y-2.5">
              {orders[step].map((i) => {
                const choice = current.choices[i]
                const chosen = picked === i
                const tone = picked === null ? 'border-line bg-card hover:border-violet-400' : chosen ? quality(choice.points).box : 'border-line bg-card opacity-50'
                return (
                  <li key={i}>
                    <button
                      type="button"
                      disabled={picked !== null}
                      onClick={() => setPicked(i)}
                      className={`flex w-full gap-3 rounded-2xl border-2 p-3.5 text-left text-[15px] leading-snug ${tone}`}
                    >
                      <CircleDot size={18} className={`mt-0.5 shrink-0 ${chosen ? quality(choice.points).text : 'text-muted'}`} />
                      <span>{choice.text}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </motion.div>

          {picked !== null && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl p-4 ${quality(current.choices[picked].points).soft}`}>
              <p className={`font-extrabold ${quality(current.choices[picked].points).text}`}>
                {quality(current.choices[picked].points).label} · +{current.choices[picked].points} pt
              </p>
              <p className="mt-1 text-[15px] leading-snug text-fg/85">{current.choices[picked].feedback}</p>
              <BetterAnswer step={current} picked={picked} />
              <button type="button" onClick={next} className="mt-3 h-11 w-full rounded-xl bg-violet-500 font-bold text-white">
                {step === study.steps.length - 1 ? 'Voir le bilan' : 'Décision suivante'}
              </button>
            </motion.div>
          )}
        </div>
      )}

      {finished && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-4 rounded-3xl bg-violet-500 p-5 text-white">
            <Trophy size={40} className="shrink-0" />
            <div>
              <p className="text-3xl font-extrabold">
                {score} / {max}
              </p>
              <p className="text-sm text-white/85">
                {score / max >= 0.8 ? 'Excellent manager !' : score / max >= 0.5 ? 'De bons réflexes, à affiner.' : 'Revois les bases et réessaie.'}
              </p>
            </div>
            {xp > 0 && (
              <span className="ml-auto flex items-center gap-1 font-extrabold text-amber-300">
                <Zap size={18} className="fill-amber-300" />+{xp}
              </span>
            )}
          </div>
          <div className="rounded-2xl border border-line bg-card p-4">
            <p className="mb-1 text-xs font-bold tracking-wider text-muted uppercase">À retenir</p>
            <p className="text-[15px] leading-relaxed">{study.debrief}</p>
          </div>
          {lesson && (
            <Link to={`/cours/${lesson.key}`} className="flex items-center gap-3 rounded-2xl border border-line bg-card p-4">
              <BookOpen size={20} className="shrink-0 text-violet-400" />
              <span className="flex-1 text-sm">
                Revoir la leçon : <span className="font-bold">{lesson.title}</span>
              </span>
              <ChevronRight size={18} className="text-muted" />
            </Link>
          )}
          <button type="button" onClick={restart} className="h-12 w-full rounded-2xl border border-line bg-card font-bold">
            Rejouer le cas
          </button>
          <Link to="/atelier/cas" className="block py-1 text-center text-sm font-semibold text-muted">
            Autres études de cas
          </Link>
        </motion.div>
      )}
    </Page>
  )
}

// Si la décision n'était pas la meilleure : la réponse attendue, et pourquoi elle est meilleure
function BetterAnswer({ step, picked }) {
  const bestPoints = Math.max(...step.choices.map((c) => c.points))
  if (step.choices[picked].points >= bestPoints) return null
  const best = step.choices.find((c) => c.points === bestPoints)
  return (
    <div className="mt-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3">
      <p className="flex items-center gap-1.5 text-sm font-extrabold text-emerald-400">
        <CheckCircle2 size={16} /> La réponse attendue
      </p>
      <p className="mt-1 text-[15px] leading-snug font-semibold">{best.text}</p>
      <p className="mt-2 text-xs font-bold tracking-wider text-muted uppercase">Pourquoi c'est mieux</p>
      <p className="mt-0.5 text-[15px] leading-snug text-fg/85">{step.better ?? best.feedback}</p>
    </div>
  )
}

// Couleur et libellé selon la qualité de la décision (toujours avec un texte, pas la couleur seule)
function quality(points) {
  if (points >= 3) return { label: 'Excellente décision', text: 'text-emerald-400', soft: 'bg-emerald-500/15', box: 'border-emerald-500 bg-emerald-500/15' }
  if (points >= 1) return { label: 'Décision discutable', text: 'text-amber-400', soft: 'bg-amber-400/10', box: 'border-amber-400 bg-amber-400/10' }
  return { label: 'Mauvaise décision', text: 'text-red-400', soft: 'bg-red-500/10', box: 'border-red-500 bg-red-500/10' }
}
