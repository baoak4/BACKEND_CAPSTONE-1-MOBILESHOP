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

// ===== GET REVIEWS BY PRODUCT =====
async function getReviewsByProduct(productId) {
    try {
        const res = await axios.get(`${BASE_URL}?productId=${productId}`);
        console.log("REVIEWS BY PRODUCT:", res.data);
    } catch (err) {
        console.error("GET BY PRODUCT ERROR:", err.response?.data || err.message);
    }
}

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

// ===== GET REVIEWS BY PRODUCT =====
async function getReviewsByProduct(productId) {
    try {
        const res = await axios.get(`${BASE_URL}?productId=${productId}`);
        console.log("REVIEWS BY PRODUCT:", res.data);
    } catch (err) {
        console.error("GET BY PRODUCT ERROR:", err.response?.data || err.message);
    }
}

// ===== UPDATE REVIEW =====
async function updateReview(id) {
    try {
        const res = await axios.put(`${BASE_URL}/${id}`, {
            rating: 4,
            comment: "Sau khi dùng thêm vài ngày thì sản phẩm vẫn ổn."
        });

        console.log("UPDATE REVIEW:", res.data);
    } catch (err) {
        console.error("UPDATE ERROR:", err.response?.data || err.message);
    }
}

// ===== DELETE REVIEW =====
async function deleteReview(id) {
    try {
        const res = await axios.delete(`${BASE_URL}/${id}`);
        console.log("DELETE REVIEW:", res.data);
    } catch (err) {
        console.error("DELETE ERROR:", err.response?.data || err.message);
    }
}

// ===== RUN FLOW =====
async function run() {
    const productId = "product_001";

    const reviewId = await createReview(productId);

    await getAllReviews();

    await getReviewsByProduct(productId);

    if (reviewId) {
        await updateReview(reviewId);
        await deleteReview(reviewId);
    }
}

run();
