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
const prompt = `
  You are an expert knowledge architect AI.

  Your task: Given the summary below, generate a structured JSON representing a knowledge complex.

  Summary: "${summary}"

  Respond ONLY with a JSON object in this format:

  {
    "title": "Your generated complex title",
    "cells": [
      {
        "title": "Cell title 1",
        "content": "Explanation or insight for cell 1"
      },
      {
        "title": "Cell title 2",
        "content": "Explanation or insight for cell 2"
      },
      {
        "title": "Cell title 3",
        "content": "Explanation or insight for cell 3"
      }
    ]
  }

  Each cell should explain one key idea clearly.
  Only return valid JSON, nothing else.
`;


    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o-2024-05-13",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const raw = chatCompletion.choices[0].message.content;

    try {
      const parsed = JSON.parse(raw);
      res.json(parsed);
    } catch (jsonError) {
      console.error("❌ Failed to parse JSON:", jsonError.message);
      console.error("⚠️ Raw AI Response:", raw);
      res.status(500).json({ error: "Invalid AI JSON output" });
    }
  } catch (err) {
    console.error("❌ AI Request Error:", err.message);
    res.status(500).json({ error: "AI request failed" });
  }
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 The Ark AI server is running on port ${port}`);
});


