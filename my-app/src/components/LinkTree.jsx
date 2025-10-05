import React from "react";

// Minimal Button component
export const Button = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md font-medium transition ${className}`}
  >
    {children}
  </button>
);

// Minimal Card + CardContent components
export const Card = ({ children, className = "" }) => (
  <div className={`bg-white shadow border rounded-xl ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

// Minimal ExternalLink icon
export const ExternalLink = ({ size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const LinkTree = ({ articles = [], onClick }) => {
  if (!articles.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <p className="text-lg font-medium">
          Sadly, no articles exist for this tag, but come back tomorrow!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Related Articles
      </h2>

      <div className="space-y-4">
        {articles.map((article, index) => (
          <Card
            key={index}
            className="flex justify-between items-center p-4 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100"
          >
            <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full p-0">
              <div className="flex-1 mb-3 sm:mb-0">
                <h3 className="font-medium text-gray-800 text-lg">
                  {article.title}
                </h3>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  Visit Article <ExternalLink size={14} />
                </a>
              </div>

              <Button
                onClick={() => onClick(article.url)}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
              >
                Load Article
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LinkTree;
