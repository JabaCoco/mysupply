import { Inline } from '../../components/RichText.jsx'

// Affiche un texte de révision : paragraphes, puces, listes numérotées, tableaux et **gras**.
function parse(text) {
  const lines = String(text ?? '').split('\n')
  const blocks = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const t = line.trim()
    if (!t) {
      i++
    } else if (t.startsWith('|')) {
      const rows = []
      while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(lines[i++].trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim()))
      const [head, , ...body] = rows
      blocks.push({ type: 'table', head, body })
    } else if (/^[-*]\s+/.test(t)) {
      const items = []
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) items.push(lines[i++].trim().replace(/^[-*]\s+/, ''))
      blocks.push({ type: 'ul', items })
    } else if (/^\d+[.)]\s+/.test(t)) {
      const items = []
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) items.push(lines[i++].trim().replace(/^\d+[.)]\s+/, ''))
      blocks.push({ type: 'ol', items })
    } else {
      const para = []
      while (i < lines.length && lines[i].trim() && !lines[i].trim().startsWith('|') && !/^[-*]\s+/.test(lines[i].trim()) && !/^\d+[.)]\s+/.test(lines[i].trim())) para.push(lines[i++].trim())
      blocks.push({ type: 'p', lines: para })
    }
  }
  return blocks
}

export default function RichBlock({ text, className = '' }) {
  return (
    <div className={`space-y-3 text-[15px] leading-relaxed ${className}`}>
      {parse(text).map((b, k) => {
        if (b.type === 'p')
          return (
            <p key={k}>
              {b.lines.map((l, j) => (
                <span key={j}>
                  {j > 0 && <br />}
                  <Inline text={l} />
                </span>
              ))}
            </p>
          )
        if (b.type === 'ul')
          return (
            <ul key={k} className="list-disc space-y-1 pl-5">
              {b.items.map((it, j) => (
                <li key={j}>
                  <Inline text={it} />
                </li>
              ))}
            </ul>
          )
        if (b.type === 'ol')
          return (
            <ol key={k} className="list-decimal space-y-1 pl-5">
              {b.items.map((it, j) => (
                <li key={j}>
                  <Inline text={it} />
                </li>
              ))}
            </ol>
          )
        return (
          <div key={k} className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-max text-sm">
              <thead className="bg-card text-left text-xs text-muted">
                <tr>
                  {b.head.map((c, j) => (
                    <th key={j} className="px-3 py-2 font-semibold">
                      <Inline text={c} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.body.map((row, r) => (
                  <tr key={r} className="border-t border-line">
                    {row.map((c, j) => (
                      <td key={j} className="px-3 py-2">
                        <Inline text={c} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}
