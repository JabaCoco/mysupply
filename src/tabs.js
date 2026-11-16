import { House, Newspaper, BookOpen, Wrench, Languages, Brain } from 'lucide-react'

// Liste des 6 onglets : chemin, nom affiché et icône
export const tabs = [
  { path: '/', label: 'Accueil', icon: House },
  { path: '/actu', label: 'Actu', icon: Newspaper },
  { path: '/cours', label: 'Cours', icon: BookOpen },
  { path: '/atelier', label: 'Atelier', icon: Wrench },
  { path: '/anglais', label: 'Anglais', icon: Languages },
  { path: '/revisions', label: 'Révisions', icon: Brain },
]
