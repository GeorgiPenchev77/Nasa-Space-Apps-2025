import { useEffect, useState } from "react";

export default function ArticleSidebar({ articles, selectedId, onSelect }) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <aside className="w-full md:w-1/3 lg:w-1/4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg overflow-y-auto max-h-[85vh]">
      <h2 className="text-white text-lg font-semibold mb-3">Articles</h2>
      <ul className="space-y-2">
        {articles.map((article) => (
          <li
            key={article.id}
            onClick={() => onSelect(article.id)}
            onMouseEnter={() => setHoveredId(article.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`p-3 rounded-xl cursor-pointer transition-all ${
              article.id === selectedId
                ? "bg-gradient-to-r from-indigo-500/40 to-purple-500/40 text-white"
                : hoveredId === article.id
                ? "bg-white/20 text-white"
                : "text-gray-200"
            }`}
          >
            <p className="font-medium text-sm leading-snug">{article.title}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
