const permissionsSeeder = require('./permissions.js')
const rolesSeeder = require('./roles.js')
const usersSeeder = require('./users.js')
const userRolesSeeder = require('./user_roles.js')
const rolePermissionsSeeder = require('./role_permissions.js')
const profilesSeeder = require('./profiles.js')

module.exports = {
    async up(queryInterface, Sequelize) {
        await permissionsSeeder.up(queryInterface, Sequelize)
        await rolesSeeder.up(queryInterface, Sequelize)
        await usersSeeder.up(queryInterface, Sequelize)
        await userRolesSeeder.up(queryInterface, Sequelize)
        await rolePermissionsSeeder.up(queryInterface, Sequelize)
        await profilesSeeder.up(queryInterface, Sequelize)
    },
    async down(queryInterface, Sequelize) {
        await profilesSeeder.down(queryInterface, Sequelize)
        await rolePermissionsSeeder.down(queryInterface, Sequelize)
        await userRolesSeeder.down(queryInterface, Sequelize)
        await usersSeeder.down(queryInterface, Sequelize)
        await permissionsSeeder.down(queryInterface, Sequelize)
        await rolesSeeder.down(queryInterface, Sequelize)

    }

}