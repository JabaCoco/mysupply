import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import { X } from 'lucide-react'
import { referenceFor } from '../../../lib/simulation.js'
import SimCourse, { scenarioRows } from './SimCourse.jsx'

// Fenêtre "Revoir la situation" : toutes les données de la partie, sans quitter le jeu
export default function SituationModal({ game, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  const p = game.params
  const ref = referenceFor(p)
  const onOrder = game.pipeline.reduce((s, o) => s + o.qty, 0)
  const now = [
    ['Semaine en cours', `${game.week + 1} / ${p.weeks}`],
    ['Stock disponible', `${game.stock} unités`],
    ['Commandes en route', game.pipeline.length ? game.pipeline.map((o) => `${o.qty} u. (début S${o.arrival + 1})`).join(', ') : 'aucune'],
    ['Position de stock', `${game.stock + onOrder} unités`],
  ]

  return createPortal(
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center" onClick={onClose}>
      <motion.div
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label="Revoir la situation"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-bg p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:rounded-3xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-extrabold">La situation</h2>
          <button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full bg-card" aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        <Table title="Données de départ" rows={scenarioRows(p)} />
        <Table title="Où tu en es" rows={now} />
        <p className="my-3 rounded-2xl bg-amber-400/10 p-3 text-sm leading-snug">
          Repères du cours : stock de sécurité ≈ <span className="font-bold">{ref.safetyStock}</span>, point de commande ≈{' '}
          <span className="font-bold">{ref.reorderPoint}</span>, quantité économique ≈ <span className="font-bold">{ref.quantity}</span>.
        </p>
        <p className="mb-2 text-xs font-bold tracking-wider text-muted uppercase">Rappel de cours</p>
        <SimCourse params={p} />
        <button type="button" onClick={onClose} className="mt-4 h-12 w-full rounded-2xl bg-violet-500 font-bold text-white">
          Reprendre la partie
        </button>
      </motion.div>
    </motion.div>,
    document.body,
  )
}

export function Table({ title, rows }) {
  return (
    <div className="mb-3">
      <p className="mb-1.5 text-xs font-bold tracking-wider text-muted uppercase">{title}</p>
      <dl className="overflow-hidden rounded-2xl border border-line">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-3 border-b border-line bg-card px-3 py-2.5 text-sm last:border-b-0">
            <dt className="text-muted">{label}</dt>
            <dd className="text-right font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
