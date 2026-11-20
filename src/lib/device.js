// Petits outils qui marchent aussi bien sous Windows que sous iPhone (Safari), y compris quand l'appli est
// installée sur l'écran d'accueil : copier, coller, lire un fichier, enregistrer un fichier.

export const isIOS = () =>
  typeof navigator !== 'undefined' && (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))

// Copie un texte dans le presse-papiers. Renvoie true si ça a marché.
export async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // on essaie la méthode de secours
  }
  // Secours (anciens Safari, fenêtres sans autorisation) : zone de texte cachée + commande de copie
  try {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.cssText = 'position:fixed;top:0;left:0;opacity:0;font-size:16px'
    document.body.appendChild(area)
    area.focus()
    area.select()
    area.setSelectionRange(0, text.length)
    const ok = document.execCommand('copy')
    document.body.removeChild(area)
    return ok
  } catch {
    return false
  }
}

// Lit le presse-papiers (nécessite un appui sur un bouton ; Safari affiche un petit bouton « Coller »).
// Renvoie le texte, ou null si ce n'est pas possible (il faut alors coller à la main dans la zone de texte).
export async function readClipboard() {
  try {
    if (navigator.clipboard?.readText) return await navigator.clipboard.readText()
  } catch {
    // refusé : on renvoie null
  }
  return null
}

// Partage un lien : feuille de partage du téléphone / de Windows si elle existe, sinon copie du lien.
// Renvoie 'partage', 'copie', 'annule' ou 'echec'.
export async function shareLink(title, url) {
  if (!url) return 'echec'
  if (navigator.share) {
    try {
      await navigator.share({ title, url })
      return 'partage'
    } catch (e) {
      if (e?.name === 'AbortError') return 'annule'
      // sinon on copie le lien
    }
  }
  return (await copyText(url)) ? 'copie' : 'echec'
}

// Lit un fichier choisi par l'utilisateur
export function readFile(file) {
  if (file.text) return file.text()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

// Enregistre un fichier texte : feuille de partage sur iPhone/iPad (« Enregistrer dans Fichiers »),
// téléchargement classique ailleurs. Renvoie 'partage', 'telechargement' ou 'annule'.
export async function saveTextFile(filename, text, mime = 'application/json') {
  const file = new File([text], filename, { type: mime })
  if (isIOS() && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: filename })
      return 'partage'
    } catch (e) {
      if (e?.name === 'AbortError') return 'annule'
      // sinon on tente le téléchargement
    }
  }
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 60000)
  return 'telechargement'
}
