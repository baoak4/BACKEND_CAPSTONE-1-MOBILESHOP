const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const orderModel = require('../models/order.model');
const throwError = require('../utils/throwError');
const { EOrderStatus, EPaymentStatus } = orderModel;

function generateTrackingNumber() {
    return 'TRK-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

class OrderService {
    async createOrder(data) {
        const payload = {
            ...data,
            trackingNumber: data.trackingNumber || generateTrackingNumber(),
            paymentStatus: EPaymentStatus.UNPAID,
        };
        return orderModel.create(payload);
    }

    async createStripePaymentIntent(orderId, amount, currency = 'vnd') {
        if (!process.env.STRIPE_PRIVATE_KEY) {
            throwError('Stripe không được cấu hình (STRIPE_PRIVATE_KEY)');
        }
        const order = await orderModel.findById(orderId).lean();
        if (!order) throwError('Không tìm thấy đơn hàng');
        if (order.paymentStatus === EPaymentStatus.PAID) {
            throwError('Đơn hàng đã thanh toán');
        }
        const amountInSmallestUnit = currency === 'usd' ? Math.round(Number(amount) * 100) : Math.round(Number(amount));
        if (amountInSmallestUnit < 1) throwError('Số tiền không hợp lệ');

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInSmallestUnit,
            currency: currency.toLowerCase(),
            automatic_payment_methods: { enabled: true },
            metadata: { orderId: orderId.toString() },
        });

        await orderModel.findByIdAndUpdate(orderId, {
            stripePaymentIntentId: paymentIntent.id,
        });

        return {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        };
    }

    async handleStripeWebhook(paymentIntentId) {
        const order = await orderModel.findOne({ stripePaymentIntentId: paymentIntentId });
        if (!order) return null;
        if (order.paymentStatus === EPaymentStatus.PAID) return order;
        order.paymentStatus = EPaymentStatus.PAID;
        await order.save();
        return order;
    }

    async getOrderById(orderId) {
        return orderModel.findById(orderId).populate('userId').populate('items.productId').lean();
    }

    async getOrdersByUserId(userId, options = {}) {
        const { page = 1, limit = 10 } = options;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            orderModel.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('items.productId').lean(),
            orderModel.countDocuments({ userId }),
        ]);
        return {
            data,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit) || 0 },
        };
    }

    async updateOrderStatus(orderId, orderStatus) {
        return orderModel.findByIdAndUpdate(
            orderId,
            { orderStatus },
            { new: true, runValidators: true }
        ).lean();
    }

    async cancelOrder(orderId) {
        return orderModel.findByIdAndUpdate(
            orderId,
            { orderStatus: EOrderStatus.CANCELLED },
            { new: true }
        ).lean();
    }
}

module.exports = new OrderService();
