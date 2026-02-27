const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema(
    {
        sku : {type: String, require: true, unique: true},
        stock: {type: Number, default: 0},
        price: {type: Number, require: true},
        originalPrice: {type: Number, default: null},
        color: { type: String, default: null, trim: true },
        ramGb: { type: Number, default: null },
        storageGb: { type: Number, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Variant", variantSchema);
