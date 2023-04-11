import { Cart } from "../utils/Cart.js";
import { createElement } from "../functions/dom.js";
import { fetchProduct } from "../functions/api.js";
import { Loading } from "./Loading.js";
import { CustomError } from "../functions/customError.js";

export class Product {
    /**
     * @type {HTMLElement}
     */
    #element;
    /**
     * @param {HTMLElement} element
     * @param {import("../functions/api.js").ProductData} products
     */
    constructor(element, productData, cart) {
        const article = createElement("article");
        const divImg = createElement("div", {
            class: "item__img",
        });
        const img = createElement("img", {
            src: productData.imageUrl,
            alt: productData.altTxt,
        });
        const divContent = createElement("div", {
            class: "item__content",
        });
        const divTitlePrice = createElement("div", {
            class: "item__content__titlePrice",
        });
        const titleH1 = createElement("h1", {
            id: "title",
        });
        titleH1.innerText = productData.name;

        const priceText = createElement("p", {
            id: "price",
        });
        priceText.innerText = `Prix : ${productData.price} €`;

        const divDescription = createElement("div", {
            class: "item__content__description",
        });
        const descriptionTitle = createElement("p", {
            class: "item__content__description__title",
        });
        descriptionTitle.innerText = "Description :";

        const description = createElement("p", {
            id: "description",
        });
        description.innerText = productData.description;

        const settings = new ProductSettings(productData);
        const addCartButton = new AddCartButton(
            productData._id,
            settings.itemQuantity,
            settings.itemColor,
            cart
        );

        this.#element = element;

        this.#element.append(article);
        article.append(divImg);
        divImg.append(img);
        article.append(divContent);
        divContent.append(divTitlePrice);
        divContent.append(divDescription);
        divContent.append(settings.element);
        divContent.append(addCartButton.element);
        divTitlePrice.append(titleH1);
        divTitlePrice.append(priceText);
        divDescription.append(descriptionTitle);
        divDescription.append(description);
    }
    /**
     * @param {HTMLElement} element
     * @param {string} idProduct
     * @returns {Promise<Object>}
     */
    static initialize = async (element, idProduct, cart) => {
        try {
            /**
             * @type {HTMLElement}
             */
            const loading = new Loading().element;
            element.append(loading);

            const product = await fetchProduct(idProduct);
            loading.remove();
            return new Product(element, product, cart);
        } catch (error) {
            console.error(error);
        }
    };
}
class ProductSettings {
    /**
     * @type {HTMLElement}
     */
    #element;
    /**
     * @type {HTMLElement}
     */
    itemQuantity;
    /**
     * @type {HTMLElement}
     */
    itemColor;
    /**
     * @param {import("../functions/api.js").ProductData} product
     */
    constructor(product) {
        const divSettings = createElement("div", {
            class: "item__content__settings",
        });
        const divSettingsColor = createElement("div", {
            class: "item__content__settings__color",
        });
        const labelColor = createElement("label", {
            for: "color-select",
        });
        labelColor.innerText = "Choisir une couleur :";
        const selectColor = createElement("select", {
            name: "color-select",
            id: "colors",
        });
        const optionDefault = createElement("option", {
            value: "",
        });
        optionDefault.innerText = "--SVP, choisissez une couleur --";

        const divSettingQuantity = createElement("div", {
            class: "item__content__settings__quantity",
        });
        const labelQuantity = createElement("label", {
            for: "itemQuantity",
        });
        labelQuantity.innerText = "Nombre d'article(s) (1-100) :";
        const inputQuantity = createElement("input", {
            type: "number",
            name: "itemQuantity",
            min: "1",
            max: "100",
            value: "0",
            id: "quantity",
        });
        divSettings.append(divSettingsColor);
        divSettings.append(divSettingQuantity);
        divSettingsColor.append(labelColor);
        divSettingsColor.append(selectColor);
        divSettingQuantity.append(labelQuantity);
        divSettingQuantity.append(inputQuantity);
        selectColor.append(optionDefault);
        for (const color of product.colors) {
            const optionElement = createElement("option", {
                value: `${color}`,
            });
            optionElement.innerText = color;
            selectColor.append(optionElement);
        }
        this.#element = divSettings;
        this.itemQuantity = inputQuantity;
        this.itemColor = selectColor;
    }
    get element() {
        return this.#element;
    }
}

