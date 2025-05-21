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
    const conversationHistory = await fetchConversationHistory(req.body.conversationId);
    const { sqlQuery, rows } = await processAndExecuteQuery(question, metadata, conversationHistory);
    const answerJson = await generateAnswerFromResults(sqlQuery, rows, question);

    if (req.body.conversationId) {
      await logQuery({
        conversationId: req.body.conversationId,
        question,
        sqlQuery,
        result: rows.length > 0 ? 'success' : 'no_data',
        timestamp: new Date(),
      });
    }

    res.json({ ...answerJson, sql: sqlQuery, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message, content: "An error occurred while processing your request." });
  }
}

export async function handleQueryRequest(req, res) {
  console.log("Received query request:", req.body);
  await handleQuery(req, res);
}

export async function handleConversationStart(_, res) {
  try {
    const conversationId = Date.now().toString();
    res.json({ conversationId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
