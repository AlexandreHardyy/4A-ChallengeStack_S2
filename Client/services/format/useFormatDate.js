// Ecris une fonction qui prend en paramètre une date au format ISO,en string et qui retourne une date formatée en français
// Exemple: 2021-09-01T00:00:00.000Z => 01/09/2021

export default function useFormatDate(date) {
    return new Date(date).toLocaleDateString('fr-FR')
}