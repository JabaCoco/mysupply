import { useState } from 'react'
import { Check, RotateCcw, Search } from 'lucide-react'
import Page from '../../components/Page.jsx'
import SubHeader from '../../components/SubHeader.jsx'
import { ALL_WORDS } from '../../data/anglais/units.js'
import { setWordStatus, useEnglish } from '../../lib/english.js'
import SpeakButton from './SpeakButton.jsx'

const FILTERS = [
  { id: 'all', label: 'Tous' },
  { id: 'review', label: 'À revoir' },
  { id: 'known', label: 'Connus' },
]

// Lexique : tous les mots déjà rencontrés (leçons + mots du jour)
export default function Lexique() {
  const en = useEnglish()
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  if (!en) return null

  const met = ALL_WORDS.filter((w) => en.status(w.en))
  const q = query.trim().toLowerCase()
  const shown = met
    .filter((w) => filter === 'all' || en.status(w.en) === filter)
    .filter((w) => !q || w.en.toLowerCase().includes(q) || w.fr.toLowerCase().includes(q))
    .sort((a, b) => a.en.localeCompare(b.en))
  const count = (id) => (id === 'all' ? met.length : met.filter((w) => en.status(w.en) === id).length)

  return (
    <Page>
      <SubHeader back="/anglais" title="Mon lexique" subtitle={`${met.length} mot${met.length > 1 ? 's' : ''} rencontré${met.length > 1 ? 's' : ''} sur ${ALL_WORDS.length}`} />
      <div className="space-y-3">
        <label className="flex items-center gap-2 rounded-2xl border border-line bg-card px-3 focus-within:border-indigo-500">
          <Search size={18} className="text-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Chercher un mot (anglais ou français)" className="h-11 flex-1 bg-transparent outline-none" />
        </label>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${filter === f.id ? 'bg-indigo-500 text-white' : 'border border-line bg-card text-muted'}`}
            >
              {f.label} <span className="opacity-70">{count(f.id)}</span>
            </button>
          ))}
        </div>

        {met.length === 0 && <p className="rounded-2xl border border-line bg-card p-4 text-sm text-muted">Ton lexique est vide : fais une leçon ou trie tes mots du jour pour le remplir.</p>}

        <ul className="space-y-2">
          {shown.map((w) => {
            const s = en.status(w.en)
            return (
              <li key={w.en} className="flex items-center gap-3 rounded-2xl border border-line bg-card p-3">
                <SpeakButton text={w.en} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold" lang="en">
                    {w.en}
                  </p>
                  <p className="truncate text-sm text-muted">{w.fr}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setWordStatus(w.en, s === 'review' ? 'known' : 'review')}
                  className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold ${s === 'review' ? 'bg-amber-400/15 text-amber-400' : s === 'known' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-line/60 text-muted'}`}
                  aria-label={s === 'review' ? 'Marquer comme connu' : 'Marquer à revoir'}
                >
                  {s === 'review' ? <RotateCcw size={13} /> : <Check size={13} />}
                  {s === 'review' ? 'À revoir' : s === 'known' ? 'Connu' : 'Vu'}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </Page>
  )
}
