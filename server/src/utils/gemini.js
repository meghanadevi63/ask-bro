import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });

export async function askGemini(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (err) {
    console.error('Gemini error:', err.message);
    throw new Error('Gemini API error');
  }
}
