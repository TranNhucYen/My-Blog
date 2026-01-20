const { RESP_TYPES } = require('redis');
/**@type {import('../services/adminService.js')} */
const adminService = require('../services/adminService.js');
/**@type {import('../services/postService.js')} */
const postService = require('../services/postService.js');
const { generateSecurePassword } = require('../utils/cryptoUtils.js');
const { sendWelcomeEmail } = require('../services/emailService.js');
const catchAsync = require('../utils/catchAsync.js');

const getDashboard = catchAsync(async (req, res) => {
    const user = req.session.user;
    const adminStats = await adminService.getStatistics();
    const postStats = await postService.getStatistics();
    return res.render('admin/dashboard.ejs', {
        user: user,
        statistics: {
            admin: adminStats,
            post: postStats
        }
    });
});


// crud user
const getAllUsers = catchAsync(async (req, res) => {
    const users = await adminService.readAllUsers();
    return res.status(200).json(users)
})

const createUser = catchAsync(async (req, res) => {
    const temporaryPassword = generateSecurePassword();
    const userData = {
        username: req.body.username,
        email: req.body.email,
        role: 'admin',
        password: temporaryPassword,
    }
    const newUser = await adminService.createUser(userData);

    // Gửi email chứa thông tin tài khoản và mật khẩu tạm thời
    await sendWelcomeEmail(userData.email, userData.username, temporaryPassword);

    console.log('User created and email sent to:', userData.email);
    return res.status(201).json(newUser);
})

const updateUserBySuperadmin = catchAsync(async (req, res) => {
    const userId = req.params.id;
    const userData = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    }
    const updatedUser = await adminService.updateUser(userId, userData);
    return res.status(200).json(updatedUser)

})

const deleteUser = catchAsync(async (req, res) => {
    const userId = req.params.id;
    await adminService.deleteUser(userId)
    return res.status(204).send();

})

// get admin statistics 
const getStatistics = catchAsync(async (req, res) => {
    const stats = await adminService.getStatistics();
    return res.status(200).json(stats);

});

// API endpoint for post statistics
const getPostStatisticsAPI = catchAsync(async (req, res) => {
    const stats = await postService.getStatistics();
    return res.status(200).json(stats);
});

module.exports = {
    getDashboard,
    getAllUsers,
    createUser,
    updateUserBySuperadmin,
    deleteUser,
    getStatistics,
    getPostStatisticsAPI
};