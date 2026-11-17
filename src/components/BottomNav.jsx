import { NavLink } from 'react-router'
import { motion } from 'motion/react'
import { tabs } from '../tabs.js'

// Navigation principale.
// - téléphone vertical : barre fixée en bas de l'écran (comme avant)
// - tablette, PC, téléphone en paysage : colonne fixée à gauche (icônes + noms) ;
//   sur grand écran (lg) elle s'élargit et affiche le logo et le nom MySupply.
export default function BottomNav() {
  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-bg/90 pb-[env(safe-area-inset-bottom)] backdrop-blur rail:inset-x-auto rail:inset-y-0 rail:left-0 rail:flex rail:max-lg:w-[calc(6rem+env(safe-area-inset-left))] rail:flex-col rail:overflow-y-auto rail:border-t-0 rail:border-r rail:bg-bg rail:pb-0 rail:pl-[env(safe-area-inset-left)] lg:w-60"
    >
      <div className="hidden items-center gap-3 px-5 pt-6 pb-3 lg:flex">
        <img src="/icon.svg" alt="" className="size-11" />
        <span className="text-xl font-extrabold tracking-tight">MySupply</span>
      </div>
      <ul className="mx-auto grid max-w-xl grid-cols-6 rail:flex rail:max-w-none rail:flex-col rail:gap-1 rail:px-2 rail:py-3 short:gap-0 short:py-1">
        {tabs.map(({ path, label, icon: Icon }) => (
          <li key={path}>
            <NavLink
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors rail:rounded-2xl short:py-1.5 lg:flex-row lg:gap-3 lg:px-4 lg:py-3 lg:text-sm ${
                  isActive ? 'text-violet-400 lg:bg-violet-500/10' : 'text-muted hover:text-fg'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute top-0 h-0.5 w-8 rounded-full bg-violet-400 rail:top-2 rail:bottom-2 rail:left-0 rail:h-auto rail:w-1"
                    />
                  )}
                  <Icon size={22} strokeWidth={isActive ? 2.4 : 1.8} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
