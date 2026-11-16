import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { CheckCircle2, Lightbulb, XCircle, Zap } from 'lucide-react'
import Page from '../../components/Page.jsx'
import SubHeader from '../../components/SubHeader.jsx'
import { Inline } from '../../components/RichText.jsx'
import { recordExerciseQuestion, useRevisions } from '../../lib/revStore.js'
import { checkNumericAnswer } from '../../lib/revFormat.js'
import { celebrate } from '../../lib/confetti.js'
import RichBlock from './RichBlock.jsx'

// Liste des exercices d'un lot
export function ExerciseList() {
  const { id } = useParams()
  const data = useRevisions()
  if (!data) return null
  const lot = data.lots.find((l) => l.id === id)
  const exos = lot?.items.filter((it) => it.type === 'exercice') ?? []
  return (
    <Page>
      <SubHeader back={`/revisions/lot/${id}`} title="Exercices" subtitle={lot?.title} />
      {exos.length === 0 ? (
        <p className="text-muted">Aucun exercice dans ce lot.</p>
      ) : (
        <div className="space-y-2">
          {exos.map((ex) => {
            const done = ex.questions.filter((q) => data.progress.get(`${id}|${ex.id}|x:${q.id}`)?.best).length
            return (
              <Link key={ex.id} to={`/revisions/exercice/${id}/${ex.id}`} className="block rounded-2xl border border-line bg-card p-3.5 transition-transform active:scale-[0.98]">
                <p className="font-bold">{ex.title}</p>
                <p className="text-xs text-muted">
                  {ex.questions.length} question{ex.questions.length > 1 ? 's' : ''} · {done} réussie{done > 1 ? 's' : ''}
                </p>
              </Link>
            )
          })}
        </div>
      )}
    </Page>
  )
}

// Un exercice complet : énoncé avec tableaux, puis les questions une par une
export default function Exercise() {
  const { lotId, itemId } = useParams()
  const data = useRevisions()
  const [results, setResults] = useState({}) // qid → true / false
  const [xp, setXp] = useState(0)
  const celebrated = useRef(false)
  const ex = data?.lots.find((l) => l.id === lotId)?.items.find((it) => it.id === itemId)

  const total = ex?.questions.length ?? 0
  const answered = Object.keys(results).length
  const good = Object.values(results).filter(Boolean).length
  useEffect(() => {
    if (total && answered === total && good === total && !celebrated.current) {
      celebrated.current = true
      celebrate()
    }
  }, [answered, good, total])

  if (!data) return null
  if (!ex)
    return (
      <Page>
        <SubHeader back={`/revisions/lot/${lotId}`} title="Exercice introuvable" />
      </Page>
    )

  async function record(qid, correct) {
    setResults((r) => ({ ...r, [qid]: correct }))
    const gained = await recordExerciseQuestion(lotId, itemId, qid, correct)
    setXp((x) => x + gained)
  }

  return (
    <Page>
      <SubHeader back={`/revisions/lot/${lotId}/exercices`} title={ex.title} subtitle={`${total} question${total > 1 ? 's' : ''}`} />
      <div className="space-y-4">
        <div className="rounded-3xl border border-line bg-card p-4">
          <p className="mb-2 text-xs font-bold tracking-wider text-sky-400 uppercase">Énoncé</p>
          <RichBlock text={ex.enonce} />
        </div>
        {ex.questions.map((q, k) => (
          <Question key={q.id} q={q} number={k + 1} total={total} onResult={(c) => record(q.id, c)} />
        ))}
        {answered === total && (
          <div className="rounded-3xl bg-violet-500 p-5 text-center text-white">
            <p className="text-sm text-white/85">Exercice terminé</p>
            <p className="text-4xl font-extrabold">
              {good} / {total}
            </p>
            {xp > 0 && (
              <p className="mt-2 flex items-center justify-center gap-1 font-extrabold text-amber-200">
                <Zap size={16} className="fill-amber-200" />+{xp} XP
              </p>
            )}
            <Link to={`/revisions/lot/${lotId}/exercices`} className="mt-3 flex h-11 items-center justify-center rounded-2xl bg-white font-bold text-violet-600">
              Retour aux exercices
            </Link>
          </div>
        )}
      </div>
    </Page>
  )
}

