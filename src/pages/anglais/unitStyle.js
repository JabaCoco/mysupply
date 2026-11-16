import { AlertTriangle, Mail, Network, ShoppingCart, TrendingUp, Truck, Warehouse } from 'lucide-react'
import { MODULE_COLORS } from '../cours/moduleStyle.js'

const ICONS = { network: Network, truck: Truck, warehouse: Warehouse, cart: ShoppingCart, trend: TrendingUp, alert: AlertTriangle, mail: Mail }

// Icône et couleurs d'une unité d'anglais (mêmes couleurs que les modules de cours)
export function unitStyle(unit) {
  return { Icon: ICONS[unit.icon], color: MODULE_COLORS[unit.color] }
}
