// src/query/query.controller.js
import { processQuestion, executeSQL, generateAnswerFromResults } from './query.service.js';
import { fetchMetadata } from '../metadata/metadata.service.js';
import { logQuery, getQueryHistory } from '../logging/logging.service.js';

async function validateRequest(req, res) {
  const { question } = req.body;
  if (!question || typeof question !== 'string') {
    res.status(400).json({ error: 'Question is required as a string.' });
    return null;
  }
  return question;
}

async function fetchConversationHistory(conversationId) {
  return conversationId ? await getQueryHistory(conversationId, 5) : [];
}

async function processAndExecuteQuery(question, metadata, conversationHistory) {
  try {
    const sqlQuery = await processQuestion(question, metadata, conversationHistory);
    const rows = await executeSQL(sqlQuery);
    return { sqlQuery, rows };
  } catch (error) {
    console.error("Error processing or executing query:", error);
    throw new Error("Failed to process or execute query.");
  }
}

async function handleQuery(req, res) {
  const question = await validateRequest(req, res);
  if (!question) return;

  try {
    const metadata = await fetchMetadata();
    console.log("Fetched metadata:", metadata);

    // Step 1: Generate SQL from question
    console.log("Processing question to generate SQL...");
    const sqlQuery = await processQuestion(question, metadata);
    console.log("Generated SQL query:", sqlQuery);

    // Step 2: Execute SQL on PostgreSQL
    console.log("Executing SQL query...");
    let rows;
    try {
      rows = await executeSQL(sqlQuery);
      console.log("SQL execution results:", rows);
    } catch (executionError) {
      console.error("Error executing SQL query:", executionError);
      console.log("Retrying to process question to generate SQL...");
      const retrySqlQuery = await processQuestion(question, metadata);
      console.log("Retry generated SQL query:", retrySqlQuery);
      rows = await executeSQL(retrySqlQuery);
      console.log("SQL execution results after retry:", rows);
    }

    // Step 3: Generate natural language + visualizations JSON from results
    console.log("Generating answer JSON from results...");
    const answerJson = await generateAnswerFromResults(sqlQuery, rows);
    console.log("Generated answer JSON:", answerJson);

    // Step 4: Send JSON response to frontend
    console.log("Sending response to frontend...");
    res.json(answerJson);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
