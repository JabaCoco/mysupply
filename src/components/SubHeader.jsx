import { Link } from 'react-router'
import { ChevronLeft } from 'lucide-react'

// En-tête des sous-pages : bouton retour + titre (+ sous-titre facultatif)
export default function SubHeader({ back, title, subtitle }) {
  return (
    <header className="mb-4 flex items-start gap-2">
      <Link to={back} className="-ml-2 grid size-10 shrink-0 place-items-center rounded-full text-muted hover:bg-card" aria-label="Retour">
        <ChevronLeft size={24} />
      </Link>
      <div className="min-w-0 pt-1">
        <h1 className="text-2xl leading-tight font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
    </header>
  )
}
