const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        productId: {
            type: Schema.Type.ObjectId,
            ref: "Product",
            require: true,
        },

        userId: {
            type: Schema.Type.ObjectId,
            ref: "User",
            require: true,
        },

        rating: {
            type: Number,
            require: true,
            min: 1,
            max: 5,
        },

        comment: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
