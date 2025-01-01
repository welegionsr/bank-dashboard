const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        console.error("No token provided");
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token using the same JWT_SECRET used when signing the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token decoded:", decoded);
        req.user = decoded;  // attach user data to the request object
        next();  // Proceed to the next middleware/route handler
    } catch (err) {
        console.error("Token verification failed:", err.message);
        res.status(400).json({ error: 'Invalid token.' });
    }
};

module.exports = { authenticate };
