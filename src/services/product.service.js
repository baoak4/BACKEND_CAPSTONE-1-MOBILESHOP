// createProduct, getListProducts, getProductById, updateProductById, deleteProductById
const productModel = require("../models/product.model");

class ProductService {
    async createProduct(product, userId) {
        return productModel.create({ ...product, user: userId });
    }

    async getListProducts() {
        return productModel.find();
    }

    async getProductById(productId) {
        return productModel.findById(productId);
    }

    async updateProductById(productId, updateData) {
        return productModel.findByIdAndUpdate(productId, updateData);
    }

    async deleteProductById(productId) {
        return productModel.findByIdAndDelete(productId);
    }

}

module.exports = new ProductService();
