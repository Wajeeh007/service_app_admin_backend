require('dotenv').config()
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(`mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASSWORD}@localhost:3306/${process.env.MYSQL_DB}`) 

module.exports = sequelize