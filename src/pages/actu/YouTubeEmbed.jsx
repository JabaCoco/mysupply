import { useEffect, useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'

// Charge une seule fois la bibliothèque officielle du lecteur YouTube (gratuite, sans clé)
let apiPromise = null
function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (!apiPromise) {
    apiPromise = new Promise((resolve, reject) => {
      const previous = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        previous?.()
        resolve(window.YT)
      }
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      script.onerror = () => {
        apiPromise = null
        reject(new Error('Lecteur YouTube indisponible'))
      }
      document.head.appendChild(script)
    })
  }
  return apiPromise
}

// Délais (en ms après le début de la lecture) auxquels on redemande les sous-titres français :
// le module de sous-titres de YouTube n'est pas toujours prêt tout de suite.
const CAPTION_RETRIES = [0, 1500, 4000]

// Lecteur YouTube intégré.
// - Vidéo en anglais : sous-titres activés et passés en français (traduction automatique
//   de YouTube). Si la traduction n'est pas possible, les sous-titres anglais restent affichés.
// - Si YouTube refuse de lire la vidéo, on propose de l'ouvrir sur YouTube.
export default function YouTubeEmbed({ video }) {
  const hostRef = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    const english = video.lang === 'en'
    const timers = []
    let player = null
    let cancelled = false
    let captionsRequested = false

    function showFrenchCaptions() {
      player.loadModule('captions')
      player.setOption('captions', 'track', { languageCode: 'fr' })
    }

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled) return
        // Le lecteur remplace cet élément par son <iframe>
        const target = document.createElement('div')
        host.appendChild(target)
        player = new YT.Player(target, {
          videoId: video.videoId,
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 1,
            playsinline: 1,
            rel: 0,
            hl: 'fr',
            ...(english && { cc_load_policy: 1, cc_lang_pref: 'fr' }),
          },
          events: {
            onError: () => setFailed(true),
            onStateChange: (event) => {
              if (!english || captionsRequested || event.data !== YT.PlayerState.PLAYING) return
              captionsRequested = true
              CAPTION_RETRIES.forEach((delay) => timers.push(setTimeout(showFrenchCaptions, delay)))
            },
          },
        })
      })
      .catch(() => setFailed(true))

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
      player?.destroy?.()
      host.replaceChildren()
    }
  }, [video])

  if (failed) {
    return (
      <div className="relative grid size-full place-items-center overflow-hidden rounded-2xl">
        <img src={video.thumbnail} alt="" className="absolute inset-0 size-full object-cover opacity-30 blur-sm" />
        <div className="relative max-w-60 space-y-3 p-4 text-center">
          <p className="text-sm">Cette vidéo ne peut pas être lue dans l'appli.</p>
          <a
            href={video.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold"
          >
            Regarder sur YouTube <ExternalLink size={14} />
          </a>
        </div>
      </div>
    )
  }

  return <div ref={hostRef} className="size-full overflow-hidden rounded-2xl bg-white/5 [&_iframe]:size-full" />
}
