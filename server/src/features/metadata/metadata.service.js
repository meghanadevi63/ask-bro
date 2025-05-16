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

  // Step 3: Add human-readable descriptions for Gemini understanding
  const columnDescriptions = {
    table_a: {
      col1: "student id",
      col2: "name",
      col3: "hall ticket",
      col4: "date of birth",
      col5: "gender (Male/Female)"
    },
    table_b: {
      col1: "student id",
      col15: "e1sem1 marks",
      col16: "e1sem2 marks",
      col17: "e2sem1 marks"
    },
    table_c: {
      col1: "student id",
      col8: "father name",
      col9: "mother name",
      col10: "address",
      col11: "branch",
      col18: "batch (R20, R21)"
    }
  };

  return { tables, columns, columnDescriptions };
}
