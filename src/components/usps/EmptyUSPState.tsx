
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import ApiKeyInput from '@/components/common/ApiKeyInput';

interface EmptyUSPStateProps {
  isGenerating: boolean;
  onBack: () => void;
  onGenerate: () => void;
}

const EmptyUSPState: React.FC<EmptyUSPStateProps> = ({ isGenerating, onBack, onGenerate }) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Generate USPs</CardTitle>
        <CardDescription>
          We'll analyze your business and ICPs to identify compelling selling points
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          Our AI will generate unique selling points tailored to each of your ideal customer profiles.
        </p>
        <div className="flex justify-between items-center">
          <Button onClick={onBack} variant="outline">
            Back to ICPs
          </Button>
          <div className="flex items-center gap-2">
            <ApiKeyInput />
            <Button 
              onClick={onGenerate} 
              className="bg-marketing-600 hover:bg-marketing-700 transition-colors"
              disabled={isGenerating}
            >
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate USPs
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyUSPState;
