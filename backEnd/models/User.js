const mongoose = require('mongoose');
const {hashPassword} = require('../utils/password.js');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: 6,
        select: false // don't return password in queries by default
    },
    role: {
        type: String,
        enum: ['admin', 'employee'],
        default: 'employee'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


// hash password before saving
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next();
    }

    try {
        this.password = await hashPassword(this.password);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema);