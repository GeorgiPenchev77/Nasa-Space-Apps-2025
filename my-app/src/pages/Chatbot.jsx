import React, { useState, useRef, useEffect } from "react";
import apiClient from "../utils/apiClient";

export default function Chatbot({ onClose }) {
  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      text: "Welcome to the Space Chatroom! How can I assist you today?",
      sender: "bot",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addMessage = (text, sender = "bot") => {
    const newMessage = {
      id: Date.now() + Math.random(), // Ensure unique ID
      sender,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    
    // Validate input
    if (!trimmedInput) return;
    
    // Prevent sending while loading
    if (isLoading) return;

    // Clear any previous errors
    setError(null);

    // Add user message
    addMessage(trimmedInput, "user");
    
    // Clear input immediately for better UX
    setInput("");
    setIsLoading(true);

    try {
      // Call API
      const { reply } = await apiClient.gemini.chat(trimmedInput);
      
      // Add bot response
      addMessage(reply, "bot");
    } catch (err) {
      console.error("Chat error:", err);
      
      // Show error message to user
      const errorMsg = err.message || "Failed to get response from AI. Please try again.";
      addMessage(`❌ ${errorMsg}`, "bot");
      setError(errorMsg);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
      // Refocus input after sending
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    // Send on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.avatar}>🤖</div>
          <div>
            <h2 style={styles.title}>AI Space Assistant</h2>
            <p style={styles.status}>
              {isLoading ? "Typing..." : "Online"}
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          style={styles.closeButton}
          onMouseEnter={(e) => e.target.style.background = "rgba(255, 255, 255, 0.3)"}
          onMouseLeave={(e) => e.target.style.background = "rgba(255, 255, 255, 0.2)"}
          aria-label="Close chat"
        >
          ✕
        </button>
      </div>

      {/* Messages Container */}
      <div style={styles.messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              ...styles.messageWrapper,
              justifyContent: message.sender === "user" ? "flex-end" : "flex-start"
            }}
          >
            <div style={styles.messageGroup}>
              <div
                style={{
                  ...styles.messageBubble,
                  ...(message.sender === "user" ? styles.userBubble : styles.botBubble)
                }}
              >
                {message.text}
              </div>
              <span style={styles.timestamp}>
                {message.time}
              </span>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div style={styles.messageWrapper}>
            <div style={styles.messageGroup}>
              <div style={{ ...styles.messageBubble, ...styles.botBubble }}>
                <span style={styles.loadingDots}>●●●</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Error Banner */}
      {error && (
        <div style={styles.errorBanner}>
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Input Area */}
      <div style={styles.inputArea}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message to space..."
          disabled={isLoading}
          style={{
            ...styles.input,
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? "not-allowed" : "text"
          }}
          onFocus={(e) => e.target.style.borderColor = "#667eea"}
          onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.3)"}
          maxLength={500}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          style={{
            ...styles.sendButton,
            background: (isLoading || !input.trim())
              ? "#ccc" 
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            cursor: (isLoading || !input.trim()) ? "not-allowed" : "pointer"
          }}
          onMouseEnter={(e) => {
            if (!isLoading && input.trim()) {
              e.target.style.transform = "scale(1.05)";
            }
          }}
          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          aria-label="Send message"
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

// Styles object for better organization
const styles = {
  container: {
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
  },
  
  header: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px 24px",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0
  },
  
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  
  avatar: {
    width: "40px",
    height: "40px",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px"
  },
  
  title: {
    margin: 0,
    fontSize: "1.3em",
    fontWeight: "600"
  },
  
  status: {
    margin: 0,
    fontSize: "0.85em",
    opacity: 0.9
  },
  
  closeButton: {
    background: "rgba(255, 255, 255, 0.2)",
    border: "none",
    color: "white",
    padding: "10px",
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
  },
  
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "24px",
    background: "transparent",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  
  messageWrapper: {
    display: "flex",
    opacity: 1,
    transform: "translateY(0)",
    transition: "all 0.3s ease"
  },
  
  messageGroup: {
    maxWidth: "70%",
    display: "flex",
    flexDirection: "column"
  },
  
  messageBubble: {
    padding: "12px 16px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    wordWrap: "break-word",
    textAlign: "left",
    lineHeight: "1.5"
  },
  
  userBubble: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    borderRadius: "20px 20px 4px 20px",
    marginLeft: "auto"
  },
  
  botBubble: {
    background: "white",
    color: "#333",
    borderRadius: "20px 20px 20px 4px"
  },
  
  timestamp: {
    fontSize: "0.75em",
    color: "#ddd",
    marginTop: "4px",
    padding: "0 4px"
  },
  
  loadingDots: {
    fontSize: "1.2em",
    letterSpacing: "2px",
    animation: "pulse 1.5s ease-in-out infinite"
  },
  
  errorBanner: {
    background: "rgba(220, 53, 69, 0.9)",
    color: "white",
    padding: "12px 24px",
    textAlign: "center",
    fontSize: "0.9em",
    fontWeight: "500"
  },
  
  inputArea: {
    padding: "20px 24px",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
    display: "flex",
    gap: "12px",
    flexShrink: 0
  },
  
  input: {
    flex: 1,
    padding: "12px 16px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "20px",
    fontSize: "0.95em",
    outline: "none",
    transition: "border-color 0.2s",
    background: "rgba(255, 255, 255, 0.9)",
    color: "#333"
  },
  
  sendButton: {
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "20px",
    fontSize: "0.95em",
    fontWeight: "600",
    transition: "transform 0.2s",
    boxShadow: "0 2px 10px rgba(102, 126, 234, 0.3)"
  }
};