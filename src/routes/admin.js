const router = require('express').Router();
/**@type {import('../controllers/adminController.js')} */
const adminController = require('../controllers/adminController.js');
const postController = require('../controllers/postController.js');
const postValidator = require('../validators/postValidator.js');
const userValidator = require('../validators/userValidator.js');
const validate = require('../middleware/validate.js');
const requireLogin = require('../middleware/session/requireLogin.js');
const authorize = require('../middleware/role.js');
const checkOwnership = require('../middleware/ownership.js');
const upload = require('../middleware/upload.js');

// ===== BASE MIDDLEWARE =====
router.use(requireLogin);
router.use(authorize(['superadmin', 'admin']));

// dashboard
router.get('/dashboard', adminController.getDashboard);
router.get('/statistics', adminController.getStatistics);
router.get('/api/post-statistics', adminController.getPostStatisticsAPI);


// post management
router.get('/posts', postController.getAdminPosts);
router.post('/posts', upload.single('image'), postValidator.validatePost, validate, postController.createPost);
router.patch('/posts/:id', upload.single('image'), checkOwnership, postValidator.validatePost, validate, postController.updatePost);
router.delete('/posts/:id', checkOwnership, postController.deletePost);

//user management(superadmin only)
const userRouter = require('express').Router();
userRouter.use(authorize('superadmin'));

userRouter.get('/', adminController.getAllUsers);
userRouter.post('/', userValidator.validateUser, validate, adminController.createUser);
userRouter.patch('/:id', userValidator.validateUser, validate, adminController.updateUserBySuperadmin);
userRouter.delete('/:id', adminController.deleteUser);

router.use('/users', userRouter);

module.exports = router;