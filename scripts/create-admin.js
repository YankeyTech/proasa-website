// Creates (or resets the password of) the admin account defined in your .env file.
// Usage: npm run create-admin
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const adminModel = require('../models/admin');

async function main() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.error('Set ADMIN_USERNAME and ADMIN_PASSWORD in your .env file first.');
    process.exit(1);
  }

  const existing = await adminModel.findByUsername(username);
  const hash = await bcrypt.hash(password, 12);

  if (existing) {
    await db.query('UPDATE admins SET password_hash = ? WHERE username = ?', [hash, username]);
    console.log(`Password updated for existing admin "${username}".`);
  } else {
    await adminModel.create(username, hash);
    console.log(`Admin account "${username}" created.`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
