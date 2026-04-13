const express = require('express');
const orderController = require('../controllers/order.controller');
const orderValidator = require('../validations/order.validator');
const validate = require('../middlewares/validate.middlewars');
const authMiddleware = require('../middlewares/auth.middlewars');
const authorizeRoles = require('../middlewares/authorize.middleware');
const router = express.Router();

router.use(authMiddleware);

router.post(
    '/create',
    // orderValidator.createOrderValidator,
    validate,
    orderController.createOrder
);

router.post(
    '/createStripePaymentIntent',
    orderValidator.createStripePaymentIntentValidator,
    validate,
    orderController.createStripePaymentIntent
);

router.post(
    '/syncStripePaymentIntent',
    orderValidator.syncStripePaymentIntentValidator,
    validate,
    orderController.syncStripePaymentIntent
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

router.use(authorizeRoles('shop'));

router.get(
    '/getAllOrders',
    orderValidator.getAllOrdersValidator,
    validate,
    orderController.getAllOrders
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
