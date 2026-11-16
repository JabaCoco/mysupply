// Lot 10 — Nouveau module : Douane et international (6 leçons).
import { fmt, int, numQuestion, pick } from '../gen.js'

export default {
  id: "douane",
  title: "Douane et international",
  short: "Douane",
  icon: "landmark",
  color: "teal",
  lessons: [
    {
      id: "code-sh",
      title: "Le code douanier (code SH)",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Une langue commune pour les marchandises",
          body: "Chaque produit qui franchit une frontière doit être **classé** dans une nomenclature douanière. Le **Système harmonisé (SH)**, utilisé par plus de 200 pays, attribue un **code** à chaque type de marchandise. Ce code détermine le **taux de droits de douane**, les **contrôles** et les **statistiques**.",
        },
        {
          type: "list",
          title: "La structure du code",
          items: [
            ["6 chiffres", "Le code SH : identique dans le monde entier."],
            ["8 chiffres", "La nomenclature combinée (NC) de l'Union européenne."],
            ["10 chiffres", "Le TARIC, tarif douanier intégré de l'UE, avec les mesures détaillées."],
          ],
        },
        {
          type: "example",
          title: "Lire un code",
          body: "Les **2 premiers chiffres** désignent le **chapitre** (par exemple 61 : vêtements en bonneterie), les **4 premiers** la **position**, les **6 premiers** la **sous-position**.\n\nPlus on ajoute de chiffres, plus le classement est précis. Deux pays peuvent avoir des codes différents au-delà du 6e chiffre.",
        },
        {
          type: "list",
          title: "Pourquoi bien classer ?",
          items: [
            ["Droits de douane", "Un mauvais code peut appliquer un mauvais taux : trop payé ou redressement."],
            ["Réglementation", "Certains codes déclenchent des contrôles (sanitaires, licences)."],
            ["Statistiques", "Les États suivent leurs échanges par code."],
          ],
        },
        {
          type: "text",
          title: "Qui décide ?",
          body: "Le **déclarant** (l'importateur, ou son **commissionnaire en douane**) choisit le code. En cas de doute, on peut demander à l'administration un **renseignement tarifaire contraignant (RTC)** : une décision écrite qui protège l'entreprise pendant plusieurs années.",
        },
        {
          type: "key",
          points: [
            "Code SH : 6 chiffres communs au monde ; NC : 8 chiffres UE ; TARIC : 10 chiffres.",
            "Le code détermine droits de douane, contrôles et statistiques.",
            "Un mauvais classement expose à des redressements.",
            "Le RTC apporte une sécurité juridique en cas de doute.",
          ],
        },
      ],
      quiz: [
        () => {
          const chapter = pick([61, 62, 84, 85, 87, 94])
          return numQuestion({
            q: `Un code douanier commence par ${chapter}. Combien de chiffres compte le code SH commun à tous les pays ?`,
            answer: 6,
            unit: "chiffres",
            digits: 0,
            explain: "Le code SH comporte 6 chiffres communs ; l'UE ajoute 2 chiffres (NC) puis 2 autres (TARIC).",
            wrong: [4, 8, 10, 12],
          })
        },
        () => {
          const value = int(10, 80, 5) * 1000
          const rate = pick([2, 4, 6, 8, 12])
          return numQuestion({
            q: `Une marchandise de ${fmt(value)} € est classée sous un code à ${rate} % de droits. Quel montant de droits de douane est dû ?`,
            answer: (value * rate) / 100,
            unit: "€",
            digits: 0,
            explain: `${fmt(value)} × ${rate} % = ${fmt((value * rate) / 100, 0)} €.`,
            wrong: [value * rate, value / rate, value - (value * rate) / 100, (value * rate) / 10],
          })
        },
        {
          q: "À quoi sert le code SH ?",
          choices: ["À classer chaque marchandise pour la douane", "À identifier le transporteur du colis", "À fixer le prix de vente du produit", "À choisir le type d'emballage"],
          answer: 0,
          explain: "Le code SH classe les marchandises : il détermine les droits, les contrôles et les statistiques.",
        },
        {
          q: "Combien de chiffres compte la nomenclature combinée de l'UE ?",
          choices: ["8", "2", "12", "20"],
          answer: 0,
          explain: "La NC ajoute 2 chiffres aux 6 chiffres du SH, ce qui donne 8 chiffres.",
        },
        {
          q: "Que désignent les deux premiers chiffres d'un code SH ?",
          choices: ["Le chapitre", "Le pays d'origine", "Le transporteur choisi", "Le taux de TVA"],
          answer: 0,
          explain: "Les 2 premiers chiffres indiquent le chapitre, par exemple 84 pour les machines.",
        },
        {
          q: "Que risque-t-on avec un mauvais code douanier ?",
          choices: ["Un redressement et des pénalités", "Un transport plus rapide que prévu", "Une baisse automatique des taxes", "Une exonération de toutes les formalités"],
          answer: 0,
          explain: "Un classement erroné peut conduire à des droits mal calculés, donc à un redressement et à des amendes.",
        },
        {
          q: "Que permet un RTC (renseignement tarifaire contraignant) ?",
          choices: ["Obtenir une décision écrite sur le classement", "Dispenser l'importateur de toute formalité", "Fixer soi-même le taux de douane", "Annuler les contrôles sanitaires"],
          answer: 0,
          explain: "Le RTC est une décision de l'administration, valable plusieurs années, qui sécurise le classement d'un produit.",
        },
        {
          q: "Qui choisit le code douanier d'une importation ?",
          choices: ["Le déclarant en douane", "Le conducteur du camion", "Le client final uniquement", "La compagnie maritime"],
          answer: 0,
          explain: "C'est le déclarant (importateur ou commissionnaire en douane) qui engage sa responsabilité sur le classement.",
        },
      ],
    },

    {
      id: "origine",
      title: "L'origine des marchandises",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "D'où vient vraiment le produit ?",
          body: "L'**origine** d'une marchandise n'est pas le pays d'où elle est expédiée, mais celui où elle a été **entièrement obtenue** ou a subi sa **dernière transformation substantielle**. Elle conditionne les **droits de douane**, les **quotas** et les **mesures** (embargos, droits antidumping).",
        },
        {
          type: "list",
          title: "Deux types d'origine",
          items: [
            ["Origine non préférentielle", "Sert aux statistiques, au marquage « made in » et aux mesures commerciales."],
            ["Origine préférentielle", "Donne droit à un droit réduit ou nul grâce à un accord commercial entre pays."],
          ],
        },
        {
          type: "list",
          title: "Les preuves",
          items: [
            ["Certificat d'origine", "Document délivré par une chambre de commerce."],
            ["EUR.1 / déclaration d'origine", "Preuve de l'origine préférentielle dans les accords de l'UE."],
            ["Exportateur enregistré (REX)", "Système où l'exportateur atteste lui-même l'origine."],
          ],
        },
        {
          type: "example",
          title: "Un exemple : le tee-shirt",
          body: "Un tissu fabriqué en Chine, découpé et cousu au Maroc, puis expédié depuis l'Espagne. Quelle est l'origine ? Celle du **pays de la dernière transformation substantielle** : ici le Maroc (la couture), pas l'Espagne (simple expédition).\n\nSi l'accord UE-Maroc l'autorise, ce tee-shirt peut entrer en Europe à **droit réduit ou nul**.",
        },
        {
          type: "key",
          points: [
            "Origine = pays d'obtention ou de dernière transformation substantielle.",
            "Pas le pays d'expédition.",
            "Origine préférentielle : droits réduits ou nuls grâce à un accord.",
            "Preuves : certificat d'origine, EUR.1, déclaration d'origine.",
          ],
        },
      ],
      quiz: [
        () => {
          const value = int(20, 100, 10) * 1000
          const full = pick([6, 8, 10, 12])
          return numQuestion({
            q: `Une marchandise de ${fmt(value)} € supporte ${full} % de droits sans accord, mais 0 % avec une origine préférentielle valide. Quelle économie la preuve d'origine permet-elle ?`,
            answer: (value * full) / 100,
            unit: "€",
            digits: 0,
            explain: `Droits évités = ${fmt(value)} × ${full} % = ${fmt((value * full) / 100, 0)} €.`,
            wrong: [value, value * full, value / full, (value * full) / 200],
          })
        },
        () => {
          const share = pick([30, 40, 50, 60, 70])
          const total = int(10, 50, 5) * 1000
          return numQuestion({
            q: `Un produit de ${fmt(total)} € contient ${share} % de composants importés hors accord. Quelle valeur de composants cela représente-t-il ?`,
            answer: (total * share) / 100,
            unit: "€",
            digits: 0,
            explain: `${fmt(total)} × ${share} % = ${fmt((total * share) / 100, 0)} €. Cette part compte dans les règles d'origine de nombreux accords.`,
            wrong: [total - (total * share) / 100 + 1000, total * share, total / share, (total * share) / 10],
          })
        },
        {
          q: "Qu'est-ce que l'origine d'une marchandise ?",
          choices: ["Le pays où elle a été obtenue ou transformée", "Le pays d'où part le dernier camion", "Le pays du siège de l'acheteur", "Le pays du port d'embarquement"],
          answer: 0,
          explain: "L'origine désigne le pays d'obtention ou de dernière transformation substantielle, pas le simple pays d'expédition.",
        },
        {
          q: "À quoi sert l'origine préférentielle ?",
          choices: ["À bénéficier de droits réduits ou nuls", "À augmenter les droits de douane", "À éviter de faire une déclaration", "À choisir son transporteur"],
          answer: 0,
          explain: "Quand un accord commercial existe, une origine préférentielle prouvée réduit ou supprime les droits de douane.",
        },
        {
          q: "Quel document prouve couramment l'origine d'un produit ?",
          choices: ["Le certificat d'origine", "Le bulletin de salaire", "La liste de colisage", "Le bon de livraison interne"],
          answer: 0,
          explain: "Le certificat d'origine (ou une déclaration d'origine) est la preuve classique demandée à l'importation.",
        },
        {
          q: "Dans l'exemple du tee-shirt cousu au Maroc et expédié d'Espagne, quelle est l'origine ?",
          choices: ["Le Maroc", "L'Espagne", "La Chine", "Aucun pays"],
          answer: 0,
          explain: "C'est la dernière transformation substantielle (la confection) qui donne l'origine, ici au Maroc.",
        },
        {
          q: "Que désigne le marquage « made in » ?",
          choices: ["L'origine non préférentielle", "Le lieu de livraison", "La marque du fabricant", "Le code douanier"],
          answer: 0,
          explain: "Le « made in » repose sur les règles d'origine non préférentielle, utilisées pour l'étiquetage et la politique commerciale.",
        },
        {
          q: "Pourquoi l'origine compte-t-elle aussi pour les mesures commerciales ?",
          choices: ["Certains pays subissent des droits ou des quotas", "Elle fixe le prix de vente en magasin", "Elle choisit le mode de transport", "Elle détermine la couleur de l'emballage"],
          answer: 0,
          explain: "Quotas, embargos ou droits antidumping dépendent de l'origine du produit.",
        },
      ],
    },

    {
      id: "valeur-droits",
      title: "Valeur en douane, droits et TVA",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "Combien payer à l'importation ?",
          body: "À l'arrivée dans l'Union européenne, une marchandise supporte :\n• des **droits de douane** (selon le code SH et l'origine),\n• la **TVA à l'importation**, récupérable par l'entreprise en général.\n\nTout part de la **valeur en douane**, qui n'est pas simplement le prix de la facture.",
        },
        {
          type: "formula",
          title: "La valeur en douane (base CIF)",
          formula: "Valeur en douane = prix de la marchandise + transport + assurance jusqu'à la frontière de l'UE",
          legend: [
            ["Prix", "Valeur transactionnelle de la facture."],
            ["Transport et assurance", "Jusqu'au point d'entrée dans l'UE (base CIF)."],
            ["Droits", "Valeur en douane × taux de droit."],
          ],
          example: "Marchandise 20 000 € + fret 1 500 € + assurance 100 € = 21 600 € de valeur en douane.",
        },
        {
          type: "formula",
          title: "Droits et TVA à l'import",
          formula: "TVA = (valeur en douane + droits) × taux de TVA",
          legend: [
            ["Droits", "Valeur en douane × taux de droit."],
            ["TVA", "En France, 20 % pour la plupart des produits."],
          ],
          example: "Valeur 21 600 €, droits 4 % = 864 €. TVA = (21 600 + 864) × 20 % = 4 492,80 €.",
        },
        {
          type: "text",
          title: "Le coût complet d'importation",
          body: "Le coût réel d'une importation (le **coût de revient rendu**, ou *landed cost*) est la **valeur de la marchandise + transport + assurance + droits + frais de dédouanement** (transitaire, déclaration). La **TVA n'en fait pas partie** car elle est généralement récupérée.\n\nComparer deux sources de pays différents impose de calculer ce coût complet, pas seulement le prix d'achat.",
        },
        {
          type: "key",
          points: [
            "Valeur en douane = prix + transport + assurance jusqu'à la frontière UE.",
            "Droits = valeur en douane × taux ; TVA = (valeur + droits) × taux de TVA.",
            "La TVA est en général récupérable : hors coût de revient.",
            "Comparer les sources avec le coût complet d'importation.",
          ],
        },
      ],
      quiz: [
        () => {
          const price = int(10, 60, 5) * 1000
          const freight = int(800, 3000, 100)
          const ins = int(50, 300, 50)
          return numQuestion({
            q: `Marchandise ${fmt(price)} €, fret ${fmt(freight)} €, assurance ${fmt(ins)} € jusqu'à la frontière UE. Quelle est la valeur en douane ?`,
            answer: price + freight + ins,
            unit: "€",
            digits: 0,
            explain: `${fmt(price)} + ${fmt(freight)} + ${fmt(ins)} = ${fmt(price + freight + ins, 0)} €.`,
            wrong: [price, price + freight, price - freight - ins, (price + freight + ins) * 1.2],
          })
        },
        () => {
          const value = int(15, 80, 5) * 1000
          const rate = pick([2, 4, 6, 8])
          return numQuestion({
            q: `Valeur en douane ${fmt(value)} €, droits de douane de ${rate} %. Quel est le montant des droits ?`,
            answer: (value * rate) / 100,
            unit: "€",
            digits: 0,
            explain: `${fmt(value)} × ${rate} % = ${fmt((value * rate) / 100, 0)} €.`,
            wrong: [value * rate, value / rate, value + (value * rate) / 100, (value * rate) / 10],
          })
        },
        () => {
          const value = int(10, 60, 5) * 1000
          const rate = pick([3, 5, 8])
          const duties = (value * rate) / 100
          return numQuestion({
            q: `Valeur en douane ${fmt(value)} €, droits ${fmt(duties, 0)} €. Quelle est la TVA à l'importation à 20 % ?`,
            answer: (value + duties) * 0.2,
            unit: "€",
            digits: 0,
            explain: `(${fmt(value)} + ${fmt(duties, 0)}) × 20 % = ${fmt((value + duties) * 0.2, 0)} €.`,
            wrong: [value * 0.2, duties * 0.2, (value + duties) * 0.8, (value + duties) * 0.2 * 2],
          })
        },
        () => {
          const price = int(15, 60, 5) * 1000
          const freight = int(1000, 3000, 100)
          const rate = pick([4, 6, 8])
          const fees = int(200, 800, 100)
          const vd = price + freight
          return numQuestion({
            q: `Marchandise ${fmt(price)} €, fret et assurance ${fmt(freight)} € (valeur en douane ${fmt(vd)} €), droits ${rate} %, frais de dédouanement ${fmt(fees)} €. Quel est le coût de revient rendu (TVA exclue) ?`,
            answer: vd + (vd * rate) / 100 + fees,
            unit: "€",
            digits: 0,
            explain: `Valeur en douane ${fmt(vd)} + droits ${fmt((vd * rate) / 100, 0)} + frais ${fmt(fees)} = ${fmt(vd + (vd * rate) / 100 + fees, 0)} €.`,
            wrong: [vd, vd + (vd * rate) / 100, vd * 1.2 + fees, vd + fees],
          })
        },
        {
          q: "Qu'inclut la valeur en douane dans l'UE ?",
          choices: ["Le prix, le transport et l'assurance jusqu'à la frontière", "Uniquement le prix de la facture", "La TVA et les frais de stockage", "Le salaire du déclarant en douane"],
          answer: 0,
          explain: "La valeur en douane est une valeur « rendue frontière UE » (base CIF) : prix, transport et assurance inclus.",
        },
        {
          q: "Sur quelle base calcule-t-on la TVA à l'importation ?",
          choices: ["Valeur en douane plus droits de douane", "Prix de vente au client final", "Valeur de la facture seule", "Coût du transport interne"],
          answer: 0,
          explain: "La TVA s'applique à la valeur en douane augmentée des droits (et éventuelles autres taxes).",
        },
        {
          q: "Pourquoi la TVA n'entre-t-elle pas dans le coût de revient d'une importation ?",
          choices: ["Elle est en général récupérée par l'entreprise", "Elle est toujours gratuite à l'import", "Elle est payée par le transporteur", "Elle ne concerne pas l'Europe"],
          answer: 0,
          explain: "Pour une entreprise assujettie, la TVA payée à l'import est déductible : elle pèse sur la trésorerie, pas sur le coût.",
        },
        {
          q: "Que signifie landed cost ?",
          choices: ["Le coût complet de la marchandise rendue chez soi", "Le prix affiché sur le site du fournisseur", "Le loyer du terrain de l'entrepôt", "La marge de l'importateur"],
          answer: 0,
          explain: "Le landed cost additionne prix, transport, assurance, droits et frais de dédouanement.",
        },
      ],
    },

    {
      id: "regimes",
      title: "Les régimes douaniers",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Dans quel cadre entre ou sort la marchandise ?",
          body: "Une marchandise qui franchit la frontière est placée sous un **régime douanier** : un cadre qui détermine les **droits**, les **taxes** et les **obligations**. Le choix du régime change fortement le coût et la trésorerie.",
        },
        {
          type: "list",
          title: "Les régimes principaux",
          items: [
            ["Mise à la consommation (libre pratique)", "Droits et TVA payés : la marchandise peut circuler et être vendue dans l'UE."],
            ["Exportation", "La marchandise quitte l'UE : exonération de TVA, justificatifs de sortie."],
            ["Transit", "La marchandise circule sous contrôle sans payer les droits (T1 : vers l'intérieur)."],
            ["Entrepôt sous douane", "Stockage sans payer droits ni TVA, jusqu'à la sortie."],
            ["Admission temporaire", "Marchandise utilisée un temps puis réexportée (foire, outillage)."],
            ["Perfectionnement actif", "Importation pour transformation puis réexportation, avec suspension des droits."],
          ],
        },
        {
          type: "example",
          title: "Exemple : l'entrepôt sous douane",
          body: "Un importateur reçoit 500 000 € de marchandise qu'il vendra en plusieurs fois. Avec un **entrepôt sous douane**, il ne paie droits et TVA qu'au **moment de chaque sortie** : sa trésorerie est préservée.\n\nSans ce régime, il aurait payé tous les droits dès l'arrivée.",
        },
        {
          type: "text",
          title: "Le transit",
          body: "Le **transit** permet de transporter une marchandise **sous douane** d'un point à un autre (par exemple du port du Havre à un entrepôt de l'intérieur) sans payer les droits à l'arrivée. Ils sont dus **au lieu de destination**. Un **document de transit** accompagne la marchandise et une **garantie** couvre les droits.",
        },
        {
          type: "key",
          points: [
            "Un régime douanier fixe droits, taxes et obligations.",
            "Mise à la consommation : droits et TVA payés, circulation libre.",
            "Entrepôt sous douane, transit, admission temporaire : suspension des droits.",
            "Le bon régime protège la trésorerie.",
          ],
        },
      ],
      quiz: [
        () => {
          const value = int(100, 800, 50) * 1000
          const rate = pick([3, 4, 6])
          const pieces = int(4, 10)
          const dutyPerLot = (value * rate) / 100 / pieces
          return numQuestion({
            q: `Un stock de ${fmt(value)} € supporte ${rate} % de droits. Placé en entrepôt sous douane, il sort en ${pieces} lots égaux. Quel montant de droits paie-t-on à chaque sortie ?`,
            answer: dutyPerLot,
            unit: "€",
            digits: 0,
            explain: `Droits totaux = ${fmt(value)} × ${rate} % = ${fmt((value * rate) / 100, 0)} € ; par lot : ÷ ${pieces} = ${fmt(dutyPerLot, 0)} €.`,
            wrong: [(value * rate) / 100, value / pieces, dutyPerLot * 2, (value * rate) / 100 + dutyPerLot],
          })
        },
        () => {
          const duties = int(10, 60, 5) * 1000
          const days = pick([30, 60, 90])
          const cost = pick([4, 5, 6])
          return numQuestion({
            q: `Sans entrepôt sous douane, on avance ${fmt(duties)} € de droits ${days} jours plus tôt. Avec un coût de financement de ${cost} % par an (année de 360 jours), quel est le coût de cette avance ?`,
            answer: (duties * cost * days) / (100 * 360),
            unit: "€",
            digits: 0,
            explain: `${fmt(duties)} × ${cost} % × ${days} / 360 = ${fmt((duties * cost * days) / 36000, 0)} €.`,
            wrong: [(duties * cost) / 100, duties * days / 360, (duties * cost * days) / 3600, (duties * cost * days) / 18000],
          })
        },
        {
          q: "Que signifie mise à la consommation ?",
          choices: ["Les droits et la TVA sont payés, la marchandise circule librement", "La marchandise est stockée sans aucune formalité", "La marchandise est détruite par la douane", "La marchandise quitte l'UE définitivement"],
          answer: 0,
          explain: "La mise à la consommation (libre pratique) rend la marchandise disponible pour la vente dans toute l'UE.",
        },
        {
          q: "Quel est l'avantage d'un entrepôt sous douane ?",
          choices: ["Ne payer droits et TVA qu'à la sortie des produits", "Ne jamais payer de droits sur les produits", "Stocker sans limite de durée et de lieu", "Éviter toute déclaration à l'administration"],
          answer: 0,
          explain: "Le paiement est différé jusqu'à la sortie : la trésorerie est préservée tant que la marchandise n'est pas vendue.",
        },
        {
          q: "À quoi sert le transit ?",
          choices: ["Transporter sous douane sans payer les droits en route", "Vendre la marchandise avant son arrivée", "Changer l'origine de la marchandise", "Réduire le poids du chargement"],
          answer: 0,
          explain: "En transit, les droits sont dus au lieu de destination, avec une garantie qui couvre le risque.",
        },
        {
          q: "Quel régime convient à une machine envoyée en salon puis réexportée ?",
          choices: ["L'admission temporaire", "La mise à la consommation", "Le perfectionnement passif", "La destruction contrôlée"],
          answer: 0,
          explain: "L'admission temporaire suspend les droits pour un bien destiné à être réexporté en l'état.",
        },
        {
          q: "Que permet le perfectionnement actif ?",
          choices: ["Importer pour transformer et réexporter, sans payer de droits", "Vendre sans facture", "Éviter toute inspection douanière", "Réduire les droits sur les produits locaux"],
          answer: 0,
          explain: "Les droits sont suspendus pour des marchandises importées afin d'être transformées puis renvoyées hors de l'UE.",
        },
        {
          q: "Pourquoi une exportation est-elle exonérée de TVA ?",
          choices: ["Parce que la marchandise sort de l'UE", "Parce que le client est un ami", "Parce que le prix est plus bas", "Parce que le transport est maritime"],
          answer: 0,
          explain: "La TVA se paie au lieu de consommation : un bien exporté est consommé hors de l'UE (preuve de sortie requise).",
        },
      ],
    },

    {
      id: "oea",
      title: "L'OEA et la conformité",
      minutes: 5,
      cards: [
        {
          type: "text",
          title: "Une entreprise en qui la douane a confiance",
          body: "Le statut d'**opérateur économique agréé (OEA)** est une certification délivrée par la douane à une entreprise **fiable** et **sûre**. En échange de contrôles internes solides, elle bénéficie de **facilités** : moins de contrôles physiques, procédures simplifiées, passage prioritaire.",
        },
        {
          type: "list",
          title: "Les types d'agrément",
          items: [
            ["OEA simplifications douanières (OEAC)", "Fiabilité des procédures douanières et comptables."],
            ["OEA sûreté et sécurité (OEAS)", "Sécurité des sites et de la chaîne logistique."],
            ["OEA complet (OEAF)", "Les deux à la fois."],
          ],
        },
        {
          type: "list",
          title: "Les avantages",
          items: [
            ["Moins de contrôles", "Notamment physiques et documentaires."],
            ["Procédures simplifiées", "Déclarations allégées, dédouanement dans l'entreprise."],
            ["Reconnaissance", "Accords avec d'autres pays (États-Unis, Japon, Chine…)."],
            ["Image", "Argument commercial de fiabilité."],
          ],
        },
        {
          type: "text",
          title: "Les risques de la non-conformité",
          body: "Une erreur de code, d'origine ou de valeur, ou le non-respect d'un embargo, expose à des **redressements**, des **amendes**, la **saisie** de la marchandise, voire des **poursuites pénales**. Les entreprises mettent en place un **programme de conformité** : procédures écrites, formation, contrôles internes, conservation des documents.\n\nLa durée de **conservation des documents douaniers** est de plusieurs années (en général 3 ans, davantage dans certains cas).",
        },
        {
          type: "key",
          points: [
            "OEA : statut de confiance donné par la douane (OEAC, OEAS, OEAF).",
            "Avantages : moins de contrôles, procédures simplifiées, reconnaissance internationale.",
            "Non-conformité : redressements, amendes, saisie.",
            "La conformité repose sur des procédures, de la formation et des contrôles internes.",
          ],
        },
      ],
      quiz: [
        () => {
          const containers = int(200, 800, 50)
          const share = pick([5, 8, 10, 12])
          const checkedAfter = Math.round(containers * 0.04)
          return numQuestion({
            q: `Sans statut OEA, ${share} % de ${fmt(containers)} conteneurs sont contrôlés à l'arrivée. Combien de conteneurs sont contrôlés ?`,
            answer: (containers * share) / 100,
            unit: "conteneurs",
            digits: 0,
            explain: `${fmt(containers)} × ${share} % = ${fmt((containers * share) / 100, 0)} conteneurs.`,
            wrong: [containers - (containers * share) / 100, containers * share, containers / share, checkedAfter * share],
          })
        },
        () => {
          const days = pick([2, 3, 4])
          const stops = int(8, 40, 4)
          const cost = int(80, 200, 20)
          return numQuestion({
            q: `Chaque contrôle physique immobilise un conteneur ${days} jours, à ${cost} € par jour. Avec l'OEA, ${stops} contrôles sont évités. Quelle économie cela représente-t-il ?`,
            answer: stops * days * cost,
            unit: "€",
            digits: 0,
            explain: `${stops} × ${days} jours × ${cost} € = ${fmt(stops * days * cost, 0)} €.`,
            wrong: [stops * cost, stops * days, days * cost, stops * days * cost * 2],
          })
        },
        {
          q: "Que signifie OEA ?",
          choices: ["Opérateur économique agréé", "Organisation européenne des affaires", "Office d'enregistrement des achats", "Organisme d'évaluation agréé"],
          answer: 0,
          explain: "L'OEA est un statut accordé par la douane à des entreprises fiables et sûres.",
        },
        {
          q: "Que cherche à garantir l'agrément OEAS ?",
          choices: ["La sûreté et la sécurité de la chaîne logistique", "La baisse des prix des produits", "Le choix du meilleur transporteur", "L'absence de toute formalité"],
          answer: 0,
          explain: "L'OEAS (sûreté et sécurité) porte sur la protection des sites, du personnel et des marchandises.",
        },
        {
          q: "Quel avantage retire une entreprise OEA ?",
          choices: ["Moins de contrôles et des procédures simplifiées", "Une exonération totale de droits de douane", "Un droit de ne plus déclarer ses marchandises", "Un transport maritime gratuit"],
          answer: 0,
          explain: "L'OEA allège les contrôles et simplifie les procédures, mais les droits restent dus.",
        },
        {
          q: "Que risque une entreprise qui déclare une valeur trop basse ?",
          choices: ["Un redressement, des amendes et la saisie", "Une récompense de l'administration", "Une baisse du taux de TVA", "Une réduction des contrôles"],
          answer: 0,
          explain: "Sous-évaluer la valeur en douane est une infraction : droits éludés, amendes et parfois poursuites.",
        },
        {
          q: "Pourquoi conserver les documents douaniers plusieurs années ?",
          choices: ["Pour justifier les déclarations en cas de contrôle", "Pour les revendre aux concurrents", "Pour éviter de payer des droits", "Pour faire des économies d'archivage"],
          answer: 0,
          explain: "L'administration peut contrôler a posteriori : les documents prouvent l'exactitude des déclarations.",
        },
        {
          q: "Que comprend un programme de conformité ?",
          choices: ["Des procédures écrites, de la formation et des contrôles", "Un contrat avec un seul fournisseur", "Un stock de sécurité renforcé", "Une assurance pour le transport maritime"],
          answer: 0,
          explain: "La conformité repose sur des règles écrites appliquées, des personnes formées et des contrôles réguliers.",
        },
      ],
    },

    {
      id: "paiements-internationaux",
      title: "Payer à l'international",
      minutes: 6,
      cards: [
        {
          type: "text",
          title: "Le risque de paiement",
          body: "Quand on vend loin, deux craintes se croisent : le **vendeur** craint de ne pas être payé, l'**acheteur** craint de payer sans recevoir la marchandise. Plusieurs modes de paiement répartissent ce risque différemment.",
        },
        {
          type: "list",
          title: "Les principaux modes",
          items: [
            ["Virement après livraison", "Simple et peu coûteux ; tout le risque est pour le vendeur."],
            ["Paiement à la commande", "Le risque est pour l'acheteur."],
            ["Remise documentaire", "La banque ne remet les documents que contre paiement ou acceptation : risque encore partagé."],
            ["Crédit documentaire", "La banque de l'acheteur s'engage à payer le vendeur si les documents sont conformes."],
          ],
        },
        {
          type: "list",
          title: "Le crédit documentaire",
          items: [
            ["Principe", "Un engagement bancaire indépendant du contrat de vente."],
            ["Documents types", "Facture, liste de colisage, connaissement, certificat d'origine, assurance."],
            ["Conformité stricte", "Une simple différence entre les documents et le crédit peut bloquer le paiement."],
            ["Confirmé", "Une seconde banque (du vendeur) s'engage aussi : sécurité maximale."],
          ],
        },
        {
          type: "text",
          title: "Choisir son mode de paiement",
          body: "Le choix dépend de la **confiance** envers le client, du **risque pays**, du **montant** et du **rapport de force**. Pour une première commande avec un client inconnu dans un pays instable, le **crédit documentaire confirmé** est le plus protecteur pour le vendeur. Pour un client fidèle et solide, un **virement** à 30 ou 60 jours est plus simple et moins cher.\n\nLe crédit documentaire coûte en **commissions bancaires** (de l'ordre de 0,5 à 1,5 % du montant selon les cas).",
        },
        {
          type: "key",
          points: [
            "Chaque mode de paiement répartit le risque entre vendeur et acheteur.",
            "Crédit documentaire : engagement de la banque, sur documents conformes.",
            "Confirmé : une seconde banque s'engage aussi (sécurité maximale).",
            "Le choix dépend de la confiance, du risque pays et du coût.",
          ],
        },
      ],
      quiz: [
        () => {
          const amount = int(20, 200, 10) * 1000
          const fee = pick([0.5, 0.8, 1, 1.2, 1.5])
          return numQuestion({
            q: `Un crédit documentaire de ${fmt(amount)} € coûte ${fmt(fee)} % de commissions. Quel est le montant des frais ?`,
            answer: (amount * fee) / 100,
            unit: "€",
            digits: 0,
            explain: `${fmt(amount)} × ${fmt(fee)} % = ${fmt((amount * fee) / 100, 0)} €.`,
            wrong: [amount * fee, amount / fee, (amount * fee) / 10, (amount * fee) / 100 * 2],
          })
        },
        () => {
          const amount = int(30, 150, 10) * 1000
          const days = pick([30, 60, 90])
          const rate = pick([4, 5, 6])
          return numQuestion({
            q: `Un vendeur accorde ${days} jours de crédit sur ${fmt(amount)} €. Avec un coût de financement de ${rate} % par an (360 jours), quel est le coût de ce délai ?`,
            answer: (amount * rate * days) / 36000,
            unit: "€",
            digits: 0,
            explain: `${fmt(amount)} × ${rate} % × ${days} / 360 = ${fmt((amount * rate * days) / 36000, 0)} €.`,
            wrong: [(amount * rate) / 100, amount * days / 360, (amount * rate * days) / 3600, (amount * rate * days) / 18000],
          })
        },
        {
          q: "Que garantit un crédit documentaire au vendeur ?",
          choices: ["Le paiement par la banque si les documents sont conformes", "Un prix de vente plus élevé", "La livraison gratuite", "L'absence de toute formalité douanière"],
          answer: 0,
          explain: "La banque s'engage à payer sur présentation de documents conformes, quelle que soit la situation de l'acheteur.",
        },
        {
          q: "Que signifie un crédit documentaire « confirmé » ?",
          choices: ["Une seconde banque s'engage aussi à payer", "Le client a confirmé sa commande", "Le transporteur a confirmé la livraison", "La douane a confirmé le classement"],
          answer: 0,
          explain: "La confirmation par une banque du pays du vendeur supprime le risque de défaillance de la banque émettrice.",
        },
        {
          q: "Quel mode de paiement fait porter tout le risque au vendeur ?",
          choices: ["Le virement après livraison", "Le crédit documentaire confirmé", "Le paiement d'avance", "La lettre de crédit irrévocable"],
          answer: 0,
          explain: "Le vendeur expédie sans garantie et attend le paiement : si l'acheteur ne paie pas, il supporte la perte.",
        },
        {
          q: "Pourquoi les documents doivent-ils être parfaitement conformes au crédit documentaire ?",
          choices: ["Une différence peut bloquer le paiement", "Pour que la douane baisse ses droits", "Pour réduire les commissions bancaires", "Parce que le transport en dépend"],
          answer: 0,
          explain: "La banque ne regarde que les documents : si l'un d'eux diffère du crédit, elle peut refuser de payer.",
        },
        {
          q: "Quel est un document typique d'un crédit documentaire ?",
          choices: ["Le connaissement (B/L)", "Le bulletin de salaire", "Le plan de l'entrepôt", "Le contrat de travail"],
          answer: 0,
          explain: "Le connaissement, la facture, la liste de colisage et l'assurance font partie des documents habituels.",
        },
        {
          q: "Quand préférer un simple virement à 60 jours ?",
          choices: ["Avec un client fidèle et solide", "Avec un client inconnu en zone instable", "Quand le risque pays est très élevé", "Pour une première très grosse commande"],
          answer: 0,
          explain: "Quand la confiance est établie, un moyen simple et peu coûteux suffit ; les garanties bancaires sont pour les situations risquées.",
        },
      ],
    },
  ],
}
