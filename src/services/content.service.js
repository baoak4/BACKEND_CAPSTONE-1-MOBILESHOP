const contentModel = require("../models/content.model");

class ContentService {
    async createContent(content, userId) {
        return contentModel.create({ ...content, user: userId });
    }

    async getListContents(filter = {}) {
        return contentModel.find(filter);
    }

    async getContentById(contentId) {
        return contentModel.findById(contentId);
    }

    async updateContentById(contentId, updateData) {
        return contentModel.findByIdAndUpdate(contentId, updateData, {
            new: true,
            runValidators: true,
        });
    }

    async deleteContentById(contentId) {
        return contentModel.findByIdAndDelete(contentId);
    }
}

module.exports = new ContentService();
