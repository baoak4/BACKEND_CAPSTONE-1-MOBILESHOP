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

// ===== UPDATE CONTENT =====
async function updateContent(id) {
    try {
        const res = await axios.put(`${BASE_URL}/${id}`, {
            title: "iPhone 15 Pro Max Review",
            short: "Review updated",
            full: "Nội dung review đã được cập nhật với thông tin mới nhất về iPhone 15 Pro Max.",
            type: "product-description"
        });

        console.log("UPDATE CONTENT:", res.data);
    } catch (err) {
        console.error("UPDATE ERROR:", err.response?.data || err.message);
    }
}

// ===== DELETE CONTENT =====
async function deleteContent(id) {
    try {
        const res = await axios.delete(`${BASE_URL}/${id}`);
        console.log("DELETE CONTENT:", res.data);
    } catch (err) {
        console.error("DELETE ERROR:", err.response?.data || err.message);
    }
}
