// Toutes les sources d'actu de l'appli.
// - kind : 'article' (flux RSS d'un site) ou 'video' (chaîne YouTube : seuls les shorts sont gardés)
// - theme : thème donné d'office à tout ce que publie la source.
//   null = source variée : on ne garde que ce qui parle de supply chain, d'éco ou de tech.
// - lang : 'fr' ou 'en' (en anglais : badge "EN" et sous-titres français dans le lecteur)
// Les adresses rss/… passent par le relais de vite.config.js en développement, et par des fichiers
// téléchargés à l'avance (scripts/fetch-feeds.mjs) une fois l'appli en ligne.

// Adresse de base de l'appli (« / » en local, « /<depot>/ » sur GitHub Pages).
// En Node (script fetch-feeds), import.meta.env n'existe pas : d'où le « ?. ».
const RSS = (import.meta.env?.BASE_URL ?? '/') + 'rss/'
const youtube = (channelId) => `${RSS}yt/${channelId}`

export const SOURCES = [
  // ---------- Articles de presse ----------
  // Supply chain
  { id: 'scm', name: 'Supply Chain Magazine', kind: 'article', url: RSS + 'scm', theme: 'supply', lang: 'fr' },
  { id: 'wk', name: 'WK Transport Logistique', kind: 'article', url: RSS + 'wk', theme: 'supply', lang: 'fr' },
  // Ces deux-là autorisent la lecture directe, sans relais
  { id: 'freightwaves', name: 'FreightWaves', kind: 'article', url: 'https://www.freightwaves.com/news/feed', theme: 'supply', lang: 'en' },
  { id: 'scdive', name: 'Supply Chain Dive', kind: 'article', url: 'https://www.supplychaindive.com/feeds/news/', theme: 'supply', lang: 'en' },
  // Économie
  { id: 'lemonde-eco', name: 'Le Monde Économie', kind: 'article', url: RSS + 'lemonde-eco', theme: 'eco', lang: 'fr' },
  { id: 'bfm-eco', name: 'BFM Éco', kind: 'article', url: RSS + 'bfm-eco', theme: 'eco', lang: 'fr' },
  { id: 'latribune', name: 'La Tribune', kind: 'article', url: RSS + 'latribune', theme: null, lang: 'fr' },
  // Tech et innovation
  { id: 'maddyness', name: 'Maddyness', kind: 'article', url: RSS + 'maddyness', theme: 'tech', lang: 'fr' },
  { id: 'siecledigital', name: 'Siècle Digital', kind: 'article', url: RSS + 'siecledigital', theme: 'tech', lang: 'fr' },
  { id: 'jdn', name: 'Journal du Net', kind: 'article', url: RSS + 'jdn', theme: null, lang: 'fr' },
  // IA, informatique et pannes / cybersécurité
  { id: 'actuia', name: 'ActuIA', kind: 'article', url: RSS + 'actuia', theme: 'ia', lang: 'fr' },
  { id: 'zdnet', name: 'ZDNet France', kind: 'article', url: 'https://www.zdnet.fr/feeds/rss/actualites/', theme: null, lang: 'fr' },
  { id: 'lmi', name: 'Le Monde Informatique', kind: 'article', url: RSS + 'lmi', theme: null, lang: 'fr' },
  { id: 'zataz', name: 'Zataz', kind: 'article', url: RSS + 'zataz', theme: null, lang: 'fr' },

  // ---------- Shorts YouTube ----------
  // En français
  { id: 'yt-lesechos', name: 'Les Echos', kind: 'video', url: youtube('UChZWs6PJY0hND384d2_RrhQ'), theme: null, lang: 'fr' },
  { id: 'yt-bfmbusiness', name: 'BFM Business', kind: 'video', url: youtube('UCUsBMOIUl_ad6JUOC16DpmQ'), theme: 'eco', lang: 'fr' },
  { id: 'yt-stupideco', name: 'Stupid Economics', kind: 'video', url: youtube('UCyJDHgrsUKuWLe05GvC2lng'), theme: 'eco', lang: 'fr' },
  { id: 'yt-finary', name: 'Finary', kind: 'video', url: youtube('UCRCCAnVyzDTcqNYh0pDcq7Q'), theme: 'eco', lang: 'fr' },
  { id: 'yt-frandroid', name: 'Frandroid', kind: 'video', url: youtube('UCgoxc-VKU0cw9BcM9z_qokg'), theme: 'tech', lang: 'fr' },
  { id: 'yt-numerama', name: 'Numerama', kind: 'video', url: youtube('UCAz-755tH3m8_BwaluzdJwQ'), theme: null, lang: 'fr' },
  { id: 'yt-01net', name: '01net', kind: 'video', url: youtube('UC6joDErOGcFJC1vHNSfsYQg'), theme: null, lang: 'fr' },
  // IA (en français)
  { id: 'yt-defendintel', name: 'Defend Intelligence', kind: 'video', url: youtube('UCnEHCrot2HkySxMTmDPhZyg'), theme: 'ia', lang: 'fr' },
  { id: 'yt-ludosalenne', name: 'Ludo Salenne', kind: 'video', url: youtube('UCnnYqSNKKygemgmxC9PyLTw'), theme: 'ia', lang: 'fr' },
  // Géopolitique : ces chaînes ne font pas de shorts, on accepte leurs vidéos longues
  { id: 'yt-geopolitis', name: 'Géopolitis', kind: 'video', url: youtube('UC8jSdiTfai1PFwjQ9MrkkBg'), theme: null, lang: 'fr', longVideos: true },
  { id: 'yt-zeihan', name: 'Zeihan on Geopolitics', kind: 'video', url: youtube('UCsy9I56PY3IngCf_VGjunMQ'), theme: null, lang: 'en', longVideos: true },
  // Supply chain (en anglais)
  { id: 'yt-scsecrets', name: 'Supply Chain Secrets', kind: 'video', url: youtube('UClRh--VCfs3fa0NaoiSIVvg'), theme: 'supply', lang: 'en' },
  { id: 'yt-scmdojo', name: 'SCMDOJO', kind: 'video', url: youtube('UC5tLe6Z3XN3DkvsBPjrE4AQ'), theme: 'supply', lang: 'en' },
  { id: 'yt-flexport', name: 'Flexport', kind: 'video', url: youtube('UCWT4cbEDHlCE9mMfjRJRX4w'), theme: 'supply', lang: 'en' },
  { id: 'yt-lokad', name: 'Lokad', kind: 'video', url: youtube('UC5r43_A7T7qXAty-uvNuJ5Q'), theme: 'supply', lang: 'en' },
  { id: 'yt-b1m', name: 'The B1M', kind: 'video', url: youtube('UC6n8I1UDTKP1IWjQMg6_TwA'), theme: null, lang: 'en' },
  // Économie et tech (en anglais)
  { id: 'yt-bloomberg', name: 'Bloomberg Originals', kind: 'video', url: youtube('UCUMZ7gohGI9HcU9VNsr2FJQ'), theme: 'eco', lang: 'en' },
  { id: 'yt-yahoofinance', name: 'Yahoo Finance', kind: 'video', url: youtube('UCEAZeUIeJs0IjQiqTCdVSIg'), theme: 'eco', lang: 'en' },
  { id: 'yt-wsj', name: 'The Wall Street Journal', kind: 'video', url: youtube('UCK7tptUDHh-RYDsdxO1-5QQ'), theme: null, lang: 'en' },
  { id: 'yt-ft', name: 'Financial Times', kind: 'video', url: youtube('UCoUxsWakJucWg46KW5RsvPw'), theme: null, lang: 'en' },
  { id: 'yt-cnbc', name: 'CNBC', kind: 'video', url: youtube('UCvJJ_dzjViJCoLf5uKUTwoA'), theme: null, lang: 'en' },
  { id: 'yt-insider', name: 'Business Insider', kind: 'video', url: youtube('UCcyq283he07B7_KUX07mmtA'), theme: null, lang: 'en' },
  { id: 'yt-verge', name: 'The Verge', kind: 'video', url: youtube('UCddiUEpeqJcYeBxX1IVBKvQ'), theme: 'tech', lang: 'en' },
  { id: 'yt-mrwhosetheboss', name: 'Mrwhosetheboss', kind: 'video', url: youtube('UCMiJRAwDNSNzuYeN2uWa0pA'), theme: 'tech', lang: 'en' },
  { id: 'yt-reuters', name: 'Reuters', kind: 'video', url: youtube('UChqUTb7kYRX8-EiaN3XFrSQ'), theme: null, lang: 'en' },
  { id: 'yt-cybernews', name: 'Cybernews', kind: 'video', url: youtube('UCCsREoj8rSRkEvxWqxr74rQ'), theme: null, lang: 'en' },
  // IA (en anglais)
  { id: 'yt-mattwolfe', name: 'Matt Wolfe', kind: 'video', url: youtube('UChpleBmo18P08aKCIgti38g'), theme: 'ia', lang: 'en' },
  { id: 'yt-openai', name: 'OpenAI', kind: 'video', url: youtube('UCXZCJLdBC09xxGZ6gcdrc6A'), theme: 'ia', lang: 'en' },
  { id: 'yt-anthropic', name: 'Anthropic', kind: 'video', url: youtube('UCrDwWp7EBBv4NwvScIpBDOA'), theme: 'ia', lang: 'en' },
  { id: 'yt-deepmind', name: 'Google DeepMind', kind: 'video', url: youtube('UCP7jMXSY2xbc3KCAE0MHQ-A'), theme: 'ia', lang: 'en' },
  { id: 'yt-nvidia', name: 'NVIDIA', kind: 'video', url: youtube('UCHuiy8bXnmK5nisYHUd1J5g'), theme: 'ia', lang: 'en' },
]
