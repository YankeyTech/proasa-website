const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const adminModel = require('../models/admin');
const { redirectIfLoggedIn } = require('../middleware/auth');

router.get('/login', redirectIfLoggedIn, (req, res) => {
  res.render('admin/login', { title: 'Admin Login — ProASA' });
});

router.post('/login', redirectIfLoggedIn, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      req.flash('error', 'Enter both username and password.');
      return res.redirect('/admin/login');
    }

    const admin = await adminModel.findByUsername(username.trim());
    if (!admin) {
      req.flash('error', 'Incorrect username or password.');
      return res.redirect('/admin/login');
    }

    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) {
      req.flash('error', 'Incorrect username or password.');
      return res.redirect('/admin/login');
    }

    req.session.adminId = admin.id;
    req.session.adminUsername = admin.username;
    req.flash('success', `Welcome back, ${admin.username}.`);
    res.redirect('/admin/dashboard');
  } catch (err) {
    next(err);
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

module.exports = router;
