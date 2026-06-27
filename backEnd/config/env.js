const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5001,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/peoplehub',
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || '7d',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:9000'
};