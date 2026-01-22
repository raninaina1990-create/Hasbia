// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const topicRoutes = require('./routes/topics');
app.use('/api/topics', topicRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));

// backend/services/aiService.js
const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/gemini-api'); // Hypothetical import
const Synthesia = require('synthesia-sdk'); // Hypothetical

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const synthesia = new Synthesia({ apiKey: process.env.SYNTHESIA_API_KEY });

async function generateNotes(topic, languages) {
  const prompt = `Generate detailed notes on ${topic} in the following languages: ${languages.join(', ')}. Structure as bullet points.`;
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });
  return response.choices[0].message.content;
}

async function generateVideo(topic) {
  // Synthesia API call (simplified)
  const video = await synthesia.generateVideo({
    script: `Explain ${topic} in simple terms.`,
    avatar: 'default',
  });
  return video.url; // Assume it returns a URL
}

async function chatWithTutor(question, context) {
  const response = await gemini.generateText({
    prompt: `Answer as an AI tutor for ${context}: ${question}`,
  });
  return response.text;
}

module.exports = { generateNotes, generateVideo, chatWithTutor };