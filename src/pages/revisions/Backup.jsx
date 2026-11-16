import { useMemo, useRef, useState } from 'react'
import { CheckCircle2, ClipboardPaste, Copy, Download, FileUp, XCircle } from 'lucide-react'
import Page from '../../components/Page.jsx'
import SubHeader from '../../components/SubHeader.jsx'
import { applyBackup, buildBackup, tableSchema } from '../../lib/revStore.js'
import { validateBackup } from '../../lib/revBackup.js'
import { copyText, isIOS, readClipboard, readFile, saveTextFile } from '../../lib/device.js'
import { dayKey } from '../../lib/dates.js'

const TABLE_LABELS = { rvLots: 'lots de révision', rvProgress: 'cartes suivies', activity: 'jours d\'activité (XP et série)', lessons: 'leçons de cours', workshop: 'résultats de l\'Atelier', english: 'anglais', seen: 'vidéos vues', meta: 'réglages' }

// Sauvegarde et restauration de tout : contenus importés, progression, XP, série…
export default function Backup() {
  const [text, setText] = useState('')
  const [mode, setMode] = useState('fusionner')
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const [done, setDone] = useState(null)
  const [busy, setBusy] = useState(false)
  const fileRef = useRef(null)

  const check = useMemo(() => (text.trim() ? validateBackup(text, tableSchema()) : null), [text])
  const filename = `sauvegarde-supply-chain-${dayKey(new Date())}.json`

  async function exportFile() {
    setBusy(true)
    const result = await saveTextFile(filename, await buildBackup())
    setBusy(false)
    setMessage(result === 'annule' ? 'Enregistrement annulé.' : result === 'partage' ? 'Choisis « Enregistrer dans Fichiers » (ou iCloud Drive) dans la fenêtre qui s\'ouvre.' : `Fichier « ${filename} » téléchargé dans tes téléchargements.`)
  }

  async function exportCopy() {
    const ok = await copyText(await buildBackup())
    setCopied(ok)
    setMessage(ok ? 'Sauvegarde copiée : colle-la dans un message, un mail ou une note pour la retrouver sur l\'autre appareil.' : 'La copie a échoué : utilise « Enregistrer le fichier ».')
    setTimeout(() => setCopied(false), 2500)
  }

  async function onFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      setText(await readFile(file))
      setDone(null)
      setMessage(`Fichier « ${file.name} » chargé : vérifie-le ci-dessous.`)
    } catch {
      setMessage('Impossible de lire ce fichier.')
    }
  }

  async function onPaste() {
    const clip = await readClipboard()
    if (clip) {
      setText(clip)
      setDone(null)
      setMessage('Contenu collé.')
    } else setMessage('Le presse-papiers n\'est pas accessible ici : touche la zone de texte, maintiens le doigt et choisis « Coller ».')
  }

  async function restore() {
    if (!check?.ok || busy) return
    setBusy(true)
    try {
      const stats = await applyBackup(check.data, mode)
      setDone(stats)
      setText('')
      setMessage('')
    } catch (e) {
      setMessage(`La restauration a échoué : ${e.message}`)
    }
    setBusy(false)
  }

  const counts = check?.ok ? Object.entries(check.data.tables).map(([k, v]) => [k, v.length]).filter(([, n]) => n) : []

  return (
    <Page>
      <SubHeader back="/revisions" title="Sauvegarde" subtitle="Passe du PC au téléphone sans rien perdre" />
      <div className="space-y-5">
        <section className="space-y-3 rounded-3xl border border-line bg-card p-4">
          <h2 className="font-extrabold">1. Exporter</h2>
          <p className="text-sm text-muted">Un seul fichier contient tes lots importés, ta progression, tes XP et ta série. Les actualités (qui se rechargent seules) n'en font pas partie.</p>
          <button type="button" onClick={exportFile} disabled={busy} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-violet-500 font-bold text-white disabled:opacity-50">
            <Download size={18} /> Enregistrer le fichier
          </button>
          <button type="button" onClick={exportCopy} className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-line font-semibold">
            <Copy size={16} /> {copied ? 'Copié ✓' : 'Copier la sauvegarde (à coller ailleurs)'}
          </button>
          {isIOS() && <p className="text-xs text-muted">Sur iPhone : la feuille de partage s'ouvre, choisis « Enregistrer dans Fichiers ».</p>}
        </section>

        <section className="space-y-3 rounded-3xl border border-line bg-card p-4">
          <h2 className="font-extrabold">2. Importer une sauvegarde</h2>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-violet-500 font-bold text-white">
              <FileUp size={18} /> Choisir un fichier
              <input ref={fileRef} type="file" accept=".json,application/json,text/plain,text/*" onChange={onFile} className="sr-only" aria-label="Choisir une sauvegarde" />
            </label>
            <button type="button" onClick={onPaste} className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-line font-semibold">
              <ClipboardPaste size={18} /> Coller
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setDone(null)
              setMessage('')
            }}
            rows={5}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            placeholder="Ou colle ici le texte de la sauvegarde"
            className="w-full rounded-2xl border border-line bg-bg p-3 font-mono text-[16px] outline-none focus:border-violet-400"
            aria-label="Texte de la sauvegarde"
          />

          {check && !check.ok && (
            <ul className="space-y-1.5" role="alert">
              {check.errors.map((e, i) => (
                <li key={i} className="flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/10 p-2.5 text-sm">
                  <XCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
                  <span>
                    <span className="font-bold">Ligne {e.line} : </span>
                    {e.message}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {check?.ok && (
            <div className="space-y-3">
              <div className="rounded-2xl border border-emerald-500/50 bg-emerald-500/10 p-3 text-sm">
                <p className="flex items-center gap-2 font-bold text-emerald-400">
                  <CheckCircle2 size={18} /> Sauvegarde valide
                </p>
                <p className="text-xs text-muted">Faite le {new Date(check.data.exportedAt).toLocaleString('fr-FR')}</p>
                <ul className="mt-1">
                  {counts.map(([k, n]) => (
                    <li key={k}>
                      {n} {TABLE_LABELS[k] ?? k}
                    </li>
                  ))}
                </ul>
              </div>
              <fieldset className="space-y-1.5 text-sm">
                <label className="flex items-start gap-2 rounded-xl border border-line p-2.5">
                  <input type="radio" name="bmode" checked={mode === 'fusionner'} onChange={() => setMode('fusionner')} className="mt-1" />
                  <span>
                    <span className="font-semibold">Fusionner (conseillé)</span>
                    <span className="block text-xs text-muted">Ajoute ce qui manque ici et garde le plus avancé (XP du jour les plus hauts, cartes révisées en dernier…).</span>
                  </span>
                </label>
                <label className="flex items-start gap-2 rounded-xl border border-line p-2.5">
                  <input type="radio" name="bmode" checked={mode === 'remplacer'} onChange={() => setMode('remplacer')} className="mt-1" />
                  <span>
                    <span className="font-semibold">Tout remplacer</span>
                    <span className="block text-xs text-muted">Efface ce qui est sur cet appareil et reprend exactement la sauvegarde.</span>
                  </span>
                </label>
              </fieldset>
              <button type="button" onClick={restore} disabled={busy} className={`h-12 w-full rounded-2xl font-bold text-white disabled:opacity-50 ${mode === 'remplacer' ? 'bg-red-500' : 'bg-emerald-500'}`}>
                {mode === 'remplacer' ? 'Remplacer tout par la sauvegarde' : 'Fusionner avec cet appareil'}
              </button>
            </div>
          )}

          {done && (
            <div className="rounded-2xl border border-emerald-500/50 bg-emerald-500/10 p-3 text-sm" role="status">
              <p className="flex items-center gap-2 font-bold text-emerald-400">
                <CheckCircle2 size={18} /> Sauvegarde importée
              </p>
              <p className="text-muted">{Object.values(done).reduce((a, b) => a + b, 0)} élément(s) ajouté(s) ou mis à jour.</p>
            </div>
          )}
          {message && <p className="text-sm text-muted">{message}</p>}
        </section>
      </div>
    </Page>
  )
}
