
import React, { useEffect, useRef } from 'react';
import { MarketingToolProvider, useMarketingTool } from '@/contexts/MarketingToolContext';
import AppLayout from '@/components/layout/AppLayout';
import BusinessInfoStep from '@/components/steps/BusinessInfoStep';
import ICPStep from '@/components/steps/ICPStep';
import USPStep from '@/components/steps/USPStep';
import GeographyStep from '@/components/steps/GeographyStep';
import KeywordStep from '@/components/steps/KeywordStep';
import ContentStep from '@/components/steps/ContentStep';
import PublishStep from '@/components/steps/PublishStep';

const StepRenderer: React.FC = () => {
  const { currentStep, icps, usps, geographies, keywords, contentIdeas } = useMarketingTool();
  
  // Track visited steps to auto-generate on first visit
  const visitedSteps = useRef<Set<number>>(new Set([1])); // Consider first step as visited

  useEffect(() => {
    // If this step hasn't been visited before and isn't step 1 (Business Info)
    if (!visitedSteps.current.has(currentStep) && currentStep > 1) {
      visitedSteps.current.add(currentStep);
      
      // Get step element and find the generate button
      // This will be handled by each component using their own useEffect
    }
  }, [currentStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BusinessInfoStep />;
      case 2:
        return <ICPStep autoGenerate={!visitedSteps.current.has(2)} />;
      case 3:
        return <USPStep autoGenerate={!visitedSteps.current.has(3)} />;
      case 4:
        return <GeographyStep autoGenerate={!visitedSteps.current.has(4)} />;
      case 5:
        return <KeywordStep autoGenerate={!visitedSteps.current.has(5)} />;
      case 6:
        return <ContentStep autoGenerate={!visitedSteps.current.has(6)} />;
      case 7:
        return <PublishStep />;
      default:
        return <BusinessInfoStep />;
    }
  };

  // Add to visited steps when step is rendered
  useEffect(() => {
    visitedSteps.current.add(currentStep);
  }, [currentStep]);

  return renderStep();
};

const Index: React.FC = () => {
  return (
    <MarketingToolProvider>
      <AppLayout>
        <StepRenderer />
      </AppLayout>
    </MarketingToolProvider>
  );
};

export default Index;
