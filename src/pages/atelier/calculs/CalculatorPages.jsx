import { Link, Navigate, useParams, useSearchParams } from 'react-router'
import { motion } from 'motion/react'
import { BookOpen, Calculator, ChevronRight, PenLine } from 'lucide-react'
import Page from '../../../components/Page.jsx'
import SubHeader from '../../../components/SubHeader.jsx'
import { atelierFav } from '../../../lib/favorites.js'
import { FORMULAS, FORMULA_LIST } from '../../../data/atelier/formulas.js'
import { useWorkshop } from '../../../lib/atelier.js'
import { CALCULATOR_COMPONENTS } from './definitions.jsx'
import FormulaCourse from './FormulaCourse.jsx'
import Exercises from './Exercises.jsx'
import GenericCalculator from './GenericCalculator.jsx'

// Liste des formules (/atelier/calculs)
export function CalculatorList() {
  const workshop = useWorkshop()
  return (
    <Page>
      <SubHeader back="/atelier" title="Formules et calculs" subtitle="Cours, exercices corrigés et calculateur" />
      <ul className="space-y-2.5">
        {FORMULA_LIST.map((f) => {
          const solved = workshop?.get(`calc/${f.id}`)?.solved ?? 0
          return (
            <li key={f.id}>
              <Link to={`/atelier/calculs/${f.id}`} className="flex items-center gap-3 rounded-2xl border border-line bg-card p-4">
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{f.title}</span>
                  <span className="font-mono text-xs text-muted">{f.short}</span>
                  <span className="block text-xs text-muted">
                    Cours · {FORMULAS[f.id].exercises.length} exercices par série
                    {solved > 0 && <span className="font-semibold text-emerald-400"> · {solved} réussi{solved > 1 ? 's' : ''}</span>}
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

const TABS = [
  { id: 'cours', label: 'Cours', icon: BookOpen },
  { id: 'exercices', label: 'Exercices', icon: PenLine },
  { id: 'calculateur', label: 'Calculateur', icon: Calculator },
]

// Une formule (/atelier/calculs/:id?onglet=cours|exercices|calculateur)
export function CalculatorPage() {
  const { id } = useParams()
  const [params, setParams] = useSearchParams()
  const info = FORMULA_LIST.find((f) => f.id === id)
  if (!info) return <Navigate to="/atelier/calculs" replace />

  const tab = TABS.some((t) => t.id === params.get('onglet')) ? params.get('onglet') : 'cours'
  const course = FORMULAS[id]
  const Free = CALCULATOR_COMPONENTS[id]
  const go = (t) => {
    setParams({ onglet: t }, { replace: true })
    window.scrollTo({ top: 0 })
  }

  return (
    <Page>
      <SubHeader back="/atelier/calculs" title={info.title} subtitle={info.short} fav={atelierFav({ key: `calcul/${id}`, title: info.title, sub: 'Formules et calculs', to: `/atelier/calculs/${id}` })} />

      <div className="mb-5 grid grid-cols-3 gap-1 rounded-2xl border border-line bg-card p-1" role="tablist">
        {TABS.map(({ id: t, label, icon: Icon }) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => go(t)}
            className={`relative flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-semibold ${tab === t ? 'text-white' : 'text-muted'}`}
          >
            {tab === t && <motion.span layoutId="formula-tab" className="absolute inset-0 rounded-xl bg-violet-500" />}
            <Icon size={15} className="relative" />
            <span className="relative">{label}</span>
          </button>
        ))}
      </div>

      {tab === 'cours' && <FormulaCourse course={course} onStart={() => go('exercices')} />}
      {tab === 'exercices' && <Exercises formulaId={id} course={course} />}
      {tab === 'calculateur' && (Free ? <Free /> : <GenericCalculator spec={course.calculator} />)}
    </Page>
  )
}
