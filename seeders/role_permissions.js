'use strict';
const { uuidToBuffer, roles, permissions } = require('../utils/seed_uuid_map');

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('Seeding Role Permissions')
    await queryInterface.bulkInsert('role_permissions', [
      { role_id: uuidToBuffer(roles.super_admin), permission_id: uuidToBuffer(permissions.view_users)},
      { role_id: uuidToBuffer(roles.user_admin), permission_id: uuidToBuffer(permissions.edit_users)},
    //   { role_id: uuidToBuffer(roles.editor), permission_id: uuidToBuffer(permissions.view_users)},
    //   { role_id: uuidToBuffer(roles.viewer), permission_id: uuidToBuffer(permissions.view_users)}
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role_permissions', null, {});
  }
};
