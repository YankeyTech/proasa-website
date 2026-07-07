const db = require('../config/db');

async function getBySlug(slug) {
  const [rows] = await db.query('SELECT * FROM site_pages WHERE slug = ? LIMIT 1', [slug]);
  return rows[0] || null;
}

async function update(slug, title, content) {
  await db.query(
    `INSERT INTO site_pages (slug, title, content) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE title = VALUES(title), content = VALUES(content)`,
    [slug, title, content]
  );
}

module.exports = { getBySlug, update };
