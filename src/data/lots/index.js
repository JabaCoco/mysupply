// Registre des « lots » de contenu de l'Atelier et de l'Anglais.
// Chaque lot (un fichier lotNN.js) peut fournir :
//   formulas : [{ id, title, short, course: { purpose, formulas, terms, example, exercises, calculator? } }]
//   excel    : [défis Excel — avec generate() pour des données aléatoires]
//   cases    : [études de cas — avec generate() pour des chiffres aléatoires]
//   english  : { units: [nouvelles unités], extend: { idUnité: [leçons ajoutées] } }
// Les modules de COURS sont dans src/data/courses/ (et src/data/courses/ajouts/ pour les modules existants).
import lot01 from './lot01.js'
import lot02 from './lot02.js'
import lot03 from './lot03.js'
import lot04 from './lot04.js'
import lot05 from './lot05.js'

export const LOTS = [lot01, lot02, lot03, lot04, lot05]
