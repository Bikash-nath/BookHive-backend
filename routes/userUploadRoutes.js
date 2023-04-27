const express = require('express')
const userUploadController = require('../controllers/userUploadController')
const authController = require('../controllers/authController')

const router = express.Router()

router.use(authController.protect)
router.use(authController.restrictTo('author', 'admin'))

router.route('/').get(userUploadController.getUserUploads).post(userUploadController.createUserUpload)

// .patch(authController.protect, authController.restrictTo('author', 'admin'), bookController.updateBook)
// .delete(authController.protect, authController.restrictTo('author', 'admin'), bookController.deleteBook);

module.exports = router
