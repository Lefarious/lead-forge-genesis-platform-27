
import React, { useState } from 'react';
import { useMarketingTool } from '@/contexts/MarketingToolContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Search, Plus, RefreshCw } from 'lucide-react';
import { Keyword } from '@/contexts/MarketingToolContext';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface KeywordStepProps {}

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

const KeywordStep: React.FC<KeywordStepProps> = () => {
  const { 
    business, icps, usps, geographies, keywords, setKeywords, addCustomKeyword, 
    setCurrentStep, isGenerating, setIsGenerating 
  } = useMarketingTool();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newKeyword, setNewKeyword] = useState<Partial<Keyword>>({
    term: '',
    searchVolume: '',
    difficulty: 'Medium',
    relevance: 'Medium',
    relatedICP: icps.length > 0 ? icps[0].title : '',
  });

  const handleGenerateKeywords = async () => {
    setIsGenerating(true);
    try {
      const generatedKeywords = await mockGenerateKeywords(business, icps, usps, geographies);
      setKeywords([...keywords, ...generatedKeywords]); // Append new keywords
      toast.success('Keywords generated!');
    } catch (error) {
      toast.error('Failed to generate keywords');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddCustomKeyword = () => {
    if (!newKeyword.term || !newKeyword.searchVolume || !newKeyword.difficulty || 
        !newKeyword.relevance || !newKeyword.relatedICP) {
      toast.error('Please fill all fields');
      return;
    }

    addCustomKeyword(newKeyword as Keyword);
    setIsAddDialogOpen(false);
    setNewKeyword({
      term: '',
      searchVolume: '',
      difficulty: 'Medium',
      relevance: 'Medium',
      relatedICP: icps.length > 0 ? icps[0].title : '',
    });
    toast.success('Custom keyword added successfully');
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
                variant="default"
                className="bg-marketing-600 hover:bg-marketing-700 text-white transition-colors"
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
                      <tr key={keyword.id} className={`border-b hover:bg-gray-50 ${keyword.isCustomAdded ? "bg-marketing-50/30" : ""}`}>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Button 
              variant="outline"
              className="border-dashed border-2 border-gray-300 hover:border-marketing-400 flex flex-col items-center justify-center min-h-[200px] p-6"
              onClick={handleGenerateKeywords}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-12 w-12 text-gray-400 mb-4 animate-spin" />
              ) : (
                <RefreshCw className="h-12 w-12 text-gray-400 mb-4" />
              )}
              <p className="text-gray-600 font-medium">Generate More Keywords</p>
            </Button>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Card className="border-dashed border-2 border-gray-300 hover:border-marketing-400 cursor-pointer flex flex-col items-center justify-center min-h-[200px]">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Plus className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium">Add Custom Keyword</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
            </Dialog>
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(4)}
              className="hover:bg-gray-100 transition-colors"
            >
              Back
            </Button>
            <Button 
              onClick={handleContinue} 
              className="bg-marketing-600 hover:bg-marketing-700 text-white transition-colors"
            >
              Continue to Content Ideas
            </Button>
          </div>
        </>
      )}
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Custom Keyword</DialogTitle>
            <DialogDescription>
              Add a custom keyword for your SEO and content strategy.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="term" className="text-right">
                Keyword Term
              </Label>
              <Input
                id="term"
                value={newKeyword.term}
                onChange={(e) => setNewKeyword({ ...newKeyword, term: e.target.value })}
                className="col-span-3"
                placeholder="e.g., business process automation"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="searchVolume" className="text-right">
                Search Volume
              </Label>
              <Input
                id="searchVolume"
                value={newKeyword.searchVolume}
                onChange={(e) => setNewKeyword({ ...newKeyword, searchVolume: e.target.value })}
                className="col-span-3"
                placeholder="e.g., 5,400/mo"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="difficulty" className="text-right">
                Difficulty
              </Label>
              <select
                id="difficulty"
                value={newKeyword.difficulty}
                onChange={(e) => setNewKeyword({ ...newKeyword, difficulty: e.target.value })}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Low">Low</option>
                <option value="Medium-Low">Medium-Low</option>
                <option value="Medium">Medium</option>
                <option value="Medium-High">Medium-High</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="relevance" className="text-right">
                Relevance
              </Label>
              <select
                id="relevance"
                value={newKeyword.relevance}
                onChange={(e) => setNewKeyword({ ...newKeyword, relevance: e.target.value })}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="relatedICP" className="text-right">
                Related ICP
              </Label>
              <select
                id="relatedICP"
                value={newKeyword.relatedICP}
                onChange={(e) => setNewKeyword({ ...newKeyword, relatedICP: e.target.value })}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {icps.map((icp) => (
                  <option key={icp.id} value={icp.title}>{icp.title}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="hover:bg-gray-100 transition-colors">
              Cancel
            </Button>
            <Button onClick={handleAddCustomKeyword} className="bg-marketing-600 hover:bg-marketing-700 text-white transition-colors">
              Add Keyword
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KeywordStep;
