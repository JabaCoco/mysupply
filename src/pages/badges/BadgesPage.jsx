import { motion } from 'motion/react'
import { Lock } from 'lucide-react'
import Page from '../../components/Page.jsx'
import SubHeader from '../../components/SubHeader.jsx'
import { BADGES, BADGE_CATEGORIES } from '../../lib/badgeRules.js'
import { useBadgeProgress, useBadges } from '../../lib/badges.js'
import { BadgeIcon } from './badgeStyle.jsx'

const dateFr = (ms) => new Date(ms).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

// Page « Mes badges » : gagnés en couleur avec leur date, à débloquer grisés avec leur condition et leur avancement
export default function BadgesPage() {
  const earned = useBadges()
  const progress = useBadgeProgress()
  if (!earned) return null

  return (
    <Page>
      <SubHeader back="/" title="Mes badges" subtitle={`${earned.count} / ${earned.total} badges gagnés`} />
      <div className="mb-5 h-2.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={earned.count} aria-valuemax={earned.total} aria-label="Badges gagnés">
        <motion.div className="h-full rounded-full bg-amber-400" initial={{ width: 0 }} animate={{ width: `${(earned.count / earned.total) * 100}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
      </div>

      <div className="space-y-6">
        {BADGE_CATEGORIES.map((cat) => {
          const list = BADGES.filter((b) => b.cat === cat.id)
          const won = list.filter((b) => earned.byId.has(b.id)).length
          return (
            <section key={cat.id} aria-label={cat.label}>
              <h2 className="mb-2 flex items-baseline justify-between font-bold">
                {cat.label}
                <span className="text-xs font-normal text-muted">
                  {won} / {list.length}
                </span>
              </h2>
              <ul className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">
                {list.map((badge) => {
                  const row = earned.byId.get(badge.id)
                  const value = progress?.[badge.id]
                  return (
                    <li key={badge.id} className={`flex items-center gap-3 rounded-2xl border p-3 ${row ? 'border-amber-400/50 bg-card' : 'border-line bg-card/60'}`}>
                      <BadgeIcon badge={badge} locked={!row} />
                      <div className="min-w-0 flex-1">
                        <p className={`flex items-center gap-1.5 leading-snug font-bold ${row ? '' : 'text-muted'}`}>
                          {badge.title}
                          {!row && <Lock size={12} aria-label="À débloquer" />}
                        </p>
                        <p className="text-xs leading-snug text-muted">{badge.cond}</p>
                        {row ? (
                          <p className="mt-0.5 text-xs font-semibold text-amber-400">Obtenu le {dateFr(row.at)}</p>
                        ) : (
                          value !== undefined && badge.target > 1 && (
                            <div className="mt-1.5 flex items-center gap-2">
                              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                                <span className="block h-full rounded-full bg-muted/60" style={{ width: `${(value / badge.target) * 100}%` }} />
                              </span>
                              <span className="text-[11px] text-muted tabular-nums">
                                {value.toLocaleString('fr-FR')} / {badge.target.toLocaleString('fr-FR')}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
    </Page>
  )
}
