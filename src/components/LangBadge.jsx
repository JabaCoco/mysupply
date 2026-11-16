// Petit badge "EN" pour signaler un contenu en anglais
export default function LangBadge({ lang, className = '' }) {
  if (lang !== 'en') return null
  return (
    <span
      className={`rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] leading-none font-extrabold tracking-wide text-slate-900 ${className}`}
      title="Vidéo en anglais, sous-titres activés"
    >
      EN
    </span>
  )
}
