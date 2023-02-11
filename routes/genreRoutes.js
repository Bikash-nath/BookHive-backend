const express = require('express');
const genreController = require('../controllers/genreController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(genreController.getAllGenres);

router.route('/:id').get(genreController.getGenreBooks);

router.use(authController.protect);

module.exports = router;
