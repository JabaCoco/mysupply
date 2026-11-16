import { Snail, Volume2 } from 'lucide-react'
import { canSpeak, speak } from '../../lib/speech.js'

// Bouton haut-parleur : lit le texte en anglais (et version lente si `slow`)
export default function SpeakButton({ text, size = 'md', slow = false, className = '' }) {
  if (!canSpeak()) return null
  const dims = size === 'lg' ? 'size-14' : size === 'sm' ? 'size-8' : 'size-10'
  const icon = size === 'lg' ? 26 : size === 'sm' ? 16 : 20
  return (
    <span className={`inline-flex gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          speak(text)
        }}
        className={`grid ${dims} shrink-0 place-items-center rounded-full bg-indigo-500 text-white transition-transform active:scale-90`}
        aria-label={`Écouter : ${text}`}
      >
        <Volume2 size={icon} />
      </button>
      {slow && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            speak(text, 0.6)
          }}
          className={`grid ${dims} shrink-0 place-items-center rounded-full border border-line bg-card text-muted transition-transform active:scale-90`}
          aria-label={`Écouter lentement : ${text}`}
        >
          <Snail size={icon - 2} />
        </button>
      )}
    </span>
  )
}
