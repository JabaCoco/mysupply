// Télécharge les flux RSS / YouTube et les range dans public/rss/ pour qu'ils soient publiés avec l'appli.
// Pourquoi : GitHub Pages est un hébergement « statique » (pas de relais comme en développement).
// Lancé par .github/workflows/deploy.yml avant le build, toutes les 2 heures. À lancer à la main : node scripts/fetch-feeds.mjs
// Les fichiers créés (public/rss/) ne sont pas versionnés (voir .gitignore).
import { mkdir, writeFile } from 'node:fs/promises'
import { ARTICLE_FEEDS, youtubeFeedUrl } from '../feeds.config.mjs'
import { SOURCES } from '../src/data/sources.js'

const OUT = new URL('../public/rss/', import.meta.url)
const HEADERS = { 'User-Agent': 'Mozilla/5.0 (compatible; MySupplyFeedFetcher/1.0)', Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*' }

// Liste des téléchargements : { file, url }
const jobs = []
for (const [name, url] of Object.entries(ARTICLE_FEEDS)) jobs.push({ file: name, url })
for (const source of SOURCES) {
  const match = /rss\/yt\/([\w-]+)$/.exec(source.url)
  if (match) jobs.push({ file: `yt/${match[1]}`, url: youtubeFeedUrl(match[1]) })
}

async function download({ file, url }) {
  // YouTube répond parfois au hasard par une erreur : 3 essais
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, { headers: HEADERS, redirect: 'follow', signal: AbortSignal.timeout(20_000) })
      const text = await response.text()
      if (response.ok && /<(rss|feed|rdf)/i.test(text)) {
        await mkdir(new URL(file.includes('/') ? file.slice(0, file.lastIndexOf('/') + 1) : './', OUT), { recursive: true })
        await writeFile(new URL(file, OUT), text)
        return { file, ok: true }
      }
      if (attempt === 3) return { file, ok: false, why: `réponse ${response.status}` }
    } catch (error) {
      if (attempt === 3) return { file, ok: false, why: error.message }
    }
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }
}

// 6 téléchargements à la fois
const results = []
const queue = [...jobs]
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (queue.length) results.push(await download(queue.shift()))
  }),
)

const failed = results.filter((r) => !r.ok)
console.log(`Flux téléchargés : ${results.length - failed.length} / ${results.length}`)
for (const f of failed) console.log(`  ✗ ${f.file} : ${f.why}`)
// Si presque tout a échoué, on le dit clairement (la mise en ligne continue : l'appli garde son cache hors ligne)
if (failed.length > results.length / 2) console.log('⚠ Plus de la moitié des flux ont échoué : l’Actu sera très pauvre jusqu’au prochain passage.')
