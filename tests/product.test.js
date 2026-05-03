import axios from "axios";

const BASE_URL = "http://localhost:3000/api/products"; // đổi theo backend của bạn

// ====== CREATE PRODUCT ======
async function createProduct() {
    try {
        const res = await axios.post(BASE_URL, {
            name: "iPhone 15 Pro",
            price: 1200,
            description: "Apple flagship phone",
            stock: 10
        });

        console.log("CREATE SUCCESS:", res.data);
        return res.data._id; // giả sử backend trả về _id
    } catch (err) {
        console.error("CREATE ERROR:", err.response?.data || err.message);
    }
}

async function getAllProducts() {
    try {
        const res = await axios.get(BASE_URL);
        console.log("GET ALL:", res.data);
    } catch (err) {
        console.error("GET ALL ERROR:", err.response?.data || err.message);
    }
}
