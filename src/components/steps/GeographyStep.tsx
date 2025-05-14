
import React, { useState } from 'react';
import { useMarketingTool } from '@/contexts/MarketingToolContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Loader2, MapPin, Plus } from 'lucide-react';
import { Geography } from '@/contexts/MarketingToolContext';
import { generateGeographies } from '@/utils/llmUtils';
import ApiKeyInput from '@/components/common/ApiKeyInput';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const GeographyStep: React.FC = () => {
  const { business, geographies, setGeographies, addCustomGeography, setCurrentStep, isGenerating, setIsGenerating } = useMarketingTool();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGeography, setNewGeography] = useState<Partial<Geography>>({
    region: '',
    marketSize: '',
    growthRate: '',
    competitionLevel: '',
    recommendation: ''
  });

  const handleGenerateGeographies = async () => {
    if (!localStorage.getItem('openai_api_key')) {
      toast.error('Please set your OpenAI API key first');
      return;
    }

    setIsGenerating(true);
    try {
      const generatedGeographies = await generateGeographies(business);
      setGeographies([...geographies, ...generatedGeographies]); // Append new geographies
      toast.success('Target geographies generated!');
    } catch (error) {
      toast.error('Failed to generate geographies');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddCustomGeography = () => {
    if (!newGeography.region || !newGeography.marketSize || !newGeography.growthRate || 
        !newGeography.competitionLevel || !newGeography.recommendation) {
      toast.error('Please fill all fields');
      return;
    }

    addCustomGeography(newGeography as Geography);
    setIsAddDialogOpen(false);
    setNewGeography({
      region: '',
      marketSize: '',
      growthRate: '',
      competitionLevel: '',
      recommendation: ''
    });
    toast.success('Custom geography added successfully');
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
              <Card key={geo.id} className={geo.isCustomAdded ? "border-marketing-300 bg-marketing-50/30" : ""}>
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
          
          <div className="flex justify-between items-center mb-8">
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(true)}
              className="flex gap-1 items-center"
            >
              <Plus className="h-4 w-4" />
              Add Custom Geography
            </Button>
            <Button 
              onClick={handleGenerateGeographies} 
              className="bg-marketing-600 hover:bg-marketing-700"
              disabled={isGenerating}
            >
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate More Geographies
            </Button>
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

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Custom Geography</DialogTitle>
            <DialogDescription>
              Add a custom target region for your marketing strategy.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="region" className="text-right">
                Region
              </Label>
              <Input
                id="region"
                value={newGeography.region}
                onChange={(e) => setNewGeography({ ...newGeography, region: e.target.value })}
                className="col-span-3"
                placeholder="e.g., North America"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="marketSize" className="text-right">
                Market Size
              </Label>
              <Input
                id="marketSize"
                value={newGeography.marketSize}
                onChange={(e) => setNewGeography({ ...newGeography, marketSize: e.target.value })}
                className="col-span-3"
                placeholder="e.g., $5B annually"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="growthRate" className="text-right">
                Growth Rate
              </Label>
              <Input
                id="growthRate"
                value={newGeography.growthRate}
                onChange={(e) => setNewGeography({ ...newGeography, growthRate: e.target.value })}
                className="col-span-3"
                placeholder="e.g., 5.2% annually"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="competitionLevel" className="text-right">
                Competition Level
              </Label>
              <Input
                id="competitionLevel"
                value={newGeography.competitionLevel}
                onChange={(e) => setNewGeography({ ...newGeography, competitionLevel: e.target.value })}
                className="col-span-3"
                placeholder="e.g., Medium"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recommendation" className="text-right">
                Recommendation
              </Label>
              <Textarea
                id="recommendation"
                value={newGeography.recommendation}
                onChange={(e) => setNewGeography({ ...newGeography, recommendation: e.target.value })}
                className="col-span-3"
                placeholder="Strategic recommendation for this market"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCustomGeography}>Add Geography</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GeographyStep;
