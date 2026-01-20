const { Resend } = require('resend');
const ApiError = require('../utils/apiError');
require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';
const resend = new Resend((isProd ? process.env.PROD_RESEND_API_KEY : null) || process.env.RESEND_API_KEY);

const sendWelcomeEmail = async (email, username, temporaryPassword) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'BlogMVC <onboarding@resend.dev>',
            to: email,
            subject: 'Chào mừng đến với BlogMVC - Thông tin tài khoản',
            html: `
                <h2>Xin chào ${username}!</h2>
                <p><strong>Thông tin đăng nhập admin của bạn:</strong></p>
                <ul>
                    <li>Email: ${email}</li>
                    <li>Mật khẩu tạm thời: <strong>${temporaryPassword}</strong></li>
                </ul>
                <p style="color: #dc2626;">Vui lòng đổi mật khẩu sau lần đăng nhập đầu tiên để bảo mật tài khoản.</p>
                <p>Trân trọng,<br/>My Blog</p>
            `,
        });

        if (error) {
            throw new ApiError(500, 'cannot send email: ' + error.message);
        }

        return data;
    } catch (error) {
        throw new ApiError(500, 'Error sending email: ' + error.message);
    }
};

module.exports = {
    sendWelcomeEmail
};
