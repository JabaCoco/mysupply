import { columnName, parseAddress } from '../../../lib/excel/parser.js'
import { formatValue } from '../../../lib/excel/evaluate.js'

// Petite feuille de calcul : en-têtes A, B, C… et numéros de ligne, comme dans Excel.
// Toucher une cellule appelle onCellClick('B3') (pour insérer sa référence dans la formule).
export default function Sheet({ cells, target, targetDisplay, targetState, onCellClick }) {
  const addresses = [...Object.keys(cells), target].map(parseAddress)
  const nCols = Math.max(...addresses.map((a) => a.col)) + 1
  const nRows = Math.max(...addresses.map((a) => a.row)) + 1
  const cols = Array.from({ length: nCols }, (_, i) => columnName(i + 1))

  const targetStyle = {
    idle: 'outline-violet-500 bg-violet-500/10',
    ok: 'outline-emerald-500 bg-emerald-500/15 text-emerald-300',
    wrong: 'outline-red-500 bg-red-500/10 text-red-300',
  }[targetState]

  return (
    <div className="-mx-4 overflow-x-auto px-4">
      <table className="border-separate border-spacing-0 font-mono text-[13px]">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 w-8 border-r border-b border-line bg-bg" />
            {cols.map((c) => (
              <th key={c} className="border-r border-b border-line bg-card px-2 py-1 text-xs font-semibold text-muted">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: nRows }, (_, r) => (
            <tr key={r}>
              <th className="sticky left-0 z-10 border-r border-b border-line bg-card px-1.5 text-xs font-semibold text-muted">
                {r + 1}
              </th>
              {cols.map((c) => {
                const address = `${c}${r + 1}`
                const isTarget = address === target
                const value = cells[address]
                const isHeader = r === 0 && value !== undefined && typeof value === 'string'
                return (
                  <td key={address} className="border-r border-b border-line p-0">
                    <button
                      type="button"
                      onClick={() => onCellClick(address)}
                      title={address}
                      className={`block h-8 w-full min-w-[84px] max-w-[160px] truncate px-2 text-left whitespace-nowrap ${
                        typeof value === 'number' ? 'text-right' : ''
                      } ${isHeader ? 'font-bold text-fg' : 'text-fg/85'} ${
                        isTarget ? `font-bold outline-2 -outline-offset-2 ${targetStyle}` : 'hover:bg-line/40'
                      }`}
                    >
                      {isTarget ? targetDisplay : formatValue(value)}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
