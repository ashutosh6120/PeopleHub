const User = require('../models/User.js');
const { generateToken } = require('../utils/jwt.js');
const { comparePassword } = require('../utils/password.js');
const { registerSchema, loginSchema } = require('../validators/authValidator.js');


exports.register = async (req, res, next) => {
    try {
        // validate input
        const { error, value } = registerSchema.validate(req.body);
        if(error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // check if user exists
        const existingUser = await User.findOne({ email: value.email });
        if(existingUser) {
            return res.status(400).json({ error: 'email already registered' });
        }

        // create new user
        const user = new User({
            name: value.name,
            email: value.email,
            password: value.password,
            role: value.role
        });

        await user.save();

        // generate token
        const token = generateToken(user);

        res.status(201).json({
            message: 'user registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        // validate input
        const { error, value } = loginSchema.validate(req.body);
        if(error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // find user by email as unique
        const user = await User.findOne({ email: value.email }).select('+password');
        if(!user) {
            return res.status(401).json({ error: 'invalid credentials' });
        }

        // compare passwords
        const isPasswordValid = await comparePassword(value.password, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({ error: 'invalid credentials' });
        }

        // generate token
        const token = generateToken(user);
        res.json({
            message: 'login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
}