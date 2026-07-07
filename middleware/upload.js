const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Generic storage: auto-detects image vs video, drops everything into a
// "proasa" folder on Cloudinary so it's easy to find in your dashboard.
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'proasa',
    resource_type: 'auto',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'mov', 'webm']
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB ceiling (mind the free-tier credits)
});

module.exports = upload;
