require('dotenv').config();  // Load environment variables from .env file

const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { generateVerificationCode } = require('../utils/codeGenerator');
const { sendVerificationEmail } = require('../utils/emailService');

const isProduction = process.env.NODE_ENV === 'production';

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
        if (!user.isVerified) {
            const verificationCode = generateVerificationCode();

            // update code expiration
            user.codeExpiry = Date.now() + 10 * 60 * 1000;
            user.verificationCode = verificationCode;

            await user.save();

            // send email
            await sendVerificationEmail(email, verificationCode);

            return res.status(403).json({ error: 'account is not verified!' });
        }

        // Set lastOnline to the current date
        user.lastOnline = new Date();
        await user.save();


        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30m' }
        );

        // Set HttpOnly cookies
        res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'None' : 'Lax',
            maxAge: 30 * 60 * 1000, // Match token lifespan
            ...(isProduction && { partitioned: true }), // Add partitioned only in production
            ...(isProduction && { domain: process.env.DEPLOY_DOMAIN }), // Add domain only in production
        });

        res.cookie('userId', user._id.toString(), {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'None' : 'Lax',
            maxAge: 30 * 60 * 1000, // Match token lifespan
            ...(isProduction && { partitioned: true }), // Add partitioned only in production
            ...(isProduction && { domain: process.env.DEPLOY_DOMAIN }), // Add domain only in production
        });

        res.cookie('role', user.role, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'None' : 'Lax',
            maxAge: 30 * 60 * 1000, // Match token lifespan
            ...(isProduction && { partitioned: true }), // Add partitioned only in production
            ...(isProduction && { domain: process.env.DEPLOY_DOMAIN }), // Add domain only in production
        });

        // Set session validation cookie
        res.cookie('session_valid', 'true', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'None' : 'Lax',
            maxAge: 30 * 60 * 1000, // Match token lifespan
            path: '/',
            ...(isProduction && { partitioned: true }), // Add partitioned only in production
            ...(isProduction && { domain: process.env.DEPLOY_DOMAIN }), // Add domain only in production
        });

        console.log("[Login] user logged in successfully! id: ", user._id.toString());

        // Respond without including sensitive data
        res.json({ message: 'Login successful' });

    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.logout = (_req, res) => {

    res.clearCookie('token', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax',
        ...(isProduction && { domain: process.env.DEPLOY_DOMAIN }),
        ...(isProduction && { partitioned: true }), // Include if partitioned cookies are used
    });

    res.clearCookie('userId', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax',
        ...(isProduction && { domain: process.env.DEPLOY_DOMAIN }),
        ...(isProduction && { partitioned: true }),
    });

    res.clearCookie('role', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax',
        ...(isProduction && { domain: process.env.DEPLOY_DOMAIN }),
        ...(isProduction && { partitioned: true }),
    });

    res.clearCookie('session_valid', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax',
        ...(isProduction && { domain: process.env.DEPLOY_DOMAIN }),
        ...(isProduction && { partitioned: true }),
    });

    console.log("[Logout] user successfully logged out, all cookies erased.");

    res.status(200).json({ message: 'Successfully logged out' });
};

// Token verification
exports.verifyToken = (req, res) => {
    const token = req.body.token || req.headers['authorization'];

    if (!token) return res.status(403).json({ error: 'Token is required' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        res.status(200).json({ valid: true, userId: decoded.userId });
    }
    catch (err) {
        res.status(403).json({ valid: false, error: 'Invalid or expired token' });
    }
};

exports.verifyUser = async (req, res) => {
    const { verificationCode, email } = req.body;

    if (!verificationCode || !email) {
        return res.status(400).json({ error: 'Code and email are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'No user found with this email' });
        }

        // Check if the code has expired
        if (Date.now() > user.codeExpiry) {
            return res.status(401).json({ error: 'Verification code has expired' });
        }

        const isMatch = user.compareVerification(verificationCode);
        if (!isMatch) return res.status(403).json({ error: 'Code does not match' });

        // Mark the user as verified and clear verification data
        user.isVerified = true;
        user.verificationCode = undefined;
        user.codeExpiry = undefined;

        await user.save();

        res.status(200).json({ message: 'Verification successful' });
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
    }

};

exports.resendVerification = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            return res.status(400).json({ error: 'A valid email address is required' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found!' });

        if (user.isVerified) {
            return res.status(400).json({ error: 'User already verified!' });
        }

        const verificationCode = generateVerificationCode();

        // update code expiration
        user.codeExpiry = Date.now() + 10 * 60 * 1000;
        user.verificationCode = verificationCode;

        await user.save();

        // send email
        await sendVerificationEmail(email, verificationCode);

        res.status(200).json({ message: 'Verification email re-sent successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.verifySession = async (req, res) => {
    console.log('[verifySession] Received cookies:', req.cookies);

    const token = req.cookies.token;
    const sessionValid = req.cookies.session_valid === 'true';
    const role = req.cookies.role;

    console.log('[verifySession] Token from cookie:', token);
    console.log('[verifySession] sessionValid from cookie:', sessionValid);
    console.log('[verifySession] Role from cookie:', role);

    // If the session cookie is valid, skip token verification and return the cached response
    if (sessionValid) {
        return res.status(200).json({ isValid: true, role: role || 'guest' });
    }

    if (!token) {
        return res.status(401).json({ isValid: false });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Extract role from the JWT token or set to 'guest' if not present
        const userRole = decoded.role || 'guest'; // Default to 'guest' if no role in the token


        // Set session validation cookie
        res.cookie('session_valid', 'true', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'None' : 'Lax',
            maxAge: 30 * 60 * 1000, // 30 minutes (same as token)
            path: '/',
            ...(isProduction && { partitioned: true }), // Add partitioned only in production
            ...(isProduction && { domain: process.env.DEPLOY_DOMAIN }), // Add domain only in production
        });

        res.setHeader('Cache-Control', 'private, max-age=60'); // Cache for 1 minute (optional)

        return res.status(200).json({ isValid: true, role: userRole });
    } catch (error) {
        console.error("[verifySession] error: ", error);
        return res.status(401).json({ isValid: false });
    }
};
