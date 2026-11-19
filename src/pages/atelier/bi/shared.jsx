import { Info } from 'lucide-react'
import { isErr } from '../../../lib/powerQuery.js'

// Rappel affiché sur toutes les pages du module : c'est une simulation, pas l'outil réel
export function SimulationNotice({ className = '' }) {
  return (
    <p className={`flex gap-2 rounded-2xl border border-line bg-card p-3 text-xs leading-snug text-muted ${className}`}>
      <Info size={16} className="mt-0.5 shrink-0 text-violet-400" />
      <span>
        <span className="font-bold text-fg">Simulation pédagogique.</span> Cette section te prépare à Power Query et à Power BI, mais elle ne les remplace pas : les boutons, les noms de menus et la syntaxe peuvent varier selon ta version et ta langue. Entraîne-toi aussi dans l’outil réel (Power BI Desktop est gratuit, Power Query est dans Excel).
      </span>
    </p>
  )
}

const TYPE_ICON = { any: 'ABC123', text: 'ABC', int: '123', dec: '1.2' }

// Tableau de données façon aperçu Power Query. cols : noms (texte) ou { name, type }.
export function DataTable({ title, cols, rows, small = false }) {
  return (
    <figure className="min-w-0">
      {title && <figcaption className="mb-1 text-xs font-bold tracking-wider text-muted uppercase">{title}</figcaption>}
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className={`w-full border-collapse ${small ? 'text-xs' : 'text-[13px]'}`}>
          <thead>
            <tr className="bg-card">
              {cols.map((c, i) => {
                const col = typeof c === 'string' ? { name: c } : c
                return (
                  <th key={`${col.name}-${i}`} className="border-b border-line px-2.5 py-2 text-left font-bold whitespace-nowrap">
                    {col.type && <span className="mr-1.5 rounded bg-violet-500/15 px-1 font-mono text-[10px] text-violet-400">{TYPE_ICON[col.type]}</span>}
                    {col.name}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={cols.length} className="px-2.5 py-3 text-center text-muted italic">
                  Aucune ligne
                </td>
              </tr>
            )}
            {rows.map((row, r) => (
              <tr key={r} className="border-b border-line last:border-b-0">
                {row.map((cell, c) => (
                  <td key={c} className={`px-2.5 py-1.5 whitespace-nowrap ${typeof cell === 'number' ? 'text-right tabular-nums' : ''}`}>
                    <Cell value={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}

function Cell({ value }) {
  if (value === null || value === undefined || value === 'null') return <span className="text-muted italic">null</span>
  if (isErr(value)) return <span className="font-bold text-red-400">Error</span>
  if (value === '') return <span className="text-muted italic">(vide)</span>
  if (typeof value === 'number') return value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })
  return value
}

// Bloc de code (M ou DAX)
export function Code({ children }) {
  return <pre className="overflow-x-auto rounded-2xl border border-line bg-card p-3 font-mono text-[12.5px] leading-relaxed whitespace-pre text-fg/90">{children}</pre>
}
