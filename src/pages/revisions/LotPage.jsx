import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { BookOpen, Brain, ClipboardList, Layers, ListChecks, MessageSquare, Pencil, Trash2 } from 'lucide-react'
import Page from '../../components/Page.jsx'
import SubHeader from '../../components/SubHeader.jsx'
import { deleteLot, parseKey, renameLot, useRevisions } from '../../lib/revStore.js'
import { levelOf } from '../../lib/revSrs.js'
import { countsOf } from './Revisions.jsx'

export default function LotPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const data = useRevisions()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ title: '', matiere: '', cours: '' })
  const [confirm, setConfirm] = useState(false)

  if (!data) return null
  const lot = data.lots.find((l) => l.id === id)
  if (!lot)
    return (
      <Page>
        <SubHeader back="/revisions" title="Lot introuvable" />
        <p className="text-muted">Ce lot n'existe plus (il a peut-être été supprimé).</p>
      </Page>
    )

  const c = countsOf(lot)
  const info = data.byLot.get(lot.id)
  const itemById = new Map(lot.items.map((it) => [it.id, it]))
  // Cartes à réviser (jamais vues ou dont la date est arrivée), par type de contenu
  const dueOf = (type) => info.cards.filter((card) => itemById.get(parseKey(card.key).itemId)?.type === type && (!card.progress || card.progress.due <= data.today)).length
  const levels = { nouvelle: 0, 'en cours': 0, 'à revoir': 0, maîtrisée: 0 }
  info.cards.forEach((card) => levels[levelOf(card.progress)]++)

  const modes = [
    { to: 'fiches', icon: BookOpen, color: 'bg-sky-500', label: 'Lire les fiches', count: c.fiche, sub: `${c.fiche} fiche${c.fiche > 1 ? 's' : ''}` },
    { to: '/revisions/etude/' + lot.id + '/flash', icon: Layers, color: 'bg-orange-500', label: 'Flashcards', count: c.flashcard, sub: `${c.flashcard} carte${c.flashcard > 1 ? 's' : ''} · ${dueOf('flashcard')} à réviser` },
    { to: '/revisions/etude/' + lot.id + '/qcm', icon: ListChecks, color: 'bg-emerald-500', label: 'QCM', count: c.qcm, sub: `${c.qcm} question${c.qcm > 1 ? 's' : ''} · ${dueOf('qcm')} à réviser` },
    { to: '/revisions/etude/' + lot.id + '/qa', icon: MessageSquare, color: 'bg-pink-500', label: 'Questions-réponses', count: c.qa, sub: `${c.qa} question${c.qa > 1 ? 's' : ''} · ${dueOf('qa')} à réviser` },
    { to: 'exercices', icon: ClipboardList, color: 'bg-indigo-500', label: 'Exercices', count: c.exercice, sub: `${c.exercice} exercice${c.exercice > 1 ? 's' : ''} avec tableaux` },
  ]

  async function save(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.matiere.trim()) return
    await renameLot(lot.id, form)
    setEditing(false)
  }

  return (
    <Page>
      <SubHeader back="/revisions" title={lot.title} subtitle={`${lot.matiere} · ${lot.cours}`} />
      <div className="space-y-4">
        {info.cards.length > 0 && (
          <Link to={`/revisions/etude/${lot.id}/jour${info.due ? '' : '?tout=1'}`} className={`flex h-12 items-center justify-center gap-2 rounded-2xl font-bold text-white ${info.due ? 'bg-orange-500' : 'bg-violet-500'}`}>
            <Brain size={18} /> {info.due ? `Réviser les cartes du jour (${Math.min(info.due, 20)})` : 'Tout revoir quand même'}
          </Link>
        )}
        {info.cards.length > 0 && (
          <div className="grid grid-cols-4 gap-1.5 text-center text-[11px]">
            {Object.entries(levels).map(([k, n]) => (
              <div key={k} className="rounded-xl border border-line bg-card p-1.5">
                <p className="text-base font-extrabold">{n}</p>
                <p className="text-muted">{k}</p>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          {modes.map((m) => {
            const Icon = m.icon
            const disabled = m.count === 0
            const body = (
              <>
                <span className={`grid size-10 shrink-0 place-items-center rounded-xl text-white ${m.color}`}>
                  <Icon size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block font-bold">{m.label}</span>
                  <span className="block text-xs text-muted">{disabled ? 'aucun dans ce lot' : m.sub}</span>
                </span>
              </>
            )
            return disabled ? (
              <div key={m.label} className="flex items-center gap-3 rounded-2xl border border-line bg-card p-3 opacity-40">
                {body}
              </div>
            ) : (
              <Link key={m.label} to={m.to} className="flex items-center gap-3 rounded-2xl border border-line bg-card p-3 transition-transform active:scale-[0.98]">
                {body}
              </Link>
            )
          })}
          {info.cards.length > 0 && (
            <p className="text-xs text-muted">Chaque flashcard compte pour 2 cartes : recto → verso et verso → recto.</p>
          )}
        </div>

        <div className="space-y-2 rounded-2xl border border-line bg-card p-3">
          {editing ? (
            <form onSubmit={save} className="space-y-2">
              {[['title', 'Titre du lot'], ['matiere', 'Matière'], ['cours', 'Cours']].map(([k, label]) => (
                <label key={k} className="block text-xs font-semibold text-muted">
                  {label}
                  <input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="mt-1 h-11 w-full rounded-xl border border-line bg-bg px-3 text-[16px] text-fg outline-none focus:border-violet-400" />
                </label>
              ))}
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditing(false)} className="h-11 flex-1 rounded-xl border border-line font-semibold">
                  Annuler
                </button>
                <button type="submit" className="h-11 flex-1 rounded-xl bg-violet-500 font-bold text-white">
                  Enregistrer
                </button>
              </div>
            </form>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setForm({ title: lot.title, matiere: lot.matiere, cours: lot.cours })
                  setEditing(true)
                }}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-line font-semibold"
              >
                <Pencil size={16} /> Renommer
              </button>
              {confirm ? (
                <button
                  type="button"
                  onClick={async () => {
                    await deleteLot(lot.id)
                    navigate('/revisions')
                  }}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 font-bold text-white"
                >
                  <Trash2 size={16} /> Oui, supprimer
                </button>
              ) : (
                <button type="button" onClick={() => setConfirm(true)} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-line font-semibold text-red-400">
                  <Trash2 size={16} /> Supprimer
                </button>
              )}
            </div>
          )}
          {confirm && <p className="text-xs text-muted">Le lot et ta progression sur ces cartes seront effacés de cet appareil. Pense à la sauvegarde si tu veux les garder.</p>}
        </div>
      </div>
    </Page>
  )
}
