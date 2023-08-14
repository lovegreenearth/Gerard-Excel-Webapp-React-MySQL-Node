const mysql = require('mysql2');
require('dotenv').config();

/* This is creating a connection to the database. */

// var config_db = {
//       // Host name for database connection:
//       host: 'db-mysql-nyc1-71256-do-user-14497985-0.b.db.ondigitalocean.com',
//       // Port number for database connection:
//       port: 25060,
//       // Database user:
//       user: 'doadmin',
//       // Password for the above database user:
//       password: 'AVNS_9O3tKO6NcswIT5v-eMK',
//       // Database name:
//       database: 'defaultdb',
//       waitForConnections: true,
//       connectionLimit: 10,
//       queueLimit: 0
// };

var config_db = {
      // Host name for database connection:
      host: 'localhost',
      // Port number for database connection:
      port: 3306,
      // Database user:
      user: 'root',
      // Password for the above database user:
      password: '',
      // Database name:
      database: 'excel-price',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
};

var db = mysql.createPool(config_db); // or mysql.createConnection(config_db);

/* This is creating a connection to the database. */
db.getConnection((err, connection) => {
      if (err) throw err;
      console.log('🗃  DB connected successful: ' + connection.threadId);
      connection.release();
});

module.exports = db;