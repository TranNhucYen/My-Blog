const postService = require('../services/postService.js');
const catchAsync = require('../utils/catchAsync.js');

const getHome = catchAsync(async (req, res) => {
    let posts = [];
    try {
        posts = await postService.readAllPost() || [];
    } catch (error) {
        console.error('Database connection error (getHome):', error.message);
    }
    return res.render('home/home', { posts, page: 'home' });
});

const getAllPosts = catchAsync(async (req, res) => {
    let posts = [];
    try {
        posts = await postService.readAllPost() || [];
    } catch (error) {
        console.error('Database connection error (getAllPosts):', error.message);
    }
    return res.json(posts);
});

const getPostDetail = catchAsync(async (req, res) => {
    const postId = req.params.id;
    let post = null;
    try {
        post = await postService.readPostById(postId);
    } catch (error) {
        console.error('Database connection error (getPostDetail):', error.message);
    }

    if (!post) {
        return res.status(404).render('error', {
            message: 'Bài viết không tồn tại hoặc có lỗi kết nối database.',
            error: { status: 404 }
        });
    }
    return res.render('home/postDetail', { post });
});

const getContact = catchAsync(async (req, res) => {
    return res.render('home/contact', { page: 'contact' });
});

module.exports = {
    getHome,
    getAllPosts,
    getPostDetail,
    getContact
};