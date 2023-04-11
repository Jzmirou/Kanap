import { fetchOrder } from "../../functions/api.js";
import {
    isAlphaNumeric,
    isEmail,
    isEmpty,
} from "../../functions/validation.js";

export class BasketForm {
    /**
     * @type {Object<HTMLInputElement>}
     */
    inputs;
    /**
     * @type {Object}
     */
    Cart;
    constructor(Cart) {
        const inputFirstName = document.querySelector("#firstName");
        const inputLastName = document.querySelector("#lastName");
        const inputAddress = document.querySelector("#address");
        const inputCity = document.querySelector("#city");
        const inputEmail = document.querySelector("#email");
        const inputSubmit = document.querySelector("#order");
        this.inputs = {
            firstName: inputFirstName,
            lastName: inputLastName,
            address: inputAddress,
            city: inputCity,
            email: inputEmail,
        };
        this.Cart = Cart;

        inputSubmit.addEventListener("click", this.handleSubmit);

        for (const [key, input] of Object.entries(this.inputs)) {
            input.addEventListener("input", (event) => {
                this.validation(input);
            });
        }
    }
    /**
     * Vérifie si la valeur d'un input est valide et affiche un message d'error dans le cas contraire
     * @param {HTMLInputElement} element 
     * @returns {Array<boolean , Object, undefined}
     */
    validation = (element) => {
        const errorElement = document.querySelector(`#${element.id}ErrorMsg`);
        let isValid
        try {
            if (isEmpty(element.value)) throw new Error('Champ non renseigné')
            switch (element.id) {
                case this.inputs.email.id:
                    if (!isEmail(element.value)) throw new Error('Email entré non valide')
                    break;
                default:
                    if (!isAlphaNumeric(element.value)) throw new Error('Caractères spéciaux non accepté')
            }
            element.style.border = 'none'
            errorElement.textContent = ''
            return [isValid = true, undefined]
        } catch (error) {
            console.warn(error);
            element.style.border = '2px solid red'
            errorElement.textContent = error.message;
            return [isValid = false, error]
        }
    };
    /**
     * Vérifie si les valeur des inputs sont correct et renvoie les information de l'utilisateur si c'est le cas
     * @returns {Array<boolean, Object>}
     */
    checkAllInput = () => {
        let contactData = {}
        let errors = []
        for (const [key, input] of Object.entries(this.inputs)) {
            const [valid, err] = this.validation(input);
            valid ? contactData = { ...contactData, [key]: input.value } : errors.push(err);
        }
        const isValid = errors.length === 0
        return [isValid, contactData]
    }
    /**
     * Envoie les information de l'utilisateur si les données sont valide
     * @param {SubmitEvent} event 
     */
    handleSubmit = (event) => {
        event.preventDefault();
        const [isValid, contactData] = this.checkAllInput()
        if(!isValid) return
        const products = this.Cart.cart.map((element) => {
            return element.id;
        });
            fetchOrder(contactData, products)
                .then((order) => {
                    localStorage.clear()
                    document.location.href =`confirmation.html?id=${order.orderId}`;
                })
                .catch((error) => console.error(error));
    };
}
