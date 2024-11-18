const express = require('express');
const router = express.Router();


// In-memory array to store user data
const userDB = [];


/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     description: Responds with a welcome message for the Bank Service API.
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/', (req, res) => {
    res.send('Welcome to the Bank Service API');
});

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with email, password, and phone number.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Unique email address for the user.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: securePassword123
 *               phone:
 *                 type: string
 *                 description: Unique phone number for the user.
 *                 example: "+123456789"
 *     responses:
 *       201:
 *         description: User successfully registered.
 *       400:
 *         description: Invalid request or missing fields.
 *       409:
 *         description: Email or phone already exists.
 */
router.post('/register', (req, res) => {
    const { email, password, phone } = req.body;

    // Validate input
    if (!email || !password || !phone) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check for duplicates
    const emailExists = userDB.some(user => user.email === email);
    const phoneExists = userDB.some(user => user.phone === phone);

    if (emailExists || phoneExists) {
        return res.status(409).json({ message: 'Email or phone already exists' });
    }

    // Add new user to the array
    const newUser = { email, password, phone };
    userDB.push(newUser);

    return res.status(201).json({ message: 'User registered successfully', user: newUser });
});

module.exports = router;