const api_url = "http://localhost:3000/api"

/**
 * @typedef {Object} ProductData
 * @property {string[]} color
 * @property {string} id
 * @property {string} color
 * @property {string} name
 * @property {number} price
 * @property {string} image_url
 * @property {string} description
 * @property {string} image_alt_text
 */

/**
 * @typedef {Object} Contact
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} address
 * @property {number} city
 * @property {string} email
 */

/**
 * Permet de récupérer des données en JSON sur une API 
 * @param {string} url 
 * @param {Object} options 
 * @return {Promise<Object>}
 */
const fetchJSON = async (url, options = {}) => {
    const response = await fetch(`${api_url}${url}`, {
        ...options,
        headers: {
            Accept: "application/json",
            ...options.headers,
        },
    });
    if (!response.ok) {
        throw new Error(
            `Pas de réponse du serveur ! status: ${response.status}`,
            { cause: response }
        );
    }
    const data = await response.json();
    return data;
};


/**
 * Permet de récupérer les données de tous les produits
 * @returns {Promise<ProductData[]>}
 */
export const fetchAllProduct = async () => {
    const response = await fetchJSON(`/products`, {
        method: 'GET'
    });
    return response
}


/**
 * Permet de récupérer les données d'un produit en particulier
 * @param {string} id 
 * @returns {Promise<ProductData>}
 */
export const fetchProduct = async (id) => {
    const response = await fetchJSON(`/products/${id}`, {
        method: 'GET'
    });
    return response
}


/**
 * Permet de récupérer les données de plusieurs produits en particulier
 * @param {Array<string>} ids 
 * @returns {Promise<ProductData[]>}
 */
export const fetchMultipleProduct = async (ids) => {
    const request = []
    for (const id of ids) {
        request.push(fetchProduct(id))
    }
    const response = await Promise.all(request)
    return response
}

/**
 * Permet d'envoyer la confirmation de commande à l'API
 * @param {Contact} contact 
 * @param {Array<string>} products 
 * @returns {Promise<{contact : Contact, products : ProductData, orderId: string}>}
 */
export const fetchOrder = async (contact, products) => {
    const body = JSON.stringify({
        contact: contact,
        products : products
    })
    const response = await fetchJSON(`/products/order`, {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: body
    })
    return response
}