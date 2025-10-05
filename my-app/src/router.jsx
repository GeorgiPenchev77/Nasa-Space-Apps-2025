import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Chatbot from "./Chatbot";          // keep your existing Chatbot
import ArticleViewer from "./ArticleViewer";

// A simple Home page
const Home = () => (
  <div className="text-center py-12">
    <h2 className="text-3xl font-bold mb-4 text-blue-600">Welcome to Article Explorer</h2>
    <p className="text-gray-600 max-w-xl mx-auto">
      Browse scientific articles by tags. Use the navigation bar above to choose a topic and
      explore related publications. Double-click any loaded text to get AI-powered explanations.
    </p>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/:tag/articles",
    element: <ArticleViewer />
  },
  {
    path: "/chatbot",
    element: <Chatbot />
  }
]);

export default router;
