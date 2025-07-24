'use strict';
const { permissions } = require('../utils/seed_uuid_map');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permissions', [
      { id: permissions.view_users, name: 'view_users', created_at: new Date(), updated_at: new Date() },
      { id: permissions.edit_users, name: 'edit_users', created_at: new Date(), updated_at: new Date() },
      { id: permissions.delete_users, name: 'delete_users', created_at: new Date(), updated_at: new Date() },
      { id: permissions.access_reports, name: 'access_reports', created_at: new Date(), updated_at: new Date() }
    ], {});

    console.log(`✓ Seeded Permissions`);
  },

  
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};