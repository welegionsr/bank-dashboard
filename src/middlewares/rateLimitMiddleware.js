const rateLimit = require('express-rate-limit');

// Define the rate-limiting rules
const verifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 30,                   // Limit each IP to 5 verification attempts per windowMs
    message: { error: 'Too many verification attempts. Please try again later.' },
    handler: (req, res) => {
        // Custom logging when limit is reached
        console.warn(`Rate limit exceeded by IP: ${req.ip}`);

        // Send a custom response
        res.status(429).json({ error: 'Too many attempts. Please try again later.' });
    },
});

module.exports = { verifyLimiter };