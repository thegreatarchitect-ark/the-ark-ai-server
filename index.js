// index.js
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai'); // With openai@beta installed
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Initialize OpenAI client (sk-proj-... compatible)
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

  // ✅  OpenAI Response
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-4o-2024-05-13",
    messages: [
      {
        role: "user",
        content: `
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
  `
      }
    ],
    temperature: 0.7
  });

  const raw = chatCompletion.choices[0].message.content;

  // Robust JSON parser
  try {
    const parsed = JSON.parse(raw);
    res.json(parsed);
  } catch (jsonError) {
    console.error("❌ Failed to parse JSON:", jsonError.message);
    console.error("⚠️ Raw AI Response:", raw);
    res.status(500).json({ error: "Invalid AI JSON output from GPT." });
  }


// ✅ Start the server
app.listen(port, () => {
  console.log(`🚀 AI server is running on port ${port}`);
});
