'use strict';
require('dotenv').config();
const {User,Post} = require('../models');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const isProd = process.env.NODE_ENV === 'production';
        const email = isProd ? process.env.PROD_SUPERADMIN_EMAIL : process.env.SUPERADMIN_EMAIL;
        const password = isProd ? process.env.PROD_SUPERADMIN_PASSWORD : process.env.SUPERADMIN_PASSWORD;
        await User.create({
            username: 'superadmin 123',
            email: email,
            password: password,
            role: 'superadmin'
        });
    },

    async down(queryInterface, Sequelize) {
        const isProd = process.env.NODE_ENV === 'production';
        const email = isProd ? process.env.PROD_SUPERADMIN_EMAIL : process.env.SUPERADMIN_EMAIL;
        await User.destroy({
            where: {
                email: email,
            }
        }); 
    }
};
