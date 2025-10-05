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
          Content: """${content.slice(0, 2000)}"""  // limit content size
          
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

const cachePath = path.join(process.cwd(), "../../resources/cache", "tags.json");

export const buildTagCache = async () => {
  console.log("Building tag cache (batch mode)...");

  const results = await searchCSV(""); // load all publications
  const model = getGeminiModel("gemini-2.5-flash"); // fast & cheap model
  const tagMap = {};

  // Helper: split array into chunks of N
  const chunkArray = (arr, size) =>
    arr.reduce((acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);

  const allArticles = results
    .map(r => ({
      title: Object.values(r.row)[0],
      url: Object.values(r.row)[1],
    }))
    .filter(a => a.title && a.url);

  const BATCH_SIZE = 20; // number of titles per prompt
  const batches = chunkArray(allArticles, BATCH_SIZE);

  for (const [i, batch] of batches.entries()) {
    console.log(`Processing batch ${i + 1}/${batches.length} (${batch.length} titles)`);

    const titlesList = batch.map(a => a.title).join("\n");
    const prompt = `
      Generate 2–3 short descriptive tags for each of the following article titles.
      Return ONLY valid JSON mapping titles to an array of tags.

      Example:
      {
        "AI in Healthcare": ["AI", "Healthcare"],
        "Cancer Genomics": ["Cancer", "Genomics"]
      }

      Titles:
      ${titlesList}
    `;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      let tagResults;
      try {
        tagResults = JSON.parse(text);
      } catch (err) {
        console.warn("JSON parse error, attempting to repair response...");
        const fixed = text
          .replace(/```json|```/g, "")
          .trim();
        tagResults = JSON.parse(fixed);
      }

      // Merge batch results into master tagMap
      for (const [title, tags] of Object.entries(tagResults)) {
        const article = batch.find(a => a.title === title);
        if (!article) continue;

        for (const tag of tags) {
          if (!tagMap[tag]) tagMap[tag] = [];
          tagMap[tag].push(article.title, article.url);
        }
      }

      // Optional small delay to stay under RPM limits
      await new Promise(res => setTimeout(res, 2000));
    } catch (err) {
      console.error(`Batch ${i + 1} failed:`, err.message);
    }
  }

  fs.mkdirSync(path.dirname(cachePath), { recursive: true });
  fs.writeFileSync(cachePath, JSON.stringify(tagMap, null, 2));
  console.log(`Tag cache built (${Object.keys(tagMap).length} tags total)`);

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
