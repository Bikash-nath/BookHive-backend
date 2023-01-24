const express = require('express');
const bookController = require('../controllers/bookController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router
  .route('/')
  .get(bookController.getAllBooks)
  .post(authController.protect, authController.restrictTo('owner'), bookController.createBook);

router
  .route('/:id')
  .get(bookController.getBook)
  .patch(authController.protect, authController.restrictTo('owner', 'guides', 'admin'), bookController.updateBook)
  .delete(authController.protect, authController.restrictTo('owner', 'admin'), bookController.deleteBook);

// Nested routes
router.use('/:bookId/reviews', reviewRouter);

router.use(authController.protect);

module.exports = router;
