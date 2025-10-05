import React, { useState } from "react";
import axios from "axios";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setError(null);
    setLoading(true);

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      // Relative path; dev server or proxy should forward to backend at /api/gemini/chat
      const res = await axios.post('/api/gemini/chat', { message: input });
      const botText = res?.data?.reply ?? res?.data?.responseText ?? '(no reply)';
      const botMsg = { sender: 'bot', text: botText };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error', err);
      const status = err?.response?.status;
      const body = err?.response?.data;
      const serverMsg = body?.error || body?.reply || body?.responseText || null;
      const msg = serverMsg ? `Error ${status || ''}: ${serverMsg}` : (err.message || 'Unknown error');
      setError(msg);
      setMessages((prev) => [...prev, { sender: 'bot', text: `Error: ${msg}` }]);
    } finally {
      setLoading(false);
    }

    setInput("");
  };

  return (
    <div style={{ marginTop: "2rem", textAlign: "left" }}>
      <h2>🚀 Chatbot</h2>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "1rem",
          maxHeight: "300px",
          overflowY: "auto",
          marginBottom: "1rem",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "0.5rem" }}>
            <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            width: "70%",
            padding: "0.5rem",
            marginRight: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "0.5rem 1rem",
            border: "none",
            backgroundColor: "#646cff",
            color: "white",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
