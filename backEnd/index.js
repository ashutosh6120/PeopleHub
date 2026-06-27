const express = require('express');
const cors = require('cors');
const env = require('./config/env.js');
const connectDB = require('./config/db.js');


const authRoutes = require('./routes/auth.js');
const employeeRoutes = require('./routes/employees.js');
const leaveRoutes = require('./routes/leaves.js');

const errorHandler = require('./middleware/errorHandler.js');

const app = express();

// Middleware
app.use(cors({
    origin: env.corsOrigin,
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

app.use((req, res) => {
    res.status(404).json({ error: 'route not found' });
});

// use error handle for middleware
app.use(errorHandler);

// database connection
connectDB(env.mongoUri);

// server start
app.listen(env.port, () => {
    console.log(`\nserver started on http://localhost:${env.port}`);
});

module.exports = app;