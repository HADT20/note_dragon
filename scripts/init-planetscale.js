const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

async function initPlanetScale() {
  console.log('🚀 Khởi tạo MySQL Database cho VOZ.EE\n');

  // Hiển thị thông tin kết nối
  console.log('📋 Thông tin kết nối:');
  console.log('   Host:', process.env.DB_HOST);
  console.log('   Database:', process.env.DB_NAME);
  console.log('   User:', process.env.DB_USER);
  console.log('   SSL:', process.env.DB_SSL === 'true' ? 'Enabled' : 'Disabled');
  console.log('');

  try {
    // Kết nối đến database
    console.log('⏳ Đang kết nối đến database...');

    const connectionConfig = {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: false
    };

    // Chỉ thêm SSL nếu được bật
    if (process.env.DB_SSL === 'true') {
      connectionConfig.ssl = {
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
      };
    }

    const connection = await mysql.createConnection(connectionConfig);

    console.log('✅ Đã kết nối thành công!\n');

    // Đọc file SQL - Chọn file phù hợp
    let sqlFile = 'database/init.sql';
    if (process.env.DB_HOST && process.env.DB_HOST.includes('psdb.cloud')) {
      sqlFile = 'database/init-planetscale.sql';
    } else if (process.env.DB_HOST && process.env.DB_HOST.includes('freesqldatabase.com')) {
      sqlFile = 'database/init-freesql.sql';
    }

    console.log('📖 Đọc file', sqlFile, '...');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');

    // Xóa comments và tách các câu lệnh SQL
    const cleanedContent = sqlContent
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))  // Xóa comment lines
      .join('\n');

    const statements = cleanedContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`✅ Tìm thấy ${statements.length} câu lệnh SQL\n`);

    // Thực thi từng câu lệnh
    console.log('⏳ Đang thực thi các câu lệnh...\n');
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        // Lấy tên bảng hoặc action từ câu lệnh
        let action = 'Executing';
        if (statement.toUpperCase().includes('CREATE TABLE')) {
          const match = statement.match(/CREATE TABLE.*?`?(\w+)`?/i);
          action = match ? `Creating table: ${match[1]}` : 'Creating table';
        } else if (statement.toUpperCase().includes('INSERT INTO')) {
          const match = statement.match(/INSERT INTO.*?`?(\w+)`?/i);
          action = match ? `Inserting data into: ${match[1]}` : 'Inserting data';
        }

        console.log(`   ${i + 1}/${statements.length} ${action}...`);
        await connection.query(statement);
        console.log(`   ✅ Success\n`);
      } catch (error) {
        // Bỏ qua lỗi "table already exists" hoặc "duplicate entry"
        if (error.code === 'ER_TABLE_EXISTS_ERROR' || 
            error.code === 'ER_DUP_ENTRY') {
          console.log(`   ⚠️  Already exists (skipped)\n`);
        } else {
          console.error(`   ❌ Error: ${error.message}\n`);
          throw error;
        }
      }
    }

    // Kiểm tra kết quả
    console.log('🔍 Kiểm tra database...\n');

    // Kiểm tra các bảng
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`✅ Tìm thấy ${tables.length} bảng:`);
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`   ${index + 1}. ${tableName}`);
    });
    console.log('');

    // Kiểm tra admin user
    const [adminCheck] = await connection.query(
      "SELECT id, username, email, role FROM users WHERE username = 'admin'"
    );

    if (adminCheck.length > 0) {
      console.log('✅ Admin user đã được tạo:');
      console.log(`   ID: ${adminCheck[0].id}`);
      console.log(`   Username: ${adminCheck[0].username}`);
      console.log(`   Email: ${adminCheck[0].email}`);
      console.log(`   Role: ${adminCheck[0].role}`);
      console.log('');
    }

    // Kiểm tra số lượng users
    const [userCount] = await connection.query('SELECT COUNT(*) as count FROM users');
    console.log(`👥 Tổng số users: ${userCount[0].count}\n`);

    // Đóng kết nối
    await connection.end();

    // Thông báo hoàn tất
    console.log('═══════════════════════════════════════════════════');
    console.log('✅ Khởi tạo database thành công!');
    console.log('═══════════════════════════════════════════════════\n');

    console.log('📝 Thông tin đăng nhập Admin:');
    console.log('   URL: http://localhost:3000/login');
    console.log('   Username: admin');
    console.log('   Password: Admin@123');
    console.log('   Email: admin@vozee.com\n');

    console.log('🚀 Các bước tiếp theo:');
    console.log('   1. Chạy: npm run dev');
    console.log('   2. Truy cập: http://localhost:3000');
    console.log('   3. Đăng nhập với admin/Admin@123');
    console.log('   4. Vào Admin Dashboard để quản lý\n');

    console.log('💡 Lưu ý:');
    console.log('   - PlanetScale KHÔNG hỗ trợ Foreign Keys');
    console.log('   - Referential integrity được quản lý trong code');
    console.log('   - Free tier: 5GB storage, 1B row reads/month\n');

  } catch (error) {
    console.error('\n❌ Lỗi khi khởi tạo database:\n');
    console.error('   Message:', error.message);
    console.error('   Code:', error.code);
    console.error('');

    // Gợi ý giải pháp
    console.log('💡 Gợi ý giải pháp:\n');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('   - Kiểm tra thông tin kết nối trong .env.local');
      console.log('   - Đảm bảo DB_HOST, DB_USER, DB_PASSWORD đúng');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('   - Kiểm tra username và password');
      console.log('   - Tạo password mới trong PlanetScale dashboard');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('   - Kiểm tra kết nối internet');
      console.log('   - Thử lại sau vài phút');
    } else if (error.message.includes('SSL')) {
      console.log('   - Đảm bảo DB_SSL=true trong .env.local');
      console.log('   - Đảm bảo DB_SSL_REJECT_UNAUTHORIZED=false');
    }

    console.log('');
    console.log('📚 Xem hướng dẫn chi tiết tại: PLANETSCALE_SETUP.md\n');
    
    process.exit(1);
  }
}

// Chạy script
initPlanetScale();

