
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useMarketingTool } from '@/contexts/MarketingToolContext';
import KeywordApiModal from './KeywordApiModal';

interface KeywordOptimizerProps {
  onOptimize: (apiKey: string) => Promise<void>;
}

const KeywordOptimizer: React.FC<KeywordOptimizerProps> = ({ onOptimize }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [hasOptimized, setHasOptimized] = useState(false);
  const { keywords } = useMarketingTool();

  const handleOptimizeClick = () => {
    if (!localStorage.getItem('google_keyword_api_key')) {
      setIsApiModalOpen(true);
    } else {
      runOptimization();
    }
  };

  const runOptimization = async () => {
    const apiKey = localStorage.getItem('google_keyword_api_key');
    if (!apiKey) {
      toast.error('API key is required for optimization');
      return;
    }

    setIsOptimizing(true);
    try {
      await onOptimize(apiKey);
      setHasOptimized(true);
      toast.success('Keywords optimized successfully!');
    } catch (error) {
      console.error('Optimization error:', error);
      toast.error('Failed to optimize keywords');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApiKeySave = async (apiKey: string) => {
    localStorage.setItem('google_keyword_api_key', apiKey);
    setIsApiModalOpen(false);
    runOptimization();
  };

  return (
    <>
      <Button 
        onClick={handleOptimizeClick}
        className={`relative overflow-hidden transition-all duration-300 ${
          hasOptimized ? 'bg-green-600 hover:bg-green-700' : 'bg-marketing-600 hover:bg-marketing-700'
        } text-white`}
        disabled={isOptimizing || keywords.length === 0}
      >
        <span className="flex items-center">
          <RefreshCw className={`mr-2 h-4 w-4 ${isOptimizing ? 'animate-spin' : ''}`} />
          {hasOptimized ? 'Reoptimize Keywords' : 'Optimize Keywords'}
        </span>
        {isOptimizing && (
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

      <KeywordApiModal 
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onSave={handleApiKeySave}
      />
    </>
  );
};

export default KeywordOptimizer;
