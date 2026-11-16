// Bandeau "Flash info" qui défile en continu.
// Le contenu est affiché 2 fois à la suite pour que la boucle soit invisible.
export default function FlashTicker({ items }) {
  if (items.length === 0) return null

  return (
    <div className="ticker flex items-center gap-2 overflow-hidden rounded-2xl border border-line bg-card py-2 pl-2">
      <span className="shrink-0 rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">
        Flash
      </span>
      <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12px,black_calc(100%-24px),transparent)]">
        <div className="ticker-track flex w-max" style={{ '--ticker-duration': `${items.length * 12}s` }}>
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
              {items.map((item) => (
                <li key={item.source + item.title} className="flex items-center gap-2 pr-10 text-sm whitespace-nowrap">
                  <span className="text-xs font-semibold text-muted">{item.source}</span>
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={copy === 1 ? -1 : undefined}
                      className="hover:underline"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <span>{item.title}</span>
                  )}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  )
}
