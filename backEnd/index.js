const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// load environment variables
dotenv.config();

const authRoutes = require('./routes/auth.js');
const employeeRoutes = require('./routes/employees.js');
const leaveRoutes = require('./routes/leaves.js');

const errorHandler = require('./middleware/errorHandler.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:9000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'server is running' });
});

// api routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/leaves', leaveRoutes);

// use error handle for middleware
app.use(errorHandler);

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