import { Link } from 'react-router'
import { ArrowRight, Beer, Calculator, Check, Gamepad2, Languages, Sheet, Truck, Users } from 'lucide-react'
import Page from '../../components/Page.jsx'
import { EXCEL_CHALLENGES } from '../../data/atelier/excel.js'
import { CASES } from '../../data/atelier/cases.js'
import { FORMULA_LIST } from '../../data/atelier/formulas.js'
import { useWorkshop } from '../../lib/atelier.js'
import { useDailyChallenge } from '../../lib/dailyChallenge.js'

// Icône et couleur de chaque type de défi
export const DAILY_STYLE = {
  excel: { icon: Sheet, gradient: 'from-blue-500 to-sky-400', solid: 'bg-blue-500' },
  calcul: { icon: Calculator, gradient: 'from-emerald-500 to-teal-400', solid: 'bg-emerald-500' },
  cas: { icon: Users, gradient: 'from-orange-500 to-amber-400', solid: 'bg-orange-500' },
  simulateur: { icon: Gamepad2, gradient: 'from-pink-500 to-rose-400', solid: 'bg-pink-500' },
  anglais: { icon: Languages, gradient: 'from-indigo-500 to-violet-400', solid: 'bg-indigo-500' },
}

export default function Atelier() {
  const workshop = useWorkshop()
  const daily = useDailyChallenge()
  if (!workshop) return null
  const excelDone = EXCEL_CHALLENGES.filter((c) => workshop.has(`excel/${c.id}`)).length
  const casesDone = CASES.filter((c) => workshop.has(`cas/${c.id}`)).length
  const solved = FORMULA_LIST.reduce((s, f) => s + (workshop.get(`calc/${f.id}`)?.solved ?? 0), 0)
  const sim = workshop.get('simulateur')
  const beer = workshop.get('biere')
  const truck = workshop.get('chargement')

  const sections = [
    { to: '/atelier/excel', ...DAILY_STYLE.excel, title: 'Défis Excel', info: `${excelDone} / ${EXCEL_CHALLENGES.length} réussis` },
    { to: '/atelier/calculs', ...DAILY_STYLE.calcul, title: 'Formules et calculs', info: solved ? `${solved} exercices réussis` : 'Cours + exercices' },
    { to: '/atelier/cas', ...DAILY_STYLE.cas, title: 'Études de cas', info: `${casesDone} / ${CASES.length} terminées` },
    { to: '/atelier/simulateur', ...DAILY_STYLE.simulateur, title: 'Simulateur', info: sim?.bestGap !== undefined ? `Meilleur écart : ${sim.bestGap > 0 ? '+' : ''}${Math.round(sim.bestGap * 100)} % vs cours` : 'Gère ton stock' },
    { to: '/atelier/biere', icon: Beer, solid: 'bg-amber-500', title: 'Jeu de la bière', info: beer?.bestGap !== undefined ? `Meilleur écart : ${beer.bestGap > 0 ? '+' : ''}${Math.round(beer.bestGap * 100)} % vs règle auto` : 'Effet coup de fouet' },
    { to: '/atelier/chargement', icon: Truck, solid: 'bg-teal-500', title: 'Plan de chargement', info: truck?.bestScore !== undefined ? `Meilleur score : ${truck.bestScore} / 100` : 'Charge le camion' },
  ]

  return (
    <Page>
      <div className="space-y-4">
        <header>
          <h1 className="text-3xl font-extrabold tracking-tight">Atelier</h1>
          <p className="text-sm text-muted">Pratique : Excel, calculs, cas réels et simulation</p>
        </header>

        {daily && <DailyCard daily={daily} />}

        <div className="grid grid-cols-2 gap-3">
          {sections.map(({ to, icon: Icon, solid, title, info }) => (
            <Link key={to} to={to} className="block rounded-3xl border border-line bg-card p-4 transition-transform active:scale-[0.97]">
              <span className={`grid size-10 place-items-center rounded-xl text-white ${solid}`}>
                <Icon size={20} />
              </span>
              <p className="mt-3 font-bold">{title}</p>
              <p className="text-xs text-muted">{info}</p>
            </Link>
          ))}
        </div>
      </div>
    </Page>
  )
}

// Grande carte du défi du jour (type variable)
function DailyCard({ daily }) {
  const { icon: Icon, gradient } = DAILY_STYLE[daily.type]
  return (
    <Link to={daily.to} className={`block rounded-3xl bg-linear-to-br p-5 text-white shadow-lg transition-transform active:scale-[0.98] ${gradient}`}>
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/20">
          <Icon size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold tracking-wider text-white/80 uppercase">Défi du jour · {daily.label}</p>
          <p className="truncate text-xl font-extrabold">{daily.title}</p>
        </div>
        {daily.done && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-white/25 px-2.5 py-1 text-xs font-bold">
            <Check size={14} strokeWidth={3} /> Réussi
          </span>
        )}
      </div>
      <p className="mt-3 flex items-center justify-between gap-2 text-sm text-white/90">
        <span>{daily.done ? 'Nouveau défi demain !' : daily.subtitle}</span>
        <ArrowRight size={18} className="shrink-0" />
      </p>
    </Link>
  )
}
