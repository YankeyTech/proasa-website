const db = require('../config/db');

async function findByUsername(username) {
  const [rows] = await db.query('SELECT * FROM admins WHERE username = ? LIMIT 1', [username]);
  return rows[0] || null;
}

async function create(username, passwordHash) {
  const [result] = await db.query(
    'INSERT INTO admins (username, password_hash) VALUES (?, ?)',
    [username, passwordHash]
  );
  return result.insertId;
}

module.exports = { findByUsername, create };
