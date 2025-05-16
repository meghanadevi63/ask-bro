import pool from '../../db.js';

export async function fetchMetadata() {
  const tablesRes = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE';
  `);

  const tables = tablesRes.rows.map(row => row.table_name);

  const columns = {};
  for (const table of tables) {
    const colRes = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = $1;
    `, [table]);

    columns[table] = colRes.rows.map(col => col.column_name);
  }

  const columnDescriptions = {
    "table_a": {
      "col1": "Student ID in the format R200001–R201100 or R210001–R211100...",
      "col2": "Student full name...",
      "col3": "Hall ticket number, usually a 10-digit number...",
      "col4": "Date of birth in any format...",
      "col5": "Gender with possible values like Male, Female..."
    },
    "table_b": {
      "col1": "Student ID...",
      "col15": "Marks for E1 Semester 1...",
      "col16": "Marks for E1 Semester 2...",
      "col17": "Marks for E2 Semester 1..."
    },
    "table_c": {
      "col1": "Student ID...",
      "col8": "Father’s name...",
      "col9": "Mother’s name...",
      "col10": "Address...",
      "col11": "Branch name...",
      "col18": "Batch code..."
    }
  };

  return { tables, columns, columnDescriptions };
}
