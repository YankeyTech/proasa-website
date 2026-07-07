const db = require('../config/db');

async function findByUsername(username) {
  const [rows] = await db.query('SELECT * FROM admins WHERE username = ? LIMIT 1', [username]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await db.query('SELECT * FROM admins WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function create(username, passwordHash, role = 'editor') {
  const [result] = await db.query(
    'INSERT INTO admins (username, password_hash, role) VALUES (?, ?, ?)',
    [username, passwordHash, role]
  );
  return result.insertId;
}

async function getAll() {
  const [rows] = await db.query('SELECT id, username, role, created_at FROM admins ORDER BY created_at ASC');
  return rows;
}

async function remove(id) {
  await db.query('DELETE FROM admins WHERE id = ?', [id]);
}

module.exports = { findByUsername, findById, create, getAll, remove };