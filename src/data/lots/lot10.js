// Lot 10 — Douane et international : Atelier (2 formules, 3 défis Excel, 2 études de cas) + Anglais (douane, import-export).
import { fmt, int, pick } from '../gen.js'

export default {
  formulas: [
    {
      id: 'cout-importation',
      title: "Coût de revient d'une importation",
      short: 'Landed cost = valeur en douane + droits + frais',
      course: {
        purpose:
          "Pour comparer un fournisseur lointain à un fournisseur local, le prix d'achat ne suffit pas : il faut calculer le **coût complet rendu** (*landed cost*), qui ajoute le transport, l'assurance, les droits de douane et les frais de dédouanement. La **TVA** est en général récupérable : elle n'est pas comptée.",
        formulas: ["Valeur en douane = prix + transport + assurance (jusqu'à la frontière UE)", 'Droits = valeur en douane × taux de droit', 'Landed cost = valeur en douane + droits + frais de dédouanement'],
        terms: [
          ['Valeur en douane', 'Base de calcul des droits (CIF : prix, transport et assurance).'],
          ['Droits de douane', 'Taxe qui dépend du code SH, de l\'origine et de la valeur.'],
          ['Frais de dédouanement', 'Transitaire, déclaration, manutention au port.'],
          ['TVA import', '(Valeur en douane + droits) × taux, récupérable en général.'],
        ],
        example: {
          statement: 'Marchandise 20 000 €, fret et assurance 1 600 €, droits 4 %, frais de dédouanement 400 €.',
          steps: ['Valeur en douane = 20 000 + 1 600 = 21 600 €', 'Droits = 21 600 × 4 % = 864 €', 'Landed cost = 21 600 + 864 + 400 = 22 864 €'],
          result: 'Le coût réel est de 22 864 €, soit 14,3 % de plus que le prix d\'achat.',
        },
        exercises: [
          () => {
            const price = int(10, 60, 5) * 1000
            const freight = int(800, 3000, 100)
            return {
              kind: 'number',
              statement: 'Calcule la valeur en douane.',
              data: [['Prix de la marchandise', `${fmt(price)} €`], ['Transport et assurance jusqu\'à la frontière', `${fmt(freight)} €`]],
              question: 'Valeur en douane (en €) ?',
              answer: price + freight,
              unit: '€',
              tolerance: 1,
              steps: [`${fmt(price)} + ${fmt(freight)} = ${fmt(price + freight, 0)} €`],
              conclusion: 'La valeur en douane inclut le transport et l\'assurance : elle est plus élevée que le prix de la facture.',
            }
          },
          () => {
            const vd = int(15, 80, 5) * 1000
            const rate = pick([2, 3, 4, 6, 8, 12])
            return {
              kind: 'number',
              statement: 'Calcule les droits de douane.',
              data: [['Valeur en douane', `${fmt(vd)} €`], ['Taux de droit', `${rate} %`]],
              question: 'Droits de douane (en €) ?',
              answer: (vd * rate) / 100,
              unit: '€',
              tolerance: 1,
              steps: [`${fmt(vd)} × ${rate} % = ${fmt((vd * rate) / 100, 0)} €`],
              conclusion: 'Le code SH et l\'origine fixent le taux : une origine préférentielle peut le ramener à 0 %.',
            }
          },
          () => {
            const price = int(15, 60, 5) * 1000
            const freight = int(1000, 3000, 100)
            const rate = pick([3, 4, 6, 8])
            const fees = int(200, 800, 100)
            const vd = price + freight
            return {
              kind: 'number',
              statement: 'Calcule le coût de revient rendu (TVA exclue).',
              data: [['Prix', `${fmt(price)} €`], ['Fret + assurance', `${fmt(freight)} €`], ['Taux de droit', `${rate} %`], ['Frais de dédouanement', `${fmt(fees)} €`]],
              question: 'Landed cost (en €) ?',
              answer: vd + (vd * rate) / 100 + fees,
              unit: '€',
              tolerance: 1,
              steps: [`Valeur en douane = ${fmt(price)} + ${fmt(freight)} = ${fmt(vd, 0)} €`, `Droits = ${fmt(vd, 0)} × ${rate} % = ${fmt((vd * rate) / 100, 0)} €`, `Landed cost = ${fmt(vd, 0)} + ${fmt((vd * rate) / 100, 0)} + ${fmt(fees)} = ${fmt(vd + (vd * rate) / 100 + fees, 0)} €`],
              conclusion: 'Ce coût est celui à comparer avec le prix d\'un fournisseur local.',
            }
          },
          () => {
            const units = int(1, 8) * 1000
            const priceUnit = int(5, 20)
            const fixed = int(1000, 4000, 250)
            const rate = pick([4, 6, 8])
            const vd = units * priceUnit + fixed
            const landed = vd * (1 + rate / 100)
            return {
              kind: 'number',
              statement: 'Calcule le coût de revient par unité (sans frais de dédouanement).',
              data: [['Quantité', fmt(units)], ['Prix unitaire', `${priceUnit} €`], ['Transport + assurance', `${fmt(fixed)} €`], ['Taux de droit', `${rate} %`]],
              question: 'Coût par unité (en €) ?',
              answer: landed / units,
              unit: '€',
              tolerance: 0.02,
              steps: [`Valeur en douane = ${fmt(units)} × ${priceUnit} + ${fmt(fixed)} = ${fmt(vd, 0)} €`, `Avec droits = ${fmt(vd, 0)} × ${fmt(1 + rate / 100)} = ${fmt(landed, 0)} €`, `Par unité = ${fmt(landed, 0)} / ${fmt(units)} = ${fmt(landed / units, 2)} €`],
              conclusion: 'On ramène toujours le coût total à l\'unité pour comparer à un prix local.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'price', label: 'Prix de la marchandise', unit: '€', value: 20000 },
            { key: 'freight', label: 'Transport + assurance', unit: '€', value: 1600 },
            { key: 'rate', label: 'Taux de droit', unit: '%', value: 4 },
            { key: 'fees', label: 'Frais de dédouanement', unit: '€', value: 400 },
            { key: 'vat', label: 'Taux de TVA', unit: '%', value: 20 },
          ],
          outputs: [
            { label: 'Valeur en douane', unit: '€', digits: 0, fn: (n) => n.price + n.freight },
            { label: 'Droits de douane', unit: '€', digits: 0, fn: (n) => ((n.price + n.freight) * n.rate) / 100 },
            { label: 'TVA à l\'import (récupérable)', unit: '€', digits: 0, fn: (n) => ((n.price + n.freight) * (1 + n.rate / 100) * n.vat) / 100 },
            { label: 'Coût de revient rendu', unit: '€', digits: 0, highlight: true, fn: (n) => (n.price + n.freight) * (1 + n.rate / 100) + n.fees },
          ],
          steps: (n) => [`Valeur en douane = ${fmt(n.price)} + ${fmt(n.freight)} = ${fmt(n.price + n.freight)} €`, `Droits = ${fmt(n.price + n.freight)} × ${fmt(n.rate)} % = ${fmt(((n.price + n.freight) * n.rate) / 100, 0)} €`],
          note: 'La TVA est affichée à titre d\'information : elle est exclue du coût de revient.',
        },
      },
    },

    {
      id: 'taux-de-change',
      title: 'Taux de change et risque de change',
      short: 'Montant en € = montant en devise ÷ cours',
      course: {
        purpose:
          "Acheter ou vendre dans une autre devise expose à un **risque de change** : entre la commande et le paiement, le cours peut évoluer et modifier le coût réel en euros. On convertit avec le **cours** (nombre de devises pour 1 €) et on mesure l'effet d'une variation.",
        formulas: ['Montant en € = montant en devise / cours (cotation « devise pour 1 € »)', 'Variation de coût = nouveau montant en € − ancien montant en €', 'Couverture : fixer le cours à l\'avance (change à terme)'],
        terms: [
          ['Cours (EUR/USD)', 'Nombre de dollars pour 1 euro, par exemple 1,10.'],
          ['Risque de change', 'Risque de perte dû à l\'évolution du cours entre commande et paiement.'],
          ['Change à terme', 'Contrat bancaire qui fixe aujourd\'hui le cours d\'un paiement futur.'],
        ],
        example: {
          statement: 'Achat de 110 000 USD. Cours à la commande 1,10 ; cours au paiement 1,00.',
          steps: ['À 1,10 : 110 000 / 1,10 = 100 000 €', 'À 1,00 : 110 000 / 1,00 = 110 000 €', 'Surcoût = 10 000 €'],
          result: 'Un euro plus faible (1,00 au lieu de 1,10) augmente le coût de 10 000 € pour l\'acheteur.',
        },
        exercises: [
          () => {
            const usd = int(20, 200, 10) * 1000
            const rate = int(100, 125) / 100
            return {
              kind: 'number',
              statement: 'Convertis un achat en dollars en euros.',
              data: [['Montant', `${fmt(usd)} USD`], ['Cours EUR/USD', fmt(rate)]],
              question: 'Montant en euros (en €) ?',
              answer: usd / rate,
              unit: '€',
              tolerance: 5,
              steps: [`${fmt(usd)} / ${fmt(rate)} = ${fmt(usd / rate, 0)} €`],
              conclusion: 'On divise par le cours quand il est coté « devise pour 1 € ».',
            }
          },
          () => {
            const usd = int(50, 200, 10) * 1000
            const r1 = int(105, 120) / 100
            const r2 = r1 - int(3, 10) / 100
            return {
              kind: 'number',
              statement: 'Le cours baisse entre la commande et le paiement. Calcule le surcoût en euros.',
              data: [['Montant', `${fmt(usd)} USD`], ['Cours à la commande', fmt(r1)], ['Cours au paiement', fmt(r2)]],
              question: 'Surcoût (en €) ?',
              answer: usd / r2 - usd / r1,
              unit: '€',
              tolerance: 10,
              steps: [`À la commande : ${fmt(usd)} / ${fmt(r1)} = ${fmt(usd / r1, 0)} €`, `Au paiement : ${fmt(usd)} / ${fmt(r2)} = ${fmt(usd / r2, 0)} €`, `Surcoût = ${fmt(usd / r2 - usd / r1, 0)} €`],
              conclusion: 'Quand l\'euro baisse, les achats en dollars coûtent plus cher en euros.',
            }
          },
          () => {
            const eur = int(20, 100, 5) * 1000
            const rate = int(100, 125) / 100
            return {
              kind: 'number',
              statement: 'Un client américain doit payer une facture en dollars. Calcule le montant en USD.',
              data: [['Facture', `${fmt(eur)} €`], ['Cours EUR/USD', fmt(rate)]],
              question: 'Montant en dollars (en USD) ?',
              answer: eur * rate,
              unit: 'USD',
              tolerance: 5,
              steps: [`${fmt(eur)} × ${fmt(rate)} = ${fmt(eur * rate, 0)} USD`],
              conclusion: 'On multiplie par le cours pour passer des euros à la devise.',
            }
          },
          () => {
            const usd = int(60, 200, 10) * 1000
            const r = int(105, 118) / 100
            const premium = pick([0.5, 1, 1.5])
            return {
              kind: 'number',
              statement: 'Une banque propose de couvrir le risque de change pour un coût de quelques % du montant en euros. Calcule ce coût.',
              data: [['Montant', `${fmt(usd)} USD`], ['Cours', fmt(r)], ['Coût de la couverture', `${fmt(premium)} %`]],
              question: 'Coût de la couverture (en €) ?',
              answer: (usd / r) * (premium / 100),
              unit: '€',
              tolerance: 3,
              steps: [`Montant en € = ${fmt(usd)} / ${fmt(r)} = ${fmt(usd / r, 0)} €`, `Coût = ${fmt(usd / r, 0)} × ${fmt(premium)} % = ${fmt((usd / r) * (premium / 100), 0)} €`],
              conclusion: 'Ce coût connu à l\'avance se compare à la perte possible en cas de mauvaise évolution du cours.',
            }
          },
        ],
        calculator: {
          inputs: [
            { key: 'usd', label: 'Montant en devise', value: 110000 },
            { key: 'r1', label: 'Cours à la commande', value: 1.1 },
            { key: 'r2', label: 'Cours au paiement', value: 1 },
          ],
          outputs: [
            { label: 'Coût en € au cours de la commande', unit: '€', digits: 0, fn: (n) => (n.r1 > 0 ? n.usd / n.r1 : 0) },
            { label: 'Coût en € au cours du paiement', unit: '€', digits: 0, fn: (n) => (n.r2 > 0 ? n.usd / n.r2 : 0) },
            { label: 'Écart (surcoût si positif)', unit: '€', digits: 0, highlight: true, fn: (n) => (n.r1 > 0 && n.r2 > 0 ? n.usd / n.r2 - n.usd / n.r1 : 0) },
          ],
          steps: (n) => [`Au paiement : ${fmt(n.usd)} / ${fmt(n.r2)}`],
          note: 'Cotation utilisée : nombre de devises pour 1 euro.',
        },
      },
    },
  ],

  excel: [
    {
      id: 'valeur-douane-excel',
      fn: 'SOMME',
      level: 2,
      tier: 5,
      title: 'La valeur en douane',
      context: 'Tu prépares la déclaration d\'importation d\'un lot de marchandises.',
      instruction: 'En **B5**, calcule la **valeur en douane** : prix + transport + assurance.',
      generate() {
        return { rows: [['Prix marchandise (€)', int(10, 60, 5) * 1000], ['Transport (€)', int(800, 3000, 100)], ['Assurance (€)', int(50, 300, 50)], ['Frais de dédouanement (€)', int(200, 600, 100)]], extra: { A5: 'Valeur en douane (€)' } }
      },
      target: 'B5',
      solution: '=SOMME(B1:B3)',
      mustUse: ['SOMME'],
      hints: ['Les frais de dédouanement (B4) ne font pas partie de la valeur en douane.', 'Additionne seulement le prix, le transport et l\'assurance : B1:B3.'],
      explain: 'La valeur en douane inclut le prix, le transport et l\'assurance jusqu\'à la frontière ; les frais de dédouanement sont des coûts à part.',
    },
    {
      id: 'landed-cost-excel',
      fn: 'ARRONDI',
      level: 3,
      tier: 5,
      title: 'Le coût de revient rendu',
      context: 'Tu compares un fournisseur étranger à un fournisseur local en calculant le coût complet.',
      instruction: 'En **B6**, calcule le **coût de revient rendu par unité** : (valeur en douane × (1 + droits) + frais) ÷ quantité, **arrondi à 2 décimales**.',
      generate() {
        const units = int(2, 10) * 1000
        return { rows: [['Valeur en douane (€)', int(15, 60, 5) * 1000], ['Taux de droit', pick([0.03, 0.04, 0.06, 0.08])], ['Frais de dédouanement (€)', int(200, 800, 100)], ['Quantité', units]], extra: { A6: 'Coût par unité (€)' } }
      },
      target: 'B6',
      solution: '=ARRONDI((B1*(1+B2)+B3)/B4;2)',
      mustUse: ['ARRONDI'],
      hints: ['Droits compris : B1*(1+B2).', 'Ajoute les frais B3, divise par la quantité B4 puis arrondis à 2 décimales.'],
      explain: 'Le coût par unité répartit le coût total (valeur, droits, frais) sur la quantité : c\'est le chiffre à comparer au prix d\'un fournisseur local.',
    },
    {
      id: 'conversion-devise-excel',
      fn: 'ARRONDI',
      level: 2,
      tier: 5,
      title: 'Le surcoût de change',
      context: 'Tu mesures l\'impact d\'une variation du cours sur un achat en dollars.',
      instruction: 'En **B4**, calcule le **surcoût en euros** : montant ÷ cours au paiement − montant ÷ cours à la commande, **arrondi à l\'entier**.',
      generate() {
        const r1 = int(105, 120) / 100
        return { rows: [['Montant (USD)', int(50, 200, 10) * 1000], ['Cours à la commande', r1], ['Cours au paiement', r1 - int(3, 10) / 100]], extra: { A4: 'Surcoût (€)' } }
      },
      target: 'B4',
      solution: '=ARRONDI(B1/B3-B1/B2;0)',
      mustUse: ['ARRONDI'],
      hints: ['Coût au paiement : B1/B3 ; coût à la commande : B1/B2.', 'Soustrais-les et arrondis à l\'entier.'],
      explain: 'Le cours est exprimé en dollars pour 1 euro : on divise donc le montant par le cours. Un cours plus faible augmente le montant en euros.',
    },
  ],

  cases: [
    {
      id: 'import-ou-local',
      title: 'Importer ou acheter local ?',
      role: "Acheteur dans une entreprise de mobilier de jardin",
      lesson: 'douane/valeur-droits',
      generate() {
        const units = int(2, 6) * 1000
        const priceAsia = int(8, 14)
        const priceLocal = priceAsia + int(3, 6)
        const freight = int(1500, 4000, 250)
        const rate = pick([4, 6, 8])
        const fees = int(300, 700, 100)
        const vd = units * priceAsia + freight
        const landed = vd * (1 + rate / 100) + fees
        const perUnit = landed / units
        return {
          intro: `Un fournisseur asiatique propose ${fmt(units)} pièces à ${priceAsia} € l'une (fret et assurance : ${fmt(freight)} € pour le lot). Droits de douane : ${rate} %, frais de dédouanement : ${fmt(fees)} €. Un fournisseur local propose la même pièce à ${priceLocal} €, livrée.`,
          steps: [
            {
              situation: 'Comment compares-tu les deux offres ?',
              better: `Le prix affiché (${priceAsia} €) ne suffit pas : il faut calculer le coût de revient rendu : valeur en douane (${fmt(vd, 0)} €) + droits (${fmt((vd * rate) / 100, 0)} €) + frais (${fmt(fees)} €) = ${fmt(landed, 0)} €, soit ${fmt(perUnit, 2)} € par pièce.`,
              choices: [
                { text: `Je calcule le coût rendu : ${fmt(perUnit, 2)} € par pièce.`, points: 3, feedback: `Valeur en douane + droits + frais, divisés par ${fmt(units)} : ${fmt(perUnit, 2)} € par pièce, à comparer à ${priceLocal} €.` },
                { text: `Je compare directement ${priceAsia} € et ${priceLocal} €.`, points: 0, feedback: 'Cette comparaison ignore le fret, les droits et les frais : le fournisseur asiatique paraît artificiellement moins cher.' },
                { text: 'Je compare seulement les droits de douane.', points: 1, feedback: 'Les droits ne sont qu\'une partie du coût : fret, assurance et frais pèsent aussi.' },
              ],
            },
            {
              situation: `L'écart de coût est de ${fmt(priceLocal - perUnit, 2)} € par pièce en faveur du ${priceLocal - perUnit > 0 ? 'fournisseur asiatique' : 'fournisseur local'}. Quels autres éléments prends-tu en compte ?`,
              better: "Le coût de revient n'est pas tout : délai de livraison (6 à 8 semaines contre quelques jours), stock de sécurité à prévoir, qualité, risque de change et trésorerie immobilisée. On les chiffre si possible avant de décider.",
              choices: [
                { text: 'Délai, stock de sécurité, qualité, change et trésorerie, que je chiffre.', points: 3, feedback: 'Un fournisseur lointain implique un stock plus élevé et un risque : leur coût doit être ajouté à la comparaison.' },
                { text: 'Aucun autre : le plus bas coût gagne.', points: 0, feedback: 'Un coût de revient bas peut cacher des délais longs, des défauts et un stock de sécurité plus coûteux.' },
                { text: 'Seulement la couleur du produit.', points: 1, feedback: 'La couleur est secondaire face aux coûts cachés et aux risques logistiques.' },
              ],
            },
            {
              situation: 'Quelle décision prends-tu ?',
              better: "Une décision équilibrée : si l'écart est net, importer une partie des volumes et garder le local pour les urgences (double sourcing). On vérifie aussi si une origine préférentielle réduirait les droits.",
              choices: [
                { text: 'Répartir les volumes et vérifier une origine préférentielle.', points: 3, feedback: 'La répartition limite le risque ; une origine préférentielle peut réduire les droits à zéro.' },
                { text: 'Tout importer sans test, car c\'est moins cher.', points: 1, feedback: 'Un basculement total est risqué : un incident de transport arrêterait la production.' },
                { text: 'Refuser tout import par principe.', points: 0, feedback: 'Refuser sans calcul peut faire perdre une économie réelle.' },
              ],
            },
          ],
          debrief: `Le coût de revient rendu (${fmt(perUnit, 2)} € par pièce contre ${priceLocal} € en local) se calcule avec la valeur en douane, les droits et les frais ; la décision tient aussi compte des délais, du stock de sécurité, du change et du risque.`,
        }
      },
    },
    {
      id: 'premier-client-etranger',
      title: 'Comment se faire payer par un client lointain ?',
      role: "Responsable export d'une PME de machines-outils",
      lesson: 'douane/paiements-internationaux',
      intro:
        "Un nouveau client dans un pays d'Afrique de l'Ouest veut commander pour 180 000 € de machines. Vous ne le connaissez pas, le pays présente un risque politique moyen et les machines seront fabriquées sur mesure : si le client refuse la livraison, elles seront difficiles à revendre.",
      steps: [
        {
          situation: 'Quel mode de paiement proposes-tu ?',
          better:
            "Pour une première grosse commande avec un client inconnu et un produit sur mesure, le risque est élevé : un crédit documentaire irrévocable et confirmé par une banque de votre pays garantit le paiement si les documents sont conformes.",
          choices: [
            { text: 'Un crédit documentaire irrévocable, confirmé par ma banque.', points: 3, feedback: 'La banque s\'engage à payer sur documents conformes ; la confirmation supprime le risque de défaillance de la banque étrangère.' },
            { text: 'Un virement 90 jours après livraison.', points: 0, feedback: 'Cela revient à faire crédit à un inconnu pour un produit sur mesure : en cas de défaut de paiement, la perte serait totale.' },
            { text: "Un paiement d'avance de 100 %.", points: 1, feedback: 'C\'est très sûr pour vous, mais le client le refusera probablement : il porterait tout le risque.' },
          ],
        },
        {
          situation: 'Le client trouve le crédit documentaire trop coûteux (environ 1 % du montant). Que fais-tu ?',
          better:
            "Un acompte à la commande (30 %) couvre les coûts de fabrication sur mesure, et le solde est garanti par une remise ou un crédit documentaire. Le coût (1 % de 180 000 € = 1 800 €) se compare au risque de perdre 180 000 €.",
          choices: [
            { text: 'Un acompte de 30 % et le solde garanti par la banque.', points: 3, feedback: 'L\'acompte couvre le produit sur mesure et la garantie bancaire protège le reste, pour un coût limité.' },
            { text: 'J\'accepte un virement à 60 jours sans garantie.', points: 0, feedback: 'Le coût évité (1 800 €) est minime face au risque de perdre 180 000 €.' },
            { text: 'Je refuse la commande.', points: 1, feedback: 'Refuser fait perdre un contrat intéressant : mieux vaut négocier une garantie adaptée.' },
          ],
        },
        {
          situation: 'Quelle règle des Incoterms et quelles dispositions de transport proposes-tu ?',
          better:
            "Pour limiter les litiges, on choisit un Incoterm précis (par exemple CIF ou CIP avec assurance) et on vérifie que les documents du crédit documentaire correspondent exactement au contrat : facture, connaissement, liste de colisage, certificat d'origine.",
          choices: [
            { text: 'Un Incoterm clair avec assurance, et des documents identiques au crédit.', points: 3, feedback: 'Un Incoterm précis évite les litiges et des documents conformes évitent un refus de paiement par la banque.' },
            { text: 'Aucun Incoterm : on verra à la livraison.', points: 0, feedback: 'Sans Incoterm, la répartition des risques et des frais est floue : litiges probables.' },
            { text: 'Laisser le client choisir tous les documents.', points: 1, feedback: 'Les documents doivent respecter strictement le crédit : il faut les préparer avec la banque.' },
          ],
        },
      ],
      debrief:
        "À l'international, on choisit le mode de paiement selon la confiance, le risque pays et le produit : crédit documentaire confirmé pour les cas risqués, acompte pour couvrir la fabrication, et documents parfaitement conformes pour que la banque paie.",
    },
  ],

  english: {
    units: [
      {
        id: 'douane-en',
        title: 'Import, export et douane',
        icon: 'landmark',
        color: 'teal',
        lessons: [
          {
            id: 'import-export',
            title: 'Importer et exporter',
            level: 2,
            items: [
              { en: 'import', fr: 'importer (importation)', def: "Faire entrer des marchandises dans un pays depuis l'étranger.", ex: 'We import parts from Asia.', exFr: 'Nous importons des pièces d\'Asie.' },
              { en: 'export', fr: 'exporter (exportation)', def: "Vendre et envoyer des marchandises vers l'étranger.", ex: 'They export wine to Canada.', exFr: 'Ils exportent du vin vers le Canada.' },
              { en: 'duty', fr: 'droit de douane', def: "Taxe payée à l'entrée d'une marchandise dans un pays.", ex: 'The duty is five percent.', exFr: 'Le droit de douane est de cinq pour cent.' },
              { en: 'tariff', fr: 'tarif douanier', def: "Taux de droits de douane applicable à un type de marchandise.", ex: 'A new tariff was introduced.', exFr: 'Un nouveau tarif douanier a été instauré.' },
              { en: 'customs broker', fr: 'commissionnaire en douane', def: "Professionnel qui fait les déclarations en douane pour le compte d'une entreprise.", ex: 'Our customs broker files the declaration.', exFr: 'Notre commissionnaire en douane dépose la déclaration.' },
              { en: 'certificate of origin', fr: 'certificat d\'origine', def: "Document qui prouve le pays où la marchandise a été fabriquée.", ex: 'Please send the certificate of origin.', exFr: 'Veuillez envoyer le certificat d\'origine.' },
              { en: 'bonded warehouse', fr: 'entrepôt sous douane', def: "Entrepôt où l'on stocke des marchandises sans payer les droits tant qu'elles n'en sortent pas.", ex: 'The goods are in a bonded warehouse.', exFr: 'Les marchandises sont dans un entrepôt sous douane.' },
              { en: 'inspection', fr: 'contrôle (inspection)', def: "Vérification des marchandises ou des documents par la douane.", ex: 'The container passed inspection.', exFr: 'Le conteneur a passé le contrôle.' },
            ],
          },
          {
            id: 'frais-paiement',
            title: 'Coûts et paiements',
            level: 2,
            items: [
              { en: 'exchange rate', fr: 'taux de change', def: "Prix d'une monnaie exprimé dans une autre monnaie.", ex: 'The exchange rate changed this week.', exFr: 'Le taux de change a changé cette semaine.' },
              { en: 'letter of credit', fr: 'crédit documentaire', def: "Engagement d'une banque à payer le vendeur si les documents exigés sont conformes.", ex: 'We pay by letter of credit.', exFr: 'Nous payons par crédit documentaire.' },
              { en: 'down payment', fr: 'acompte', def: "Somme payée à l'avance sur le prix total.", ex: 'A thirty percent down payment is required.', exFr: 'Un acompte de trente pour cent est exigé.' },
              { en: 'bank transfer', fr: 'virement bancaire', def: "Paiement d'un compte bancaire à un autre.", ex: 'Payment is by bank transfer.', exFr: 'Le paiement se fait par virement bancaire.' },
              { en: 'cash in advance', fr: "paiement à l'avance", def: "Mode de paiement où le client règle avant que la marchandise ne soit expédiée.", ex: 'We ask for cash in advance.', exFr: "Nous demandons un paiement à l'avance." },
              { en: 'late payment', fr: 'retard de paiement', def: "Paiement reçu après la date prévue.", ex: 'Late payment causes extra costs.', exFr: 'Un retard de paiement crée des coûts supplémentaires.' },
              { en: 'additional fee', fr: 'frais supplémentaires', def: "Somme ajoutée au prix normal pour un service en plus.", ex: 'An additional fee applies.', exFr: "Des frais supplémentaires s'appliquent." },
              { en: 'handling fee', fr: 'frais de manutention', def: "Somme demandée pour déplacer et traiter les marchandises.", ex: 'The handling fee is fifty euros.', exFr: 'Les frais de manutention sont de cinquante euros.' },
            ],
          },
          {
            id: 'douane-phrases',
            title: 'Parler de douane',
            level: 3,
            items: [
              { en: 'The shipment is held at customs.', fr: 'L\'expédition est bloquée en douane.', blank: 'held' },
              { en: 'We need the commercial invoice and the packing list.', fr: 'Nous avons besoin de la facture commerciale et de la liste de colisage.', blank: 'commercial' },
              { en: 'Who pays the import duties?', fr: 'Qui paie les droits d\'importation ?', blank: 'duties' },
              { en: 'The goods were cleared yesterday.', fr: 'Les marchandises ont été dédouanées hier.', blank: 'cleared' },
              { en: 'Please confirm the harmonized code of the product.', fr: 'Veuillez confirmer le code douanier du produit.', blank: 'harmonized' },
              { en: 'The container will be inspected on arrival.', fr: 'Le conteneur sera contrôlé à l\'arrivée.', blank: 'inspected' },
            ],
          },
        ],
      },
    ],
  },
}
