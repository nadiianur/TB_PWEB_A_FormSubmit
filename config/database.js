//ini adalah database

const sequalize = require('sequelize')

const db = new sequalize('formsubmit', 'root', '', {
    host    : "localhost",
    dialect : "mysql"
})

module.exports = db