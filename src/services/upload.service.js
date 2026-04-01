const { v2: cloudinary } = require('cloudinary')
const KEY = require('../config/key')

cloudinary.config({
    cloud_name: KEY.CLOUDINARY_CLOUD_NAME,
    api_key: KEY.CLOUDINARY_API_KEY,
    api_secret: KEY.CLOUDINARY_API_SECRET,
    secure: true,
})

class UploadService {
    async uploadBase64Image(base64DataUrl) {
        const result = await cloudinary.uploader.upload(base64DataUrl, { resource_type: "image" });
        return { url: result.secure_url, publicId: result.public_id };
    }

    async uploadBuffer(buffer, filename) {
        const ext = (filename && filename.split(".").pop()) || "png";
        const base64 = `data:image/${ext};base64,${buffer.toString('base64')}`;
        return this.uploadBase64Image(base64);
    }
}

module.exports = new UploadService();
