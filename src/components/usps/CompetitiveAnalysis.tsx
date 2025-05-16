
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { generateCompetitiveAnalysis } from '@/utils/llmUtils';
import { useToast } from '@/hooks/use-toast';

interface CompetitiveAnalysisProps {
  business: any;
  usp: any;
}

const CompetitiveAnalysis: React.FC<CompetitiveAnalysisProps> = ({ business, usp }) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const generateAnalysis = async () => {
    if (!localStorage.getItem('openai_api_key')) {
      toast({
        title: "Error",
        description: "Please set your OpenAI API key first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateCompetitiveAnalysis(business, usp);
      setAnalysis(result);
      setIsExpanded(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate competitive analysis";
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to determine health badge color
  const getHealthBadgeColor = (health: string) => {
    switch (health?.toLowerCase()) {
      case 'strong':
        return 'bg-green-500 hover:bg-green-600';
      case 'moderate':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'needs improvement':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <div className="mt-4">
      {!analysis && (
        <Button
          onClick={generateAnalysis}
          disabled={isLoading}
          variant="outline"
          className="w-full py-6 border-dashed"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing market position...
            </>
          ) : (
            <>Generate Market Analysis</>
          )}
        </Button>
      )}

      {analysis && (
        <Card className="border-marketing-200 bg-marketing-50/20">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Market Analysis</CardTitle>
              {analysis.uspHealth && (
                <Badge className={getHealthBadgeColor(analysis.uspHealth)}>
                  {analysis.uspHealth}
                </Badge>
              )}
            </div>
            <CardDescription>
              {analysis.healthReasoning || "Analysis of this USP's market position"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {isExpanded ? (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h4 className="font-medium mb-2 text-marketing-700">Market Substitutes</h4>
                  <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                    {Array.isArray(analysis.marketSubstitutes) ? 
                      analysis.marketSubstitutes.map((substitute: string, i: number) => (
                        <li key={i}>{substitute}</li>
                      )) : 
                      <li>{analysis.marketSubstitutes}</li>
                    }
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-50 p-3 rounded-md">
                    <h4 className="font-medium mb-2 text-red-700">Competitor Advantages</h4>
                    <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                      {Array.isArray(analysis.competitorAdvantages) ? 
                        analysis.competitorAdvantages.map((advantage: string, i: number) => (
                          <li key={i}>{advantage}</li>
                        )) : 
                        <li>{analysis.competitorAdvantages}</li>
                      }
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-md">
                    <h4 className="font-medium mb-2 text-green-700">Our Advantages</h4>
                    <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                      {Array.isArray(analysis.businessAdvantages) ? 
                        analysis.businessAdvantages.map((advantage: string, i: number) => (
                          <li key={i}>{advantage}</li>
                        )) : 
                        <li>{analysis.businessAdvantages}</li>
                      }
                    </ul>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2 text-marketing-700">Recommended Strategy</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-semibold mb-1">Pricing Strategy</h5>
                      <p className="text-sm">{analysis.pricingStrategy}</p>
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold mb-1">Monetization Plan</h5>
                      <p className="text-sm">{analysis.monetizationPlan}</p>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsExpanded(false)}
                  className="w-full text-gray-500 mt-2"
                >
                  Hide Details
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsExpanded(true)}
                className="w-full text-marketing-600 mt-2"
              >
                Show Details
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompetitiveAnalysis;
