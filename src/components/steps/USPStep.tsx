
import React from 'react';
import { useMarketingTool } from '@/contexts/MarketingToolContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { USP } from '@/contexts/MarketingToolContext';
import { generateUSPs } from '@/utils/llmUtils';
import ApiKeyInput from '@/components/common/ApiKeyInput';

const USPStep: React.FC = () => {
  const { business, icps, usps, setUSPs, setCurrentStep, isGenerating, setIsGenerating } = useMarketingTool();

  const handleGenerateUSPs = async () => {
    if (!localStorage.getItem('openai_api_key')) {
      toast.error('Please set your OpenAI API key first');
      return;
    }

    setIsGenerating(true);
    try {
      const generatedUSPs = await generateUSPs(business, icps);
      setUSPs(generatedUSPs);
      toast.success('Unique Selling Points generated!');
    } catch (error) {
      toast.error('Failed to generate USPs');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContinue = () => {
    if (usps.length === 0) {
      toast.error('Please generate USPs first');
      return;
    }
    setCurrentStep(4);
  };

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-2">Unique Selling Points (USPs)</h1>
      <p className="text-center text-gray-600 mb-8">
        Identify what makes your business stand out to each customer profile
      </p>

      {usps.length === 0 ? (
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
              <Button 
                onClick={() => setCurrentStep(2)} 
                variant="outline"
              >
                Back to ICPs
              </Button>
              <div className="flex items-center gap-2">
                <ApiKeyInput />
                <Button 
                  onClick={handleGenerateUSPs} 
                  className="bg-marketing-600 hover:bg-marketing-700"
                  disabled={isGenerating}
                >
                  {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate USPs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {usps.map((usp) => (
              <Card key={usp.id}>
                <CardHeader>
                  <CardTitle className="text-xl">{usp.title}</CardTitle>
                  <CardDescription>Target: {usp.targetICP}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-gray-600">{usp.description}</p>
                  </div>
                  <div className="bg-marketing-50 p-3 rounded-md">
                    <h4 className="font-medium text-sm mb-1 text-marketing-700">Value Proposition:</h4>
                    <p className="text-sm text-gray-700">{usp.valueProposition}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(2)}>
              Back
            </Button>
            <Button 
              onClick={handleContinue} 
              className="bg-marketing-600 hover:bg-marketing-700"
            >
              Continue to Geographies
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default USPStep;
