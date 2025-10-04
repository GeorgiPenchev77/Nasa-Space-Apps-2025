import React, {useEffect, useState} from "react";

export default function ArticleReader(){

    const [selectedArticle, setSelectedArticle] = useState(null);
    const [articleText    , setArticleText    ] = useState("");
    const [loading,              setLoading] = useState(false);
    const [explanation, setExplanation] = useState(null);


    const loadArticle = async (link) => {
        try {
            setLoading(true);
            setExplanation(null);
            setArticleText("");

            //extract PMC code
            const match = link.match(/PMC\d+/);
            if(!match) throw new Error("Not a valid PMC link.");
            const pmcId = match[0];

            const xmlUrl = `http://localhost:3000/api/get-pmc-xml?pmcId=${pmcId}`;
            const res = await fetch(xmlUrl);
            const xmlText = await res.text();

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");

            const passages = Array.from(xmlDoc.getElementsByTagName("passage"));
            const textContent = passages
            .map(p => p.getElementsByTagName("text")[0]?.textContent || "")
            .join("\n\n");

            setArticleText(textContent);
            setSelectedArticle(link);
            } catch (err) {
      console.error(err);
      alert("Could not load article text.");
    } finally {
      setLoading(false);
        }
    };

    
  // Handle text selection → call explain endpoint
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
      <h1 className="text-3xl font-bold mb-4">Publications</h1>

            <button
              onClick={() => loadArticle("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5515519/")}
              className="text-blue-600 hover:underline"
            >
            </button>
         

      {loading && <p>Loading article...</p>}

      {articleText && (
        <div>
          <h2 className="text-2xl font-semibold mb-2">Article</h2>
          <div
            className="border rounded p-4 whitespace-pre-wrap leading-relaxed"
            onDoubleClick={handleDoubleClick}
          >
            {articleText}
          </div>
        </div>
      )}

      {explanation && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          <strong>Explanation:</strong>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
}
