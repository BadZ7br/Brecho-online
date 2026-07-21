const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'BrechoOnline',
  waitForConnections: true,
  connectionLimit: 10
});

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('  📁 MySQL conectado (BrechoOnline)');
    conn.release();
    return true;
  } catch (err) {
    console.error('  ❌ Erro ao conectar no MySQL:', err.message);
    return false;
  }
}

module.exports = { query: (...args) => pool.query(...args), testConnection };
