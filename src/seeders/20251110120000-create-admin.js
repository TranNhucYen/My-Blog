'use strict';
const { User } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await User.create({
      username: 'admin_user',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
  },

  async down(queryInterface, Sequelize) {
    await User.destroy({
      where: { email: 'admin@example.com' }
    });
  }
};
