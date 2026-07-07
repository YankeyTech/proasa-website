const db = require('../config/db');

async function getAll(category) {
  if (category) {
    const [rows] = await db.query(
      'SELECT * FROM committee_members WHERE category = ? ORDER BY sort_order ASC, id ASC',
      [category]
    );
    return rows;
  }
  const [rows] = await db.query('SELECT * FROM committee_members ORDER BY category ASC, sort_order ASC, id ASC');
  return rows;
}

async function getById(id) {
  const [rows] = await db.query('SELECT * FROM committee_members WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create({ name, role, category, photo_url, sort_order }) {
  const [result] = await db.query(
    'INSERT INTO committee_members (name, role, category, photo_url, sort_order) VALUES (?, ?, ?, ?, ?)',
    [name, role, category || 'judicial', photo_url || null, sort_order || 0]
  );
  return result.insertId;
}

async function update(id, { name, role, category, photo_url, sort_order }) {
  if (photo_url) {
    await db.query(
      'UPDATE committee_members SET name = ?, role = ?, category = ?, photo_url = ?, sort_order = ? WHERE id = ?',
      [name, role, category || 'judicial', photo_url, sort_order || 0, id]
    );
  } else {
    await db.query(
      'UPDATE committee_members SET name = ?, role = ?, category = ?, sort_order = ? WHERE id = ?',
      [name, role, category || 'judicial', sort_order || 0, id]
    );
  }
}

async function remove(id) {
  await db.query('DELETE FROM committee_members WHERE id = ?', [id]);
}

module.exports = { getAll, getById, create, update, remove };
