
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Plus, RefreshCw } from 'lucide-react';

interface USPGenerationControlsProps {
  isGenerating: boolean;
  onGenerateMore: () => void;
  onAddCustomClick: () => void;
}

const USPGenerationControls: React.FC<USPGenerationControlsProps> = ({ 
  isGenerating, 
  onGenerateMore, 
  onAddCustomClick 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Button 
        variant="outline"
        className="border-dashed border-2 border-gray-300 hover:border-marketing-400 flex flex-col items-center justify-center min-h-[200px] p-6"
        onClick={onGenerateMore}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <Loader2 className="h-12 w-12 text-gray-400 mb-4 animate-spin" />
        ) : (
          <RefreshCw className="h-12 w-12 text-gray-400 mb-4" />
        )}
        <p className="text-gray-600 font-medium">Generate More USPs</p>
      </Button>
      
      <Card 
        className="border-dashed border-2 border-gray-300 hover:border-marketing-400 cursor-pointer flex flex-col items-center justify-center min-h-[200px]"
        onClick={onAddCustomClick}
      >
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Plus className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 font-medium">Add Custom USP</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default USPGenerationControls;
