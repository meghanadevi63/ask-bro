// filepath: [query.service.js](http://_vscodecontentref_/1)
// src/query/query.service.js
import { askGemini } from '../../utils/geminiClient.js';
import pool from '../../db.js';

export async function processQuestion(question, metadata, conversationHistory = []) {

  const prompt = `
  You are an expert PostgreSQL assistant working with a very messy, inconsistent, and unreliable database.
  
  Important constraints you must follow exactly:
  
  1. Only use the exact column and table names provided in the metadata below. Never invent or assume names.
  2. Every column used in math (like a + b) must be wrapped in \`CAST(column AS NUMERIC)\` — even if you *think* it's numeric.
  3. Every \`COALESCE\` call must cast all values to the same type (e.g. \`COALESCE(CAST(col1 AS TEXT), 'default')\`).
  4. Always filter out NULLs where relevant, especially in WHERE, JOIN, GROUP BY, and ORDER BY clauses.
  5. Do NOT assume column types. Always cast when you're unsure or using comparisons, sorting, math, or filters.
  6. Use LEFT JOIN unless it's 100% safe to assume both sides exist.
  7. Avoid ambiguous functions or PostgreSQL-specific extensions.
  8. Return ONLY a raw SQL string, with no backticks, markdown, or explanations. Do NOT wrap the SQL in \`\`\` or any quotes.
  
  Example of correct style:
  SELECT CAST(col1 AS NUMERIC) + CAST(col2 AS NUMERIC) AS total
  FROM table_x
  WHERE col3 IS NOT NULL;
  
  Metadata (describes tables, columns, and meanings):
  ${JSON.stringify(metadata)}
  
  User Question:
  "${question}"
  
  Your only task is to generate a safe, executable, PostgreSQL-compatible SQL query that answers this question based on the metadata.
  Return just the SQL query string. Nothing else.

  I am getting lots errors while running the SQL query. Please make sure to follow the constraints strictly.
  `;
  
  
  

  try {
    const sqlQuery = await askGemini(prompt);
    
    const cleanedQuery = sqlQuery.replace(/```(?:sql)?|```/g, '').trim();
    console.log('Received SQL query from Gemini:', sqlQuery);


    if (!cleanedQuery || !/^(SELECT|WITH|EXPLAIN)/i.test(cleanedQuery)) {
      console.log('Invalid SQL generated, using default query');
      return generateDefaultQuery(question);
    }

    console.log('Received SQL query from Gemini:', cleanedQuery);
    return cleanedQuery;
  } catch (e) {
    console.error('Error while getting SQL from Gemini:', e.message);
    return generateDefaultQuery(question);
  }
}

function generateDefaultQuery(question) {
  const isTopStudentQuery = /top|best|highest|first/i.test(question);
  const isCSEQuery = /cse|computer|cs/i.test(question);
  const isR20Query = /r20|20/i.test(question);

  if (isTopStudentQuery && isCSEQuery && isR20Query) {
    return `
      WITH student_marks AS (
        SELECT 
          UPPER(a.col1) AS student_id,
          a.col2 AS student_name,
          COALESCE(NULLIF(b.col15, '')::NUMERIC, 0) + 
          COALESCE(NULLIF(b.col16, '')::NUMERIC, 0) + 
          COALESCE(NULLIF(b.col17, '')::NUMERIC, 0) AS total_marks
        FROM 
          table_a a
          JOIN table_b b ON UPPER(a.col1) = UPPER(b.col1)
          JOIN table_c c ON UPPER(a.col1) = UPPER(c.col1)
        WHERE 
          (UPPER(c.col11) LIKE '%CS%' OR UPPER(c.col11) LIKE '%COMPUTER%') AND
          (UPPER(c.col18) LIKE '%R20%' OR UPPER(c.col18) LIKE '%20%')
      )
      SELECT 
        student_id,
        student_name,
        total_marks,
        RANK() OVER (ORDER BY total_marks DESC) AS rank
      FROM 
        student_marks
      ORDER BY 
        total_marks DESC
      LIMIT 1;
    `;
  }

  return `
    SELECT 
      a.col1 AS student_id,
      a.col2 AS student_name,
      c.col11 AS branch,
      c.col18 AS batch,
      COALESCE(NULLIF(b.col15, '')::NUMERIC, 0) + 
      COALESCE(NULLIF(b.col16, '')::NUMERIC, 0) + 
      COALESCE(NULLIF(b.col17, '')::NUMERIC, 0) AS total_marks
    FROM 
      table_a a
      JOIN table_b b ON UPPER(a.col1) = UPPER(b.col1)
      JOIN table_c c ON UPPER(a.col1) = UPPER(c.col1)
    ORDER BY 
      total_marks DESC
    LIMIT 10;
  `;
}

export async function executeSQL(sqlQuery) {

  try {
    await pool.query('SET statement_timeout = 300000');
    const result = await pool.query(sqlQuery);
    console.log('Query executed successfully. Rows returned:', result.rows.length);
    await pool.query('SET statement_timeout = 30000');
    return result.rows;
  } catch (e) {
    console.error('Error while executing SQL query:', e.message);
    await pool.query('SET statement_timeout = 30000');
    throw new Error('PostgreSQL query failed: ' + e.message);
  }
}

export async function generateAnswerFromResults(sqlQuery, rows) {
  console.log('generateAnswerFromResults called with:', { sqlQuery, rows });

  const prompt = `
    You are a data analyst assistant.

    Given the SQL query:
    ${sqlQuery}

    And its result in JSON format:
    ${JSON.stringify(rows)}

    Your task is:
    - Generate a concise, accurate natural language answer explaining the output.
    - Provide an appropriate visualization description as JSON, including type (e.g., pie, bar), labels, and values.
    - Return ONLY a valid JSON object (no explanations, no markdown):

    {
      "content": "string, the natural language answer",
      "visualizations": {
        "type": "chart type (pie, bar, line, etc.)",
        "title": "chart title",
        "labels": [...],
        "values": [...]
      },
      "data": [...],  // optional tabular data, can be the rows or subset
      "sql": "${sqlQuery}"
    }
  `;

  console.log('Generated prompt for Gemini:', prompt);

  let geminiResponse = '';
  try {
    geminiResponse = await askGemini(prompt);
    console.log('Received response from Gemini:', geminiResponse);

    // Clean the response to remove Markdown formatting
    geminiResponse = geminiResponse.replace(/```(?:json)?/g, '').trim(); // Remove ```json or ```
    console.log('Cleaned response from Gemini:', geminiResponse);

    // Parse the cleaned response as JSON
    const jsonAnswer = JSON.parse(geminiResponse);
    console.log('Parsed JSON response from Gemini:', jsonAnswer);

    return jsonAnswer;
  } catch (e) {
    console.error('Error while processing Gemini response:', e.message);
    return {
      content: "I found some information based on your question, but I'm having trouble formatting it nicely. Here's what I know: " + 
              (rows.length > 0 ? `I found ${rows.length} records that match your query.` : "I couldn't find any records matching your criteria."),
      data: rows.slice(0, 20),
      question: question
    };
  }
}
