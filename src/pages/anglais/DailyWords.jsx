import { motion } from 'motion/react'
import { Check, RotateCcw } from 'lucide-react'
import { setWordStatus, XP_DAILY_WORD } from '../../lib/english.js'
import SpeakButton from './SpeakButton.jsx'

// Les mots du jour : 3 cartes à faire défiler, à trier en "Je connais" / "À revoir"
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
        {words.map((word, i) => {
          const s = status(word.en)
          return (
            <motion.li
              key={word.en}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="w-[85%] shrink-0 snap-center sm:w-72"
            >
              <div className="flex h-full flex-col rounded-3xl bg-linear-to-br from-indigo-500 to-violet-500 p-5 text-white shadow-lg shadow-indigo-900/30">
                <p className="text-xs font-bold tracking-wider text-white/75 uppercase">
                  Mot {i + 1} / {words.length}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <SpeakButton text={word.en} />
                  <p className="text-3xl font-extrabold" lang="en">
                    {word.en}
                  </p>
                </div>
                <p className="mt-1 text-lg text-white/90">{word.fr}</p>
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
                    className={`flex h-11 items-center justify-center gap-1.5 rounded-xl text-sm font-bold ${s === 'known' ? 'bg-white text-indigo-600' : 'bg-white/20'}`}
                    aria-pressed={s === 'known'}
                  >
                    <Check size={16} /> Je connais
                  </button>
                  <button
                    type="button"
                    onClick={() => setWordStatus(word.en, 'review', true)}
                    className={`flex h-11 items-center justify-center gap-1.5 rounded-xl text-sm font-bold ${s === 'review' ? 'bg-white text-indigo-600' : 'bg-white/20'}`}
                    aria-pressed={s === 'review'}
                  >
                    <RotateCcw size={16} /> À revoir
                  </button>
                </div>
              </div>
            </motion.li>
          )
        })}
      </ul>
    </section>
  )
}
