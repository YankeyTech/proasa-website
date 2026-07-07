require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');

const db = require('./config/db');
const publicRoutes = require('./routes/public');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();

// ---------- View engine ----------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---------- Core middleware ----------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Sessions (persisted in MySQL so logins survive restarts) ----------
const sessionStore = new MySQLStore({}, db);

app.use(
  session({
    key: 'proasa_session',
    secret: process.env.SESSION_SECRET || 'insecure-dev-secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true
    }
  })
);

app.use(flash());

// Make flash messages + current admin available to every view
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.isLoggedIn = !!(req.session && req.session.adminId);
  res.locals.adminUsername = req.session ? req.session.adminUsername : null;
  res.locals.currentPath = req.path;
  next();
});

// ---------- Routes ----------
app.use('/admin', authRoutes);
app.use('/admin', adminRoutes);
app.use('/', publicRoutes);

// ---------- 404 ----------
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page not found' });
});

// ---------- Error handler ----------
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('500', { title: 'Something went wrong', error: err });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ProASA website running on port ${PORT}`);
});
