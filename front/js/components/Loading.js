import { createElement } from "../functions/dom.js";

export class Loading {
    /**
     * @type {HTMLElement}
     */
    #element;
    constructor() {
        const loading = createElement("p");
        loading.style.fontSize = "1.5rem";
        loading.style.fontWeight = "bold";
        loading.innerText = "LOADING ...";
        this.#element = loading
    }
    get element () {
        return this.#element
    }
}
