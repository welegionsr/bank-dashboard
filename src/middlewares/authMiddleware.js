const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        console.error("No token provided");
        return res.status(401).json({
            error: 'Access denied. No token provided.',
            code: 'NO_TOKEN'
        });
    }

    try {
        // Verify the token using the same JWT_SECRET used when signing the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // attach user data to the request object
        next();  // Proceed to the next middleware/route handler
    } catch (err) {
        console.error("Token verification failed:", err.message);
        if (err.name === 'TokenExpiredError') {
            res.status(401).json({
                error: 'Token has expired.',
                code: 'SESSION_EXPIRED'
            });
        } else {
            res.status(401).json({
                error: 'Invalid token.',
                code: 'INVALID_TOKEN'
            });
        }
    }
};

module.exports = { authenticate };
