const db = require('../config/db');

async function getAll() {
  const [rows] = await db.query('SELECT * FROM gallery ORDER BY created_at DESC');
  return rows;
}

async function getById(id) {
  const [rows] = await db.query('SELECT * FROM gallery WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create({ title, media_url, media_type, caption }) {
  const [result] = await db.query(
    'INSERT INTO gallery (title, media_url, media_type, caption) VALUES (?, ?, ?, ?)',
    [title || null, media_url, media_type, caption || null]
  );
  return result.insertId;
}

async function remove(id) {
  await db.query('DELETE FROM gallery WHERE id = ?', [id]);
}

module.exports = { getAll, getById, create, remove };
