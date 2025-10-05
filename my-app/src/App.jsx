import React from 'react';
import { Router, Route } from './utils/router';
import HomePage from './pages/Home';
import ChatPage from './pages/Chatbot';
import './App.css';

function App() {
  return (
    <Router>
      <Route path="/" component={HomePage} />
      <Route path="/chatbot" component={ChatPage} />
    </Router>
  );
}

export default App;
