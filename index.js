const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ OpenAI Initialization
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Test route
app.get('/', (req, res) => {
  res.send('🧠 The Ark AI Backend is working!');
});

// ✅ Main AI generation route
app.post('/generate', async (req, res) => {
  const { summary } = req.body;

  if (!summary) {
    return res.status(400).json({ error: "Missing summary" });
  }

  try {
    const prompt = `
You are an expert knowledge architect AI.
Given the following summary, generate an intelligent complex structure:
Summary: "${summary}"

Return:
1. A compelling title.
2. 3–5 cell ideas, each with:
  - title
  - content (explanation or insight)

Format the response as JSON like:
{
  "title": "...",
  "cells": [
    { "title": "...", "content": "..." },
    { "title": "...", "content": "..." }
  ]
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const raw = completion.choices[0].message.content;

    try {
      const parsed = JSON.parse(raw);
      res.json(parsed);
    } catch (jsonErr) {
      console.error("❌ Failed to parse JSON:", jsonErr.message);
      res.status(500).json({ error: "Invalid AI JSON output" });
    }

  } catch (err) {
    console.error("❌ OpenAI Error:", err.message);
    res.status(500).json({ error: "AI request failed" });
  }
});

// ✅ Start the server
app.listen(port, () => {
  console.log(`🚀 AI server listening on port ${port}`);
});


