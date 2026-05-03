import axios from "axios";

const BASE_URL = "http://localhost:3000/api/categories";

// ===== CREATE CATEGORY =====
async function createCategory() {
    try {
        const res = await axios.post(BASE_URL, {
            name: "Smartphone",
            slug: "smartphone",
            description: "All mobile phones category"
        });

        console.log("CREATE CATEGORY:", res.data);
        return res.data._id;
    } catch (err) {
        console.error("CREATE CATEGORY ERROR:", err.response?.data || err.message);
    }
}

// ===== GET ALL CATEGORIES =====
async function getAllCategories() {
    try {
        const res = await axios.get(BASE_URL);
        console.log("ALL CATEGORIES:", res.data);
    } catch (err) {
        console.error("GET CATEGORY ERROR:", err.response?.data || err.message);
    }
}

// ===== GET ONE CATEGORY =====
async function getCategoryById(id) {
    try {
        const res = await axios.get(`${BASE_URL}/${id}`);
        console.log("CATEGORY DETAIL:", res.data);
    } catch (err) {
        console.error("GET ONE CATEGORY ERROR:", err.response?.data || err.message);
    }
}
