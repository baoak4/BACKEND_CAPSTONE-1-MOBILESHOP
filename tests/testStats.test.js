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
