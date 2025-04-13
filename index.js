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

  // ✅ Hardcoded response for now (instead of calling OpenAI)
  res.json({
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
      },
      {
        title: "AI in National Security and Defense",
        content: "The adoption of AI in national security and defense is transforming military operations, intelligence analysis, and cybersecurity. AI-driven technologies can enhance decision-making, automate surveillance, and improve threat detection. However, the deployment of AI in this domain necessitates stringent oversight to prevent misuse and ensure compliance with international laws."
      },
      {
        title: "Public Perception and Trust in AI",
        content: "Public perception and trust in AI are pivotal to its widespread acceptance and success. Efforts to educate the public about AI, its benefits, and potential risks are essential. Transparency in AI development processes and outcomes can help build trust, dispel myths, and foster a collaborative environment for AI innovation."
      }
    ]
  });
});


// ✅ Start the server
app.listen(port, () => {
  console.log(`🚀 AI server is running on port ${port}`);
});
