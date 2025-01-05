// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyLimiter } = require('../middlewares/rateLimitMiddleware');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.post('/token', authController.verifyToken);

router.get('/session', authController.verifySession);

router.post('/verify', verifyLimiter, authController.verifyUser);

router.post('/resend', verifyLimiter, authController.resendVerification);

module.exports = router;
