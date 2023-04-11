/**
 * @typedef {Objet} CartItem
 * @property {string} id
 * @property {number} quantity
 * @property {string} color
 */

export class Cart {
    /**
     * @type {Array<CartItem>}
     */
    cart;
    constructor() {
        if (localStorage.getItem("cart")) {
            const data = JSON.parse(localStorage.getItem("cart"));
            this.cart = data;
        } else {
            this.cart = [];
        }
    }
    /**
     * Ajoute un produit dans un Array Cart et l'enregistre dans le localStorage
     * @param {string} id
     * @param {string} color
     * @param {number} quantity
     */
    addCart = (id, color, quantity = 1) => {
        const addQuantity = Number(quantity);
        if (addQuantity <= 0)
            throw new Error("on ne peux pas ajouté 0 ou moins en quantité"); // Créer une error si la quantité ajouté est <= 0
        // Trouve le produit dans l'Array Cart a partir de l'id et de la couleur
        const find = this.cart.find(
            (element) => element.id === id && element.color === color
        );
        // Augmente la quantité si le produit est déjà dans le panier
        if (find) {
            const totalQuantity = find.quantity + addQuantity;
            // Renvoie un erreur si la quantité total est supérieur à 100
            this.checkMaxProduct(id, color, quantity);
            find.quantity = totalQuantity;
        } else {
            // Ajoute le produit dans la carte si il n'est pas déjà présent
            this.cart.push({
                id: id,
                quantity: addQuantity,
                color: color,
            });
        }
        this.save();
        console.log("Produit ajouté");
    };
    /**
     * Supprime un produit ou retire la quantité dans un Array Cart et l'enregistre dans le localStorage
     * @param {string} id
     * @param {string} color
     * @param {number} quantity
     */
    removeCart = (id, color, quantity) => {
        const find = this.findProduct(id, color);
        if (!find)
            throw new Error(
                "Le produit n'est pas le panier, il ne peux pas être supprimé"
            );
        const findQuantity = Number(find.quantity);
        const removeQuantity = Number(quantity) || findQuantity;
        // Si la quantité retiré est égale à la quantité du produit dans la panier il est supprimé
        if (findQuantity === removeQuantity) {
            const indexOfObjet = this.cart.findIndex(
                (element) => element.id === id && element.color === color
            );
            this.cart.splice(indexOfObjet, 1);
        } else {
            find.quantity -= removeQuantity;
        }
        this.save();
        console.log("Produit supprimé");
    };
    /**
     * Sauvegarde le panier dans le localStorage
     */
    save = () => {
        const cartData = JSON.stringify(this.cart);
        localStorage.setItem("cart", cartData);
    };

    /**
     * Trouve un produit dans le panier à partir de son id et sa couleur
     * @param {string} id
     * @param {string} color
     * @returns {CartItem}
     */
    findProduct = (id, color) => {
        return this.cart.find(
            (element) => element.id === id && element.color === color
        );
    };
    /**
     * Renvoie un tableau d'id unique des produit dans le panier
     * @returns {Array<string>}
     */
    getCartProductIds = () => {
        const productsId = new Set();
        for (const product of this.cart) {
            productsId.add(product.id);
        }
        return [...productsId];
    };
    /**
     * Vérifie si le panier est vide
     * @returns {boolean}
     */
    isCartEmpty = () => {
        return !this.cart || this.cart.length === 0;
    };

    /**
     * Vérifie si la limite d'un produit du panier est atteint
     * @param {string} id 
     * @param {string} color 
     * @param {number} quantity 
     * @throws Retourne une erreur si la quantité maximal est atteint
     * @returns 
     */
    checkMaxProduct = (id, color, quantity) => {
        const find = this.findProduct(id, color);
        if (!find) return
        const maxQuantity = 100;
        const totalQuantity = (Number(find.quantity) + quantity);
        const quantityRestant = maxQuantity - Number(find.quantity);
        if (Number(find.quantity) >= maxQuantity)
            throw new Error("La quantité maximal pour ce produit est atteint");
        if (totalQuantity > maxQuantity)
            throw new Error(
                `Quantité maximal atteint, quantité restante: ${
                    Math.abs( maxQuantity - find.quantity)
                }`
            );
    };
}
