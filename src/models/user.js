// src/models/user.js
const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

// User schema
const userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, match: [/\S+@\S+\.\S+/, 'Invalid email address'] },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
    balance: { type: Number, required: true},
    name: { type: String, required: true},
    verificationCode: {type: String, required: false},
    codeExpiry: {type: Date, required: false},
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
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

userSchema.methods.compareVerification = async function(candidateCode)
{
    return (this.verificationCode === candidateCode);
}

const User = mongoose.model('User', userSchema);
module.exports = User;