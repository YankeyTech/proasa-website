const express = require('express');
const router = express.Router();

const { requireLogin } = require('../middleware/auth');
const upload = require('../middleware/upload');

const newsModel = require('../models/news');
const galleryModel = require('../models/gallery');
const headsModel = require('../models/heads');
const committeeModel = require('../models/committee');
const pagesModel = require('../models/pages');
const analyticsModel = require('../models/analytics');
const adminModel = require('../models/admin');
const bcrypt = require('bcryptjs');
const { requireOwner } = require('../middleware/auth');

router.use(requireLogin);

// ---------- Dashboard ----------
router.get('/dashboard', async (req, res, next) => {
  try {
    const [allNews, allGallery, allHeads, allCommittee, totalViews, viewsToday, viewsWeek, topPages] = await Promise.all([
      newsModel.getAllForAdmin(),
      galleryModel.getAll(),
      headsModel.getAll(),
      committeeModel.getAll(),
      analyticsModel.getTotalViews(),
      analyticsModel.getViewsToday(),
      analyticsModel.getViewsThisWeek(),
      analyticsModel.getTopPages()
    ]);
    res.render('admin/dashboard', {
      title: 'Admin Dashboard â€” ProASA',
      counts: {
        news: allNews.length,
        gallery: allGallery.length,
        heads: allHeads.length,
        committee: allCommittee.length
      },
      recentNews: allNews.slice(0, 5),
      analytics: { totalViews, viewsToday, viewsWeek, topPages }
    });
  } catch (err) {
    next(err);
  }
});
// ---------- News ----------
router.get('/news', async (req, res, next) => {
  try {
    const items = await newsModel.getAllForAdmin();
    res.render('admin/news-list', { title: 'Manage News — ProASA', items });
  } catch (err) {
    next(err);
  }
});

router.get('/news/new', (req, res) => {
  res.render('admin/news-form', { title: 'New Article — ProASA', article: null });
});

router.post('/news/new', upload.single('image'), async (req, res, next) => {
  try {
    const { title, summary, content, is_published } = req.body;
    if (!title || !content) {
      req.flash('error', 'Title and content are required.');
      return res.redirect('/admin/news/new');
    }
    await newsModel.create({
      title,
      summary,
      content,
      image_url: req.file ? req.file.path : null,
      is_published: is_published === 'on',
      created_by: req.session.adminId
    });
    req.flash('success', 'Article published.');
    res.redirect('/admin/news');
  } catch (err) {
    next(err);
  }
});

router.get('/news/:id/edit', async (req, res, next) => {
  try {
    const article = await newsModel.getById(req.params.id);
    if (!article) {
      req.flash('error', 'Article not found.');
      return res.redirect('/admin/news');
    }
    res.render('admin/news-form', { title: 'Edit Article — ProASA', article });
  } catch (err) {
    next(err);
  }
});

router.post('/news/:id/edit', upload.single('image'), async (req, res, next) => {
  try {
    const { title, summary, content, is_published } = req.body;
    await newsModel.update(req.params.id, {
      title,
      summary,
      content,
      image_url: req.file ? req.file.path : null,
      is_published: is_published === 'on'
    });
    req.flash('success', 'Article updated.');
    res.redirect('/admin/news');
  } catch (err) {
    next(err);
  }
});

router.post('/news/:id/delete', async (req, res, next) => {
  try {
    await newsModel.remove(req.params.id);
    req.flash('success', 'Article deleted.');
    res.redirect('/admin/news');
  } catch (err) {
    next(err);
  }
});

// ---------- Gallery ----------
router.get('/gallery', async (req, res, next) => {
  try {
    const items = await galleryModel.getAll();
    res.render('admin/gallery-list', { title: 'Manage Gallery — ProASA', items });
  } catch (err) {
    next(err);
  }
});

router.post('/gallery/new', upload.single('media'), async (req, res, next) => {
  try {
    if (!req.file) {
      req.flash('error', 'Choose a photo or video to upload.');
      return res.redirect('/admin/gallery');
    }
    const { title, caption } = req.body;
    const media_type = req.file.mimetype.startsWith('video') ? 'video' : 'image';
    await galleryModel.create({ title, caption, media_url: req.file.path, media_type });
    req.flash('success', 'Media added to gallery.');
    res.redirect('/admin/gallery');
  } catch (err) {
    next(err);
  }
});

router.post('/gallery/:id/delete', async (req, res, next) => {
  try {
    await galleryModel.remove(req.params.id);
    req.flash('success', 'Media removed.');
    res.redirect('/admin/gallery');
  } catch (err) {
    next(err);
  }
});

