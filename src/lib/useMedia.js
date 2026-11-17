import { useSyncExternalStore } from 'react'

// Dit si une règle d'écran est vraie (ex. '(min-width: 1024px)') et se met à jour quand on redimensionne la fenêtre.
// Sert quand la mise en page ne peut pas se régler avec les seules classes CSS (ex. liste + détail de l'onglet Cours).
export function useMedia(query) {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', notify)
      return () => mq.removeEventListener('change', notify)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}
