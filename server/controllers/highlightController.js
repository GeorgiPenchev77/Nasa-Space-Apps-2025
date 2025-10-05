import { getGeminiModel } from "../utils/geminiClient.js";

export async function handleHighlight(req, res) {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    // Reuse your existing Gemini setup
    const model = getGeminiModel("gemini-2.5-flash");
    const prompt = `Give a short, helpful explanation or related insight about: "${text}"`;
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ result: response });
  } catch (err) {
    console.error("Highlight error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
