// src/app.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const userRoutes = require('./routes/userRoutes');
const setupSwagger = require('./config/swagger');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config(); // Load environment variables

connectDB(); // Connect to MongoDB

const app = express();
app.use(express.json()); // Middleware for parsing JSON requests

// Set up Swagger UI
setupSwagger(app); 

// Set up CORS

const allowedOrigins = [
    process.env.FRONT_DOMAIN,
];

app.use(cors({
    origin: (origin, callback) => {

        // Allow Postman for testing purposes
        if (!origin && req.headers['user-agent']?.includes('PostmanRuntime')) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            callback(null, true); // Origin is allowed
        } else {
            callback(new Error('Not allowed by CORS')); // Origin is not allowed
        }
    },
    methods: ['POST', 'GET', 'PUT', 'DELETE', 'PATCH'],
    credentials: true, // for allowing cookies in requests
}));

app.use(cookieParser()); // Middleware for parsing cookies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.message);
    res.status(500).json({ error: 'Internal server error.' });
});

// Start the server
const PORT = process.env.PORT || 3003;
app.listen(PORT, '0.0.0.0',  () => {
    console.log(`Server is running on port ${PORT}`);
});
