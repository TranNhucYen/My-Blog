const {body} = require('express-validator');

const validateUser = [
    body('username').notEmpty().withMessage('Username cannot be empty').trim().escape(),
    body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('password')
        .optional()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Password must contain at least one special character')
]

module.exports = {
    validateUser
};  