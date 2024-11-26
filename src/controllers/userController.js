const { default: mongoose } = require('mongoose');
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
    
    console.log("Decoded user ID:", req.user?.userId);

    const userId = req.user?.userId;
    // check if the userId is in a valid format
    if (!mongoose.Types.ObjectId.isValid(userId)) 
    {
        console.error("Invalid user ID format:", userId);
        return res.status(400).json({ error: 'Invalid user ID format.' });
    }

    try {
        const user = await User.findById(userId).select('-password');
        if (!user)
        {
            console.error("User not found:", userId);
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ valid: true, user });
    }
    catch (err) {
        console.error("Error fetching user:", err.message);
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
