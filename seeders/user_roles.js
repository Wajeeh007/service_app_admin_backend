'use strict';
const { v4: uuidv4 } = require('uuid');
const roleNames = require('../utils/role_names.js')

module.exports = {
  async up(queryInterface, Sequelize) {
    
    const users = await queryInterface.sequelize.query(
      'SELECT id, email FROM users',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const roles = await queryInterface.sequelize.query(
      'SELECT id, name FROM roles',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Create lookup maps
    const userMap = {};
    const roleMap = {};
    
    users.forEach(user => {
      userMap[user.email] = user.id;
    });
    
    roles.forEach(role => {
      roleMap[role.name] = role.id;
    });

    const superAdminId = userMap['super.admin@example.com'];

    const userRoles = [
      // Super Admin
      {
        id: uuidv4(),
        user_id: userMap['super.admin@example.com'],
        role_id: roleMap[roleNames.superAdminRole],
        assigned_by: superAdminId,
        assigned_at: new Date()
      },
      
      // User Admin
      {
        id: uuidv4(),
        user_id: userMap['user.admin@example.com'],
        role_id: roleMap[roleNames.userAdminRole],
        assigned_by: superAdminId,
        assigned_at: new Date()
      },
      
      // Customers
      {
        id: uuidv4(),
        user_id: userMap['customer1@example.com'],
        role_id: roleMap[roleNames.customerRole],
        assigned_by: superAdminId,
        assigned_at: new Date()
      },
      {
        id: uuidv4(),
        user_id: userMap['customer2@example.com'],
        role_id: roleMap[roleNames.customerRole],
        assigned_by: superAdminId,
        assigned_at: new Date()
      },
      
      // Servicemen
      {
        id: uuidv4(),
        user_id: userMap['serviceman1@example.com'],
        role_id: roleMap[roleNames.servicemanRole],
        assigned_by: superAdminId,
        assigned_at: new Date()
      },
      {
        id: uuidv4(),
        user_id: userMap['serviceman2@example.com'],
        role_id: roleMap[roleNames.servicemanRole],
        assigned_by: superAdminId,
        assigned_at: new Date()
      },
    ];

    await queryInterface.bulkInsert('user_roles', userRoles, {});
    console.log(`✓ Seeded ${userRoles.length} user role assignments`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_roles', null, {});
  }
};