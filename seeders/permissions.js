'use strict';
const { uuidToBuffer, permissions } = require('../utils/seed_uuid_map');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permissions', [
      { id: uuidToBuffer(permissions.view_users), name: 'view_users', created_at: new Date(), updated_at: new Date() },
      { id: uuidToBuffer(permissions.edit_users), name: 'edit_users', created_at: new Date(), updated_at: new Date() },
      { id: uuidToBuffer(permissions.delete_users), name: 'delete_users', created_at: new Date(), updated_at: new Date() },
      { id: uuidToBuffer(permissions.access_reports), name: 'access_reports', created_at: new Date(), updated_at: new Date() }
    ], {});

    console.log(`✓ Seeded Permissions`);
  },

  
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};