import { Link } from 'react-router'
import { Coffee } from 'lucide-react'

// Carte violette : les shorts éco / supply chain des dernières 48 h
export default function CafeCard({ shorts, seen, loading }) {
  const total = shorts.length
  const watched = shorts.filter((v) => seen.has(v.id)).length
  const channels = [...new Set(shorts.map((v) => v.source))].slice(0, 3)

  let headline = `${total} vidéo${total > 1 ? 's' : ''} · ${watched} vue${watched > 1 ? 's' : ''}`
  let teaser = `${channels.join(', ')}… l'actu supply chain et éco du jour, en format court.`
  if (loading) {
    headline = 'Chargement…'
    teaser = "On prépare l'actu du jour."
  } else if (total === 0) {
    headline = 'Pas encore de vidéo'
    teaser = "Aucune vidéo courte éco ou supply chain pour l'instant. Reviens un peu plus tard !"
  }

  return (
    <Link
      to="/actu"
      className="block rounded-3xl bg-linear-to-br from-violet-500 to-purple-400 p-5 text-white shadow-lg shadow-violet-900/30 transition-transform active:scale-[0.98]"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-white/20">
          <Coffee size={22} />
        </span>
        <div>
          <p className="text-xs font-bold tracking-wider text-white/80 uppercase">Ton café du matin</p>
          <p className="text-xl font-extrabold">{headline}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-snug text-white/90">{teaser}</p>
      {total > 0 && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/25">
          <div className="h-full rounded-full bg-white" style={{ width: `${(watched / total) * 100}%` }} />
        </div>
      )}
    </Link>
  )
}
