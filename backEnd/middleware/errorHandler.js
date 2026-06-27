
const errorHandler = (err, req, res, next) => {
    console.error('error: ', err.message);

    // mongoose validation error
    if(err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({error: messages[0]});
    }

    // mongoose duplicate key error
    if(err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({error: `${field} already exists`});
    }

    // Jwt errors
    if(err.name === 'JsonWebTokenError') {
        return res.status(401).json({error: 'invalid token'});
    }

    if(err.name === 'TokenExpiredError') {
        return res.status(401).json({error: 'Token expired'});
    }

    // default error
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
};

module.exports = errorHandler;