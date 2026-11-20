import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'
import { shareLink } from '../lib/device.js'

// Bouton « Partager » : feuille de partage si disponible, sinon le lien est copié (le bouton le confirme).
export default function ShareButton({ title, url, className = '', label = false, size = 16 }) {
  const [state, setState] = useState(null) // 'copie' | 'partage' | 'echec' | null
  if (!url) return null
  async function share(event) {
    event.preventDefault()
    event.stopPropagation()
    const result = await shareLink(title, url)
    if (result === 'annule') return
    setState(result)
    setTimeout(() => setState(null), 2200)
  }
  const done = state === 'copie' || state === 'partage'
  const text = state === 'copie' ? 'Lien copié' : state === 'echec' ? 'Copie impossible' : 'Partager'
  return (
    <button type="button" onClick={share} aria-label={done || state === 'echec' ? text : 'Partager le lien'} title="Partager le lien" className={`flex shrink-0 items-center justify-center gap-1.5 transition-transform active:scale-90 ${className}`}>
      {done ? <Check size={size} /> : <Share2 size={size} />}
      {label && <span>{text}</span>}
      <span className="sr-only" role="status">
        {state === 'copie' ? 'Lien copié dans le presse-papiers' : ''}
      </span>
    </button>
  )
}
