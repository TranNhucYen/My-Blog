const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError.js');

module.exports = (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const errorMessages = error.array().map(err => err.msg).join(', ');
        return next(new ApiError(400, errorMessages));
    }
    return next();
}