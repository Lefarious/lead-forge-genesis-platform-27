
import React from 'react';
import { useMarketingTool } from '@/contexts/MarketingToolContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2, MapPin } from 'lucide-react';
import { Geography } from '@/contexts/MarketingToolContext';
import { generateGeographies } from '@/utils/llmUtils';
import ApiKeyInput from '@/components/common/ApiKeyInput';

const GeographyStep: React.FC = () => {
  const { business, geographies, setGeographies, setCurrentStep, isGenerating, setIsGenerating } = useMarketingTool();

  const handleGenerateGeographies = async () => {
    if (!localStorage.getItem('openai_api_key')) {
      toast.error('Please set your OpenAI API key first');
      return;
    }

    setIsGenerating(true);
    try {
      const generatedGeographies = await generateGeographies(business);
      setGeographies(generatedGeographies);
      toast.success('Target geographies generated!');
    } catch (error) {
      toast.error('Failed to generate geographies');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContinue = () => {
    if (geographies.length === 0) {
      toast.error('Please generate geographies first');
      return;
    }
    setCurrentStep(5);
  };

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-2">Target Geographies</h1>
      <p className="text-center text-gray-600 mb-8">
        Identify the most promising regions for your business expansion
      </p>

      {geographies.length === 0 ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Generate Target Geographies</CardTitle>
            <CardDescription>
              We'll analyze your business and industry to recommend the best regions to target
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Our AI will identify promising regions based on market size, growth potential, and competition level.
            </p>
            <div className="flex justify-between items-center">
              <Button 
                onClick={() => setCurrentStep(3)} 
                variant="outline"
              >
                Back to USPs
              </Button>
              <div className="flex items-center gap-2">
                <ApiKeyInput />
                <Button 
                  onClick={handleGenerateGeographies} 
                  className="bg-marketing-600 hover:bg-marketing-700"
                  disabled={isGenerating}
                >
                  {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Geographies
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {geographies.map((geo) => (
              <Card key={geo.id}>
                <CardHeader className="flex flex-row items-center gap-3">
                  <MapPin className="h-6 w-6 text-marketing-600" />
                  <div>
                    <CardTitle className="text-xl">{geo.region}</CardTitle>
                    <CardDescription>Market Size: {geo.marketSize}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="font-medium">Growth Rate:</span>
                    </div>
                    <div>{geo.growthRate}</div>
                    <div>
                      <span className="font-medium">Competition:</span>
                    </div>
                    <div>{geo.competitionLevel}</div>
                  </div>
                  <div className="bg-marketing-50 p-3 rounded-md">
                    <h4 className="font-medium text-sm mb-1 text-marketing-700">Recommendation:</h4>
                    <p className="text-sm text-gray-700">{geo.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(3)}>
              Back
            </Button>
            <Button 
              onClick={handleContinue} 
              className="bg-marketing-600 hover:bg-marketing-700"
            >
              Continue to Keywords
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default GeographyStep;
