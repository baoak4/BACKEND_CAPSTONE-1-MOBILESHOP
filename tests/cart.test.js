import axios from "axios";

const BASE_URL = "http://localhost:3000/api/cart";

// ===== ADD TO CART =====
async function addToCart(productId) {
    try {
        const res = await axios.post(BASE_URL, {
            userId: "user_001",

            productId: productId,

            quantity: 1
        });

        console.log("ADD TO CART:", res.data);
        return res.data._id;
    } catch (err) {
        console.error("ADD ERROR:", err.response?.data || err.message);
    }
}
