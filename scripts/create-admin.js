const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function createAdmin() {
  try {
    // Kết nối database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'vozee_db'
    });

    console.log('✅ Đã kết nối database');

    // Hash password
    const adminPassword = 'Admin@123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    console.log('🔐 Password đã hash:', hashedPassword);

    // Kiểm tra xem admin đã tồn tại chưa
    const [existingAdmin] = await connection.query(
      'SELECT * FROM users WHERE username = ?',
      ['admin']
    );

    if (existingAdmin.length > 0) {
      // Cập nhật admin hiện tại
      await connection.query(
        'UPDATE users SET password = ?, role = ?, is_active = TRUE WHERE username = ?',
        [hashedPassword, 'admin', 'admin']
      );
      console.log('✅ Đã cập nhật user admin');
    } else {
      // Tạo admin mới
      await connection.query(
        'INSERT INTO users (username, email, password, full_name, role, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        ['admin', 'admin@vozee.com', hashedPassword, 'Administrator', 'admin', true]
      );
      console.log('✅ Đã tạo user admin mới');
    }

    console.log('\n📋 Thông tin đăng nhập Admin:');
    console.log('   Username: admin');
    console.log('   Password: Admin@123');
    console.log('   Email: admin@vozee.com');
    console.log('   Role: admin\n');

    await connection.end();
    console.log('✅ Hoàn tất!');
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

createAdmin();

