import { useCallback, useEffect, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db.js'
import { SOURCES } from '../data/sources.js'
import { classify, isExcluded, isPromo } from './themes.js'
import { addXp } from './progress.js'

const REFRESH_AFTER = 30 * 60_000 // on recharge une source au bout de 30 min
const CACHE_VERSION = 7 // à augmenter si la forme des données ou les filtres changent
export const XP_PER_SHORT = 5

function safeLink(url) {
  try {
    const { protocol } = new URL(url)
    return protocol === 'http:' || protocol === 'https:' ? url : null
  } catch {
    return null
  }
}

const textOf = (parent, tag) => parent.getElementsByTagName(tag)[0]?.textContent?.trim() ?? ''

// Retire la "signature" en fin de titre, ex. "… | Géopolitis" ou "… || Peter Zeihan"
// (sinon le nom de la chaîne fausse le tri par mots-clés)
const cleanTitle = (title) => title.replace(/\s*\|{1,2}\s*[^|]{1,30}$/, '').trim() || title

// Thèmes qui justifient de garder un sujet même s'il touche à la politique
// (ex. "Trump relève les droits de douane" → impact supply chain / géopolitique)
const KEEP_EVEN_IF_POLITICAL = ['supply', 'geo', 'incident']

// Garde l'élément s'il a au moins un thème (ceux du titre + celui de la source)
// et s'il ne parle pas de politique pure. Les promos sont toujours écartées.
// Le tri se fait sur le titre seul : les descriptions contiennent trop de mots hors sujet
function withThemes(item, source) {
  const themes = new Set(classify(item.title))
  if (source.theme) themes.add(source.theme)
  if (isPromo(item.title)) return []
  if (isExcluded(item.title) && !KEEP_EVEN_IF_POLITICAL.some((t) => themes.has(t))) return []
  return themes.size ? [{ ...item, lang: source.lang ?? 'fr', themes: [...themes] }] : []
}

// Flux RSS classique d'un site (balises <item>)
function parseArticles(doc, source) {
  return [...doc.getElementsByTagName('item')].slice(0, 15).flatMap((node) => {
    const title = textOf(node, 'title').replace(/\s+/g, ' ')
    const date = new Date(textOf(node, 'pubDate'))
    const link = safeLink(textOf(node, 'link'))
    if (!title || Number.isNaN(date.getTime())) return []
    const item = {
      id: `${source.id}:${link ?? title}`,
      kind: 'article',
      title,
      link,
      date: date.toISOString(),
      source: source.name,
      sourceId: source.id,
    }
    return withThemes(item, source)
  })
}

// Flux d'une chaîne YouTube (balises <entry>) : on ne garde que les shorts,
// sauf pour les chaînes marquées `longVideos` (géopolitique, sans shorts)
function parseVideos(doc, source) {
  return [...doc.getElementsByTagName('entry')].flatMap((node) => {
    const videoId = textOf(node, 'yt:videoId')
    const title = cleanTitle(textOf(node, 'title'))
    const date = new Date(textOf(node, 'published'))
    const isShort = Boolean(node.getElementsByTagName('link')[0]?.getAttribute('href')?.includes('/shorts/'))
    if (!isShort && !source.longVideos) return []
    if (!/^[\w-]{11}$/.test(videoId) || !title || Number.isNaN(date.getTime())) return []
    const item = {
      id: `yt:${videoId}`,
      kind: 'video',
      videoId,
      isShort,
      title,
      link: `https://www.youtube.com/${isShort ? 'shorts/' : 'watch?v='}${videoId}`,
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      date: date.toISOString(),
      source: source.name,
      sourceId: source.id,
    }
    return withThemes(item, source)
  })
}

// Télécharge un flux. YouTube répond parfois au hasard par une erreur 404 ou 500 :
// dans ce cas, on réessaie une fois après une seconde.
async function download(url, attempts = 2) {
  const response = await fetch(url, { signal: AbortSignal.timeout(10_000) })
  if (response.ok) return response
  if (attempts > 1) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return download(url, attempts - 1)
  }
  throw new Error(`Erreur ${response.status}`)
}

