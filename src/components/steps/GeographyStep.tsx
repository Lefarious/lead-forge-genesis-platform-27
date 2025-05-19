import React, { useState } from 'react';
import { useMarketingTool } from '@/contexts/MarketingToolContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, MapPin, Plus, RefreshCw, TrendingUp, BadgePercent } from 'lucide-react';
import { Geography } from '@/contexts/MarketingToolContext';
import { generateGeographies } from '@/utils/generators/geographyGenerator';
import ApiKeyInput from '@/components/common/ApiKeyInput';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { standardizeMarketSize } from '@/utils/formatters/marketSizeFormatter';
import { useTheme } from '@/contexts/ThemeContext';

interface GeographyStepProps {}

const GeographyStep: React.FC<GeographyStepProps> = () => {
  const { business, geographies, setGeographies, addCustomGeography, setCurrentStep, isGenerating, setIsGenerating } = useMarketingTool();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { isDarkMode } = useTheme();
  const [newGeography, setNewGeography] = useState<Partial<Geography>>({
    region: '',
    marketSize: '',
    growthRate: '',
    competitionLevel: '',
    whyTarget: '',
    recommendation: '',
    profitabilityRating: '',
    pricingPower: '',
    brandPersonality: ''
  });

  // Helper function for profitability rating color
  const getProfitabilityColor = (rating: string) => {
    switch (rating?.toLowerCase()) {
      case 'high':
        return isDarkMode ? 'text-green-400' : 'text-green-600';
      case 'medium':
        return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
      case 'low':
        return isDarkMode ? 'text-red-400' : 'text-red-600';
      default:
        return isDarkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };
  
  // Helper function for competition level color
  const getCompetitionColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'low':
        return isDarkMode ? 'text-green-400' : 'text-green-600';
      case 'medium':
        return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
      case 'high':
        return isDarkMode ? 'text-red-400' : 'text-red-600';
      default:
        return isDarkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const handleGenerateGeographies = async () => {
    if (!localStorage.getItem('openai_api_key')) {
      toast("Please set your OpenAI API key first", {
        description: "An API key is required to generate geographies"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Pass existing geographies to prevent duplication
      const generatedGeographies = await generateGeographies(business, geographies);
      
      setGeographies([...geographies, ...generatedGeographies]); // Append new geographies
      toast("New target geographies generated!", {
        description: "Check out your recommended target countries"
      });
    } catch (error) {
      toast("Failed to generate geographies", {
        description: error instanceof Error ? error.message : "An error occurred"
      });
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddCustomGeography = () => {
    if (!newGeography.region || !newGeography.marketSize || !newGeography.growthRate || 
        !newGeography.competitionLevel || !newGeography.recommendation) {
      toast("Please fill all required fields", {
        description: "All fields with * are required"
      });
      return;
    }

    // Initialize new properties with default values if they're not provided
    const newGeoWithDefaults = {
      ...newGeography,
      profitabilityRating: newGeography.profitabilityRating || 'Medium',
      pricingPower: newGeography.pricingPower || 'Moderate',
      brandPersonality: newGeography.brandPersonality || 'Professional'
    };
    
    addCustomGeography(newGeoWithDefaults as Geography);
    setIsAddDialogOpen(false);
    setNewGeography({
      region: '',
      marketSize: '',
      growthRate: '',
      competitionLevel: '',
      whyTarget: '',
      recommendation: '',
      profitabilityRating: '',
      pricingPower: '',
      brandPersonality: ''
    });
    toast("Custom geography added successfully");
  };

  const handleContinue = () => {
    if (geographies.length === 0) {
      toast("Please generate geographies first");
      return;
    }
    setCurrentStep(5);
  };

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-2">Target Geographies</h1>
      <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
        Identify the most promising countries for your business expansion
      </p>

      {geographies.length === 0 ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Generate Target Countries</CardTitle>
            <CardDescription>
              We'll analyze your business and industry to recommend the best countries to target
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              Our AI will identify promising countries based on market size, growth potential, and competition level.
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
                  className="bg-marketing-600 hover:bg-marketing-700 transition-colors"
                  disabled={isGenerating}
                >
                  {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Countries
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 mb-8">
            {geographies.map((geo) => (
              <Card 
                key={geo.id} 
                className={`${geo.isCustomAdded ? `border-marketing-300 ${isDarkMode ? 'bg-gray-800/30' : 'bg-marketing-50/30'}` : ""}`}
              >
                <CardHeader className="flex flex-row items-center gap-3">
                  <MapPin className="h-6 w-6 text-marketing-600 dark:text-marketing-400" />
                  <div>
                    <CardTitle className="text-xl">{geo.region}</CardTitle>
                    <CardDescription>Market Size: {standardizeMarketSize(geo.marketSize)}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div>
                          <span className="font-medium">Growth Rate:</span>
                        </div>
                        <div>{geo.growthRate}</div>
                        <div>
                          <span className="font-medium">Competition:</span>
                        </div>
                        <div className={getCompetitionColor(geo.competitionLevel)}>
                          {geo.competitionLevel}
                        </div>
                        <div>
                          <span className="font-medium">Pricing Power:</span>
                        </div>
                        <div>{geo.pricingPower || 'Not specified'}</div>
                        <div>
                          <span className="font-medium">Profitability:</span>
                        </div>
                        <div className={getProfitabilityColor(geo.profitabilityRating)}>
                          {geo.profitabilityRating || 'Not specified'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 md:col-span-2">
                      {/* Why Target This Geography Section */}
                      {geo.whyTarget && (
                        <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-marketing-50'} p-3 rounded-md`}>
                          <h4 className={`font-medium text-sm mb-1 ${isDarkMode ? 'text-marketing-400' : 'text-marketing-700'}`}>Why Target:</h4>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{geo.whyTarget}</p>
                        </div>
                      )}
                      
                      {/* Combined Recommendation & Brand Personality */}
                      <div className={`${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'} p-3 rounded-md`}>
                        <h4 className={`font-medium text-sm mb-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                          Strategic Insights:
                        </h4>
                        <div className="space-y-2">
                          {geo.recommendation && (
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <span className="font-medium">Recommendation: </span>{geo.recommendation}
                            </p>
                          )}
                          {geo.brandPersonality && (
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <span className="font-medium">Brand Positioning: </span>{geo.brandPersonality}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Button 
              variant="outline"
              className="border-dashed border-2 border-gray-300 hover:border-marketing-400 flex flex-col items-center justify-center min-h-[120px] p-6"
              onClick={handleGenerateGeographies}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-8 w-8 text-gray-400 mb-4 animate-spin" />
              ) : (
                <RefreshCw className="h-8 w-8 text-gray-400 mb-4" />
              )}
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>Generate More Countries</p>
            </Button>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Card className={`border-dashed border-2 border-gray-300 hover:border-marketing-400 cursor-pointer flex flex-col items-center justify-center min-h-[120px] ${isDarkMode ? 'hover:bg-gray-800/30' : 'hover:bg-marketing-50/30'}`}>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Plus className="h-8 w-8 text-gray-400 mb-4" />
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>Add Custom Country</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
            </Dialog>
          </div>
          
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={() => setCurrentStep(3)}>
              Back
            </Button>
            <Button 
              onClick={handleContinue} 
              className="bg-marketing-600 hover:bg-marketing-700 transition-colors"
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
              Add a custom target country for your marketing strategy.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="region" className="text-right">
                Country
              </Label>
              <Input
                id="region"
                value={newGeography.region}
                onChange={(e) => setNewGeography({ ...newGeography, region: e.target.value })}
                className="col-span-3"
                placeholder="e.g., Canada"
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
                placeholder="e.g., 5M, 2.5B, 500K"
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
                Competition
              </Label>
              <Input
                id="competitionLevel"
                value={newGeography.competitionLevel}
                onChange={(e) => setNewGeography({ ...newGeography, competitionLevel: e.target.value })}
                className="col-span-3"
                placeholder="e.g., Medium, Low, High"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="whyTarget" className="text-right">
                Why Target
              </Label>
              <Textarea
                id="whyTarget"
                value={newGeography.whyTarget}
                onChange={(e) => setNewGeography({ ...newGeography, whyTarget: e.target.value })}
                className="col-span-3"
                placeholder="Why this country is a good target for your business"
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
            
            {/* Form fields */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="profitabilityRating" className="text-right">
                Profitability
              </Label>
              <Input
                id="profitabilityRating"
                value={newGeography.profitabilityRating || ''}
                onChange={(e) => setNewGeography({ ...newGeography, profitabilityRating: e.target.value })}
                className="col-span-3"
                placeholder="e.g., High, Medium, Low"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pricingPower" className="text-right">
                Pricing Power
              </Label>
              <Input
                id="pricingPower"
                value={newGeography.pricingPower || ''}
                onChange={(e) => setNewGeography({ ...newGeography, pricingPower: e.target.value })}
                className="col-span-3"
                placeholder="e.g., Strong, Moderate, Weak"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brandPersonality" className="text-right">
                Brand Personality
              </Label>
              <Textarea
                id="brandPersonality"
                value={newGeography.brandPersonality || ''}
                onChange={(e) => setNewGeography({ ...newGeography, brandPersonality: e.target.value })}
                className="col-span-3"
                placeholder="e.g., Professional, Innovative, Traditional"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddCustomGeography}
              className="bg-marketing-600 hover:bg-marketing-700 transition-colors"
            >
              Add Geography
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GeographyStep;
