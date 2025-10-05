import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Chatbot({ onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to the Space Chatroom! How can I assist you today?",
      sender: "bot",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = {
      id: messages.length + 1,
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // server exposes Gemini chat at /api/gemini/chat (server default port 3000)
      const res = await axios.post("http://localhost:3000/api/gemini/chat", { message: currentInput });
      const botMsg = {
        id: messages.length + 2,
        sender: "bot",
        text: res.data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, {
        id: prev.length + 1,
        sender: "bot",
        text: "Error: could not reach the backend",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
    
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      width: "90%",
      maxWidth: "900px",
      height: "85vh",
      maxHeight: "700px",
      background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)",
      borderRadius: "24px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "20px 24px",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px"
            }}>
              🤖
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.3em" }}>AI Space Assistant</h2>
              <p style={{ margin: 0, fontSize: "0.85em", opacity: 0.9 }}>
                {isLoading ? "Typing..." : "Online"}
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "white",
                padding: "10px 14px",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "1.2em",
                fontWeight: "bold",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.background = "rgba(255, 255, 255, 0.3)"}
              onMouseLeave={(e) => e.target.style.background = "rgba(255, 255, 255, 0.2)"}
            >
              ✕
            </button>
          )}
        </div>

        {/* Messages Container */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px",
          background: "transparent"
        }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: "flex",
                justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: "16px",
                opacity: 1,
                transform: "translateY(0)",
                transition: "all 0.3s ease"
              }}
            >
              <div style={{
                maxWidth: "70%",
                display: "flex",
                flexDirection: "column",
                alignItems: message.sender === "user" ? "flex-end" : "flex-start"
              }}>
                <div style={{
                  background: message.sender === "user" 
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "white",
                  color: message.sender === "user" ? "white" : "#333",
                  padding: "12px 16px",
                  borderRadius: message.sender === "user" 
                    ? "20px 20px 4px 20px"
                    : "20px 20px 20px 4px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  wordWrap: "break-word",
                  textAlign: "left"
                }}>
                  {message.text}
                </div>
                <span style={{
                  fontSize: "0.75em",
                  color: "#ddd",
                  marginTop: "4px",
                  padding: "0 4px"
                }}>
                  {message.time}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          padding: "20px 24px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
          display: "flex",
          gap: "12px"
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message to space..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: "12px 16px",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "20px",
              fontSize: "0.95em",
              outline: "none",
              transition: "border-color 0.2s",
              opacity: isLoading ? 0.6 : 1,
              background: "rgba(255, 255, 255, 0.9)",
              color: "#333"
            }}
            onFocus={(e) => e.target.style.borderColor = "#667eea"}
            onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.3)"}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            style={{
              background: isLoading 
                ? "#ccc" 
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "20px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: "0.95em",
              fontWeight: "600",
              transition: "transform 0.2s",
              boxShadow: "0 2px 10px rgba(102, 126, 234, 0.3)"
            }}
            onMouseEnter={(e) => !isLoading && (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
      </div>
    </div>
  );
}