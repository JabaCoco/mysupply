import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { Award, Sparkles } from 'lucide-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db.js'
import { earnedBadges, findBadge } from '../lib/badgeRules.js'
import { loadBadgeData, statsOf, unlockBadges } from '../lib/badges.js'
import { celebrate } from '../lib/confetti.js'
import { BadgeIcon } from '../pages/badges/badgeStyle.jsx'

const SHOW_MS = 4800

// Invisible tant que rien ne se passe. À chaque changement des données (XP, leçons, Atelier, révisions, favoris…) :
// recalcule les badges gagnés, enregistre les nouveaux, puis affiche une notification animée avec des confettis.
// Au tout premier passage (badges déjà mérités grâce à la progression existante), un seul message, sans confettis.
export default function BadgeWatcher() {
  const snap = useLiveQuery(
    async () => ({
      data: await loadBadgeData(),
      have: new Set(await db.badges.toCollection().primaryKeys()),
      init: (await db.meta.get('badgesInit'))?.value === true,
    }),
    [],
  )
  const busy = useRef(false)
  const [queue, setQueue] = useState([])
  const current = queue[0] ?? null

  useEffect(() => {
    if (!snap || busy.current) return
    const missing = earnedBadges(statsOf(snap.data)).filter((b) => !snap.have.has(b.id))
    if (snap.init && missing.length === 0) return
    busy.current = true
    ;(async () => {
      try {
        const added = missing.length ? await unlockBadges(missing) : []
        if (!snap.init) await db.meta.put({ key: 'badgesInit', value: true })
        if (!added.length) return
        if (!snap.init) setQueue((q) => [...q, { key: 'init', kind: 'retro', count: added.length }])
        else if (added.length > 3) setQueue((q) => [...q, { key: `many-${Date.now()}`, kind: 'many', count: added.length }])
        else setQueue((q) => [...q, ...added.map((b) => ({ key: b.id, kind: 'badge', id: b.id }))])
      } finally {
        busy.current = false
      }
    })()
  }, [snap])

  // Chaque notification reste quelques secondes, puis laisse la place à la suivante
  const currentKey = current?.key
  const currentKind = current?.kind
  useEffect(() => {
    if (!currentKey) return
    if (currentKind !== 'retro') celebrate()
    const timer = setTimeout(() => setQueue((q) => q.slice(1)), SHOW_MS)
    return () => clearTimeout(timer)
  }, [currentKey, currentKind])

  const badge = current?.kind === 'badge' ? findBadge(current.id) : null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[80] flex justify-center px-3 pt-[max(0.75rem,env(safe-area-inset-top))]" aria-live="polite">
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.key}
            initial={{ y: -80, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="pointer-events-auto w-full max-w-sm"
          >
            <Link to="/badges" onClick={() => setQueue((q) => q.slice(1))} className="flex items-center gap-3 rounded-3xl border-2 border-amber-400 bg-card p-3 shadow-2xl shadow-black/40">
              {badge ? (
                <motion.span initial={{ scale: 0.3, rotate: -25 }} animate={{ scale: [0.3, 1.3, 1], rotate: [-25, 12, 0] }} transition={{ duration: 0.7 }}>
                  <BadgeIcon badge={badge} />
                </motion.span>
              ) : (
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-amber-400 text-slate-900">{current.kind === 'retro' ? <Award size={28} /> : <Sparkles size={28} />}</span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold tracking-wider text-amber-400 uppercase">{current.kind === 'retro' ? 'Tes badges' : current.kind === 'many' ? 'Nouveaux badges !' : 'Badge débloqué !'}</span>
                <span className="block leading-snug font-extrabold">
                  {badge ? badge.title : current.kind === 'retro' ? `${current.count} badge${current.count > 1 ? 's' : ''} déjà gagné${current.count > 1 ? 's' : ''}` : `${current.count} badges d'un coup`}
                </span>
                <span className="block text-xs leading-snug text-muted">{badge ? badge.cond : current.kind === 'retro' ? 'Grâce à ta progression. Touche pour les voir.' : 'Touche pour les voir.'}</span>
              </span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
