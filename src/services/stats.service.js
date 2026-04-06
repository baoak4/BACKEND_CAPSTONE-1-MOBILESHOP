const mongoose = require('mongoose');
const Order = require('../models/order.model');
const { EOrderStatus } = Order;

function startOfUtcDay(date = new Date()) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addUtcDays(d, n) {
    const x = new Date(d);
    x.setUTCDate(x.getUTCDate() + n);
    return x;
}

function startOfUtcMonth(date = new Date()) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function startOfNextUtcMonth(date = new Date()) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
}

const notCancelled = { orderStatus: { $ne: EOrderStatus.CANCELLED } };

class StatsService {
    /**
     * Tổng tiền + số đơn (theo totalAmount trên đơn — toàn hệ thống).
     */
    async _orderMoneyTotals(matchExtra = {}) {
        const base = { ...notCancelled, ...matchExtra };
        const [allTime, todayRow, monthRow] = await Promise.all([
            Order.aggregate([
                { $match: base },
                { $group: { _id: null, totalAmount: { $sum: '$totalAmount' }, orderCount: { $sum: 1 } } },
            ]),
            Order.aggregate([
                {
                    $match: {
                        ...base,
                        createdAt: { $gte: startOfUtcDay(), $lt: addUtcDays(startOfUtcDay(), 1) },
                    },
                },
                { $group: { _id: null, totalAmount: { $sum: '$totalAmount' }, orderCount: { $sum: 1 } } },
            ]),
            Order.aggregate([
                {
                    $match: {
                        ...base,
                        createdAt: { $gte: startOfUtcMonth(), $lt: startOfNextUtcMonth() },
                    },
                },
                { $group: { _id: null, totalAmount: { $sum: '$totalAmount' }, orderCount: { $sum: 1 } } },
            ]),
        ]);
        const pick = (row) => row[0] || { totalAmount: 0, orderCount: 0 };
        return {
            allTime: pick(allTime),
            today: pick(todayRow),
            thisMonth: pick(monthRow),
        };
    }

    _lineStagesShopFilter(shopUserId) {
        if (!shopUserId) return [];
        const id = new mongoose.Types.ObjectId(shopUserId);
        return [{ $match: { 'product.user': id } }];
    }

    /**
     * Đơn đã unwind items + lookup product + lineTotal (quantity * giá variant hoặc giá sản phẩm).
     */
    _pipelineLineRows(shopUserId) {
        return [
            { $match: notCancelled },
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
            { $match: { product: { $ne: null } } },
            ...this._lineStagesShopFilter(shopUserId),
            {
                $addFields: {
                    unitPrice: {
                        $let: {
                            vars: {
                                matchedVar: {
                                    $first: {
                                        $filter: {
                                            input: { $ifNull: ['$product.variants', []] },
                                            as: 'v',
                                            cond: { $eq: ['$$v.sku', '$items.sku'] },
                                        },
                                    },
                                },
                            },
                            in: { $ifNull: ['$$matchedVar.price', '$product.price'] },
                        },
                    },
                },
            },
            {
                $addFields: {
                    lineTotal: {
                        $multiply: [
                            '$items.quantity',
                            { $cond: [{ $gt: ['$unitPrice', 0] }, '$unitPrice', 0] },
                        ],
                    },
                    quantitySold: '$items.quantity',
                },
            },
        ];
    }

    async _topProducts(shopUserId, { from, to }, limit = 10) {
        const rows = await Order.aggregate([
            ...this._pipelineLineRows(shopUserId),
            { $match: { createdAt: { $gte: from, $lt: to } } },
            {
                $group: {
                    _id: { productId: '$items.productId', sku: '$items.sku' },
                    quantitySold: { $sum: '$quantitySold' },
                    revenue: { $sum: '$lineTotal' },
                    name: { $first: '$product.name' },
                },
            },
            { $sort: { quantitySold: -1 } },
            { $limit: limit },
            {
                $project: {
                    _id: 0,
                    productId: '$_id.productId',
                    sku: '$_id.sku',
                    name: 1,
                    quantitySold: 1,
                    revenue: { $round: ['$revenue', 0] },
                },
            },
        ]);
        return rows;
    }

