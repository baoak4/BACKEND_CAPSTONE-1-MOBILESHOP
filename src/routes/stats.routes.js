const express = require('express');
const statsController = require('../controllers/stats.controller');
const authMiddleware = require('../middlewares/auth.middlewars');
const authorizeRoles = require('../middlewares/authorize.middleware');

const router = express.Router();

router.get(
    '/admin/dashboard',
    authMiddleware,
    authorizeRoles('admin'),
    statsController.adminDashboard
);

router.get(
    '/shop/dashboard',
    authMiddleware,
    authorizeRoles('shop'),
    statsController.shopDashboard
);

module.exports = router;
