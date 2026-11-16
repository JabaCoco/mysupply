// Thèmes de l'actu, et mots-clés qui permettent de les reconnaître dans un titre.
// highlight : thèmes affichés en badge sur les vidéos
export const THEMES = [
  { id: 'supply', label: 'Supply chain', badge: 'bg-emerald-500/15 text-emerald-400', solid: 'bg-emerald-500' },
  { id: 'eco', label: 'Économie', badge: 'bg-sky-500/15 text-sky-400', solid: 'bg-sky-500' },
  { id: 'ia', label: 'IA', badge: 'bg-fuchsia-500/15 text-fuchsia-400', solid: 'bg-fuchsia-500', highlight: true },
  { id: 'geo', label: 'Géopolitique', badge: 'bg-amber-500/15 text-amber-400', solid: 'bg-amber-500', highlight: true },
  { id: 'incident', label: 'Tech / Panne', badge: 'bg-red-500/15 text-red-400', solid: 'bg-red-500', highlight: true },
  { id: 'tech', label: 'Tech', badge: 'bg-violet-500/15 text-violet-400', solid: 'bg-violet-500' },
]

// Mots écrits sans accents et en minuscules ; "s?" = pluriel facultatif,
// "." = n'importe quel caractère (pour l'apostrophe de "d'achat", par exemple)
const SUPPLY = [
  'supply chains?', 'logistiques?', 'logistics?', 'fret', 'freight', 'ports?', 'portuaires?',
  'conteneurs?', 'porte-conteneurs', 'containers?', 'shipping', 'maritimes?', 'cargos?',
  'entrepots?', 'warehouses?', 'stocks?', 'inventaires?', 'penuries?', 'shortages?',
  'livraisons?', 'delivery', 'camions?', 'trucks?', 'trucking', 'routiers?', 'ferroviaires?',
  'rail', 'douanes?', 'suez', 'panama', 'approvisionnements?', 'chaines? d.approvisionnement',
  'e-commerce', 'amazon', 'dhl', 'fedex', 'maersk', 'cma cgm', 'transporteurs?', '3pl',
]

const ECO = [
  'economie', 'economiques?', 'economy', 'economic', 'inflation', 'prix', 'prices?',
  'croissance', 'growth', 'pib', 'gdp', 'bourses?', 'markets?', 'taux', 'banques?', 'banks?',
  'fed', 'bce', 'ecb', 'chomage', 'emplois?', 'jobs', 'entreprises?', 'companies',
  'tarifs?', 'tariffs?', 'droits de douane', 'commerce', 'trade', 'petrole', 'oil',
  'energie', 'energy', 'gaz', 'budget', 'dettes?', 'debt', 'impots?', 'taxes?', 'ipo', 'earnings',
  'salaires?', 'smic', 'pouvoir d.achat', 'recession', 'investissements?', 'investors?',
  'wall street', 'cac 40', 'dollars?', 'euros?', 'industrie', 'industriels?', 'usines?',
  'factory', 'factories', 'milliards?', 'billions?', 'faillites?', 'licenciements?',
  'layoffs?', 'consommation', 'consumers?', 'matieres premieres', 'commodit\\w+',
  'manufactur\\w*', 'industr\\w*',
]

const TECH = [
  'tesla', 'apple', 'microsoft', 'google', 'meta', 'robots?', 'robotique', 'humano\\w+',
  'semi-conducteurs?', 'semiconductors?', 'chips?', 'puces?', 'tech', 'technologies?',
  'startups?', 'numerique', 'cloud', 'innovations?', 'drones?', 'quanti\\w+', 'spacex', 'starship',
]

const IA = [
  'ia', 'intelligence artificielle', 'artificial intelligence', 'ia generative', 'genai',
  'openai', 'chatgpt', 'gpt-?\\d\\S*', 'anthropic', 'claude ai', 'gemini', 'deepmind',
  'mistral', 'nvidia', 'llms?', 'modeles? de langage', 'large language models?', 'agents? ia',
  'ai agents?', 'agentic', 'copilot', 'llama', 'grok', 'sora', 'perplexity', 'chatbots?',
  'machine learning', 'deep learning', 'apprentissage automatique', 'data ?centers?',
]

// Géopolitique : il faut un de ces mots…
const GEO = [
  'geopoliti\\w*', 'conflits?', 'guerres?', 'wars?', 'sanctions?', 'embargos?', 'blocus',
  'blockades?', 'mer rouge', 'red sea', 'houthis?', 'ormuz', 'hormuz', 'detroits?', 'straits?',
  'taiwan', 'tsmc', 'chine', 'china', 'chinese', 'chinois\\w*', 'russie', 'russia', 'ukraine',
  'iran', 'opep', 'opec', 'terres rares', 'rare earths?', 'matieres premieres', 'raw materials',
  'metaux critiques', 'critical minerals', 'lithium', 'cobalt', 'export controls?',
  'guerre commerciale', 'trade wars?', 'droits de douane', 'tariffs?', 'protectionnisme',
  'mer de chine', 'golfe persique', 'persian gulf',
]
// … ET un mot qui montre un impact sur l'économie ou la supply chain
const IMPACT = [
  'semi-conducteurs?', 'semiconductors?', 'puces?', 'chips?', 'energie', 'energy', 'petrole',
  'oil', 'gaz', 'gas', 'prix', 'prices?', 'penuries?', 'shortages?', 'approvisionnements?',
  'droits de douane', 'tariffs?', 'terres rares', 'rare earths?', 'matieres premieres',
]

