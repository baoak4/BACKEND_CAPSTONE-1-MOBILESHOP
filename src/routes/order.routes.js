const express = require('express');
const orderController = require('../controllers/order.controller');
const orderValidator = require('../validations/order.validator');
const validate = require('../middlewares/validate.middlewars');
const authMiddleware = require('../middlewares/auth.middlewars');
const authorizeRoles = require('../middlewares/authorize.middleware');
const router = express.Router();

// Public route - Stripe webhook (no auth needed)
router.post('/webhook', orderController.stripeWebhook);

// router.use(authMiddleware);
// router.use(authorizeRoles('user', 'admin', 'shop'));

router.post(
    '/create',
    // orderValidator.createOrderValidator,
    validate,
    orderController.createOrder
);

router.post(
    '/createStripePaymentIntent',
    // orderValidator.createStripePaymentIntentValidator,
    validate,
    orderController.createStripePaymentIntent
);

router.get(
    '/getOrderById/:orderId',
    // orderValidator.getOrderByIdValidator,
    validate,
    orderController.getOrderById
);

router.get(
    '/getOrdersByUserId/:userId',
    // orderValidator.getOrdersByUserIdValidator,
    validate,
    orderController.getOrdersByUserId
);

router.put(
    '/cancelOrder/:orderId',
    // orderValidator.cancelOrderValidator,
    validate,
    orderController.cancelOrder
);

// router.use(authorizeRoles('admin', 'shop'));

router.put(
    '/updateOrderStatus/:orderId',
    // orderValidator.updateOrderStatusValidator,
    validate,
    orderController.updateOrderStatus
);

module.exports = router;
