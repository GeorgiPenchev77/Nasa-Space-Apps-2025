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
              I’m your friendly astronaut.<br />How can I help you today?
            </p>
            

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
            width: "100px",
            height: "150px",
            cursor: "pointer",
          }}
          onClick={() => setOpen((prev) => !prev)}
        />
      </motion.div>
    </div>
  );
}
