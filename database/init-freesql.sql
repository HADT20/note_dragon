-- =====================================================
-- FreeSQLDatabase Schema for VOZ.EE
-- =====================================================
-- Không tạo database mới, sử dụng database có sẵn
-- =====================================================

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
  updated_at DATETIME DEFAULT NULL,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Bảng short_links (link rút gọn)
CREATE TABLE IF NOT EXISTS short_links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  original_url TEXT NOT NULL,
  short_code VARCHAR(20) UNIQUE NOT NULL,
  short_url VARCHAR(255) NOT NULL,
  clicks INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT NULL,
  INDEX idx_short_code (short_code),
  INDEX idx_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Bảng notes (ghi chú)
CREATE TABLE IF NOT EXISTS notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255),
  recipient VARCHAR(100),
  content TEXT,
  note_key VARCHAR(50) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_note_key (note_key),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Bảng qr_codes (mã QR)
CREATE TABLE IF NOT EXISTS qr_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  content TEXT NOT NULL,
  qr_data TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- =====================================================
-- Tạo admin user mặc định
-- =====================================================
-- Username: admin
-- Password: Admin@123
-- Email: admin@vozee.com
-- =====================================================

INSERT INTO users (username, email, password, full_name, role, is_active) 
VALUES (
  'admin',
  'admin@vozee.com',
  '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGQEKU7OX0Nq/lxRTC.6YK2',
  'Administrator',
  'admin',
  TRUE
)
ON DUPLICATE KEY UPDATE 
  password = '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGQEKU7OX0Nq/lxRTC.6YK2',
  role = 'admin',
  is_active = TRUE;

-- =====================================================
-- Hoàn tất!
-- =====================================================

