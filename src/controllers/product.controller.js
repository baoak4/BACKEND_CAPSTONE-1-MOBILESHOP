// createProduct, getListProducts, getProductById, updateProductById, deleteProductById
const productService = require('../services/product.service');

class ProductController {
    async createProduct(req, res, next) {
        try {
            const userId = req.user.userId;
            console.log('userID', userId)
            const product = req.body;
            const result = await productService.createProduct(product, userId);
            return res.status(201).json({ message: "Created product succesfully", data: result });
        } catch (error) {
            next(error);
        }
    }

    async getListProducts(req, res, next) {
        try {
            const result = await productService.getListProducts();
            return res.status(201).json({ message: "Product retrieved successfully", data: result });
        } catch (error) {
            next(error);
        }
    }

    async getProductById(req, res, next) {
        try {
            const { productId } = req.params;
            const result = await productService.getProductById(productId);
            return res.status(201).json({ message: "Product retrieved successfully", data: result });
        } catch (error) {
            next(error);
        }
    }

    async updateProductById(req, res, next) {
        try {
            const { productId } = req.params;
            const updateData = req.body;
            const result = await productService.updateProductById(productId, updateData);
            return res.status(201).json({ message: "Update Product successfully", data: result });
        } catch (error) {
            next(error);
        }
    }

    async deleteProductById(req, res, next) {
        try {
            const { productId } = req.params;
            const result = await productService.deleteProductById(productId);
            return res.status(201).json({ message: "Delete Product successfully", data: result });
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new ProductController();
