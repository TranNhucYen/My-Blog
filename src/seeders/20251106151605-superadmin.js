'use strict';
require('dotenv').config();
const {User,Post} = require('../models');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await User.create({
            username: 'superadmin 123',
            email: process.env.SUPERADMIN_EMAIL,
            password: process.env.SUPERADMIN_PASSWORD,
            role: 'superadmin'
        });
    },

    async down(queryInterface, Sequelize) {
        await User.destroy({
            where: {
                email: process.env.SUPERADMIN_EMAIL,
            }
        }); 
    }
};
