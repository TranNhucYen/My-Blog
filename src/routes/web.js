const router = require('express').Router();
const homeRouter = require('./home.js');
const adminRouter = require('./admin.js');
const authRouter = require('./auth.js');


router.use('/', homeRouter);

router.use('/auth',authRouter);
router.use('/admin',adminRouter);

module.exports = router;
