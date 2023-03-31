const express = require('express');
const genreController = require('../controllers/genreController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/top').get(genreController.getTopGenres);
// router.route('/all').get(genreController.getAllGenres);

router.route('/:slug/books').get(genreController.getGenreBooks);

module.exports = router;
