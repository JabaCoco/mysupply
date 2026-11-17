// Flux RSS des sites de presse qui n'autorisent pas la lecture directe par le navigateur (protection « CORS »).
// Une seule liste, utilisée à deux endroits :
// - vite.config.js : relais pendant le développement (`npm run dev` / `npm run preview`)
// - scripts/fetch-feeds.mjs : à la mise en ligne (GitHub Actions), les flux sont téléchargés puis publiés avec l'appli
// nom court (utilisé dans l'adresse /rss/<nom>) → adresse du flux
export const ARTICLE_FEEDS = {
  scm: 'https://www.supplychainmagazine.fr/rss',
  wk: 'https://www.wk-transport-logistique.fr/rss',
  'lemonde-eco': 'https://www.lemonde.fr/economie/rss_full.xml',
  'bfm-eco': 'https://www.bfmtv.com/rss/economie/',
  latribune: 'https://www.latribune.fr/feed.xml',
  maddyness: 'https://www.maddyness.com/feed/',
  siecledigital: 'https://siecledigital.fr/feed/',
  jdn: 'https://www.journaldunet.com/rss/',
  actuia: 'https://www.actuia.com/feed/',
  lmi: 'https://www.lemondeinformatique.fr/flux-rss/thematique/toutes-les-actualites/rss.xml',
  zataz: 'https://www.zataz.com/feed/',
}

// Flux officiel d'une chaîne YouTube
export const youtubeFeedUrl = (channelId) => `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
