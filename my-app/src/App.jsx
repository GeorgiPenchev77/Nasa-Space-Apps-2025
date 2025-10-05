import React from "react";
import { RouterProvider, Link } from "react-router-dom";
import router from "./router";

export default function App() {
  return (
    <RouterProvider router={router}>
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">Article Explorer</h1>
            <nav className="space-x-6 text-sm font-medium">
              <Link to="/" className="hover:text-blue-600 transition">Home</Link>
              <Link to="/biology/articles" className="hover:text-blue-600 transition">Biology</Link>
              <Link to="/chemistry/articles" className="hover:text-blue-600 transition">Chemistry</Link>
              <Link to="/chatbot" className="hover:text-blue-600 transition">Chatbot</Link>
            </nav>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8" />

        {/* Footer */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-6xl mx-auto px-6 py-6 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Article Explorer — Built with React + Tailwind
          </div>
        </footer>
      </div>
    </RouterProvider>
  );
}
