import { Link } from 'react-router'
import { ChevronLeft } from 'lucide-react'
import FavButton from './FavButton.jsx'

// En-tête des sous-pages : bouton retour + titre (+ sous-titre facultatif) (+ cœur « favori » si `fav` est donné, voir src/lib/favorites.js)
export default function SubHeader({ back, title, subtitle, fav }) {
  return (
    <header className="mb-4 flex items-start gap-2">
      <Link to={back} className="-ml-2 grid size-10 shrink-0 place-items-center rounded-full text-muted hover:bg-card" aria-label="Retour">
        <ChevronLeft size={24} />
      </Link>
      <div className="min-w-0 flex-1 pt-1">
        <h1 className="text-2xl leading-tight font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {fav && <FavButton item={fav} className="-mr-2" />}
    </header>
  )
}
