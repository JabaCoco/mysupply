import { useMemo, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { motion } from 'motion/react'
import { CheckCircle2, Lightbulb, XCircle, Zap } from 'lucide-react'
import Page from '../../../components/Page.jsx'
import SubHeader from '../../../components/SubHeader.jsx'
import { Inline } from '../../../components/RichText.jsx'
import { EXCEL_CHALLENGES, buildCells } from '../../../data/atelier/excel.js'
import { evaluateFormula, formatValue, sameResult, canonicalName } from '../../../lib/excel/evaluate.js'
import { functionsUsed, parseFormula } from '../../../lib/excel/parser.js'
import { completeExcel, useWorkshop } from '../../../lib/atelier.js'
import { celebrate } from '../../../lib/confetti.js'
import Sheet from './Sheet.jsx'

// Touches rapides pour taper une formule sur mobile
const KEYS = ['=', ';', '(', ')', ':', '"', '<', '>', '*', '/', '+', '-']

export default function ExcelChallenge() {
  const { id } = useParams()
  const challenge = EXCEL_CHALLENGES.find((c) => c.id === id)
  if (!challenge) return <Navigate to="/atelier/excel" replace />
  return <ChallengePlayer key={challenge.id} challenge={challenge} />
}

function ChallengePlayer({ challenge }) {
  const workshop = useWorkshop()
  // Les défis à données aléatoires (challenge.generate) refabriquent leur tableau à chaque ouverture
  const data = useMemo(() => (challenge.generate ? { ...challenge, ...challenge.generate() } : challenge), [challenge])
  const cells = useMemo(() => buildCells(data), [data])
  const expected = useMemo(() => evaluateFormula(challenge.solution, cells).value, [challenge, cells])
  const index = EXCEL_CHALLENGES.indexOf(challenge)
  const nextChallenge = EXCEL_CHALLENGES[index + 1]

  const inputRef = useRef(null)
  const [formula, setFormula] = useState('=')
  const [result, setResult] = useState(null) // { status: 'ok' | 'wrong' | 'error' | 'missing', … }
  const [hintsShown, setHintsShown] = useState(0)
  const [solutionShown, setSolutionShown] = useState(false)
  const [xp, setXp] = useState(null)
  const alreadyDone = workshop?.has(`excel/${challenge.id}`)

  // Insère du texte à l'emplacement du curseur dans la barre de formule
  function insert(text) {
    const input = inputRef.current
    const start = input?.selectionStart ?? formula.length
    const end = input?.selectionEnd ?? formula.length
    const updated = formula.slice(0, start) + text + formula.slice(end)
    setFormula(updated)
    setResult(null)
    requestAnimationFrame(() => {
      input?.focus()
      input?.setSelectionRange(start + text.length, start + text.length)
    })
  }

  async function check(event) {
    event?.preventDefault()
    const text = formula.trim().startsWith('=') ? formula.trim() : `=${formula.trim()}`
    const outcome = evaluateFormula(text, cells)
    if (outcome.error) {
      const commaHint = !text.includes(';') && text.includes(',') ? ' En français, on sépare les arguments par « ; ».' : ''
      setResult({ status: 'error', code: outcome.error.code, message: outcome.error.message + commaHint })
      return
    }
    const used = new Set([...functionsUsed(parseFormula(text))].map(canonicalName))
    const missing = challenge.mustUse.filter((fn) => !used.has(fn))
    const correctValue = sameResult(outcome.value, expected)
    if (correctValue && missing.length) {
      setResult({ status: 'missing', value: outcome.value, missing })
      return
    }
    if (!correctValue) {
      setResult({ status: 'wrong', value: outcome.value })
      return
    }
    setResult({ status: 'ok', value: outcome.value })
    const gained = await completeExcel(challenge.id, solutionShown)
    setXp(gained)
    celebrate()
  }

  const done = result?.status === 'ok'
  const targetDisplay = result && 'value' in result ? formatValue(result.value) : result?.status === 'error' ? result.code : formula.length > 1 ? formula : ''
  const targetState = done ? 'ok' : result && result.status !== 'missing' ? 'wrong' : 'idle'

  return (
    <Page>
      <SubHeader
        back="/atelier/excel"
        title={challenge.title}
        subtitle={`Défi ${index + 1} / ${EXCEL_CHALLENGES.length} · ${challenge.fn}${alreadyDone ? ' · déjà réussi ✓' : ''}`}
      />

      <div className="space-y-4">
        <div className="rounded-2xl border border-line bg-card p-4">
          <p className="text-sm text-muted">{challenge.context}</p>
          <p className="mt-1.5 leading-snug font-semibold">
            <Inline text={challenge.instruction} />
          </p>
        </div>

        <Sheet
          cells={cells}
          target={challenge.target}
          targetDisplay={targetDisplay}
          targetState={targetState}
          onCellClick={(address) => (address === challenge.target ? inputRef.current?.focus() : insert(address))}
        />
        <p className="text-xs text-muted">Astuce : touche une cellule pour insérer sa référence dans la formule.</p>

        {/* Barre de formule */}
        <form onSubmit={check} className="space-y-2">
          <div className="flex items-center gap-2 rounded-2xl border-2 border-line bg-card px-3 focus-within:border-violet-500">
            <span className="font-mono text-sm font-bold text-muted italic">fx</span>
            <span className="font-mono text-xs text-muted">{challenge.target}</span>
            <input
              ref={inputRef}
              value={formula}
              onChange={(e) => {
                setFormula(e.target.value)
                setResult(null)
              }}
              className="h-12 min-w-0 flex-1 bg-transparent font-mono text-[15px] outline-none"
              autoCapitalize="characters"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Formule"
              placeholder="=SOMME(…)"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => insert(key)}
                className="h-9 min-w-9 rounded-lg border border-line bg-card px-2 font-mono font-bold active:bg-line"
              >
                {key}
              </button>
            ))}
            <button type="button" onClick={() => setFormula('=')} className="h-9 rounded-lg border border-line bg-card px-3 text-sm text-muted">
              Effacer
            </button>
          </div>
          <button type="submit" className="h-12 w-full rounded-2xl bg-violet-500 font-bold text-white">
            Valider
          </button>
        </form>

        {result && <Feedback result={result} expectedFn={challenge.mustUse} />}

        {done && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 rounded-2xl bg-emerald-500/15 p-4">
            <p className="flex items-center gap-2 font-extrabold text-emerald-400">
              <CheckCircle2 size={20} /> Bravo, défi réussi !
              {xp > 0 && (
                <span className="ml-auto flex items-center gap-1 text-amber-400">
                  <Zap size={16} className="fill-amber-400" />+{xp} XP
                </span>
              )}
            </p>
            <p className="text-[15px] leading-snug text-fg/85">{challenge.explain}</p>
            {nextChallenge ? (
              <Link to={`/atelier/excel/${nextChallenge.id}`} className="block h-11 rounded-xl bg-emerald-500 text-center leading-[2.75rem] font-bold text-white">
                Défi suivant
              </Link>
            ) : (
              <Link to="/atelier/excel" className="block h-11 rounded-xl bg-emerald-500 text-center leading-[2.75rem] font-bold text-white">
                Retour aux défis
              </Link>
            )}
          </motion.div>
        )}

        {/* Indices puis solution */}
        {!done && (
          <div className="space-y-2">
            {challenge.hints.slice(0, hintsShown).map((hint, i) => (
              <p key={i} className="flex gap-2 rounded-2xl bg-amber-400/10 p-3 text-sm leading-snug">
                <Lightbulb size={18} className="shrink-0 text-amber-400" />
                <span>{hint}</span>
              </p>
            ))}
            {solutionShown && (
              <p className="rounded-2xl border border-line bg-card p-3 text-sm">
                Solution : <code className="font-mono font-bold text-violet-400">{challenge.solution}</code>
              </p>
            )}
            {hintsShown < challenge.hints.length ? (
              <button type="button" onClick={() => setHintsShown((n) => n + 1)} className="text-sm font-semibold text-amber-400">
                Besoin d'un indice ?
              </button>
            ) : (
              !solutionShown && (
                <button type="button" onClick={() => setSolutionShown(true)} className="text-sm font-semibold text-muted">
                  Voir la solution (le défi rapportera moins d'XP)
                </button>
              )
            )}
          </div>
        )}
      </div>
    </Page>
  )
}

function Feedback({ result, expectedFn }) {
  if (result.status === 'ok') return null
  const text = {
    error: `${result.code} — ${result.message}`,
    wrong: `Ta formule donne ${formatValue(result.value)}. Ce n'est pas encore le bon résultat.`,
    missing: `Le résultat est juste, mais le défi demande d'utiliser ${result.missing?.join(' et ')}${expectedFn.length > 1 ? '' : ''}.`,
  }[result.status]
  return (
    <p className={`flex gap-2 rounded-2xl p-3 text-sm leading-snug ${result.status === 'missing' ? 'bg-amber-400/10' : 'bg-red-500/10'}`}>
      <XCircle size={18} className={`shrink-0 ${result.status === 'missing' ? 'text-amber-400' : 'text-red-400'}`} />
      <span>{text}</span>
    </p>
  )
}
