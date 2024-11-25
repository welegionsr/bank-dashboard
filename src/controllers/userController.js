const User = require('../models/user');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get a specific user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get logged-in user
exports.getCurrentUser = async (req, res) => {
    const token = req.body.token || req.headers['authorization'];

    if (!token) return res.status(403).json({ error: 'Token is required' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-password');

        res.status(200).json({ valid: true, user });
    }
    catch (err) {
        res.status(403).json({ valid: false, error: 'Invalid or expired token' });
    }
};

// Create a new user
exports.createUser = async (req, res) => {
    const { email, password, phone } = req.body;
    try {
        const user = new User({ email, password, phone });
        await user.save();
        res.status(201).json({ message: 'User created successfully', user });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Update a user
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
