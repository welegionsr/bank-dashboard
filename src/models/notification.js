const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        validate: {
            validator: async (userId) => {
                // check that the user exists
                const user = await mongoose.model('User').findById(userId);
                return !!user; // true if the user exists
            },
            message: 'User does not exist'
        }
    },
    message: { 
        type: String, 
        required: true,
        trim: true, // remove leading/trailing spaces
        minlength: [5, 'Message should be at least 5 characters long'],
        maxlength: [500, 'Message should be no longer than 500 characters'] 
    },
    type: { 
        type: String, 
        enum: ['transaction', 'alert', 'other'], 
        required: true 
    },
    isRead: { 
        type: Boolean, 
        default: false 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;