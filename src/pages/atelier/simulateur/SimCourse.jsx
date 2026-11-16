import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { PROFILES, referenceFor } from '../../../lib/simulation.js'

const fmt = (n, d = 0) => n.toLocaleString('fr-FR', { maximumFractionDigits: d })

// Rappel de cours sur les notions du simulateur, illustré avec les chiffres de la partie
function sections(p) {
  const ref = referenceFor(p)
  const ss = 1.65 * p.sd * Math.sqrt(p.lead)
  const weeksBetween = Math.max(1, Math.round(ref.quantity / p.mean))
  const base = [
    {
      title: '1. Le délai de livraison',
      body: [
        `Une commande passée en semaine S arrive au début de la semaine S + ${p.lead}. Pendant ${p.lead > 1 ? `ces ${p.lead} semaines` : 'cette semaine'}, tu continues à vendre environ ${p.mean} unités par semaine.`,
        `Exemple : si tu commandes en semaine 3, la livraison arrive début semaine ${3 + p.lead}. Entre-temps, il te faut environ ${p.mean * p.lead} unités en stock pour tenir.`,
      ],
    },
    {
      title: '2. La position de stock',
      body: [
        'Pour décider, ne regarde pas seulement le stock en rayon : ajoute ce qui est déjà commandé et en route.',
        `Position = stock disponible + commandes en route. Exemple : ${p.mean} en stock + ${ref.quantity} en route = ${p.mean + ref.quantity}. Recommander alors que ${ref.quantity} unités arrivent, c'est risquer le surstock.`,
      ],
    },
    {
      title: '3. Le stock de sécurité',
      body: [
        `La demande varie (écart-type ${p.sd}). Le stock de sécurité absorbe une demande plus forte que prévu pendant le délai.`,
        `SS = z × σ × √L = 1,65 × ${p.sd} × √${p.lead} ≈ ${fmt(ss)} unités, pour un taux de service de 95 %.`,
        `Ici, une vente perdue coûte ${fmt(p.shortage, 2)} € et une unité stockée une semaine ${fmt(p.holding, 2)} € : une rupture coûte autant que ${fmt(p.shortage / p.holding, 1)} semaines de stockage.`,
      ],
    },
    {
      title: '4. Le point de commande',
      body: [
        "C'est le niveau de position de stock à partir duquel il faut commander.",
        `PC = D × L + SS = ${p.mean} × ${p.lead} + ${fmt(ss)} ≈ ${ref.reorderPoint} unités.`,
        `Règle simple : chaque semaine, si position ≤ ${ref.reorderPoint}, je commande ; sinon, j'attends.`,
      ],
    },
    {
      title: '5. La quantité économique (Wilson)',
      body: [
        `Chaque commande coûte ${p.orderCost} €, chaque unité stockée ${fmt(p.holding, 2)} € par semaine. Wilson équilibre les deux.`,
        `Q* = √(2 × D × S / H) = √(2 × ${p.mean} × ${p.orderCost} / ${fmt(p.holding, 2)}) ≈ ${ref.quantity} unités (D et H sont ici par semaine).`,
        `Exemple : commander ${p.mean} chaque semaine = 12 commandes × ${p.orderCost} € = ${fmt(12 * p.orderCost)} € de frais. Commander ${ref.quantity} environ toutes les ${weeksBetween} semaine${weeksBetween > 1 ? 's' : ''} = ${Math.ceil(12 / weeksBetween)} commandes = ${fmt(Math.ceil(12 / weeksBetween) * p.orderCost)} €, pour un peu plus de stock moyen.`,
      ],
    },
  ]
  if (p.profile === 'stable') return base
  return [
    ...base,
    {
      title: "6. Quand la demande n'est pas stable",
      body: [
        `Profil de cette partie : ${PROFILES[p.profile].label.toLowerCase()}. ${PROFILES[p.profile].text}`,
        `Demande prévue par semaine : ${p.means.join(', ')} unités. Ce n'est qu'une prévision : la demande réelle varie autour (± ${p.sd}).`,
        `Le point de commande suit alors la demande attendue pendant le délai : PC(semaine) = somme des prévisions des ${p.lead} prochaine${p.lead > 1 ? 's' : ''} semaine${p.lead > 1 ? 's' : ''} + stock de sécurité. Il monte avant un pic et redescend après.`,
      ],
    },
  ]
}

export default function SimCourse({ params, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen ? 0 : null)
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card">
      {sections(params).map((s, i) => (
        <div key={s.title} className="border-b border-line last:border-b-0">
          <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center gap-2 p-3.5 text-left font-bold">
            <span className="flex-1">{s.title}</span>
            <ChevronDown size={18} className={`shrink-0 text-muted transition-transform ${open === i ? 'rotate-180' : ''}`} />
          </button>
          {open === i && (
            <div className="space-y-2 px-3.5 pb-3.5 text-[15px] leading-relaxed text-fg/85">
              {s.body.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Les données de départ d'une partie, sous forme de lignes [libellé, valeur]
export function scenarioRows(p) {
  const euros = (n) => `${n.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} €`
  return [
    ['Produit', p.product],
    ['Stock de départ (semaine 1)', `${p.initialStock} unités`],
    ['Demande moyenne', `${p.mean} unités / semaine`],
    ['Profil de la demande', PROFILES[p.profile].label],
    ...(p.profile === 'stable' ? [] : [['Demande prévue par semaine', p.means.join(' · ')]]),
    ['Variabilité (écart-type)', `${p.sd} unités / semaine`],
    ['Délai de livraison', `${p.lead} semaine${p.lead > 1 ? 's' : ''} (commande en S → arrivée début S+${p.lead})`],
    ['Coût de stockage', `${euros(p.holding)} par unité restant en fin de semaine`],
    ['Coût de rupture', `${euros(p.shortage)} par vente perdue`],
    ['Coût de commande', `${euros(p.orderCost)} par commande passée`],
    ['Durée', `${p.weeks} semaines`],
  ]
}
