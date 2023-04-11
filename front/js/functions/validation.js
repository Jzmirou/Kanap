/**
 * Permet de vérifié si une chaîne de caractère est vide
 * @param {string}
 * @returns {boolean}
 */
export const isEmpty = (string) => {
    if(!string || string === '') {
        return true
    } else {
        return false
    }
}
/**
 * Permet de vérifier si une chaîne de caractère est un email
 * @param {string} email 
 * @returns {boolean}
 */
export const isEmail = (email) => {
    return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
}
/**
 * Permet de vérifier si une chaîne de caractère est au format Alpha Numérique
 * @param {string} string 
 * @returns {boolean}
 */
export const isAlphaNumeric = (string) => {
    return /^[a-zA-Z0-9]*$/.test(string)
}