const Transaction = require('../models/transaction');
const User = require('../models/user');

// Get all transactions
exports.getAllTransactions = async (_req, res) => {
    try {
        const transactions = await Transaction.find().select('id sender receiver amount date');
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
    const { sender, receiver } = req.body;

    const amount = parseInt(req.body.amount);

    if (amount <= 0)
    {
        return res.status(400).json({error: 'Not Allowed: amount must be a positive value'});
    }

    try 
    {
        const sendUser = await User.findOne({ email: sender });
        if (!sendUser) return res.status(404).json({ error: 'Sender does not exist!' });

        const receiveUser = await User.findOne({ email: receiver });
        if (!receiveUser) return res.status(404).json({ error: 'Receiver does not exist!' });

        if (sendUser.id === receiveUser.id) {
            // can't send money to yourself!
            return res.status(400).json({ error: 'Sending money to yourself is not allowed!' });
        }

        if(sendUser.balance < amount)
        {
            return res.status(400).json({error: `Not Allowed: User can't send more money than what they have in their balance`});
        }

        // create transaction in DB
        const transaction = new Transaction({ sender: sendUser.id, receiver: receiveUser.id, amount, date: Date.now() });
        await transaction.save();

        // update balance of both users
        sendUser.balance -= amount;
        receiveUser.balance += amount;

        await sendUser.save();
        await receiveUser.save();
        res.status(201).json(transaction);
    }
    catch (err) {
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
