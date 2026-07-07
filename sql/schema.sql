-- ProASA website database schema
-- Run this once against your Aiven MySQL service (see README for how).

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- The 3 departmental/executive heads shown on the homepage
CREATE TABLE IF NOT EXISTS department_heads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  title VARCHAR(150) NOT NULL,
  bio TEXT,
  photo_url VARCHAR(500),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Judicial committee members (and any other committee), shown on About page
CREATE TABLE IF NOT EXISTS committee_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  role VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'judicial', -- 'judicial' or 'executive' etc.
  photo_url VARCHAR(500),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News / announcements
CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  summary VARCHAR(500),
  content MEDIUMTEXT NOT NULL,
  image_url VARCHAR(500),
  is_published TINYINT(1) DEFAULT 1,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
);

-- Gallery items (photos & videos)
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  media_url VARCHAR(500) NOT NULL,
  media_type ENUM('image', 'video') NOT NULL DEFAULT 'image',
  caption VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Single editable blocks of long-form content: 'constitution' and 'about'
CREATE TABLE IF NOT EXISTS site_pages (
  slug VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content MEDIUMTEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO site_pages (slug, title, content) VALUES
  ('about', 'About ProASA', '<p>Tell your visitors who ProASA is and what the department does. Edit this from the admin dashboard.</p>'),
  ('constitution', 'ProASA Constitution', '<p>Paste or write your full constitution here. Edit this from the admin dashboard.</p>')
ON DUPLICATE KEY UPDATE slug = slug;
