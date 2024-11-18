// src/controllers/transactionController.js
const Transaction = require('../models/transaction');

exports.createTransaction = async (req, res) => {
    const { sender, receiver, amount } = req.body;

    // Optional: Verify the sender matches the logged-in user
    if (sender !== req.user.userId.toString()) {
        return res.status(400).json({ error: 'Sender mismatch' });
    }

    try {
        const transaction = new Transaction({ sender, receiver, amount });
        await transaction.save();
        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};