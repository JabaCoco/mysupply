import { Routes, Route, useLocation, matchPath } from 'react-router'
import BottomNav from './components/BottomNav.jsx'
import Page from './components/Page.jsx'
import Home from './pages/home/Home.jsx'
import Actu from './pages/actu/Actu.jsx'
import Cours from './pages/cours/Cours.jsx'
import Lesson from './pages/cours/Lesson.jsx'
import Atelier from './pages/atelier/Atelier.jsx'
import ExcelList from './pages/atelier/excel/ExcelList.jsx'
import ExcelChallenge from './pages/atelier/excel/ExcelChallenge.jsx'
import { CalculatorList, CalculatorPage } from './pages/atelier/calculs/CalculatorPages.jsx'
import { CaseList, CasePage } from './pages/atelier/cas/CasePages.jsx'
import Simulator from './pages/atelier/simulateur/Simulator.jsx'
import BeerGame from './pages/atelier/simulateur/BeerGame.jsx'
import Anglais from './pages/anglais/Anglais.jsx'
import EnglishLesson from './pages/anglais/EnglishLesson.jsx'
import Lexique from './pages/anglais/Lexique.jsx'
import { tabs } from './tabs.js'

// Onglets déjà construits ; les autres affichent une page provisoire
const BUILT = ['/', '/actu', '/cours', '/atelier', '/anglais']

export default function App() {
  const location = useLocation()
  // Pendant une leçon, on masque la barre du bas pour rester concentré
  const inLesson = matchPath('/cours/:moduleId/:lessonId', location.pathname) || matchPath('/anglais/:unitId/:lessonId', location.pathname)

  return (
    <div className="min-h-dvh">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/actu" element={<Actu />} />
        <Route path="/cours" element={<Cours />} />
        <Route path="/cours/:moduleId/:lessonId" element={<Lesson />} />
        <Route path="/atelier" element={<Atelier />} />
        <Route path="/atelier/excel" element={<ExcelList />} />
        <Route path="/atelier/excel/:id" element={<ExcelChallenge />} />
        <Route path="/atelier/calculs" element={<CalculatorList />} />
        <Route path="/atelier/calculs/:id" element={<CalculatorPage />} />
        <Route path="/atelier/cas" element={<CaseList />} />
        <Route path="/atelier/cas/:id" element={<CasePage />} />
        <Route path="/atelier/simulateur" element={<Simulator />} />
        <Route path="/atelier/simulateur/biere" element={<BeerGame />} />
        <Route path="/anglais" element={<Anglais />} />
        <Route path="/anglais/lexique" element={<Lexique />} />
        <Route path="/anglais/:unitId/:lessonId" element={<EnglishLesson />} />
        {tabs
          .filter(({ path }) => !BUILT.includes(path))
          .map(({ path, label }) => (
            <Route
              key={path}
              path={path}
              element={
                <Page title={label}>
                  <p className="text-muted">Cet onglet sera construit prochainement.</p>
                </Page>
              }
            />
          ))}
      </Routes>
      {!inLesson && <BottomNav />}
    </div>
  )
}
