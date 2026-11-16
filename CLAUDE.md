# Appli Supply Chain

Appli PWA d'apprentissage de la supply chain pour un étudiant (niveau BTS / Licence / Master) : actu, cours, pratique, anglais, révisions.

## Consignes de travail

- Réponds toujours en français.
- L'utilisateur débute en code : explique chaque étape simplement et donne les commandes exactes à lancer.
- Avance un onglet à la fois et attends sa validation avant de passer au suivant.
- Aucune API payante, aucune dépendance à Claude dans l'appli.
- Avant de livrer : `npm run build` + `npm run lint`, et si possible un test de bout en bout dans Edge (playwright-core installé dans le dossier temporaire de session, pas dans le projet).
- **Prochaine étape : onglet Révisions** (après validation de l'onglet Anglais par l'utilisateur).

## Choix techniques

- Stack : React 19 + Vite 8 + Tailwind CSS 4, PWA (vite-plugin-pwa), React Router 8, Motion, Lucide, Dexie (IndexedDB) + dexie-react-hooks, canvas-confetti.
- Lancer : `npm run dev` → http://localhost:5173
- **Windows ne distingue pas les majuscules dans les noms de fichiers** : ne jamais créer deux fichiers qui ne diffèrent que par la casse (ex. `Calculators.jsx` / `calculators.jsx`).
- **Relais RSS / YouTube** (`vite.config.js`, `server.proxy` + `preview.proxy`) : les flux sans CORS passent par `/rss/<nom>` et `/rss/yt/<channelId>`, avec `followRedirects`. Ne marche qu'en `dev`/`preview` : **à recréer chez l'hébergeur** lors de la mise en ligne.
- Base locale Dexie (`src/db.js`), versions 1 à 5 : `activity` (XP par jour), `feeds` (cache des flux), `meta` (réglages, `lastLesson`, `lastEnLesson`, `daily`, `englishDaily`, `demoSeeded`), `seen` (vidéos vues), `lessons` (progression des cours), `workshop` (Atelier : `excel/<id>`, `calc/<id>`, `cas/<id>`, `simulateur`), `english` (`lesson/<unité>/<leçon>` et `word/<mot>` avec statut `seen` / `known` / `review`).
- Voix (`src/lib/speech.js`) : synthèse vocale et reconnaissance vocale du navigateur, gratuites (reconnaissance : Chrome/Edge/Safari, pas Firefox ; a besoin d'Internet). Toujours prévoir le secours « Passer l'exercice ».
- XP et objectif : `src/lib/progress.js` (objectif 50 XP/jour, série = jours d'affilée avec l'objectif atteint, niveau = 100 XP).
- **Données de démo** (5 jours de série + 30 XP) ajoutées une seule fois au démarrage (`seedDemoData` dans `main.jsx`), sans écraser de vraies données. Bouton « +10 XP (test) » visible seulement en dev. À retirer avant la mise en ligne.
- Contenus provisoires restants dans `src/data/daily.js` → `placeholders` : « À réviser aujourd'hui : 8 cartes » et « Badges 4/30 » (à brancher avec Révisions).

## Design

- Thème sombre par défaut, thème clair via le bouton lune/soleil (couleurs en variables CSS dans `src/index.css` : `bg`, `card`, `line`, `fg`, `muted`).
- Accent violet, cartes arrondies (`rounded-3xl`), bordures fines, police système, mobile d'abord (`max-w-xl` centré).
- 6 onglets en bas (Accueil, Actu, Cours, Atelier, Anglais, Révisions), masqués pendant une leçon.
- Animations Motion (apparitions, barres de progression, flamme qui vacille), confettis aux réussites.
- Graphiques : une seule série, pas de double axe, grille discrète, alertes jamais par la couleur seule (icône + libellé).

## Ce qui est fait

### Accueil (`src/pages/home/`)
- Maquette validée : date + « Bonjour ! », flamme de série animée, bouton thème.
- Flash info qui défile (8 derniers titres d'articles, 12 s par titre).
- Carte « Ton café du matin » : vrais shorts des 48 dernières heures, nombre vus + barre.
- Objectif du jour (anneau + barre, confettis à 50 XP), calendrier de la semaine façon Duolingo.
- « Reprendre » : prochaine leçon réelle. Grille : défi du jour (type tournant), mot anglais du jour, révisions et badges (provisoires).
- Chiffre du jour, Article du jour (Supply Chain Magazine, secours sur d'autres flux).

### Actu (`src/pages/actu/`, `src/lib/news.js`, `src/data/sources.js`, `src/lib/themes.js`)
- Deux onglets : **Vidéos** (grille de shorts de la semaine) et **Articles** de presse.
- Filtres : Tout, Supply chain, Économie, IA, Géopolitique, Tech / Panne, Tech. Badges « IA », « Géopolitique », « Tech / Panne » et « EN » sur les vignettes.
- Tri par mots-clés sur le titre seul : géopolitique seulement si impact éco/supply ; pannes = cyber, ou panne + système d'entreprise ; politique pure et promos écartées.
- ~35 chaînes YouTube (français en priorité) et 14 sites de presse. Géopolitis et Zeihan en vidéos longues (badge « Format long »).
- Lecteur intégré via l'API IFrame YouTube : vidéos EN avec sous-titres forcés en français (traduction auto) ; si la vidéo refuse l'intégration → bouton « Regarder sur YouTube ».
- +5 XP par vidéo vue la première fois. Cache hors ligne, 2e tentative automatique si YouTube répond 404/500.

### Cours (`src/pages/cours/`, contenu dans `src/data/courses/`)
- 8 modules, 19 leçons : Bases, Transport (modes, Incoterms, 3PL), Stocks (ABC, stock de sécurité, Wilson), Entrepôt, Achats, Prévision, KPI, Outils (ERP/WMS/TMS, Lean, IA).
- Format Duolingo : 5 à 7 cartes (balayage ou bouton) puis quiz de 4 questions (réponses mélangées, explication à chaque fois), écran de fin.
- XP : 10 + 5 par bonne réponse la 1re fois, 5 en refaisant. Mode d'emploi pour ajouter une leçon en haut de `src/data/courses/index.js`.

### Atelier (`src/pages/atelier/`, données dans `src/data/atelier/`)
- **Défi du jour tournant** (`src/lib/dailyChallenge.js`) : Excel → exercices de calcul (3 à réussir) → étude de cas → simulateur. Il reste le même tant qu'il n'est pas terminé, et change le lendemain d'une réussite.
- **Défis Excel** (13) : mini-tableur avec un vrai moteur de formules françaises (`src/lib/excel/`), cellules cliquables, touches rapides, indices puis solution, fonction imposée.
- **Formules et calculs** (7 : stock de sécurité/PC, Wilson, ABC, rotation/couverture, OTIF, TCO, Incoterms), chacune avec 3 onglets :
  - Cours : à quoi ça sert, formule, termes, exemple corrigé.
  - Exercices : chiffres aléatoires, correction immédiate pas à pas, bouton « Indice / Rappel de la formule » sans la réponse, +5 XP.
  - Calculateur : outil libre.
- **Études de cas** (4) : 3 décisions chacune, choix mélangés. Si la décision n'est pas la meilleure → « La réponse attendue » + « Pourquoi c'est mieux » chiffré.
- **Simulateur de stock** : nouveau scénario aléatoire à chaque partie (produit, demande, écart-type, délai 1 à 3 semaines, stock de départ, coûts), vérifié pour que la méthode du cours batte la stratégie naïve.
  - Avant la partie : rappel de cours détaillé.
  - Pendant la partie : 4 cases (En stock, En commande avec semaines d'arrivée, Stock fin de semaine, Stock prévu semaine prochaine), bulles d'aide ⓘ, orange sous le stock de sécurité, rouge à 0. Bouton « Revoir la situation » (fenêtre sans perte de progression) et graphique.
  - À la fin : comparaison avec la méthode du cours (point de commande + Wilson) ; record = meilleur écart en %.

### Anglais (`src/pages/anglais/`, contenu dans `src/data/anglais/units.js`)
- 7 unités, 12 leçons, 54 mots + 15 phrases. Difficulté progressive : mots (niveau 1) → mots en contexte (2) → phrases et mails (3, unité « Communiquer au travail »). Unité « Faux amis » avec notes.
- **Mots du jour** : 3 cartes par jour (mots jamais vus), boutons « Je connais » / « À revoir » (+2 XP). Le 1er mot alimente la tuile « Word of the day » de l'accueil.
- Leçon : cartes de découverte (lues à voix haute), puis ~10 exercices générés (`src/lib/englishExercises.js`) : paires, QCM dans les deux sens, écoute, phrase à trous, remettre dans l'ordre, mot à taper (1 faute tolérée), **prononciation au micro** (correction souple ; si raté → réécouter + réessayer ; « passer » si micro indisponible, non compté).
- Barre de correction en bas façon Duolingo. XP : 10 + 2 par bonne réponse la 1re fois, 5 en refaisant.
- **Mon lexique** : mots rencontrés, recherche, filtres Tous / À revoir / Connus.
- L'anglais fait partie de la rotation du défi du jour (Excel → calcul → cas → simulateur → anglais).

## Ce qu'il reste à faire

1. **Onglet Révisions** : cartes de révision (répétition espacée) avec un **format d'import des fiches** à définir avec l'utilisateur (ex. CSV ou JSON : recto, verso, thème). Brancher ensuite la tuile « À réviser aujourd'hui » et les badges de l'accueil (`placeholders`). Les mots d'anglais « À revoir » pourront y devenir des fiches.
2. **Dernières modifs** :
   - Version responsive PC et téléphone (aujourd'hui pensée mobile, `max-w-xl`).
   - Peut-être des pseudos pour partager l'appli avec la classe (sans API payante : à étudier).
   - Mise en ligne : recréer les relais RSS/YouTube chez l'hébergeur, retirer les données de démo et le bouton de test XP.
