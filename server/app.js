import express from "express";
import cors from "cors";
import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/simplify", async(req, res) => {

try{
  const text = req.body.text;

  if(!text) {
      return res.status(400).json({ error: "Query is required" });
    }

  const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});

  const prompt = "Explain in simpler terms(under 50 words) the following: " + text;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  console.log(responseText);  
  console.log(text);
  }
  catch(error){
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }

});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
