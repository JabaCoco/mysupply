import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import { ARTICLE_FEEDS } from './feeds.config.mjs'

// Adresse de base de l'appli : « / » en local. Sur GitHub Pages, l'appli vit dans un sous-dossier
// (https://<pseudo>.github.io/<nom-du-depot>/) : le workflow de mise en ligne fournit VITE_BASE=/<nom-du-depot>/.
const base = process.env.VITE_BASE || '/'

// Relais RSS : le navigateur n'a pas le droit de lire directement ces flux
// (protection "CORS"). Vite va donc les chercher à sa place.
// Ça marche avec `npm run dev` et `npm run preview`. En ligne (GitHub Pages, hébergement statique),
// il n'y a pas de relais : les flux sont téléchargés à l'avance par scripts/fetch-feeds.mjs (voir .github/workflows/deploy.yml).
// Relais simple : /rss/<nom> → adresse complète du flux
const feed = (url) => {
  const { origin, pathname, search } = new URL(url)
  // followRedirects : si le site a déménagé son flux, le relais suit la redirection lui-même
  return { target: origin, changeOrigin: true, followRedirects: true, rewrite: () => pathname + search }
}

const rssProxy = {
  ...Object.fromEntries(Object.entries(ARTICLE_FEEDS).map(([name, url]) => [`/rss/${name}`, feed(url)])),
  // Flux officiel des chaînes YouTube : /rss/yt/<identifiant de la chaîne>
  '/rss/yt': {
    target: 'https://www.youtube.com',
    changeOrigin: true,
    rewrite: (path) => `/feeds/videos.xml?channel_id=${path.split('/').pop()}`,
  },
}

// https://vite.dev/config/
export default defineConfig({
  base,
  server: { proxy: rssProxy },
  preview: { proxy: rssProxy },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'favicon.ico', 'favicon-32.png', 'favicon-16.png', 'apple-touch-icon.png'],
      workbox: {
        // Les adresses …/rss/… sont des flux, jamais des pages de l'appli
        navigateFallbackDenylist: [/\/rss\//],
      },
      manifest: {
        // Nom affiché sous l'icône (écran d'accueil iPhone / Android, menu Démarrer et barre des tâches Windows)
        name: 'MySupply',
        short_name: 'MySupply',
        description: 'Apprendre la supply chain : cours, actu, atelier, anglais et révisions.',
        lang: 'fr',
        id: base,
        start_url: base,
        scope: base,
        display: 'standalone',
        background_color: '#0a0a10',
        theme_color: '#0a0a10',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'pwa-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
      },
    }),
  ],
})
