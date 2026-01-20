const ApiError = require('../utils/apiError');
const { sequelize, Post, User } = require('../models');
const { QueryTypes } = require('sequelize');
const uploadService = require('./uploadService.js');

const readAllPost = async () => {
    let posts = await Post.findAll({
        include: [{
            model: User,
            attributes: ['username', 'email']
        }],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
    });
    posts = posts.map(p => ({
        ...p,
        thumbnailPath: p.thumbnailPath ? uploadService.getPublicUrl(p.thumbnailPath) : null
    }));
    return posts;
};

const readPostsByUserId = async (userId) => {
    const posts = await Post.findAll({
        where: { userId: userId },
        include: [{
            model: User,
            attributes: ['username']
        }],
        order: [['createdAt', 'DESC']],

    });
    return posts;
};

const readPostById = async (postId) => {
    const post = await Post.findOne({
        where: { id: postId },
        include: [{
            model: User,
            attributes: ['username']
        }],
        raw: true,
        nest: true
    });

    return {...post,
        thumbnailPath: uploadService.getPublicUrl(post.thumbnailPath)
    };
};

const createPost = async (postData) => {
    const post = await Post.create({
        title: postData.title,
        content: postData.content,
        thumbnailPath: postData.thumbnailPath,
        userId: postData.userId
    });
    return post;
};;

const updatePost = async (postId, userId, newData) => {
    const post = await Post.findOne({
        where: { id: postId }
    });

    if (!post) {
        throw new ApiError(404, 'Post not found');
    }
    await post.update(newData);
    return post;
};

const deletePost = async (postId, userId, isSuperAdmin) => {
    const post = await Post.findOne({
        where: { id: postId }
    });

    if (!post) {
        throw new ApiError(404, 'Post not found');
    }

    await post.destroy();
    return true;
};

// post statistics service
const getStatistics = async () => {
    const [countPostsThisWeek, postsPerAdmin, postsPerDay] = await Promise.all([
        sequelize.query(
            `SELECT COUNT(*) as postCount
            FROM posts
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY);`,
            { type: QueryTypes.SELECT }
        ),
        sequelize.query(
            `SELECT users.id, users.username, COUNT(posts.id) AS postCount
            FROM users
            JOIN posts ON users.id = posts.user_id
            GROUP BY users.id, users.username;`,
            { type: QueryTypes.SELECT }
        ),
        sequelize.query(
            `SELECT DATE(created_at) AS day, COUNT(*) AS postCount
            FROM posts
            GROUP BY day
            ORDER BY day DESC;`,
            { type: QueryTypes.SELECT }
        )
    ]);


    const totalPosts = postsPerAdmin.reduce((sum, post) => {
        return sum + post.postCount
    }, 0)

    return {
        countPostsThisWeek: countPostsThisWeek[0].postCount,
        postsPerAdmin,
        postsPerDay,
        totalPosts
    }
}

module.exports = {
    readAllPost,
    readPostsByUserId,
    readPostById,
    createPost,
    updatePost,
    deletePost,
    getStatistics
};