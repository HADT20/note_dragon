const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  console.log('🔍 Đang kiểm tra kết nối database...\n');

  // Hiển thị thông tin cấu hình (ẩn password)
  console.log('📋 Thông tin kết nối:');
  console.log('   Host:', process.env.DB_HOST || 'localhost');
  console.log('   Port:', process.env.DB_PORT || '3306');
  console.log('   User:', process.env.DB_USER || 'root');
  console.log('   Password:', process.env.DB_PASSWORD ? '***' + process.env.DB_PASSWORD.slice(-3) : '(empty)');
  console.log('   Database:', process.env.DB_NAME || 'vozee_db');
  console.log('   SSL:', process.env.DB_SSL || 'false');
  console.log('');

  try {
    // Tạo cấu hình kết nối
    const config = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'vozee_db',
      timezone: '+07:00',
      charset: 'utf8mb4'
    };

    // Thêm SSL nếu cần
    if (process.env.DB_SSL === 'true') {
      config.ssl = {
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
      };
    }

    // Kết nối
    console.log('⏳ Đang kết nối...');
    const connection = await mysql.createConnection(config);
    console.log('✅ Kết nối thành công!\n');

    // Test query
    console.log('🔍 Kiểm tra database...');
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`✅ Tìm thấy ${tables.length} bảng:\n`);
    
    if (tables.length > 0) {
      tables.forEach((table, index) => {
        const tableName = Object.values(table)[0];
        console.log(`   ${index + 1}. ${tableName}`);
      });
      console.log('');
    } else {
      console.log('   ⚠️  Chưa có bảng nào. Hãy chạy script init.sql\n');
    }

    // Kiểm tra bảng users
    try {
      const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
      console.log(`👥 Số lượng users: ${users[0].count}`);
      
      if (users[0].count > 0) {
        const [adminCheck] = await connection.query(
          "SELECT username, role FROM users WHERE role = 'admin' LIMIT 1"
        );
        if (adminCheck.length > 0) {
          console.log(`✅ Tìm thấy admin: ${adminCheck[0].username}`);
        } else {
          console.log('⚠️  Chưa có admin. Hãy chạy script create-admin.sql');
        }
      }
    } catch (error) {
      console.log('⚠️  Bảng users chưa tồn tại. Hãy chạy script init.sql');
    }

    console.log('');

    // Kiểm tra các bảng khác
    const requiredTables = ['users', 'short_links', 'notes', 'qr_codes'];
    const existingTables = tables.map(t => Object.values(t)[0]);
    const missingTables = requiredTables.filter(t => !existingTables.includes(t));

    if (missingTables.length > 0) {
      console.log('⚠️  Các bảng còn thiếu:');
      missingTables.forEach(table => {
        console.log(`   - ${table}`);
      });
      console.log('\n💡 Chạy lệnh sau để tạo các bảng:');
      console.log(`   mysql -h ${config.host} -P ${config.port} -u ${config.user} -p ${config.database} < database/init.sql\n`);
    } else {
      console.log('✅ Tất cả các bảng đã sẵn sàng!\n');
    }

    // Đóng kết nối
    await connection.end();
    console.log('✅ Test hoàn tất!\n');

    // Hướng dẫn tiếp theo
    console.log('📝 Các bước tiếp theo:');
    if (missingTables.length > 0) {
      console.log('   1. Chạy script init.sql để tạo các bảng');
      console.log('   2. Chạy script create-admin.sql để tạo admin');
    } else {
      console.log('   1. Chạy: npm run dev');
      console.log('   2. Truy cập: http://localhost:3000');
      console.log('   3. Đăng nhập với admin/Admin@123');
    }
    console.log('');

  } catch (error) {
    console.error('❌ Lỗi kết nối:\n');
    console.error('   Message:', error.message);
    console.error('   Code:', error.code);
    console.error('');
    
    // Gợi ý giải pháp
    console.log('💡 Gợi ý giải pháp:\n');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('   - Kiểm tra MySQL server đã chạy chưa');
      console.log('   - Kiểm tra host và port có đúng không');
      console.log('   - Kiểm tra firewall có chặn kết nối không');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('   - Kiểm tra username và password');
      console.log('   - Kiểm tra user có quyền truy cập database không');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('   - Database chưa tồn tại');
      console.log('   - Tạo database trước khi kết nối');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('   - Kết nối timeout');
      console.log('   - Kiểm tra network/firewall');
      console.log('   - Thêm IP vào whitelist (nếu dùng cloud database)');
    } else if (error.code === 'ENOTFOUND') {
      console.log('   - Host không tồn tại');
      console.log('   - Kiểm tra lại DB_HOST trong .env.local');
    }
    
    console.log('');
    process.exit(1);
  }
}

testConnection();

