'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const posts = [];
    for (let i = 1; i <= 10; i++) {
        posts.push({
            title: `Bài viết số ${i}`,
            content: `Nội dung của bài viết số ${i}. Đây là bài viết mẫu được tạo tự động từ seeder.`,
            thumbnail_path: null,
            user_id: null,
            created_at: new Date(),
            updated_at: new Date()
        });
    }
    
    await queryInterface.bulkInsert('posts', posts, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('posts', null, {});
  }
};
