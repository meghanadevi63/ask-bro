// src/utils/geminiClient.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MAX_TOKENS = 1000; // Reduced for simplicity
const TEMPERATURE = 0.2;

// Path to the cache file
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const CACHE_FILE_PATH = path.resolve(__dirname, 'cached.responses.json');

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI({ apiKey: GEMINI_API_KEY });

// Load cache from file
let cache = {};
if (fs.existsSync(CACHE_FILE_PATH)) {
  try {
    const data = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
    cache = JSON.parse(data);
  } catch (error) {
    console.error('Error reading cache file:', error.message);
  }
}

// Function to save cache to file
function saveCacheToFile() {
  try {
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to cache file:', error.message);
  }
}

// Function to query Gemini API
async function queryGemini(prompt) {
  if (cache[prompt]) {
    console.log('Returning cached response');
    return cache[prompt];
  }

  try {
    const result = await genAI.generateText({
      model: 'models/gemini-2.0-flash',
      prompt,
      maxOutputTokens: MAX_TOKENS,
      temperature: TEMPERATURE,
    });

    const responseText = result.candidates[0]?.output || '';

    // Store the response in the cache
    cache[prompt] = responseText;
    saveCacheToFile();

    return responseText;
  } catch (error) {
    console.error('Error querying Gemini API:', error.message);
    throw new Error('Failed to get a response from Gemini API');
  }
}

// Main function to ask Gemini
export async function askGemini(prompt) {
  return await queryGemini(prompt);
}
