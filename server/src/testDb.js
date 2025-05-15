import pool from './db.js';

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('DB Time:', res.rows[0]);
  } catch (error) {
    console.error('DB connection test failed:', error);
  } finally {
    pool.end();
  }
})();
