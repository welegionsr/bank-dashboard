// src/app.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');
const setupSwagger = require('./config/swagger');
const cors = require('cors');

dotenv.config(); // Load environment variables

connectDB(); // Connect to MongoDB

const app = express();
app.use(express.json()); // Middleware for parsing JSON requests

// Set up Swagger UI
setupSwagger(app); // Initialize Swagger UI

app.use(cors({
    origin: 'http://localhost:3000', // Or '*' for any origin (less secure)
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true // If you're using cookies or auth headers
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/users', userRoutes);


// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0',  () => {
    console.log(`Server is running on port ${PORT}`);
});
