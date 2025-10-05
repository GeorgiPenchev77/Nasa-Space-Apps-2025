import React from 'react';
import { useChat } from '../utils/chatContext';
import Chatbot from '../pages/Chatbot';

export default function ChatbotPopup() {
  const { isChatOpen, closeChat } = useChat();

  if (!isChatOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
      onClick={closeChat}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <Chatbot onClose={closeChat} />
      </div>
    </div>
  );
}