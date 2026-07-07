// Runs sql/schema.sql against your Aiven MySQL database.
// Usage: npm run migrate
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function main() {
  const sqlPath = path.join(__dirname, '..', 'sql', 'schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  // Split on semicolons that end a statement (schema.sql has no semicolons inside strings)
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
