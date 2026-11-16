import { AnimatePresence, motion } from 'motion/react'
import { AlertTriangle, Info, X } from 'lucide-react'

// Niveau d'alerte d'un stock : rouge à zéro (ou moins), orange sous le stock de sécurité
export function stockLevel(value, safetyStock) {
  if (value <= 0) return 'out'
  if (value < safetyStock) return 'low'
  return 'ok'
}

const STYLES = {
  ok: { box: 'border-line bg-card', value: 'text-fg', badge: null },
  low: { box: 'border-orange-500 bg-orange-500/10', value: 'text-orange-400', badge: { text: 'Sous le stock de sécurité', cls: 'bg-orange-500 text-white' } },
  out: { box: 'border-red-500 bg-red-500/10', value: 'text-red-400', badge: { text: 'Rupture', cls: 'bg-red-500 text-white' } },
  neutral: { box: 'border-line bg-card', value: 'text-fg', badge: null },
}

// Une case du tableau de bord : titre, valeur, détail, bulle d'aide "comment c'est calculé"
export default function StockBox({ icon: Icon, label, value, unit = 'u.', detail, help, level = 'neutral', helpOpen, onToggleHelp, align = 'left' }) {
  const style = STYLES[level]
  return (
    <div className={`relative rounded-2xl border-2 p-3 transition-colors ${style.box}`}>
      <div className="flex items-start gap-1">
        <p className="flex flex-1 items-center gap-1.5 text-xs leading-tight font-semibold text-muted">
          {Icon && <Icon size={14} className="shrink-0" />}
          {label}
        </p>
        <button
          type="button"
          onClick={onToggleHelp}
          aria-expanded={helpOpen}
          aria-label={`Comment est calculé : ${label}`}
          className="-mt-1 -mr-1 grid size-7 shrink-0 place-items-center rounded-full text-muted hover:bg-line/50"
        >
          <Info size={16} />
        </button>
      </div>
      <p className={`mt-1 text-3xl leading-none font-extrabold ${style.value}`}>
        {value}
        <span className="ml-1 text-sm font-semibold text-muted">{unit}</span>
      </p>
      {style.badge && (
        <p className={`mt-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${style.badge.cls}`}>
          <AlertTriangle size={11} /> {style.badge.text}
        </p>
      )}
      {detail && <div className="mt-1.5 text-xs leading-snug text-muted">{detail}</div>}

      <AnimatePresence>
        {helpOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            role="tooltip"
            className={`absolute top-10 z-30 w-64 max-w-[80vw] rounded-2xl border border-line bg-bg p-3 text-sm leading-snug shadow-xl ${align === 'right' ? 'right-1' : 'left-1'}`}
          >
            <div className="mb-1 flex items-center justify-between">
              <p className="font-bold">{label}</p>
              <button type="button" onClick={onToggleHelp} className="grid size-6 place-items-center text-muted" aria-label="Fermer l'aide">
                <X size={14} />
              </button>
            </div>
            <div className="space-y-1.5 text-fg/85">{help}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
