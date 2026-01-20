'use strict';
const {User,Post} = require('../models');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await User.create({
            username: 'superadmin 123',
            email: 'a@gmail.com',
            password: '123',
            role: 'superadmin'
        });
    },

    async down(queryInterface, Sequelize) {
        await User.destroy({
            where: {
                email: 'a@gmail.com'
            }
        }); 
    }
};
