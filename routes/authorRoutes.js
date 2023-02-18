const express = require('express');
const authorController = require('../controllers/authorController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.get('/top', authController.aliasTopAuthors, authController.getAllAuthors);

// .post(authController.protect, authController.restrictTo('author'), authorController.createAuthor);

router.route('/:slug').get(authorController.getAuthor);

// .delete(authController.protect, authController.restrictTo('author', 'admin'), authorController.deleteAuthor);
// .patch(authController.protect, authController.restrictTo('author', 'admin'), authorController.updateAuthor)

// Nested routes
router.use('/:authorSlug/reviews', reviewRouter);

router.use(authController.protect);

module.exports = router;
