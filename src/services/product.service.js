// createProduct, getListProducts, getProductById, updateProductById, deleteProductById
const productModel = require("../models/product.model");
const BaseService = require("./base.service");

class ProductService {
    async createProduct(product, userId) {
        return productModel.create({ ...product, user: userId });
    }

    /**
     * Lấy danh sách sản phẩm với search, filter, pagination, sort.
     * Body (tất cả optional): search, page, limit, sort_by, sort_by_price, category_type, user
     */
    async getListProducts(body = {}) {
        const filter = {};

        if (body.search && String(body.search).trim()) {
            filter.name = { $regex: String(body.search).trim(), $options: "i" };
        }

        if (body.category_type) {
            filter.categories = body.category_type;
        }

        if (body.user) {
            filter.user = body.user;
        }

        const { page, limit, skip } = BaseService.parsePagination(body);

        const sort = {};
        const sortBy = BaseService.parseSortDirection(body?.sort_by);
        const sortByPrice = BaseService.parseSortDirection(body?.sort_by_price);
        if (sortByPrice != null) sort.price = sortByPrice;
        if (sortBy != null) sort.createdAt = sortBy;
        if (Object.keys(sort).length === 0) sort.createdAt = -1;

        return BaseService.findPaginated(productModel, filter, sort, { page, limit, skip });
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
