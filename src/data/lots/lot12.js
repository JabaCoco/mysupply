// Lot 12 — Lean : Atelier (3 formules, 3 défis Excel, 2 études de cas) + Anglais (verbes à particule, conversation au travail).
import { fmt, int, pick } from '../gen.js'

export default {
  formulas: [
    {
      id: 'takt-time',
      title: 'Le takt time',
      short: 'Takt = temps disponible / demande client',
      course: {
        purpose:
          "Le **takt time** est le rythme auquel il faut produire pour **suivre exactement la demande** des clients. Il donne le temps maximum à consacrer à chaque unité. S'il est inférieur au temps de cycle réel d'un poste, ce poste ne tiendra pas la cadence.",
        formulas: ['Takt time = temps de travail disponible / demande à satisfaire', 'Temps de cycle ≤ takt time pour tenir le rythme', 'Nombre d\'opérateurs ≈ temps total de travail / takt time'],
        terms: [
          ['Temps disponible', 'Temps de production réel (journée moins pauses et arrêts planifiés).'],
          ['Demande', 'Quantité à livrer sur la même période.'],
          ['Temps de cycle', 'Temps réel pour produire une unité à un poste.'],
        ],
        example: {
          statement: 'Une équipe travaille 7 h par jour effectives (25 200 s) et doit livrer 420 unités par jour.',
          steps: ['Takt = 25 200 / 420 = 60 secondes par unité', 'Un poste qui met 75 s par unité ne tiendra pas la cadence', 'Il faudra un 2e poste ou réduire son temps de cycle sous 60 s'],
          result: 'Le takt time est de 60 secondes : une unité doit sortir toutes les minutes.',
        },
        exercises: [
          () => {
            const h = pick([7, 7.5, 8])
            const demand = int(200, 800, 20)
            return {
              kind: 'number',
              statement: 'Calcule le takt time.',
              data: [['Temps disponible par jour', `${fmt(h)} heures`], ['Demande par jour', `${demand} unités`]],
              question: 'Takt time (en secondes par unité) ?',
              answer: (h * 3600) / demand,
              unit: 's',
              tolerance: 0.5,
              steps: [`Temps disponible = ${fmt(h)} × 3 600 = ${fmt(h * 3600, 0)} s`, `Takt = ${fmt(h * 3600, 0)} / ${demand} = ${fmt((h * 3600) / demand, 1)} s`],
              conclusion: 'Si le temps de cycle d\'un poste est supérieur au takt, ce poste est un goulot.',
            }
          },
          () => {
            const takt = int(40, 120, 5)
            const hours = pick([7, 8])
            return {
              kind: 'number',
              statement: 'À partir du takt time, calcule la production quotidienne nécessaire.',
              data: [['Takt time', `${takt} s`], ['Temps disponible', `${hours} heures`]],
              question: 'Unités à produire par jour ?',
              answer: (hours * 3600) / takt,
              unit: 'unités',
              tolerance: 1,
              steps: [`${hours} × 3 600 = ${fmt(hours * 3600, 0)} s`, `${fmt(hours * 3600, 0)} / ${takt} = ${fmt((hours * 3600) / takt, 0)} unités`],
              conclusion: 'Le takt relie directement le rythme de l\'usine à la demande à servir.',
            }
          },
          () => {
            const takt = int(50, 90, 10)
            const cycles = [int(40, 100, 5), int(40, 100, 5), int(40, 100, 5)]
            const total = cycles.reduce((a, b) => a + b, 0)
            return {
              kind: 'number',
              statement: 'Combien d\'opérateurs faut-il au minimum pour tenir le takt ? (arrondi au supérieur)',
              data: [['Takt time', `${takt} s`], ['Temps de travail de chaque tâche', cycles.map((c) => `${c} s`).join(' / ')]],
              question: 'Nombre minimum d\'opérateurs ?',
              answer: Math.ceil(total / takt),
              unit: '',
              tolerance: 0.1,
              steps: [`Total des temps = ${cycles.join(' + ')} = ${total} s`, `${total} / ${takt} = ${fmt(total / takt, 2)} → ${Math.ceil(total / takt)} opérateurs`],
              conclusion: 'On arrondit toujours au supérieur : on ne peut pas employer une fraction d\'opérateur.',
            }
          },
          () => {
            const takt = int(40, 100, 10)
            const cycle = takt + int(5, 30, 5)
            const hours = 7
            return {
              kind: 'number',
              statement: 'Un poste a un temps de cycle supérieur au takt. Combien d\'unités manque-t-il par jour ?',
              data: [['Takt time', `${takt} s`], ['Temps de cycle du poste', `${cycle} s`], ['Temps disponible', `${hours} heures`]],
              question: 'Unités manquantes par jour ?',
              answer: (hours * 3600) / takt - (hours * 3600) / cycle,
              unit: 'unités',
              tolerance: 1,
              steps: [`Demande = ${hours * 3600} / ${takt} = ${fmt((hours * 3600) / takt, 1)}`, `Capacité = ${hours * 3600} / ${cycle} = ${fmt((hours * 3600) / cycle, 1)}`, `Manque = ${fmt((hours * 3600) / takt - (hours * 3600) / cycle, 0)} unités`],
              conclusion: 'Ce poste limite toute la ligne : il faut réduire son temps de cycle ou en ajouter un deuxième.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'h', label: 'Temps disponible par jour', unit: 'heures', value: 7 },
            { key: 'd', label: 'Demande par jour', unit: 'unités', value: 420 },
            { key: 'work', label: 'Temps de travail total par unité', unit: 's', value: 150 },
          ],
          outputs: [
            { label: 'Takt time', unit: 's', digits: 1, highlight: true, fn: (n) => (n.d > 0 ? (n.h * 3600) / n.d : 0) },
            { label: 'Opérateurs nécessaires (mini)', unit: '', digits: 1, fn: (n) => (n.d > 0 && n.h > 0 ? n.work / ((n.h * 3600) / n.d) : 0) },
          ],
          steps: (n) => [`Takt = ${fmt(n.h)} × 3 600 / ${fmt(n.d)} = ${fmt(n.d > 0 ? (n.h * 3600) / n.d : 0, 1)} s`],
          note: 'Arrondis le nombre d\'opérateurs au supérieur.',
        },
      },
    },

    {
      id: 'kanban-cartes',
      title: 'Nombre de cartes Kanban',
      short: 'N = D × L × (1 + S) / C',
      course: {
        purpose:
          "Le **Kanban** plafonne le stock en circulation par le **nombre de cartes**. Pour le dimensionner, on couvre la consommation pendant le **délai de réapprovisionnement**, avec une **marge de sécurité**, et on divise par la **quantité d'un bac**.",
        formulas: ['N = D × L × (1 + S) / C (arrondi au supérieur)', 'Stock maximal = N × C'],
        terms: [
          ['D', 'Consommation par unité de temps.'],
          ['L', 'Délai de réapprovisionnement (même unité de temps).'],
          ['S', 'Coefficient de sécurité (0,1 = 10 %).'],
          ['C', 'Quantité d\'un bac (une carte).'],
        ],
        example: {
          statement: 'D = 120 pièces/h, L = 2 h, S = 0,1, C = 50 pièces.',
          steps: ['Besoin pendant le délai = 120 × 2 = 240 pièces', 'Avec sécurité = 240 × 1,1 = 264 pièces', 'N = 264 / 50 = 5,28 → 6 cartes ; stock maximal = 6 × 50 = 300 pièces'],
          result: '6 cartes de 50 pièces permettent de couvrir la consommation pendant le délai de réapprovisionnement.',
        },
        exercises: [
          () => {
            const D = int(60, 240, 20)
            const L = pick([1, 2, 3])
            const S = pick([0.1, 0.2])
            const C = pick([25, 40, 50, 60])
            const n = (D * L * (1 + S)) / C
            return {
              kind: 'number',
              statement: 'Calcule le nombre de cartes Kanban (arrondi au supérieur).',
              data: [['Consommation', `${D} pièces/h`], ['Délai', `${L} h`], ['Sécurité', fmt(S)], ['Quantité par bac', `${C} pièces`]],
              question: 'Nombre de cartes ?',
              answer: Math.ceil(n),
              unit: 'cartes',
              tolerance: 0.1,
              steps: [`Besoin = ${D} × ${L} × ${fmt(1 + S)} = ${fmt(D * L * (1 + S), 1)}`, `N = ${fmt(D * L * (1 + S), 1)} / ${C} = ${fmt(n, 2)} → ${Math.ceil(n)}`],
              conclusion: 'On arrondit au supérieur pour ne pas manquer de pièces.',
            }
          },
          () => {
            const N = int(4, 14)
            const C = pick([20, 25, 40, 50])
            return {
              kind: 'number',
              statement: 'Calcule le stock maximal du circuit Kanban.',
              data: [['Nombre de cartes', String(N)], ['Quantité par bac', `${C} pièces`]],
              question: 'Stock maximal (en pièces) ?',
              answer: N * C,
              unit: 'pièces',
              tolerance: 0.5,
              steps: [`${N} × ${C} = ${fmt(N * C, 0)} pièces`],
              conclusion: 'Le nombre de cartes plafonne le stock : en retirer réduit les en-cours.',
            }
          },
          () => {
            const D = int(60, 200, 20)
            const C = pick([25, 40, 50])
            const L1 = int(2, 4)
            const L2 = Math.max(1, L1 - 1)
            const n1 = Math.ceil((D * L1 * 1.1) / C)
            const n2 = Math.ceil((D * L2 * 1.1) / C)
            return {
              kind: 'number',
              statement: 'On réduit le délai de réapprovisionnement. Combien de cartes économise-t-on ? (S = 0,1)',
              data: [['Consommation', `${D} pièces/h`], ['Délai avant → après', `${L1} h → ${L2} h`], ['Quantité par bac', `${C} pièces`]],
              question: 'Cartes économisées ?',
              answer: n1 - n2,
              unit: 'cartes',
              tolerance: 0.1,
              steps: [`Avant : ${fmt(D * L1 * 1.1, 1)} / ${C} → ${n1} cartes`, `Après : ${fmt(D * L2 * 1.1, 1)} / ${C} → ${n2} cartes`, `Économie = ${n1 - n2}`],
              conclusion: 'Un délai plus court permet de réduire les stocks sans augmenter le risque.',
            }
          },
          () => {
            const N = int(5, 15)
            const C = pick([20, 25, 40, 50])
            const price = int(3, 20)
            return {
              kind: 'number',
              statement: 'Calcule la valeur du stock maximal du circuit Kanban.',
              data: [['Cartes', String(N)], ['Pièces par bac', String(C)], ['Valeur d\'une pièce', `${price} €`]],
              question: 'Valeur du stock maximal (en €) ?',
              answer: N * C * price,
              unit: '€',
              tolerance: 1,
              steps: [`Pièces = ${N} × ${C} = ${N * C}`, `Valeur = ${N * C} × ${price} = ${fmt(N * C * price, 0)} €`],
              conclusion: 'Cette valeur est le capital immobilisé par le circuit au maximum.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'D', label: 'Consommation par heure', unit: 'pièces/h', value: 120 },
            { key: 'L', label: 'Délai de réapprovisionnement', unit: 'h', value: 2 },
            { key: 'S', label: 'Coefficient de sécurité', value: 0.1 },
            { key: 'C', label: 'Quantité par bac', unit: 'pièces', value: 50 },
          ],
          outputs: [
            { label: 'Nombre de cartes (brut)', unit: '', digits: 2, fn: (n) => (n.C > 0 ? (n.D * n.L * (1 + n.S)) / n.C : 0) },
            { label: 'Cartes à prévoir', unit: 'cartes', digits: 0, highlight: true, fn: (n) => (n.C > 0 ? Math.ceil((n.D * n.L * (1 + n.S)) / n.C) : 0) },
            { label: 'Stock maximal', unit: 'pièces', digits: 0, fn: (n) => (n.C > 0 ? Math.ceil((n.D * n.L * (1 + n.S)) / n.C) * n.C : 0) },
          ],
          steps: (n) => [`N = ${fmt(n.D)} × ${fmt(n.L)} × ${fmt(1 + n.S)} / ${fmt(n.C)}`],
          note: 'Le nombre de cartes est toujours arrondi au supérieur.',
        },
      },
    },

    {
      id: 'dpmo-sigma',
      title: 'DPMO et niveau de qualité',
      short: 'DPMO = défauts / (unités × opportunités) × 1 000 000',
      course: {
        purpose:
          "Le **DPMO** (défauts par million d'opportunités) mesure la qualité d'un processus en tenant compte de sa complexité. Plus il est faible, plus le processus est fiable. Le niveau « 6 sigma » correspond à 3,4 DPMO.",
        formulas: ['DPMO = défauts / (unités × opportunités par unité) × 1 000 000', 'Taux sans défaut = 100 % − DPMO / 10 000', 'Rendement = unités bonnes / unités produites'],
        terms: [
          ['Défaut', 'Une non-conformité constatée.'],
          ['Opportunité', 'Une façon d\'avoir un défaut sur une unité (un champ à remplir, une étape à réaliser).'],
          ['DPMO', 'Défauts rapportés à un million d\'opportunités.'],
        ],
        example: {
          statement: '250 erreurs sur 2 000 commandes de 5 champs chacune.',
          steps: ['Opportunités totales = 2 000 × 5 = 10 000', 'DPMO = 250 / 10 000 × 1 000 000 = 25 000', 'Taux sans défaut = 100 − 2,5 = 97,5 %'],
          result: 'Avec 25 000 DPMO, le processus est autour du niveau 3,5 sigma : encore loin du 6 sigma.',
        },
        exercises: [
          () => {
            const units = int(1000, 5000, 500)
            const opp = pick([3, 4, 5, 8])
            const defects = int(20, 200, 10)
            return {
              kind: 'number',
              statement: 'Calcule le DPMO du processus.',
              data: [['Unités contrôlées', fmt(units)], ['Opportunités par unité', String(opp)], ['Défauts constatés', String(defects)]],
              question: 'DPMO ?',
              answer: (defects / (units * opp)) * 1000000,
              unit: 'DPMO',
              tolerance: 5,
              steps: [`Opportunités = ${fmt(units)} × ${opp} = ${fmt(units * opp, 0)}`, `DPMO = ${defects} / ${fmt(units * opp, 0)} × 1 000 000 = ${fmt((defects / (units * opp)) * 1000000, 0)}`],
              conclusion: 'Compter les opportunités permet de comparer des processus de complexités différentes.',
            }
          },
          () => {
            const dpmo = pick([5000, 10000, 20000, 30000, 60000])
            return {
              kind: 'number',
              statement: 'Convertis le DPMO en taux de réussite.',
              data: [['DPMO', fmt(dpmo)]],
              question: 'Pourcentage sans défaut (en %) ?',
              answer: 100 - dpmo / 10000,
              unit: '%',
              tolerance: 0.05,
              steps: [`${fmt(dpmo)} / 1 000 000 = ${fmt(dpmo / 10000, 2)} % de défauts`, `Sans défaut = 100 − ${fmt(dpmo / 10000, 2)} = ${fmt(100 - dpmo / 10000, 2)} %`],
              conclusion: 'Un taux de 99 % semble excellent, mais correspond encore à 10 000 DPMO.',
            }
          },
          () => {
            const units = int(2, 10) * 1000
            const bad = int(20, 200, 10)
            return {
              kind: 'number',
              statement: 'Calcule le rendement (unités bonnes sur unités produites).',
              data: [['Unités produites', fmt(units)], ['Unités défectueuses', String(bad)]],
              question: 'Rendement (en %) ?',
              answer: ((units - bad) / units) * 100,
              unit: '%',
              tolerance: 0.05,
              steps: [`Bonnes = ${fmt(units)} − ${bad} = ${fmt(units - bad, 0)}`, `Rendement = ${fmt(units - bad, 0)} / ${fmt(units)} × 100 = ${fmt(((units - bad) / units) * 100, 2)} %`],
              conclusion: 'Le rendement est simple, mais il ne dit rien de la complexité de chaque unité.',
            }
          },
          () => {
            const before = pick([20000, 30000, 40000, 50000])
            const cut = pick([30, 40, 50, 60])
            return {
              kind: 'number',
              statement: 'Un projet réduit le DPMO d\'un pourcentage donné. Calcule le nouveau DPMO.',
              data: [['DPMO initial', fmt(before)], ['Réduction', `${cut} %`]],
              question: 'Nouveau DPMO ?',
              answer: before * (1 - cut / 100),
              unit: 'DPMO',
              tolerance: 5,
              steps: [`${fmt(before)} × (1 − ${cut} %) = ${fmt(before * (1 - cut / 100), 0)}`],
              conclusion: 'Passer de 6 sigma à 3,4 DPMO supposerait des réductions successives très importantes.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'units', label: 'Unités contrôlées', value: 2000 },
            { key: 'opp', label: 'Opportunités par unité', value: 5 },
            { key: 'def', label: 'Défauts constatés', value: 250 },
          ],
          outputs: [
            { label: 'DPMO', unit: '', digits: 0, highlight: true, fn: (n) => (n.units > 0 && n.opp > 0 ? (n.def / (n.units * n.opp)) * 1000000 : 0) },
            { label: 'Taux sans défaut', unit: '%', digits: 3, fn: (n) => (n.units > 0 && n.opp > 0 ? 100 - (n.def / (n.units * n.opp)) * 100 : 0) },
          ],
          steps: (n) => [`Opportunités = ${fmt(n.units)} × ${fmt(n.opp)} = ${fmt(n.units * n.opp)}`],
          note: '6 sigma correspond à 3,4 DPMO.',
        },
      },
    },
  ],

  excel: [
    {
      id: 'takt-excel',
      fn: 'ARRONDI',
      level: 2,
      tier: 5,
      title: 'Calculer le takt time',
      context: "Tu cherches le rythme auquel l'équipe doit produire pour suivre la demande.",
      instruction: 'En **B4**, calcule le **takt time en secondes** : (heures disponibles × 3 600) ÷ demande, **arrondi à 1 décimale**.',
      generate() {
        return { rows: [['Heures disponibles', pick([7, 7.5, 8])], ['Demande par jour', int(200, 800, 20)], ['Équipes', 1]], extra: { A4: 'Takt time (s)' } }
      },
      target: 'B4',
      solution: '=ARRONDI(B1*3600/B2;1)',
      mustUse: ['ARRONDI'],
      hints: ['Convertis les heures en secondes : B1*3600.', 'Divise par la demande B2, puis arrondis à 1 décimale.'],
      explain: 'Le takt time rapporte le temps disponible (en secondes) à la demande : il indique le rythme de sortie à tenir.',
    },
    {
      id: 'cartes-kanban-excel',
      fn: 'ARRONDI.SUP',
      level: 3,
      tier: 5,
      title: 'Le nombre de cartes Kanban',
      context: 'Tu dimensionnes un circuit Kanban entre deux postes.',
      instruction: 'En **B5**, calcule le **nombre de cartes** : consommation × délai × (1 + sécurité) ÷ quantité par bac, **arrondi à l\'entier supérieur**.',
      generate() {
        return { rows: [['Consommation par heure', int(60, 240, 20)], ['Délai (h)', int(1, 3)], ['Coefficient de sécurité', pick([0.1, 0.2])], ['Quantité par bac', pick([25, 40, 50, 60])]], extra: { A5: 'Cartes Kanban' } }
      },
      target: 'B5',
      solution: '=ARRONDI.SUP(B1*B2*(1+B3)/B4;0)',
      mustUse: ['ARRONDI.SUP'],
      hints: ['La formule est B1*B2*(1+B3)/B4.', 'ARRONDI.SUP(… ; 0) arrondit à l\'entier supérieur.'],
      explain: 'On arrondit au supérieur : avec 5,28 cartes, il en faut 6 sinon le circuit manquerait de pièces.',
    },
    {
      id: 'dpmo-excel',
      fn: 'ARRONDI',
      level: 3,
      tier: 5,
      title: 'Le DPMO',
      context: 'Tu mesures la qualité de la saisie des commandes.',
      instruction: 'En **B4**, calcule le **DPMO** : défauts ÷ (unités × opportunités) × 1 000 000, **arrondi à l\'entier**.',
      generate() {
        return { rows: [['Commandes contrôlées', int(1000, 5000, 500)], ['Opportunités par commande', pick([3, 4, 5, 8])], ['Défauts constatés', int(20, 200, 10)]], extra: { A4: 'DPMO' } }
      },
      target: 'B4',
      solution: '=ARRONDI(B3/(B1*B2)*1000000;0)',
      mustUse: ['ARRONDI'],
      hints: ['Opportunités totales = B1*B2.', 'Divise les défauts B3 par ce total, multiplie par 1 000 000 puis arrondis.'],
      explain: 'Le DPMO rapporte les défauts au nombre total d\'opportunités de défaut : on peut ainsi comparer des processus plus ou moins complexes.',
    },
  ],

  cases: [
    {
      id: 'kanban-mise-en-place',
      title: 'Mettre en place un Kanban',
      role: "Responsable de ligne dans une usine d'équipements électriques",
      lesson: 'lean/kanban',
      generate() {
        const D = int(60, 200, 20)
        const L = int(2, 4)
        const C = pick([25, 40, 50])
        const S = 0.1
        const n = Math.ceil((D * L * (1 + S)) / C)
        const maxStock = n * C
        const current = int(4, 8) * maxStock / 2 + maxStock
        return {
          intro: `Un composant est consommé à ${D} pièces par heure. Son délai de réapprovisionnement depuis le magasin est de ${L} heures. Aujourd'hui, le poste garde ${fmt(current, 0)} pièces en stock « pour être tranquille ». On te propose un Kanban avec des bacs de ${C} pièces et 10 % de sécurité.`,
          steps: [
            {
              situation: 'Combien de cartes Kanban prévois-tu ?',
              better: `N = (${D} × ${L} × 1,1) / ${C} = ${fmt((D * L * 1.1) / C, 2)} → ${n} cartes (arrondi au supérieur), soit ${fmt(maxStock, 0)} pièces au maximum dans le circuit.`,
              choices: [
                { text: `${n} cartes, arrondi au supérieur.`, points: 3, feedback: `(${D} × ${L} × 1,1) / ${C} = ${fmt((D * L * 1.1) / C, 2)} : arrondi au supérieur, ${n} cartes.` },
                { text: `${Math.max(1, n - 1)} cartes, arrondi à l'inférieur.`, points: 0, feedback: 'Arrondir à l\'inférieur ferait manquer des pièces pendant le délai de réapprovisionnement.' },
                { text: `${n * 3} cartes, par sécurité.`, points: 1, feedback: 'Multiplier les cartes recrée le stock excessif que le Kanban veut supprimer.' },
              ],
            },
            {
              situation: `Quel gain de stock obtient-on par rapport aux ${fmt(current, 0)} pièces actuelles ?`,
              better: `Le stock maximal passe de ${fmt(current, 0)} à ${fmt(maxStock, 0)} pièces : environ ${fmt(current - maxStock, 0)} pièces en moins immobilisées. Le circuit couvre la consommation pendant le délai, avec 10 % de marge.`,
              choices: [
                { text: `Environ ${fmt(current - maxStock, 0)} pièces en moins.`, points: 3, feedback: `${fmt(current, 0)} − ${fmt(maxStock, 0)} = ${fmt(current - maxStock, 0)} pièces libérées.` },
                { text: 'Aucun gain : le stock reste le même.', points: 0, feedback: 'Le nombre de cartes plafonne le stock : il est ramené à ' + fmt(maxStock, 0) + ' pièces.' },
                { text: 'Le stock augmente, mais il est mieux rangé.', points: 1, feedback: 'Le Kanban réduit le stock au niveau nécessaire, il ne l\'augmente pas.' },
              ],
            },
            {
              situation: 'Quel risque surveilles-tu après la mise en place ?',
              better: "Avec moins de stock, une perturbation (panne, retard du magasin) peut provoquer une rupture. On suit le temps de retour des bacs, on traite chaque rupture comme un signal à analyser (cause racine) et on ajuste le nombre de cartes seulement après analyse.",
              choices: [
                { text: 'Je suis les retours de bacs et j\'analyse chaque rupture avant d\'ajuster.', points: 3, feedback: 'Le Kanban rend les problèmes visibles : on les corrige à la racine au lieu de remettre du stock.' },
                { text: 'Je rajoute des cartes dès la première rupture.', points: 1, feedback: 'Cela recrée le stock et masque la cause ; mieux vaut d\'abord comprendre pourquoi le bac n\'est pas revenu.' },
                { text: 'Je ne surveille rien : le système se règle seul.', points: 0, feedback: 'Un Kanban se vit : sans suivi, les dérives (bacs bloqués, délais allongés) créent des ruptures.' },
              ],
            },
          ],
          debrief: `Le circuit Kanban de ${n} cartes plafonne le stock à ${fmt(maxStock, 0)} pièces (contre ${fmt(current, 0)}). On surveille les retours de bacs et on traite chaque rupture comme un problème à résoudre.`,
        }
      },
    },
    {
      id: 'smed-presse',
      title: 'Réduire les réglages de la presse',
      role: "Responsable amélioration continue dans une usine de plasturgie",
      lesson: 'lean/smed',
      generate() {
        const changes = int(8, 20)
        const before = int(50, 100, 5)
        const target = before - int(20, 40, 5)
        const gainMin = changes * (before - target)
        const costMin = int(3, 8)
        return {
          intro: `Une presse subit ${changes} changements de moule par semaine, de ${before} minutes chacun, pendant lesquels elle ne produit pas. Elle coûte ${costMin} € par minute d'arrêt. L'équipe vise ${target} minutes par changement grâce au SMED.`,
          steps: [
            {
              situation: 'Quel est le gain hebdomadaire visé, en minutes et en euros ?',
              better: `Gain = ${changes} × (${before} − ${target}) = ${fmt(gainMin, 0)} minutes par semaine, soit ${fmt(gainMin * costMin, 0)} € de temps machine récupérés.`,
              choices: [
                { text: `${fmt(gainMin, 0)} minutes, soit ${fmt(gainMin * costMin, 0)} € par semaine.`, points: 3, feedback: `${changes} changements × ${before - target} minutes gagnées × ${costMin} € = ${fmt(gainMin * costMin, 0)} €.` },
                { text: `${before - target} minutes, soit ${fmt((before - target) * costMin, 0)} €.`, points: 1, feedback: `Tu comptes un seul changement : il y en a ${changes} par semaine.` },
                { text: 'Aucun gain mesurable.', points: 0, feedback: 'Chaque minute gagnée est une minute de production en plus : le gain est bien chiffrable.' },
              ],
            },
            {
              situation: 'Par quoi commences-tu concrètement ?',
              better: "On filme un changement réel, on chronomètre chaque opération et on les classe en internes (machine arrêtée) et externes (machine en marche). On repère ensuite ce qui peut être préparé pendant la production (outils, matière, moule suivant).",
              choices: [
                { text: 'Je filme un changement et je sépare opérations internes et externes.', points: 3, feedback: 'L\'observation montre où part le temps ; la séparation fait apparaître les gains les plus faciles.' },
                { text: 'J\'achète directement une nouvelle presse.', points: 0, feedback: 'Un investissement lourd n\'est pas nécessaire : des gains importants viennent d\'une meilleure organisation.' },
                { text: 'Je demande aux opérateurs de travailler plus vite.', points: 1, feedback: 'Aller plus vite ne change pas la méthode : le SMED repose sur la réorganisation, pas la vitesse.' },
              ],
            },
            {
              situation: 'Comment utilises-tu le temps gagné ?',
              better: "Le temps gagné permet de produire plus de petites séries (stocks plus faibles, plus de flexibilité) ou de répondre à une demande supplémentaire. Il faut éviter de simplement allonger les séries : cela recréerait des stocks.",
              choices: [
                { text: 'Des séries plus petites et plus fréquentes, ou la production supplémentaire demandée.', points: 3, feedback: 'La flexibilité gagnée est le vrai bénéfice : moins de stocks et de meilleurs délais.' },
                { text: 'Je garde les séries très longues et j\'arrête la presse plus tôt.', points: 0, feedback: 'Le gain n\'est pas exploité et les stocks restent élevés.' },
                { text: 'Je ne change rien pour l\'instant.', points: 1, feedback: 'Sans exploiter le temps gagné, le projet ne produit aucun résultat tangible.' },
              ],
            },
          ],
          debrief: `Le SMED récupère ${fmt(gainMin, 0)} minutes de machine par semaine (${fmt(gainMin * costMin, 0)} €). On observe, on sépare internes et externes, puis on réinvestit le temps gagné dans plus de flexibilité.`,
        }
      },
    },
  ],

  english: {
    units: [
      {
        id: 'phrasal',
        title: 'Verbes à particule et vie au travail',
        icon: 'briefcase',
        color: 'amber',
        lessons: [
          {
            id: 'verbes-particule',
            title: 'Verbes à particule du travail',
            level: 2,
            items: [
              { en: 'set up', fr: 'mettre en place', def: "Organiser ou installer quelque chose pour qu'il puisse fonctionner.", ex: 'We set up a new process.', exFr: 'Nous avons mis en place un nouveau processus.' },
              { en: 'carry out', fr: 'réaliser (effectuer)', def: "Mener à bien une action ou une tâche.", ex: 'We carry out checks every day.', exFr: 'Nous effectuons des contrôles chaque jour.' },
              { en: 'run out of', fr: 'être à court de', def: "Ne plus avoir de quelque chose parce que le stock est épuisé.", ex: 'We always run out of boxes.', exFr: 'Nous manquons toujours de cartons.' },
              { en: 'follow up', fr: 'relancer (assurer le suivi)', def: "Contacter à nouveau pour vérifier l'avancement d'une demande.", ex: 'I will follow up tomorrow.', exFr: 'Je ferai un suivi demain.' },
              { en: 'sort out', fr: 'régler (résoudre)', def: "Trouver une solution à un problème.", ex: 'We need to sort out this delay.', exFr: 'Nous devons régler ce retard.' },
              { en: 'cut down', fr: 'réduire', def: "Diminuer une quantité ou un coût.", ex: 'We must cut down waste.', exFr: 'Nous devons réduire le gaspillage.' },
              { en: 'point out', fr: 'faire remarquer', def: "Attirer l'attention sur un détail ou une erreur.", ex: 'Please point out any mistake.', exFr: 'Merci de signaler toute erreur.' },
              { en: 'break down', fr: 'tomber en panne', def: "S'arrêter de fonctionner, pour une machine ou un véhicule.", ex: 'The truck may break down.', exFr: 'Le camion peut tomber en panne.' },
            ],
          },
          {
            id: 'verbes-particule-2',
            title: 'Encore des verbes utiles',
            level: 2,
            items: [
              { en: 'pick up', fr: 'récupérer (aller chercher)', def: "Aller chercher quelqu'un ou quelque chose à un endroit.", ex: 'The driver will pick up the pallets.', exFr: 'Le chauffeur viendra récupérer les palettes.' },
              { en: 'drop off', fr: 'déposer', def: "Laisser quelqu'un ou quelque chose à un endroit.", ex: 'Please drop off the parcel.', exFr: 'Veuillez déposer le colis.' },
              { en: 'hand over', fr: 'remettre (transmettre)', def: "Donner quelque chose à quelqu'un d'autre, par exemple une tâche ou un document.", ex: 'I will hand over the files.', exFr: 'Je transmettrai les dossiers.' },
              { en: 'speed up', fr: 'accélérer', def: "Rendre un processus plus rapide.", ex: 'Automation can speed up picking.', exFr: "L'automatisation peut accélérer la préparation." },
              { en: 'look into', fr: 'examiner (enquêter sur)', def: "Étudier un problème pour en comprendre la cause.", ex: 'We will look into the issue.', exFr: 'Nous allons examiner le problème.' },
              { en: 'call off', fr: 'annuler', def: "Décider qu'une réunion ou une opération n'aura pas lieu.", ex: 'They will call off the meeting.', exFr: 'Ils annuleront la réunion.' },
              { en: 'take over', fr: 'prendre en charge', def: "Reprendre une tâche ou une responsabilité.", ex: 'She will take over the project.', exFr: 'Elle reprendra le projet.' },
              { en: 'back up', fr: 'sauvegarder (soutenir)', def: "Faire une copie de sécurité de données, ou soutenir une idée avec des preuves.", ex: 'Please back up the data.', exFr: 'Veuillez sauvegarder les données.' },
            ],
          },
          {
            id: 'conversation-travail',
            title: 'Parler avec des collègues',
            level: 3,
            items: [
              { en: 'How was your weekend?', fr: 'Comment était ton week-end ?', blank: 'weekend' },
              { en: 'Do you have a minute?', fr: 'Tu as une minute ?', blank: 'minute' },
              { en: 'I will get back to you this afternoon.', fr: 'Je reviens vers vous cet après-midi.', blank: 'afternoon' },
              { en: 'Thanks for your help with the delivery.', fr: 'Merci pour ton aide avec la livraison.', blank: 'thanks' },
              { en: 'Could you cover for me tomorrow?', fr: 'Pourrais-tu me remplacer demain ?', blank: 'cover' },
              { en: 'Let us know if you need anything.', fr: 'Dis-nous si tu as besoin de quoi que ce soit.', blank: 'anything' },
            ],
          },
        ],
      },
    ],
  },
}
