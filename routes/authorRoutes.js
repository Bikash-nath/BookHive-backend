const express = require('express');
const authorController = require('../controllers/authorController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router
  .route('/')
  .get(authorController.getAllauthors)
  .post(authController.protect, authController.restrictTo('author'), authorController.createAuthor);

router
  .route('/:id')
  .get(authorController.getAuthor)
  .patch(authController.protect, authController.restrictTo('author', 'admin'), authorController.updateAuthor)
  .delete(authController.protect, authController.restrictTo('author', 'admin'), authorController.deleteAuthor);

// Nested routes
router.use('/:authorId/reviews', reviewRouter);

router.use(authController.protect);

module.exports = router;
