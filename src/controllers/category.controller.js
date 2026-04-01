const categoryService = require('../services/category.service')

class CategoryController {
    async createCategory(req, res, next) {
        try {
            const category = req.body;
            const result = await categoryService.createCategory(category);
            return res.status(201).json({ message: "Category created successfully", data: result });
        } catch (error) {
            next(error);
        }
    }

    async getListCategories(req, res, next) {
        try {
            const result = await categoryService.getListCategories();
            return res.status(201).json({ message: "Category retrieved successfully", data: result });
        } catch (error) {
            next(error);
        }
    }

    async getCategoryById(req, res, next) {
        try {
            const { categoryId } = req.params;
            const result = await categoryService.getCategoryById(categoryId);
            return res.status(201).json({ message: "Category retrieved successfully", data: result });
        } catch (error) {
            next(error);
        }
    }

    async updateCategoryById(req, res, next) {
        try {
            const { categoryId } = req.params;
            const updateData = req.body;
            const result = await categoryService.updateCategoryById(categoryId, updateData);
            res.status(200).json({ message: "category update successfully", data: result });
        } catch (error) {
            next(error);
        }
    }

    async deleteCategoryById(req, res, next) {
        try {
            const { categoryId } = req.params;
            await categoryService.deleteCategoryById(categoryId);
            res.status(200).json({ message: "Category delete successfully" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CategoryController();
