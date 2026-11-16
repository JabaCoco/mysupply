import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'
import { initTheme } from './lib/theme.js'
import { seedDemoData } from './lib/progress.js'
import { ensureDaily } from './lib/dailyChallenge.js'

initTheme()
seedDemoData() // données de démo, une seule fois (voir progress.js)
ensureDaily() // attribue le défi du jour de l'Atelier si besoin

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
