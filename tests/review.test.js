import axios from "axios";

const BASE_URL = "http://localhost:3000/api/reviews";

// ===== CREATE REVIEW =====
async function createReview(productId) {
    try {
        const res = await axios.post(BASE_URL, {
            userId: "user_001",
            productId: productId,

            rating: 5, // 1 - 5 stars

            comment: "Sản phẩm rất tốt, chất lượng đúng như mô tả.",

            images: [
                "https://example.com/image1.jpg",
                "https://example.com/image2.jpg"
            ]
        });

        console.log("CREATE REVIEW:", res.data);
        return res.data._id;
    } catch (err) {
        console.error("CREATE ERROR:", err.response?.data || err.message);
    }
}

// ===== GET ALL REVIEWS =====
async function getAllReviews() {
    try {
        const res = await axios.get(BASE_URL);
        console.log("ALL REVIEWS:", res.data);
    } catch (err) {
        console.error("GET ALL ERROR:", err.response?.data || err.message);
    }
}
