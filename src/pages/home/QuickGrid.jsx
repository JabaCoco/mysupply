import { Link } from 'react-router'
import { Award, CheckCircle2, Layers, Languages } from 'lucide-react'
import { placeholders } from '../../data/daily.js'
import { cardFace, useEnglish } from '../../lib/english.js'
import { useDueCount } from '../../lib/revStore.js'
import { useDailyChallenge } from '../../lib/dailyChallenge.js'
import { DAILY_STYLE } from '../atelier/Atelier.jsx'

function Tile({ to, icon: Icon, color, label, value }) {
  const content = (
    <>
      <span className={`grid size-10 place-items-center rounded-xl text-white ${color}`}>
        <Icon size={20} />
      </span>
      <p className="mt-3 text-xs text-muted">{label}</p>
      <p className="truncate font-bold">{value}</p>
    </>
  )
  const className = 'block rounded-3xl border border-line bg-card p-4'

  return to ? (
    <Link to={to} className={`${className} transition-transform active:scale-[0.97]`}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  )
}

export default function QuickGrid() {
  const { badges } = placeholders
  const due = useDueCount()
  const daily = useDailyChallenge()
  const word = useEnglish()?.dailyWords[0]
  const style = DAILY_STYLE[daily?.type ?? 'excel']

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Tile
        to={daily?.to ?? '/atelier'}
        icon={daily?.done ? CheckCircle2 : style.icon}
        color={daily?.done ? 'bg-emerald-500' : style.solid}
        label={daily ? `Défi du jour · ${daily.label}` : 'Défi du jour'}
        value={daily ? (daily.done ? 'Réussi ✓' : daily.title) : '…'}
      />
      <Tile to="/anglais" icon={Languages} color="bg-pink-500" label="Word of the day" value={word ? (cardFace(word.en) === 'en' ? word.en : word.fr) : '…'} />
      <Tile to="/revisions" icon={Layers} color="bg-orange-500" label="À réviser aujourd'hui" value={due === null ? '…' : due === 0 ? 'Tout est à jour ✓' : `${due} carte${due > 1 ? 's' : ''}`} />
      <Tile icon={Award} color="bg-amber-400" label="Badges gagnés" value={`${badges.won} / ${badges.total}`} />
    </div>
  )
}
