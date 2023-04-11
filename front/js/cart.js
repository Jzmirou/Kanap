import { Cart } from "./utils/Cart.js";
import { Basket } from "./components/Basket/Basket.js";

const cartContainer = document.querySelector("#cart");

const display = async () => {
    try {
        await Basket.initialize(cartContainer, new Cart());
    } catch (error) {
        console.error(error)
    }
};
display();
