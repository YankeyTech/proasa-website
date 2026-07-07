const db = require('../config/db');

async function getAll() {
  const [rows] = await db.query('SELECT * FROM department_heads ORDER BY sort_order ASC, id ASC');
  return rows;
}

async function getById(id) {
  const [rows] = await db.query('SELECT * FROM department_heads WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create({ name, title, bio, photo_url, sort_order }) {
  const [result] = await db.query(
    'INSERT INTO department_heads (name, title, bio, photo_url, sort_order) VALUES (?, ?, ?, ?, ?)',
    [name, title, bio || null, photo_url || null, sort_order || 0]
  );
  return result.insertId;
}

async function update(id, { name, title, bio, photo_url, sort_order }) {
  if (photo_url) {
    await db.query(
      'UPDATE department_heads SET name = ?, title = ?, bio = ?, photo_url = ?, sort_order = ? WHERE id = ?',
      [name, title, bio || null, photo_url, sort_order || 0, id]
    );
  } else {
    await db.query(
      'UPDATE department_heads SET name = ?, title = ?, bio = ?, sort_order = ? WHERE id = ?',
      [name, title, bio || null, sort_order || 0, id]
    );
  }
}

async function remove(id) {
  await db.query('DELETE FROM department_heads WHERE id = ?', [id]);
}

module.exports = { getAll, getById, create, update, remove };
