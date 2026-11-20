// Favoris : types et fabriques (fonctions pures, testées par `npm run verify`). La lecture / écriture est dans favorites.js.
//
// Une ligne de la table `favorites` : { id, type, title, sub, to | url, thumb, text, data, at, updatedAt, on }
// - `id` = « type:clé » (ex. « video:yt:abc », « lesson:stocks/abc », « word:supplier ») : le même contenu a toujours le même id.
// - `on: false` = favori retiré : la ligne reste (marque de retrait) pour que le retrait se propage à la fusion / synchronisation.
// - Un favori de l'Actu garde de quoi s'afficher et s'ouvrir seul (titre, lien, miniature, et pour une vidéo de quoi relancer
//   le lecteur) : il reste accessible quand le contenu sort du flux de 2 heures.

export const FAV_TYPES = [
  { id: 'video', label: 'Vidéos' },
  { id: 'article', label: 'Articles' },
  { id: 'lesson', label: 'Cours' },
  { id: 'card', label: 'Révisions' },
  { id: 'word', label: 'Anglais' },
  { id: 'atelier', label: 'Atelier' },
]

export const clip = (text, n = 280) => {
  const t = String(text ?? '').replace(/\s+/g, ' ').trim()
  return t.length > n ? `${t.slice(0, n - 1)}…` : t
}

export const videoFav = (v) => ({
  id: `video:${v.id}`,
  type: 'video',
  title: v.title,
  sub: v.source,
  url: v.link,
  thumb: v.thumbnail,
  // de quoi relancer le lecteur de l'Actu depuis « Mes favoris », même si la vidéo a quitté le flux
  data: { id: v.id, kind: 'video', videoId: v.videoId, isShort: v.isShort, lang: v.lang, themes: v.themes ?? [], date: v.date, source: v.source, link: v.link, thumbnail: v.thumbnail, title: v.title },
})
export const articleFav = (a) => ({ id: `article:${a.id}`, type: 'article', title: a.title, sub: a.source, url: a.link, data: { date: a.date, themes: a.themes ?? [] } })
export const lessonFav = (lesson) => ({ id: `lesson:${lesson.key}`, type: 'lesson', title: lesson.title, sub: lesson.module?.title ?? '', to: `/cours/${lesson.key}` })
export const cardFav = (lot, item) => {
  const front = item.type === 'flashcard' ? item.recto : item.type === 'fiche' ? item.title : item.question
  const back = item.type === 'flashcard' ? item.verso : item.type === 'fiche' ? item.body : item.type === 'qa' ? item.reponse : item.choices?.[item.answer]
  return { id: `card:${lot.id}|${item.id}`, type: 'card', title: clip(front, 160), sub: lot.title, text: clip(back), to: `/revisions/lot/${lot.id}` }
}
export const wordFav = (w) => ({ id: `word:${w.en}`, type: 'word', title: w.en, sub: w.fr, text: clip(w.def) })
export const atelierFav = ({ key, title, sub, to }) => ({ id: `atelier:${key}`, type: 'atelier', title, sub: sub ?? '', to })
