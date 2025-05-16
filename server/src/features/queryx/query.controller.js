import { processQuestion } from './query.service.js';
import { fetchMetadata } from '../metadata/metadata.service.js';
import pool from '../../db.js';

/**
 * Utility to clean up markdown/code block formatting from generated SQL.
 */
function cleanSQL(rawSql) {
  if (!rawSql || typeof rawSql !== 'string') return '';
  return rawSql
    .replace(/```sql\s*/gi, '')  // Remove starting ```sql with optional space
    .replace(/```/g, '')         // Remove closing backticks
    .trim();                     // Trim whitespace
}

export async function handleUserQuery(req, res) {
  const { question } = req.body;

  console.log('📥 Received request with question:', question);

  if (!question || typeof question !== 'string') {
    console.error('❌ Invalid question format:', question);
    return res.status(400).json({ error: 'Invalid question format' });
  }

  try {
    console.log('🔍 Fetching metadata...');
    const metadata = await fetchMetadata();
    console.log('✅ Metadata fetched successfully.');

    console.log('🤖 Processing question with AI...');
    const rawSql = await processQuestion(question, metadata);
    const sql = cleanSQL(rawSql);

    if (!sql) {
      console.error('❌ AI failed to generate a valid SQL query.');
      return res.status(400).json({ error: 'Could not generate a valid SQL query.' });
    }

    console.log(`🧠 Question: ${question}`);
    console.log(`📄 Cleaned SQL: ${sql}`);

    console.log('📊 Executing SQL query on the database...');
    const result = await pool.query(sql);
    console.log('✅ SQL query executed successfully.');

    const table = result.rows;

    return res.status(200).json({
      sql,
      response: 'Query executed successfully',
      chart: { type: 'none', labels: [], values: [] },
      table
    });

  } catch (err) {
    console.error('❌ Error in /api/query:', err.message);
    console.error('🛠️ Stack trace:', err.stack);
    res.status(500).json({
      error: 'Unable to process the question. Please rephrase or check logs.',
      details: err.message
    });
  }
}
