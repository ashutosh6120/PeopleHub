const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];  // bearer token

        if(!token) {
            return res.status(401).json({error: 'access token required'});
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if(err) {
                return res.status(403).json({error: 'invalid or expired token'});
            }
            req.user = user;
            next();
        });
    } catch (error) {
        res.status(500).json({error: 'authentication error'});
    }
};

const authorizeAdmin = (req, res, next) => {
    if(req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({error: 'admin access required'});
    }
};

module.exports = {
    authenticateToken,
    authorizeAdmin
};