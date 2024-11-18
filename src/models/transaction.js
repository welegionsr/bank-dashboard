// src/models/transaction.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: [0, 'Amount cannot be negative'] },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;