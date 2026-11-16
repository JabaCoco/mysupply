import { useState } from 'react'
import { NumberField, Note, Result, Steps, fmt, toNum } from './fields.jsx'

// Calculateur libre décrit par des données (onglet « Calculateur » des formules ajoutées) :
// calculator = { inputs: [{ key, label, unit?, value, help? }], outputs: [{ label, unit?, digits?, highlight?, fn(n) }],
//                steps?: (n) => [lignes de calcul], note? }
export default function GenericCalculator({ spec }) {
  const [values, setValues] = useState(() => Object.fromEntries(spec.inputs.map((i) => [i.key, String(i.value)])))
  const num = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, toNum(v)]))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {spec.inputs.map((input) => (
          <NumberField
            key={input.key}
            label={input.label}
            unit={input.unit}
            help={input.help}
            value={values[input.key]}
            onChange={(v) => setValues((s) => ({ ...s, [input.key]: v }))}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {spec.outputs.map((out) => (
          <Result key={out.label} label={out.label} value={fmt(out.fn(num), out.digits ?? 2)} unit={out.unit} highlight={out.highlight} />
        ))}
      </div>
      {spec.steps && <Steps lines={spec.steps(num)} />}
      {spec.note && <Note>{spec.note}</Note>}
    </div>
  )
}
