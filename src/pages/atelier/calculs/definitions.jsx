import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { NumberField, Note, Result, Steps, fmt, toNum } from './fields.jsx'
import { INCOTERMS, INCOTERM_ROWS, isSeller } from '../../../data/atelier/incoterms.js'

// Petit hook : un objet de champs texte modifiables
function useFields(initial) {
  const [values, setValues] = useState(initial)
  const bind = (key) => ({ value: values[key], onChange: (v) => setValues((s) => ({ ...s, [key]: v })) })
  const num = Object.fromEntries(Object.keys(values).map((k) => [k, toNum(values[k])]))
  return { bind, num }
}

const Z_VALUES = [
  ['90 %', 1.28],
  ['95 %', 1.65],
  ['97,5 %', 1.96],
  ['99 %', 2.33],
]

// ---------- Stock de sécurité & point de commande ----------
function SafetyStock() {
  const { bind, num } = useFields({ d: '100', sigma: '20', l: '4' })
  const [z, setZ] = useState(1.65)
  const ss = z * num.sigma * Math.sqrt(num.l)
  const pc = num.d * num.l + ss
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="Demande moyenne" unit="/ jour" {...bind('d')} />
        <NumberField label="Écart-type σ" unit="/ jour" {...bind('sigma')} />
        <NumberField label="Délai L" unit="jours" {...bind('l')} />
        <label className="block">
          <span className="text-sm font-semibold">Taux de service</span>
          <select
            value={z}
            onChange={(e) => setZ(Number(e.target.value))}
            className="mt-1 h-11 w-full rounded-xl border border-line bg-card px-3 text-[15px]"
          >
            {Z_VALUES.map(([label, value]) => (
              <option key={label} value={value}>
                {label} (z = {fmt(value)})
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Result label="Stock de sécurité" value={fmt(Math.ceil(ss), 0)} unit="u." highlight />
        <Result label="Point de commande" value={fmt(Math.ceil(pc), 0)} unit="u." />
      </div>
      <Steps
        lines={[
          `SS = z × σ × √L = ${fmt(z)} × ${fmt(num.sigma)} × √${fmt(num.l)} = ${fmt(ss)}`,
          `PC = D × L + SS = ${fmt(num.d)} × ${fmt(num.l)} + ${fmt(ss)} = ${fmt(pc)}`,
        ]}
      />
      <Note>On arrondit à l'unité supérieure pour ne pas sous-protéger. σ et L doivent être dans la même unité de temps.</Note>
    </div>
  )
}

// ---------- Wilson ----------
function Wilson() {
  const { bind, num } = useFields({ d: '12000', s: '50', price: '10', rate: '20' })
  const h = (num.price * num.rate) / 100
  const q = Math.sqrt((2 * num.d * num.s) / h)
  const n = num.d / q
  const orderCost = n * num.s
  const holdingCost = (q / 2) * h
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="Demande annuelle D" unit="u." {...bind('d')} />
        <NumberField label="Coût d'une commande S" unit="€" {...bind('s')} />
        <NumberField label="Prix unitaire" unit="€" {...bind('price')} />
        <NumberField label="Taux de possession" unit="% / an" {...bind('rate')} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Result label="Quantité économique Q*" value={fmt(Math.round(q), 0)} unit="u." highlight />
        <Result label="Commandes par an" value={fmt(n, 1)} />
        <Result label="Coût de passation / an" value={fmt(orderCost, 0)} unit="€" />
        <Result label="Coût de possession / an" value={fmt(holdingCost, 0)} unit="€" />
      </div>
      <Steps
        lines={[
          `H = prix × taux = ${fmt(num.price)} × ${fmt(num.rate)} % = ${fmt(h)} €`,
          `Q* = √(2 × D × S / H) = √(2 × ${fmt(num.d)} × ${fmt(num.s)} / ${fmt(h)}) = ${fmt(q)}`,
          `N = D / Q* = ${fmt(n, 1)} commandes`,
        ]}
      />
      <Note>Au point optimal, le coût de passation et le coût de possession sont égaux : c'est la signature de la formule de Wilson.</Note>
    </div>
  )
}

// ---------- ABC ----------
const ABC_DEFAULT = [
  ['Moteurs', '120', '850'],
  ['Cartes électroniques', '900', '95'],
  ['Carters', '400', '60'],
  ['Câbles', '5000', '3,2'],
  ['Visserie', '40000', '0,15'],
  ['Joints', '8000', '0,9'],
  ['Emballages', '6000', '0,6'],
  ['Étiquettes', '20000', '0,05'],
]

function Abc() {
  const [rows, setRows] = useState(ABC_DEFAULT)
  const update = (i, j, v) => setRows((r) => r.map((row, k) => (k === i ? row.map((c, m) => (m === j ? v : c)) : row)))
  const items = rows
    .map(([name, qty, price], index) => ({ name, index, value: toNum(qty) * toNum(price) }))
    .filter((it) => Number.isFinite(it.value))
    .sort((a, b) => b.value - a.value)
  const total = items.reduce((s, it) => s + it.value, 0)
  // Valeur cumulée à chaque ligne (du plus gros au plus petit)
  const cumulative = items.reduce((acc, it) => [...acc, (acc.at(-1) ?? 0) + it.value], [])
  const classified = items.map((it, i) => {
    const before = total && i ? (cumulative[i - 1] / total) * 100 : 0
    const pct = total ? (cumulative[i] / total) * 100 : 0
    // Un article est A tant que le cumul AVANT lui est sous 80 %, B sous 95 %, sinon C
    return { ...it, pct, cls: before < 80 ? 'A' : before < 95 ? 'B' : 'C' }
  })
  const badge = { A: 'bg-red-500', B: 'bg-amber-500', C: 'bg-emerald-500' }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">Modifie les articles (consommation annuelle et prix unitaire) : le classement se met à jour.</p>
      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_5rem_4.5rem_2rem] gap-1.5 text-[11px] text-muted">
          <span>Article</span>
          <span className="text-right">Conso / an</span>
          <span className="text-right">Prix €</span>
        </div>
        {rows.map(([name, qty, price], i) => (
          <div key={i} className="grid grid-cols-[1fr_5rem_4.5rem_2rem] items-center gap-1.5">
            <input value={name} onChange={(e) => update(i, 0, e.target.value)} className="h-10 min-w-0 rounded-lg border border-line bg-card px-2 text-sm" aria-label="Article" />
            <input value={qty} onChange={(e) => update(i, 1, e.target.value)} inputMode="decimal" className="h-10 min-w-0 rounded-lg border border-line bg-card px-2 text-right text-sm" aria-label="Consommation" />
            <input value={price} onChange={(e) => update(i, 2, e.target.value)} inputMode="decimal" className="h-10 min-w-0 rounded-lg border border-line bg-card px-2 text-right text-sm" aria-label="Prix" />
            <button type="button" onClick={() => setRows((r) => r.filter((_, k) => k !== i))} className="grid size-8 place-items-center text-muted" aria-label="Supprimer">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => setRows((r) => [...r, ['Nouvel article', '0', '0']])} className="flex items-center gap-1 text-sm font-semibold text-violet-400">
          <Plus size={16} /> Ajouter un article
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-card text-xs text-muted">
            <tr>
              <th className="p-2 text-left">Article</th>
              <th className="p-2 text-right">Valeur €</th>
              <th className="p-2 text-right">Cumul</th>
              <th className="p-2">Classe</th>
            </tr>
          </thead>
          <tbody>
            {classified.map((it) => (
              <tr key={it.index} className="border-t border-line">
                <td className="p-2">{it.name}</td>
                <td className="p-2 text-right">{fmt(it.value, 0)}</td>
                <td className="p-2 text-right">{fmt(it.pct, 1)} %</td>
                <td className="p-2 text-center">
                  <span className={`inline-block w-6 rounded-md text-xs leading-5 font-bold text-white ${badge[it.cls]}`}>{it.cls}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>Règle utilisée : un article est en classe A tant que le cumul avant lui est sous 80 % de la valeur, B sous 95 %, C au-delà. Les seuils varient selon les entreprises.</Note>
    </div>
  )
}

// ---------- Rotation & couverture ----------
function Rotation() {
  const { bind, num } = useFields({ conso: '1200000', stock: '200000' })
  const rotation = num.conso / num.stock
  const days = 365 / rotation
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="Consommation annuelle (au coût)" unit="€" {...bind('conso')} />
        <NumberField label="Stock moyen" unit="€" {...bind('stock')} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Result label="Rotation" value={fmt(rotation, 1)} unit="fois / an" highlight />
        <Result label="Couverture" value={fmt(days, 0)} unit="jours" />
      </div>
      <Steps
        lines={[
          `Rotation = consommation / stock moyen = ${fmt(num.conso, 0)} / ${fmt(num.stock, 0)} = ${fmt(rotation, 2)}`,
          `Couverture ≈ 365 / rotation = ${fmt(days, 1)} jours`,
        ]}
      />
    </div>
  )
}

// ---------- OTIF ----------
function Otif() {
  const { bind, num } = useFields({ total: '1000', onTime: '950', inFull: '960', both: '920' })
  const pct = (x) => (x / num.total) * 100
  const incoherent = num.both > Math.min(num.onTime, num.inFull)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="Commandes livrées" {...bind('total')} />
        <NumberField label="Dont à l'heure" {...bind('onTime')} />
        <NumberField label="Dont complètes" {...bind('inFull')} />
        <NumberField label="Dont à l'heure ET complètes" {...bind('both')} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Result label="On Time" value={`${fmt(pct(num.onTime), 1)} %`} />
        <Result label="In Full" value={`${fmt(pct(num.inFull), 1)} %`} />
        <Result label="OTIF" value={`${fmt(pct(num.both), 1)} %`} highlight />
      </div>
      {incoherent && (
        <Note>Attention : les commandes « à l'heure ET complètes » ne peuvent pas dépasser les commandes à l'heure, ni les commandes complètes.</Note>
      )}
      <Steps lines={[`OTIF = ${fmt(num.both, 0)} / ${fmt(num.total, 0)} = ${fmt(pct(num.both), 1)} %`]} />
    </div>
  )
}

// ---------- TCO ----------
function Tco() {
  const a = useFields({ price: '8', transport: '1,2', duty: '10', storage: '1', defect: '6' })
  const b = useFields({ price: '10', transport: '0,5', duty: '0', storage: '0,2', defect: '1' })
  const tco = ({ num }) => num.price + num.transport + (num.price * num.duty) / 100 + num.storage + (num.price * num.defect) / 100
  const ta = tco(a)
  const tb = tco(b)
  const cheaperPrice = a.num.price < b.num.price ? 'A' : 'B'
  const winner = ta < tb ? 'A' : 'B'
  const column = (f, name) => (
    <div className="space-y-2.5">
      <p className="font-bold">{name}</p>
      <NumberField label="Prix unitaire" unit="€" {...f.bind('price')} />
      <NumberField label="Transport / unité" unit="€" {...f.bind('transport')} />
      <NumberField label="Droits de douane" unit="%" {...f.bind('duty')} />
      <NumberField label="Stockage / unité" unit="€" {...f.bind('storage')} />
      <NumberField label="Non-qualité" unit="% prix" {...f.bind('defect')} />
    </div>
  )
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {column(a, 'Fournisseur A')}
        {column(b, 'Fournisseur B')}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Result label="TCO A / unité" value={fmt(ta)} unit="€" highlight={ta < tb} />
        <Result label="TCO B / unité" value={fmt(tb)} unit="€" highlight={tb < ta} />
      </div>
      <Steps lines={['TCO = prix + transport + prix × douane + stockage + prix × non-qualité']} />
      <Note>
        {ta === tb
          ? 'Les deux fournisseurs ont le même coût total.'
          : `Le fournisseur ${winner} est le moins cher au coût total (${fmt(Math.abs(ta - tb))} € d'écart par unité)${
              cheaperPrice !== winner ? ", alors que son prix d'achat est plus élevé : c'est tout l'intérêt du TCO." : '.'
            }`}
      </Note>
    </div>
  )
}

// ---------- Incoterms ----------
function Incoterms() {
  const [code, setCode] = useState('FOB')
  const term = INCOTERMS.find((t) => t.code === code)
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {INCOTERMS.map((t) => (
          <button
            key={t.code}
            type="button"
            onClick={() => setCode(t.code)}
            className={`rounded-lg px-2.5 py-1.5 font-mono text-sm font-bold ${t.code === code ? 'bg-violet-500 text-white' : 'border border-line bg-card'}`}
          >
            {t.code}
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-line bg-card p-4">
        <p className="text-lg font-extrabold">
          {term.code} — {term.name}
        </p>
        <p className="text-xs text-muted">{term.maritime ? 'Maritime et fluvial uniquement' : 'Tous modes de transport'}</p>
        <p className="mt-2 text-sm">
          <span className="font-bold text-violet-400">Transfert du risque : </span>
          {term.risk}
        </p>
      </div>
      <ul className="overflow-hidden rounded-2xl border border-line">
        {INCOTERM_ROWS.map((label, i) => {
          const who = term.rows[i]
          const seller = isSeller(who)
          return (
            <li key={label} className="flex items-center justify-between gap-3 border-b border-line p-3 text-sm last:border-b-0">
              <span>{label}</span>
              <span className={`shrink-0 rounded-md px-2 py-0.5 text-right text-xs font-bold ${seller ? 'bg-sky-500/15 text-sky-400' : 'bg-orange-500/15 text-orange-400'}`}>
                {who}
              </span>
            </li>
          )
        })}
      </ul>
      <Note>Simplification pédagogique : avec les règles C, le déchargement peut être inclus dans le contrat de transport payé par le vendeur. Vérifie toujours le contrat.</Note>
    </div>
  )
}

// Calculateur libre de chaque formule (onglet "Calculateur")
export const CALCULATOR_COMPONENTS = {
  'stock-securite': SafetyStock,
  wilson: Wilson,
  abc: Abc,
  rotation: Rotation,
  otif: Otif,
  tco: Tco,
  incoterms: Incoterms,
}
