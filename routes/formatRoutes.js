const express = require('express');
const formatController = require('../controllers/formatController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.route('/top').get(formatController.getTopGenres);
router.route('/audiobooks').get(formatController.getAllAudiobooks);
router.route('/ebooks').get(formatController.getAllEbooks);

module.exports = router;