// Pannes et incidents informatiques : un mot "cyber" suffit…
const CYBER = [
  'cyberattaques?', 'cyber-attaques?', 'cyberattacks?', 'cyber attacks?', 'ransomware\\w*',
  'rancongiciels?', 'piratages?', 'pirates? informatiques?', 'hack\\w*', 'fuites? de donnees',
  'data breach\\w*', 'malware', 'phishing', 'hameconnage', 'ddos', 'cybersecurite',
  'cybersecurity', 'cybercrim\\w*', 'faille\\w*', 'vulnerabilit\\w*', 'zero-day',
]
// … sinon il faut un mot de panne ET un système d'entreprise touché
const OUTAGE = [
  'pannes?', 'outages?', 'incidents?', 'bugs?', 'interruptions?', 'perturbations?',
  'dysfonctionnements?', 'failures?', 'crash\\w*', 'ground stop', 'blackout', 'coupures?',
]
const IT_SYSTEMS = [
  'microsoft 365', 'office 365', 'outlook', 'teams', 'azure', 'aws', 'amazon web services',
  'google cloud', 'cloud', 'cloudflare', 'crowdstrike', 'sap', 'erp', 'oracle', 'salesforce',
  'windows', 'serveurs?', 'servers?', 'systemes? informatiques?', 'it systems?', 'reseaux?',
  'networks?', 'internet', 'gmail', 'icloud', 'routers?', 'routeurs?', 'logiciels?', 'software',
  'aeroports?', 'airports?', 'airlines?', 'compagnies? aeriennes?', 'vols', 'flights?', 'faa',
  'electricite', 'informatiques?',
]

// Sujets à écarter : politique, faits divers…
const EXCLUDED = [
  'trump', 'biden', 'macron', 'elections?', 'electoral', 'electeurs?', 'voters?', 'vote',
  'candidat\\S*', 'candidates?', 'campagne electorale', 'campaign', 'gouvernement', 'government',
  'ministres?', 'ministers?', 'premier ministre', 'presidente?', 'presidential', 'parlement',
  'parliament', 'senat', 'senate', 'congress', 'deputes?', 'assemblee nationale', 'republicans?',
  'democrats?', 'midterms?', 'extreme droite', 'gauche', 'partis? politiques?', 'cabinet',
  'migrants?', 'immigration', 'guerre', 'war', 'gaza', 'israel', 'hamas', 'poutine', 'putin',
  'attentats?', 'proces', 'trial', 'police', 'meurtres?', 'murder',
]

// Promos commerciales : toujours écartées
const PROMOS = ['promos?', 'code promo', 'bons? plans?', 'soldes', 'deals?', 'reduction']

const toRegex = (words) => new RegExp(`\\b(${words.join('|')})\\b`)
const RX = {
  supply: toRegex(SUPPLY),
  eco: toRegex(ECO),
  tech: toRegex(TECH),
  ia: toRegex(IA),
  geo: toRegex(GEO),
  impact: toRegex(IMPACT),
  cyber: toRegex(CYBER),
  outage: toRegex(OUTAGE),
  itSystems: toRegex(IT_SYSTEMS),
  excluded: toRegex(EXCLUDED),
  promos: toRegex(PROMOS),
}

function normalize(text) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

// Renvoie la liste des thèmes détectés dans un texte, ex. ['supply', 'geo']
export function classify(text) {
  const t = normalize(text)
  const themes = new Set()
  if (RX.supply.test(t)) themes.add('supply')
  if (RX.eco.test(t)) themes.add('eco')
  if (RX.tech.test(t)) themes.add('tech')
  // "AI" en majuscules (anglais) : testé à part pour ne pas confondre avec "j'ai"
  if (RX.ia.test(t) || /\bAI\b/.test(text)) themes.add('ia')
  if (RX.geo.test(t) && (RX.impact.test(t) || themes.has('supply') || themes.has('eco'))) themes.add('geo')
  if (RX.cyber.test(t) || (RX.outage.test(t) && (RX.itSystems.test(t) || themes.has('supply')))) {
    themes.add('incident')
  }
  return [...themes]
}

// Vrai si le texte parle de politique ou de faits divers
export function isExcluded(text) {
  return RX.excluded.test(normalize(text))
}

// Vrai si le texte est une promo commerciale
export function isPromo(text) {
  return RX.promos.test(normalize(text))
}
