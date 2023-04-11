/**
 * Permet de créer des élément HTML avec des attributs plus facilement
 * 
 * @param {string} tagName
 * @param {Object} attributes
 * @return {HTMLElement}
 */
export const createElement = (tagName, attributes = {}) => {
    const element = document.createElement(tagName)
    for (const [attribute, value] of Object.entries(attributes)) {
        element.setAttribute(attribute, value)
    }
    return element
}