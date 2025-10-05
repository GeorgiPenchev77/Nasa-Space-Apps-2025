import fs from "fs";
import path from "path";
import axios from "axios";
import { getGeminiModel } from "../utils/geminiClient.js";
import searchCSV from "../utils/search.js";

/**
 * Generate AI tags for articles based on their content
 */
export const generateTags = async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // Step 1: Find relevant articles in your CSV
    const results = await searchCSV(query);
    const articles = results
      .map(r => ({
        title: Object.values(r.row)[0],
        url: Object.values(r.row)[1],
      }))
      .filter(a => a.title && a.url)
      .slice(0, limit);

    if (articles.length === 0) {
      return res.status(404).json({ error: "No matching articles found" });
    }

    // Step 2: Prepare Gemini model
    const model = getGeminiModel("gemini-2.5-pro");

    // Step 3: Fetch article text and generate tags
    const taggedArticles = [];

    for (const article of articles) {
      try {
        const { data: content } = await axios.get(article.url, { timeout: 10000 });

        const prompt = `
          You are a helpful content classifier. 
          Read the following article and generate 3–7 short descriptive tags 
          (like topics, fields, or keywords) that summarize its content.

          Title: "${article.title}"
          Content: """${content.slice(0, 4000)}"""  // limit content size
          
          Respond ONLY in valid JSON array format. Example:
          ["AI", "Healthcare", "Innovation"]
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Try to parse the response into JSON
        let tags;
        try {
          tags = JSON.parse(text);
        } catch {
          // fallback: extract comma-separated text if JSON fails
          tags = text
            .replace(/[\[\]"]+/g, "")
            .split(/,|\n/)
            .map(t => t.trim())
            .filter(Boolean);
        }

        taggedArticles.push({ ...article, tags });
      } catch (err) {
        console.error(`Error processing ${article.url}:`, err.message);
        taggedArticles.push({ ...article, tags: ["Error fetching or tagging"] });
      }
    }

    // Step 4: Return all tagged articles
    res.json({ count: taggedArticles.length, results: taggedArticles });
  } catch (error) {
    console.error("Tag generation error:", error);
    res.status(500).json({ error: "Failed to generate tags" });
  }
};

const cachePath = path.join(process.cwd(), "cache", "tags.json");

export const buildTagCache = async () => {
  console.log("🔍 Building tag cache based on titles...");

  const results = await searchCSV(""); // get all publications
  const model = getGeminiModel("gemini-2.5-pro"); // faster, cheaper
  const tagMap = {};

  for (const [index, entry] of results.entries()) {
    const title = Object.values(entry.row)[0];
    const url = Object.values(entry.row)[1];
    if (!title || !url) continue;

    console.log(`📄 (${index + 1}/${results.length}) Tagging: "${title}"`);

    const prompt = `
      Generate 3 to 5 short descriptive tags that categorize the following article title.
      Keep the tags concise (1–3 words max), relevant, and general enough for grouping.
      Return ONLY a JSON array, e.g. ["AI", "Healthcare", "Diagnostics"].

      Title: "${title}"
    `;

    try {
      const result = await model.generateContent(prompt);
      const raw = result.response.text();

      let tags;
      try {
        tags = JSON.parse(raw);
      } catch {
        tags = raw
          .replace(/[\[\]"]+/g, "")
          .split(/,|\n/)
          .map(t => t.trim())
          .filter(Boolean);
      }

      for (const tag of tags) {
        if (!tagMap[tag]) tagMap[tag] = [];
        tagMap[tag].push(url);
      }
    } catch (err) {
      console.error(`❌ Error tagging "${title}":`, err.message);
    }
  }

  fs.mkdirSync(path.dirname(cachePath), { recursive: true });
  fs.writeFileSync(cachePath, JSON.stringify(tagMap, null, 2));

  console.log(`✅ Tag cache built (${Object.keys(tagMap).length} tags total)`);
  return tagMap;
};

/**
 * Returns cached tag map if available, otherwise builds it
 */
export const getTagMap = async (req, res) => {
  try {
    if (fs.existsSync(cachePath)) {
      const cached = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
      return res.json(cached);
    }

    const tags = await buildTagCache();
    res.json(tags);
  } catch (err) {
    console.error("❌ Tag map error:", err);
    res.status(500).json({ error: "Failed to build or read tag map" });
  }
};

/**
 * Force-refresh the cache manually
 */
export const refreshTagCache = async (req, res) => {
  try {
    const tags = await buildTagCache();
    res.json({ message: "✅ Tag cache refreshed", tags });
  } catch (err) {
    console.error("❌ Rebuild error:", err);
    res.status(500).json({ error: "Failed to rebuild tag cache" });
  }
};
