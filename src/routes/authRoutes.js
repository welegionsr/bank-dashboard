// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyLimiter } = require('../middlewares/rateLimitMiddleware');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/token', authController.verifyToken);

router.post('/verify', verifyLimiter, authController.verifyUser);

module.exports = router;
