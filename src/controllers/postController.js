const postService = require('../services/postService.js');
const uploadService = require('../services/uploadService.js');
const { canModifyPost } = require('../utils/permissionHelper.js');
const catchAsync = require('../utils/catchAsync.js');

// Dành cho admin panel - hiển thị với UI quản lý
const getAdminPosts = catchAsync(async (req, res) => {
    const posts = await postService.readAllPost();
    return res.status(200).json(posts.map(p => ({
        id: p.id,
        title: p.title,
        content: p.content,
        createdAt: Math.floor(new Date(p.createdAt).getTime() / 1000),
        isOwner: canModifyPost(p.userId, req.session.user)
    })));
});

const createPost = catchAsync(async (req, res) => {
    const { id: userId } = req.session.user;

    let thumbnailPath = null;

    if (req.file) {
        thumbnailPath = await uploadService.uploadFile(req.file.buffer, req.file.mimetype);
    }

    const newPost = {
        title: req.body.title,
        content: req.body.content,
        thumbnailPath,
        userId
    };
    const post = await postService.createPost(newPost);
    const postData = post.get({ plain: true });
    postData.createdAt = Math.floor(new Date(postData.createdAt).getTime() / 1000);
    postData.isOwner = true;
    return res.status(200).json(postData);
});

const updatePost = catchAsync(async (req, res) => {
    const postId = req.params.id;
    const { id: userId } = req.session.user;
    const { title, content } = req.body;

    let thumbnailPath = undefined;

    if (req.file) {
        thumbnailPath = await uploadService.uploadFile(req.file.buffer, req.file.mimetype);
    }

    const newData = { title, content, thumbnailPath };

    const updatedPost = await postService.updatePost(postId, userId, newData);
    return res.status(200).json(updatedPost);
});

const deletePost = catchAsync(async (req, res) => {
    const postId = req.params.id;
    const { id: userId, role: userRole } = req.session.user;
    const isSuperAdmin = userRole === 'superadmin';

    await postService.deletePost(postId, userId, isSuperAdmin);

    return res.status(200).send();
});

//get post statistics 
const getPostStatistics = catchAsync(async (req, res) => {
    const stats = await postService.getStatistics();
    res.status(200).json(stats);
});

module.exports = {
    getAdminPosts,
    createPost,
    updatePost,
    deletePost,
    getPostStatistics
};