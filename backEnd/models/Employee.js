const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'employee name is required']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, 'phone no is required']
    },
    departments: {
        type: String,
        enum: ['Engineering', 'Sales', 'HR', 'Finance', 'Operations', 'Marketing'],
        required: [true, 'department is required']
    },
    position: {
        type: String,
        required: [true, 'position is required']
    },
    joiningDate: {
        type: Date,
        required: [true, 'joining date is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        sparse: true // optional - not all employees need a user account
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Employee', employeeSchema);