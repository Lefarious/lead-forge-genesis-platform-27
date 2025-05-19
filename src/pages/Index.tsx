
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

console.log('Loading Index.tsx');

const StepRenderer: React.FC = () => {
  try {
    console.log('Rendering StepRenderer component');
    const { currentStep, resetDataForStep } = useMarketingTool();
    console.log('Current step:', currentStep);
    
    // Track visited steps but don't auto-generate anymore
    const visitedSteps = useRef<Set<number>>(new Set([1])); // Consider first step as visited

    // Add to visited steps when step is rendered and reset relevant data
    useEffect(() => {
      console.log('StepRenderer useEffect, updating visited steps');
      if (!visitedSteps.current.has(currentStep)) {
        // Only reset data when navigating to a new step for the first time
        resetDataForStep(currentStep);
      }
      visitedSteps.current.add(currentStep);
    }, [currentStep, resetDataForStep]);

    const renderStep = () => {
      console.log('Rendering step:', currentStep);
      switch (currentStep) {
        case 1:
          return <BusinessInfoStep />;
        case 2:
          return <ICPStep />;
        case 3:
          return <USPStep />;
        case 4:
          return <GeographyStep />;
        case 5:
          return <KeywordStep />;
        case 6:
          return <ContentStep />;
        case 7:
          return <PublishStep />;
        default:
          console.log('Default case, rendering BusinessInfoStep');
          return <BusinessInfoStep />;
      }
    };

    return renderStep();
  } catch (error) {
    console.error('Error in StepRenderer:', error);
    return <div className="p-8 text-red-500">Error loading content. Please refresh the page.</div>;
  }
};

const Index: React.FC = () => {
  console.log('Rendering Index component');
  
  try {
    return (
      <MarketingToolProvider>
        <AppLayout>
          <StepRenderer />
        </AppLayout>
      </MarketingToolProvider>
    );
  } catch (error) {
    console.error('Error in Index component:', error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 bg-red-100 text-red-700 rounded-lg shadow">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p>There was an error loading the application. Please refresh the page.</p>
        </div>
      </div>
    );
  }
};

export default Index;
