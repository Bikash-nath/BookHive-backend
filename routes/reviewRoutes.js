const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router
  .route('/')
  .get(reviewController.filterReviews, reviewController.getUserReviews)
  .post(authController.restrictTo('user'), reviewController.filterReviews, reviewController.createReview);

router.use(authController.restrictTo('user', 'admin'));
router.use(reviewController.filterReviews);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

router.patch('/:id/like', authController.restrictTo('user'), reviewController.likeUserReview);
// router.patch('/:id/dislike', authController.restrictTo('user'), reviewController.dislikeUserReview);

module.exports = router;
