import pool from '../../db.js';

export async function fetchMetadata() {
  // Step 1: Get table names
  const tablesRes = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE';
  `);

  const tables = tablesRes.rows.map(row => row.table_name);

  // Step 2: Get columns for each table
  const columns = {};

  for (const table of tables) {
    const colRes = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = $1;
    `, [table]);

    columns[table] = colRes.rows.map(col => col.column_name);
  }

  return { tables, columns };
}
