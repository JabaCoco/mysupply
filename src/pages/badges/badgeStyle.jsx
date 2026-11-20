import { BookOpen, Beer, Brain, Briefcase, CalendarCheck, Calculator, ChartColumn, Crown, Flame, GraduationCap, Handshake, Heart, Languages, Layers, Mic, Package, Play, Route, SpellCheck, Table2, Target, TrendingUp, Truck, Upload, Zap } from 'lucide-react'

// Nom d'icône (src/lib/badgeRules.js) → icône Lucide
const ICONS = {
  flame: Flame, target: Target, zap: Zap, trending: TrendingUp, crown: Crown, book: BookOpen, graduation: GraduationCap,
  languages: Languages, spell: SpellCheck, upload: Upload, layers: Layers, brain: Brain, table: Table2, calculator: Calculator,
  briefcase: Briefcase, package: Package, beer: Beer, truck: Truck, handshake: Handshake, route: Route, chart: ChartColumn,
  calendar: CalendarCheck, mic: Mic, play: Play, heart: Heart,
}

// Couleur de chaque catégorie (classes écrites en entier pour que Tailwind les trouve)
const CATEGORY_COLORS = {
  serie: 'bg-orange-500',
  xp: 'bg-amber-400 text-slate-900',
  cours: 'bg-violet-500',
  anglais: 'bg-pink-500',
  revisions: 'bg-orange-600',
  atelier: 'bg-emerald-500',
  defi: 'bg-rose-500',
  entretien: 'bg-fuchsia-500',
  actu: 'bg-sky-500',
}

// Pastille ronde d'un badge. `locked` : grisée.
export function BadgeIcon({ badge, locked = false, size = 28, className = 'size-14' }) {
  const Icon = ICONS[badge.icon] ?? Zap
  return (
    <span className={`grid shrink-0 place-items-center rounded-full ${className} ${locked ? 'bg-line text-muted' : `${CATEGORY_COLORS[badge.cat] ?? 'bg-violet-500'} text-white shadow-md`}`}>
      <Icon size={size} />
    </span>
  )
}
