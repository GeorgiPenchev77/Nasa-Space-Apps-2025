import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import searchCSV from './search.js';


// Load environment variables from .env
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    // Send user message to Gemini API
    const result = await model.generateContent(message);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});
// Search links endpoint
app.get('/search-links', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Query parameter required' });

  try {
    const results = await searchCSV(query);

    if (results.length === 0) {
      res.setHeader('Content-Type', 'application/json');
      return res.send(JSON.stringify({ query, links: [] }, null, 2));
    }

    const links = results
      .map(r => Object.values(r.row)[1]) // assuming second column = URL
      .filter(link => link)
      .filter((link, idx, arr) => arr.indexOf(link) === idx); // remove duplicates
    
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ query, links }, null, 2));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search CSV files' });
  }
});






// Root route
app.get("/", (req, res) => {
  res.send("Google AI Chat API is running 🚀");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
