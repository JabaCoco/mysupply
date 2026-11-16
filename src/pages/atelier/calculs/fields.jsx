// Petits éléments communs aux calculateurs

// Lit un nombre tapé "à la française" (virgule ou point, espaces autorisés)
export function toNum(text) {
  const n = Number(String(text).replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : NaN
}

export const fmt = (n, digits = 2) =>
  Number.isFinite(n) ? n.toLocaleString('fr-FR', { maximumFractionDigits: digits }) : '—'

export function NumberField({ label, unit, value, onChange, help }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <span className="mt-1 flex items-center rounded-xl border border-line bg-card focus-within:border-violet-500">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          inputMode="decimal"
          className="h-11 min-w-0 flex-1 bg-transparent px-3 text-[15px] outline-none"
        />
        {unit && <span className="pr-3 text-sm text-muted">{unit}</span>}
      </span>
      {help && <span className="mt-1 block text-xs text-muted">{help}</span>}
    </label>
  )
}

export function Result({ label, value, unit, highlight }) {
  return (
    <div className={`rounded-2xl p-4 ${highlight ? 'bg-violet-500 text-white' : 'border border-line bg-card'}`}>
      <p className={`text-xs ${highlight ? 'text-white/80' : 'text-muted'}`}>{label}</p>
      <p className="text-2xl font-extrabold">
        {value}
        {unit && <span className="ml-1 text-base font-semibold opacity-80">{unit}</span>}
      </p>
    </div>
  )
}

// Encadré "le calcul" : lignes de formule avec les valeurs remplacées
export function Steps({ lines }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <p className="mb-2 text-xs font-bold tracking-wider text-muted uppercase">Le calcul</p>
      <div className="space-y-1.5 font-mono text-[13px] leading-relaxed">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  )
}

export function Note({ children }) {
  return <p className="rounded-2xl bg-amber-400/10 p-3.5 text-sm leading-snug">{children}</p>
}
