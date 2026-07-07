function requireLogin(req, res, next) {
  if (req.session && req.session.adminId) {
    return next();
  }
  req.flash('error', 'Please log in to continue.');
  return res.redirect('/admin/login');
}

function redirectIfLoggedIn(req, res, next) {
  if (req.session && req.session.adminId) {
    return res.redirect('/admin/dashboard');
  }
  next();
}

function requireOwner(req, res, next) {
  if (req.session && req.session.adminRole === 'owner') {
    return next();
  }
  req.flash('error', 'Only the account owner can do that.');
  return res.redirect('/admin/dashboard');
}

module.exports = { requireLogin, redirectIfLoggedIn, requireOwner };