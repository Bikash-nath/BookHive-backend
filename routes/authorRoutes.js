const express = require('express');
const authorController = require('../controllers/authorController');
const reviewRouter = require('./reviewRoutes');
// const authController = require('../controllers/authController');

const router = express.Router();

router.get('/top', authorController.aliasTopAuthors, authorController.getAllAuthors);

router.route('/:slug').get(authorController.getAuthor);

// .post(authController.protect, authController.restrictTo('author'), authorController.createAuthor);

// .delete(authController.protect, authController.restrictTo('author', 'admin'), authorController.deleteAuthor);
// .patch(authController.protect, authController.restrictTo('author', 'admin'), authorController.updateAuthor)

// Nested routes
router.use('/:authorSlug/reviews', reviewRouter);

module.exports = router;