function Question({ q, number, total, onResult }) {
  const [input, setInput] = useState('')
  const [state, setState] = useState('open') // open → checked (numérique) | shown (texte)
  const [verdict, setVerdict] = useState(null)
  const [hint, setHint] = useState(false)
  const [bad, setBad] = useState('')

  function check() {
    const r = checkNumericAnswer(q, input)
    if (r === null) {
      setBad('Écris un nombre (exemple : 12,5).')
      return
    }
    setBad('')
    setVerdict(r)
    setState('checked')
    onResult(r)
  }

  return (
    <div className="space-y-3 rounded-3xl border-2 border-violet-500/60 bg-card p-4">
      <p className="text-xs font-bold tracking-wider text-violet-400 uppercase">
        Question {number} / {total}
      </p>
      <RichBlock text={q.question} className="font-semibold" />

      {q.indice && state === 'open' && (
        <>
          <button type="button" onClick={() => setHint((h) => !h)} className="flex items-center gap-1.5 text-sm font-semibold text-amber-400">
            <Lightbulb size={16} /> {hint ? 'Masquer l\'indice' : 'Besoin d\'un indice ?'}
          </button>
          {hint && (
            <p className="rounded-xl bg-amber-400/10 p-2.5 text-sm">
              <Inline text={q.indice} />
            </p>
          )}
        </>
      )}

      {state === 'open' && q.numeric && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            check()
          }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} inputMode="decimal" placeholder="Ta réponse" className="h-12 min-w-0 flex-1 rounded-xl border border-line bg-bg px-3 text-[16px] font-bold outline-none focus:border-violet-400" aria-label="Ta réponse" />
            {q.unite && <span className="text-sm text-muted">{q.unite}</span>}
          </div>
          {bad && <p className="text-sm text-red-400">{bad}</p>}
          <button type="submit" disabled={!input.trim()} className="h-12 w-full rounded-2xl bg-violet-500 font-bold text-white disabled:opacity-40">
            Vérifier
          </button>
        </form>
      )}

      {state === 'open' && !q.numeric && (
        <>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3} placeholder="Écris ta réponse pour te tester (facultatif)" className="w-full rounded-xl border border-line bg-bg p-3 text-[16px] outline-none focus:border-violet-400" aria-label="Ta réponse" />
          <button type="button" onClick={() => setState('shown')} className="h-12 w-full rounded-2xl bg-violet-500 font-bold text-white">
            Voir la réponse
          </button>
        </>
      )}

      {(state === 'checked' || state === 'shown' || state === 'graded') && (
        <div className="space-y-2">
          {state === 'checked' && (
            <p className={`flex items-center gap-2 font-bold ${verdict ? 'text-emerald-400' : 'text-red-400'}`}>
              {verdict ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
              {verdict ? 'Bonne réponse !' : `Pas tout à fait (tu as écrit ${input}).`}
            </p>
          )}
          <div className="rounded-2xl border border-emerald-500/60 bg-emerald-500/10 p-3">
            <p className="text-xs font-bold tracking-wider text-emerald-400 uppercase">Réponse</p>
            <RichBlock text={q.numeric ? `${q.reponse}${q.unite ? ' ' + q.unite : ''}` : q.reponse} className="font-semibold" />
          </div>
          {q.correction && (
            <div className="rounded-2xl border border-line bg-bg p-3">
              <p className="mb-1 text-xs font-bold tracking-wider text-muted uppercase">Correction détaillée</p>
              <RichBlock text={q.correction} />
            </div>
          )}
          {state === 'shown' && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setState('graded')
                  setVerdict(false)
                  onResult(false)
                }}
                className="h-11 rounded-xl border-2 border-orange-500 font-bold text-orange-400"
              >
                Pas tout à fait
              </button>
              <button
                type="button"
                onClick={() => {
                  setState('graded')
                  setVerdict(true)
                  onResult(true)
                }}
                className="h-11 rounded-xl bg-emerald-500 font-bold text-white"
              >
                J'avais bon
              </button>
            </div>
          )}
          {state === 'graded' && <p className="text-sm text-muted">{verdict ? 'Noté comme réussi.' : 'Noté à retravailler : tu pourras refaire cet exercice.'}</p>}
        </div>
      )}
    </div>
  )
}
