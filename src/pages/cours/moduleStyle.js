import { Boxes, Coins, Compass, Cpu, Factory, Gauge, Landmark, Leaf, Network, RefreshCw, ShieldAlert, ShoppingCart, Store, TrendingUp, Truck, Warehouse } from 'lucide-react'

// Icône et couleurs de chaque module (classes Tailwind écrites en entier pour qu'elles soient générées)
export const MODULE_ICONS = {
  network: Network,
  truck: Truck,
  boxes: Boxes,
  warehouse: Warehouse,
  cart: ShoppingCart,
  trend: TrendingUp,
  gauge: Gauge,
  cpu: Cpu,
  factory: Factory,
  store: Store,
  landmark: Landmark,
  repeat: RefreshCw,
  leaf: Leaf,
  shield: ShieldAlert,
  coins: Coins,
  compass: Compass,
}

export const MODULE_COLORS = {
  violet: { solid: 'bg-violet-500', text: 'text-violet-400', soft: 'bg-violet-500/15', border: 'border-violet-500' },
  emerald: { solid: 'bg-emerald-500', text: 'text-emerald-400', soft: 'bg-emerald-500/15', border: 'border-emerald-500' },
  orange: { solid: 'bg-orange-500', text: 'text-orange-400', soft: 'bg-orange-500/15', border: 'border-orange-500' },
  amber: { solid: 'bg-amber-500', text: 'text-amber-400', soft: 'bg-amber-500/15', border: 'border-amber-500' },
  sky: { solid: 'bg-sky-500', text: 'text-sky-400', soft: 'bg-sky-500/15', border: 'border-sky-500' },
  pink: { solid: 'bg-pink-500', text: 'text-pink-400', soft: 'bg-pink-500/15', border: 'border-pink-500' },
  cyan: { solid: 'bg-cyan-500', text: 'text-cyan-400', soft: 'bg-cyan-500/15', border: 'border-cyan-500' },
  fuchsia: { solid: 'bg-fuchsia-500', text: 'text-fuchsia-400', soft: 'bg-fuchsia-500/15', border: 'border-fuchsia-500' },
  lime: { solid: 'bg-lime-500', text: 'text-lime-400', soft: 'bg-lime-500/15', border: 'border-lime-500' },
  teal: { solid: 'bg-teal-500', text: 'text-teal-400', soft: 'bg-teal-500/15', border: 'border-teal-500' },
  rose: { solid: 'bg-rose-500', text: 'text-rose-400', soft: 'bg-rose-500/15', border: 'border-rose-500' },
  indigo: { solid: 'bg-indigo-500', text: 'text-indigo-400', soft: 'bg-indigo-500/15', border: 'border-indigo-500' },
  red: { solid: 'bg-red-500', text: 'text-red-400', soft: 'bg-red-500/15', border: 'border-red-500' },
  yellow: { solid: 'bg-yellow-500', text: 'text-yellow-400', soft: 'bg-yellow-500/15', border: 'border-yellow-500' },
}

export function moduleStyle(module) {
  return { Icon: MODULE_ICONS[module.icon], color: MODULE_COLORS[module.color] }
}
