// ✅ index.js
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai'); // openai@beta version
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Toggle between hardcoded test and real AI
const useTestMode = false; // 🔁 Change to true for hardcoded test

// ✅ Health check
app.get('/', (req, res) => {
  res.send('🧠 The Ark AI Backend is working!');
});

// ✅ AI Generation Route
app.post('/generate', async (req, res) => {
  const { summary } = req.body;

  if (!summary) {
    return res.status(400).json({ error: "Missing summary" });
  }

  // ✅ TEST MODE — returns fixed response
  if (useTestMode) {
    return res.json({
      title: "Shaping Tomorrow: The Future of AI in the United States",
      cells: [
        {
          title: "Economic Impact and Job Market Transformation",
          content: "AI is poised to reshape the economy by automating routine tasks, enhancing productivity, and creating new job categories. However, this transformation will require a strategic approach to workforce retraining and education to mitigate job displacement and ensure equitable growth."
        },
        {
          title: "AI in Healthcare: Revolutionizing Patient Care",
          content: "AI technologies are revolutionizing healthcare by improving diagnostic accuracy, personalizing treatment plans, and enhancing patient monitoring. The integration of AI in healthcare promises to increase efficiency, reduce costs, and improve patient outcomes, but also raises important ethical and privacy concerns that must be addressed."
        },
        {
          title: "Ethical and Regulatory Frameworks",
          content: "As AI becomes more integrated into society, developing robust ethical and regulatory frameworks is crucial. These frameworks need to address issues such as data privacy, algorithmic bias, and accountability to ensure that AI technologies are developed and deployed responsibly, fostering public trust and safeguarding individual rights."
        }
      ]
    });
  }

  // ✅ REAL AI MODE

  try {
    const prompt = `
  You are an expert knowledge architect AI.

  Your task: Given the summary below, generate a structured JSON representing a knowledge complex.

  Only respond with valid JSON. Do not include markdown, bullet points, or commentary.

  Use this format exactly:

  {
    "title": "The generated complex title",
    "cells": [
      {
        "title": "First cell title",
        "content": "Explanation or insight for the first cell"
      },
      {
        "title": "Second cell title",
        "content": "Explanation or insight for the second cell"
      },
      {
        "title": "Third cell title",
        "content": "Explanation or insight for the third cell"
      }
    ]
  }

  Summary: "${summary}"
  `;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o-2024-05-13",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    let raw = chatCompletion.choices[0].message.content.trim();

    if (raw.startsWith("```")) {
      raw = raw.replace(/```(?:json)?|```/g, "").trim();
    }
    console.log("🤖 Raw AI Response:\n", raw);
    const parsed = JSON.parse(raw);
    res.json(parsed);

  } catch (err) {
    console.error("❌ Failed to process AI response:", err.message);
    res.status(500).json({ error: "Invalid AI JSON output or request failed" });
  }

});
// ✅ AI Title + Summary Generation Route
app.post('/generate-title-summary', async (req, res) => {
  const { title, tone } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Missing title" });
  }

  try {
    const prompt = `
You are a knowledge architect AI.

Given a topic title: "${title}"
Generate:
1. A polished or creative version of the title (based on tone)
2. A short, compelling summary of what the complex could explore

Tone: ${tone || 'default'}

Only respond with a JSON like this:

{
  "title": "Refined title",
  "summary": "Short summary for the complex"
}

Do NOT include any text outside of the JSON object.
    `;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o-2024-05-13",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    let raw = chatCompletion.choices[0].message.content.trim();

    // Clean out markdown if necessary
    if (raw.startsWith("```")) {
      raw = raw.replace(/```(?:json)?|```/g, "").trim();
    }

    const parsed = JSON.parse(raw);
    res.json(parsed);

  } catch (err) {
    console.error("❌ Title + Summary AI Error:", err.message);
    res.status(500).json({ error: "Failed to generate title and summary" });
  }
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 The Ark AI server is running on port ${port}`);
});


