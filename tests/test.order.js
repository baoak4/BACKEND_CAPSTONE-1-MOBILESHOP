import axios from "axios";

const BASE_URL = "http://localhost:3000/api/orders";

// ===== CREATE ORDER =====
async function createOrder(productId) {
    try {
        const res = await axios.post(BASE_URL, {
            userId: "user_001",

            products: [
                {
                    productId: productId,
                    quantity: 2,
                    price: 1200
                }
            ],

            shippingAddress: {
                fullName: "Nguyen Van A",
                phone: "0123456789",
                address: "Hanoi, Vietnam"
            },

            paymentMethod: "COD", // COD | CARD | BANK

            status: "pending"
        });

        console.log("CREATE ORDER:", res.data);
        return res.data._id;
    } catch (err) {
        console.error("CREATE ORDER ERROR:", err.response?.data || err.message);
    }
}

// ===== GET ALL ORDERS =====
async function getAllOrders() {
    try {
        const res = await axios.get(BASE_URL);
        console.log("ALL ORDERS:", res.data);
    } catch (err) {
        console.error("GET ALL ERROR:", err.response?.data || err.message);
    }
}

// ===== GET ONE ORDER =====
async function getOrderById(id) {
    try {
        const res = await axios.get(`${BASE_URL}/${id}`);
        console.log("ORDER DETAIL:", res.data);
    } catch (err) {
        console.error("GET ONE ERROR:", err.response?.data || err.message);
    }
}

// ===== UPDATE ORDER STATUS =====
async function updateOrder(id) {
    try {
        const res = await axios.put(`${BASE_URL}/${id}`, {
            status: "shipped"
        });

        console.log("UPDATE ORDER:", res.data);
    } catch (err) {
        console.error("UPDATE ERROR:", err.response?.data || err.message);
    }
}

// ===== DELETE ORDER =====
async function deleteOrder(id) {
    try {
        const res = await axios.delete(`${BASE_URL}/${id}`);
        console.log("DELETE ORDER:", res.data);
    } catch (err) {
        console.error("DELETE ERROR:", err.response?.data || err.message);
    }
}
