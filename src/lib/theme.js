import { useState } from 'react'

const KEY = 'theme'

function readTheme() {
  try {
    return localStorage.getItem(KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    'content',
    theme === 'light' ? '#f4f4f8' : '#0a0a10',
  )
}

// À appeler au démarrage, pour éviter un flash de la mauvaise couleur
export function initTheme() {
  applyTheme(readTheme())
}

// Petit "hook" React : renvoie le thème actuel et une fonction pour basculer
export function useTheme() {
  const [theme, setTheme] = useState(readTheme)

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      // Stockage indisponible (navigation privée…) : le choix ne sera pas mémorisé
    }
  }

  return { theme, toggle }
}
