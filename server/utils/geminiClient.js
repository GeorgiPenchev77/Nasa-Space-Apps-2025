import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Ensure API key is available
if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in environment variables");
}

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Get a configured Gemini model instance.
 * @param {"gemini-2.5-pro" | "gemini-2.5-flash" | string} modelName
 * @returns {import("@google/generative-ai").GenerativeModel}
 */
export const getGeminiModel = (modelName = "gemini-2.5-pro") => {
  return genAI.getGenerativeModel({ model: modelName });
};

export default genAI;
