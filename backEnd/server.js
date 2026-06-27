const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:9000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/peoplehub')
    .then(() => {
        console.log('mongodb connected success');
    })
    .catch((err) => {
        console.error('mongodb connection error', err.message);
        process.exit(1);
    });

// server start
app.listen(PORT, () => {
    console.log(`\n server started running on port http:localhost:${PORT}`);

});

module.exports = app;