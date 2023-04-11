import { fetchAllProduct } from "../functions/api.js";
import { createElement } from "../functions/dom.js";
import { Loading } from "./Loading.js";

export class HomeProducts {
    /**
     * @type {HTMLElement}
     */
    #element;
    
    /**
     * @type {import("../functions/api.js").ProductData}
     */
    #products

    /**
     * @param {HTMLElement} element 
     * @param {import("../functions/api.js").ProductData[]} products 
     */
    constructor(element, products) {
        this.#element = element   
        this.#products = products
        for (const product of this.#products) {
            const card = new CardProduct(product);
            this.#element.append(card.element);
        }
    }

    /**
     * @param {HTMLElement} element 
     * @returns {Promise<Object>}
     */
    static initialize = async (element) => {
        /**
             * @type {HTMLElement}
             */
        const loading = new Loading().element
        element.append(loading)
        try {
            const products = await fetchAllProduct();
            loading.remove()
            return new HomeProducts(element, products);

        } catch (error) {
            loading.remove()
            console.error(error);
            const p = createElement('p')
            p.style.fontSize = '20px'
            p.innerText = 'Nous sommes désolé nous rencontrons des problèmes avec le serveur'
            element.append(p)
        }
    };
}

class CardProduct {
    /**
     * @type {HTMLElement}
     */
    #element;
    constructor(product) {
        const a = createElement("a", {
            href: `./product.html?id=${product._id}`,
        });
        const article = createElement("article");
        const img = createElement("img", {
            src: `${product.imageUrl}`,
            alt: `${product.altTxt}`,
        });
        const h3 = createElement("h3", {
            class: "productName",
        });
        h3.innerText = product.name;
        const p = createElement("p", {
            class: "productDescription",
        });
        p.innerText = product.description;
        a.append(article);
        article.append(img);
        article.append(h3);
        article.append(p);
        this.#element = a;
    }

    get element() {
        return this.#element;
    }
}
