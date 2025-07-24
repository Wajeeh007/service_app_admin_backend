'use strict';
const { v4: uuidv4 } = require('uuid');
const roleNames = require('../utils/role_names.js')
const uuidConverter = require('../custom_functions/uuid_to_binary_converter.js')

module.exports = {
  async up(queryInterface, Sequelize) {
    // Get users for profile creation

    console.log('Seeding Profiles')
    const users = await queryInterface.sequelize.query(
      'SELECT id, email FROM users',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const systemRoles = await queryInterface.sequelize.query(
      'SELECT id, name FROM roles',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const userMap = {};
    users.forEach(user => {
      userMap[user.email] = user.id;
    });

    const systemRolesMap = {};
    systemRoles.forEach(systemRole => {
      systemRolesMap[systemRole.name] = systemRole.id;
    });

    // Admin ProfilesA
    const adminProfiles = [
      {
        id: uuidConverter(uuidv4()),
        user_id: userMap['super.admin@example.com'],
        role_id: systemRolesMap[roleNames.superAdminRole],
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidConverter(uuidv4()),
        user_id: userMap['user.admin@example.com'],
        role_id: systemRolesMap[roleNames.userAdminRole],
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Customer Profiles
    const customerProfiles = [
      {
        id: uuidConverter(uuidv4()),
        user_id: userMap['customer1@example.com'],
        preferences: JSON.stringify({
          notifications: true,
          preferred_service_time: 'morning',
          communication_method: 'email'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidConverter(uuidv4()),
        user_id: userMap['customer2@example.com'],
        preferences: JSON.stringify({
          notifications: false,
          preferred_service_time: 'evening',
          communication_method: 'sms'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidConverter(uuidv4()),
        user_id: userMap['dual.role@example.com'],
        preferences: JSON.stringify({
          notifications: true,
          preferred_service_time: 'afternoon'
        }),
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Serviceman Profiles
    const servicemanProfiles = [
      {
        id: uuidConverter(uuidv4()),
        user_id: userMap['serviceman1@example.com'],
        services: JSON.stringify(['plumbing', 'electrical']),
        total_orders: 127,
        availability: 1,
        identification_number: '123456789',
        created_at: new Date(),
        updated_at: new Date()
      },
    //   {
    //     id: uuidConverter(uuidv4()),
    //     user_id: userMap['serviceman2@example.com'],
    //     services: JSON.stringify(['cleaning', 'maintenance']),
    //     total_orders: 89,
    //     availability: 1,
    //     created_at: new Date(),
    //     updated_at: new Date()
    //   },
      {
        id: uuidConverter(uuidv4()),
        user_id: userMap['dual.role@example.com'],
        services: JSON.stringify(['handyman', 'repairs']),
        total_orders: 45,
        availability: 0,
        identification_number: '123456789',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Insert all profiles
    await queryInterface.bulkInsert('admin_profiles', adminProfiles, {});
    await queryInterface.bulkInsert('customer_profiles', customerProfiles, {});
    await queryInterface.bulkInsert('serviceman_profiles', servicemanProfiles, {});

    console.log(`✓ Seeded ${adminProfiles.length} admin profiles`);
    console.log(`✓ Seeded ${customerProfiles.length} customer profiles`);
    console.log(`✓ Seeded ${servicemanProfiles.length} serviceman profiles`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('admin_profiles', null, {});
    await queryInterface.bulkDelete('customer_profiles', null, {});
    await queryInterface.bulkDelete('serviceman_profiles', null, {});
  }
};