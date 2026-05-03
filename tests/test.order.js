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
