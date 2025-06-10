require('dotenv').config(); // Load environment variables from a .env file into process.env

const mysql = require('mysql2');

const config = mysql.createConnection({
    host: 'atp.fhstp.ac.at', // Database server host
    port: 8007, // Port number for the database
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "cc241045",
});
// Connect to the database and handle connection errors
config.connect(function(err){
    if (err) throw err;
    console.log('Connected to the database');
});

module.exports = {config};