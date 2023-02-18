const express = require('express');
const bookController = require('../controllers/bookController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();
router
  .get('/bestsellers', bookController.aliasBestsellers, bookController.getAllBooks)
  .get('/audiobooks', bookController.aliasAudiobooks, bookController.getAllBooks)
  .get('/latest', bookController.getAllBooks);

router.route('/:slug').get(bookController.getBook);

router.route('/:slug/similarBooks').get(bookController.getSimilarBooks);

router.route('/searchBooks').get(bookController.searchBooks);

// .patch(authController.protect, authController.restrictTo('author', 'admin'), bookController.updateBook)
// .delete(authController.protect, authController.restrictTo('author', 'admin'), bookController.deleteBook);

// Nested routes
router.use('/:bookSlug/reviews', reviewRouter);

router.use(authController.protect);

module.exports = router;
