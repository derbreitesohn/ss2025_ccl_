require('dotenv').config();
const mysql = require('mysql2');

const config = mysql.createPool({
    host: 'atp.fhstp.ac.at',
    port: 8007,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "cc241045",

    // Nur die wichtigsten Optionen
    connectionLimit: 10,
    waitForConnections: true,
    reconnect: true
});

config.on('error', function(err) {
    console.error('Database error:', err);
});

console.log('🎉 Database pool created successfully!');

module.exports = {config};