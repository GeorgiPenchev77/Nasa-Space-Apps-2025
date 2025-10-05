import { useState, useEffect } from "react";
import { useRouter } from "../utils/router";
import apiClient from "../utils/apiClient";
import FloatingChatButton from "../components/ChatbotButton";
import { ArrowLeft } from "lucide-react";
import ArticleSidebar from "../components/ArticleSidebar";
import ArticleWindow from "../components/ArticleWindow";

export default function ArticleViewerPage() {
  const { currentPath, goBack } = useRouter();
  const [articles, setArticles] = useState([]);
  const [tagName, setTagName] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadArticles();
  }, [currentPath]);

  const loadArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const pathParts = currentPath.split("/");
      const encodedTag = pathParts[pathParts.length - 1];
      const tag = decodeURIComponent(encodedTag);
      setTagName(tag);

      const tagsData = await apiClient.articles.getTags();

      if (tagsData[tag]) {
        const tagArray = tagsData[tag];
        const formatted = [];
        for (let i = 0; i < tagArray.length; i += 2) {
          formatted.push({
            id: i / 2,
            title: tagArray[i],
            url: tagArray[i + 1],
          });
        }
        setArticles(formatted);
        setSelectedArticle(formatted[0] || null);
      } else {
        setArticles([]);
        setSelectedArticle(null);
      }
    } catch (err) {
      console.error("Failed to load articles:", err);
      setError("Failed to load articles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-background min-h-screen pb-12 text-white">
      <div className="max-w-7xl mx-auto p-6">
        <button
          onClick={goBack}
          className="flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 transition-all text-white"
        >
          <ArrowLeft size={20} />
          Back to Tags
        </button>

        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
          {tagName}
        </h1>

        <p className="text-gray-300 mb-8">
          {loading
            ? "Loading..."
            : `${articles.length} ${articles.length === 1 ? "article" : "articles"} found`}
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 text-center mb-6">
            ⚠️ {error}
            <button
              onClick={loadArticles}
              className="block mx-auto mt-3 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="flex flex-col md:flex-row gap-6">
            <ArticleSidebar
              articles={articles}
              selectedId={selectedArticle?.id}
              onSelect={(id) => setSelectedArticle(articles.find((a) => a.id === id))}
            />
            <ArticleWindow article={selectedArticle} />
          </div>
        )}
      </div>
      <FloatingChatButton />
    </div>
  );
}
