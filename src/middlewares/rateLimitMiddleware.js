const rateLimit = require('express-rate-limit');

// Define the rate-limiting rules
const verifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes window
    max: 5,                    // Limit each IP to 5 verification attempts per windowMs
    message: { error: 'Too many verification attempts. Please try again later.' },
    headers: true,             // Include rate limit info in the response headers
    onLimitReached: (req, res, options) => {
        console.warn(`Rate limit exceeded by IP: ${req.ip}`);
    },
});

module.exports = { verifyLimiter };