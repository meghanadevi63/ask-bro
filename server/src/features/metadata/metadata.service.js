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
        "col1": "Student ID in the format R200001–R201100 or R210001–R211100. Sometimes lowercase 'r' instead of 'R'. This is the primary identifier for students and links across all tables.",
        "col2": "Student full name (e.g., POSA VENKATA SIVA SHANKAR). May be in all caps, mixed case, or have inconsistent spacing/formatting.",
        "col3": "Hall ticket number, usually a 10-digit number (e.g., 2212027156). May appear as a float (e.g., 2212027156.0), be null, or have formatting issues.",
        "col4": "Date of birth in various inconsistent formats (e.g., '2004-04-09', '2004/04/09', 'May 9 2004', '09-04-2004', etc.). Handle with care using date parsing functions.",
        "col5": "Gender with possible values like Male, Female, M, F (case-insensitive). May contain nulls or unexpected values."
      },
      "table_b": {
        "col1": "Student ID in the format R200001–R201100 or R210001–R211100. Foreign key linking to table_a.col1. May have case inconsistencies.",
        "col15": "Marks for E1 Semester 1 on a scale of 0-10 (e.g., 9.352). May be null, missing, or have inconsistent decimal places. For GPA calculations, handle nulls appropriately.",
        "col16": "Marks for E1 Semester 2 on a scale of 0-10 (e.g., 9.352). May be null, missing, or have inconsistent decimal places. For GPA calculations, handle nulls appropriately.",
        "col17": "Marks for E2 Semester 1 on a scale of 0-10 (e.g., 9.352). May be null, missing, or have inconsistent decimal places. For GPA calculations, handle nulls appropriately."
      },
      "table_c": {
        "col1": "Student ID in the format R200001–R201100 or R210001–R211100. Foreign key linking to table_a.col1. May have case inconsistencies.",
        "col8": "Father's name (e.g., POSA SUBBARAYUDU). May have inconsistent capitalization or formatting.",
        "col9": "Mother's name (e.g., manjula). May be null or have inconsistent capitalization.",
        "col10": "Address (e.g., H.No 7&2-40/8/1, Subhash Nagar, Sircilla, Telangana). May be null, incomplete, or have inconsistent formatting.",
        "col11": `Student's academic branch or department. Extremely inconsistent data that may appear in various formats, abbreviations, or full forms, including:
                - Computer Science variations: 'CS', 'CSE', 'Computer Science', 'Computer Science and Engineering', 'COMPUTER SCIENCE', etc.
                - Electronics variations: 'EC', 'ECE', 'Electronics', 'Electronics and Communication', 'Electronics and Communication Engineering', etc.
                - Mechanical variations: 'ME', 'MECH', 'Mechanical', 'Mechanical Engineering', etc.
                - Chemical variations: 'CH', 'CHEM', 'Chemical', 'Chemical Engineering', etc.
                - Materials variations: 'MM', 'MME', 'Metallurgical', 'Metallurgical and Materials Engineering', etc.
                - Civil variations: 'CE', 'CIV', 'Civil', 'Civil Engineering', etc.
                - Electrical variations: 'EE', 'EEE', 'Electrical', 'Electrical Engineering', 'Electrical and Electronics', 'Electrical and Electronics Engineering', etc.
                - Some entries may contain unexpected values like 'LEFT RKV', 'DISCONTINUED', etc.
                Branch names may be in upper/lower case, abbreviated, misspelled, or use non-standard formats. Use UPPER(col11) and compare with multiple patterns using OR conditions and LIKE operators. Always handle nulls and unexpected entries safely.`,
        "col18": "Batch code (e.g., R20, R21). May appear in different cases like r20, r21, R20, R21. Indicates the student's admission year (2020 for R20, 2021 for R21)."
      }
    };


  
    // Step 7: Return enhanced metadata
    return { columns, sampleData, columnDescriptions };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    throw new Error("Failed to fetch database metadata: " + error.message);
  }
}
