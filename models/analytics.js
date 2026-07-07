const db = require('../config/db');

module.exports = {
  async logView(path) {
    await db.query('INSERT INTO page_views (path) VALUES (?)', [path]);
  },
  async getTotalViews() {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM page_views');
    return rows[0].total;
  },
  async getViewsToday() {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM page_views WHERE created_at >= CURDATE()');
    return rows[0].total;
  },
  async getViewsThisWeek() {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM page_views WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)');
    return rows[0].total;
  },
  async getTopPages() {
    const [rows] = await db.query(
      'SELECT path, COUNT(*) AS views FROM page_views GROUP BY path ORDER BY views DESC LIMIT 5'
    );
    return rows;
  }
};