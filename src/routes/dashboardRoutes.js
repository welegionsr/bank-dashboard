const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/user');

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get user dashboard
 *     description: Returns the user's email and phone if the token is valid.
 *     responses:
 *       200:
 *         description: Dashboard HTML with user's email and phone
 *       401:
 *         description: Unauthorized, invalid token
 */
router.get('/dashboard', authMiddleware.authenticate, async (req, res) => {
    try {
        // Get the user ID from the JWT token
        const userId = req.user.userId;

        // Find the user by their ID
        const user = await User.findById(userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Send a simple HTML response with the user's email and phone
        res.status(200).send(`
            <html>
                <body>
                    <h1>Welcome to your Dashboard</h1>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Phone:</strong> ${user.phone}</p>
                </body>
            </html>
        `);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;