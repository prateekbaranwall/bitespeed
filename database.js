const mysql = require('mysql2')
const dotenv=require('dotenv')
dotenv.config()

module.exports = mysql.createConnection({
    host: process.env.SQL_SERVER,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: 'bitespeed'
})