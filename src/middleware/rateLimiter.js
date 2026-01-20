const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    skipSuccessfulRequests: true,
    message: {
        message: 'Quá nhiều yêu cầu đăng nhập từ IP này, vui lòng thử lại sau 15 phút'
    }
});

module.exports = {
    authLimiter,
};
