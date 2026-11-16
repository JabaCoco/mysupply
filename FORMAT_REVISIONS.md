# Format d'import des révisions (« format RV », version 1)

Ce fichier est généré à partir du modèle de l'appli (bouton « Copier le modèle » de l'écran Révisions → Importer).
Le texte ci-dessous est celui à coller dans le chat avec Claude, suivi de ton cours.

---

Tu vas transformer mes cours en fichier de révision pour mon appli, dans un format texte précis. Respecte ce format À LA LETTRE : l'appli vérifie le fichier ligne par ligne et refuse les erreurs.

RÈGLES DU FORMAT
1. Réponds avec UN SEUL bloc de code (trois accents graves), sans rien écrire avant ni après. Pas de JSON, pas de Markdown décoratif.
2. Le fichier commence par @lot (titre du lot) et @matiere (nom de la matière) ; @cours (nom du cours) est facultatif. Une seule matière et un seul cours par fichier.
3. Ensuite, des blocs dans l'ordre que tu veux : @fiche, @flashcard, @qcm, @qa, @exercice. Chaque bloc commence par son @mot au début de la ligne.
4. Dans les blocs @flashcard, @qcm, @qa et @exercice, les champs s'écrivent « clé: valeur ». Une valeur peut continuer sur les lignes suivantes (jusqu'à la clé suivante). Écris les clés sans accent : recto, verso, note, question, reponse, explication, enonce, unite, tolerance, correction, indice.
5. @fiche : titre sur la même ligne que @fiche, puis le texte libre. Tu peux utiliser **gras**, des puces « - », des listes numérotées « 1. » et des tableaux.
6. @flashcard : recto, verso (obligatoires), note (facultative). Une carte = une seule idée courte.
7. @qcm : question, 2 à 6 choix écrits « a) », « b) », « c) »... (dans l'ordre), reponse (UNE seule lettre), explication (toujours remplie : elle explique pourquoi la bonne réponse est bonne et les autres fausses). Les mauvaises réponses doivent être plausibles et de longueur comparable à la bonne.
8. @qa : question, reponse (obligatoires), explication (facultative).
9. @exercice : titre sur la même ligne, puis enonce (le texte et les tableaux de données), puis une ou plusieurs « question: » ; après CHAQUE question : reponse, puis unite (facultative), tolerance (facultative, nombre), correction (détaillée, étape par étape) et indice (facultatif). Si la réponse est un nombre, écris-le seul (ex. 280 ou 12,5), l'unité va dans « unite: ». Sinon la réponse est un texte.
10. Tableau : lignes qui commencent et finissent par |, avec la ligne de séparation | --- | --- | juste après l'en-tête. Même nombre de colonnes partout. Tu peux mettre un tableau dans une fiche, un enonce, une question ou une correction.
11. Les lignes qui commencent par // sont des commentaires (ignorés).
12. Appuie-toi uniquement sur mes cours ci-dessous : n'invente pas de notions. Si un point du cours est ambigu, écris-le dans un commentaire // au lieu de deviner.
13. Quantité conseillée : pour chaque partie du cours, 1 fiche, quelques flashcards, 3 à 5 QCM, 2 ou 3 questions-réponses, et au moins 1 exercice avec tableau quand le cours s'y prête.

MODÈLE EXACT (un exemple de chaque type)
```
// Les lignes qui commencent par // sont des commentaires : elles sont ignorées.
@lot Gestion des stocks : les bases
@matiere Supply chain
@cours Les stocks

@fiche Le stock de sécurité
Le **stock de sécurité** protège l'entreprise des variations de la demande et des retards de livraison.
- Formule : SS = z × σ × √L
- Plus le délai L est long, plus le stock de sécurité est élevé.
1. Mesurer la variabilité de la demande (σ)
2. Choisir le taux de service visé (z)
3. Calculer SS

| Taux de service | z |
| --- | --- |
| 90 % | 1,28 |
| 95 % | 1,65 |
| 99 % | 2,33 |

@flashcard
recto: Que signifie « rotation des stocks » ?
verso: Le nombre de fois où le stock est vendu et renouvelé en un an (coût des ventes / stock moyen).
note: Une rotation élevée = moins d'argent immobilisé.

@qcm
question: Quelle est la formule du point de commande ?
a) Demande moyenne × délai + stock de sécurité
b) Demande moyenne × stock de sécurité
c) Délai / demande moyenne
d) Stock de sécurité − délai
reponse: a
explication: Pendant le délai, on vend en moyenne D × L unités : il faut commander quand le stock atteint ce niveau, plus le stock de sécurité.

@qa
question: Pourquoi le modèle de Wilson suppose-t-il une demande constante ?
reponse: Pour pouvoir calculer une quantité de commande unique qui équilibre coût de commande et coût de stockage.
explication: Si la demande varie beaucoup, il faut ajouter un stock de sécurité.

@exercice Calcul d'un point de commande
enonce: Un entrepôt vend en moyenne 120 unités par semaine. Le délai de livraison est de 2 semaines et le stock de sécurité est de 40 unités. Voici les ventes des 4 dernières semaines :

| Semaine | Ventes |
| --- | --- |
| S1 | 110 |
| S2 | 130 |
| S3 | 115 |
| S4 | 125 |
question: Calcule la demande moyenne hebdomadaire.
reponse: 120
unite: unités
tolerance: 0,5
correction: (110 + 130 + 115 + 125) / 4 = 480 / 4 = 120 unités par semaine.
question: Calcule le point de commande.
reponse: 280
unite: unités
correction: PC = D × L + SS = 120 × 2 + 40 = 280 unités.
indice: PC = demande pendant le délai + stock de sécurité.
question: Pourquoi ne pas commander plus tôt, dès 400 unités ?
reponse: On immobiliserait de l'argent en stock sans nécessité : le point de commande vise le juste niveau.
correction: Commander trop tôt augmente le stock moyen et donc les coûts de stockage.
```

MES COURS :
[colle ici ton cours]
