const mysql = require('mysql');

let db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWD,
    database: process.env.DB
})

module.exports = db;
