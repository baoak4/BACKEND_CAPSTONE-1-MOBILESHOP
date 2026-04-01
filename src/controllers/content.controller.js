const contentService = require("../services/content.service");

class ContentController {
    async createContent(req, res, next) {
        try {
            const userId = req.user.userId;
            const content = req.body;
            const result = await contentService.createContent(content, userId);
            return res.status(201).json({
                message: "Content created successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async getListContents(req, res, next) {
        try {
            const params = { ...req.query, ...(req.body || {}) };
            const result = await contentService.getListContents(params);
            return res.status(200).json({
                message: "Content retrieved successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async getContentById(req, res, next) {
        try {
            const { contentId } = req.params;
            const result = await contentService.getContentById(contentId);
            return res.status(200).json({
                message: "Content retrieved successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateContentById(req, res, next) {
        try {
            const { contentId } = req.params;
            const updateData = req.body;
            const result = await contentService.updateContentById(contentId, updateData);
            return res.status(200).json({
                message: "Content updated successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteContentById(req, res, next) {
        try {
            const { contentId } = req.params;
            await contentService.deleteContentById(contentId);
            return res.status(200).json({
                message: "Content deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ContentController();
