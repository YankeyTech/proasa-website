const express = require('express');
const router = express.Router();

const heads = require('../models/heads');
const committee = require('../models/committee');
const news = require('../models/news');
const gallery = require('../models/gallery');
const pages = require('../models/pages');

// Home
router.get('/', async (req, res, next) => {
  try {
    const [deptHeads, latestNews, galleryPreview] = await Promise.all([
      heads.getAll(),
      news.getPublished(3),
      gallery.getAll()
    ]);
    res.render('index', {
      title: 'ProASA — Professional Administrative Students Association',
      deptHeads,
      latestNews,
      galleryPreview: galleryPreview.slice(0, 6)
    });
  } catch (err) {
    next(err);
  }
});

// About (department info + judicial committee)
router.get('/about', async (req, res, next) => {
  try {
    const [aboutPage, judicialMembers, execMembers] = await Promise.all([
      pages.getBySlug('about'),
      committee.getAll('judicial'),
      committee.getAll('executive')
    ]);
    res.render('about', {
      title: 'About Us — ProASA',
      aboutPage,
      judicialMembers,
      execMembers
    });
  } catch (err) {
    next(err);
  }
});

// Constitution
router.get('/constitution', async (req, res, next) => {
  try {
    const page = await pages.getBySlug('constitution');
    res.render('constitution', { title: 'Constitution — ProASA', page });
  } catch (err) {
    next(err);
  }
});

// Gallery
router.get('/gallery', async (req, res, next) => {
  try {
    const items = await gallery.getAll();
    res.render('gallery', { title: 'Gallery — ProASA', items });
  } catch (err) {
    next(err);
  }
});

// News listing
router.get('/news', async (req, res, next) => {
  try {
    const items = await news.getPublished();
    res.render('news', { title: 'News & Updates — ProASA', items });
  } catch (err) {
    next(err);
  }
});

// Single news article
router.get('/news/:slug', async (req, res, next) => {
  try {
    const article = await news.getBySlug(req.params.slug);
    if (!article || !article.is_published) {
      return res.status(404).render('404', { title: 'Not found' });
    }
    res.render('news-single', { title: `${article.title} — ProASA`, article });
  } catch (err) {
    next(err);
  }
});

// Contact
router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact — ProASA' });
});

module.exports = router;
