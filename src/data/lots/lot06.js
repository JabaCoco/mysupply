// Lot 6 — Prévision : Atelier (2 formules, 4 défis Excel, 2 études de cas) + Anglais (prévisions, planification).
import { fmt, int, pick } from '../gen.js'

const MONTHS = ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc']
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length

export default {
  formulas: [
    {
      id: 'lissage-exponentiel',
      title: 'Moyenne mobile et lissage exponentiel',
      short: 'F(t+1) = α × D(t) + (1 − α) × F(t)',
      course: {
        purpose:
          "Ces deux méthodes prévoient la demande à partir des ventes passées. La **moyenne mobile** fait la moyenne des n dernières périodes. Le **lissage exponentiel** pondère davantage les ventes récentes : il réagit plus vite aux changements tout en limitant le bruit.",
        formulas: ['Moyenne mobile = (D(t) + D(t−1) + … + D(t−n+1)) / n', 'F(t+1) = α × D(t) + (1 − α) × F(t)', 'Erreur = D(t) − F(t)'],
        terms: [
          ['n', 'Nombre de périodes utilisées dans la moyenne mobile (3, 6, 12…).'],
          ['D(t)', 'Demande réelle de la période t.'],
          ['F(t)', 'Prévision qui avait été faite pour la période t.'],
          ['α', 'Coefficient entre 0 et 1 : proche de 1, on réagit vite ; proche de 0, on lisse beaucoup.'],
          ['F(t+1)', 'Nouvelle prévision, pour la période suivante.'],
        ],
        example: {
          statement: 'Ventes des 3 derniers mois : 100, 120, 110. Prévision précédente 105 ; ventes réelles 120 ; α = 0,3.',
          steps: ['Moyenne mobile sur 3 mois = (100 + 120 + 110) / 3 = 110', 'Lissage : F(t+1) = 0,3 × 120 + 0,7 × 105 = 36 + 73,5 = 109,5', 'Erreur = 120 − 105 = 15'],
          result: 'Les deux méthodes donnent une prévision proche de 110 pour le mois suivant.',
        },
        exercises: [
          () => {
            const sales = [int(80, 160, 5), int(80, 160, 5), int(80, 160, 5)]
            return {
              kind: 'number',
              statement: 'Prévois le mois suivant par moyenne mobile sur 3 mois.',
              data: [['Mois 1', `${sales[0]} unités`], ['Mois 2', `${sales[1]} unités`], ['Mois 3', `${sales[2]} unités`]],
              question: 'Prévision du mois 4 (en unités) ?',
              answer: mean(sales),
              unit: 'unités',
              tolerance: 0.2,
              steps: [`Somme = ${sales[0]} + ${sales[1]} + ${sales[2]} = ${sales.reduce((a, b) => a + b, 0)}`, `Moyenne = ${sales.reduce((a, b) => a + b, 0)} / 3 = ${fmt(mean(sales), 1)}`],
              conclusion: 'La moyenne mobile traite toutes les périodes de la même façon, même les plus anciennes.',
            }
          },
          () => {
            const sales = Array.from({ length: 4 }, () => int(90, 180, 10))
            return {
              kind: 'number',
              statement: 'Prévois la période suivante par moyenne mobile sur 4 périodes.',
              data: sales.map((s, i) => [`Période ${i + 1}`, `${s} unités`]),
              question: 'Prévision (en unités) ?',
              answer: mean(sales),
              unit: 'unités',
              tolerance: 0.2,
              steps: [`Somme = ${sales.join(' + ')} = ${sales.reduce((a, b) => a + b, 0)}`, `Moyenne = ${sales.reduce((a, b) => a + b, 0)} / 4 = ${fmt(mean(sales), 1)}`],
              conclusion: 'Plus n est grand, plus la prévision est lissée, mais plus elle réagit lentement.',
            }
          },
          () => {
            const alpha = pick([0.2, 0.3, 0.4, 0.5])
            const forecast = int(80, 200, 5)
            const demand = int(80, 200, 5)
            const next = alpha * demand + (1 - alpha) * forecast
            return {
              kind: 'number',
              statement: 'Calcule la nouvelle prévision par lissage exponentiel.',
              data: [['α', fmt(alpha)], ['Prévision précédente F(t)', `${forecast} unités`], ['Demande réelle D(t)', `${demand} unités`]],
              question: 'Nouvelle prévision F(t+1) (en unités) ?',
              answer: next,
              unit: 'unités',
              tolerance: 0.2,
              steps: [`α × D = ${fmt(alpha)} × ${demand} = ${fmt(alpha * demand, 1)}`, `(1 − α) × F = ${fmt(1 - alpha)} × ${forecast} = ${fmt((1 - alpha) * forecast, 1)}`, `F(t+1) = ${fmt(alpha * demand, 1)} + ${fmt((1 - alpha) * forecast, 1)} = ${fmt(next, 1)}`],
              conclusion: `Avec α = ${fmt(alpha)}, la prévision se rapproche de ${fmt(alpha * 100, 0)} % de l'écart observé.`,
            }
          },
          () => {
            const forecast = int(90, 200, 5)
            const demand = int(80, 220, 5)
            return {
              kind: 'number',
              statement: 'Calcule l\'erreur de prévision de la période (réel − prévu).',
              data: [['Prévision F(t)', `${forecast} unités`], ['Demande réelle D(t)', `${demand} unités`]],
              question: 'Erreur D − F (en unités, avec son signe) ?',
              answer: demand - forecast,
              unit: 'unités',
              tolerance: 0.5,
              steps: [`Erreur = D − F = ${demand} − ${forecast} = ${demand - forecast}`],
              conclusion: demand - forecast >= 0 ? 'Erreur positive : on a sous-estimé la demande.' : 'Erreur négative : on a sur-estimé la demande.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'd1', label: 'Demande mois 1', value: 100 },
            { key: 'd2', label: 'Demande mois 2', value: 120 },
            { key: 'd3', label: 'Demande mois 3', value: 110 },
            { key: 'alpha', label: 'Coefficient α', value: 0.3, help: 'Entre 0 et 1' },
            { key: 'f', label: 'Prévision précédente', unit: 'unités', value: 105 },
          ],
          outputs: [
            { label: 'Moyenne mobile (3 mois)', unit: 'unités', digits: 1, fn: (n) => (n.d1 + n.d2 + n.d3) / 3 },
            { label: 'Lissage exponentiel', unit: 'unités', digits: 1, highlight: true, fn: (n) => n.alpha * n.d3 + (1 - n.alpha) * n.f },
            { label: 'Erreur du dernier mois', unit: 'unités', digits: 1, fn: (n) => n.d3 - n.f },
          ],
          steps: (n) => [`Moyenne mobile = (${fmt(n.d1)} + ${fmt(n.d2)} + ${fmt(n.d3)}) / 3 = ${fmt((n.d1 + n.d2 + n.d3) / 3, 1)}`, `Lissage = ${fmt(n.alpha)} × ${fmt(n.d3)} + ${fmt(1 - n.alpha)} × ${fmt(n.f)} = ${fmt(n.alpha * n.d3 + (1 - n.alpha) * n.f, 1)}`],
          note: 'Le lissage utilise ici la demande du mois 3 comme dernière demande observée.',
        },
      },
    },
    {
      id: 'mape-biais',
      title: 'Erreur de prévision : MAPE et biais',
      short: 'MAPE = moyenne de |réel − prévu| / réel',
      course: {
        purpose:
          "Pour savoir si une méthode de prévision est bonne, on mesure ses erreurs. La **MAD** donne l'erreur moyenne en unités, le **MAPE** en pourcentage, et le **biais** indique si l'on prévoit trop ou trop peu **systématiquement**.",
        formulas: ['MAD = moyenne de |réel − prévu|', 'MAPE = moyenne de |réel − prévu| / réel × 100', 'Biais = moyenne de (prévu − réel)'],
        terms: [
          ['|…|', 'Valeur absolue : on enlève le signe, pour que les erreurs ne se compensent pas.'],
          ['MAD', "Erreur absolue moyenne, en unités."],
          ['MAPE', "Erreur absolue moyenne en % du réel : permet de comparer des produits de tailles différentes."],
          ['Biais', 'Erreur moyenne avec son signe : positif = sur-prévision, négatif = sous-prévision.'],
        ],
        example: {
          statement: 'Réel : 100, 120, 80. Prévu : 110, 100, 90.',
          steps: ['Erreurs absolues : 10, 20, 10 → MAD = 40 / 3 ≈ 13,3', 'Erreurs en % : 10/100 = 10 %, 20/120 = 16,7 %, 10/80 = 12,5 % → MAPE ≈ 13,1 %', 'Biais = (10 − 20 + 10) / 3 = 0'],
          result: 'Malgré des erreurs de 13 % en moyenne, le biais est nul : les erreurs se compensent.',
        },
        exercises: [
          () => {
            const real = int(80, 200, 10)
            const forecast = real + int(-30, 30, 5)
            return {
              kind: 'number',
              statement: 'Calcule l\'erreur en pourcentage d\'une période.',
              data: [['Réel', `${real} unités`], ['Prévu', `${forecast} unités`]],
              question: 'Erreur absolue en % du réel ?',
              answer: (Math.abs(real - forecast) / real) * 100,
              unit: '%',
              tolerance: 0.2,
              steps: [`|réel − prévu| = |${real} − ${forecast}| = ${Math.abs(real - forecast)}`, `En % du réel : ${Math.abs(real - forecast)} / ${real} × 100 = ${fmt((Math.abs(real - forecast) / real) * 100, 1)} %`],
              conclusion: 'Le pourcentage se calcule toujours par rapport au réel, pas à la prévision.',
            }
          },
          () => {
            const real = [int(80, 150, 10), int(80, 150, 10), int(80, 150, 10)]
            const forecast = real.map((r) => r + int(-20, 20, 5))
            const mape = mean(real.map((r, i) => (Math.abs(r - forecast[i]) / r) * 100))
            return {
              kind: 'number',
              statement: 'Calcule le MAPE de la série.',
              data: real.map((r, i) => [`Mois ${i + 1}`, `réel ${r} · prévu ${forecast[i]}`]),
              question: 'MAPE (en %) ?',
              answer: mape,
              unit: '%',
              tolerance: 0.3,
              steps: real.map((r, i) => `Mois ${i + 1} : |${r} − ${forecast[i]}| / ${r} = ${fmt((Math.abs(r - forecast[i]) / r) * 100, 1)} %`).concat([`MAPE = moyenne = ${fmt(mape, 1)} %`]),
              conclusion: 'Plus le MAPE est bas, plus la méthode est précise.',
            }
          },
          () => {
            const real = Array.from({ length: 4 }, () => int(80, 150, 10))
            const forecast = real.map((r) => r + int(-20, 20, 5))
            const mad = mean(real.map((r, i) => Math.abs(r - forecast[i])))
            return {
              kind: 'number',
              statement: 'Calcule l\'erreur absolue moyenne (MAD).',
              data: real.map((r, i) => [`Mois ${i + 1}`, `réel ${r} · prévu ${forecast[i]}`]),
              question: 'MAD (en unités) ?',
              answer: mad,
              unit: 'unités',
              tolerance: 0.2,
              steps: real.map((r, i) => `Mois ${i + 1} : |${r} − ${forecast[i]}| = ${Math.abs(r - forecast[i])}`).concat([`MAD = ${fmt(real.reduce((s, r, i) => s + Math.abs(r - forecast[i]), 0))} / 4 = ${fmt(mad, 1)}`]),
              conclusion: 'La MAD se lit en unités : on se trompe en moyenne de cette quantité à chaque période.',
            }
          },
          () => {
            const real = Array.from({ length: 4 }, () => int(90, 130, 10))
            const forecast = real.map((r) => r + int(-10, 25, 5))
            const bias = mean(real.map((r, i) => forecast[i] - r))
            return {
              kind: 'number',
              statement: 'Calcule le biais de la série (prévu − réel).',
              data: real.map((r, i) => [`Mois ${i + 1}`, `réel ${r} · prévu ${forecast[i]}`]),
              question: 'Biais (en unités, avec son signe) ?',
              answer: bias,
              unit: 'unités',
              tolerance: 0.3,
              steps: real.map((r, i) => `Mois ${i + 1} : ${forecast[i]} − ${r} = ${forecast[i] - r}`).concat([`Biais = moyenne = ${fmt(bias, 1)}`]),
              conclusion: bias > 0 ? 'Biais positif : on prévoit trop en moyenne, avec un risque de surstock.' : bias < 0 ? 'Biais négatif : on prévoit trop peu, avec un risque de rupture.' : 'Biais nul : les erreurs se compensent.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'r1', label: 'Réel mois 1', value: 100 },
            { key: 'p1', label: 'Prévu mois 1', value: 110 },
            { key: 'r2', label: 'Réel mois 2', value: 120 },
            { key: 'p2', label: 'Prévu mois 2', value: 100 },
            { key: 'r3', label: 'Réel mois 3', value: 80 },
            { key: 'p3', label: 'Prévu mois 3', value: 90 },
          ],
          outputs: [
            { label: 'MAD', unit: 'unités', digits: 1, fn: (n) => (Math.abs(n.r1 - n.p1) + Math.abs(n.r2 - n.p2) + Math.abs(n.r3 - n.p3)) / 3 },
            { label: 'MAPE', unit: '%', digits: 1, highlight: true, fn: (n) => ((Math.abs(n.r1 - n.p1) / n.r1 + Math.abs(n.r2 - n.p2) / n.r2 + Math.abs(n.r3 - n.p3) / n.r3) / 3) * 100 },
            { label: 'Biais (prévu − réel)', unit: 'unités', digits: 1, fn: (n) => (n.p1 - n.r1 + n.p2 - n.r2 + n.p3 - n.r3) / 3 },
          ],
          steps: (n) => [`Erreurs absolues : ${fmt(Math.abs(n.r1 - n.p1))} ; ${fmt(Math.abs(n.r2 - n.p2))} ; ${fmt(Math.abs(n.r3 - n.p3))}`, `Erreurs signées (prévu − réel) : ${fmt(n.p1 - n.r1)} ; ${fmt(n.p2 - n.r2)} ; ${fmt(n.p3 - n.r3)}`],
          note: 'Le biais utilise la convention « prévu − réel » : positif = sur-prévision.',
        },
      },
    },
  ],

  excel: [
    {
      id: 'moyenne-mobile-3',
      fn: 'MOYENNE',
      level: 1,
      tier: 2,
      title: 'La prévision par moyenne mobile',
      context: 'Tu prévois les ventes de janvier à partir des 3 derniers mois de l\'année.',
      instruction: 'En **D2**, calcule la prévision de janvier : la **moyenne des 3 derniers mois** (octobre, novembre, décembre), **arrondie à l\'unité**.',
      generate() {
        const base = int(300, 900, 10)
        return { rows: [['Mois', 'Ventes'], ...MONTHS.map((m) => [m, base + int(-80, 80, 5)])], extra: { C2: 'Prévision janvier' } }
      },
      target: 'D2',
      solution: '=ARRONDI(MOYENNE(B11:B13);0)',
      mustUse: ['MOYENNE', 'ARRONDI'],
      hints: ['Octobre, novembre et décembre sont aux lignes 11, 12 et 13.', 'MOYENNE(B11:B13) fait la moyenne des trois mois ; ARRONDI(…;0) garde l\'unité.'],
      explain: 'La moyenne mobile sur 3 mois utilise les trois dernières valeurs : B11:B13. ARRONDI(…;0) arrondit à l\'entier le plus proche.',
    },
    {
      id: 'lissage-excel',
      fn: 'ARRONDI',
      level: 3,
      tier: 5,
      title: 'Le lissage exponentiel dans Excel',
      context: 'Tu appliques la formule du lissage exponentiel à partir de trois cellules.',
      instruction: 'En **B5**, calcule la nouvelle prévision : α (B1) × demande réelle (B2) + (1 − α) × prévision précédente (B3), **arrondie à 1 décimale**.',
      generate() {
        return { rows: [['α', pick([0.2, 0.3, 0.4, 0.5])], ['Demande réelle', int(80, 220, 5)], ['Prévision précédente', int(80, 220, 5)]], extra: { A5: 'Nouvelle prévision' } }
      },
      target: 'B5',
      solution: '=ARRONDI(B1*B2+(1-B1)*B3;1)',
      mustUse: ['ARRONDI'],
      hints: ['La formule du lissage est α × D + (1 − α) × F : B1*B2 + (1-B1)*B3.', 'Entoure le tout de ARRONDI(…;1).'],
      explain: 'Chaque nouvelle prévision mélange la dernière demande (poids α) et l\'ancienne prévision (poids 1 − α) : c\'est une moyenne pondérée qui s\'actualise à chaque période.',
    },
    {
      id: 'indice-saisonnier',
      fn: 'MOYENNE',
      level: 3,
      tier: 5,
      title: "L'indice saisonnier d'un mois",
      context: 'Tu mesures à quel point décembre est un mois fort par rapport à la moyenne de l\'année.',
      instruction: 'En **D2**, calcule l\'**indice saisonnier de décembre** (ventes de décembre ÷ moyenne mensuelle), **arrondi à 2 décimales**.',
      generate() {
        const base = int(400, 900, 10)
        const shape = [0.8, 0.75, 0.85, 0.9, 0.95, 0.9, 0.8, 0.75, 1.0, 1.05, 1.25, int(14, 20) / 10]
        return { rows: [['Mois', 'Ventes'], ...MONTHS.map((m, i) => [m, Math.round((base * shape[i]) / 5) * 5])], extra: { C2: 'Indice décembre' } }
      },
      target: 'D2',
      solution: '=ARRONDI(B13/MOYENNE(B2:B13);2)',
      mustUse: ['MOYENNE', 'ARRONDI'],
      hints: ['Les ventes de décembre sont en B13.', 'Divise-les par la moyenne de toute l\'année MOYENNE(B2:B13), puis arrondis à 2 décimales.'],
      explain: 'Un indice supérieur à 1 indique un mois plus fort que la moyenne : par exemple 1,6 signifie que décembre vend 60 % de plus que le mois moyen.',
    },
    {
      id: 'biais-prevision',
      fn: 'SOMME',
      level: 3,
      tier: 5,
      title: 'Le biais de prévision',
      context: 'Ton manager veut savoir si tes prévisions sont systématiquement trop hautes ou trop basses.',
      instruction: 'En **D8**, calcule le **biais** : (total des prévisions − total des ventes réelles) ÷ nombre de mois, **arrondi à 1 décimale**.',
      generate() {
        const bias = int(-20, 25, 5)
        return { rows: [['Mois', 'Réel', 'Prévu'], ...MONTHS.slice(0, 6).map((m) => { const r = int(80, 160, 5); return [m, r, r + bias + int(-15, 15, 5)] })], extra: { C8: 'Biais' } }
      },
      target: 'D8',
      solution: '=ARRONDI((SOMME(C2:C7)-SOMME(B2:B7))/NB(B2:B7);1)',
      mustUse: ['SOMME', 'NB', 'ARRONDI'],
      hints: ['Total des prévus : SOMME(C2:C7) ; total des réels : SOMME(B2:B7).', 'Divise la différence par le nombre de mois NB(B2:B7), puis arrondis à 1 décimale.'],
      explain: 'Le biais est l\'erreur moyenne avec son signe : positif, on sur-prévoit ; négatif, on sous-prévoit. Il ne dépend pas de la valeur absolue des erreurs, contrairement au MAPE.',
    },
  ],

  cases: [
    {
      id: 'choix-methode-prevision',
      title: 'Quelle méthode de prévision garder ?',
      role: "Planificateur de la demande dans une entreprise de produits grand public",
      lesson: 'prevision/erreur-biais',
      generate() {
        const base = int(800, 2500, 50)
        const real = Array.from({ length: 6 }, () => Math.round((base * (1 + int(-15, 15) / 100)) / 10) * 10)
        const fa = real.map((r) => Math.round((r * (1 + int(-6, 6) / 100)) / 10) * 10)
        const fb = real.map((r) => Math.round((r * (1 + int(9, 13) / 100)) / 10) * 10)
        const mape = (f) => mean(real.map((r, i) => (Math.abs(f[i] - r) / r) * 100))
        const bias = (f) => mean(real.map((r, i) => f[i] - r))
        const mA = mape(fa)
        const mB = mape(fb)
        const bB = bias(fb)
        const bA = bias(fa)
        return {
          intro: `Sur les 6 derniers mois, les ventes réelles étaient : ${real.join(', ')}. La méthode A avait prévu : ${fa.join(', ')}. La méthode B : ${fb.join(', ')}.`,
          steps: [
            {
              situation: 'Quelle méthode est la plus précise ?',
              better: `Le MAPE de A est ${fmt(mA, 1)} % contre ${fmt(mB, 1)} % pour B : A se trompe moins en moyenne. B prévoit presque toujours plus que le réel, ce qui peut sembler « prudent » mais crée un surstock.`,
              choices: [
                { text: `La méthode A, avec un MAPE de ${fmt(mA, 1)} % contre ${fmt(mB, 1)} %.`, points: 3, feedback: `Le MAPE le plus bas désigne la méthode la plus précise : A (${fmt(mA, 1)} %) contre B (${fmt(mB, 1)} %).` },
                { text: 'La méthode B, car ses prévisions sont toujours plus hautes, donc plus prudentes.', points: 0, feedback: `Des prévisions toujours trop hautes (biais de +${fmt(bB, 0)} unités par mois) créent du surstock : ce n'est pas de la prudence, c'est une erreur.` },
                { text: 'Aucune : on ne peut pas comparer deux méthodes.', points: 1, feedback: 'On peut les comparer : avec les mêmes données réelles, le MAPE et le biais permettent de juger objectivement.' },
              ],
            },
            {
              situation: `Le biais de B est de +${fmt(bB, 0)} unités par mois (A : ${fmt(bA, 0)}). Que fais-tu de ce biais ?`,
              better: `Un biais constant de ${fmt(bB, 0)} unités se corrige : on recale la méthode ou on retire cet écart des prévisions. À l'inverse, des erreurs aléatoires comme celles de A se couvrent avec du stock de sécurité.`,
              choices: [
                { text: "Je le corrige, car un biais constant se corrige facilement.", points: 3, feedback: `Un écart systématique de ${fmt(bB, 0)} unités peut être retiré ou intégré à la méthode : il ne demande pas de stock supplémentaire.` },
                { text: 'Je l\'ignore : les erreurs se compensent avec le temps.', points: 0, feedback: `Ici elles ne se compensent pas : B se trompe toujours dans le même sens, de ${fmt(bB, 0)} unités par mois, donc le surstock s'accumule.` },
                { text: 'J\'abandonne toute prévision statistique.', points: 1, feedback: 'Les prévisions restent utiles : c\'est leur biais qu\'il faut corriger, pas la démarche qu\'il faut abandonner.' },
              ],
            },
            {
              situation: 'Comment améliorer encore la fiabilité de la prévision ?',
              better: 'Une prévision statistique ne connaît pas les promotions ni les lancements. Un S&OP mensuel réunit ventes, marketing et opérations : il ajoute ces informations et aligne les capacités.',
              choices: [
                { text: 'Un S&OP mensuel pour intégrer les informations commerciales.', points: 3, feedback: 'Les ventes et le marketing connaissent des événements invisibles pour l\'historique : le S&OP les intègre au plan commun.' },
                { text: 'Augmenter systématiquement toutes les prévisions de 10 %.', points: 0, feedback: 'Cela ajouterait un biais artificiel, donc du surstock, sans améliorer la compréhension de la demande.' },
                { text: 'Prendre la prévision du commercial sans la comparer à l\'historique.', points: 1, feedback: 'L\'avis des commerciaux est précieux mais souvent optimiste : on le confronte à l\'historique et aux capacités.' },
              ],
            },
          ],
          debrief: `On compare les méthodes avec le MAPE (ici A : ${fmt(mA, 1)} %, B : ${fmt(mB, 1)} %), on corrige les biais (B : +${fmt(bB, 0)} unités) et on enrichit la prévision avec l'information commerciale via un S&OP.`,
        }
      },
    },
    {
      id: 'sop-ecart',
      title: 'Un écart au S&OP',
      role: "Responsable planification d'un fabricant de boissons",
      lesson: 'prevision/sop',
      intro:
        "En réunion S&OP, le service commercial annonce une forte promotion en juillet : la demande passerait de 100 000 à 135 000 caisses (+35 %). Ton usine peut produire au maximum 115 000 caisses par mois en conditions normales, et 125 000 avec des heures supplémentaires. Le stock actuel est de 8 000 caisses.",
      steps: [
        {
          situation: 'Quelle est ta première analyse ?',
          better:
            "L'écart est de 135 000 − 115 000 = 20 000 caisses par rapport à la capacité normale. Avec les heures supplémentaires (125 000) et le stock actuel (8 000), il manquerait encore 2 000 caisses. Il faut donc chiffrer les scénarios avant de décider.",
          choices: [
            { text: 'Je chiffre l\'écart (20 000 caisses) et les options pour le couvrir.', points: 3, feedback: 'Un écart chiffré (capacité 115 000, heures sup 125 000, stock 8 000) permet de comparer les leviers au lieu de discuter dans le vide.' },
            { text: 'J\'accepte la promotion sans analyse : le commerce sait ce qu\'il fait.', points: 0, feedback: 'Sans vérifier la capacité, tu t\'exposes à des ruptures en pleine promotion : exactement ce que le S&OP doit éviter.' },
            { text: 'Je refuse la promotion : l\'usine ne peut pas suivre.', points: 1, feedback: 'Un refus brutal ignore des solutions possibles : heures supplémentaires, stock anticipé, sous-traitance.' },
          ],
        },
        {
          situation: 'Quelle combinaison de leviers proposes-tu ?',
          better:
            "En juin, la capacité (115 000) dépasse la demande (100 000) : 15 000 caisses peuvent être stockées d'avance. Avec ce stock, les 8 000 déjà en réserve et 125 000 produites en juillet (heures supplémentaires), tu disposes de 148 000 caisses pour 135 000 de demande : l'écart est couvert sans sous-traiter.",
          choices: [
            { text: 'Du stock anticipé avant juillet, plus des heures supplémentaires en juillet.', points: 3, feedback: 'Tu utilises la capacité disponible les mois précédents et le surplus ponctuel d\'heures supplémentaires : le coût reste maîtrisé.' },
            { text: 'Uniquement des heures supplémentaires.', points: 1, feedback: 'La capacité maximale (125 000) n\'atteint pas 135 000 : il manquerait de la marchandise pour tout satisfaire.' },
            { text: 'Rien : on verra en juillet.', points: 0, feedback: 'Attendre juillet ne laisse plus le temps de produire ou de s\'approvisionner : la rupture serait certaine.' },
          ],
        },
        {
          situation: 'Quelle décision prends-tu en réunion de décision S&OP ?',
          better:
            "Le S&OP existe pour trancher avec les chiffres : valider la promotion avec un plan de production précis, un budget d'heures supplémentaires et un suivi des ventes réelles permet de corriger le tir si la demande dépasse ou n'atteint pas 135 000.",
          choices: [
            { text: 'Je valide la promotion avec un plan précis et un suivi hebdomadaire des ventes.', points: 3, feedback: 'La décision est prise, mais encadrée : plan chiffré, coûts connus et suivi pour ajuster rapidement.' },
            { text: 'Je valide sans plan : on s\'adaptera.', points: 0, feedback: 'Sans plan, les équipes ne savent pas quoi produire ni quand : les ruptures ou les surstocks sont probables.' },
            { text: 'Je reporte la décision au mois suivant.', points: 1, feedback: 'Reporter fait perdre un mois : la promotion arrivera avant que la production ne soit prête.' },
          ],
        },
      ],
      debrief:
        "Le S&OP transforme un désaccord (« on veut vendre plus » contre « on ne peut pas produire plus ») en décision chiffrée : on mesure l'écart, on combine les leviers (stock anticipé, heures supplémentaires) et on suit les résultats pour corriger.",
    },
  ],

  english: {
    extend: {
      prevision: [
        {
          id: 'previsions-en',
          title: 'Prévoir la demande',
          level: 2,
          items: [
            { en: 'trend', fr: 'tendance', def: "Évolution lente et durable d'un chiffre, à la hausse ou à la baisse.", ex: 'Sales show a clear upward trend.', exFr: 'Les ventes montrent une nette tendance à la hausse.' },
            { en: 'seasonality', fr: 'saisonnalité', def: "Variations qui reviennent chaque année à la même période.", ex: 'Seasonality affects our toy sales.', exFr: 'La saisonnalité touche nos ventes de jouets.' },
            { en: 'accuracy', fr: 'précision', def: "Degré auquel une prévision est proche de la réalité.", ex: 'Forecast accuracy improved this year.', exFr: 'La précision des prévisions s\'est améliorée cette année.' },
            { en: 'bias', fr: 'biais', def: "Tendance à se tromper toujours dans le même sens.", ex: 'The forecast has a positive bias.', exFr: 'La prévision a un biais positif.' },
            { en: 'outlier', fr: 'valeur aberrante', def: "Donnée très éloignée des autres, souvent due à un événement exceptionnel.", ex: 'We removed the outlier from the data.', exFr: 'Nous avons retiré la valeur aberrante des données.' },
            { en: 'promotion', fr: 'promotion', def: "Action commerciale qui baisse le prix ou met un produit en avant pour vendre plus.", ex: 'The promotion starts in July.', exFr: 'La promotion commence en juillet.', note: 'Piège : « promotion » veut aussi dire avancement professionnel.' },
          ],
        },
        {
          id: 'planification-en',
          title: 'Planifier et décider',
          level: 2,
          items: [
            { en: 'constraint', fr: 'contrainte', def: "Limite qui empêche de faire tout ce que l'on voudrait : capacité, budget, délai.", ex: 'Capacity is our main constraint.', exFr: 'La capacité est notre principale contrainte.' },
            { en: 'scenario', fr: 'scénario', def: "Hypothèse sur ce qui pourrait arriver, étudiée avec des chiffres.", ex: 'We tested three different scenarios.', exFr: 'Nous avons testé trois scénarios différents.' },
            { en: 'assumption', fr: 'hypothèse', def: "Élément que l'on suppose vrai pour construire un plan ou un calcul.", ex: 'This plan is based on one assumption.', exFr: 'Ce plan repose sur une hypothèse.' },
            { en: 'target', fr: 'objectif (cible)', def: "Résultat précis que l'on veut atteindre.", ex: 'Our target is ninety-eight percent.', exFr: 'Notre objectif est de quatre-vingt-dix-huit pour cent.' },
            { en: 'gap', fr: 'écart', def: "Différence entre ce qui est demandé et ce qui est possible.", ex: 'There is a gap between demand and capacity.', exFr: 'Il y a un écart entre la demande et la capacité.' },
            { en: 'consensus', fr: 'consensus (accord)', def: "Accord général trouvé entre plusieurs personnes ou services.", ex: 'We need a consensus before the meeting.', exFr: 'Nous avons besoin d\'un consensus avant la réunion.' },
          ],
        },
      ],
    },
  },
}
