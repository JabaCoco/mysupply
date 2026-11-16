import { Boxes, Cpu, Gauge, Network, ShoppingCart, TrendingUp, Truck, Warehouse } from 'lucide-react'

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
}

export function moduleStyle(module) {
  return { Icon: MODULE_ICONS[module.icon], color: MODULE_COLORS[module.color] }
}
