import searchCSV from "../utils/search.js";

export const searchLinks = async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query is required" });

  try {
    const results = await searchCSV(query);
    const links = results
      .map(r => r.link) // take the link field directly
      .filter(link => typeof link === "string" && link.startsWith("http"))
      .filter((link, idx, arr) => arr.indexOf(link) === idx); // deduplicate

    res.json({ query, links });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to search CSV files" });
  }
};
