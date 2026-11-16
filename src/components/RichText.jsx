// Affiche un petit texte "enrichi" :
// - \n\n sépare les paragraphes, \n fait un retour à la ligne
// - **mot** met le mot en gras
function Inline({ text }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-bold text-fg">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  )
}

export default function RichText({ text, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {text.split('\n\n').map((paragraph, i) => (
        <p key={i}>
          {paragraph.split('\n').map((line, j) => (
            <span key={j}>
              {j > 0 && <br />}
              <Inline text={line} />
            </span>
          ))}
        </p>
      ))}
    </div>
  )
}

export { Inline }
