import React, { useState } from "react";
import { motion } from "framer-motion";
import lectonauta from "./assets/lectonauta-lectonautas.gif";

export default function AstronautPopup() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "fixed", bottom: "40px", right: "40px", zIndex: 1000 }}>
      {/* Motion container for both astronaut and bubble */}
      <motion.div
        animate={{ y: [0, -10, 0] }}  // floating animation
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "relative" }}
      >
        {/* Speech bubble */}
        {open && (
          <div
            style={{
              position: "absolute",
              bottom: "170px",  
              right: "-30px", 
              background: "#fff",
              borderRadius: "24px",
              padding: "20px 24px",
              width: "280px",    
              minHeight: "100px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              textAlign: "center",
              border: "2px dotted #b3b3b3",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "1.2em", color: "black" }}>
              👨‍🚀 Hey there, Earthling!
            </h2>
            <p style={{ margin: "10px 0 0 0", fontSize: "0.95em", color: "black" }}>
              I'm your friendly astronaut.<br />How can I help you today?
            </p>
            
            {/* Chat button */}
            <button
              onClick={() => window.location.href = '/chatroom'}
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "20px",
                fontSize: "0.9em",
                fontWeight: "600",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 2px 10px rgba(102, 126, 234, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 10px rgba(102, 126, 234, 0.3)";
              }}
            >
              🚀 Go to Chatroom
            </button>

            {/* Bubble tail */}
            <div
              style={{
                position: "absolute",
                bottom: "-16px",
                right: "40px",
                width: "16px",
                height: "16px",
                background: "#fff",
                borderBottom: "2px dotted #b3b3b3",
                borderRight: "2px dotted #b3b3b3",
                transform: "rotate(45deg)",
              }}
            />
          </div>
          
        )}
        

        {/* Floating astronaut */}
        <motion.img
          src={lectonauta}
          alt="Lectonauta"
          style={{
            width: "80px",
            height: "110px",
            cursor: "pointer",
          }}
          onClick={() => setOpen((prev) => !prev)}
        />
      </motion.div>
    </div>
  );
}
