'use strict';
const { uuidToBuffer, roles } = require('../utils/seed_uuid_map.js');
const roleNames = require('../utils/role_names.js')

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('Seeding Roles')
    const systemRoles = [
      {
        id: uuidToBuffer(roles.customer),
        name: roleNames.customerRole,
        desc: 'Customer who uses the mobile app to book services',
        is_admin_role: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidToBuffer(roles.serviceman),
        name: roleNames.servicemanRole,
        desc: 'Service provider who fulfills customer requests',
        is_admin_role: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidToBuffer(roles.super_admin),
        name: roleNames.superAdminRole,
        desc: 'Administrator with access to admin panel',
        is_admin_role: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidToBuffer(roles.user_admin),
        name: roleNames.userAdminRole,
        desc: 'Admin with permissions to manage users and employees only',
        is_admin_role: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
    ];

    await queryInterface.bulkInsert('roles', systemRoles, {});
    console.log(`✓ Seeded ${systemRoles.length} roles`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};