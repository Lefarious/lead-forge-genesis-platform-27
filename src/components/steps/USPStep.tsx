
import React from 'react';
import { useMarketingTool } from '@/contexts/MarketingToolContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { USP } from '@/contexts/MarketingToolContext';

const mockGenerateUSPs = (business: any, icps: any[]): Promise<USP[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          title: 'AI-Powered Automation',
          description: 'Our platform uses advanced AI to automate complex workflows, reducing manual effort by up to 80%.',
          targetICP: 'Enterprise IT Decision Makers',
          valueProposition: 'Save thousands of work hours annually while improving accuracy and compliance.',
        },
        {
          id: '2',
          title: 'Seamless Integration',
          description: 'Integrates with over 200 existing business tools with no coding required, offering the most extensive integration capability in the market.',
          targetICP: 'Mid-Market Operations Managers',
          valueProposition: 'Eliminate data silos and connect all your systems without expensive development resources.',
        },
        {
          id: '3',
          title: 'Rapid Implementation',
          description: 'Get up and running in days, not months, with our guided setup process and templates.',
          targetICP: 'Startup Founders',
          valueProposition: 'Achieve immediate ROI without lengthy implementation projects or specialized consultants.',
        },
        {
          id: '4',
          title: 'Predictive Analytics',
          description: 'Leverage machine learning models that analyze your data to predict business outcomes and recommend optimizations.',
          targetICP: 'Enterprise IT Decision Makers',
          valueProposition: 'Make data-driven decisions that increase revenue and reduce costs through predictive insights.',
        },
      ]);
    }, 2000);
  });
};

const USPStep: React.FC = () => {
  const { business, icps, usps, setUSPs, setCurrentStep, isGenerating, setIsGenerating } = useMarketingTool();

  const handleGenerateUSPs = async () => {
    setIsGenerating(true);
    try {
      const generatedUSPs = await mockGenerateUSPs(business, icps);
      setUSPs(generatedUSPs);
      toast.success('Unique Selling Points generated!');
    } catch (error) {
      toast.error('Failed to generate USPs');
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
            <div className="flex justify-between">
              <Button 
                onClick={() => setCurrentStep(2)} 
                variant="outline"
              >
                Back to ICPs
              </Button>
              <Button 
                onClick={handleGenerateUSPs} 
                className="bg-marketing-600 hover:bg-marketing-700"
                disabled={isGenerating}
              >
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate USPs
              </Button>
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
