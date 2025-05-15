
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConversationalAI } from '@/contexts/ConversationalAIContext';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

const ChatButton: React.FC = () => {
  const { toggleChat, isOpen } = useConversationalAI();
  const { isDarkMode } = useTheme();
  
  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={toggleChat}
      className={cn(
        "rounded-full relative",
        isOpen && (isDarkMode ? "bg-gray-800" : "bg-gray-200")
      )}
      aria-label="Open chat assistant"
    >
      <MessageCircle className="h-5 w-5" />
      {/* Optional: Add a pulse effect when not open */}
      {!isOpen && (
        <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-pulse-glow"></span>
      )}
    </Button>
  );
};

export default ChatButton;
