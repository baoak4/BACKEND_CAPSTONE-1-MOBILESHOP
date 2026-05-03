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
