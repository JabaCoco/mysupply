import { Link } from 'react-router'
import { Check, ChevronRight } from 'lucide-react'
import Page from '../../../components/Page.jsx'
import SubHeader from '../../../components/SubHeader.jsx'
import { EXCEL_CHALLENGES } from '../../../data/atelier/excel.js'
import { useWorkshop, XP_EXCEL } from '../../../lib/atelier.js'
import { useDailyChallenge } from '../../../lib/dailyChallenge.js'

const LEVELS = { 1: 'Facile', 2: 'Moyen', 3: 'Avancé' }

export default function ExcelList() {
  const workshop = useWorkshop()
  const daily = useDailyChallenge()
  if (!workshop) return null
  const dailyId = daily?.type === 'excel' ? daily.id : null
  const doneCount = EXCEL_CHALLENGES.filter((c) => workshop.has(`excel/${c.id}`)).length

  return (
    <Page>
      <SubHeader back="/atelier" title="Défis Excel" subtitle={`${doneCount} / ${EXCEL_CHALLENGES.length} réussis · +${XP_EXCEL} XP par défi`} />
      <ul className="space-y-2.5">
        {EXCEL_CHALLENGES.map((c) => {
          const done = workshop.has(`excel/${c.id}`)
          return (
            <li key={c.id}>
              <Link to={`/atelier/excel/${c.id}`} className="flex items-center gap-3 rounded-2xl border border-line bg-card p-3.5">
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-xl font-mono text-[10px] font-bold ${
                    done ? 'bg-emerald-500 text-white' : 'bg-blue-500/15 text-blue-400'
                  }`}
                >
                  {done ? <Check size={18} strokeWidth={3} /> : 'fx'}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-bold">{c.title}</span>
                    {c.id === dailyId && (
                      <span className="shrink-0 rounded-md bg-blue-500 px-1.5 py-0.5 text-[10px] font-bold text-white">DU JOUR</span>
                    )}
                  </span>
                  <span className="text-xs text-muted">
                    <span className="font-mono">{c.fn}</span> · {LEVELS[c.level]}
                  </span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-muted" />
              </Link>
            </li>
          )
        })}
      </ul>
    </Page>
  )
}
