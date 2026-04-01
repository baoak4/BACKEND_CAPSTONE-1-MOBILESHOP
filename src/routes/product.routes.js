// createProduct, getListProducts, getProductById, updateProductById, deleteProductById

const express = require('express');
const productController = require('../controllers/product.controller');
const productValidator = require('../validations/product.validator');
const validate = require('../middlewares/validate.middlewars');
const authMiddleware = require('../middlewares/auth.middlewars');
const router = express.Router();

router.post(
    '/create',
    authMiddleware,
    productValidator.createProductValidator,
    validate,
    productController.createProduct
);

router.post(
    '/getListProducts',
    productValidator.getListProductsValidator,
    validate,
    productController.getListProducts
);

router.get(
    '/getProductById/:productId',
    productValidator.getProductByIdValidator,
    validate,
    productController.getProductById
);

router.put(
    '/updateProductById/:productId',
    productValidator.updateProductByIdValidator,
    validate,
    productController.updateProductById
);

router.delete(
    '/deleteProductById/:productId',
    productValidator.deleteProductByIdValidator,
    validate,
    productController.deleteProductById
);

module.exports = router;
