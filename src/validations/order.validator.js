const { body, param, query } = require('express-validator');
const { EPaymentMethod } = require('../models/order.model');

class OrderValidator {
    createOrderValidator = [
        body('userId')
            .notEmpty().withMessage('userId là bắt buộc')
            .bail()
            .isMongoId().withMessage('userId không hợp lệ'),
        body('phoneNumber')
            .notEmpty().withMessage('phoneNumber là bắt buộc')
            .trim(),
        body('items')
            .notEmpty().withMessage('items là bắt buộc')
            .isArray({ min: 1 }).withMessage('items phải là mảng có ít nhất 1 phần tử'),
        body('items.*.productId').isMongoId().withMessage('productId không hợp lệ'),
        body('items.*.sku').notEmpty().withMessage('sku là bắt buộc').trim(),
        body('items.*.quantity').isInt({ min: 1 }).withMessage('quantity phải >= 1'),
        body('totalAmount')
            .notEmpty().withMessage('totalAmount là bắt buộc')
            .isFloat({ min: 0 }).withMessage('totalAmount phải >= 0'),
        body('paymentMethod')
            .optional()
            .isIn(Object.values(EPaymentMethod)).withMessage('paymentMethod không hợp lệ'),
        body('trackingNumber')
            .notEmpty().withMessage('trackingNumber là bắt buộc').trim(),
        body('shippingAddress')
            .notEmpty().withMessage('shippingAddress là bắt buộc'),
        body('shippingAddress.street').notEmpty().withMessage('street là bắt buộc').trim(),
        body('shippingAddress.city').notEmpty().withMessage('city là bắt buộc').trim(),
        body('shippingAddress.district').notEmpty().withMessage('district là bắt buộc').trim(),
        body('shippingAddress.ward').notEmpty().withMessage('ward là bắt buộc').trim(),
        body('note').optional().trim(),
    ];

    createStripePaymentIntentValidator = [
        body('orderId')
            .notEmpty().withMessage('orderId là bắt buộc')
            .bail()
            .isMongoId().withMessage('orderId không hợp lệ'),
        body('currency')
            .optional()
            .isIn(['usd', 'vnd']).withMessage('currency chỉ nhận: usd, vnd'),
    ];

    syncStripePaymentIntentValidator = [
        body('paymentIntentId')
            .notEmpty().withMessage('paymentIntentId là bắt buộc')
            .bail()
            .matches(/^pi_[a-zA-Z0-9]+$/)
            .withMessage('paymentIntentId không hợp lệ'),
    ];

    getOrderByIdValidator = [
        param('orderId')
            .notEmpty().withMessage('orderId là bắt buộc')
            .bail()
            .isMongoId().withMessage('orderId không hợp lệ'),
    ];

    getOrdersByUserIdValidator = [
        param('userId')
            .notEmpty().withMessage('userId là bắt buộc')
            .bail()
            .isMongoId().withMessage('userId không hợp lệ'),
        query('page').optional().isInt({ min: 1 }).withMessage('page >= 1'),
        query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit từ 1 đến 100'),
    ];

    updateOrderStatusValidator = [
        param('orderId')
            .notEmpty().withMessage('orderId là bắt buộc')
            .bail()
            .isMongoId().withMessage('orderId không hợp lệ'),
        body('orderStatus')
            .notEmpty().withMessage('orderStatus là bắt buộc')
            .bail()
            .isIn(['PROCESSING', 'SHIPPING', 'DELIVERED', 'CANCELLED']).withMessage('orderStatus không hợp lệ'),
    ];

    cancelOrderValidator = [
        param('orderId')
            .notEmpty().withMessage('orderId là bắt buộc')
            .bail()
            .isMongoId().withMessage('orderId không hợp lệ'),
    ];
}

module.exports = new OrderValidator();
