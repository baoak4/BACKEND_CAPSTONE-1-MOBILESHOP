const mongoose = require('mongoose');
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

    async getAllOrders(options = {}) {
        const page = Number(options.page) || 1;
        const limit = Number(options.limit) || 10;
        const skip = (page - 1) * limit;
        const shopUserId = options.shopUserId;

        if (!shopUserId) {
            const [data, total] = await Promise.all([
                orderModel
                    .find({})
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .populate('userId')
                    .populate('items.productId')
                    .lean(),
                orderModel.countDocuments({}),
            ]);
            return {
                data,
                pagination: { total, page, limit, totalPages: Math.ceil(total / limit) || 0 },
            };
        }

        const shopObjectId = new mongoose.Types.ObjectId(shopUserId);
        const basePipeline = [
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: '_product',
                },
            },
            { $addFields: { product: { $arrayElemAt: ['$_product', 0] } } },
            { $match: { 'product.user': shopObjectId } },
            {
                $group: {
                    _id: '$_id',
                    createdAt: { $first: '$createdAt' },
                },
            },
        ];

        const [orderRows, totalRows] = await Promise.all([
            orderModel.aggregate([
                ...basePipeline,
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limit },
            ]),
            orderModel.aggregate([
                ...basePipeline,
                { $count: 'total' },
            ]),
        ]);

        const orderIds = orderRows.map((row) => row._id);
        const total = totalRows[0]?.total || 0;

        let data = [];
        if (orderIds.length > 0) {
            const orders = await orderModel
                .find({ _id: { $in: orderIds } })
                .populate('userId')
                .populate('items.productId')
                .lean();

            const orderMap = new Map(orders.map((order) => [String(order._id), order]));
            data = orderIds.map((id) => orderMap.get(String(id))).filter(Boolean);
        }

        return {
            data,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit) || 0 },
        };
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
