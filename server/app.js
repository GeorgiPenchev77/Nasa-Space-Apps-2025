import express from "express";
import cors from "cors";
import 'dotenv/config';
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) return res.status(400).json({ error: "Missing 'text'" });

    const response = await client.responses.create({
      model: "gpt-5",
      input: `Summarize this research article:\n\n${text}`,
    });

    res.json({
      summary: response.output[0].content[0].text,
    });

  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
