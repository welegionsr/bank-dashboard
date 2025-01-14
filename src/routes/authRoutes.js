const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyLimiter } = require('../middlewares/rateLimitMiddleware');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema } = require('../validations/authValidations');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', validate(registerSchema), authController.register);

router.post('/login', validate(loginSchema), authController.login);

router.post('/logout', authMiddleware.authenticate, authController.logout);

router.post('/token', authController.verifyToken);

router.get('/session', authController.verifySession);

router.post('/verify', verifyLimiter, authController.verifyUser);

router.post('/resend', verifyLimiter, authController.resendVerification);

module.exports = router;
