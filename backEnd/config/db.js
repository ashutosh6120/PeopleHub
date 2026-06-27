const mongoose = require('mongoose');

const connectDB = async (mongoUri) => {
    try {
        await mongoose.connect(mongoUri);
        console.log('mongodb connection successfully');
    } catch (error) {
        console.error('mongodb connection error', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;