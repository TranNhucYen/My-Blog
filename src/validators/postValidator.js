const { body } = require('express-validator');

const validatePost = [
    body('title').notEmpty().withMessage('Title cannot be empty').trim().escape(),
    body('content').optional().trim().escape()
]

module.exports = {
    validatePost
}; 