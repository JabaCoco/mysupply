import { NavLink } from 'react-router'
import { motion } from 'motion/react'
import { tabs } from '../tabs.js'

// Barre de navigation fixée en bas de l'écran
export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-bg/90 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="mx-auto grid max-w-xl grid-cols-6">
        {tabs.map(({ path, label, icon: Icon }) => (
          <li key={path}>
            <NavLink
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-violet-400' : 'text-muted hover:text-fg'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute top-0 h-0.5 w-8 rounded-full bg-violet-400"
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
