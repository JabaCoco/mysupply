import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Mic, MicOff, RotateCcw, SkipForward, Volume2 } from 'lucide-react'
import SpeakButton from './SpeakButton.jsx'
import { LISTEN_ERRORS, canListen, canSpeak, listen, matchesSpeech, speak } from '../../lib/speech.js'
import { checkOrder, checkTyped } from '../../lib/englishExercises.js'

// Chaque exercice reçoit : exercise, locked (déjà répondu), onAnswer(correct, { note }), onSkip()

// ---------- QCM : traduction, écoute, phrase à trous ----------
export function ChoiceExercise({ exercise, locked, onAnswer }) {
  const [picked, setPicked] = useState(null)
  const { display } = exercise

  // Exercice d'écoute : on lit le mot automatiquement à l'affichage
  useEffect(() => {
    if (display.listen) speak(display.listen)
  }, [display.listen])

  return (
    <div className="space-y-5">
      <Prompt>{exercise.prompt}</Prompt>
      {display.big && (
        <div className="flex items-center gap-3">
          {display.speak && <SpeakButton text={display.speak} />}
          <p className="text-3xl font-extrabold">{display.big}</p>
        </div>
      )}
      {display.listen && (
        <div className="flex justify-center py-2">
          <SpeakButton text={display.listen} size="lg" slow />
        </div>
      )}
      {display.sentence && (
        <div className="rounded-2xl border border-line bg-card p-4">
          <p className="text-xl leading-snug font-bold">{display.sentence}</p>
          {display.sub && <p className="mt-1 text-sm text-muted">{display.sub}</p>}
        </div>
      )}
      <ul className="space-y-2.5">
        {exercise.choices.map((text, i) => {
          const tone = !locked
            ? 'border-line bg-card hover:border-indigo-400'
            : i === exercise.answer
              ? 'border-emerald-500 bg-emerald-500/15'
              : i === picked
                ? 'border-red-500 bg-red-500/10'
                : 'border-line bg-card opacity-50'
          return (
            <li key={text}>
              <button
                type="button"
                disabled={locked}
                onClick={() => {
                  setPicked(i)
                  onAnswer(i === exercise.answer)
                }}
                className={`w-full rounded-2xl border-2 border-b-4 p-3.5 text-left text-[17px] font-semibold transition-colors ${tone}`}
              >
                {text}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// ---------- Associer les paires ----------
export function PairsExercise({ exercise, locked, onAnswer }) {
  const left = useMemo(() => [...exercise.pairs].sort(() => Math.random() - 0.5), [exercise])
  const right = useMemo(() => [...exercise.pairs].sort(() => Math.random() - 0.5), [exercise])
  const [selected, setSelected] = useState(null) // { side, en }
  const [matched, setMatched] = useState([])
  const [wrong, setWrong] = useState(null)
  const mistakes = useRef(0)

  function pick(side, pair) {
    if (locked || matched.includes(pair.en)) return
    if (side === 'en') speak(pair.en)
    if (!selected || selected.side === side) {
      setSelected({ side, en: pair.en })
      return
    }
    if (selected.en === pair.en) {
      const now = [...matched, pair.en]
      setMatched(now)
      setSelected(null)
      if (now.length === exercise.pairs.length) {
        onAnswer(mistakes.current === 0, { note: mistakes.current ? `${mistakes.current} erreur${mistakes.current > 1 ? 's' : ''} d'association.` : null })
      }
    } else {
      mistakes.current += 1
      // On retient la case touchée dans chaque colonne pour les surligner en rouge
      setWrong(side === 'en' ? { en: pair.en, fr: selected.en } : { en: selected.en, fr: pair.en })
      setSelected(null)
      setTimeout(() => setWrong(null), 500)
    }
  }

  const tile = (side, pair, label) => {
    const done = matched.includes(pair.en)
    const isSelected = selected?.side === side && selected.en === pair.en
    const isWrong = wrong?.[side] === pair.en
    return (
      <button
        key={pair.en}
        type="button"
        disabled={done || locked}
        onClick={() => pick(side, pair)}
        className={`min-h-14 w-full rounded-2xl border-2 border-b-4 px-2 py-2 text-[15px] leading-tight font-semibold transition-all ${
          done
            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400/70'
            : isWrong
              ? 'border-red-500 bg-red-500/10'
              : isSelected
                ? 'border-indigo-500 bg-indigo-500/15'
                : 'border-line bg-card'
        }`}
      >
        {label}
      </button>
    )
  }

  return (
    <div className="space-y-5">
      <Prompt>{exercise.prompt}</Prompt>
      <div className="grid grid-cols-2 gap-2.5">
        <div className="space-y-2.5">{left.map((p) => tile('en', p, p.en))}</div>
        <div className="space-y-2.5">{right.map((p) => tile('fr', p, p.fr))}</div>
      </div>
    </div>
  )
}

// ---------- Remettre la phrase dans l'ordre ----------
export function OrderExercise({ exercise, locked, onAnswer }) {
  const [picked, setPicked] = useState([]) // index des tuiles choisies
  const words = picked.map((i) => exercise.tiles[i])

  return (
    <div className="space-y-5">
      <Prompt>{exercise.prompt}</Prompt>
      <p className="rounded-2xl border border-line bg-card p-4 text-lg leading-snug font-bold">{exercise.fr}</p>
      <div className="flex min-h-24 flex-wrap content-start gap-2 border-y-2 border-line py-3" aria-label="Ta phrase">
        {picked.map((i) => (
          <motion.button
            layout
            key={i}
            type="button"
            disabled={locked}
            onClick={() => setPicked((p) => p.filter((x) => x !== i))}
            className="rounded-xl border-2 border-b-4 border-line bg-card px-3 py-1.5 text-[16px] font-semibold"
          >
            {exercise.tiles[i]}
          </motion.button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {exercise.tiles.map((word, i) => (
          <button
            key={i}
            type="button"
            disabled={locked || picked.includes(i)}
            onClick={() => setPicked((p) => [...p, i])}
            className={`rounded-xl border-2 border-b-4 px-3 py-1.5 text-[16px] font-semibold ${picked.includes(i) ? 'border-line bg-line/40 text-transparent' : 'border-line bg-card'}`}
          >
            {word}
          </button>
        ))}
      </div>
      {!locked && (
        <button
          type="button"
          disabled={!picked.length}
          onClick={() => onAnswer(checkOrder(words, exercise.answer))}
          className="h-12 w-full rounded-2xl bg-indigo-500 font-bold text-white disabled:bg-line disabled:text-muted"
        >
          Vérifier
        </button>
      )}
    </div>
  )
}

// ---------- Écrire le mot en anglais ----------
export function TypeExercise({ exercise, locked, onAnswer }) {
  const [value, setValue] = useState('')
  function submit(e) {
    e.preventDefault()
    if (!value.trim() || locked) return
    const result = checkTyped(value, exercise.answers)
    onAnswer(result.ok, { note: result.typo ? `Presque ! L'orthographe exacte est « ${result.typo} ».` : null })
  }
  return (
    <form onSubmit={submit} className="space-y-5">
      <Prompt>{exercise.prompt}</Prompt>
      {exercise.sentence ? (
        <div className="rounded-2xl border border-line bg-card p-4">
          <p className="text-xl leading-snug font-bold">{exercise.sentence}</p>
          <p className="mt-1 text-sm text-muted">{exercise.fr}</p>
        </div>
      ) : (
        <p className="text-3xl font-extrabold">{exercise.fr}</p>
      )}
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={locked}
        autoFocus
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        lang="en"
        placeholder="Écris en anglais…"
        className="h-14 w-full rounded-2xl border-2 border-line bg-card px-4 text-xl font-bold outline-none focus:border-indigo-500"
        aria-label="Ta réponse en anglais"
      />
      {!locked && (
        <button type="submit" disabled={!value.trim()} className="h-12 w-full rounded-2xl bg-indigo-500 font-bold text-white disabled:bg-line disabled:text-muted">
          Vérifier
        </button>
      )}
    </form>
  )
}

// ---------- Prononcer au micro ----------
export function SpeakExercise({ exercise, locked, onAnswer, onSkip }) {
  const [state, setState] = useState('idle') // idle | listening | retry
  const [heard, setHeard] = useState(null)
  const [error, setError] = useState(canListen() ? null : 'unsupported')
  const [fails, setFails] = useState(0)
  const session = useRef(null)
  useEffect(() => () => session.current?.stop(), [])

  async function record() {
    setError(null)
    setHeard(null)
    setState('listening')
    session.current = listen()
    try {
      const alternatives = await session.current.promise
      const result = matchesSpeech(alternatives, exercise.text)
      setHeard(result.heard)
      if (result.ok) {
        setState('idle')
        onAnswer(true, { note: `Entendu : « ${result.heard} »` })
      } else {
        setFails((f) => f + 1)
        setState('retry')
        // On fait réécouter la bonne prononciation
        setTimeout(() => speak(exercise.text, 0.85), 400)
      }
    } catch (e) {
      setError(e.message in LISTEN_ERRORS ? e.message : 'aborted')
      setState('idle')
    }
  }

  const blocking = ['unsupported', 'not-allowed', 'service-not-allowed', 'audio-capture'].includes(error)

  return (
    <div className="space-y-5">
      <Prompt>{exercise.prompt}</Prompt>
      <div className="rounded-2xl border border-line bg-card p-4">
        <div className="flex items-start gap-3">
          <SpeakButton text={exercise.text} slow />
          <div>
            <p className="text-2xl leading-snug font-extrabold" lang="en">
              {exercise.text}
            </p>
            <p className="mt-1 text-sm text-muted">{exercise.fr}</p>
          </div>
        </div>
      </div>

      {!locked && !blocking && (
        <div className="flex flex-col items-center gap-3 py-2">
          <button
            type="button"
            onClick={state === 'listening' ? () => session.current?.stop() : record}
            className={`grid size-24 place-items-center rounded-full text-white shadow-lg transition-transform active:scale-95 ${state === 'listening' ? 'animate-pulse bg-red-500' : 'bg-indigo-500'}`}
            aria-label={state === 'listening' ? "Arrêter l'écoute" : 'Appuie et parle'}
          >
            <Mic size={40} />
          </button>
          <p className="text-sm font-semibold text-muted">{state === 'listening' ? "Je t'écoute… parle maintenant" : state === 'retry' ? 'Réessaie !' : 'Appuie sur le micro et lis la phrase'}</p>
        </div>
      )}

      {state === 'retry' && !locked && (
        <div className="space-y-2 rounded-2xl bg-amber-400/10 p-4 text-sm leading-snug">
          <p>
            J'ai entendu : <span className="font-bold">« {heard} »</span>. Ce n'est pas encore ça.
          </p>
          <p className="flex items-center gap-1.5 text-muted">
            <Volume2 size={16} /> Écoute la bonne prononciation, puis réessaie.
          </p>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => speak(exercise.text, 0.85)} className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-line bg-card font-semibold">
              <Volume2 size={16} /> Réécouter
            </button>
            <button type="button" onClick={record} className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-500 font-semibold text-white">
              <RotateCcw size={16} /> Réessayer
            </button>
          </div>
          {fails >= 2 && (
            <button type="button" onClick={() => onAnswer(false, { note: 'Continue à t’entraîner, ça viendra !' })} className="w-full pt-1 text-center text-sm font-semibold text-muted underline">
              Continuer sans valider
            </button>
          )}
        </div>
      )}

      {error && !locked && (
        <p className={`flex gap-2 rounded-2xl p-3 text-sm leading-snug ${blocking ? 'bg-red-500/10' : 'bg-amber-400/10'}`}>
          {blocking && <MicOff size={18} className="shrink-0 text-red-400" />}
          {LISTEN_ERRORS[error]}
        </p>
      )}

      {!locked && (
        <button
          type="button"
          onClick={onSkip}
          className={`flex w-full items-center justify-center gap-1.5 rounded-2xl font-semibold ${blocking ? 'h-12 bg-indigo-500 text-white' : 'h-10 text-sm text-muted'}`}
        >
          <SkipForward size={16} /> {blocking ? "Passer l'exercice" : 'Je ne peux pas parler maintenant · passer'}
        </button>
      )}
      {!canSpeak() && <p className="text-xs text-muted">La lecture audio n'est pas disponible sur ce navigateur.</p>}
    </div>
  )
}

function Prompt({ children }) {
  return <h2 className="text-xl leading-snug font-extrabold">{children}</h2>
}
