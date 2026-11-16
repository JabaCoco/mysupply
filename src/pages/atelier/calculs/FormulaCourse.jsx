import { CheckCircle2, FlaskConical, Sigma, Target } from 'lucide-react'
import RichText from '../../../components/RichText.jsx'

// Les formules et le sens de chaque terme (réutilisé dans le cours ET dans l'indice des exercices)
export function FormulaReminder({ course }) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {course.formulas.map((f) => (
          <p key={f} className="rounded-xl border-2 border-violet-500 bg-card px-3 py-3 text-center font-mono text-[15px] font-bold">
            {f}
          </p>
        ))}
      </div>
      <dl className="space-y-1.5">
        {course.terms.map(([term, meaning]) => (
          <div key={term} className="flex gap-3 text-sm leading-snug">
            <dt className="w-24 shrink-0 font-mono font-bold text-violet-400">{term}</dt>
            <dd className="text-fg/85">{meaning}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

// Onglet "Cours" : à quoi ça sert, formule, termes, exemple corrigé
export default function FormulaCourse({ course, onStart }) {
  return (
    <div className="space-y-5">
      <Section icon={Target} title="À quoi ça sert ?">
        <RichText text={course.purpose} className="text-[15px] leading-relaxed text-fg/85" />
      </Section>

      <Section icon={Sigma} title="La formule et le sens de chaque terme">
        <FormulaReminder course={course} />
      </Section>

      <Section icon={FlaskConical} title="Exemple corrigé">
        <div className="space-y-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4">
          <p className="text-[15px] leading-snug font-semibold">{course.example.statement}</p>
          <ol className="space-y-1.5">
            {course.example.steps.map((step, i) => (
              <li key={step} className="flex gap-2 font-mono text-[13px] leading-relaxed">
                <span className="shrink-0 font-bold text-amber-400">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="flex gap-2 text-sm leading-snug">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
            <span className="font-semibold">{course.example.result}</span>
          </p>
        </div>
      </Section>

      <button type="button" onClick={onStart} className="h-12 w-full rounded-2xl bg-violet-500 font-bold text-white">
        Passer aux exercices
      </button>
    </div>
  )
}

function Section({ icon: Icon, title, children }) {
  return (
    <section>
      <h2 className="mb-2 flex items-center gap-2 text-lg font-extrabold">
        <Icon size={20} className="text-muted" /> {title}
      </h2>
      {children}
    </section>
  )
}
