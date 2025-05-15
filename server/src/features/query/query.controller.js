import { processQuestion } from './query.service.js';
import { fetchMetadata } from '../metadata/metadata.service.js';
import pool from '../../db.js';

export async function handleUserQuery(req, res) {
  const { question } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Invalid question format' });
  }

  try {
    // 1. Get metadata
    const metadata = await fetchMetadata();

    // 2. Ask Gemini to generate SQL & response
    const aiResponse = await processQuestion(question, metadata);
    const { sql, response, chart } = aiResponse;

    if (!sql) {
      return res.status(400).json({ error: 'Could not generate a valid SQL query.' });
    }

    // 3. Run SQL on your PostgreSQL database
    const result = await pool.query(sql);

    // 4. Format table data
    const table = result.rows;

    res.json({
      response,
      chart: chart || { type: 'none', labels: [], values: [] },
      table
    });

  } catch (err) {
    console.error('Error in /api/query:', err.message);
    res.status(500).json({
      error: 'Unable to process the question. Please rephrase or check logs.'
    });
  }
}
