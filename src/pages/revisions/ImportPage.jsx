import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { AlertTriangle, CheckCircle2, ClipboardPaste, Copy, Download, FileUp, XCircle } from 'lucide-react'
import Page from '../../components/Page.jsx'
import SubHeader from '../../components/SubHeader.jsx'
import { parseRevisions } from '../../lib/revFormat.js'
import { RV_EXAMPLE, RV_PROMPT } from '../../lib/revTemplate.js'
import { copyText, readClipboard, readFile, saveTextFile } from '../../lib/device.js'
import { findSameLot, saveLot, useRevisions } from '../../lib/revStore.js'

const LABELS = { fiche: 'fiche', flashcard: 'flashcard', qcm: 'QCM', qa: 'question-réponse', exercice: 'exercice' }

export default function ImportPage() {
  const navigate = useNavigate()
  const data = useRevisions()
  const [text, setText] = useState('')
  const [mode, setMode] = useState('remplacer')
  const [note, setNote] = useState('')
  const [copied, setCopied] = useState('')
  const [saving, setSaving] = useState(false)
  const fileRef = useRef(null)

  const result = useMemo(() => (text.trim() ? parseRevisions(text) : null), [text])
  const same = result?.ok && data ? findSameLot(data.lots, result.lot) : null
  const lines = text.replace(/\r\n?/g, '\n').split('\n')

  async function onFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      setText(await readFile(file))
      setNote(`Fichier « ${file.name} » chargé.`)
    } catch {
      setNote('Impossible de lire ce fichier.')
    }
  }

  async function onPaste() {
    const clip = await readClipboard()
    if (clip) {
      setText(clip)
      setNote('Contenu collé depuis le presse-papiers.')
    } else setNote('Le presse-papiers n\'est pas accessible ici : touche la zone de texte, maintiens le doigt et choisis « Coller ».')
  }

  async function doImport() {
    if (!result?.ok || saving) return
    setSaving(true)
    const id = await saveLot(result.lot, same && mode === 'remplacer' ? 'remplacer' : 'nouveau', same?.id)
    navigate(`/revisions/lot/${id}`)
  }

  async function copy(label, value) {
    setCopied((await copyText(value)) ? label : 'erreur')
    setTimeout(() => setCopied(''), 2500)
  }

  return (
    <Page>
      <SubHeader back="/revisions" title="Importer" subtitle="Colle ou choisis le fichier fait par Claude" />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <label className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-violet-500 font-bold text-white">
            <FileUp size={18} /> Importer un fichier
            <input ref={fileRef} type="file" accept=".txt,.md,.markdown,.text,text/plain,text/markdown,text/*" onChange={onFile} className="sr-only" aria-label="Importer un fichier de révisions" />
          </label>
          <button type="button" onClick={onPaste} className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-line font-semibold">
            <ClipboardPaste size={18} /> Coller
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setNote('')
          }}
          placeholder={'Ou colle ici le contenu du fichier :\n\n@lot Mon lot\n@matiere Supply chain\n…'}
          rows={9}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          className="w-full rounded-2xl border border-line bg-card p-3 font-mono text-[16px] leading-snug outline-none focus:border-violet-400"
          aria-label="Contenu à importer"
        />
        {note && <p className="text-sm text-muted">{note}</p>}

        {result && !result.ok && (
          <div className="space-y-2" role="alert">
            <p className="flex items-center gap-2 font-bold text-red-400">
              <XCircle size={18} /> {result.errorCount} erreur{result.errorCount > 1 ? 's' : ''} : rien n'a été importé
            </p>
            <ul className="space-y-1.5">
              {result.errors.map((e, i) => (
                <li key={i} className="rounded-xl border border-red-500/40 bg-red-500/10 p-2.5 text-sm">
                  <span className="font-bold">Ligne {e.line} : </span>
                  {e.message}
                  {lines[e.line - 1]?.trim() && <code className="mt-1 block truncate rounded bg-bg px-1.5 py-0.5 text-xs text-muted">{lines[e.line - 1]}</code>}
                </li>
              ))}
            </ul>
            {result.errorCount > result.errors.length && <p className="text-xs text-muted">… et {result.errorCount - result.errors.length} autre(s) erreur(s). Corrige les premières puis recommence.</p>}
            <p className="text-xs text-muted">Astuce : colle ces erreurs dans le chat avec Claude et demande-lui de corriger le fichier.</p>
          </div>
        )}

        {result?.ok && (
          <div className="space-y-3">
            <div className="rounded-2xl border border-emerald-500/50 bg-emerald-500/10 p-3.5 text-sm">
              <p className="flex items-center gap-2 font-bold text-emerald-400">
                <CheckCircle2 size={18} /> Fichier valide
              </p>
              <p className="mt-1 font-bold">{result.lot.title}</p>
              <p className="text-muted">
                {result.lot.matiere} · {result.lot.cours}
              </p>
              <p className="mt-1">
                {Object.entries(result.counts)
                  .filter(([, n]) => n)
                  .map(([k, n]) => `${n} ${LABELS[k]}${n > 1 && k !== 'qcm' ? 's' : ''}`)
                  .join(' · ')}
              </p>
            </div>
            {result.warnings.length > 0 && (
              <ul className="space-y-1.5">
                {result.warnings.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-2.5 text-sm">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-400" />
                    <span>
                      <span className="font-bold">Ligne {w.line} : </span>
                      {w.message}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {same && (
              <fieldset className="space-y-1.5 rounded-2xl border border-line bg-card p-3 text-sm">
                <legend className="px-1 text-xs font-bold tracking-wider text-muted uppercase">Un lot du même nom existe déjà</legend>
                <label className="flex items-start gap-2">
                  <input type="radio" name="mode" checked={mode === 'remplacer'} onChange={() => setMode('remplacer')} className="mt-1" />
                  <span>
                    <span className="font-semibold">Remplacer le lot existant</span>
                    <span className="block text-xs text-muted">Ta progression est conservée pour les cartes qui n'ont pas changé.</span>
                  </span>
                </label>
                <label className="flex items-start gap-2">
                  <input type="radio" name="mode" checked={mode === 'nouveau'} onChange={() => setMode('nouveau')} className="mt-1" />
                  <span className="font-semibold">Ajouter comme nouveau lot</span>
                </label>
              </fieldset>
            )}
            <button type="button" onClick={doImport} disabled={saving} className="h-12 w-full rounded-2xl bg-violet-500 font-bold text-white disabled:opacity-50">
              {same && mode === 'remplacer' ? 'Remplacer le lot' : 'Importer le lot'}
            </button>
          </div>
        )}

        <section className="space-y-2 rounded-3xl border border-line bg-card p-4">
          <h2 className="font-extrabold">Le modèle à donner à Claude</h2>
          <p className="text-sm text-muted">Copie ce texte dans un chat avec Claude, puis colle ton cours à la fin. Claude te répond avec un fichier que tu importes ici.</p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => copy('prompt', RV_PROMPT)} className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-line font-semibold">
              <Copy size={16} /> {copied === 'prompt' ? 'Copié ✓' : 'Copier le modèle'}
            </button>
            <button type="button" onClick={() => saveTextFile('modele-revisions.txt', RV_PROMPT, 'text/plain')} className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-line font-semibold">
              <Download size={16} /> Enregistrer
            </button>
          </div>
          {copied === 'erreur' && <p className="text-sm text-red-400">La copie a échoué : ouvre « Voir le modèle » et copie-le à la main.</p>}
          <button type="button" onClick={() => setText(RV_EXAMPLE)} className="text-sm font-semibold text-violet-400">
            Essayer avec l'exemple
          </button>
          <details className="text-sm">
            <summary className="cursor-pointer font-semibold">Voir le modèle</summary>
            <pre className="mt-2 max-h-80 overflow-auto rounded-xl bg-bg p-3 text-xs whitespace-pre-wrap">{RV_PROMPT}</pre>
          </details>
        </section>
      </div>
    </Page>
  )
}
