
import React, { createContext, useContext, useState } from 'react';

export type Business = {
  name: string;
  industry: string;
  description: string;
  targetAudience: string;
  mainProblem: string;
  mainSolution: string;
  existingCustomers: string;
};

export type ICP = {
  id: string;
  title: string;
  description: string;
  demographics: string;
  painPoints: string[];
  goals: string[];
  isCustomAdded?: boolean;
};

export type USP = {
  id: string;
  title: string;
  description: string;
  targetICP: string;
  valueProposition: string;
};

export type Geography = {
  id: string;
  region: string;
  marketSize: string;
  growthRate: string;
  competitionLevel: string;
  recommendation: string;
};

export type Keyword = {
  id: string;
  term: string;
  searchVolume: string;
  difficulty: string;
  relevance: string;
  relatedICP: string;
};

export type ContentIdea = {
  id: string;
  title: string;
  type: string;
  targetICP: string;
  targetKeywords: string[];
  outline: string[];
  estimatedValue: string;
  published: boolean;
  publishLink?: string;
};

export type LandingPage = {
  title: string;
  headline: string;
  description: string;
  formFields: string[];
  ctaText: string;
  logo?: string;
  businessName: string;
  theme: 'light' | 'dark' | 'purple';
};

export type MarketingToolContextType = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  business: Business;
  setBusinessInfo: (info: Business) => void;
  icps: ICP[];
  setICPs: (icps: ICP[]) => void;
  addCustomICP: (icp: ICP) => void;
  usps: USP[];
  setUSPs: (usps: USP[]) => void;
  geographies: Geography[];
  setGeographies: (geos: Geography[]) => void;
  keywords: Keyword[];
  setKeywords: (keywords: Keyword[]) => void;
  contentIdeas: ContentIdea[];
  setContentIdeas: (ideas: ContentIdea[]) => void;
  publishContent: (id: string) => void;
  landingPage: LandingPage;
  updateLandingPage: (page: Partial<LandingPage>) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  resetAll: () => void;
};

const defaultBusiness: Business = {
  name: '',
  industry: '',
  description: '',
  targetAudience: '',
  mainProblem: '',
  mainSolution: '',
  existingCustomers: '',
};

const defaultLandingPage: LandingPage = {
  title: '',
  headline: '',
  description: '',
  formFields: ['email', 'name', 'company'],
  ctaText: 'Download Now',
  businessName: '',
  theme: 'light',
};

export const MarketingToolContext = createContext<MarketingToolContextType | undefined>(undefined);

export const MarketingToolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [business, setBusiness] = useState<Business>(defaultBusiness);
  const [icps, setICPs] = useState<ICP[]>([]);
  const [usps, setUSPs] = useState<USP[]>([]);
  const [geographies, setGeographies] = useState<Geography[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [landingPage, setLandingPage] = useState<LandingPage>(defaultLandingPage);
  const [isGenerating, setIsGenerating] = useState(false);

  const setBusinessInfo = (info: Business) => {
    setBusiness(info);
    setLandingPage(prev => ({
      ...prev,
      businessName: info.name,
      title: `${info.name} - ${info.mainSolution}`,
      headline: `Discover How ${info.name} Can Transform Your ${info.industry} Experience`,
      description: `Learn how our solutions help with ${info.mainProblem} and provide ${info.mainSolution} for ${info.targetAudience}.`,
    }));
  };

  const addCustomICP = (icp: ICP) => {
    setICPs(prev => [...prev, { ...icp, isCustomAdded: true }]);
  };

  const publishContent = (id: string) => {
    setContentIdeas(prev => 
      prev.map(idea => 
        idea.id === id 
          ? { ...idea, published: true, publishLink: `https://yourapp.com/content/${idea.id}` } 
          : idea
      )
    );
  };

  const updateLandingPage = (page: Partial<LandingPage>) => {
    setLandingPage(prev => ({ ...prev, ...page }));
  };

  const resetAll = () => {
    setCurrentStep(1);
    setBusiness(defaultBusiness);
    setICPs([]);
    setUSPs([]);
    setGeographies([]);
    setKeywords([]);
    setContentIdeas([]);
    setLandingPage(defaultLandingPage);
  };

  return (
    <MarketingToolContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        business,
        setBusinessInfo,
        icps,
        setICPs,
        addCustomICP,
        usps,
        setUSPs,
        geographies,
        setGeographies,
        keywords,
        setKeywords,
        contentIdeas,
        setContentIdeas,
        publishContent,
        landingPage,
        updateLandingPage,
        isGenerating,
        setIsGenerating,
        resetAll,
      }}
    >
      {children}
    </MarketingToolContext.Provider>
  );
};

export const useMarketingTool = () => {
  const context = useContext(MarketingToolContext);
  if (context === undefined) {
    throw new Error('useMarketingTool must be used within a MarketingToolProvider');
  }
  return context;
};
