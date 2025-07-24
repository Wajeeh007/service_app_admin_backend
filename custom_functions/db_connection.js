require('dotenv').config()
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(`mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:3306/${process.env.DB_NAME}`) 

module.exports = sequelize