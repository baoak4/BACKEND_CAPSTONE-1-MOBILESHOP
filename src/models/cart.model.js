const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            require: true,
            unique: true
        },

        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    require: true
                },
                sku: {
                    type: String,
                    require: true,
                    trim: true
                },
                color: {
                    type: String,
                    default: null,
                    trim: true
                },
                quantity: {
                    type: Number,
                    default: 0,
                    min: 0
                },
            },
        ],

        totalPrice: {
            type: Number,
            default: 0,
            min: 0
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
