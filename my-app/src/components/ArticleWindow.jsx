import { ExternalLink } from "lucide-react";

export default function ArticleWindow({ article }) {
  if (!article) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-300 text-lg">
        Select an article to view details.
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg text-white overflow-y-auto max-h-[85vh]">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
        {article.title}
      </h2>
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-indigo-300 hover:text-indigo-200 transition-colors"
      >
        Read full article <ExternalLink size={16} />
      </a>
      <p className="mt-6 text-gray-200 opacity-80">
        {/* You can later render article abstract or metadata here */}
        This is where the article content or preview will appear.
      </p>
    </div>
  );
}
