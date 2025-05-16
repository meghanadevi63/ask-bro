// features/query/handleQuery.js
import { sendMessage } from '../../geminiAgent.js'; // From previous implementation
import { fetchMetadata } from './fetchMetadata.js'; // Your metadata extractor

/**
 * Main handler: receives a user question and sends to Gemini
 */
export async function handleUserQuestion(question) {
  try {
    // Phase 1: Basic interaction — just echo the question to Gemini
    const reply = await sendMessage(`User asked: "${question}". Respond with a helpful answer.`);
    return { success: true, answer: reply };
  } catch (err) {
    console.error("Error handling question:", err);
    return { success: false, error: err.message };
  }
}
