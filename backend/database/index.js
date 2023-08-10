const mysql = require('mysql');
require('dotenv').config();

/* This is creating a connection to the database. */

var config_db = {
      // Host name for database connection:
      host: 'db-mysql-nyc1-71256-do-user-14497985-0.b.db.ondigitalocean.com',
      // Port number for database connection:
      port: 25060,
      // Database user:
      user: 'doadmin',
      // Password for the above database user:
      password: 'AVNS_9O3tKO6NcswIT5v-eMK',
      // Database name:
      database: 'defaultdb'
};

var db = mysql.createPool(config_db); // or mysql.createConnection(config_db);

/* This is creating a connection to the database. */
db.getConnection((err, connection) => {
      if (err) throw err;
      console.log('🗃  DB connected successful: ' + connection.threadId);
      connection.release();
});

module.exports = db;
