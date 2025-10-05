import { getGeminiModel } from "../utils/geminiClient.js";

export async function handleHighlight(req, res) {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    // Reuse your existing Gemini setup
    const model = getGeminiModel("gemini-2.5-flash");
    const prompt = `
Explain the following text in simple, beginner-friendly terms, using short sentences.
Keep it under 3 sentences.
Text: "${text}"
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ result: response });
  } catch (err) {
    console.error("Highlight error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
