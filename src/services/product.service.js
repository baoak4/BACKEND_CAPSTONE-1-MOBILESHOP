// createProduct, getListProducts, getProductById, updateProductById, deleteProductById
const productModel = require("../models/product.model");
const BaseService = require("./base.service");

class ProductService {
    async createProduct(product, userId) {
        return productModel.create({ ...product, user: userId });
    }

    /** Danh sách sản phẩm (search, filter, pagination, sort) + reviews lookup theo productId. */
    async getListProducts(body = {}) {
        const filter = {};
        if (body.search != null && String(body.search).trim()) filter.name = { $regex: String(body.search).trim(), $options: "i" };
        if (body.category_type) filter.categories = body.category_type;
        if (body.user) filter.user = body.user;

        const { page, limit, skip } = BaseService.parsePagination(body);
        const sort = {};
        const sortByPrice = BaseService.parseSortDirection(body?.sort_by_price);
        const sortBy = BaseService.parseSortDirection(body?.sort_by);
        if (sortByPrice != null) sort.price = sortByPrice;
        if (sortBy != null) sort.createdAt = sortBy;
        if (Object.keys(sort).length === 0) sort.createdAt = -1;

        return BaseService.findPaginated(productModel, filter, sort, { page, limit, skip }, {
            lookup: { from: "reviews", localField: "_id", foreignField: "productId", as: "reviews" },
        });
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
