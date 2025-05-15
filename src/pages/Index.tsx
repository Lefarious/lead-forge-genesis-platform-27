
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
  const { currentStep } = useMarketingTool();
  
  // Track visited steps but don't auto-generate anymore
  const visitedSteps = useRef<Set<number>>(new Set([1])); // Consider first step as visited

  // Add to visited steps when step is rendered
  useEffect(() => {
    visitedSteps.current.add(currentStep);
  }, [currentStep]);

  const renderStep = () => {
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
        return <BusinessInfoStep />;
    }
  };

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
