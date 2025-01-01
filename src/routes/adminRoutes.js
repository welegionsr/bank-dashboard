const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyLimiter } = require('../middlewares/rateLimitMiddleware').default;

router.post('/example', adminController.example);

module.exports = router;
