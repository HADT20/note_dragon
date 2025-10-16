import mysql from 'mysql2/promise';

// Tạo connection pool với cấu hình linh hoạt
const poolConfig: any = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vozee_db',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
  queueLimit: 0,
  timezone: '+07:00', // Việt Nam timezone
  charset: 'utf8mb4'
};

// Thêm SSL nếu được cấu hình (cho PlanetScale, Aiven, etc.)
if (process.env.DB_SSL === 'true') {
  poolConfig.ssl = {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
  };
}

const pool = mysql.createPool(poolConfig);

// Test connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully!');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

export default pool;

