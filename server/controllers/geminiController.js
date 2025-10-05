import { getGeminiModel } from "../utils/geminiClient.js";

// helper to clean and format text as a single readable string
const formatText = (text) => {
  return text
    .replace(/(\*\*|\*)/g, "")     // remove Markdown bold/italic
    .replace(/\\n/g, " ")          // remove escaped newlines
    .replace(/\n/g, " ")           // remove actual newlines
    .replace(/ +/g, " ")           // normalize extra spaces
    .replace(/([a-zA-Z0-9])\.([A-Z])/g, "$1. $2") // ensure spacing after periods
    .trim();
};

export const chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const model = getGeminiModel("gemini-2.5-pro");
    const result = await model.generateContent(message);
    const reply = formatText(result.response.text());

    res.json({ reply });
  } catch (error) {
    console.error("Gemini chat error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
};

export const simplify = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const model = getGeminiModel("gemini-2.5-flash");
    const prompt = `Explain in simpler terms (under 50 words): ${text}`;
    const result = await model.generateContent(prompt);
    const responseText = formatText(result.response.text());

    res.json({ reply: responseText });
  } catch (error) {
    console.error("Gemini simplify error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
};
