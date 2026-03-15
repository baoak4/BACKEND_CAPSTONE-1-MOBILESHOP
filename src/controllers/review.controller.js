const reviewService = require('../services/review.service');

class ReviewController {
    async createReview(req, res, next) {
        try {
            const review = req.body;
            const userId = req.user.userId;
            const result = await reviewService.createReview(review, userId);
            return res.status(201).json({ message: "Review created successfully", data: result });
        } catch (error) {
            next(error);
        }
    }

    async getListReviews(req, res, next) {
        try {
            const result = await reviewService.getListReviews(req.body);
            return res.status(201).json({ message: "Review retrieved successfully", data: result });
        } catch (error) {
            next(error);
        }
    }

    async getReviewById(req, res, next) {
        try {
            const { reviewId } = req.params;
            const result = await reviewService.getReviewById(reviewId);
            return res.status(201).json({ message: "Review retrieved successfully", data: result });
        } catch (error) {
            next(error);
        }
    }

    async updateReviewById(req, res, next) {
        try {
            const { reviewId } = req.params;
            const updateData = req.body;
            const result = await reviewService.updateReviewById(reviewId, updateData);
            res.status(200).json({ message: "Review update successfully", data: result });
        } catch (error) {
            next(error);
        }
    }

    async deleteReviewById(req, res, next) {
        try {
            const { reviewId } = req.params;
            const result = await reviewService.deleteReviewById(reviewId);
            res.status(200).json({ message: "Review delete successfully", data: result });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ReviewController();
