const orderService = require('../services/order.service');

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
            const { orderId, amount, currency } = req.body;
            const result = await orderService.createStripePaymentIntent(orderId, amount, currency);
            return res.status(200).json({
                message: 'Tạo phiên thanh toán Stripe thành công',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async stripeWebhook(req, res, next) {
        try {
            const sig = req.headers['stripe-signature'];
            const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

            // For testing without STRIPE_WEBHOOK_SECRET, accept webhook
            if (!webhookSecret) {
                console.log('⚠️ STRIPE_WEBHOOK_SECRET not set - accepting webhook anyway for testing');
                const paymentIntent = req.body.data?.object;
                if (paymentIntent && req.body.type === 'payment_intent.succeeded') {
                    try {
                        await orderService.handleStripeWebhook(paymentIntent.id);
                        console.log('✅ Payment webhook processed:', paymentIntent.id);
                    } catch (e) {
                        console.error('❌ handleStripeWebhook error', e);
                    }
                }
                return res.status(200).json({ received: true });
            }

            // Production mode - verify signature
            if (!sig) {
                return res.status(400).send('Thiếu stripe-signature');
            }

            let event;
            try {
                const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
                event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
            } catch (err) {
                return res.status(400).send(`Webhook Error: ${err.message}`);
            }

            if (event.type === 'payment_intent.succeeded') {
                const paymentIntent = event.data.object;
                try {
                    await orderService.handleStripeWebhook(paymentIntent.id);
                    console.log('✅ Payment webhook processed:', paymentIntent.id);
                } catch (e) {
                    console.error('❌ handleStripeWebhook error', e);
                }
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
