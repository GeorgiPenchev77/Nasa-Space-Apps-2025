import React, { useState } from "react";
import { useParams } from "react-router-dom";
import LinkTree from "./components/LinkTree";
import data from "../../server/cache/tags.json"; // your raw JSON with alternating [title, url, title, url...]

// helper to normalize raw arrays into {title, url} objects
const normalizeArticles = (arr) => {
  const result = [];
  for (let i = 0; i < arr.length; i += 2) {
    result.push({ title: arr[i], url: arr[i + 1] });
  }
  return result;
};

export default function ArticleViewer() {
  const { tag } = "Mice";
  const [articleText, setArticleText] = useState("");
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState(null);

  // get raw data for this tag
  const rawArticles = data[tag] || [];
  // normalize if needed
  const articles =
    rawArticles.length && typeof rawArticles[0] === "string"
      ? normalizeArticles(rawArticles)
      : rawArticles;

  const loadArticle = async (link) => {
    try {
      setLoading(true);
      setExplanation(null);
      setArticleText("");

      const match = link.match(/PMC\d+/);
      if (!match) throw new Error("Not a valid PMC link.");
      const pmcId = match[0];

      const xmlUrl = `http://localhost:3000/api/pubs/get-xml?pmcId=${pmcId}`;
      const res = await fetch(xmlUrl);
      const xmlText = await res.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      const passages = Array.from(xmlDoc.getElementsByTagName("passage"));
      const textContent = passages
        .map((p) => p.getElementsByTagName("text")[0]?.textContent || "")
        .join("\n\n");

      setArticleText(textContent);
    } catch (err) {
      console.error(err);
      alert("Could not load article text.");
    } finally {
      setLoading(false);
    }
  };

  const handleDoubleClick = async () => {
    const selection = window.getSelection().toString().trim();
    if (!selection) return;

    try {
      setExplanation("Loading explanation...");
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: selection }),
      });
      const data = await res.json();
      setExplanation(data.explanation || "No explanation available.");
    } catch (err) {
      console.error(err);
      setExplanation("Error getting explanation.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Publications for {tag}</h1>

      <LinkTree articles={articles} onClick={loadArticle} />

      {loading && <p className="mt-4 text-blue-600">Loading article...</p>}

      {articleText && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Article</h2>
          <div
            className="bg-white border rounded-xl shadow-sm p-6 whitespace-pre-wrap leading-relaxed text-gray-800 prose max-w-none"
            onDoubleClick={handleDoubleClick}
          >
            {articleText}
          </div>
          <p className="mt-2 text-sm text-gray-400 italic">
            (Double-click any text to get an AI explanation)
          </p>
        </div>
      )}

      {explanation && (
        <div className="mt-6 p-5 border rounded-xl bg-blue-50 border-blue-200 shadow-sm">
          <strong className="block mb-2 text-blue-700">Explanation:</strong>
          <p className="text-gray-700">{explanation}</p>
        </div>
      )}
    </div>
  );
}
