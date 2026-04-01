const categoryModel = require("../models/category.model");

class CategoryService {
    async createCategory(category) {
        return categoryModel.create(category);
    }

    async getListCategories() {
        return categoryModel.find({});
    }

    async getCategoryById(categoryId) {
        return categoryModel.findById(categoryId);
    }

    async updateCategoryById(categoryId, updateData) {
        return categoryModel.findByIdAndUpdate(categoryId, updateData, {
            new: true,
            runValidators: true
        }
        )
    };

    async deleteCategoryById(categoryId) {
        return categoryModel.findByIdAndDelete(categoryId)
    }
}
module.exports = new CategoryService();

// getListCategories, getCategoryById, updateCategoryById, deleteCategoryById
