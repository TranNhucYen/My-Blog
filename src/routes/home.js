const router = require('express').Router();
/**@type {import('../controllers/homeController.js')} */
const homeController = require('../controllers/homeController.js');


// Public routes - KHÔNG CẦN LOGIN
router.get('/', homeController.getHome); // Trang chủ với danh sách posts
router.get('/posts/:id', homeController.getPostDetail); // Chi tiết 1 post
router.get('/posts', homeController.getAllPosts); // Xem tất cả posts (optional)
router.get('/contact', homeController.getContact); // Trang liên hệ

module.exports = router;

