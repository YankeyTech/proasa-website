const mysql = require('mysql2/promise');
require('dotenv').config();

// Aiven MySQL requires an SSL connection. mysql2 will use the system/CA
// trust store by default, which works fine with Aiven's certificates.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'false' ? undefined : { rejectUnauthorized: true }
});

module.exports = pool;
