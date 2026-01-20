const router = require('express').Router();
const { authLimiter } = require('../middleware/rateLimiter.js');

/**@type {import('../controllers/authController.js')} */
const authController = require('../controllers/authController.js');

router.get('/login-admin', authController.getAdminLoginPage);
router.post('/login-admin', authLimiter, authController.postAdminLogin);
router.get('/logout', authController.logout);

module.exports = router;
