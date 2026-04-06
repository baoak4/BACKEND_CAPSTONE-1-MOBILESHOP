const orderModel = require('../models/order.model');
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
