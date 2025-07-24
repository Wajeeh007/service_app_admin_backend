'use strict';
const roleNames = require('../utils/role_names.js')

module.exports = {
  async up(queryInterface, Sequelize) {
    
    const systemRoles = [
      {
        id: roles.customer,
        name: roleNames.customerRole,
        desc: 'Customer who uses the mobile app to book services',
        is_admin_role: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: roles.serviceman,
        name: roleNames.servicemanRole,
        desc: 'Service provider who fulfills customer requests',
        is_admin_role: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: roles.super_admin,
        name: roleNames.superAdminRole,
        desc: 'Administrator with access to admin panel',
        is_admin_role: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: roles.user_admin,
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