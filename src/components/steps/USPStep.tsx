
import React, { useState } from 'react';
import { useMarketingTool } from '@/contexts/MarketingToolContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Plus, RefreshCw } from 'lucide-react';
import { USP } from '@/contexts/MarketingToolContext';
import { generateUSPs } from '@/utils/llmUtils';
import ApiKeyInput from '@/components/common/ApiKeyInput';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const USPStep: React.FC = () => {
  const { business, icps, usps, setUSPs, setCurrentStep, isGenerating, setIsGenerating, addCustomUSP } = useMarketingTool();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUSP, setNewUSP] = useState<Partial<USP>>({
    title: '',
    description: '',
    targetICP: icps.length > 0 ? icps[0].title : '',
    valueProposition: ''
  });

  const handleGenerateUSPs = async () => {
    if (!localStorage.getItem('openai_api_key')) {
      toast.error('Please set your OpenAI API key first');
      return;
    }

    setIsGenerating(true);
    try {
      const generatedUSPs = await generateUSPs(business, icps);
      setUSPs([...usps, ...generatedUSPs]); // Append new USPs to existing ones
      toast.success('Unique Selling Points generated!');
    } catch (error) {
      toast.error('Failed to generate USPs');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddCustomUSP = () => {
    if (!newUSP.title || !newUSP.description || !newUSP.targetICP || !newUSP.valueProposition) {
      toast.error('Please fill all fields');
      return;
    }

    addCustomUSP(newUSP as USP);
    setIsAddDialogOpen(false);
    setNewUSP({
      title: '',
      description: '',
      targetICP: icps.length > 0 ? icps[0].title : '',
      valueProposition: ''
    });
    toast.success('Custom USP added successfully');
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
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {usps.map((usp) => (
              <Card key={usp.id} className={usp.isCustomAdded ? "border-marketing-300 bg-marketing-50/30" : ""}>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Card className="border-dashed border-2 border-gray-300 hover:border-marketing-400 cursor-pointer flex flex-col items-center justify-center min-h-[200px]">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Plus className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium">Add Custom USP</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
            </Dialog>

            <Button 
              variant="outline"
              className="border-dashed border-2 border-gray-300 hover:border-marketing-400 flex flex-col items-center justify-center min-h-[200px] p-6"
              onClick={handleGenerateUSPs}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-12 w-12 text-gray-400 mb-4 animate-spin" />
              ) : (
                <RefreshCw className="h-12 w-12 text-gray-400 mb-4" />
              )}
              <p className="text-gray-600 font-medium">Generate More USPs</p>
            </Button>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(2)}>
              Back
            </Button>
            <Button 
              onClick={handleContinue} 
              className="bg-marketing-600 hover:bg-marketing-700 transition-colors"
            >
              Continue to Geographies
            </Button>
          </div>
        </>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Custom Unique Selling Point</DialogTitle>
            <DialogDescription>
              Create a custom USP for your marketing strategy.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newUSP.title}
                onChange={(e) => setNewUSP({ ...newUSP, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="targetICP" className="text-right">
                Target ICP
              </Label>
              <select
                id="targetICP"
                value={newUSP.targetICP}
                onChange={(e) => setNewUSP({ ...newUSP, targetICP: e.target.value })}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {icps.map((icp) => (
                  <option key={icp.id} value={icp.title}>{icp.title}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newUSP.description}
                onChange={(e) => setNewUSP({ ...newUSP, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="valueProposition" className="text-right">
                Value Proposition
              </Label>
              <Textarea
                id="valueProposition"
                value={newUSP.valueProposition}
                onChange={(e) => setNewUSP({ ...newUSP, valueProposition: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddCustomUSP}
              className="bg-marketing-600 hover:bg-marketing-700 transition-colors"
            >
              Add USP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default USPStep;
