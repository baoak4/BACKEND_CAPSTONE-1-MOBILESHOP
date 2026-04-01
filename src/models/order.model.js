const mongoose = require("mongoose");
const { Schema } = mongoose;

const EOrderStatus = {
    PROCESSING: "PROCESSING",
    SHIPPING: "SHIPPING",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
};

const EPaymentStatus = {
    PAID: "PAID",
    UNPAID: "UNPAID",
};

const EPaymentMethod = {
    CASH: "CASH",
    BANK_TRANSFER: "BANK_TRANSFER",
    STRIPE: "STRIPE",
};

const EOrderReviewed = {
    NOT_REVIEWED: "NOT_REVIEWED",
    REVIEWED: "REVIEWED",
};

const orderSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        phoneNumber: {
            type: String,
            required: true,
            trim: true,
        },

        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                sku: { type: String, required: true, trim: true },
                quantity: { type: Number, required: true, min: 1 },
            },
        ],

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        paymentStatus: {
            type: String,
            enum: Object.values(EPaymentStatus),
            default: EPaymentStatus.UNPAID,
        },

        paymentMethod: {
            type: String,
            enum: Object.values(EPaymentMethod),
            default: EPaymentMethod.CASH,
        },

        stripePaymentIntentId: {
            type: String,
            default: null,
            trim: true,
        },

        shippingAddress: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            district: { type: String, required: true },
            ward: { type: String, required: true },
        },

        orderStatus: {
            type: String,
            enum: Object.values(EOrderStatus),
            default: EOrderStatus.PROCESSING,
        },

        reviewed: {
            type: String,
            enum: Object.values(EOrderReviewed),
            default: EOrderReviewed.NOT_REVIEWED,
        },

        trackingNumber: {
            type: String,
            required: true,
            trim: true,
        },

        note: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
module.exports.EOrderStatus = EOrderStatus;
module.exports.EPaymentStatus = EPaymentStatus;
module.exports.EPaymentMethod = EPaymentMethod;
module.exports.EOrderReviewed = EOrderReviewed;
