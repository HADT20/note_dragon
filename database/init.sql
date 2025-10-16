-- Tạo database
CREATE DATABASE IF NOT EXISTS vozee_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE vozee_db;

-- Bảng users (người dùng)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  role ENUM('user', 'admin') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng short_links (link rút gọn)
CREATE TABLE IF NOT EXISTS short_links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  original_url TEXT NOT NULL,
  short_code VARCHAR(20) UNIQUE NOT NULL,
  short_url VARCHAR(255) NOT NULL,
  clicks INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_short_code (short_code),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng notes (ghi chú)
CREATE TABLE IF NOT EXISTS notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255),
  recipient VARCHAR(100),
  content TEXT,
  note_key VARCHAR(50) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_note_key (note_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng qr_codes (mã QR)
CREATE TABLE IF NOT EXISTS qr_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  content TEXT NOT NULL,
  qr_data TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Thêm dữ liệu mẫu
-- Password cho admin: Admin@123
-- Password cho demo: Demo@123
INSERT INTO users (username, email, password, full_name, role) VALUES
('admin', 'admin@vozee.com', '$2a$10$rQJ5qZ8vZ5qZ8vZ5qZ8vZOYxK5qZ8vZ5qZ8vZ5qZ8vZ5qZ8vZ5qZ8', 'Administrator', 'admin'),
('demo', 'demo@vozee.com', '$2a$10$rQJ5qZ8vZ5qZ8vZ5qZ8vZOYxK5qZ8vZ5qZ8vZ5qZ8vZ5qZ8vZ5qZ8', 'Demo User', 'user')
ON DUPLICATE KEY UPDATE username=username;

