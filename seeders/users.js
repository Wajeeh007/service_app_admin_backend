'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('Seeding Users')
    const saltRounds = 10;
    const defaultPassword = await bcrypt.hash('12345678', saltRounds);
    
    const users = [
      {
        id: uuidv4(),
        email: 'super.admin@example.com',
        phone: '+1234567890',
        password_hash: defaultPassword,
        name: 'Super Admin',
        email_verified_at: new Date(),
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        email: 'user.admin@example.com',
        phone: '+1234567891',
        password_hash: defaultPassword,
        name: 'Admin',
        email_verified_at: new Date(),
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        email: 'customer1@example.com',
        phone: '+1234567892',
        password_hash: defaultPassword,
        name: 'Customer',
        email_verified_at: new Date(),
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        email: 'customer2@example.com',
        phone: '+1234567893',
        password_hash: defaultPassword,
        name: 'Customer',
        email_verified_at: new Date(),
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        email: 'serviceman1@example.com',
        phone: '+1234567894',
        password_hash: defaultPassword,
        name: 'Service',
        email_verified_at: new Date(),
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        email: 'serviceman2@example.com',
        phone: '+1234567895',
        password_hash: defaultPassword,
        name: 'Service',
        email_verified_at: new Date(),
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        email: 'dual.role@example.com',
        phone: '+1234567896',
        password_hash: defaultPassword,
        name: 'Dual',
        email_verified_at: new Date(),
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    await queryInterface.bulkInsert('users', users, {});
    console.log(`✓ Seeded ${users} users`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};