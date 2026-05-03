import axios from "axios";

const BASE_URL = "http://localhost:3000/api/stats";
async function getDashboardStats() {
    try {
        const res = await axios.get(`${BASE_URL}/dashboard`);

        console.log("DASHBOARD STATS:", res.data);
    } catch (err) {
        console.error("STATS ERROR:", err.response?.data || err.message);
    }
}

// ===== GET SALES BY DATE =====
async function getSalesByDate() {
    try {
        const res = await axios.get(`${BASE_URL}/sales?range=7d`);

        console.log("SALES BY DATE:", res.data);
    } catch (err) {
        console.error("SALES ERROR:", err.response?.data || err.message);
    }
}

async function getTopProducts() {
    try {
        const res = await axios.get(`${BASE_URL}/top-products`);

        console.log("TOP PRODUCTS:", res.data);
    } catch (err) {
        console.error("TOP PRODUCTS ERROR:", err.response?.data || err.message);
    }
}
