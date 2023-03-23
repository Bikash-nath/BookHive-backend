const express = require('express');
const userProfileController = require('../controllers/userProfileController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
// router.post('/forgotPassword', authController.forgotPassword);
// router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.get('/getMe', authController.protect, userProfileController.getMe);
router.patch('/updateMe', authController.protect, userProfileController.updateMe);
router.patch('/updateEmail', authController.protect, authController.updateEmail);
router.patch('/updatePassword', authController.protect, authController.updatePassword);
router.delete('/deleteMe', authController.protect, userProfileController.deleteMe);

router.route('/:id').get(userProfileController.getUser);

module.exports = router;
