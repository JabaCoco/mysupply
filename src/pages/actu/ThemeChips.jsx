import { motion } from 'motion/react'
import { THEMES } from '../../lib/themes.js'

const OPTIONS = [{ id: 'all', label: 'Tout' }, ...THEMES]

// Boutons de filtre par thème
export default function ThemeChips({ value, onChange }) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]" role="tablist" aria-label="Filtrer par thème">
      {OPTIONS.map((option) => {
        const active = option.id === value
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.id)}
            className={`relative shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              active ? 'border-transparent text-white' : 'border-line bg-card text-muted'
            }`}
          >
            {active && (
              <motion.span layoutId="theme-chip" className="absolute inset-0 rounded-full bg-violet-500" />
            )}
            <span className="relative">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
