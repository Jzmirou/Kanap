
import { Product } from "./components/Product.js";
import { Cart } from "./utils/Cart.js";
const item = document.querySelector('#item')
const urlParam = new URLSearchParams(window.location.search)
const productId = urlParam.get('id')

const display = async () => {
    try {
        await Product.initialize(item, productId, new Cart())
    } catch (error) {
        console.error(error)
    }
};
display();