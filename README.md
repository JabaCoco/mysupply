# MySupply

Appli web (PWA) pour apprendre la supply chain : actu, cours, atelier pratique (Excel, calculs, études de cas, simulateurs), anglais professionnel et révisions.

- Gratuite, sans API payante et sans abonnement. Elle fonctionne hors ligne une fois installée.
- **Tes données restent sur ton appareil** (navigateur, base locale IndexedDB) : progression, cours importés, révisions. Rien n'est envoyé nulle part, et aucun cours ni donnée personnelle ne se trouve dans le code.

## Lancer en local

```
npm install
npm run dev
```

Puis ouvrir http://localhost:5173

## Vérifications avant de publier

```
npm run verify   # contrôle automatique du contenu (calculs, bonnes réponses, formats)
npm run lint
npm run build
```

## Mise en ligne

GitHub Pages, via `.github/workflows/deploy.yml` (voir `CLAUDE.md` pour le détail). Les flux RSS / YouTube de l'onglet Actu sont téléchargés toutes les 2 heures par `scripts/fetch-feeds.mjs`.
