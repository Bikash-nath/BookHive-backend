const express = require('express')
const userLibraryController = require('../controllers/userLibraryController')
const authController = require('../controllers/authController')

const router = express.Router()

router.get('/', authController.protect, userLibraryController.getUserLibrary)
router.post('/', authController.protect, userLibraryController.createUserLibrary)
router.get('/books', authController.protect, userLibraryController.getLibraryBooks)
router.get('/authors', authController.protect, userLibraryController.getLibraryAuthors)
router.get('/genres', authController.protect, userLibraryController.getLibraryGenres)
router.get('/readHistory', authController.protect, userLibraryController.getReadHistory)

router.patch('/favourite/book', authController.protect, userLibraryController.favouriteBook)
router.patch('/follow/author', authController.protect, userLibraryController.followAuthor)
router.patch('/favourite/genre', authController.protect, userLibraryController.favouriteGenre)
router.patch('/addReadHistory', authController.protect, userLibraryController.addReadHistory)
router.patch('/removeReadHistory', authController.protect, userLibraryController.removeReadHistory)

module.exports = router
