
import React from 'react';
import { useMarketingTool } from '@/contexts/MarketingToolContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Search } from 'lucide-react';
import { Keyword } from '@/contexts/MarketingToolContext';
import { Badge } from '@/components/ui/badge';

const mockGenerateKeywords = (business: any, icps: any[], usps: any[], geos: any[]): Promise<Keyword[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          term: 'AI workflow automation',
          searchVolume: '5,400/mo',
          difficulty: 'Medium',
          relevance: 'High',
          relatedICP: 'Enterprise IT Decision Makers',
        },
        {
          id: '2',
          term: 'business process automation software',
          searchVolume: '12,200/mo',
          difficulty: 'High',
          relevance: 'Medium',
          relatedICP: 'Mid-Market Operations Managers',
        },
        {
          id: '3',
          term: 'workflow integration platform',
          searchVolume: '3,600/mo',
          difficulty: 'Medium',
          relevance: 'High',
          relatedICP: 'Enterprise IT Decision Makers',
        },
        {
          id: '4',
          term: 'no-code automation tool',
          searchVolume: '8,800/mo',
          difficulty: 'Medium',
          relevance: 'High',
          relatedICP: 'Startup Founders',
        },
        {
          id: '5',
          term: 'enterprise workflow management',
          searchVolume: '4,100/mo',
          difficulty: 'Medium-High',
          relevance: 'High',
          relatedICP: 'Enterprise IT Decision Makers',
        },
        {
          id: '6',
          term: 'business automation ROI',
          searchVolume: '2,700/mo',
          difficulty: 'Low',
          relevance: 'Medium',
          relatedICP: 'Mid-Market Operations Managers',
        },
        {
          id: '7',
          term: 'startup automation tools',
          searchVolume: '5,900/mo',
          difficulty: 'Medium',
          relevance: 'High',
          relatedICP: 'Startup Founders',
        },
        {
          id: '8',
          term: 'AI-powered business automation',
          searchVolume: '3,300/mo',
          difficulty: 'Medium',
          relevance: 'High',
          relatedICP: 'Enterprise IT Decision Makers',
        },
      ]);
    }, 2000);
  });
};

const getDifficultyColor = (difficulty: string) => {
  if (difficulty.toLowerCase().includes('low')) return 'bg-green-100 text-green-800';
  if (difficulty.toLowerCase().includes('high')) return 'bg-red-100 text-red-800';
  return 'bg-amber-100 text-amber-800';
};

const getRelevanceColor = (relevance: string) => {
  if (relevance.toLowerCase() === 'high') return 'bg-green-100 text-green-800';
  if (relevance.toLowerCase() === 'low') return 'bg-gray-100 text-gray-800';
  return 'bg-blue-100 text-blue-800';
};

const KeywordStep: React.FC = () => {
  const { business, icps, usps, geographies, keywords, setKeywords, setCurrentStep, isGenerating, setIsGenerating } = useMarketingTool();

  const handleGenerateKeywords = async () => {
    setIsGenerating(true);
    try {
      const generatedKeywords = await mockGenerateKeywords(business, icps, usps, geographies);
      setKeywords(generatedKeywords);
      toast.success('Keywords generated!');
    } catch (error) {
      toast.error('Failed to generate keywords');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContinue = () => {
    if (keywords.length === 0) {
      toast.error('Please generate keywords first');
      return;
    }
    setCurrentStep(6);
  };

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-2">Keyword Research</h1>
      <p className="text-center text-gray-600 mb-8">
        Discover high-value keywords for your content and SEO strategy
      </p>

      {keywords.length === 0 ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Generate Keywords</CardTitle>
            <CardDescription>
              We'll analyze your business, ICPs, USPs, and geographies to identify valuable keywords
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Our AI will generate a list of keywords tailored to your business and target audience.
            </p>
            <div className="flex justify-between">
              <Button 
                onClick={() => setCurrentStep(4)} 
                variant="outline"
              >
                Back to Geographies
              </Button>
              <Button 
                onClick={handleGenerateKeywords} 
                className="bg-marketing-600 hover:bg-marketing-700"
                disabled={isGenerating}
              >
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Keywords
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2 text-marketing-600" />
                Keywords for Your Content Strategy
              </CardTitle>
              <CardDescription>
                Use these keywords in your content, website, and advertising to improve visibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Keyword</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Search Volume</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Difficulty</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Relevance</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Related ICP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywords.map((keyword) => (
                      <tr key={keyword.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{keyword.term}</td>
                        <td className="py-3 px-4 text-gray-600">{keyword.searchVolume}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={getDifficultyColor(keyword.difficulty)}>
                            {keyword.difficulty}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={getRelevanceColor(keyword.relevance)}>
                            {keyword.relevance}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{keyword.relatedICP}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(4)}>
              Back
            </Button>
            <Button 
              onClick={handleContinue} 
              className="bg-marketing-600 hover:bg-marketing-700"
            >
              Continue to Content Ideas
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default KeywordStep;
