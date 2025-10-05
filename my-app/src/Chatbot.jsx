import React, { useState } from "react";
import axios from "axios";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
  // server exposes Gemini chat at /api/gemini/chat (server default port 3000)
  const res = await axios.post("http://localhost:3000/api/gemini/chat", { message: input });
      const botMsg = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { sender: "bot", text: "Error: could not reach the backend" }]);
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
