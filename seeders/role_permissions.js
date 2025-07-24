'use strict';
const { roles, permissions } = require('../utils/seed_uuid_map');

module.exports = {
  async up(queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('role_permissions', [
      { role_id: roles.super_admin, permission_id: permissions.view_users},
      { role_id: roles.user_admin, permission_id: permissions.edit_users},
    //   { role_id: uuidToBuffer(roles.editor), permission_id: uuidToBuffer(permissions.view_users)},
    //   { role_id: uuidToBuffer(roles.viewer), permission_id: uuidToBuffer(permissions.view_users)}
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role_permissions', null, {});
  }
};
