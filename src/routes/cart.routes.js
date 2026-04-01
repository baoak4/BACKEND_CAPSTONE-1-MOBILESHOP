const express = require('express');
const cartController = require('../controllers/cart.controller');
const authMiddleware = require('../middlewares/auth.middlewars');
const authorizeRoles = require('../middlewares/authorize.middleware');

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRoles('user', 'admin', 'shop'));

router.get('/me', cartController.getMyCart);
router.post('/add-items', cartController.addItemToCart); // thêm sản phẩm vô cart
router.delete('/items', cartController.removeItemFromCart); //xóa sản phẩm khỏi cart
router.put('/items', cartController.updateItemQuantity);// cập nhật số lượng
router.delete('/clear-cart', cartController.deleteCart);

module.exports = router;
