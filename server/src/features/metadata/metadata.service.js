// src/metadata/metadata.service.js
import pool from '../../db.js';

export async function fetchMetadata() {
  try {
    // Step 1: Get table names
    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE';
    `);

    const tables = tablesRes.rows.map(row => row.table_name);

    // Step 2: Get columns for each table with data types
    const columns = {};
    const sampleData = {};
    const statistics = {};

    for (const table of tables) {
      // Get column information
      const colRes = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = $1
        ORDER BY ordinal_position;
      `, [table]);

      columns[table] = colRes.rows.map(col => ({
        name: col.column_name,
        type: col.data_type,
        nullable: col.is_nullable === 'YES'
      }));

      // Get sample data for each table (first 5 rows)
      try {
        const sampleRes = await pool.query(`
          SELECT * FROM ${table} LIMIT 5;
        `);
        sampleData[table] = sampleRes.rows;
        
        // Get basic statistics for numeric columns
        for (const col of columns[table]) {
          if (['integer', 'numeric', 'real', 'double precision'].includes(col.type)) {
            try {
              const statsRes = await pool.query(`
                SELECT 
                  MIN(${col.name}::numeric) as min_value,
                  MAX(${col.name}::numeric) as max_value,
                  AVG(${col.name}::numeric) as avg_value,
                  COUNT(${col.name}) as count,
                  COUNT(*) as total_count
                FROM ${table}
                WHERE ${col.name} IS NOT NULL AND ${col.name}::text ~ '^[0-9]+(\.[0-9]+)?$';
              `);
              
              if (!statistics[table]) statistics[table] = {};
              statistics[table][col.name] = statsRes.rows[0];
            } catch (e) {
              console.error(`Error fetching statistics for ${table}.${col.name}:`, e.message);
            }
          }
        }
      } catch (e) {
        console.error(`Error fetching sample data for table ${table}:`, e.message);
        sampleData[table] = [];
      }
    }

  // Step 3: Add human-readable descriptions for Gemini understanding
  const columnDescriptions = {
    "table_a": {
      "col1": "Student ID in the format R200001–R201100 or R210001–R211100. some time it may be r instad of R",
      "col2": "Student full name (e.g., POSA VENKATA SIVA SHANKAR).",
      "col3": "Hall ticket number, usually a 10-digit number (e.g., 2212027156). May appear as a float (e.g., 2212027156.0) or be null.",
      "col4": "Date of birth in any format (e.g., '2004-04-09', '2004/04/09', 'May 9 2004', etc.).",
      "col5": "Gender with possible values like Male, Female, M, F (case-insensitive)."
    },
    "table_b": {
      "col1": "Student ID in the format R200001–R201100 or R210001–R211100.",
      "col15": "Marks for E1 Semester 1 (e.g., 9.352 out of 10). May be null or missing.",
      "col16": "Marks for E1 Semester 2 (e.g., 9.352 out of 10). May be null or missing.",
      "col17": "Marks for E2 Semester 1 (e.g., 9.352 out of 10). May be null or missing."
    },
    "table_c": {
      "col1": "Student ID in the format R200001–R201100 or R210001–R211100.",
      "col8": "Father’s name (e.g., POSA SUBBARAYUDU).",
      "col9": "Mother’s name (e.g., manjula). May be null.",
      "col10": "Address (e.g., H.No 7&2-40/8/1, Subhash Nagar, Sircilla, Telangana). May be null.",
      "col11": "Branch name. Possible values (case and format may vary): 'Computer Science and Engineering (CSE)', 'Electronics and Communication Engineering (ECE)', 'Electrical Engineering (EEE)', 'Mechanical Engineering', 'Metallurgy Engineering (MME)', 'Civil Engineering (CE)', 'Chemical Engineering (CHE)'.",
      "col18": "Batch code (e.g., R20, R21). May appear in different cases like r20, r21."
    }
  }
  
    // Step 7: Return enhanced metadata
    return { columns, sampleData, columnDescriptions };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    throw new Error("Failed to fetch database metadata: " + error.message);
  }
}
