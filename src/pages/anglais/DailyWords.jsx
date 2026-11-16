import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Check, RotateCcw } from 'lucide-react'
import { cardFace, setWordStatus, XP_DAILY_WORD } from '../../lib/english.js'
import SpeakButton from './SpeakButton.jsx'

// Les mots du jour : 3 flashcards. Le recto ne montre qu'un mot (anglais ou français, au hasard) :
// on essaie de deviner, puis on retourne la carte pour voir la réponse et on la trie.
export default function DailyWords({ words, status }) {
  if (!words.length) return null
  const sorted = words.filter((w) => ['known', 'review'].includes(status(w.en))).length

  return (
    <section>
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="font-bold">Tes mots du jour</h2>
        <p className="text-xs text-muted">
          {sorted} / {words.length} triés · +{XP_DAILY_WORD} XP par carte
        </p>
      </div>
      <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {words.map((word, i) => (
          <motion.li
            key={word.en}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="w-[85%] shrink-0 snap-center sm:w-72"
          >
            <FlashCard word={word} index={i} total={words.length} status={status(word.en)} />
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

const FACE = 'rounded-3xl bg-linear-to-br from-indigo-500 to-violet-500 p-5 text-white shadow-lg shadow-indigo-900/30'
const HIDE_BACK = { backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }

function FlashCard({ word, index, total, status }) {
  const reduceMotion = useReducedMotion()
  const face = cardFace(word.en) // langue du recto
  const alreadySorted = status === 'known' || status === 'review'
  const [flipped, setFlipped] = useState(alreadySorted)

  return (
    <div className="h-full" style={{ perspective: 1000 }}>
      <motion.div
        className="grid h-full"
        style={{ transformStyle: 'preserve-3d' }}
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.55, ease: 'easeInOut' }}
      >
        {/* RECTO : seulement le mot. Le haut-parleur n'apparaît que si le mot est en anglais. */}
        <div
          className={`relative flex flex-col justify-center ${FACE}`}
          style={{ ...HIDE_BACK, gridArea: '1 / 1' }}
          aria-hidden={flipped}
          inert={flipped}
        >
          <p className="text-xs font-bold tracking-wider text-white/75 uppercase">
            Mot {index + 1} / {total} · {face === 'en' ? 'devine la traduction' : "devine le mot en anglais"}
          </p>
          <div className="mt-3 flex items-center gap-3">
            {face === 'en' && (
              <span className="relative z-10">
                <SpeakButton text={word.en} />
              </span>
            )}
            <p className="text-4xl font-extrabold" lang={face}>
              {face === 'en' ? word.en : word.fr}
            </p>
          </div>
          <p className="mt-5 text-sm text-white/75">Touche la carte pour la retourner</p>
          <button
            type="button"
            onClick={() => setFlipped(true)}
            className="absolute inset-0 rounded-3xl"
            aria-label="Retourner la carte pour voir la réponse"
          />
        </div>

        {/* VERSO : la réponse (mot anglais + 🔊, traduction), la définition, l'exemple, puis le tri */}
        <div
          className={`flex flex-col ${FACE}`}
          style={{ ...HIDE_BACK, gridArea: '1 / 1', transform: 'rotateY(180deg)' }}
          aria-hidden={!flipped}
          inert={!flipped}
        >
          <p className="text-xs font-bold tracking-wider text-white/75 uppercase">
            Mot {index + 1} / {total} · réponse
          </p>
          <div className="mt-2 flex items-center gap-3">
            <SpeakButton text={word.en} />
            <p className="text-3xl font-extrabold" lang="en">
              {word.en}
            </p>
          </div>
          <p className="mt-1 text-lg text-white/90">{word.fr}</p>
          <p className="mt-2 text-sm leading-snug text-white/85">
            <span className="font-bold">Définition : </span>
            {word.def}
          </p>
          <div className="mt-3 rounded-2xl bg-white/15 p-3 text-sm leading-snug">
            <p className="font-semibold" lang="en">
              {word.ex}
            </p>
            <p className="text-white/75">{word.exFr}</p>
          </div>
          {word.note && <p className="mt-2 text-xs leading-snug text-white/85">⚠ {word.note}</p>}
          <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
            <button
              type="button"
              onClick={() => setWordStatus(word.en, 'known', true)}
              className={`flex h-11 items-center justify-center gap-1.5 rounded-xl text-sm font-bold ${status === 'known' ? 'bg-white text-indigo-600' : 'bg-white/20'}`}
              aria-pressed={status === 'known'}
            >
              <Check size={16} /> Je connais
            </button>
            <button
              type="button"
              onClick={() => setWordStatus(word.en, 'review', true)}
              className={`flex h-11 items-center justify-center gap-1.5 rounded-xl text-sm font-bold ${status === 'review' ? 'bg-white text-indigo-600' : 'bg-white/20'}`}
              aria-pressed={status === 'review'}
            >
              <RotateCcw size={16} /> À revoir
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
