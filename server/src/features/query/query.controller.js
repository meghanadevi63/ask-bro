// src/query/query.controller.js
import { processQuestion, executeSQL, generateAnswerFromResults } from './query.service.js';
import { fetchMetadata } from '../metadata/metadata.service.js';

export async function handleQueryRequest(req, res) {
  console.log("Received query request:", req.body);

  const { question } = req.body;
  console.log("Extracted question:", question);

  if (!question || typeof question !== 'string') {
    console.error("Invalid question format:", question);
    return res.status(400).json({ error: 'Question is required as a string.' });
  }

  try {
    console.log("Fetching metadata...");
    const metadata = await fetchMetadata();
    console.log("Fetched metadata:", metadata);

    // Step 1: Generate SQL from question
    console.log("Processing question to generate SQL...");
    let sqlQuery;
    try {
      sqlQuery = await processQuestion(question, metadata);
      console.log("Generated SQL query:", sqlQuery);
    } catch (sqlGenerationError) {
      console.error("Error generating SQL:", sqlGenerationError);
      return res.status(500).json({ 
        error: 'Failed to generate SQL query',
        content: "I couldn't understand how to query the database for your question. Could you please rephrase it?"
      });
    }

    // Step 2: Execute SQL on PostgreSQL
    console.log("Executing SQL query...");
    let rows;
    try {
      rows = await executeSQL(sqlQuery);
      console.log("SQL execution results:", rows);
    } catch (executionError) {
      console.error("Error executing SQL query:", executionError);
      
      // Retry with a simplified approach
      console.log("Retrying with a more robust SQL generation approach...");
      try {
        // Add a retry hint to the question
        const retryQuestion = `${question} (Please generate a simpler query focusing on exact matches only)`;
        const retrySqlQuery = await processQuestion(retryQuestion, metadata);
        console.log("Retry generated SQL query:", retrySqlQuery);
        rows = await executeSQL(retrySqlQuery);
        console.log("SQL execution results after retry:", rows);
      } catch (retryError) {
        console.error("Error on retry execution:", retryError);
        return res.status(500).json({ 
          error: 'Failed to execute SQL query',
          content: "I understood your question, but couldn't retrieve the data due to schema complexity. Could you ask about a specific aspect or provide more details?"
        });
      }
    }

    // Step 3: Generate natural language + visualizations JSON from results
    console.log("Generating answer JSON from results...");
    const answerJson = await generateAnswerFromResults(sqlQuery, rows, question);
    console.log("Generated answer JSON:", answerJson);

    // Step 4: Send JSON response to frontend
    console.log("Sending response to frontend...");
    res.json(answerJson);

  } catch (error) {
    console.error("Error occurred during query handling:", error);
    res.status(500).json({ 
      error: error.message,
      content: "I encountered an error while processing your question. Please try a different question or provide more specific details."
    });
  }
}
