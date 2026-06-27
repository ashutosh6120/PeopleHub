const mongoose = require('mongoose');


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
        required: ['admin', 'employee'],
        default: 'employee'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});




module.exports = mongoose.model('User', userSchema);