    /**
     * Người mua nhiều: theo tổng chi và số đơn (admin: toàn đơn; shop: chỉ phần đơn có hàng của shop).
     */
    async _topBuyers(shopUserId, { from, to }, limit = 10) {
        if (!shopUserId) {
            const rows = await Order.aggregate([
                { $match: { ...notCancelled, createdAt: { $gte: from, $lt: to } } },
                {
                    $group: {
                        _id: '$userId',
                        orderCount: { $sum: 1 },
                        totalSpent: { $sum: '$totalAmount' },
                    },
                },
                { $sort: { totalSpent: -1 } },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'u',
                    },
                },
                { $addFields: { user: { $arrayElemAt: ['$u', 0] } } },
                {
                    $project: {
                        _id: 0,
                        userId: '$_id',
                        name: '$user.name',
                        email: '$user.email',
                        orderCount: 1,
                        totalSpent: { $round: ['$totalSpent', 0] },
                    },
                },
            ]);
            return rows;
        }

        const rows = await Order.aggregate([
            ...this._pipelineLineRows(shopUserId),
            { $match: { createdAt: { $gte: from, $lt: to } } },
            {
                $group: {
                    _id: { orderId: '$_id', userId: '$userId' },
                    shopPartTotal: { $sum: '$lineTotal' },
                },
            },
            {
                $group: {
                    _id: '$_id.userId',
                    orderCount: { $sum: 1 },
                    totalSpent: { $sum: '$shopPartTotal' },
                },
            },
            { $sort: { totalSpent: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'u',
                },
            },
            { $addFields: { user: { $arrayElemAt: ['$u', 0] } } },
            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    name: '$user.name',
                    email: '$user.email',
                    orderCount: 1,
                    totalSpent: { $round: ['$totalSpent', 0] },
                },
            },
        ]);
        return rows;
    }

    async _shopLineRevenueTotals(shopUserId) {
        const id = new mongoose.Types.ObjectId(shopUserId);
        const day0 = startOfUtcDay();
        const day1 = addUtcDays(day0, 1);
        const m0 = startOfUtcMonth();
        const m1 = startOfNextUtcMonth();

        const [allTime, todayRow, monthRow] = await Promise.all([
            Order.aggregate([
                ...this._pipelineLineRows(id),
                { $group: { _id: null, totalAmount: { $sum: '$lineTotal' }, lineCount: { $sum: 1 } } },
            ]),
            Order.aggregate([
                ...this._pipelineLineRows(id),
                { $match: { createdAt: { $gte: day0, $lt: day1 } } },
                { $group: { _id: null, totalAmount: { $sum: '$lineTotal' }, lineCount: { $sum: 1 } } },
            ]),
            Order.aggregate([
                ...this._pipelineLineRows(id),
                { $match: { createdAt: { $gte: m0, $lt: m1 } } },
                { $group: { _id: null, totalAmount: { $sum: '$lineTotal' }, lineCount: { $sum: 1 } } },
            ]),
        ]);
        const pick = (row) => row[0] || { totalAmount: 0, lineCount: 0 };
        const [orderCountToday, orderCountMonth] = await Promise.all([
            this._countShopOrdersInRange(id, day0, day1),
            this._countShopOrdersInRange(id, m0, m1),
        ]);

        return {
            allTime: { ...pick(allTime), orderCount: await this._countShopOrdersAllTime(id) },
            today: { ...pick(todayRow), orderCount: orderCountToday },
            thisMonth: { ...pick(monthRow), orderCount: orderCountMonth },
        };
    }

    async _countShopOrdersAllTime(shopObjectId) {
        const [r] = await Order.aggregate([
            { $match: notCancelled },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: '_p',
                },
            },
            { $addFields: { product: { $arrayElemAt: ['$_p', 0] } } },
            { $match: { 'product.user': shopObjectId } },
            { $group: { _id: '$_id' } },
            { $count: 'c' },
        ]);
        return r?.c || 0;
    }

    async _countShopOrdersInRange(shopObjectId, from, to) {
        const [r] = await Order.aggregate([
            {
                $match: {
                    ...notCancelled,
                    createdAt: { $gte: from, $lt: to },
                },
            },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: '_p',
                },
            },
            { $addFields: { product: { $arrayElemAt: ['$_p', 0] } } },
            { $match: { 'product.user': shopObjectId } },
            { $group: { _id: '$_id' } },
            { $count: 'c' },
        ]);
        return r?.c || 0;
    }

    async getAdminDashboard() {
        const now = new Date();
        const day0 = startOfUtcDay(now);
        const day1 = addUtcDays(day0, 1);
        const m0 = startOfUtcMonth(now);
        const m1 = startOfNextUtcMonth(now);

        const [orderTotals, topProductsToday, topProductsMonth, topBuyersAll, topBuyersMonth] =
            await Promise.all([
                this._orderMoneyTotals(),
                this._topProducts(null, { from: day0, to: day1 }),
                this._topProducts(null, { from: m0, to: m1 }),
                this._topBuyers(null, { from: new Date(0), to: addUtcDays(now, 1) }),
                this._topBuyers(null, { from: m0, to: m1 }),
            ]);

        return {
            scope: 'admin',
            summary: {
                totalMoney: orderTotals,
                note: 'totalMoney: tổng totalAmount đơn (trừ CANCELLED). Top SP: theo quantity; revenue dòng = giá variant/sản phẩm × SL.',
            },
            topSellingProducts: {
                today: topProductsToday,
                thisMonth: topProductsMonth,
            },
            topBuyers: {
                allTime: topBuyersAll,
                thisMonth: topBuyersMonth,
            },
        };
    }

    async getShopDashboard(shopUserId) {
        const now = new Date();
        const day0 = startOfUtcDay(now);
        const day1 = addUtcDays(day0, 1);
        const m0 = startOfUtcMonth(now);
        const m1 = startOfNextUtcMonth(now);

        const [lineTotals, topProductsToday, topProductsMonth, topBuyersAll, topBuyersMonth] =
            await Promise.all([
                this._shopLineRevenueTotals(shopUserId),
                this._topProducts(shopUserId, { from: day0, to: day1 }),
                this._topProducts(shopUserId, { from: m0, to: m1 }),
                this._topBuyers(shopUserId, { from: new Date(0), to: addUtcDays(now, 1) }),
                this._topBuyers(shopUserId, { from: m0, to: m1 }),
            ]);

        return {
            scope: 'shop',
            summary: {
                totalMoney: {
                    allTime: {
                        totalAmount: lineTotals.allTime.totalAmount,
                        orderCount: lineTotals.allTime.orderCount,
                    },
                    today: {
                        totalAmount: lineTotals.today.totalAmount,
                        orderCount: lineTotals.today.orderCount,
                    },
                    thisMonth: {
                        totalAmount: lineTotals.thisMonth.totalAmount,
                        orderCount: lineTotals.thisMonth.orderCount,
                    },
                },
                note: 'Shop: totalAmount = tổng (đơn giá variant/sản phẩm × SL) chỉ dòng thuộc sản phẩm của shop; orderCount = số đơn có ít nhất một dòng của shop.',
            },
            topSellingProducts: {
                today: topProductsToday,
                thisMonth: topProductsMonth,
            },
            topBuyers: {
                allTime: topBuyersAll,
                thisMonth: topBuyersMonth,
            },
        };
    }
}

module.exports = new StatsService();
