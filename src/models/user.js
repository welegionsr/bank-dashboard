// src/models/user.js
const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

// User schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Invalid email address'],
        validate: {
            validator: function (value) {
                return /\S+@\S+\.\S+/.test(value);
            },
            message: 'Invalid email format'
        }
    },    
    password: { 
        type: String, 
        required: true,
        // TODO: enable only after implementing a way to reset passwords
        // validate: {
        //     validator: function (value) {
        //         return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
        //         // Password should contain at least 8 characters, 1 letter, 1 number, 1 special character
        //     },
        //     message: 'Password must be at least 8 characters, and contain at least 1 letter, 1 number, and 1 special character'
        // }
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    balance: { // in cents
        type: Number,
        required: true,
        min: [0, 'Balance cannot be negative'], // Ensure balance is positive
    },
    name: { 
        type: String, 
        required: true,
    },
    verificationCode: {
        type: String, 
        required: false
    },
    codeExpiry: {
        type: Date, 
        required: false,
        validate: {
            validator: function (value) {
                return value && value > Date.now(); // check that expiry date is in the future
            },
            message: 'Verification code has expired'
        }
    },
    contacts: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        validate: {
            validator: function (value) {
                return mongoose.Types.ObjectId.isValid(value); // ensure it's a valid ObjectId
            },
            message: 'Invalid contact ID'
        }
    }],
    role: { 
        type: String, 
        enum: ['customer', 'admin'], 
        default: 'customer' 
    },
    lastOnline: { 
        type: Date, 
        default: Date.now 
    },
}, { timestamps: true });

// Hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare passwords for login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.compareVerification = function(candidateCode)
{
    return (this.verificationCode === candidateCode);
}

const User = mongoose.model('User', userSchema);
module.exports = User;