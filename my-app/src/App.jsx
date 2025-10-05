import React from 'react';
import { Router, Route } from './utils/router';
import { ChatProvider } from './utils/chatContext';
import ChatbotPopup from './components/ChatbotPopup';
import HomePage from './pages/Home';
import ArticleViewerPage from './pages/ArticleViewer';
import './App.css';

function App() {
  return (
    <ChatProvider>
      <Router>
        <Route path="/" component={HomePage} />
        <Route path="/articles/:tag" component={ArticleViewerPage} />
        
        {/* Global Chatbot Popup - appears on all pages */}
        <ChatbotPopup />
      </Router>
    </ChatProvider>
  );
}

export default App;