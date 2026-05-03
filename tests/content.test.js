import axios from "axios";

const BASE_URL = "http://localhost:3000/api/contents";

// ===== CREATE CONTENT =====
async function createContent() {
    try {
        const res = await axios.post(BASE_URL, {
            title: "iPhone 15 Pro Review",
            short: "Review ngắn iPhone 15 Pro",
            full: "Bài review chi tiết về hiệu năng, camera, pin và trải nghiệm thực tế của iPhone 15 Pro.",
            type: "product-description"
        });

        console.log("CREATE CONTENT:", res.data);
        return res.data._id;
    } catch (err) {
        console.error("CREATE ERROR:", err.response?.data || err.message);
    }
}

// ===== GET ALL CONTENT =====
async function getAllContents() {
    try {
        const res = await axios.get(BASE_URL);
        console.log("ALL CONTENTS:", res.data);
    } catch (err) {
        console.error("GET ALL ERROR:", err.response?.data || err.message);
    }
}

// ===== GET ONE CONTENT =====
async function getContentById(id) {
    try {
        const res = await axios.get(`${BASE_URL}/${id}`);
        console.log("CONTENT DETAIL:", res.data);
    } catch (err) {
        console.error("GET ONE ERROR:", err.response?.data || err.message);
    }
}
