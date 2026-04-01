const express = require('express');
const reviewController = require('../controllers/review.controller');
const reviewValidator = require('../validations/review.validator');
const validate = require('../middlewares/validate.middlewars');
const authMiddleware = require('../middlewares/auth.middlewars');
const router = express.Router();

router.post('/getListReviews',
    reviewValidator.getListReviews,
    validate,
    reviewController.getListReviews
);

//  các route sau đây yêu cầu xác thực người dùng (login)
router.use(authMiddleware);

router.post('/create',
    reviewValidator.createReview,
    validate,
    reviewController.createReview
);

router.put('/updateReviewById/:reviewId',
    reviewValidator.updateReviewById,
    validate,
    reviewController.updateReviewById
);

router.delete('/deleteReviewById/:reviewId',
    reviewValidator.deleteReviewById,
    validate,
    reviewController.deleteReviewById
);


module.exports = router;
