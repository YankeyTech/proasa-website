const db = require('../config/db');
const slugify = require('slugify');

async function getPublished(limit) {
  const sql = 'SELECT * FROM news WHERE is_published = 1 ORDER BY created_at DESC' + (limit ? ' LIMIT ?' : '');
  const params = limit ? [limit] : [];
  const [rows] = await db.query(sql, params);
  return rows;
}

async function getAllForAdmin() {
  const [rows] = await db.query('SELECT * FROM news ORDER BY created_at DESC');
  return rows;
}

async function getBySlug(slug) {
  const [rows] = await db.query('SELECT * FROM news WHERE slug = ? LIMIT 1', [slug]);
  return rows[0] || null;
}

async function getById(id) {
  const [rows] = await db.query('SELECT * FROM news WHERE id = ?', [id]);
  return rows[0] || null;
}

async function makeUniqueSlug(title, excludeId) {
  const base = slugify(title, { lower: true, strict: true }).slice(0, 200) || 'post';
  let slug = base;
  let i = 1;
  while (true) {
    const [rows] = await db.query(
      'SELECT id FROM news WHERE slug = ? AND id != ? LIMIT 1',
      [slug, excludeId || 0]
    );
    if (rows.length === 0) return slug;
    i += 1;
    slug = `${base}-${i}`;
  }
}

async function create({ title, summary, content, image_url, is_published, created_by }) {
  const slug = await makeUniqueSlug(title);
  const [result] = await db.query(
    'INSERT INTO news (title, slug, summary, content, image_url, is_published, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, slug, summary || null, content, image_url || null, is_published ? 1 : 0, created_by || null]
  );
  return result.insertId;
}

async function update(id, { title, summary, content, image_url, is_published }) {
  const slug = await makeUniqueSlug(title, id);
  if (image_url) {
    await db.query(
      'UPDATE news SET title = ?, slug = ?, summary = ?, content = ?, image_url = ?, is_published = ? WHERE id = ?',
      [title, slug, summary || null, content, image_url, is_published ? 1 : 0, id]
    );
  } else {
    await db.query(
      'UPDATE news SET title = ?, slug = ?, summary = ?, content = ?, is_published = ? WHERE id = ?',
      [title, slug, summary || null, content, is_published ? 1 : 0, id]
    );
  }
}

async function remove(id) {
  await db.query('DELETE FROM news WHERE id = ?', [id]);
}

module.exports = { getPublished, getAllForAdmin, getBySlug, getById, create, update, remove };
