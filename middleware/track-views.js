const analytics = require('../models/analytics');

module.exports = function trackPageView(req, res, next) {
  if (req.method === 'GET') {
    analytics.logView(req.path).catch((err) => {
      console.error('Failed to log page view:', err.message);
    });
  }
  next();
};