import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'
import { initTheme } from './lib/theme.js'
import { ensureDaily } from './lib/dailyChallenge.js'

initTheme()
ensureDaily() // attribue le défi du jour de l'Atelier si besoin

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
