import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'

// Relais RSS : le navigateur n'a pas le droit de lire directement ces flux
// (protection "CORS"). Vite va donc les chercher à sa place.
// Ça marche avec `npm run dev` et `npm run preview`. Quand on mettra l'appli
// en ligne, il faudra recréer ces relais chez l'hébergeur.
// Relais simple : /rss/<nom> → adresse complète du flux
const feed = (url) => {
  const { origin, pathname, search } = new URL(url)
  // followRedirects : si le site a déménagé son flux, le relais suit la redirection lui-même
  return { target: origin, changeOrigin: true, followRedirects: true, rewrite: () => pathname + search }
}

const rssProxy = {
  '/rss/scm': feed('https://www.supplychainmagazine.fr/rss'),
  '/rss/wk': feed('https://www.wk-transport-logistique.fr/rss'),
  '/rss/lemonde-eco': feed('https://www.lemonde.fr/economie/rss_full.xml'),
  '/rss/bfm-eco': feed('https://www.bfmtv.com/rss/economie/'),
  '/rss/latribune': feed('https://www.latribune.fr/feed.xml'),
  '/rss/maddyness': feed('https://www.maddyness.com/feed/'),
  '/rss/siecledigital': feed('https://siecledigital.fr/feed/'),
  '/rss/jdn': feed('https://www.journaldunet.com/rss/'),
  '/rss/actuia': feed('https://www.actuia.com/feed/'),
  '/rss/lmi': feed('https://www.lemondeinformatique.fr/flux-rss/thematique/toutes-les-actualites/rss.xml'),
  '/rss/zataz': feed('https://www.zataz.com/feed/'),
  // Flux officiel des chaînes YouTube : /rss/yt/<identifiant de la chaîne>
  '/rss/yt': {
    target: 'https://www.youtube.com',
    changeOrigin: true,
    rewrite: (path) => `/feeds/videos.xml?channel_id=${path.split('/').pop()}`,
  },
}

// https://vite.dev/config/
export default defineConfig({
  server: { proxy: rssProxy },
  preview: { proxy: rssProxy },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'favicon.ico', 'favicon-32.png', 'favicon-16.png', 'apple-touch-icon.png'],
      workbox: {
        // Les adresses /rss/… doivent toujours aller au relais, jamais à l'appli
        navigateFallbackDenylist: [/^\/rss\//],
      },
      manifest: {
        name: 'MySupply',
        short_name: 'MySupply',
        description: 'Apprendre la supply chain : cours, actu, atelier, anglais et révisions.',
        lang: 'fr',
        start_url: '/',
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