// ---------- Department Heads ----------
router.get('/heads', async (req, res, next) => {
  try {
    const items = await headsModel.getAll();
    res.render('admin/heads-list', { title: 'Manage Department Heads — ProASA', items });
  } catch (err) {
    next(err);
  }
});

router.post('/heads/new', upload.single('photo'), async (req, res, next) => {
  try {
    const { name, title, bio, sort_order } = req.body;
    await headsModel.create({
      name,
      title,
      bio,
      sort_order,
      photo_url: req.file ? req.file.path : null
    });
    req.flash('success', 'Department head added.');
    res.redirect('/admin/heads');
  } catch (err) {
    next(err);
  }
});

router.post('/heads/:id/edit', upload.single('photo'), async (req, res, next) => {
  try {
    const { name, title, bio, sort_order } = req.body;
    await headsModel.update(req.params.id, {
      name,
      title,
      bio,
      sort_order,
      photo_url: req.file ? req.file.path : null
    });
    req.flash('success', 'Department head updated.');
    res.redirect('/admin/heads');
  } catch (err) {
    next(err);
  }
});

router.post('/heads/:id/delete', async (req, res, next) => {
  try {
    await headsModel.remove(req.params.id);
    req.flash('success', 'Department head removed.');
    res.redirect('/admin/heads');
  } catch (err) {
    next(err);
  }
});

// ---------- Committee Members ----------
router.get('/committee', async (req, res, next) => {
  try {
    const items = await committeeModel.getAll();
    res.render('admin/committee-list', { title: 'Manage Committee Members — ProASA', items });
  } catch (err) {
    next(err);
  }
});

router.post('/committee/new', upload.single('photo'), async (req, res, next) => {
  try {
    const { name, role, category, sort_order } = req.body;
    await committeeModel.create({
      name,
      role,
      category,
      sort_order,
      photo_url: req.file ? req.file.path : null
    });
    req.flash('success', 'Committee member added.');
    res.redirect('/admin/committee');
  } catch (err) {
    next(err);
  }
});

router.post('/committee/:id/edit', upload.single('photo'), async (req, res, next) => {
  try {
    const { name, role, category, sort_order } = req.body;
    await committeeModel.update(req.params.id, {
      name,
      role,
      category,
      sort_order,
      photo_url: req.file ? req.file.path : null
    });
    req.flash('success', 'Committee member updated.');
    res.redirect('/admin/committee');
  } catch (err) {
    next(err);
  }
});

router.post('/committee/:id/delete', async (req, res, next) => {
  try {
    await committeeModel.remove(req.params.id);
    req.flash('success', 'Committee member removed.');
    res.redirect('/admin/committee');
  } catch (err) {
    next(err);
  }
});

// ---------- Pages: About & Constitution ----------
router.get('/pages/:slug', async (req, res, next) => {
  try {
    const slug = req.params.slug;
    if (!['about', 'constitution'].includes(slug)) {
      return res.status(404).render('404', { title: 'Not found' });
    }
    const page = await pagesModel.getBySlug(slug);
    res.render('admin/page-form', { title: `Edit ${slug} — ProASA`, page, slug });
  } catch (err) {
    next(err);
  }
});

router.post('/pages/:slug', async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const { title, content } = req.body;
    await pagesModel.update(slug, title, content);
    req.flash('success', 'Page updated.');
    res.redirect(`/admin/pages/${slug}`);
  } catch (err) {
    next(err);
  }
});

// ---------- Manage Admins (owner only) ----------
router.get('/admins', requireOwner, async (req, res, next) => {
  try {
    const admins = await adminModel.getAll();
    res.render('admin/admins-list', { title: 'Manage Admins — ProASA', admins });
  } catch (err) {
    next(err);
  }
});

router.post('/admins/new', requireOwner, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      req.flash('error', 'Username and password are required.');
      return res.redirect('/admin/admins');
    }
    const existing = await adminModel.findByUsername(username.trim());
    if (existing) {
      req.flash('error', 'That username is already taken.');
      return res.redirect('/admin/admins');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await adminModel.create(username.trim(), passwordHash, 'editor');
    req.flash('success', `Admin "${username}" created.`);
    res.redirect('/admin/admins');
  } catch (err) {
    next(err);
  }
});

router.post('/admins/:id/delete', requireOwner, async (req, res, next) => {
  try {
    const targetId = parseInt(req.params.id, 10);
    if (targetId === req.session.adminId) {
      req.flash('error', 'You cannot remove your own account while logged in as it.');
      return res.redirect('/admin/admins');
    }
    await adminModel.remove(targetId);
    req.flash('success', 'Admin removed.');
    res.redirect('/admin/admins');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
