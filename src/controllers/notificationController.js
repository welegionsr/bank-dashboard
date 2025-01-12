const Notification = require('../models/notification');


exports.getCurrentUserNotifications = async (req, res) => {
    try {
        const userId = req.user.userId; // should be set from the auth middleware
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching user notifications', error });
    }
};

exports.getCurrentUserUnreadNotifications = async (req, res) => {
    try {
        const userId = req.user.userId; // should be set from the auth middleware
        const notifications = await Notification.find({ userId, isRead: false}).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching user notifications', error });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedNotification = await Notification.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
        );

        if (!updatedNotification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification set as read successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating notification', error });
    }
};

