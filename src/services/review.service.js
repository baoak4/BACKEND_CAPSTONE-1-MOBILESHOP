const reviewModel = require('../models/review.model');
const BaseService = require('./base.service');

const SORT_DATE = {
    newest: { createdAt: -1 },
    old: { createAt: 1 },
};

class ReviewService {
    async createReview(review, userId) {
        return reviewModel.create({ ...review, userId });
    }

    //  productId, hiển thị user
    async getListReviews(body = {}) {
        const { page, limit, skip } = BaseService.parsePagination(body);
        const productId = body.productId;
        const filter = { productId };
        if (body.rating != null && body.rating >= 1 && body.rating <= 5) {
            filter.rating = body.rating;
        }
        const sortByDate = body.sortByDate === 'old' ? 'old' : 'newest';
        const sort = SORT_DATE[sortByDate];
        const [data, total] = await Promise.all([
            reviewModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate('userId', 'name avatar')
                .lean(),
            reviewModel.countDocuments(filter),
        ]);

        return {
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit) || 0,
            },
        };
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
