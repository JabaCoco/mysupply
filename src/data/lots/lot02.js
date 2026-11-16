// Lot 2 — Transport : Atelier (2 formules, 4 défis Excel, 2 études de cas) + Anglais (Incoterms, expédier, mer/air).
import { choiceSet, eur, fmt, int, pick, sample } from '../gen.js'

const CARRIERS = ['DHL', 'Geodis', 'Kuehne+Nagel', 'DB Schenker', 'XPO', 'Heppner']

export default {
  // ============================ FORMULES ============================
  formulas: [
    {
      id: 'poids-volumetrique',
      title: 'Poids volumétrique et coût de transport',
      short: 'Poids taxable = max(réel ; volumétrique)',
      course: {
        purpose:
          "Les transporteurs facturent la **place occupée** autant que le poids. Le **poids volumétrique** convertit le volume d'un colis en kilos ; on facture ensuite le **poids taxable**, c'est-à-dire le plus grand du poids réel et du poids volumétrique.",
        formulas: ['Volume (m³) = L × l × h (en mètres)', 'Poids volumétrique = volume × coefficient', 'Poids taxable = max(poids réel ; poids volumétrique)', 'Coût = poids taxable × tarif au kilo'],
        terms: [
          ['L, l, h', 'Longueur, largeur, hauteur du colis, en mètres (diviser les centimètres par 100).'],
          ['Coefficient', 'Kilos par m³ : 167 en aérien, souvent 250 en messagerie routière (varie selon le transporteur).'],
          ['Poids réel', 'Le poids du colis sur la balance.'],
          ['Poids taxable', 'Le plus grand entre le poids réel et le poids volumétrique : c\'est lui qui est facturé.'],
          ['Tarif', 'Prix du kilo taxable, selon la grille du transporteur.'],
        ],
        example: {
          statement: 'Colis de 120 × 80 × 100 cm, poids réel 90 kg, messagerie routière à 250 kg/m³, tarif 0,30 € le kilo.',
          steps: ['Volume = 1,2 × 0,8 × 1,0 = 0,96 m³', 'Poids volumétrique = 0,96 × 250 = 240 kg', 'Poids taxable = max(90 ; 240) = 240 kg', 'Coût = 240 × 0,30 = 72 €'],
          result: 'Le colis est facturé 240 kg, presque trois fois son poids réel, car il occupe beaucoup de place.',
        },
        exercises: [
          () => {
            const L = int(40, 150, 10)
            const l = int(30, 100, 10)
            const h = int(30, 120, 10)
            const vol = (L * l * h) / 1_000_000
            return {
              kind: 'number',
              statement: 'Calcule le volume du colis en mètres cubes.',
              data: [['Longueur', `${L} cm`], ['Largeur', `${l} cm`], ['Hauteur', `${h} cm`]],
              question: 'Volume (en m³) ?',
              answer: vol,
              unit: 'm³',
              tolerance: 0.005,
              steps: [`En mètres : ${L / 100} × ${l / 100} × ${h / 100}`, `Volume = ${fmt(vol, 3)} m³`],
              conclusion: 'Convertis toujours les centimètres en mètres avant de multiplier : 1 m³ = 1 000 000 cm³.',
            }
          },
          () => {
            const vol = int(3, 30) / 10
            const [name, coef] = pick([['aérien', 167], ['messagerie routière', 250]])
            return {
              kind: 'number',
              statement: `Un colis part en ${name}.`,
              data: [['Volume', `${fmt(vol)} m³`], ['Coefficient', `${coef} kg/m³`]],
              question: 'Poids volumétrique (en kg) ?',
              answer: vol * coef,
              unit: 'kg',
              tolerance: 0.5,
              steps: [`Poids volumétrique = volume × coefficient = ${fmt(vol)} × ${coef} = ${fmt(vol * coef, 1)} kg`],
              conclusion: `Ce colis compte pour ${fmt(vol * coef, 1)} kg, quel que soit son poids réel.`,
            }
          },
          () => {
            const real = int(20, 400, 10)
            const vol = int(2, 30) / 10
            const coef = pick([167, 250])
            const vw = vol * coef
            return {
              kind: 'number',
              statement: 'Détermine le poids facturé (poids taxable).',
              data: [['Poids réel', `${real} kg`], ['Volume', `${fmt(vol)} m³`], ['Coefficient', `${coef} kg/m³`]],
              question: 'Poids taxable (en kg) ?',
              answer: Math.max(real, vw),
              unit: 'kg',
              tolerance: 0.5,
              steps: [`Poids volumétrique = ${fmt(vol)} × ${coef} = ${fmt(vw, 1)} kg`, `Poids taxable = max(${real} ; ${fmt(vw, 1)}) = ${fmt(Math.max(real, vw), 1)} kg`],
              conclusion: real >= vw ? 'Le colis est lourd et compact : c\'est son poids réel qui est facturé.' : 'Le colis est volumineux et léger : c\'est son volume qui est facturé.',
            }
          },
          () => {
            const real = int(30, 300, 10)
            const vol = int(2, 25) / 10
            const coef = 250
            const rate = int(15, 60) / 100
            const taxable = Math.max(real, vol * coef)
            return {
              kind: 'number',
              statement: 'Calcule le coût du transport en messagerie.',
              data: [['Poids réel', `${real} kg`], ['Volume', `${fmt(vol)} m³`], ['Coefficient', `${coef} kg/m³`], ['Tarif', `${eur(rate)} le kilo taxable`]],
              question: 'Coût du transport (en €) ?',
              answer: taxable * rate,
              unit: '€',
              tolerance: 0.1,
              steps: [`Poids volumétrique = ${fmt(vol)} × ${coef} = ${fmt(vol * coef, 1)} kg`, `Poids taxable = max(${real} ; ${fmt(vol * coef, 1)}) = ${fmt(taxable, 1)} kg`, `Coût = ${fmt(taxable, 1)} × ${fmt(rate)} = ${eur(taxable * rate)}`],
              conclusion: 'Réduire le volume du colis (emballage plus compact) peut faire baisser la facture même si le poids ne change pas.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'L', label: 'Longueur', unit: 'cm', value: 120 },
            { key: 'l', label: 'Largeur', unit: 'cm', value: 80 },
            { key: 'h', label: 'Hauteur', unit: 'cm', value: 100 },
            { key: 'real', label: 'Poids réel', unit: 'kg', value: 90 },
            { key: 'coef', label: 'Coefficient', unit: 'kg/m³', value: 250, help: '167 en aérien, souvent 250 en messagerie' },
            { key: 'rate', label: 'Tarif', unit: '€/kg', value: 0.3 },
          ],
          outputs: [
            { label: 'Volume', unit: 'm³', digits: 3, fn: (n) => (n.L * n.l * n.h) / 1_000_000 },
            { label: 'Poids volumétrique', unit: 'kg', digits: 1, fn: (n) => ((n.L * n.l * n.h) / 1_000_000) * n.coef },
            { label: 'Poids taxable', unit: 'kg', digits: 1, highlight: true, fn: (n) => Math.max(n.real, ((n.L * n.l * n.h) / 1_000_000) * n.coef) },
            { label: 'Coût du transport', unit: '€', digits: 2, fn: (n) => Math.max(n.real, ((n.L * n.l * n.h) / 1_000_000) * n.coef) * n.rate },
          ],
          steps: (n) => {
            const vol = (n.L * n.l * n.h) / 1_000_000
            const taxable = Math.max(n.real, vol * n.coef)
            return [`Volume = ${fmt(n.L / 100)} × ${fmt(n.l / 100)} × ${fmt(n.h / 100)} = ${fmt(vol, 3)} m³`, `Poids volumétrique = ${fmt(vol, 3)} × ${fmt(n.coef)} = ${fmt(vol * n.coef, 1)} kg`, `Poids taxable = max(${fmt(n.real)} ; ${fmt(vol * n.coef, 1)}) = ${fmt(taxable, 1)} kg`, `Coût = ${fmt(taxable, 1)} × ${fmt(n.rate)} = ${eur(taxable * n.rate)}`]
          },
          note: 'Le coefficient dépend du mode et du transporteur : vérifie ses conditions générales.',
        },
      },
    },

    {
      id: 'remplissage-conteneur',
      title: 'Remplissage d\'un conteneur',
      short: 'Nombre max = min(volume ; poids)',
      course: {
        purpose:
          "Combien de cartons rentrent dans un conteneur ? Il y a **deux limites** : le **volume** disponible et la **charge utile** (le poids maximal). C'est la plus restrictive qui décide. On calcule ensuite le **taux de remplissage**, pour juger si le conteneur est bien utilisé.",
        formulas: [
          'Nombre selon le volume = volume utile / volume d\'une unité',
          'Nombre selon le poids = charge utile / poids d\'une unité',
          'Nombre maximal = le plus petit des deux (arrondi vers le bas)',
          'Taux de remplissage = volume chargé / volume utile × 100',
        ],
        terms: [
          ['Volume utile', 'Environ 33 m³ (20 pieds), 67 m³ (40 pieds), 76 m³ (40 pieds High Cube).'],
          ['Charge utile', 'Environ 28 000 kg (20 pieds), 26 000 kg (40 pieds et High Cube).'],
          ['Arrondi', 'On arrondit toujours vers le bas : on ne peut pas charger une fraction de carton.'],
          ['Hypothèse', 'Chargement sans perte de place (palettisation et vides ignorés) : un cas simplifié.'],
        ],
        example: {
          statement: 'Conteneur 40 pieds (67 m³ ; 26 000 kg). Cartons de 0,12 m³ et de 18 kg.',
          steps: ['Selon le volume : 67 / 0,12 = 558,3 → 558 cartons', 'Selon le poids : 26 000 / 18 = 1 444,4 → 1 444 cartons', 'Maximum = min(558 ; 1 444) = 558 cartons (limité par le volume)', 'Taux de remplissage = 558 × 0,12 / 67 × 100 ≈ 99,9 %'],
          result: 'On charge 558 cartons : le conteneur est plein en volume, mais loin d\'atteindre la charge maximale.',
        },
        exercises: [
          () => {
            const [name, vol] = pick([['20 pieds', 33], ['40 pieds', 67], ['40 pieds High Cube', 76]])
            const unit = int(8, 30) / 100
            return {
              kind: 'number',
              statement: `Combien de cartons rentrent dans un conteneur ${name}, selon le volume seulement ?`,
              data: [['Volume utile', `${vol} m³`], ['Volume d\'un carton', `${fmt(unit)} m³`]],
              question: 'Nombre de cartons (selon le volume) ?',
              answer: Math.floor(vol / unit),
              unit: 'cartons',
              tolerance: 0.5,
              steps: [`${vol} / ${fmt(unit)} = ${fmt(vol / unit, 1)}`, `On arrondit vers le bas : ${Math.floor(vol / unit)} cartons`],
              conclusion: 'On n\'arrondit jamais vers le haut : un carton incomplet ne rentre pas.',
            }
          },
          () => {
            const payload = pick([26000, 28000])
            const w = int(10, 60)
            return {
              kind: 'number',
              statement: 'Combien de cartons peut-on charger, selon le poids seulement ?',
              data: [['Charge utile', `${fmt(payload)} kg`], ['Poids d\'un carton', `${w} kg`]],
              question: 'Nombre de cartons (selon le poids) ?',
              answer: Math.floor(payload / w),
              unit: 'cartons',
              tolerance: 0.5,
              steps: [`${fmt(payload)} / ${w} = ${fmt(payload / w, 1)}`, `On arrondit vers le bas : ${Math.floor(payload / w)} cartons`],
              conclusion: 'Cette limite ne dit pas encore combien on charge : il faut la comparer à la limite du volume.',
            }
          },
          () => {
            const [name, vol, payload] = pick([['20 pieds', 33, 28000], ['40 pieds', 67, 26000], ['40 pieds High Cube', 76, 26000]])
            const unitVol = int(5, 40) / 100
            const unitW = int(8, 90)
            const byVol = Math.floor(vol / unitVol)
            const byW = Math.floor(payload / unitW)
            return {
              kind: 'number',
              statement: `Quel est le nombre maximal de cartons dans un conteneur ${name} ?`,
              data: [['Volume utile', `${vol} m³`], ['Charge utile', `${fmt(payload)} kg`], ['Volume d\'un carton', `${fmt(unitVol)} m³`], ['Poids d\'un carton', `${unitW} kg`]],
              question: 'Nombre maximal de cartons ?',
              answer: Math.min(byVol, byW),
              unit: 'cartons',
              tolerance: 0.5,
              steps: [`Selon le volume : ${vol} / ${fmt(unitVol)} → ${byVol}`, `Selon le poids : ${fmt(payload)} / ${unitW} → ${byW}`, `Maximum = min(${byVol} ; ${byW}) = ${Math.min(byVol, byW)}`],
              conclusion: byVol <= byW ? 'Le conteneur est limité par le volume : produit léger.' : 'Le conteneur est limité par le poids : produit dense.',
            }
          },
          () => {
            const [name, vol] = pick([['20 pieds', 33], ['40 pieds', 67], ['40 pieds High Cube', 76]])
            const unitVol = int(8, 30) / 100
            const max = Math.floor(vol / unitVol)
            const loaded = Math.floor(max * (int(60, 95) / 100))
            return {
              kind: 'number',
              statement: `Dans un conteneur ${name}, on a chargé moins que le maximum.`,
              data: [['Volume utile', `${vol} m³`], ['Cartons chargés', fmt(loaded)], ['Volume d\'un carton', `${fmt(unitVol)} m³`]],
              question: 'Taux de remplissage (en %) ?',
              answer: ((loaded * unitVol) / vol) * 100,
              unit: '%',
              tolerance: 0.2,
              steps: [`Volume chargé = ${fmt(loaded)} × ${fmt(unitVol)} = ${fmt(loaded * unitVol, 2)} m³`, `Taux = ${fmt(loaded * unitVol, 2)} / ${vol} × 100 = ${fmt(((loaded * unitVol) / vol) * 100, 1)} %`],
              conclusion: 'Un taux bas signifie qu\'on paie le transport d\'un conteneur en partie vide.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'vol', label: 'Volume utile', unit: 'm³', value: 67, help: '33 / 67 / 76 m³ environ' },
            { key: 'payload', label: 'Charge utile', unit: 'kg', value: 26000 },
            { key: 'uv', label: 'Volume d\'une unité', unit: 'm³', value: 0.12 },
            { key: 'uw', label: 'Poids d\'une unité', unit: 'kg', value: 18 },
          ],
          outputs: [
            { label: 'Selon le volume', unit: 'unités', digits: 0, fn: (n) => Math.floor(n.vol / n.uv) },
            { label: 'Selon le poids', unit: 'unités', digits: 0, fn: (n) => Math.floor(n.payload / n.uw) },
            { label: 'Nombre maximal', unit: 'unités', digits: 0, highlight: true, fn: (n) => Math.min(Math.floor(n.vol / n.uv), Math.floor(n.payload / n.uw)) },
            { label: 'Taux de remplissage', unit: '%', digits: 1, fn: (n) => (Math.min(Math.floor(n.vol / n.uv), Math.floor(n.payload / n.uw)) * n.uv / n.vol) * 100 },
          ],
          steps: (n) => [`Selon le volume : ${fmt(n.vol)} / ${fmt(n.uv)} = ${fmt(n.vol / n.uv, 1)}`, `Selon le poids : ${fmt(n.payload)} / ${fmt(n.uw)} = ${fmt(n.payload / n.uw, 1)}`, 'On garde le plus petit des deux, arrondi vers le bas.'],
          note: 'Calcul simplifié : on ignore les palettes, les vides et le calage de la marchandise.',
        },
      },
    },
  ],

  // ============================ DÉFIS EXCEL ============================
  excel: [
    {
      id: 'mode-conseille-si',
      fn: 'SI',
      level: 2,
      tier: 2,
      minResults: 3,
      title: 'Choisir le mode de transport',
      context: "Tu automatises la recommandation du mode de transport dans ton tableau de suivi.",
      instruction: 'En **B5**, affiche « Aérien » si l\'envoi est urgent (B2 = « Oui »), sinon « Maritime » si la distance (B3) dépasse 3 000 km, sinon « Routier ».',
      generate() {
        const urgent = Math.random() < 0.35 ? 'Oui' : 'Non'
        return { rows: [['Poids (kg)', int(50, 5000, 10)], ['Urgent ?', urgent], ['Distance (km)', int(150, 9000, 50)]], extra: { A5: 'Mode conseillé' } }
      },
      target: 'B5',
      solution: '=SI(B2="Oui";"Aérien";SI(B3>3000;"Maritime";"Routier"))',
      mustUse: ['SI'],
      hints: ['On peut mettre un SI dans un autre SI : =SI(test1 ; valeur1 ; SI(test2 ; valeur2 ; valeur3)).', 'Le premier test est B2="Oui". Les textes s\'écrivent entre guillemets.'],
      explain: 'Excel teste d\'abord B2="Oui" : si c\'est vrai, il affiche « Aérien ». Sinon il passe au 2e SI (B3>3000) : « Maritime » si vrai, « Routier » sinon.',
    },
    {
      id: 'tarif-tranche',
      fn: 'RECHERCHEV',
      level: 2,
      tier: 3,
      title: 'Le tarif par tranche de poids',
      context: 'La grille de ton transporteur donne un tarif par tranche de poids : il faut retrouver le bon tarif pour un envoi.',
      instruction: 'En **E2**, retrouve le **tarif applicable** au poids de l\'envoi (E1) : la grille donne le tarif de la tranche dont le seuil est le plus proche, sans le dépasser.',
      generate() {
        const thresholds = [0, 50, 100, 200, 500, 1000]
        let rate = int(32, 46)
        const rows = [['Poids ≥ (kg)', 'Tarif (€/100 kg)'], ...thresholds.map((t) => {
          const row = [t, rate]
          rate -= int(2, 5)
          return row
        })]
        let weight = int(10, 1400)
        while (thresholds.includes(weight)) weight++
        return { rows, extra: { D1: 'Poids de l\'envoi (kg)', E1: weight, D2: 'Tarif applicable' } }
      },
      target: 'E2',
      solution: '=RECHERCHEV(E1;A2:B7;2;VRAI)',
      mustUse: ['RECHERCHEV'],
      hints: ['RECHERCHEV(valeur ; tableau ; n° de colonne ; VRAI) fait une recherche approchée.', 'Avec VRAI, Excel prend la ligne dont le seuil est le plus grand sans dépasser la valeur (les seuils doivent être triés du plus petit au plus grand).'],
      explain: 'Avec le dernier argument VRAI, RECHERCHEV cherche la tranche : elle prend le plus grand seuil inférieur ou égal au poids, puis renvoie la 2e colonne (le tarif). Avec FAUX, il faudrait une valeur exactement égale à un seuil.',
    },
    {
      id: 'poids-taxable-max',
      fn: 'MAX',
      level: 3,
      tier: 5,
      title: 'Le poids taxable',
      context: 'Le transporteur facture le plus grand du poids réel et du poids volumétrique.',
      instruction: 'En **B5**, calcule le **poids taxable** : le plus grand entre le poids réel (B1) et le poids volumétrique (volume B2 × coefficient B3).',
      generate() {
        return { rows: [['Poids réel (kg)', int(20, 400, 10)], ['Volume (m³)', int(1, 30) / 10], ['Coefficient (kg/m³)', pick([167, 250])]], extra: { A5: 'Poids taxable (kg)' } }
      },
      target: 'B5',
      solution: '=MAX(B1;B2*B3)',
      mustUse: ['MAX'],
      hints: ['Le poids volumétrique = volume × coefficient : B2*B3.', 'MAX(valeur1 ; valeur2) renvoie la plus grande : tu peux écrire un calcul à l\'intérieur.'],
      explain: 'MAX(B1;B2*B3) compare le poids réel au poids volumétrique et garde le plus grand : c\'est exactement la règle du poids taxable.',
    },
    {
      id: 'cout-moyen-kilo',
      fn: 'SOMME.SI',
      level: 2,
      tier: 4,
      title: 'Le coût moyen au kilo d\'un transporteur',
      context: 'Tu veux comparer tes transporteurs : combien paies-tu en moyenne au kilo chez chacun ?',
      instruction: 'En **G2**, calcule le **coût moyen au kilo** du transporteur écrit en G1 (coût total ÷ poids total), **arrondi à 2 décimales**.',
      generate() {
        const used = sample(CARRIERS, 3)
        const rates = Object.fromEntries(used.map((c) => [c, int(18, 55) / 100]))
        const names = [...used, ...Array.from({ length: 6 }, () => pick(used))]
        const rows = [['Envoi', 'Transporteur', 'Poids (kg)', 'Coût (€)'], ...sample(names, names.length).map((c, i) => {
          const w = int(50, 800, 10)
          return [`E-${201 + i}`, c, w, Math.round(w * rates[c] * 100) / 100]
        })]
        return { rows, extra: { F1: 'Transporteur', G1: used[0], F2: 'Coût moyen (€/kg)' } }
      },
      target: 'G2',
      solution: '=ARRONDI(SOMME.SI(B2:B10;G1;D2:D10)/SOMME.SI(B2:B10;G1;C2:C10);2)',
      mustUse: ['SOMME.SI', 'ARRONDI'],
      hints: ['SOMME.SI(plage du critère ; critère ; plage à additionner) : fais-le deux fois, une pour les coûts et une pour les poids.', 'Divise le total des coûts par le total des poids, puis entoure le tout de ARRONDI(…;2).'],
      explain: 'On additionne les coûts du transporteur choisi (colonne D), puis ses poids (colonne C), et on divise : c\'est un coût moyen pondéré par le poids, plus juste qu\'une moyenne simple des lignes.',
    },
  ],

  // ============================ ÉTUDES DE CAS ============================
  cases: [
    {
      id: 'mode-transport-chiffre',
      title: 'Avion ou bateau ? Le lot en retard',
      role: "Responsable approvisionnement d'un distributeur d'appareils ménagers",
      lesson: 'transport/aerien',
      generate() {
        const q = int(400, 1500, 50)
        const w = int(6, 18)
        const weight = q * w
        const sea = int(15, 35) / 100
        const air = int(35, 60) / 10
        const ls = int(32, 44)
        const cover1 = ls + int(15, 30)
        const cover2 = int(3, 8)
        const gap = ls - cover2
        const extra = weight * (air - sea)
        const margin = Math.ceil((extra * 1.6) / gap / 500) * 500
        const lost = gap * margin
        return {
          intro: `Tu importes ${fmt(q)} appareils de ${w} kg (soit ${fmt(weight)} kg) depuis l'Asie. Le fret maritime coûte ${eur(sea)} le kilo et prend ${ls} jours ; l'aérien coûte ${eur(air)} le kilo et prend environ 5 jours.`,
          steps: [
            {
              situation: `Réapprovisionnement habituel : ton stock couvre encore ${cover1} jours de ventes. Quel mode choisis-tu ?`,
              better: `Le stock (${cover1} jours) dépasse le délai maritime (${ls} jours) : il n'y aura pas de rupture. Le maritime coûte ${eur(weight * sea, 0)} contre ${eur(weight * air, 0)} en aérien, soit ${eur(extra, 0)} d'économie.`,
              choices: [
                { text: 'Le transport maritime.', points: 3, feedback: `Le stock tient jusqu'à l'arrivée (${cover1} jours contre ${ls}) : tu économises ${eur(extra, 0)} par rapport à l'avion.` },
                { text: "L'aérien, par sécurité.", points: 0, feedback: `Tu paierais ${eur(extra, 0)} de plus pour une urgence qui n'existe pas : le stock couvre largement le délai maritime.` },
                { text: 'Moitié par avion, moitié par bateau.', points: 1, feedback: `Tu dépenserais environ ${eur(extra / 2, 0)} de plus sans besoin réel : aucune rupture n'est à craindre.` },
              ],
            },
            {
              situation: `Un lot en retard : le stock ne couvre plus que ${cover2} jours, alors que le maritime prend ${ls} jours. Chaque jour de rupture te coûte ${eur(margin, 0)} de marge. Que fais-tu ?`,
              better: `Rupture en maritime : (${ls} − ${cover2}) = ${gap} jours × ${eur(margin, 0)} = ${eur(lost, 0)} de marge perdue. Le surcoût aérien est de ${fmt(weight)} kg × (${eur(air)} − ${eur(sea)}) = ${eur(extra, 0)}. L'avion coûte ${eur(lost - extra, 0)} de moins que la rupture.`,
              choices: [
                { text: 'Je passe ce lot par avion.', points: 3, feedback: `Surcoût ${eur(extra, 0)} contre ${eur(lost, 0)} de marge perdue en cas de rupture : l'avion est rentable pour ce lot précis.` },
                { text: 'Je garde le maritime et j\'accepte la rupture.', points: 0, feedback: `${gap} jours de rupture × ${eur(margin, 0)} = ${eur(lost, 0)} de marge perdue, plus que le surcoût de l'avion (${eur(extra, 0)}).` },
                { text: 'Je passe seulement la moitié du lot par avion.', points: 1, feedback: 'Tu réduirais le surcoût mais la rupture resterait importante : la moitié du lot ne couvre pas toute la demande jusqu\'à l\'arrivée du bateau.' },
              ],
            },
            {
              situation: 'Comment éviter de retomber dans cette situation le trimestre prochain ?',
              better: `Prendre l'avion à chaque fois coûterait ${eur(extra, 0)} par lot, soit près de ${eur(extra * 4, 0)} par an si c'est un lot par trimestre. Il vaut mieux commander plus tôt : avec un délai de ${ls} jours, le point de commande et le stock de sécurité doivent couvrir ${ls} jours de ventes plus la variabilité.`,
              choices: [
                { text: 'Je recalcule le point de commande et le stock de sécurité avec un délai de ' + ls + ' jours.', points: 3, feedback: `On commande plus tôt et on garde une marge pour les retards : la rupture devient rare, sans payer l'avion à chaque lot.` },
                { text: 'Je passe tous mes lots par avion à partir de maintenant.', points: 1, feedback: `Tu supprimerais le risque de rupture, mais le surcoût serait d'environ ${eur(extra, 0)} par lot : un coût permanent très élevé.` },
                { text: 'Je ne change rien : c\'était un accident isolé.', points: 0, feedback: 'Les retards de transport maritime sont fréquents : sans correction, la même rupture peut se reproduire.' },
              ],
            },
          ],
          debrief: `L'avion n'est pas "mauvais" : il est rentable quand le coût d'une rupture (${eur(lost, 0)}) dépasse son surcoût (${eur(extra, 0)}). La bonne gestion consiste à l'utiliser pour les urgences, et à éviter les urgences en commandant à temps.`,
        }
      },
    },
    {
      id: 'premier-export',
      title: "L'Incoterm de la première exportation",
      role: "Responsable export d'une PME qui vend des machines-outils",
      lesson: 'transport/incoterms',
      intro:
        "Ta PME française signe sa première vente à un client de Montréal : 2 machines, expédiées par conteneur 20 pieds depuis Le Havre. Le client te demande de préciser l'Incoterm. Tu manques d'expérience à l'export.",
      steps: [
        {
          situation: 'Quelle règle proposes-tu en premier ?',
          better:
            "Avec FCA Le Havre, tu fais le chargement et l'export, puis tu remets la marchandise au transporteur choisi par le client : ta responsabilité s'arrête là. Avec DDP, tu supporterais le transport, les risques, les droits et les formalités canadiens, soit tout ce que tu connais le moins.",
          choices: [
            { text: "EXW : le client vient chercher les machines à l'usine.", points: 1, feedback: "Possible, mais le client devrait gérer l'export depuis la France, souvent difficile pour un acheteur étranger." },
            { text: 'FCA Le Havre : je remets les machines au transporteur du client, export fait.', points: 3, feedback: "Tu maîtrises ce que tu sais faire (chargement, export) et le risque passe dès la remise au transporteur." },
            { text: 'DDP Montréal : je livre chez le client, droits payés.', points: 0, feedback: "Tu porterais tous les coûts et tous les risques, y compris les droits et formalités d'importation d'un pays que tu ne connais pas." },
          ],
        },
        {
          situation: 'Le client insiste pour que tu organises et paies le transport maritime jusqu\'à Montréal. Quelle règle est la plus adaptée à un conteneur ?',
          better:
            "Un conteneur est généralement remis au transporteur à terre, avant d'être à bord : les règles CPT et CIP (tous modes) conviennent mieux au conteneur que CFR ou CIF. Avec CIP, tu paies le transport et l'assurance, et le risque passe quand tu remets la marchandise au transporteur. FOB, lui, laisserait le transport à la charge du client.",
          choices: [
            { text: 'CIP Montréal : je paie transport et assurance, le risque passe au départ.', points: 3, feedback: "C'est une règle « tous modes » adaptée au conteneur : tu fais ce que demande le client sans porter les risques de la traversée." },
            { text: 'CIF Montréal.', points: 1, feedback: "Utilisable, mais CIF est pensé pour le vrac maritime : pour un conteneur remis à terre, CIP est plus cohérent." },
            { text: 'FOB Le Havre.', points: 0, feedback: "Avec FOB, c'est l'acheteur qui organise et paie le transport principal : l'inverse de ce que demande ton client." },
          ],
        },
        {
          situation: 'Avec CIP, quelle assurance dois-tu souscrire ?',
          better:
            "Dans les Incoterms 2020, CIP impose une couverture étendue (clauses A), alors que CIF se contente d'une couverture minimale (clauses C). C'est un changement important par rapport aux versions précédentes : sur des machines de grande valeur, la couverture étendue est aussi plus protectrice.",
          choices: [
            { text: 'Une couverture étendue (clauses A), exigée par CIP.', points: 3, feedback: 'Les Incoterms 2020 imposent ce niveau pour CIP : la marchandise est couverte contre la plupart des risques.' },
            { text: 'Une couverture minimale (clauses C), comme en CIF.', points: 1, feedback: "C'est le niveau de CIF : pour CIP, la règle 2020 demande une couverture plus large." },
            { text: "Aucune assurance : le transporteur est responsable de tout.", points: 0, feedback: "La responsabilité du transporteur est limitée et ne couvre pas tous les risques : sans assurance, une perte importante serait à ta charge." },
          ],
        },
      ],
      debrief:
        "Une première exportation se sécurise avec une règle simple (FCA, CPT ou CIP pour un conteneur), en évitant EXW et DDP qui reportent trop de tâches sur une seule partie. Le prix et le risque ne se transfèrent pas toujours au même endroit : avec CIP, tu paies jusqu'à Montréal mais le risque passe au départ.",
    },
  ],

  // ============================ ANGLAIS ============================
  english: {
    units: [
      {
        id: 'incoterms-en',
        title: 'Les Incoterms en anglais',
        icon: 'anchor',
        color: 'indigo',
        lessons: [
          {
            id: 'regles',
            title: 'Risque, assurance et responsabilité',
            level: 2,
            items: [
              { en: 'risk', fr: 'risque', def: "Possibilité de perte ou de dommage sur la marchandise pendant le transport.", ex: 'The risk passes to the buyer at the port.', exFr: "Le risque passe à l'acheteur au port." },
              { en: 'insurance', fr: 'assurance', def: "Contrat qui rembourse la marchandise en cas de perte ou de dommage.", ex: 'The seller pays for the insurance.', exFr: "Le vendeur paie l'assurance." },
              { en: 'loading', fr: 'chargement', def: "Action de placer la marchandise dans le camion, le conteneur ou le navire.", ex: 'Loading starts at six in the morning.', exFr: 'Le chargement commence à six heures du matin.' },
              { en: 'unloading', fr: 'déchargement', def: "Action de sortir la marchandise du camion, du conteneur ou du navire.", ex: 'The buyer is responsible for unloading.', exFr: "L'acheteur est responsable du déchargement." },
              { en: 'destination', fr: 'destination', def: "Lieu où la marchandise doit arriver à la fin du transport.", ex: 'The final destination is Lyon.', exFr: 'La destination finale est Lyon.' },
              { en: 'responsibility', fr: 'responsabilité', def: "Devoir de s'occuper de quelque chose et d'en répondre si un problème survient.", ex: 'The carrier has no responsibility for customs.', exFr: "Le transporteur n'a aucune responsabilité pour la douane." },
            ],
          },
          {
            id: 'lieux',
            title: 'Lieux et transferts',
            level: 2,
            items: [
              { en: 'port of loading', fr: "port d'embarquement", def: 'Port où la marchandise est chargée sur le navire.', ex: 'The port of loading is Shanghai.', exFr: "Le port d'embarquement est Shanghai." },
              { en: 'port of discharge', fr: 'port de déchargement', def: 'Port où la marchandise est sortie du navire.', ex: 'The port of discharge is Le Havre.', exFr: 'Le port de déchargement est Le Havre.' },
              { en: 'place of delivery', fr: 'lieu de livraison', def: "Adresse précise où le vendeur doit livrer la marchandise.", ex: 'The place of delivery is our warehouse.', exFr: 'Le lieu de livraison est notre entrepôt.' },
              { en: 'handover', fr: 'remise', alt: ['hand over'], def: "Moment où la marchandise passe d'une personne ou d'une entreprise à une autre.", ex: 'The handover takes place at the terminal.', exFr: 'La remise a lieu au terminal.' },
              { en: 'on board', fr: 'à bord', def: 'Placé à l\'intérieur du navire, de l\'avion ou du véhicule.', ex: 'The goods are on board the vessel.', exFr: 'La marchandise est à bord du navire.' },
              { en: 'alongside', fr: 'le long du navire', def: 'Posé sur le quai, près du navire, prêt à être chargé.', ex: 'The goods are alongside the ship.', exFr: 'La marchandise est le long du navire.' },
            ],
          },
        ],
      },
    ],
    extend: {
      transport: [
        {
          id: 'expedier',
          title: 'Expédier un colis',
          level: 1,
          items: [
            { en: 'shipper', fr: 'expéditeur', def: "Entreprise ou personne qui envoie la marchandise.", ex: 'The shipper prepares the documents.', exFr: "L'expéditeur prépare les documents." },
            { en: 'consignee', fr: 'destinataire', def: "Personne ou entreprise à qui la marchandise est adressée.", ex: 'The consignee signs for the goods.', exFr: 'Le destinataire signe pour la marchandise.' },
            { en: 'parcel', fr: 'colis', def: 'Paquet de petite taille envoyé par un transporteur ou par la poste.', ex: 'The parcel weighs two kilos.', exFr: 'Le colis pèse deux kilos.' },
            { en: 'tracking', fr: 'suivi', def: "Suivi d'un colis ou d'un envoi pendant son trajet, souvent en ligne.", ex: 'Use the tracking to follow the parcel.', exFr: 'Utilise le suivi pour suivre le colis.' },
            { en: 'pick-up', fr: 'enlèvement', alt: ['pickup'], def: "Passage du transporteur pour récupérer la marchandise chez l'expéditeur.", ex: 'The pick-up is tomorrow morning.', exFr: "L'enlèvement a lieu demain matin." },
            { en: 'proof of delivery', fr: 'preuve de livraison', def: "Document signé par le destinataire qui prouve que la marchandise est arrivée.", ex: 'We need the proof of delivery for the invoice.', exFr: 'Nous avons besoin de la preuve de livraison pour la facture.', note: 'Abrégé « POD » dans les mails.' },
          ],
        },
        {
          id: 'mer-air',
          title: 'Par mer, par air, en transit',
          level: 2,
          items: [
            { en: 'sea freight', fr: 'fret maritime', def: 'Transport de marchandises par bateau, sur mer ou océan.', ex: 'Sea freight is cheaper but slower.', exFr: 'Le fret maritime est moins cher mais plus lent.' },
            { en: 'air freight', fr: 'fret aérien', def: "Transport de marchandises par avion, rapide et plus coûteux.", ex: 'We use air freight for urgent orders.', exFr: 'Nous utilisons le fret aérien pour les commandes urgentes.' },
            { en: 'transit time', fr: 'délai de transit', def: "Durée du trajet entre le départ et l'arrivée, hors préparation.", ex: 'The transit time is thirty days.', exFr: 'Le délai de transit est de trente jours.', note: 'À ne pas confondre avec « lead time » (de la commande à la réception).' },
            { en: 'transshipment', fr: 'transbordement', def: "Changement de navire dans un port intermédiaire.", ex: 'There is a transshipment in Singapore.', exFr: 'Il y a un transbordement à Singapour.' },
            { en: 'surcharge', fr: 'surcharge', def: "Frais supplémentaire ajouté au prix de base, par exemple pour le carburant.", ex: 'The carrier added a fuel surcharge.', exFr: 'Le transporteur a ajouté une surcharge carburant.' },
            { en: 'booking', fr: 'réservation', def: "Réservation d'une place pour la marchandise sur un navire ou un avion.", ex: 'Please confirm the booking by Friday.', exFr: 'Merci de confirmer la réservation avant vendredi.', note: 'Piège : « booking » ici = réservation de capacité de transport.' },
          ],
        },
      ],
    },
  },
}