async function fetchSource(source) {
  const response = await download(source.url)
  const doc = new DOMParser().parseFromString(await response.text(), 'text/xml')
  if (doc.getElementsByTagName('parsererror').length) throw new Error('Flux illisible')
  return source.kind === 'video' ? parseVideos(doc, source) : parseArticles(doc, source)
}

// Contenu d'une source : depuis le cache s'il est récent (sauf si `force`),
// sinon depuis Internet ; en cas d'échec (hors ligne…), l'ancien cache.
async function loadSource(source, force) {
  const cached = await db.feeds.get(source.id)
  const usable = cached?.version === CACHE_VERSION ? cached : null
  if (usable && !force && Date.now() - usable.fetchedAt < REFRESH_AFTER) return usable
  try {
    const entry = { id: source.id, version: CACHE_VERSION, items: await fetchSource(source), fetchedAt: Date.now() }
    await db.feeds.put(entry)
    return entry
  } catch {
    return usable ?? { items: [], fetchedAt: null }
  }
}

export const byDateDesc = (a, b) => b.date.localeCompare(a.date)

// Hook React : toute l'actu (articles + vidéos), triée du plus récent au plus ancien.
// status : 'loading' (premier chargement), 'refreshing' (mise à jour) ou 'ready'
export function useNews() {
  const [state, setState] = useState({ status: 'loading', items: [], updatedAt: null })
  const alive = useRef(true)

  const load = useCallback(async (force = false) => {
    if (force) setState((s) => ({ ...s, status: 'refreshing' }))
    const results = await Promise.all(SOURCES.map((s) => loadSource(s, force)))
    if (!alive.current) return
    const unique = new Map(results.flatMap((r) => r.items).map((item) => [item.id, item]))
    const times = results.map((r) => r.fetchedAt).filter(Boolean)
    setState({
      status: 'ready',
      items: [...unique.values()].sort(byDateDesc),
      updatedAt: times.length ? Math.min(...times) : null,
    })
  }, [])

  useEffect(() => {
    alive.current = true
    load()
    return () => {
      alive.current = false
    }
  }, [load])

  return { ...state, refresh: () => load(true) }
}

// Vidéos publiées pendant les `hours` dernières heures
export function recentVideos(items, hours) {
  const limit = new Date(Date.now() - hours * 3_600_000).toISOString()
  return items.filter((i) => i.kind === 'video' && i.date >= limit)
}

// Shorts des dernières 48 h (le "café du matin" de l'accueil)
export function recentShorts(items, hours = 48) {
  return recentVideos(items, hours).filter((i) => i.isShort)
}

// Hook React : ensemble des identifiants de vidéos déjà vues
export function useSeen() {
  const keys = useLiveQuery(() => db.seen.toCollection().primaryKeys(), [])
  return new Set(keys ?? [])
}

// Marque à la main un contenu comme vu, SANS donner d'XP (les XP viennent seulement du lecteur intégré).
export async function markSeenManual(id) {
  await db.transaction('rw', db.seen, async () => {
    if (!(await db.seen.get(id))) await db.seen.put({ id, at: Date.now(), manual: true })
  })
}

// Article lu / non lu (aucun XP, donc on peut l'annuler)
export async function toggleRead(id) {
  await db.transaction('rw', db.seen, async () => {
    if (await db.seen.get(id)) await db.seen.delete(id)
    else await db.seen.put({ id, at: Date.now(), manual: true })
  })
}

// Marque une vidéo comme vue ; la première fois, elle rapporte des XP
export async function markSeen(video) {
  await db.transaction('rw', db.seen, db.activity, async () => {
    if (await db.seen.get(video.id)) return
    await db.seen.put({ id: video.id, at: Date.now() })
    await addXp(XP_PER_SHORT)
  })
}
