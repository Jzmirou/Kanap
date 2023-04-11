import { fetchMultipleProduct } from "../../functions/api.js";
import { Loading } from "../Loading.js";
import { BasketForm } from "./BasketForm.js";
import { BasketItem } from "./BasketItem.js";
import { BasketTotal } from "./BasketTotal.js";

/**
 * @typedef {Object} DataItem
 * @property {string} id
 * @property {string} imgUrl
 * @property {string} imgAltText
 * @property {string} name
 * @property {string} color
 * @property {number} price
 * @property {number} quantity
 */
export class Basket {
    /**
     * @type {HTMLElement}
     */
    element;
    /**
     * @type {Object}
     */
    Cart;
    constructor(productsCartData, Cart) {
        // Initialise le composant BasketTotal
        const basketTotal = new BasketTotal(productsCartData, Cart);
        // initialise le composant BasketForm
        const basketForm = new BasketForm(Cart);

        const basket = document.querySelector("#cart");
        const sectionCartItem = document.querySelector("#cart__items");
        // Créer un composant CartItem pour chaque produit dans le panier
        for (const cartItemInfo of Cart.cart) {
          // Récupère les data du produit
            const cartItemData = productsCartData.find(
                (element) => element._id === cartItemInfo.id
            );
            if(!cartItemData) throw new Error('Les information du panier sont invalide')
            /**
             * @type {DataItem}
             */
            const dataItem = {
              id: cartItemInfo.id,
              imgUrl: cartItemData.imageUrl,
              imgAltText: cartItemData.altTxt,
              name: cartItemData.name,
              color: cartItemInfo.color,
              price: cartItemData.price,
              quantity: cartItemInfo.quantity
            };
            const basketItem = new BasketItem(
                dataItem,
                Cart,
                this.displayIfCartEmpty,
                basketTotal.updateTotal
            );
            sectionCartItem.append(basketItem.element);
        }
        this.element = basket;
        this.Cart = Cart;
        this.displayIfCartEmpty();
    }
    /**
     * Récupère les données et créer un nouvel object de lui même avec les données récupéré
     * @param {HTMLElement} element
     * @param {Object} Cart
     * @returns {Promise<Object>}
     */
    static initialize = async (element, Cart) => {
        try {
            /**
             * @type {HTMLElement}
             */
            const loading = new Loading().element;
            element.append(loading);
            const productsCartData = await fetchMultipleProduct(
                Cart.getCartProductIds()
            );
            loading.remove();
            return new Basket(productsCartData, Cart);
        } catch (error) {
            console.warn(error);
        }
    };
    /**
     * Affiche un message si il n'y a aucun produit dans le panier
     */
    displayIfCartEmpty = () => {
        if (this.Cart.isCartEmpty()) {
            this.element.innerHTML = `
        <p style="text-align: center;font-size: 1.25rem">Aucun produit dans le panier</p>
        `;
        }
    };
}
