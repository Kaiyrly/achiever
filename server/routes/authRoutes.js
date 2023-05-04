const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const { verifyToken } = require("../middlewares");


router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.put('/changePassword', authController.updatePassword);
router.post('/resetPassword', authController.sendRandomPassword);

module.exports = router;