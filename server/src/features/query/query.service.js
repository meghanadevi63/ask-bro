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

Question: "${question}"
Metadata: ${JSON.stringify(metadata)}
`;

  const geminiReply = await askGemini(prompt);

  try {
    const parsed = JSON.parse(geminiReply);
    return parsed;
  } catch (err) {
    console.error('Failed to parse Gemini output:', geminiReply);
    throw new Error('Failed to parse AI response');
  }
}
