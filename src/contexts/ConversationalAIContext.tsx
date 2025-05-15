
import React, { createContext, useContext, useState } from 'react';

type Message = {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
};

type ConversationalAIContextType = {
  isOpen: boolean;
  toggleChat: () => void;
  messages: Message[];
  addMessage: (content: string, role: 'user' | 'ai') => void;
  clearMessages: () => void;
};

const ConversationalAIContext = createContext<ConversationalAIContextType>({
  isOpen: false,
  toggleChat: () => {},
  messages: [],
  addMessage: () => {},
  clearMessages: () => {},
});

export const useConversationalAI = () => useContext(ConversationalAIContext);

export const ConversationalAIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  const addMessage = (content: string, role: 'user' | 'ai') => {
    const newMessage: Message = {
      role,
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ConversationalAIContext.Provider 
      value={{ 
        isOpen,
        toggleChat, 
        messages,
        addMessage,
        clearMessages
      }}
    >
      {children}
    </ConversationalAIContext.Provider>
  );
};
