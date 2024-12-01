require('dotenv').config();  // Load environment variables from .env file

// src/controllers/authController.js
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { generateVerificationCode } = require('../utils/codeGenerator');
const { sendVerificationEmail } = require('../utils/emailService');

// Register user
exports.register = async (req, res) => {
    const { email, password, phone, name, balance } = req.body;

    const verificationCode = generateVerificationCode();

    try {
        const user = new User({ email, password, phone, balance, name, isVerified: false, verificationCode, codeExpiry: Date.now() + 10 * 60 * 1000 });
        await user.save();

        //send verification email to user's email
        await sendVerificationEmail(email, verificationCode);

        res.status(200).json({ message: 'Verification email sent' });
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

        // check if user is verified, and if not, start verification
        if (!user.isVerified)
        {
            // send email
            const verificationCode = generateVerificationCode();
            await sendVerificationEmail(email, verificationCode);
            
            res.status(403).json({error: 'account is not verified!'});
        }
        
        const userId = user._id;
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '20m' });
        res.json({ token, userId });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Token verification

exports.verifyToken = (req, res) => {
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

exports.verifyUser = async (req, res) => {
    const { verificationCode, email } = req.body;

    if (!verificationCode || !email) 
    {
        return res.status(400).json({error: 'Code and email are required'});
    }

    try
    {
        const user = await User.findOne({email});
        if(!user) 
        {
            return res.status(404).json({error: 'No user found with this email'});
        }

        // Check if the code has expired
        if (Date.now() > user.codeExpiry) {
            return res.status(401).json({ error: 'Verification code has expired' });
        }

        const isMatch = user.compareVerification(verificationCode);
        if(!isMatch) return res.status(403).json({error: 'Code does not match'});
    
        // Mark the user as verified and clear verification data
        user.isVerified = true;
        user.verificationCode = undefined;
        user.codeExpiry = undefined;

        await user.save();

        res.status(200).json({ message: 'Verification successful' });
    }
    catch (err)
    {
        res.status(500).json({error: 'Server error'});
    }

}
