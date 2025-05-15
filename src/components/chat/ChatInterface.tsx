
import React, { useRef, useState, useEffect } from 'react';
import { useConversationalAI } from '@/contexts/ConversationalAIContext';
import { Send, X, ChevronDown, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

const ChatInterface: React.FC = () => {
  const { isOpen, toggleChat, messages, addMessage } = useConversationalAI();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isDarkMode } = useTheme();

  // Simulate AI response
  const handleAIResponse = (userMessage: string) => {
    // Wait a bit to simulate processing
    setTimeout(() => {
      const responses = [
        "I can help you create marketing content for your business.",
        "What kind of marketing materials are you looking to develop?",
        "Let me analyze your business info to suggest some marketing strategies.",
        "Would you like me to generate some content ideas based on your ICPs?",
        "I can help optimize your marketing for the geographies you've selected."
      ];
      
      // Choose a contextually appropriate response
      let response = responses[Math.floor(Math.random() * responses.length)];
      
      if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
        response = "Hello! How can I help with your marketing needs today?";
      } else if (userMessage.toLowerCase().includes('content')) {
        response = "I can help create various marketing content like blog posts, social media updates, or email campaigns. What are you interested in?";
      } else if (userMessage.toLowerCase().includes('analytics') || userMessage.toLowerCase().includes('data')) {
        response = "I can analyze your marketing data to provide insights and recommendations for improvement.";
      }
      
      addMessage(response, 'ai');
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;
    
    addMessage(input, 'user');
    handleAIResponse(input);
    setInput('');
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex flex-col",
      isDarkMode ? "bg-gray-900" : "bg-white"
    )}>
      <div className={cn(
        "flex items-center justify-between p-4 border-b",
        isDarkMode ? "border-gray-700" : "border-gray-200"
      )}>
        <div className="flex items-center gap-2">
          <Bot className={cn(
            "w-6 h-6",
            isDarkMode ? "text-purple-400" : "text-purple-600"
          )} />
          <h2 className="font-medium">Marketing Assistant</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleChat}
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className={cn(
        "flex-1 overflow-y-auto p-4",
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      )}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot className={cn(
              "w-12 h-12 mb-4",
              isDarkMode ? "text-purple-400" : "text-purple-600"
            )} />
            <h3 className="text-lg font-medium mb-2">How can I help with your marketing?</h3>
            <p className={cn(
              "max-w-md",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              Ask me about content creation, campaign ideas, or audience targeting based on your business information.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index}
              className={cn(
                "mb-4 max-w-3xl",
                msg.role === 'user' ? "ml-auto" : "mr-auto"
              )}
            >
              <div className={cn(
                "rounded-lg p-3",
                msg.role === 'user' 
                  ? isDarkMode 
                    ? "bg-purple-900 text-white" 
                    : "bg-purple-100 text-gray-800" 
                  : isDarkMode 
                    ? "bg-gray-800 text-white" 
                    : "bg-white text-gray-800 border border-gray-200"
              )}>
                {msg.content}
              </div>
              <div className={cn(
                "text-xs mt-1",
                isDarkMode ? "text-gray-500" : "text-gray-400",
                msg.role === 'user' ? "text-right" : "text-left"
              )}>
                {msg.role === 'user' ? 'You' : 'Marketing AI'} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form 
        onSubmit={handleSubmit}
        className={cn(
          "p-4 border-t flex items-center gap-2",
          isDarkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"
        )}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className={cn(
            "flex-1 px-4 py-2 rounded-full focus:outline-none",
            isDarkMode 
              ? "bg-gray-800 text-white border border-gray-700 focus:border-purple-500" 
              : "bg-gray-100 text-gray-800 focus:ring-2 focus:ring-purple-500 border border-gray-300"
          )}
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={input.trim() === ''}
          className={cn(
            "rounded-full",
            input.trim() === '' && "opacity-50"
          )}
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
