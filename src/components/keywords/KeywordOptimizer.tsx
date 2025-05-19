
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useMarketingTool } from '@/contexts/MarketingToolContext';

interface KeywordOptimizerProps {
  onGenerateMore: () => Promise<void>;
}

const KeywordOptimizer: React.FC<KeywordOptimizerProps> = ({ onGenerateMore }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { keywords } = useMarketingTool();

  const handleGenerateMoreClick = async () => {
    if (!localStorage.getItem('developer_token')) {
      toast.error('Developer token is required for generating more keywords');
      return;
    }

    setIsGenerating(true);
    try {
      await onGenerateMore();
      toast.success('Additional keywords generated successfully!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate additional keywords');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      onClick={handleGenerateMoreClick}
      className="relative overflow-hidden transition-all duration-300 bg-marketing-600 hover:bg-marketing-700 text-white"
      disabled={isGenerating || keywords.length === 0}
    >
      <span className="flex items-center">
        <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
        Generate More Keywords
      </span>
      {isGenerating && (
        <span className="absolute inset-0 flex items-center justify-center bg-marketing-600/80">
          <div className="h-2 w-24 overflow-hidden rounded-full bg-white/20">
            <div 
              className="h-full bg-white animate-[slide-in-right_1.5s_ease-in-out_infinite]" 
              style={{width: '30%'}}
            ></div>
          </div>
        </span>
      )}
    </Button>
  );
};

export default KeywordOptimizer;
