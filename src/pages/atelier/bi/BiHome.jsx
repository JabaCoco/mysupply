import { Link } from 'react-router'
import { Briefcase, Check, ChevronRight, LayoutDashboard, Workflow } from 'lucide-react'
import Page from '../../../components/Page.jsx'
import SubHeader from '../../../components/SubHeader.jsx'
import { BI_LESSONS, DASHBOARDS, INTERVIEW, PQ_LESSONS, PQ_SCENARIOS } from '../../../data/atelier/bi/index.js'
import { useWorkshop } from '../../../lib/atelier.js'
import { SimulationNotice } from './shared.jsx'

// Accueil du module (/atelier/bi) : parcours Power Query, parcours Power BI, mises en situation, entretien
export default function BiHome() {
  const workshop = useWorkshop()
  if (!workshop) return null
  const solved = (id) => workshop.get(`bi/${id}`)?.solved ?? 0
  const simsDone = PQ_SCENARIOS.filter((s) => workshop.has(`bi/${s.id}`)).length
  const dashDone = DASHBOARDS.filter((d) => workshop.has(`bi/${d.id}`)).length
  const knownQ = INTERVIEW.filter((q) => workshop.get(`bi/ent/${q.id}`)?.status === 'known').length

  return (
    <Page>
      <SubHeader back="/atelier" title="Power Query & Power BI" subtitle="De zéro à l’entretien : un mini-cours avant chaque exercice" />
      <div className="space-y-6">
        <SimulationNotice />

        <LessonGroup title="1. Power Query : préparer les données" lessons={PQ_LESSONS} solved={solved} />
        <LessonGroup title="2. Power BI : modéliser et visualiser" lessons={BI_LESSONS} solved={solved} />

        <section>
          <h2 className="mb-2 text-lg font-extrabold">3. Mises en situation</h2>
          <ul className="space-y-2.5">
            <Entry to="/atelier/bi/simulateur" icon={Workflow} color="bg-fuchsia-500" title="Simulateur Power Query" info={`${simsDone} / ${PQ_SCENARIOS.length} scénarios réussis · transforme un tableau sale dans le bon ordre`} />
            <Entry to="/atelier/bi/tableau" icon={LayoutDashboard} color="bg-purple-500" title="Constructeur de tableau de bord" info={`${dashDone} / ${DASHBOARDS.length} tableaux validés · choisis visuels et mesures pour une question métier`} />
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-extrabold">4. Préparer l’entretien</h2>
          <ul className="space-y-2.5">
            <Entry to="/atelier/bi/entretien" icon={Briefcase} color="bg-violet-500" title="Questions d’entretien" info={`${knownQ} / ${INTERVIEW.length} maîtrisées · réponse à dire à l’oral + réponse détaillée`} />
          </ul>
        </section>
      </div>
    </Page>
  )
}

function LessonGroup({ title, lessons, solved }) {
  return (
    <section>
      <h2 className="mb-2 text-lg font-extrabold">{title}</h2>
      <ul className="space-y-2.5">
        {lessons.map((l) => {
          const n = solved(l.id)
          return (
            <li key={l.id}>
              <Link to={`/atelier/bi/cours/${l.id}`} className="flex items-center gap-3 rounded-2xl border border-line bg-card p-4">
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{l.title}</span>
                  <span className="block text-xs text-muted">{l.short}</span>
                  {n > 0 && (
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                      <Check size={12} strokeWidth={3} /> {n} exercice{n > 1 ? 's' : ''} réussi{n > 1 ? 's' : ''}
                    </span>
                  )}
                </span>
                <ChevronRight size={18} className="shrink-0 text-muted" />
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Entry({ to, icon: Icon, color, title, info }) {
  return (
    <li>
      <Link to={to} className="flex items-center gap-3 rounded-2xl border border-line bg-card p-4">
        <span className={`grid size-10 shrink-0 place-items-center rounded-xl text-white ${color}`}>
          <Icon size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold">{title}</span>
          <span className="block text-xs text-muted">{info}</span>
        </span>
        <ChevronRight size={18} className="shrink-0 text-muted" />
      </Link>
    </li>
  )
}
