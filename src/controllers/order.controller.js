const orderService = require('../services/order.service');
const paymentService = require('../services/payment.service');

function parseWebhookPayload(req) {
    if (Buffer.isBuffer(req.body)) {
        try {
            return JSON.parse(req.body.toString('utf8'));
        } catch {
            return null;
        }
    }
    return req.body;
}

class OrderController {
    async createOrder(req, res, next) {
        try {
            const result = await orderService.createOrder(req.body);
            return res.status(201).json({ message: 'Tạo đơn hàng thành công', data: result });
        } catch (error) {
            next(error);
        }
    }

    async createStripePaymentIntent(req, res, next) {
        try {
            const { orderId, currency } = req.body;
            const result = await paymentService.getOrReusePaymentIntent(orderId, { currency });
            return res.status(200).json({
                message: 'Tạo phiên thanh toán Stripe thành công',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async syncStripePaymentIntent(req, res, next) {
        try {
            const { paymentIntentId } = req.body;
            const auth = req.user || null;
            const order = await paymentService.syncPaidFromPaymentIntentId(paymentIntentId, auth);
            return res.status(200).json({
                message: 'Đồng bộ thanh toán thành công',
                data: order,
            });
        } catch (error) {
            next(error);
        }
    }

    async stripeWebhook(req, res, next) {
        try {
            const payload = parseWebhookPayload(req);
            if (!payload || typeof payload !== 'object') {
                return res.status(400).send('Payload webhook không hợp lệ');
            }

            const event = {
                type: payload.type,
                data: { object: payload.data?.object },
            };

            try {
                await paymentService.processWebhookEvent(event);
                if (payload.type === 'payment_intent.succeeded' && payload.data?.object?.id) {
                    console.log('Payment webhook processed:', payload.data.object.id);
                }
            } catch (e) {
                console.error('processWebhookEvent', e);
            }

            return res.status(200).json({ received: true });
        } catch (error) {
            console.error('Webhook error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    async getOrderById(req, res, next) {
        try {
            const { orderId } = req.params;
            const result = await orderService.getOrderById(orderId);
            if (!result) {
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }
            return res.status(200).json({ message: 'Lấy đơn hàng thành công', data: result });
        } catch (error) {
            next(error);
        }
    }

    async getOrdersByUserId(req, res, next) {
        try {
            const { userId } = req.params;
            const { page, limit } = req.query;
            const result = await orderService.getOrdersByUserId(userId, { page, limit });
            return res.status(200).json({
                message: 'Lấy danh sách đơn hàng thành công',
                data: result.data,
                pagination: result.pagination,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateOrderStatus(req, res, next) {
        try {
            const { orderId } = req.params;
            const { orderStatus } = req.body;
            const result = await orderService.updateOrderStatus(orderId, orderStatus);
            if (!result) {
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }
            return res.status(200).json({ message: 'Cập nhật trạng thái đơn hàng thành công', data: result });
        } catch (error) {
            next(error);
        }
    }

    async cancelOrder(req, res, next) {
        try {
            const { orderId } = req.params;
            const result = await orderService.cancelOrder(orderId);
            if (!result) {
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }
            return res.status(200).json({ message: 'Hủy đơn hàng thành công', data: result });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new OrderController();
