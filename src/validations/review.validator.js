const { body, param, query } = require('express-validator');

class ReviewValidator {
    createReview = [
        body('productId')
            .notEmpty().withMessage('productId là bắt buộc')
            .isMongoId().withMessage('productId không hợp lệ'),
        body('rating')
            .notEmpty().withMessage('rating là bắt buộc')
            .isInt({ min: 1, max: 5 }).withMessage('rating phải là số nguyên từ 1 đến 5'),
        body('comment').optional().trim().isString().withMessage('comment phải là chuỗi'),
    ];

    getListReviews = [
        body('productId').optional().isMongoId().withMessage('productId không hợp lệ'),
        body('page').optional().toInt().isInt({ min: 1 }).withMessage('page phải là số nguyên >= 1'),
        body('limit').optional().toInt().isInt({ min: 1, max: 100 }).withMessage('limit phải từ 1 đến 100'),
    ];

    updateReviewById = [
        param('reviewId')
            .notEmpty().withMessage('reviewId là bắt buộc')
            .isMongoId().withMessage('reviewId không hợp lệ'),
        body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('rating phải là số nguyên từ 1 đến 5'),
        body('comment').optional().trim().isString().withMessage('comment phải là chuỗi'),
    ];

    deleteReviewById = [
        param('reviewId')
            .notEmpty().withMessage('reviewId là bắt buộc')
            .isMongoId().withMessage('reviewId không hợp lệ'),
    ];
}

module.exports = new ReviewValidator(query, body, param);
