// src/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('Connected to MongoDB Atlas'))
        .catch((err) => console.error('Connection error:', err));
};

module.exports = connectDB;