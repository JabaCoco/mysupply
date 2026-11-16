// Transforme une date en clé "AAAA-MM-JJ" (heure locale)
export function dayKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(date, n) {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + n)
  return copy
}

// Lundi de la semaine de `date`
export function startOfWeek(date) {
  const day = (date.getDay() + 6) % 7 // lundi = 0 … dimanche = 6
  return addDays(date, -day)
}

// Numéro du jour dans l'année : sert à choisir le "contenu du jour"
export function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0)
  return Math.floor((date - start) / 86_400_000)
}

// "Dimanche 15 novembre"
export function longDate(date) {
  const text = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// "il y a 3 h", "hier"…
export function timeAgo(date, now = new Date()) {
  const minutes = Math.round((now - date) / 60_000)
  if (minutes < 1) return "à l'instant"
  if (minutes < 60) return `il y a ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `il y a ${hours} h`
  const days = Math.round(hours / 24)
  if (days === 1) return 'hier'
  return `il y a ${days} jours`
}
