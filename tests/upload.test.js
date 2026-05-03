import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const BASE_URL = "http://localhost:3000/api/upload";

// ===== UPLOAD IMAGE =====
async function uploadImage() {
    try {
        const form = new FormData();

        form.append("file", fs.createReadStream("./test-image.jpg"));

        const res = await axios.post(BASE_URL, form, {
            headers: {
                ...form.getHeaders()
            }
        });

        console.log("UPLOAD SUCCESS:", res.data);
        return res.data.url;
    } catch (err) {
        console.error("UPLOAD ERROR:", err.response?.data || err.message);
    }
}

// ===== UPLOAD MULTIPLE IMAGES =====
async function uploadMultiple() {
    try {
        const form = new FormData();

        form.append("files", fs.createReadStream("./img1.jpg"));
        form.append("files", fs.createReadStream("./img2.jpg"));

        const res = await axios.post(`${BASE_URL}/multiple`, form, {
            headers: {
                ...form.getHeaders()
            }
        });

        console.log("UPLOAD MULTIPLE:", res.data);
    } catch (err) {
        console.error("UPLOAD MULTI ERROR:", err.response?.data || err.message);
    }
}
