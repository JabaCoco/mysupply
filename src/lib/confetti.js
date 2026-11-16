import confetti from 'canvas-confetti'

// Pluie de confettis (désactivée si l'utilisateur préfère moins d'animations)
export function celebrate() {
  const options = {
    disableForReducedMotion: true,
    zIndex: 100,
    colors: ['#8b5cf6', '#fbbf24', '#f97316', '#10b981', '#f472b6'],
  }
  confetti({ ...options, particleCount: 90, spread: 75, origin: { y: 0.35 } })
  setTimeout(() => {
    confetti({ ...options, particleCount: 50, angle: 60, spread: 55, origin: { x: 0, y: 0.65 } })
    confetti({ ...options, particleCount: 50, angle: 120, spread: 55, origin: { x: 1, y: 0.65 } })
  }, 250)
}
