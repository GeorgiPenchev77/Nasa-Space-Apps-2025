import React, { useState } from 'react';
import { useChat } from '../utils/chatContext';

export default function FloatingChatButton() {
  const { openChat } = useChat();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={openChat}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        bottom: '40px',
        right: '40px',
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '35px',
        boxShadow: isHovered 
          ? '0 8px 30px rgba(102, 126, 234, 0.5)' 
          : '0 4px 20px rgba(0, 0, 0, 0.3)',
        zIndex: 999,
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        transition: 'all 0.3s ease'
      }}
      role="button"
      aria-label="Open chat"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          openChat();
        }
      }}
    >
      🤖
    </div>
  );
}