class AddCartButton {
    /**
     * @type {HTMLElement}
     */
    #element;

    /**
     * @type {string}
     */
    productId;

    /**
     * @type {Object<HTMLInputElement>}
     */
    inputs;

    /**
     * @type {Object}
     */
    Cart;
    /**
     * @param {string} productId
     * @param {HTMLElement} itemQuantity
     * @param {HTMLElement} itemQColor
     * @param {Object} Cart
     */
    constructor(productId, itemQuantity, itemColor, Cart) {
        const divAddButton = createElement("div", {
            class: "item__content__addButton",
        });
        const button = createElement("button", {
            id: "addToCart",
        });
        button.innerText = "Ajouter au panier";
        button.addEventListener("click", this.handleClick);

        divAddButton.append(button);

        this.#element = divAddButton;
        this.productId = productId;
        this.inputs = { itemQuantity: itemQuantity, itemColor: itemColor };
        this.Cart = Cart;
        for (const [key, input] of Object.entries(this.inputs)) {
            input.addEventListener("input", (event) => {
                try {
                    this.validation(input);
                } catch (error) {}
            });
        }
    }
    get element() {
        return this.#element;
    }
    /**
     * Check les erreurs et ajoute un produit au panier
     * @returns {void}
     */
    handleClick = () => {
        const color = this.inputs.itemColor.value;
        const quantity = Number(this.inputs.itemQuantity.value);
        const id = this.productId;
        const [isValid, error] = this.checkValidation([
            this.itemColor,
            this.itemQuantity,
        ]);
        const pError =
            document.querySelector("#errorMessageProduct") ||
            createElement("p", {
                id: "errorMessageProduct",
                style: "font-size: 1.5rem; font-weight: 'bold'; text-align: center;",
            });
        if (!isValid) {
            pError.innerText = error.message;
            this.element.insertAdjacentElement("afterend", pError);
            return;
        }
        pError.innerText = "Produit ajouté au panier";
        this.Cart.addCart(id, color, quantity);
        this.element.insertAdjacentElement("afterend", pError);
        setTimeout(() => (pError.innerText = ""), 1500);
    };
    /**
     * Permet de verifier si les valeurs de plusieurs champ de texte sont valides
     * @param {Array<HTMLElement>} inputs
     * @returns {Array<boolean , Object, undefined>}
     */
    checkValidation = (inputs) => {
        let isValid;
        const color = this.inputs.itemColor.value;
        const quantity = Number(this.inputs.itemQuantity.value);
        const id = this.productId;
        try {
            let error = false;
            for (const [key, input] of Object.entries(this.inputs)) {
                const [valid, err] = this.validation(input);
                if (!valid && !error) error = err;
            }
            if (error) throw new Error(error);
            this.Cart.checkMaxProduct(id, color, quantity);
            return [(isValid = true), undefined];
        } catch (error) {
            return [(isValid = false), error];
        }
    };

    /**
     * Permet de verifier si la valeur du champ de texte est valide
     * @param {HTMLElement} input
     * @returns {Array<boolean, undefined, Object>}
     */
    validation = (input) => {
        const value = input.value;
        let isValid;
        try {
            switch (input.id) {
                case "colors":
                    if (!value || value.trim() === "")
                        throw new CustomError("Veuillez choisir une couleur");
                    break;
                case "quantity":
                    if (!Number(value) || Number(value) === 0)
                        throw new CustomError("Veuillez choisir une quantité");
                    else if (Number(value) < 0)
                        throw new CustomError("Quantité négative non autorisé");
            }
            input.style.border = "none";
            return [(isValid = true), undefined];
        } catch (error) {
            input.style.border = "2px solid red";
            return [(isValid = false), error];
        }
    };
}
