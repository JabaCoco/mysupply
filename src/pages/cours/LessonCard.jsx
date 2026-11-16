import { CheckCircle2, FlaskConical, Lightbulb, Sigma } from 'lucide-react'
import RichText, { Inline } from '../../components/RichText.jsx'

// Affiche une carte de leçon selon son type (voir src/data/courses/index.js)
export default function LessonCard({ card, color }) {
  switch (card.type) {
    case 'list':
      return (
        <>
          <Title>{card.title}</Title>
          <ul className="space-y-2.5">
            {card.items.map(([term, def]) => (
              <li key={term} className="rounded-2xl border border-line bg-card p-3.5">
                <span className={`block font-bold ${color.text}`}>{term}</span>
                <span className="mt-0.5 block text-[15px] leading-snug text-fg/85">
                  <Inline text={def} />
                </span>
              </li>
            ))}
          </ul>
        </>
      )

    case 'formula':
      return (
        <>
          <Title icon={Sigma}>{card.title}</Title>
          <p className={`rounded-2xl border-2 bg-card px-4 py-5 text-center font-mono text-lg font-bold sm:text-xl ${color.border}`}>
            {card.formula}
          </p>
          <dl className="mt-4 space-y-2">
            {card.legend.map(([symbol, meaning]) => (
              <div key={symbol} className="flex gap-3 text-[15px] leading-snug">
                <dt className={`w-20 shrink-0 font-mono font-bold ${color.text}`}>{symbol}</dt>
                <dd className="text-fg/85">{meaning}</dd>
              </div>
            ))}
          </dl>
          {card.example && (
            <p className="mt-4 rounded-2xl bg-amber-400/10 p-3.5 text-[15px] leading-snug">
              <span className="font-bold text-amber-400">Exemple : </span>
              {card.example}
            </p>
          )}
        </>
      )

    case 'example':
      return (
        <div className="rounded-3xl border border-amber-400/30 bg-amber-400/10 p-5">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold tracking-wider text-amber-400 uppercase">
            <FlaskConical size={14} /> Exemple
          </p>
          <h2 className="mb-3 text-xl font-extrabold">{card.title}</h2>
          <RichText text={card.body} className="text-[15px] leading-relaxed text-fg/85" />
        </div>
      )

    case 'key':
      return (
        <div className={`rounded-3xl p-5 ${color.soft}`}>
          <p className={`mb-4 flex items-center gap-2 text-lg font-extrabold ${color.text}`}>
            <Lightbulb size={22} /> À retenir
          </p>
          <ul className="space-y-3">
            {card.points.map((point) => (
              <li key={point} className="flex gap-2.5 text-[15px] leading-snug">
                <CheckCircle2 size={20} className={`mt-px shrink-0 ${color.text}`} />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )

    default: // 'text'
      return (
        <>
          <Title>{card.title}</Title>
          <RichText text={card.body} className="text-base leading-relaxed text-fg/85" />
        </>
      )
  }
}

function Title({ children, icon: Icon }) {
  return (
    <h2 className="mb-4 flex items-center gap-2 text-2xl leading-tight font-extrabold">
      {Icon && <Icon size={22} className="shrink-0 text-muted" />}
      {children}
    </h2>
  )
}
