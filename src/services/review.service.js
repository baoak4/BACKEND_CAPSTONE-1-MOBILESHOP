const reviewModel = require('../models/review.model');

class ReviewService {
    async createReview(review, userId) {
        return reviewModel.create({ ...review, userId });
    }

    async getListReviews(body = {}) {
        return reviewModel.find(body);
    }

    async getReviewById(reviewId) {
        return reviewModel.findById(reviewId);
    }

    async updateReviewById(reviewId, updateData) {
        return reviewModel.findByIdAndUpdate(reviewId, updateData, {
            new: true,
            runValidators: true
        });
    }

    async deleteReviewById(reviewId) {
        return reviewModel.findByIdAndDelete(reviewId);
    }
}

module.exports = new ReviewService();
