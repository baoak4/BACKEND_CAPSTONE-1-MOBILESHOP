const orderModel = require('../models/order.model');
const { EPaymentStatus, EPaymentMethod } = orderModel;
const { getStripe, amountToStripeSmallestUnit } = require('../utils/stripe.util');
const throwError = require('../utils/throwError');

const CANCELLABLE_PI_STATUSES = new Set([
    'requires_payment_method',
    'requires_confirmation',
    'requires_action',
    'processing',
]);

class PaymentService {
    async createPaymentIntentForOrder(orderId, options = {}) {
        const stripe = getStripe();
        if (!stripe) {
            throwError('Stripe chưa cấu hình (STRIPE_PRIVATE_KEY)', 500);
        }

        const currency = (options.currency || 'vnd').toLowerCase();
        if (!['vnd', 'usd'].includes(currency)) {
            throwError('currency chỉ hỗ trợ: vnd, usd', 400);
        }

        const order = await orderModel.findById(orderId);
        if (!order) throwError('Không tìm thấy đơn hàng', 404);
        if (order.paymentStatus === EPaymentStatus.PAID) {
            throwError('Đơn hàng đã thanh toán', 400);
        }

        const amount = amountToStripeSmallestUnit(order.totalAmount, currency);
        if (amount < 1) {
            throwError('Số tiền đơn hàng không hợp lệ cho Stripe', 400);
        }

        await this._cancelStalePaymentIntentIfNeeded(stripe, order);

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: { enabled: true },
            metadata: {
                orderId: order._id.toString(),
            },
            description: `Đơn hàng ${order._id}`,
        });

        await orderModel.findByIdAndUpdate(orderId, {
            stripePaymentIntentId: paymentIntent.id,
        });

        return {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            amount,
            currency,
        };
    }

    async getOrReusePaymentIntent(orderId, options = {}) {
        const stripe = getStripe();
        if (!stripe) {
            throwError('Stripe chưa cấu hình (STRIPE_PRIVATE_KEY)', 500);
        }
        const currency = (options.currency || 'vnd').toLowerCase();
        const order = await orderModel.findById(orderId);
        if (!order) throwError('Không tìm thấy đơn hàng', 404);
        if (order.paymentStatus === EPaymentStatus.PAID) {
            throwError('Đơn hàng đã thanh toán', 400);
        }
        const expectedAmount = amountToStripeSmallestUnit(order.totalAmount, currency);
        if (!order.stripePaymentIntentId) {
            return this.createPaymentIntentForOrder(orderId, { currency });
        }
        const pi = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId);
        const metaOk = pi.metadata?.orderId === order._id.toString();
        const amountOk = pi.amount === expectedAmount && pi.currency === currency;

        if (pi.status === 'succeeded' && metaOk && amountOk) {
            const updated = await this.markOrderPaidFromPaymentIntent(pi);
            return {
                paymentIntentId: pi.id,
                amount: expectedAmount,
                currency,
                alreadySucceeded: true,
                orderPaid: !!updated && updated.paymentStatus === EPaymentStatus.PAID,
            };
        }

        if (
            metaOk &&
            amountOk &&
            (pi.status === 'requires_payment_method' || pi.status === 'requires_confirmation')
        ) {
            return {
                clientSecret: pi.client_secret,
                paymentIntentId: pi.id,
                amount: expectedAmount,
                currency,
                reused: true,
            };
        }
        await this._cancelStalePaymentIntentIfNeeded(stripe, order);
        return this.createPaymentIntentForOrder(orderId, { currency });
    }

    async _cancelStalePaymentIntentIfNeeded(stripe, order) {
        const id = order.stripePaymentIntentId;
        if (!id) return;
        try {
            const pi = await stripe.paymentIntents.retrieve(id);
            if (CANCELLABLE_PI_STATUSES.has(pi.status)) {
                try {
                    await stripe.paymentIntents.cancel(id);
                } catch (cancelErr) {
                    console.warn('[stripe] cancel PI:', id, cancelErr.message);
                }
            }
        } catch (err) {
            console.warn('[stripe] Không xử lý được PI cũ:', id, err.message);
        }
    }

    async markOrderPaidFromPaymentIntent(paymentIntent) {
        const orderId = paymentIntent.metadata?.orderId;
        if (!orderId) {
            console.warn('[stripe webhook] payment_intent thiếu metadata.orderId', paymentIntent.id);
            return null;
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
            console.warn('[stripe webhook] Không tìm thấy order', orderId);
            return null;
        }

        const currency = (paymentIntent.currency || 'vnd').toLowerCase();
        let expectedAmount;
        try {
            expectedAmount = amountToStripeSmallestUnit(order.totalAmount, currency);
        } catch {
            console.warn('[stripe webhook] totalAmount đơn không hợp lệ', orderId);
            return null;
        }

        if (paymentIntent.amount !== expectedAmount) {
            console.error('[stripe webhook] Sai số tiền PI so với đơn', {
                orderId,
                paymentIntentId: paymentIntent.id,
                expectedAmount,
                piAmount: paymentIntent.amount,
            });
            return null;
        }

        if (order.stripePaymentIntentId && order.stripePaymentIntentId !== paymentIntent.id) {
            console.warn('[stripe webhook] PI không khớp stripePaymentIntentId trên đơn', {
                orderId,
                stored: order.stripePaymentIntentId,
                event: paymentIntent.id,
            });
            return null;
        }

        if (order.paymentStatus !== EPaymentStatus.PAID) {
            order.paymentStatus = EPaymentStatus.PAID;
            order.paymentMethod = EPaymentMethod.STRIPE;
            if (!order.stripePaymentIntentId) {
                order.stripePaymentIntentId = paymentIntent.id;
            }
            await order.save();
        }
        return order;
    }

    async syncPaidFromPaymentIntentId(paymentIntentId, auth) {
        const stripe = getStripe();
        if (!stripe) {
            throwError('Stripe chưa cấu hình (STRIPE_PRIVATE_KEY)', 500);
        }
        const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (pi.status !== 'succeeded') {
            throwError('Thanh toán chưa hoàn tất hoặc đang xử lý', 400);
        }
        const order = await this.markOrderPaidFromPaymentIntent(pi);
        if (!order) {
            throwError('Không thể đồng bộ đơn với Payment Intent này', 400);
        }
        if (auth?.userId) {
            const uid = auth.userId.toString();
            const owner = order.userId.toString();
            const privileged = auth.role === 'admin' || auth.role === 'shop';
            if (owner !== uid && !privileged) {
                throwError('Không có quyền với đơn này', 403);
            }
        }
        return order;
    }

    async processWebhookEvent(event) {
        switch (event.type) {
            case 'payment_intent.succeeded':
                return this.markOrderPaidFromPaymentIntent(event.data.object);
            case 'payment_intent.payment_failed':
                console.warn('[stripe webhook] payment_failed', event.data.object?.id, event.data.object?.last_payment_error?.message);
                return null;
            default:
                return null;
        }
    }
}

module.exports = new PaymentService();
