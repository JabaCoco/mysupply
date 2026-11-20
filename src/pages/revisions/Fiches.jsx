import { useState } from 'react'
import { useParams } from 'react-router'
import { ChevronDown } from 'lucide-react'
import Page from '../../components/Page.jsx'
import SubHeader from '../../components/SubHeader.jsx'
import { useRevisions } from '../../lib/revStore.js'
import { cardFav } from '../../lib/favorites.js'
import FavButton from '../../components/FavButton.jsx'
import RichBlock from './RichBlock.jsx'

// Lecture des fiches d'un lot : une carte repliable par fiche
export default function Fiches() {
  const { id } = useParams()
  const data = useRevisions()
  const [open, setOpen] = useState(0)
  if (!data) return null
  const lot = data.lots.find((l) => l.id === id)
  const fiches = lot?.items.filter((it) => it.type === 'fiche') ?? []
  return (
    <Page>
      <SubHeader back={`/revisions/lot/${id}`} title="Fiches" subtitle={lot ? lot.title : ''} />
      {fiches.length === 0 ? (
        <p className="text-muted">Aucune fiche dans ce lot.</p>
      ) : (
        <div className="space-y-2">
          {fiches.map((f, i) => (
            <div key={f.id} className="overflow-hidden rounded-2xl border border-line bg-card">
              <div className="flex items-center">
                <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex min-w-0 flex-1 items-center gap-2 p-3.5 text-left font-bold">
                  <span className="flex-1">{f.title}</span>
                  <ChevronDown size={18} className={`shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
                </button>
                <FavButton item={cardFav(lot, f)} className="mr-1" />
              </div>
              {open === i && <RichBlock text={f.body} className="border-t border-line p-3.5" />}
            </div>
          ))}
        </div>
      )}
    </Page>
  )
}
