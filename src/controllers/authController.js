const user = require('../models/user.js');
const session = require('express-session');
/**@type {import('../services/adminService.js')} */
const adminService = require('../services/adminService.js');

const getAdminLoginPage = (req, res) => {
    res.render('admin/login.ejs');
}

const postAdminLogin = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await adminService.verifyUserCredentials(email, password);
        if (user) {
            req.session.regenerate((err) => {
                if (err) {
                    console.error('Session regeneration error:', err);
                    return res.redirect('/auth/login-admin');
                }
                req.session.user = {
                    id: user.id,
                    username: user.username,
                    role: user.role
                };

                return res.status(200).json({ success: true, redirect: '/admin/dashboard' });
            });
        }
        else {
            return res.status(401).json({ success: false, message: 'Sai thông tin đăng nhập' });
        }
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).send('Internal Server Error');
    }
}

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send('Không thể đăng xuất');
        }
        res.clearCookie('connect.sid');
        return res.redirect('/auth/login-admin');
    });
}

module.exports = {
    getAdminLoginPage,
    postAdminLogin,
    logout
};