import { askGemini } from '../../utils/geminiClient.js';

export async function processQuestion(question, metadata) {
  const prompt = `
You are a helpful SQL assistant. Based on the following question and metadata, generate:
1. A SQL query.
2. A one-line human-readable summary.
3. Chart type if applicable: [bar | line | pie | none].
4. Chart labels and values from SQL result if applicable.
5. Return JSON format like:
{
  "sql": "...",
  "response": "...",
  "chart": {
    "type": "bar",
    "labels": ["Product A", "Product B"],
    "values": [1000, 800]
  }
}
6.Return only a JSON object (no markdown or extra text) with keys: sql, response, chart.
7.Use the metadata below which maps table and column names (real column names). Use only real column names in SQL.

Question: "${question}"
Metadata: ${JSON.stringify(metadata)}
`;

  const geminiReply = await askGemini(prompt);
  
  // ✅ Check if Gemini reply is empty or null
  if (!geminiReply || geminiReply.trim().length === 0) {
    console.error('Gemini returned an empty response.');
    throw new Error('Gemini returned an empty response. Please rephrase the question.');
  }

  try {
    const cleanedReply = (() => {
    const match = geminiReply.match(/```json\s*([\s\S]*?)```/);
    if (match) return match[1].trim();
    return geminiReply.trim();
  })();

      const parsed = JSON.parse(cleanedReply);
     if (!parsed.sql || typeof parsed.sql !== 'string' || parsed.sql.trim() === '') {
      console.error('Parsed response does not contain a valid SQL query:', parsed);
      throw new Error('Gemini response did not include a valid SQL query.');
    }

    return parsed;
  } catch (err) {
    console.error('Failed to parse Gemini output:', geminiReply);
    throw new Error('Failed to parse AI response');
  }
}
