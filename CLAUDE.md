# Appli Supply Chain

Appli PWA d'apprentissage de la supply chain pour un étudiant (niveau BTS / Licence / Master) : actu, cours, pratique, anglais, révisions.

## Consignes de travail

- Réponds toujours en français.
- L'utilisateur débute en code : explique chaque étape simplement et donne les commandes exactes à lancer.
- Avance un onglet à la fois et attends sa validation avant de passer au suivant.
- Aucune API payante, aucune dépendance à Claude dans l'appli.
- Avant de livrer : `npm run build` + `npm run lint`, et si possible un test de bout en bout dans Edge (playwright-core installé dans le dossier temporaire de session, pas dans le projet).
- **Étape en cours : tout le contenu est fait** : les 16 lots (Cours, Atelier, Anglais), les ateliers (jeu de la bière, plan de chargement, négociation, tournée), le module **Power Query & Power BI** de l'Atelier (ajouté le 2026-11-19 : 12 leçons, simulateur, constructeur de tableau de bord, 27 questions d'entretien ; à valider par l'utilisateur), l'onglet Révisions (flashcards en « Recto d'abord » par défaut, réglage « Dans les deux sens »), l'onglet Anglais, et le logo/icônes PWA (nom MySupply). Responsive PC / tablette / téléphone : **fait** (à valider par l'utilisateur). Reste, dans cet ordre : 2) mise en ligne gratuite + installation iPhone, 3) comptes avec pseudo et synchronisation via Supabase (voir « Ce qu'il reste à faire »).
- **Git** : dépôt local initialisé (branche `main`), un point de sauvegarde après chaque lot validé (`git add -A` puis `git commit`). Une archive ZIP d'avant les lots et une copie de l'historique d'avant anonymisation (`avant-anonymisation.bundle`) sont dans le dossier `sauvegardes`, à côté du dossier du projet (hors dépôt : ne jamais les publier).

## Choix techniques

- Stack : React 19 + Vite 8 + Tailwind CSS 4, PWA (vite-plugin-pwa), React Router 8, Motion, Lucide, Dexie (IndexedDB) + dexie-react-hooks, canvas-confetti.
- Lancer : `npm run dev` → http://localhost:5173
- **Windows ne distingue pas les majuscules dans les noms de fichiers** : ne jamais créer deux fichiers qui ne diffèrent que par la casse (ex. `Calculators.jsx` / `calculators.jsx`).
- **Relais RSS / YouTube** : les flux sans CORS sont lus via `rss/<nom>` et `rss/yt/<channelId>` (adresses construites avec `import.meta.env.BASE_URL` dans `src/data/sources.js`). **En développement** (`npm run dev` / `preview`) : relais de `vite.config.js` (`server.proxy` + `preview.proxy`). **En ligne** (GitHub Pages, hébergement statique, pas de relais) : `scripts/fetch-feeds.mjs` télécharge les 42 flux dans `public/rss/` (ignoré par Git) juste avant le build, toutes les 2 h par le workflow. La liste des flux des sites de presse est dans `feeds.config.mjs` (partagée par les deux). Pour ajouter un site de presse sans CORS : l'ajouter dans `feeds.config.mjs` ET dans `src/data/sources.js` (`url: RSS + '<nom>'`).
- **Mise en ligne (GitHub Pages)** : `.github/workflows/deploy.yml` (au `git push` sur `main`, toutes les 2 h, ou à la main), **2 jobs** depuis le 2026-11-19 : `build` (`npm ci` → `npm run verify` → flux → `npm run build` avec `VITE_BASE=/<nom-du-dépôt>/` → copie de `index.html` en `404.html` → colis `github-pages`) puis `deploy` (`needs: build`, publication). `concurrency` avec **`cancel-in-progress: false`** (une publication commencée n'est jamais annulée : une annulation entre colis et publication peut donner « No artifacts named github-pages »). En ligne : https://jabacoco.github.io/mysupply/. Limite connue : GitHub désactive les exécutions planifiées (toutes les 2 h) d'un dépôt public sans aucune activité pendant 60 jours (les relancer dans l'onglet Actions). L'appli vit donc dans un sous-dossier : ne jamais écrire de chemin absolu `/…` (utiliser `import.meta.env.BASE_URL`, `Link`/`NavLink` de React Router, qui gèrent le `basename`). Pour tester un build « comme en ligne » : dans PowerShell `$env:VITE_BASE='/mysupply/'; npm run build; npm run preview` puis http://localhost:4173/mysupply/ (⚠ pas dans Git Bash : il transforme `/mysupply/` en chemin Windows). Dépôt public (Pages gratuit) : aucun secret, aucun cours, identité Git anonymisée (`MySupply`, adresse `.invalid`) ; **les données de l'utilisateur ne sont jamais dans le dépôt** (IndexedDB de son navigateur). L'adresse en ligne est une autre « origine » que `localhost` : la progression locale ne s'y retrouve pas toute seule (export / import de sauvegarde, puis comptes).
- Base locale Dexie (`src/db.js`), versions 1 à 6 : `activity` (XP par jour), `feeds` (cache des flux), `meta` (réglages, `lastLesson`, `lastEnLesson`, `daily`, `englishDaily`, `demoSeeded`), `seen` (vidéos vues), `lessons` (progression des cours), `workshop` (Atelier : `excel/<id>`, `calc/<id>`, `cas/<id>`, `simulateur`, `bi/<id>` et `bi/ent/<id>` pour Power Query / Power BI), `english` (`lesson/<unité>/<leçon>` et `word/<mot>` avec statut `seen` / `known` / `review`), `rvLots` (lots de révision importés, avec leurs contenus) et `rvProgress` (progression de chaque carte, répétition espacée).
- Voix (`src/lib/speech.js`) : synthèse vocale et reconnaissance vocale du navigateur, gratuites (reconnaissance : Chrome/Edge/Safari, pas Firefox ; a besoin d'Internet). Toujours prévoir le secours « Passer l'exercice ».
- XP et objectif : `src/lib/progress.js` (objectif 50 XP/jour, série = jours d'affilée avec l'objectif atteint, niveau = 100 XP).
- **Données de démo : retirées** (plus de `seedDemoData`). Le bouton « +10 XP (test) » n'existe qu'en développement (`import.meta.env.DEV`), il n'est pas dans la version en ligne. Une base locale ancienne peut encore contenir les faux XP de démo (5 jours de série + 30 XP) : ils seraient envoyés avec le reste si on migre la progression locale.
- Contenus provisoires restants dans `src/data/daily.js` → `placeholders` : « À réviser aujourd'hui : 8 cartes » et « Badges 4/30 » (à brancher avec Révisions).

## Nom et icônes
- L'appli s'appelle **MySupply** (manifeste, `<title>`, `apple-mobile-web-app-title`). **Logo remplacé le 2026-11-20** (2 essais précédents écartés par l'utilisateur) = `public/icon.svg` : **vectorisation (potrace JavaScript, installé hors projet) du logo de la grande icône iOS d'une image fournie par l'utilisateur** (« MySupply - App Icon Proposal », proposition 2) : M noir + S noir en calligraphie, ruban orange, petit colis gris avec flèche ; sur **fond blanc**, sans ombre ni coins arrondis. **Ne jamais le redessiner de mémoire.** Couleurs relevées dans l'image (médiane des pixels) : noir `#0E0E0E`, orange `#CF6A47` (≠ ancien `#D97757`), gris `#B7B9BC`. Source basse définition (≈ 440 × 300 px) : bords un peu doux mais formes nettes après vectorisation. `public/icon-small.svg` = **version sans colis** (illisible en petit), utilisée pour l'onglet du navigateur (`index.html`) et les favicons.
- Les PNG sont générés depuis ces SVG par une capture Edge (playwright, hors projet, dossier temporaire de session `logo/`, scripts `crop.mjs`, `seg.mjs`, `gen2.mjs`), sur fond blanc, **sauf les icônes « any »** (`pwa-192/512` et `icon.svg`, utilisées par Windows / navigateurs, **décision du 2026-11-20**) : **fond transparent**, logo ≈ 90 % de la largeur, avec colis, **fin liseré blanc de 4 px** autour du logo (sinon M et S noirs disparaissent sur la barre des tâches sombre ; script `gen3.mjs`). **L'icône iPhone (180) est validée par l'utilisateur : ne plus y toucher**, de même que les maskable (fond blanc) ; `pwa-maskable-192/512` et `apple-touch-icon` 180 (logo entier **dans un cercle de 80 % du diamètre**, mesuré sur les pixels, avec colis) ; `favicon-16/32/48` et `favicon.ico` (**sans colis**). Si le logo change, demander à Claude de les régénérer.

## Design

- Thème sombre par défaut, thème clair via le bouton lune/soleil (couleurs en variables CSS dans `src/index.css` : `bg`, `card`, `line`, `fg`, `muted`).
- Accent violet, cartes arrondies (`rounded-3xl`), bordures fines, police système, mobile d'abord.
- **Responsive** (fait, 2 passes) : téléphone vertical = barre du bas + colonne `max-w-xl` (inchangé). Dès 768 px de large ou téléphone en paysage (variantes Tailwind `rail:` / `short:` de `src/index.css`) = navigation à gauche (`BottomNav.jsx`, logo + nom MySupply dès 1024 px). Les **6 onglets** utilisent `<Page full>` : **pas de largeur maximale**, grilles à plusieurs colonnes (Accueil 2/3/4, Actu jusqu'à 8, Atelier avec défi du jour 2×2, Anglais, Révisions en 2 colonnes) ; **Cours** = liste des modules à gauche + leçons du module à droite dès 1024 px (`useMedia`, `src/lib/useMedia.js`). Les écrans de détail (jeux, leçons, exercices, formulaires) gardent `<Page>` sans `full` : colonne centrée de lecture. Lecteur vidéo (`VideoPlayer.jsx`) : dès 1024 px, infos à gauche / vidéo pleine hauteur au centre / « À suivre » à droite ; en paysage téléphone, panneau à droite. Nouvelle page principale : `Page full` + grille, pas de `max-w-*` en dur. Piège : une grille à une colonne doit avoir `grid-cols-1`, sinon une carte large élargit la colonne et déborde sur téléphone.
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
- **16 modules, 94 leçons** (Bases, Transport, Stocks, Entrepôt, Achats, Prévision, Production, Distribution et e-commerce, KPI, Douane et international, Outils et SI, Lean, Supply chain durable, Risques et résilience, Finance, Stratégie et innovation). Chaque leçon a une banque de 8 à 10 questions dont 5 sont tirées au hasard à chaque passage (une partie à chiffres aléatoires via `numQuestion` de `src/data/gen.js`).
- Format Duolingo : 5 à 7 cartes (balayage ou bouton) puis quiz de 4 questions (réponses mélangées, explication à chaque fois), écran de fin.
- XP : 10 + 5 par bonne réponse la 1re fois, 5 en refaisant. Mode d'emploi pour ajouter une leçon en haut de `src/data/courses/index.js`.

### Atelier (`src/pages/atelier/`, données dans `src/data/atelier/`)
- **Défi du jour tournant** (`src/lib/dailyChallenge.js`) : Excel → exercices de calcul (3 à réussir) → étude de cas → simulateur → anglais → Power Query / Power BI (une leçon = 3 bonnes réponses ; un scénario du simulateur ou un tableau de bord = 1 réussite). Il reste le même tant qu'il n'est pas terminé, et change le lendemain d'une réussite.
- **Défis Excel** (65, dont 52 à données aléatoires, classés en 6 niveaux par `tier`) : mini-tableur avec un vrai moteur de formules françaises (`src/lib/excel/`), cellules cliquables, touches rapides, indices puis solution, fonction imposée.
- **Formules et calculs** (35, une par notion de calcul), chacune avec 3 onglets :
  - Cours : à quoi ça sert, formule, termes, exemple corrigé.
  - Exercices : chiffres aléatoires, correction immédiate pas à pas, bouton « Indice / Rappel de la formule » sans la réponse, +5 XP.
  - Calculateur : outil libre.
- **Études de cas** (35, dont 21 à chiffres aléatoires) : 3 décisions chacune, choix mélangés. Si la décision n'est pas la meilleure → « La réponse attendue » + « Pourquoi c'est mieux » chiffré.
- **Simulateur de stock** : nouveau scénario aléatoire à chaque partie (produit, demande, écart-type, délai 1 à 3 semaines, stock de départ, coûts), vérifié pour que la méthode du cours batte la stratégie naïve.
  - Avant la partie : rappel de cours détaillé.
  - Pendant la partie : 4 cases (En stock, En commande avec semaines d'arrivée, Stock fin de semaine, Stock prévu semaine prochaine), bulles d'aide ⓘ, orange sous le stock de sécurité, rouge à 0. Bouton « Revoir la situation » (fenêtre sans perte de progression) et graphique.
  - **4 profils de demande** (stable, saisonnière, en tendance, avec promotions) : choisis sur l'écran d'accueil du simulateur ou tirés au hasard ; la demande prévue de chaque semaine est affichée et le point de commande de la méthode du cours la suit (`src/lib/simulation.js`, `PROFILES`).
  - **Jeu de la bière** (`/atelier/biere`, `src/lib/beerGame.js`, `BeerGame.jsx`, `BeerChart.jsx`) : chaîne de 4 maillons, le joueur est le grossiste, 20 semaines, 5 profils de demande des clients ; résultats : graphique des commandes par maillon, amplification (effet coup de fouet), comparaison avec une chaîne qui partage l'information. Record : `biere` dans la table `workshop`.
  - À la fin : comparaison avec la méthode du cours (point de commande + Wilson) ; record = meilleur écart en %.

### Autres activités de l'Atelier (au même niveau que les défis, formules, cas et simulateur)
- **Jeu de la bière** (`/atelier/biere`, `src/lib/beerGame.js`) : voir le simulateur ci-dessus ; il n'est plus dans la page Simulateur.
- **Plan de chargement** (`/atelier/chargement`, `src/lib/truckLoading.js`) : placer des palettes dans un camion (ordre de livraison, charge utile, équilibre, palettes fragiles), score sur 100, plan suggéré.
- **Négociation** (`/atelier/negociation`, `src/lib/negotiation.js`) : 5 leviers parmi 7 face à un fournisseur, coût total annuel, score vs meilleur enchaînement.
- **Tournée de livraison** (`/atelier/tournee`, `src/lib/tour.js`) : relier dépôt et clients, comparaison avec le plus proche voisin et la tournée optimale (Held-Karp).
- Le score et le meilleur résultat de chaque activité sont dans la table `workshop` (`chargement`, `negociation`, `tournee`, `biere`) via `recordScoreGame` / `recordBeerGame` (`src/lib/atelier.js`). Chaque test de logique est dans `scripts/verify.mjs`.

### Power Query & Power BI (`src/pages/atelier/bi/`, données dans `src/data/atelier/bi/`)
- **Ajouté le 2026-11-19** (demande : l'utilisateur n'a jamais utilisé ces outils, question d'entretien de stage). Aucun contenu n'existait avant. **C'est une simulation** : le bandeau « Simulation pédagogique » (`SimulationNotice`, `shared.jsx`) est sur toutes les pages du module ; ne jamais le retirer. Syntaxe DAX / M non testée dans les vrais outils : voir `A_VERIFIER.md` (section « Power Query et Power BI »).
- Tuile « Power Query & Power BI » dans l'Atelier → `/atelier/bi` (`BiHome.jsx`) : parcours Power Query, parcours Power BI, mises en situation, entretien. Routes : `/atelier/bi/cours/:id` (`?onglet=exercices`), `/atelier/bi/simulateur[/:id]`, `/atelier/bi/tableau[/:id]`, `/atelier/bi/entretien`.
- **12 leçons** (`lessonsPq.js` : intro, types, nettoyage, fusion/ajout, pivot/dépivot, étapes appliquées ; `lessonsBi.js` : vue d'ensemble, modèle en étoile, DAX bases, CALCULATE, visuels, KPI supply chain : OTIF, taux de service, rotation, coûts de transport, retards). Chaque leçon = onglet **Mini-cours** (objectif, sections avec code M / DAX, « À retenir ») + onglet **Exercices** : série de 4 tirés au hasard dans 5 à 7 modèles, **données tirées au hasard à chaque série**, correction détaillée pas à pas, bouton « Rappel / indice » (rappel du cours, sans la réponse), +5 XP par bonne réponse (`recordBiExercise`). Les modèles d'exercices sont des fonctions `() => choice({…})` ou `number({…})` (`helpers.js` : tableaux `tbl`, `deliveries()`…).
- **Simulateur Power Query** (`PqSimulator.jsx`, `src/lib/powerQuery.js`, `pqScenarios.js`) : 7 scénarios (fichier transporteur, export WMS à cellules fusionnées, références collées, fusion avec fournisseurs, stock dépivoté, deux fichiers à ajouter, ventes à pivoter). Le **moteur rejoue vraiment** les étapes (14 transformations) ; l'utilisateur choisit des « cartes de transformations » (bonnes + pièges) dans le bon ordre, avec aperçu à chaque étape, volet « Étapes appliquées » (supprimer une étape, cliquer pour voir l'état à ce moment), barre de formule, Éditeur avancé (code M généré), objectif affiché, « Vérifier », « Rappel / indice » (défauts à repérer + rappel), « Voir la solution » (XP réduits : 15 → 5, 1re fois, `completePqSim`). Réussite détectée automatiquement quand le tableau égale l'objectif.
- **Constructeur de tableau de bord** (`DashboardBuilder.jsx`, `dashboards.js`, `src/lib/biKpi.js`) : 6 mises en situation (OTIF, transport, retards fournisseurs, taux de service, santé des stocks, couverture), 3 besoins chacun ; pour chaque besoin on choisit visuel (Carte, Histogramme, Courbe, Anneau, Tableau, Segment), mesure et axe, avec **aperçu sur des données aléatoires** (famille `livraisons` ou `stocks`). Score : visuel 2 (1 si acceptable), mesure 3, axe 1 ; correction avec « La réponse attendue », la mesure DAX, et la lecture métier calculée. XP comme les cas (`completeDashboard`).
- **Questions d'entretien** (`Interview.jsx`, `interview.js`) : 27 questions (Power Query, Power BI, DAX, Supply chain, Entretien) ; on réfléchit, on affiche la réponse **à dire à l'oral** + la réponse détaillée + les idées à citer, puis « Je savais » (+2 XP la 1re fois) / « À revoir ».
- Données : clés `bi/<id>` (leçon : `solved`/`attempts` ; scénario ou tableau : `completedAt` / `bestScore`+`max`) et `bi/ent/<id>` (`status` known/review) dans la table `workshop` (pas de nouvelle version Dexie). `npm run verify` contrôle tout le module (indicateurs recalculés, moteur, 150 parties par scénario, 200 tirages par modèle d'exercice, tableaux de bord, questions). Pour ajouter une leçon : un objet dans `lessonsPq.js` / `lessonsBi.js` (≥ 5 modèles d'exercices ; la bonne réponse ne doit pas être la plus longue) ; un scénario : `pqScenarios.js` (`make()` renvoie `source`, `ideal`, `traps`, `problems`, `expectedRows`) ; une question : `interview.js`.

### Révisions (`src/pages/revisions/`, `src/lib/rev*.js`)
- **Principe** : l'utilisateur donne ses cours à Claude dans le chat, Claude produit un fichier au **format RV** (texte à directives, voir `FORMAT_REVISIONS.md`, modèle dans `src/lib/revTemplate.js`) que l'utilisateur importe. **Aucune API, aucun appel à Claude dans l'appli.**
- **Format** (`src/lib/revFormat.js`) : `@lot`, `@matiere`, `@cours`, puis `@fiche`, `@flashcard`, `@qcm`, `@qa`, `@exercice` (avec tableaux `| a | b |`). `parseRevisions` vérifie le texte et renvoie les erreurs **ligne par ligne** (et des avertissements). Pour changer le format : modifier le parseur ET `revTemplate.js` ET `FORMAT_REVISIONS.md` (régénéré depuis `RV_PROMPT`), puis lancer `npm run verify`.
- **Écrans** : `/revisions` (à réviser aujourd'hui, recherche, lots classés par matière puis cours), `/revisions/importer` (fichier **et** zone de collage, erreurs, aperçu, remplacement d'un lot identique), `/revisions/lot/:id` (modes, renommer, supprimer), `.../fiches`, `.../exercices`, `/revisions/etude/:lot|tous/:jour|flash|qcm|qa` (séances), `/revisions/exercice/:lot/:id`, `/revisions/sauvegarde`.
- **Répétition espacée** (`revSrs.js`) : boîtes de Leitner (1, 2, 4, 8, 16, 32, 64 jours) ; « À revoir » retombe en boîte 0 (demain + une 2e fois dans la séance) ; flashcards : réglage « Recto d'abord » (par défaut : le recto est toujours montré en premier, comme écrit dans le fichier) ou « Dans les deux sens » (cartes verso → recto en plus), choix retenu dans `meta` (`rvFlashMode`), visible au début d'une séance (`Study.jsx`) ; séance de 20 cartes max dont 10 nouvelles.
- **XP** : carte connue +2 / à revoir +1, QCM +3 / +1, exercice +5 / +1, une fois par carte et par jour (`revStore.js`).
- **Sauvegarde** (`revBackup.js`, `revStore.js`) : un fichier JSON de toutes les tables sauf `feeds` ; fusion ou remplacement. Export = feuille de partage sur iPhone, téléchargement ailleurs ; copier/coller avec secours (`src/lib/device.js`).
- **Accueil** : la tuile « À réviser aujourd'hui » lit le vrai nombre de cartes (`useDueCount`). Les badges restent provisoires (`placeholders`).
- `npm run verify` contrôle : le modèle est valide, 11 fichiers erronés sont signalés à la bonne ligne, la répétition espacée, la sauvegarde (formats, fusion).

### Anglais (`src/pages/anglais/`, contenu dans `src/data/anglais/units.js`)
- 23 unités, 63 leçons, 310 mots + 103 phrases. Difficulté progressive : mots (niveau 1) → mots en contexte (2) → phrases et mails (3, unité « Communiquer au travail »). Unité « Faux amis » avec notes.
- **Mots du jour = flashcards** (`DailyWords.jsx`) : 3 mots par jour (jamais vus). Le **recto** n'affiche que le mot, en anglais ou en français selon un tirage stable par mot et par jour (`cardFace` dans `src/lib/english.js`). Le haut-parleur n'est sur le recto que si le mot est en anglais. Un toucher retourne la carte (rotation 3D) : le **verso** donne le mot anglais + 🔊, la traduction, la définition (`def`), l'exemple, puis « Je connais » / « À revoir » (+2 XP). Une carte déjà triée s'ouvre retournée. La tuile « Word of the day » de l'accueil n'affiche que le recto (sans la réponse).
- Chaque mot de `units.js` a un champ `def` (définition courte en français) : à renseigner pour tout nouveau mot.
- Leçon : cartes de découverte (lues à voix haute), puis ~10 exercices générés (`src/lib/englishExercises.js`) : paires, QCM dans les deux sens, écoute, phrase à trous, remettre dans l'ordre, mot à taper (1 faute tolérée), **prononciation au micro** (correction souple ; si raté → réécouter + réessayer ; « passer » si micro indisponible, non compté).
- Barre de correction en bas façon Duolingo. XP : 10 + 2 par bonne réponse la 1re fois, 5 en refaisant.
- **Mon lexique** : mots rencontrés, recherche, filtres Tous / À revoir / Connus.
- L'anglais fait partie de la rotation du défi du jour (Excel → calcul → cas → simulateur → anglais → Power Query / Power BI).

## Architecture des lots de contenu (ajoutée pendant l'enrichissement)
- `src/data/lots/lotNN.js` : pour chaque lot, `formulas`, `excel`, `cases`, `english` (nouvelles unités + `extend` pour ajouter des leçons à une unité existante). Le registre est `src/data/lots/index.js` (`LOTS`).
- Cours : un fichier par module dans `src/data/courses/` ; les modules d'origine sont enrichis par `src/data/courses/ajouts/<module>.js` (`lessons` ajoutées + `more` : questions ajoutées par leçon) via `withExtras` dans `src/data/courses/index.js`.
- Anglais : l'ordre des unités est dans `UNIT_ORDER` (`src/data/anglais/units.js`) ; chaque mot a un `def`, et l'exemple (`ex`) doit contenir le mot.
- **`npm run verify`** (`scripts/verify.mjs`) : contrôle automatique du contenu (calculs refaits, bonnes réponses, doublons, 100 à 300 générations aléatoires, banques de 8 questions minimum). À lancer avant chaque livraison, avec `npm run build` et `npm run lint`.
- **`A_VERIFIER.md`** : doutes sur des notions ou des chiffres, par lot, à relire par l'utilisateur.
- Règle d'écriture des quiz : la bonne réponse ne doit pas être systématiquement la plus longue (objectif < 35 % ; le script le signale).

## Plan d'enrichissement du contenu (validé)

Objectif : tenir plusieurs mois à 15-20 min par jour (aujourd'hui : tout se fait en une semaine).

**Règles** : un lot à la fois ; script de vérification automatique (calculs refaits, bonnes réponses, doublons, 300 générations aléatoires sans erreur) ; relecture de l'exactitude des notions ; l'utilisateur teste et valide ; point de sauvegarde Git après chaque lot. **Ne pas modifier la présentation, le design ni le fonctionnement actuels** (sauf la flashcard du mot du jour, déjà faite) : ajouter seulement du contenu dans le même format. Les exercices doivent pouvoir être refaits sans connaître les réponses (chiffres aléatoires, questions tirées au hasard). Suivre l'ordre des cours de l'utilisateur et l'adapter s'il dit que ses cours changent. Progression du plus simple au plus difficile.

**Cibles** :
- Cours : 8 → 16 modules, 19 → environ 90 leçons. Chaque leçon avec une banque de 8 à 10 questions dont 5 tirées au hasard (questions de calcul à chiffres aléatoires).
- Défis Excel : 13 → environ 60, en 6 niveaux (bases, conditions, recherche, synthèse, calculs supply chain, textes et dates), tableaux de données tirés au hasard à chaque essai ; le moteur de formules apprend les nouvelles fonctions.
- Formules et calculs : 7 → environ 22 (cours + 4 à 6 exercices aléatoires + calculateur).
- Études de cas : 4 → environ 24 (dont une dizaine à chiffres aléatoires).
- Anglais : 7 → environ 20 unités, 70 leçons, 500 mots/phrases (avec `def`) : mots, mots en contexte, phrases et mails (entretien de stage, négociation, réclamation, etc.).

**Lots, dans cet ordre** (chaque lot = module de cours + formules, défis Excel et cas de l'Atelier liés + unité d'anglais liée) :
- Lot 0 : flashcard du mot du jour. **Fait.**
- Lot 1 Bases (Fondamentaux) → 2 Transport → 3 Stocks → 4 Entrepôt → 5 Achats → 6 Prévision → 7 Production (nouveau) → 8 Distribution et e-commerce (nouveau) → 9 KPI → 10 Douane et international (nouveau) → 11 Outils et SI → 12 Lean (étendu) → 13 Supply chain durable (nouveau) → 14 Risques et résilience (nouveau) → 15 Finance et supply chain (nouveau) → 16 Stratégie et innovation (nouveau).
- **À la fin, une fois tout le contenu ajouté** : le **jeu de la bière** dans le simulateur (effet coup de fouet) + 4 profils de demande (stable, saisonnière, en tendance, avec promotions) + proposer et ajouter 2 ou 3 autres ateliers interactifs utiles.

## Ce qu'il reste à faire

**Ordre de reprise (décidé le 2026-11-17), un point à la fois, validation avant le suivant :**

**Règle : ne jamais faire `git push` à la place de l'utilisateur, il l'envoie lui-même.**

**État au 2026-11-20** (écrit le 2026-11-19, complété le 20) : responsive **validé** ; nom **MySupply** en place. **L'appli est EN LIGNE** : l'utilisateur l'a publiée lui-même (dépôt GitHub public `mysupply`, compte `JabaCoco`, `git remote add origin` puis `git push -u origin main`, Pages réglé sur « GitHub Actions ») à **https://jabacoco.github.io/mysupply/**, installée sur PC et téléphone. Le 1er déploiement avait échoué (« No artifacts named github-pages »), un « Re-run all jobs » l'a réglé ; cause exacte non prouvée (journal non vu) → workflow durci le 2026-11-19 (voir « Mise en ligne »). Pour envoyer une mise à jour : `git push` simple, jamais de réécriture d'historique ni de `--force`. **Icônes validées par l'utilisateur (2026-11-20, ne plus y toucher)** : iPhone / maskable = fond blanc ; Windows / navigateurs (« any ») = sans fond, avec fin liseré blanc (voir « Nom et icônes »). **Pause du 2026-11-20** : dernier point de sauvegarde Git `c1c1c18` ; l'utilisateur fait lui-même le `git push` (ne pas pousser à sa place) pour mettre en ligne les icônes. **Prochaine étape : 3 (comptes avec Supabase)**, dès que l'utilisateur a créé son projet Supabase et donné l'URL + la clé publique « anon » (je le guide clic par clic).

1. ~~Version responsive~~ **Fait et validé** (voir Design et A_VERIFIER.md). Éventuel complément : élargir les écrans de détail (ex. tableur + énoncé côte à côte pour les défis Excel).
2. **Mise en ligne gratuite + installation sur iPhone** — **publiée par l'utilisateur le 2026-11-19 (voir « État »)** (GitHub Pages ; voir « Choix techniques ») :
   - Fait : nom « MySupply » (manifeste, titre, balises Apple) ; workflow GitHub Actions ; flux Actu téléchargés à l'avance (remplacent les relais) ; données de démo retirées ; recherche de secrets / données perso (rien trouvé) ; historique Git anonymisé ; test du build avec sous-dossier (`/mysupply/`) dans Edge.
   - À faire par l'utilisateur : créer le dépôt GitHub public, pousser, activer Pages (source « GitHub Actions »), installer sur iPhone / Windows (guide donné dans le chat). Ensuite : vérifier que l'Actu se remplit en ligne et que le nom s'affiche bien sous l'icône.
   - Tester sur un vrai iPhone (Safari + appli installée) l'import, l'export et le copier-coller de l'onglet Révisions (voir A_VERIFIER.md) ; Safari n'a jamais été testé (seulement Edge).
3. **Comptes avec pseudo + progression synchronisée PC ↔ téléphone, avec Supabase** (offre gratuite). Attention : cela contredit la règle « aucune dépendance » seulement si l'appli devient inutilisable hors ligne ; garder le mode local (Dexie) comme source principale et synchroniser en plus. Aucune API payante, aucun appel à Claude. À étudier : tables à synchroniser (voir `revBackup.js` : toutes les tables sauf `feeds`), fusion (`mergeRow`), sécurité (RLS), pseudo unique.
   - **Décisions de l'utilisateur** : connexion par **pseudo + mot de passe**, pseudo converti en fausse adresse interne (`…@….invalid`, confirmation e-mail désactivée) ; **pas d'e-mail de récupération** (mot de passe oublié = compte perdu) ; **l'export/import de sauvegarde (Révisions > Sauvegarde) reste le filet de sécurité**. Pas de classement. Sync : XP, série, niveau, progression Cours / Atelier / Anglais, lots de révision, cartes à revoir (favoris et badges n'existent pas encore / sont provisoires). RLS obligatoire, test avec deux comptes, seule la clé publique « anon » dans le code (jamais `service_role`), hors ligne d'abord (Dexie), conflit = progression la plus avancée, proposition d'envoi de la progression locale à la 1re connexion, bouton de suppression du compte et des données. Design inchangé.
   - **À faire par l'utilisateur avant de commencer** : publier l'appli (point 2), puis créer son projet Supabase (je le guiderai clic par clic) et me donner **l'adresse du projet (URL) et la clé publique « anon »**. Rappel : le projet gratuit Supabase se met en pause après environ 7 jours sans activité.
4. Plus tard : idée de transformer les mots d'anglais « À revoir » en cartes de révision ; badges de l'accueil encore provisoires (`placeholders` dans `src/data/daily.js`).
