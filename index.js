const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple test route
app.get('/', (req, res) => {
  res.send('🧠 The Ark AI Backend is working!');
});

// AI response route
app.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    const chat = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ response: chat.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});

