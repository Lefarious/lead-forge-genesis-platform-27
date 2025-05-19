
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Globe } from 'lucide-react';
import { callOpenAI } from '@/utils/api/openaiApi';
import { parseJsonResponse } from '@/utils/parsers/jsonParser';
import { useToast } from '@/hooks/use-toast';

interface MarketAnalysisProps {
  business: any;
  geography: any;
}

const MarketAnalysis: React.FC<MarketAnalysisProps> = ({ business, geography }) => {
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
      // Create a prompt focused on geography analysis
      const messages = [
        {
          role: 'system',
          content: `You are an expert market analyst. Create a detailed market analysis for the business entering the specified geography.
          Focus on local market conditions, top competitors, regional consumer preferences, and market entry strategies.
          Return a JSON with the following fields (all lowercase):
          - marketmaturity (High, Medium, Low)
          - mainchallenges (array of 3 market entry challenges)
          - topcompetitors (array of 3-4 competitor names and brief descriptions)
          - localpreferences (description of local consumer preferences)
          - regulatoryinfo (key regulatory considerations)
          - entrystrategy (recommended market entry approach)
          - partnershiptypes (array of potential partnership models)
          - estimatedtimeline (time needed to establish presence)
          - successmetrics (array of KPIs to track success)`
        },
        {
          role: 'user',
          content: `Business: ${business.name} in ${business.industry}
          Business Description: ${business.description || 'Not specified'}
          Target Geography: ${geography.region}
          Market Size: ${geography.marketSize || 'Not specified'}
          Growth Rate: ${geography.growthRate || 'Not specified'}
          Competition Level: ${geography.competitionLevel || 'Not specified'}
          Brand Personality: ${geography.brandPersonality || 'Not specified'}`
        }
      ];

      const responseData = await callOpenAI(messages);
      const contentString = responseData.choices[0].message.content;
      const result = parseJsonResponse(contentString);
      setAnalysis(result);
      setIsExpanded(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate market analysis";
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

  // Helper function to determine market maturity badge color
  const getMaturityBadgeColor = (maturity: string) => {
    switch (maturity?.toLowerCase()) {
      case 'high':
        return 'bg-green-500 hover:bg-green-600';
      case 'medium':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'low':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
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
              Analyzing market conditions...
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
              <CardTitle className="text-lg">Market Analysis: {geography.region}</CardTitle>
              {analysis.marketmaturity && (
                <Badge className={getMaturityBadgeColor(analysis.marketmaturity)}>
                  {analysis.marketmaturity} Maturity
                </Badge>
              )}
            </div>
            <CardDescription>
              Market analysis for {business.name} in {geography.region}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {isExpanded ? (
              <div className="space-y-4 animate-fade-in">
                {/* Main Challenges Section */}
                <div>
                  <h4 className="font-medium mb-2 text-marketing-700">Main Challenges</h4>
                  <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                    {Array.isArray(analysis.mainchallenges) ? 
                      analysis.mainchallenges.map((challenge: string, i: number) => (
                        <li key={i}>{challenge}</li>
                      )) : 
                      <li>{analysis.mainchallenges || 'No challenges identified'}</li>
                    }
                  </ul>
                </div>

                {/* Top Competitors Section */}
                <div className="bg-red-50 p-3 rounded-md">
                  <h4 className="font-medium mb-2 text-red-700">Top Competitors</h4>
                  <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                    {Array.isArray(analysis.topcompetitors) ? 
                      analysis.topcompetitors.map((competitor: string, i: number) => (
                        <li key={i}>{competitor}</li>
                      )) : 
                      <li>{analysis.topcompetitors || 'No competitor data available'}</li>
                    }
                  </ul>
                </div>
                
                {/* Local Preferences Section */}
                <div className="bg-blue-50 p-3 rounded-md">
                  <h4 className="font-medium mb-2 text-blue-700">
                    <span className="flex items-center gap-1">
                      <Globe className="h-4 w-4" /> Local Consumer Preferences
                    </span>
                  </h4>
                  <p className="text-sm text-gray-700">{analysis.localpreferences || 'No data on local preferences'}</p>
                </div>

                {/* Regulatory Info */}
                <div className="bg-yellow-50 p-3 rounded-md">
                  <h4 className="font-medium mb-2 text-yellow-700">Regulatory Considerations</h4>
                  <p className="text-sm text-gray-700">{analysis.regulatoryinfo || 'No regulatory data available'}</p>
                </div>

                {/* Market Entry Strategy */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2 text-marketing-700">Market Entry Strategy</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-semibold mb-1">Recommended Approach</h5>
                      <p className="text-sm">{analysis.entrystrategy || 'No recommendation available'}</p>
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold mb-1">Partnership Types</h5>
                      <p className="text-sm">
                        {Array.isArray(analysis.partnershiptypes) ? 
                          analysis.partnershiptypes.join(", ") : 
                          analysis.partnershiptypes || 'No partnership data available'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Success Metrics & Timeline */}
                <div className="bg-green-50 p-3 rounded-md">
                  <h4 className="font-medium mb-2 text-green-700">
                    Timeline & Success Metrics
                  </h4>
                  <p className="text-sm mb-2">
                    <span className="font-semibold">Estimated Timeline:</span> {analysis.estimatedtimeline || 'Not specified'}
                  </p>
                  <div>
                    <h5 className="text-sm font-semibold mb-1">Key Success Metrics:</h5>
                    <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                      {Array.isArray(analysis.successmetrics) ? 
                        analysis.successmetrics.map((metric: string, i: number) => (
                          <li key={i}>{metric}</li>
                        )) : 
                        <li>{analysis.successmetrics || 'No metrics defined'}</li>
                      }
                    </ul>
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

export default MarketAnalysis;
