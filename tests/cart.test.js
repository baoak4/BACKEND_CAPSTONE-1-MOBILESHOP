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

// ===== GET CART BY USER =====
async function getCartByUser(userId) {
    try {
        const res = await axios.get(`${BASE_URL}/${userId}`);
        console.log("CART DETAIL:", res.data);
    } catch (err) {
        console.error("GET CART ERROR:", err.response?.data || err.message);
    }
}

// ===== UPDATE CART ITEM =====
async function updateCartItem(cartItemId) {
    try {
        const res = await axios.put(`${BASE_URL}/${cartItemId}`, {
            quantity: 3
        });

        console.log("UPDATE CART:", res.data);
    } catch (err) {
        console.error("UPDATE ERROR:", err.response?.data || err.message);
    }
}

// ===== REMOVE ITEM FROM CART =====
async function removeFromCart(cartItemId) {
    try {
        const res = await axios.delete(`${BASE_URL}/${cartItemId}`);
        console.log("REMOVE ITEM:", res.data);
    } catch (err) {
        console.error("REMOVE ERROR:", err.response?.data || err.message);
    }
}

// ===== CLEAR CART =====
async function clearCart(userId) {
    try {
        const res = await axios.delete(`${BASE_URL}/clear/${userId}`);
        console.log("CLEAR CART:", res.data);
    } catch (err) {
        console.error("CLEAR ERROR:", err.response?.data || err.message);
    }
}
