const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const notificationController = require('../controllers/notificationController');

router.get('/', authMiddleware.authenticate ,notificationController.getCurrentUserNotifications);

router.get('/unread', authMiddleware.authenticate, notificationController.getCurrentUserUnreadNotifications);

router.patch('/:id/read', notificationController.markAsRead);

// route to manually create a notification, for testing purposes
// router.post('/', notificationController.createNotification)


module.exports = router;
