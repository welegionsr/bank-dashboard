const { default: mongoose } = require('mongoose');
const Transaction = require('../models/transaction');
const User = require('../models/user');
const Notification = require('../models/notification');

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

    if (amount <= 0) {
        return res.status(400).json({ error: 'Not Allowed: amount must be a positive value' });
    }

    try {
        const sendUser = await User.findOne({ email: sender });
        if (!sendUser) return res.status(404).json({ error: 'Sender does not exist!' });

        const receiveUser = await User.findOne({ email: receiver });
        if (!receiveUser) return res.status(404).json({ error: 'Receiver does not exist!' });

        if (sendUser.id === receiveUser.id) {
            // can't send money to yourself!
            return res.status(400).json({ error: 'Sending money to yourself is not allowed!' });
        }

        if (sendUser.balance < amount) {
            return res.status(400).json({ error: `Not Allowed: User can't send more money than what they have in their balance` });
        }

        // create transaction in DB
        const transaction = new Transaction({ sender: sendUser.id, receiver: receiveUser.id, amount, date: Date.now() });
        await transaction.save();

        // update balance of both users
        sendUser.balance -= amount;
        receiveUser.balance += amount;

        await sendUser.save();
        await receiveUser.save();

        // Create a notification for the receiving user
        const notificationMessage = `You received $${amount / 100} from ${sendUser.name}`;
        const notification = new Notification({
            userId: receiveUser.id,
            message: notificationMessage,
            type: 'transaction',
            isRead: false
        });

        await notification.save();

        // Populate the receiver details
        const populatedTransaction = await Transaction.findById(transaction.id).populate('receiver');

        res.status(201).json({ transaction: populatedTransaction });
    }
    catch (err) {
        console.error("[createTransaction] error: ", err);
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

// Get transactions of current user
exports.getCurrentUserTransactions = async (req, res) => {
    console.log("[getCurrentUserTransactions] ","Decoded user ID:", req.user?.userId);

    const userId = req.user?.userId;
    // check if the userId is in a valid format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error("Invalid user ID format:", userId);
        return res.status(400).json({ error: 'Invalid user ID format.' });
    }

    try {
        const transactions = await Transaction.find({
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        })
            .sort({ date: -1 }) // Sort transactions by date (newest first)
            .populate('sender', 'name email')
            .populate('receiver', 'name email');

        res.status(200).json({ transactions });
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ error: 'An error occurred while fetching transactions' });
    }
};

// Get all transactions of a specific user
exports.getTransactionsByUser = async (req, res) => {
    const { userEmail } = req.params;

    try {

        // Validate the email parameter
        if (!userEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(userEmail)) {
            return res.status(400).json({ error: 'Invalid or missing email parameter' });
        }

        const user = await User.findOne({ email: userEmail });

        if (!user) return res.status(404).json({ error: 'No user exists with the provided email' });

        const transactions = await Transaction.find({
            $or: [
                { sender: user._id },
                { receiver: user._id }
            ]
        })
            .sort({ date: -1 }) // Sort transactions by date (newest first)
            .populate('sender', 'name email')
            .populate('receiver', 'name email');


        res.status(200).json({ transactions });
    }
    catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ error: 'An error occurred while fetching transactions' });
    }
};
