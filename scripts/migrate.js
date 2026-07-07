// Creates the target database if it doesn't exist yet, then runs
// sql/schema.sql against it.
// Usage: npm run migrate
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const db = require('../config/db');

async function ensureDatabaseExists() {
  const dbName = process.env.DB_NAME;
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'false' ? undefined : { rejectUnauthorized: false }
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  console.log(`Database "${dbName}" is ready (created if it didn't already exist).`);
  await connection.end();
}

async function main() {
  await ensureDatabaseExists();

  const sqlPath = path.join(__dirname, '..', 'sql', 'schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const statement of statements) {
    await db.query(statement);
  }

  console.log(`Ran ${statements.length} statements. Database is ready.`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});