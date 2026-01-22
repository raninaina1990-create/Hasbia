const express = require('express');
const { generateNotes, generateVideo } = require('../services/aiService');
const Topic = require('../models/Topic'); // MongoDB model

const router = express.Router();

// Generate content for a topic
router.post('/generate', async (req, res) => {
  const { topic, languages } = req.body;
  try {
    const notes = await generateNotes(topic, languages);
    const videoUrl = await generateVideo(topic);
    const newTopic = new Topic({ topic, notes, videoUrl, languages });
    await newTopic.save();
    res.json({ notes, videoUrl });
  } catch (error) {
    res.status(500).json({ error: 'Generation failed' });
  }
});

// Chat endpoint
router.post('/chat', async (req, res) => {
  const { question, context } = req.body;
  const answer = await chatWithTutor(question, context);
  res.json({ answer });
});

module.exports = router;