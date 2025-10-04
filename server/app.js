import express from "express";
import cors from "cors";
import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";
import searchCSV from './search.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ------------------------------------------------------------------------------------------------------------------------------------ //

// Chat endpoint -- needs some work in trimming the response and making it look good
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


// Search links endpoint - good
app.get('/search-links', async (req, res) => {
  const { query } = req.body;
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

app.get("/api/get-pmc-xml", async (req, res) => {
  const { pmcId } = req.query;
  if (!pmcId) return res.status(400).send("Missing pmcId");

  try {
    const xmlUrl = `https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pmcoa.cgi/BioC_xml/${pmcId}/unicode`;
    const response = await fetch(xmlUrl);

    if (!response.ok) throw new Error("Failed to fetch from NCBI");
    const xml = await response.text();

    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching XML" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
