var mysql = require('mysql');

var connection = mysql.createPool({
    connectionLimit: 100,
    host:'localhost',
    user:'username',
    password:'password',
    database:'dbname',
    port: 3306,
    debug: false,
    multipleStatements: true
});

module.exports.connection = connection;