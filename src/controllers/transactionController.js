const Transaction = require('../models/transaction');

// Get all transactions
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get a specific transaction by ID
exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
        res.status(200).json(transaction);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Create a new transaction
exports.createTransaction = async (req, res) => {
    const { sender, receiver, amount } = req.body;
    try {
        const transaction = new Transaction({ sender, receiver, amount });
        await transaction.save();
        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
        res.status(200).json(transaction);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
