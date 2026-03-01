const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        brand: { type: String, default: null, trim: true },
        price: { type: Number, required: true },
        productModel: { type: String, default: null, trim: true },
        description: { type: String, default: null },

        // Foreign keys
        categories: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
        reviews: { type: mongoose.Schema.Types.ObjectId, ref: "Review", default: null },
        variants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Variant" }],

        // Images
        images: [{ type: String, trim: true }],

        os: { type: String, default: null, trim: true },
        chipset: { type: String, default: null, trim: true },
        screen: { type: String, default: null },
        batteryMah: { type: Number, default: null },
        cameraMainMp: { type: Number, default: null },
        releaseYear: { type: Number, default: null },
        embedding: { type: [Number], default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
