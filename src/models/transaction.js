// src/models/transaction.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
    sender: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async (senderId) => {
                // check if sender exists
                const sender = await mongoose.model('User').findById(senderId);
                return !!sender; // true if sender exists
            },
            message: 'Sender user does not exist'
        }
    },
    receiver: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async (receiverId) => {
                // check if receiver exists
                const receiver = await mongoose.model('User').findById(receiverId);
                return !!receiver; // true if receiver exists
            },
            message: 'Receiver user does not exist'
        }
    },
    amount: { 
        type: Number, 
        required: true, 
        min: [1, 'Amount cannot be at least 1 cent'],
        validate: {
            validator: (value) => value % 1 === 0, // make sure it's an integer (no fractions of a cent)
            message: 'Amount (in cents) must be a whole number'
        }
    }, // in cents
    date: { 
        type: Date, 
        default: Date.now
    },
}, { timestamps: true });


// make sure sender and receiver are not the same before saving to db
transactionSchema.pre('save', async function (next) {
    if (String(this.sender) === String(this.receiver)) {
        return next(new Error('Sender and receiver cannot be the same'));
    }

    next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;