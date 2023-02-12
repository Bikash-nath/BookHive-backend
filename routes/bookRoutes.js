const express = require('express');
const bookController = require('../controllers/bookController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router
  .route('/')
  .get(bookController.getAllBooks)
  .post(authController.protect, authController.restrictTo('author'), bookController.createBook);

router
  .route('/:slug')
  .get(bookController.getBook)
  .patch(authController.protect, authController.restrictTo('author', 'admin'), bookController.updateBook)
  .delete(authController.protect, authController.restrictTo('author', 'admin'), bookController.deleteBook);

router.route('/:slug/similarBooks').get(bookController.getSimilarBooks);

// Nested routes
router.use('/:bookSlug/reviews', reviewRouter);

router.use(authController.protect);

module.exports = router;
