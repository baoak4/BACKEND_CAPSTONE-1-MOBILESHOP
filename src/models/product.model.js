const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        brand: { type: String, default: null, trim: true },
        price: { type: Number, required: true },
        productModel: { type: String, default: null, trim: true },
        description: { type: String, default: null },

        // Foreign keys
        categories: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
        reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

        // Images
        images: [{ type: String, trim: true }],

        // Variants (embedded)
        variants: [
            {
                sku: { type: String, required: true },
                stock: { type: Number, default: 0 },
                price: { type: Number, required: true },
                originalPrice: { type: Number, default: null },
                color: { type: String, default: null, trim: true },
                ramGb: { type: Number, default: null },
                storageGb: { type: Number, default: null },
            }
        ],

        // Specs
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
