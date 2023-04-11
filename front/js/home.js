import { HomeProducts } from "./components/HomeProducts.js";

const element = document.querySelector("#items");

const display = async () => {
    try {
        const basket = await HomeProducts.initialize(element)
    } catch (error) {
        console.error(error)
    }
};
display();
