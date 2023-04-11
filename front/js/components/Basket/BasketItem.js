import { createElement } from "../../functions/dom.js";
export class BasketItem {
    /**
     * @type {HTMLElement}
     */
    element;
    /**
     * @type {import("./Basket.js").DataItem}
     */
    dataItem;
    /**
     * @type {HTMLElement}
     */
    itemQuantity;
    /**
     * @type {Object}
     */
    Cart;
    /**
     * @type {Function}
     */
    displayIfCartEmpty;
    /**
     * @type {Function}
     */
    updateTotal;
    /**
     * Créer un élément du panier
     * @param {import("./Basket.js").DataItem} dataItem 
     * @param {Object} Cart 
     * @param {Function} displayIfCartEmpty 
     * @param {Function} updateTotal 
     */
    constructor(dataItem, Cart, displayIfCartEmpty, updateTotal) {
        const article = createElement("article", {
            class: "cart__item",
        });
        const divImg = createElement("div", {
            class: "cart__item__img",
        });
        const img = createElement("img", {
            src: `${dataItem.imgUrl}`,
            alt: `${dataItem.altTxt}`,
        });
        const divContent = createElement("div", {
            class: "cart__item__content",
        });
        const divDescription = createElement("div", {
            class: "cart__item__content__description",
        });
        const descriptionTitle = createElement("h2");
        descriptionTitle.innerText = dataItem.name;
        const descriptionColor = createElement("p");
        descriptionColor.innerText = dataItem.color;
        const descriptionPrice = createElement("p");
        descriptionPrice.innerText = dataItem.price + " €";

        const itemSettings = new ItemSettings(
            dataItem,
            Cart,
            this.deleteItem,
            updateTotal
        );
        article.append(divImg);
        article.append(divContent);
        divImg.append(img);
        divContent.append(divDescription);
        divContent.append(itemSettings.element);
        divDescription.append(descriptionTitle);
        divDescription.append(descriptionColor);
        divDescription.append(descriptionPrice);

        this.element = article;
        this.itemQuantity = itemSettings.itemQuantity;
        this.dataItem = dataItem;
        this.Cart = Cart;
        this.displayIfCartEmpty = displayIfCartEmpty;
        this.updateTotal = updateTotal;
    }

    /**
     * Supprime l'élément
     */
    deleteItem = () => {
        this.Cart.removeCart(
            this.dataItem.id,
            this.dataItem.color,
            Number(this.itemQuantity.value)
        );
        this.updateTotal();
        this.displayIfCartEmpty();
        this.element.remove();
    };
}

class ItemSettings {
    /**
     * @type {HTMLElement}
     */
    element;
    /**
     * @type {import("./Basket.js").DataItem}
     */
    dataItem;
    /**
     * @type {Object}
     */
    Cart;
    /**
     * @type {HTMLElement}
     */
    itemQuantity;
    /**
     * @type {Function}
     */
    updateTotal;
    /**
     * @type {Function}
     */
    deleteItem;

    /**
     * Créer le composant setting qui indique le le nom, le prix et la quantité du produit
     * @param {import("./Basket.js").DataItem} dataItem 
     * @param {Object} Cart 
     * @param {Function} deleteItem 
     * @param {Function} updateTotal 
     */
    constructor(dataItem, Cart, deleteItem ,updateTotal) {
        const divSettings = createElement("div", {
            class: "cart__item__content__settings",
        });
        const divSettingsQuantity = createElement("div", {
            class: "cart__item__content__settings__quantity",
        });
        const pQuantity = createElement("p");
        pQuantity.innerText = "Qté : ";

        const inputQuantity = createElement("input", {
            type: "number",
            class: "itemQuantity",
            name: "itemQuantity",
            min: "1",
            max: "100",
            value: dataItem.quantity,
        });
        const divSettingsDelete = createElement("div", {
            class: "cart__item__content__settings__delete",
        });
        const pDeleteItem = createElement("p", {
            class: "deleteItem",
        });
        pDeleteItem.innerText = "Supprimer";

        divSettings.append(divSettingsQuantity);
        divSettings.append(divSettingsDelete);
        divSettingsQuantity.append(pQuantity);
        divSettingsQuantity.append(inputQuantity);
        divSettingsDelete.append(pDeleteItem);

        this.element = divSettings;
        this.dataItem = dataItem;
        this.Cart = Cart;
        this.itemQuantity = inputQuantity;
        this.updateTotal = updateTotal;
        this.deleteItem = deleteItem;

        pDeleteItem.addEventListener("click", this.deleteItem);
        inputQuantity.addEventListener("change", this.handleChangeQuantity);
    }
    /**
     * Change la quantité du produit dans le panier 
     * @param {Event} event 
     * @returns {undefined}
     */
    handleChangeQuantity = (event) => {
        let value = Number(event.target.value);
        const defaultValue = Number(event.target.defaultValue);
        // Change la value a 0 si la valeur est inférieur a 0 
        if (value < 0) {
            event.target.value = 0;
            value = 0;
        }
        // Supprime le produit du panier si la quantité est de 0
        if (value === 0) {
            this.deleteItem();
            return;
        }
        // Modifie la quantité si elle est supérieur à 100
        if (value > 100) {
            event.target.value = 100
            value = 100
        }
        // Augmente la quantité du produit si la value est supérieur à la value d'origine
        if (value > defaultValue) {
            console.log("add one", `before:${defaultValue} after:${value} `);
            this.Cart.addCart(
                this.dataItem.id,
                this.dataItem.color,
                value - defaultValue
            );
        } else if( value < defaultValue){ // Baisse la quantité du produit si la value  inférieur à la value d'origine 
            console.log("del one", `before:${defaultValue} after:${value} `);
            this.Cart.removeCart(
                this.dataItem.id,
                this.dataItem.color,
                defaultValue - value
            );
        }
        // Change la valeur d'origine
        event.target.defaultValue = value;
        // Met à jour le prix total
        this.updateTotal();
    };
}
