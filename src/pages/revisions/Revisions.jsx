import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Brain, DatabaseBackup, FileUp, Search } from 'lucide-react'
import Page from '../../components/Page.jsx'
import { useRevisions } from '../../lib/revStore.js'
import { copyText } from '../../lib/device.js'
import { RV_PROMPT } from '../../lib/revTemplate.js'

const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

function itemText(it) {
  if (it.type === 'fiche') return `${it.title} ${it.body}`
  if (it.type === 'flashcard') return `${it.recto} ${it.verso}`
  if (it.type === 'qcm') return `${it.question} ${it.choices.join(' ')} ${it.explication}`
  if (it.type === 'qa') return `${it.question} ${it.reponse}`
  return `${it.title} ${it.enonce} ${it.questions.map((q) => q.question).join(' ')}`
}

export function countsOf(lot) {
  const c = { fiche: 0, flashcard: 0, qcm: 0, qa: 0, exercice: 0 }
  lot.items.forEach((it) => c[it.type]++)
  return c
}

export default function Revisions() {
  const data = useRevisions()
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState(false)

  const groups = useMemo(() => {
    if (!data) return []
    const q = norm(query.trim())
    const rows = data.lots
      .map((lot) => {
        const head = norm(`${lot.title} ${lot.matiere} ${lot.cours}`)
        const hits = q ? lot.items.filter((it) => norm(itemText(it)).includes(q)).length : 0
        return { lot, hits, match: !q || head.includes(q) || hits > 0 }
      })
      .filter((r) => r.match)
    const byMatiere = new Map()
    for (const r of rows) {
      const m = r.lot.matiere
      if (!byMatiere.has(m)) byMatiere.set(m, new Map())
      const c = byMatiere.get(m)
      if (!c.has(r.lot.cours)) c.set(r.lot.cours, [])
      c.get(r.lot.cours).push(r)
    }
    return [...byMatiere.entries()].sort((a, b) => a[0].localeCompare(b[0], 'fr')).map(([m, c]) => [m, [...c.entries()].sort((a, b) => a[0].localeCompare(b[0], 'fr'))])
  }, [data, query])

  if (!data) return null
  const { summary } = data

  return (
    <Page>
      <div className="space-y-4">
        <header>
          <h1 className="text-3xl font-extrabold tracking-tight">Révisions</h1>
          <p className="text-sm text-muted">Tes fiches, flashcards, QCM et exercices</p>
        </header>

        <div className="rounded-3xl bg-linear-to-br from-orange-500 to-amber-400 p-5 text-white shadow-lg">
          <p className="text-xs font-bold tracking-wider text-white/80 uppercase">À réviser aujourd'hui</p>
          <p className="text-4xl font-extrabold">
            {summary.due} <span className="text-xl">carte{summary.due > 1 ? 's' : ''}</span>
          </p>
          <p className="mt-1 text-sm text-white/90">
            {summary.cards} carte{summary.cards > 1 ? 's' : ''} au total · {summary.mastered} maîtrisée{summary.mastered > 1 ? 's' : ''}
          </p>
          {summary.due > 0 ? (
            <Link to="/revisions/etude/tous/jour" className="mt-3 flex h-12 items-center justify-center gap-2 rounded-2xl bg-white font-bold text-orange-600">
              <Brain size={18} /> Réviser maintenant <ArrowRight size={18} />
            </Link>
          ) : (
            <p className="mt-3 rounded-2xl bg-white/20 p-3 text-sm font-semibold">{summary.cards ? 'Tout est à jour : reviens demain, ou révise un lot en entier.' : 'Importe ton premier lot pour commencer.'}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link to="/revisions/importer" className="flex items-center gap-2.5 rounded-2xl border border-line bg-card p-3.5 font-semibold transition-transform active:scale-[0.97]">
            <span className="grid size-9 place-items-center rounded-xl bg-violet-500 text-white">
              <FileUp size={18} />
            </span>
            Importer
          </Link>
          <Link to="/revisions/sauvegarde" className="flex items-center gap-2.5 rounded-2xl border border-line bg-card p-3.5 font-semibold transition-transform active:scale-[0.97]">
            <span className="grid size-9 place-items-center rounded-xl bg-emerald-500 text-white">
              <DatabaseBackup size={18} />
            </span>
            Sauvegarde
          </Link>
        </div>

        {data.lots.length === 0 ? (
          <div className="space-y-3 rounded-3xl border border-line bg-card p-5 text-sm leading-relaxed">
            <p className="text-base font-bold">Comment ça marche ?</p>
            <ol className="list-decimal space-y-1.5 pl-5">
              <li>Copie le modèle ci-dessous et colle-le dans un chat avec Claude, suivi de ton cours.</li>
              <li>Claude te répond avec un fichier de révision.</li>
              <li>
                Colle-le (ou importe-le) dans <span className="font-semibold">Importer</span> : l'appli le vérifie et te dit s'il y a des erreurs.
              </li>
            </ol>
            <button
              type="button"
              onClick={async () => {
                setCopied(await copyText(RV_PROMPT))
                setTimeout(() => setCopied(false), 2500)
              }}
              className="h-11 w-full rounded-2xl border border-line font-semibold"
            >
              {copied ? 'Modèle copié ✓' : 'Copier le modèle pour Claude'}
            </button>
            <p className="text-xs text-muted">L'appli ne contacte jamais Claude : elle fonctionne sans abonnement, même hors ligne.</p>
          </div>
        ) : (
          <>
            <label className="flex h-11 items-center gap-2 rounded-2xl border border-line bg-card px-3">
              <Search size={18} className="text-muted" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un lot ou un mot" className="min-w-0 flex-1 bg-transparent text-[16px] outline-none" aria-label="Rechercher" />
            </label>
            {groups.length === 0 && <p className="text-sm text-muted">Aucun résultat.</p>}
            {groups.map(([matiere, courses]) => (
              <section key={matiere} className="space-y-2">
                <h2 className="text-lg font-extrabold">{matiere}</h2>
                {courses.map(([cours, rows]) => (
                  <div key={cours} className="space-y-2">
                    <h3 className="text-xs font-bold tracking-wider text-muted uppercase">{cours}</h3>
                    {rows.map(({ lot, hits }) => {
                      const info = data.byLot.get(lot.id)
                      const c = countsOf(lot)
                      return (
                        <Link key={lot.id} to={`/revisions/lot/${lot.id}`} className="block rounded-2xl border border-line bg-card p-3.5 transition-transform active:scale-[0.98]">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-bold">{lot.title}</p>
                            {info.due > 0 && <span className="shrink-0 rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">{info.due} à réviser</span>}
                          </div>
                          <p className="mt-0.5 text-xs text-muted">
                            {[c.fiche && `${c.fiche} fiche${c.fiche > 1 ? 's' : ''}`, c.flashcard && `${c.flashcard} flashcard${c.flashcard > 1 ? 's' : ''}`, c.qcm && `${c.qcm} QCM`, c.qa && `${c.qa} Q/R`, c.exercice && `${c.exercice} exercice${c.exercice > 1 ? 's' : ''}`].filter(Boolean).join(' · ')}
                          </p>
                          {hits > 0 && <p className="mt-1 text-xs font-semibold text-violet-400">{hits} contenu{hits > 1 ? 's' : ''} correspondent à « {query} »</p>}
                        </Link>
                      )
                    })}
                  </div>
                ))}
              </section>
            ))}
          </>
        )}
      </div>
    </Page>
  )
}
