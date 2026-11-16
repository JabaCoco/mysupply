# Appli Supply Chain

Appli PWA d'apprentissage de la supply chain pour un étudiant (niveau BTS / Licence / Master) : actu, cours, pratique, anglais, révisions.

## Consignes de travail

- Réponds toujours en français.
- L'utilisateur débute en code : explique chaque étape simplement et donne les commandes exactes à lancer.
- Avance un onglet à la fois et attends sa validation avant de passer au suivant.
- Aucune API payante, aucune dépendance à Claude dans l'appli.
- Avant de livrer : `npm run build` + `npm run lint`, et si possible un test de bout en bout dans Edge (playwright-core installé dans le dossier temporaire de session, pas dans le projet).
- **Étape en cours : les 16 lots de contenu sont terminés** (voir « Plan d'enrichissement du contenu »). Reste, dans l'ordre : récapitulatif + points à vérifier (`A_VERIFIER.md`), puis le jeu de la bière et 2-3 ateliers interactifs, puis l'onglet Révisions.
- **Git** : dépôt local initialisé (branche `main`), un point de sauvegarde après chaque lot validé (`git add -A` puis `git commit`). Une archive ZIP d'avant les lots est dans `C:\Users\guito\Projets\sauvegardes\`.

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
- **16 modules, 94 leçons** (Bases, Transport, Stocks, Entrepôt, Achats, Prévision, Production, Distribution et e-commerce, KPI, Douane et international, Outils et SI, Lean, Supply chain durable, Risques et résilience, Finance, Stratégie et innovation). Chaque leçon a une banque de 8 à 10 questions dont 5 sont tirées au hasard à chaque passage (une partie à chiffres aléatoires via `numQuestion` de `src/data/gen.js`).
- Format Duolingo : 5 à 7 cartes (balayage ou bouton) puis quiz de 4 questions (réponses mélangées, explication à chaque fois), écran de fin.
- XP : 10 + 5 par bonne réponse la 1re fois, 5 en refaisant. Mode d'emploi pour ajouter une leçon en haut de `src/data/courses/index.js`.

### Atelier (`src/pages/atelier/`, données dans `src/data/atelier/`)
- **Défi du jour tournant** (`src/lib/dailyChallenge.js`) : Excel → exercices de calcul (3 à réussir) → étude de cas → simulateur. Il reste le même tant qu'il n'est pas terminé, et change le lendemain d'une réussite.
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
  - **Jeu de la bière** (`/atelier/simulateur/biere`, `src/lib/beerGame.js`, `BeerGame.jsx`, `BeerChart.jsx`) : chaîne de 4 maillons, le joueur est le grossiste, 20 semaines, 5 profils de demande des clients ; résultats : graphique des commandes par maillon, amplification (effet coup de fouet), comparaison avec une chaîne qui partage l'information. Record : `biere` dans la table `workshop`.
  - À la fin : comparaison avec la méthode du cours (point de commande + Wilson) ; record = meilleur écart en %.

### Anglais (`src/pages/anglais/`, contenu dans `src/data/anglais/units.js`)
- 23 unités, 63 leçons, 310 mots + 103 phrases. Difficulté progressive : mots (niveau 1) → mots en contexte (2) → phrases et mails (3, unité « Communiquer au travail »). Unité « Faux amis » avec notes.
- **Mots du jour = flashcards** (`DailyWords.jsx`) : 3 mots par jour (jamais vus). Le **recto** n'affiche que le mot, en anglais ou en français selon un tirage stable par mot et par jour (`cardFace` dans `src/lib/english.js`). Le haut-parleur n'est sur le recto que si le mot est en anglais. Un toucher retourne la carte (rotation 3D) : le **verso** donne le mot anglais + 🔊, la traduction, la définition (`def`), l'exemple, puis « Je connais » / « À revoir » (+2 XP). Une carte déjà triée s'ouvre retournée. La tuile « Word of the day » de l'accueil n'affiche que le recto (sans la réponse).
- Chaque mot de `units.js` a un champ `def` (définition courte en français) : à renseigner pour tout nouveau mot.
- Leçon : cartes de découverte (lues à voix haute), puis ~10 exercices générés (`src/lib/englishExercises.js`) : paires, QCM dans les deux sens, écoute, phrase à trous, remettre dans l'ordre, mot à taper (1 faute tolérée), **prononciation au micro** (correction souple ; si raté → réécouter + réessayer ; « passer » si micro indisponible, non compté).
- Barre de correction en bas façon Duolingo. XP : 10 + 2 par bonne réponse la 1re fois, 5 en refaisant.
- **Mon lexique** : mots rencontrés, recherche, filtres Tous / À revoir / Connus.
- L'anglais fait partie de la rotation du défi du jour (Excel → calcul → cas → simulateur → anglais).

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

1. **Onglet Révisions** : cartes de révision (répétition espacée) avec un **format d'import des fiches** à définir avec l'utilisateur (ex. CSV ou JSON : recto, verso, thème). Brancher ensuite la tuile « À réviser aujourd'hui » et les badges de l'accueil (`placeholders`). Les mots d'anglais « À revoir » pourront y devenir des fiches.
2. **Dernières modifs** :
   - Version responsive PC et téléphone (aujourd'hui pensée mobile, `max-w-xl`).
   - Peut-être des pseudos pour partager l'appli avec la classe (sans API payante : à étudier).
   - Mise en ligne : recréer les relais RSS/YouTube chez l'hébergeur, retirer les données de démo et le bouton de test XP.
