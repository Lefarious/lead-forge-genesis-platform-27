import React, { useState } from 'react';
import { useMarketingTool } from '@/contexts/MarketingToolContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { generateUSPs } from '@/utils/llmUtils';
import EmptyUSPState from '@/components/usps/EmptyUSPState';
import USPGenerationControls from '@/components/usps/USPGenerationControls';
import USPList from '@/components/usps/USPList';
import AddUSPDialog from '@/components/usps/AddUSPDialog';

const USPStep: React.FC = () => {
  const { 
    business, 
    icps, 
    usps, 
    setUSPs, 
    setCurrentStep, 
    isGenerating, 
    setIsGenerating, 
    addCustomUSP 
  } = useMarketingTool();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleGenerateUSPs = async () => {
    if (!localStorage.getItem('openai_api_key')) {
      toast.error('Please set your OpenAI API key first');
      return;
    }

    if (icps.length === 0) {
      toast.error('Please generate ICPs first before creating USPs');
      return;
    }

    setIsGenerating(true);
    try {
      const generatedUSPs = await generateUSPs(business, icps);
      setUSPs(generatedUSPs); 
      toast.success('Unique Selling Points generated!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate USPs');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMoreUSPs = async () => {
    if (!localStorage.getItem('openai_api_key')) {
      toast.error('Please set your OpenAI API key first');
      return;
    }

    setIsGenerating(true);
    try {
      // Pass existing USPs to ensure we get unique ones
      const moreUSPs = await generateUSPs(business, icps, usps);
      setUSPs([...usps, ...moreUSPs]);
      toast.success('Additional USPs generated!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate additional USPs');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddCustomUSP = (newUSP: {
    title: string;
    description: string;
    targetICP: string;
    valueProposition: string;
  }) => {
    addCustomUSP(newUSP);
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
        <EmptyUSPState 
          isGenerating={isGenerating} 
          onBack={() => setCurrentStep(2)} 
          onGenerate={handleGenerateUSPs} 
        />
      ) : (
        <>
          <USPList usps={usps} business={business} />
          
          <USPGenerationControls
            isGenerating={isGenerating}
            onGenerateMore={handleGenerateMoreUSPs}
            onAddCustomClick={() => setIsAddDialogOpen(true)}
          />
          
          <div className="flex justify-between mt-8">
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

      <AddUSPDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        icps={icps}
        onAddUSP={handleAddCustomUSP}
      />
    </div>
  );
};

export default USPStep;
