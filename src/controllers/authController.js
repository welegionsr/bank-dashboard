require('dotenv').config();  // Load environment variables from .env file

// src/controllers/authController.js
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Register user
exports.register = async (req, res) => {
    const { email, password, phone, name } = req.body;
    const balance = 500;

    try {
        const user = new User({ email, password, phone, balance, name});
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid email or password' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

        const userId = user._id;
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '20m' });
        res.json({ token, userId });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Token verification

exports.verifyToken = async(req, res) => {
    const token = req.body.token || req.headers['authorization'];

    if(!token) return res.status(403).json({error: 'Token is required'});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        res.status(200).json({valid: true, userId: decoded.userId});
    }
    catch (err)
    {
        res.status(403).json({valid: false, error: 'Invalid or expired token'});
    }
};
