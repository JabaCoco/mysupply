// Voix du navigateur (gratuit, sans API) :
// - synthèse vocale : l'appli lit un mot en anglais ;
// - reconnaissance vocale : l'appli écoute ta prononciation (Chrome, Edge, Safari ; pas Firefox).

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window

const Recognition = () => (typeof window === 'undefined' ? null : window.SpeechRecognition || window.webkitSpeechRecognition || null)
export const canListen = () => Boolean(Recognition())

// Choisit une voix anglaise (de préférence une voix "naturelle")
function englishVoice() {
  const voices = window.speechSynthesis.getVoices()
  const english = voices.filter((v) => v.lang?.toLowerCase().startsWith('en'))
  return english.find((v) => /natural|neural|google/i.test(v.name)) ?? english.find((v) => /en-(us|gb)/i.test(v.lang)) ?? english[0] ?? null
}

// Lit un texte en anglais. rate < 1 = plus lent.
export function speak(text, rate = 0.95) {
  if (!canSpeak()) return
  const synth = window.speechSynthesis
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  const voice = englishVoice()
  if (voice) {
    utterance.voice = voice
    utterance.lang = voice.lang
  }
  utterance.rate = rate
  synth.speak(utterance)
}

// Messages d'erreur de la reconnaissance vocale, en français
export const LISTEN_ERRORS = {
  unsupported: "Ton navigateur ne permet pas la reconnaissance vocale (essaie Chrome ou Edge). Tu peux passer l'exercice.",
  'not-allowed': "L'accès au micro a été refusé. Autorise le micro dans ton navigateur, ou passe l'exercice.",
  'service-not-allowed': "La reconnaissance vocale n'est pas autorisée ici. Tu peux passer l'exercice.",
  'audio-capture': "Aucun micro n'a été détecté. Tu peux passer l'exercice.",
  network: "La reconnaissance vocale a besoin d'Internet. Vérifie ta connexion ou passe l'exercice.",
  'no-speech': "Je n'ai rien entendu. Appuie sur le micro et parle juste après.",
  aborted: 'Écoute interrompue. Réessaie.',
}

// Écoute une fois. Renvoie les transcriptions possibles (plusieurs propositions du navigateur).
// Renvoie aussi une fonction stop() pour arrêter l'écoute.
export function listen({ lang = 'en-US', timeout = 7000 } = {}) {
  const R = Recognition()
  if (!R) return { promise: Promise.reject(new Error('unsupported')), stop: () => {} }
  const rec = new R()
  rec.lang = lang
  rec.interimResults = false
  rec.maxAlternatives = 5
  rec.continuous = false
  let timer
  const promise = new Promise((resolve, reject) => {
    let settled = false
    const finish = (fn, value) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      fn(value)
    }
    rec.onresult = (event) => finish(resolve, [...event.results[0]].map((alt) => alt.transcript))
    rec.onerror = (event) => finish(reject, new Error(event.error || 'aborted'))
    rec.onend = () => finish(reject, new Error('no-speech'))
    try {
      rec.start()
    } catch {
      finish(reject, new Error('aborted'))
    }
    timer = setTimeout(() => {
      try {
        rec.stop()
      } catch {
        // déjà arrêtée
      }
    }, timeout)
  })
  return {
    promise,
    stop: () => {
      try {
        rec.stop()
      } catch {
        // déjà arrêtée
      }
    },
  }
}

// ---------- Comparaison souple de textes ----------
export function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9' ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
  }
  return dp[a.length][b.length]
}

// Ce que tu as dit est-il assez proche de la cible ?
// Mot : identique, ou 1 lettre d'écart pour les mots longs. Phrase : au moins 80 % de mots identiques.
export function matchesSpeech(alternatives, target) {
  const goal = normalize(target)
  const goalWords = goal.split(' ')
  let best = 0
  for (const alt of alternatives) {
    const said = normalize(alt)
    if (said === goal || said.includes(goal)) return { ok: true, heard: alt, score: 1 }
    let score
    if (goalWords.length <= 2) {
      score = 1 - levenshtein(said, goal) / Math.max(goal.length, 1)
    } else {
      score = 1 - levenshtein(said.split(' '), goalWords) / goalWords.length
    }
    if (score > best) best = score
  }
  const threshold = goalWords.length <= 2 ? (goal.length >= 6 ? 0.8 : 1) : 0.8
  return { ok: best >= threshold, heard: alternatives[0] ?? '', score: best }
}
