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
import TruckLoading from './pages/atelier/chargement/TruckLoading.jsx'
import Negotiation from './pages/atelier/negociation/Negotiation.jsx'
import DeliveryTour from './pages/atelier/tournee/DeliveryTour.jsx'
import Revisions from './pages/revisions/Revisions.jsx'
import ImportPage from './pages/revisions/ImportPage.jsx'
import LotPage from './pages/revisions/LotPage.jsx'
import Fiches from './pages/revisions/Fiches.jsx'
import Study from './pages/revisions/Study.jsx'
import Exercise, { ExerciseList } from './pages/revisions/Exercise.jsx'
import Backup from './pages/revisions/Backup.jsx'
import Anglais from './pages/anglais/Anglais.jsx'
import EnglishLesson from './pages/anglais/EnglishLesson.jsx'
import Lexique from './pages/anglais/Lexique.jsx'
import { tabs } from './tabs.js'

// Onglets déjà construits ; les autres affichent une page provisoire
const BUILT = ['/', '/actu', '/cours', '/atelier', '/anglais', '/revisions']

export default function App() {
  const location = useLocation()
  // Pendant une leçon, on masque la barre du bas pour rester concentré
  const inLesson = matchPath('/cours/:moduleId/:lessonId', location.pathname) || matchPath('/anglais/:unitId/:lessonId', location.pathname) || matchPath('/revisions/etude/:scope/:mode', location.pathname) || matchPath('/revisions/exercice/:lotId/:itemId', location.pathname)

  return (
    // Avec la navigation latérale (tablette / PC / paysage), le contenu est décalé de sa largeur ; les marges « encoche » servent au téléphone couché
    <div className={`min-h-dvh pr-[env(safe-area-inset-right)] ${inLesson ? 'pl-[env(safe-area-inset-left)]' : 'rail:max-lg:pl-[calc(6rem+env(safe-area-inset-left))] lg:pl-60'}`}>
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
        <Route path="/atelier/biere" element={<BeerGame />} />
        <Route path="/atelier/chargement" element={<TruckLoading />} />
        <Route path="/atelier/negociation" element={<Negotiation />} />
        <Route path="/atelier/tournee" element={<DeliveryTour />} />
        <Route path="/revisions" element={<Revisions />} />
        <Route path="/revisions/importer" element={<ImportPage />} />
        <Route path="/revisions/sauvegarde" element={<Backup />} />
        <Route path="/revisions/lot/:id" element={<LotPage />} />
        <Route path="/revisions/lot/:id/fiches" element={<Fiches />} />
        <Route path="/revisions/lot/:id/exercices" element={<ExerciseList />} />
        <Route path="/revisions/etude/:scope/:mode" element={<Study />} />
        <Route path="/revisions/exercice/:lotId/:itemId" element={<Exercise />} />
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
