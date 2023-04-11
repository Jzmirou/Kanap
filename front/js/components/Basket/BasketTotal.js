export class BasketTotal {
    /**
     * @type {HTMLElement}
     */
    element;

    /**
     * @type {Object}
     */
    Cart;

    /**
     * @type {import("../../functions/api").ProductData[]}
     */
    productsData;

    /**
     * @type {Function}
     */
    totalPrice;

    /**
     * @type {Function}
     */
    totalQuantity
    /**
     * Créer le composant BasketTotal
     * @param {import("../../functions/api").ProductData[]} productsCartData 
     * @param {Object} Cart 
     */
    constructor(productsCartData, Cart) {
        const basketTotal = document.querySelector('.cart__price')
        const totalQuantity = document.querySelector("#totalQuantity");
        const totalPrice = document.querySelector("#totalPrice");

        this.element = basketTotal
        this.Cart = Cart;
        this.productsData = productsCartData;
        this.totalPrice = totalPrice;
        this.totalQuantity = totalQuantity;

        this.updateTotal();
    }

    /**
     * Met à Jour le prix total et le nombre d'article affiché
     * @returns {undefined}
     */
    updateTotal = () => {
        this.totalPrice.textContent = this.getTotalPrice();
        this.totalQuantity.textContent = this.getTotalArticle();
    };

    /**
     * Renvoie le prix total des produits dans le panier
     * @returns {number} Prix total
     */
    getTotalPrice = () => {
        // Ne fais rien si le panier est vide
        if (this.Cart.isCartEmpty()) return;

        // Créer un nouveau tableau d'élément à partir du panier et des données obtenu 
        const itemsCart = this.Cart.cart.map((product) => {
            const find = this.productsData.find(
                (element) => element._id === product.id
            );
            return {
                id: product.id,
                color: product.color,
                quantity: Number(product.quantity),
                price: Number(find.price)
            };
        });
        let total = 0;
        for (const itemCart of itemsCart) {
            total += itemCart.price * itemCart.quantity
        }
        return total
    };
    /**
     * Retourne la quantité total d'article dans le panier
     * @returns {number}
     */
    getTotalArticle = () => {
        if (this.Cart.isCartEmpty()) return;
        let total = 0;
        for (const itemCart of this.Cart.cart) {
            total += itemCart.quantity
        }
        return total
    }
}
