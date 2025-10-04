import express from "express";
import cors from "cors";
import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ------------------------------------------------------------------------------------------------------------------------------------ //

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

app.post("/api/simplify", async(req, res) => {

try{
  const text = req.body.text;

  if(!text) {
      return res.status(400).json({ error: "Query is required" });
    }

  const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});

  const prompt = "Explain in simpler terms(under 50 words) the following: " + text;
  console.log(prompt); // debug the prompt
  
  const result = await model.generateContent(prompt);  
  const responseText = result.response.text();

  res.json({ responseText });
  }
  catch(error){
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }

});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
