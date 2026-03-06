// createProduct, getListProducts, getProductById, updateProductById, deleteProductById

const express = require('express');
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/auth.middlewars');
const authorizeRoles = require('../middlewares/authorize.middleware');
const router = express.Router();

router.post('/create', authMiddleware, productController.createProduct);

router.get('/getListProducts', productController.getListProducts);

router.get('/getProductById/:productId', productController.getProductById);

router.put('/updateProductById/:productId', productController.updateProductById);

router.delete('/deleteProductById/:productId', productController.deleteProductById);

module.exports = router;
