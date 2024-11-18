// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token using the same JWT_SECRET used when signing the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // You can attach user data to the request object
        next();  // Proceed to the next middleware/route handler
    } catch (err) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

module.exports = { authenticate };  // Ensure you're exporting the authenticate function
