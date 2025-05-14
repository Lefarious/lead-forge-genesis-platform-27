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
  isCustomAdded?: boolean;
};

export type Geography = {
  id: string;
  region: string;
  marketSize: string;
  growthRate: string;
  competitionLevel: string;
  recommendation: string;
  isCustomAdded?: boolean;
};

export type Keyword = {
  id: string;
  term: string;
  searchVolume: string;
  difficulty: string;
  relevance: string;
  relatedICP: string;
  isCustomAdded?: boolean;
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
  isCustomAdded?: boolean;
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
  addCustomUSP: (usp: USP) => void;
  geographies: Geography[];
  setGeographies: (geos: Geography[]) => void;
  addCustomGeography: (geo: Geography) => void;
  keywords: Keyword[];
  setKeywords: (keywords: Keyword[]) => void;
  addCustomKeyword: (keyword: Keyword) => void;
  contentIdeas: ContentIdea[];
  setContentIdeas: (ideas: ContentIdea[]) => void;
  addCustomContentIdea: (idea: ContentIdea) => void;
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

  const setBusinessInfo = (info: Partial<Business>) => {
    // Auto-generate missing fields based on provided information
    const completeInfo = {
      ...info,
      targetAudience: generateTargetAudience(info),
      mainSolution: generateSolution(info),
      existingCustomers: generateExistingCustomers(info),
    };
    
    setBusiness(prev => ({ ...prev, ...completeInfo }));
    setLandingPage(prev => ({
      ...prev,
      businessName: info.name || prev.businessName,
      title: `${info.name || prev.businessName} - ${completeInfo.mainSolution}`,
      headline: `Discover How ${info.name || prev.businessName} Can Transform Your ${info.industry || prev.businessName} Experience`,
      description: `Learn how our solutions help with ${completeInfo.mainProblem} and provide ${completeInfo.mainSolution} for ${completeInfo.targetAudience}.`,
    }));
  };

  // Helper functions to generate missing fields
  const generateTargetAudience = (info: Partial<Business>): string => {
    if (info.industry && info.description) {
      return `Businesses and professionals in the ${info.industry} industry looking to improve their operations`;
    }
    return "Industry professionals and businesses";
  };

  const generateSolution = (info: Partial<Business>): string => {
    if (info.mainProblem) {
      return `Comprehensive ${info.industry || ''} solution that addresses ${info.mainProblem}`;
    }
    return "Innovative solutions tailored to industry needs";
  };

  const generateExistingCustomers = (info: Partial<Business>): string => {
    if (info.industry) {
      return `Leading companies in the ${info.industry} industry`;
    }
    return "Various businesses across multiple sectors";
  };

  // Generate a unique ID for custom entities
  const generateUniqueId = (prefix: string) => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  // Add new custom entity functions with unique IDs
  const addCustomICP = (icp: ICP) => {
    setICPs([...icps, { ...icp, id: generateUniqueId('custom-icp'), isCustomAdded: true }]);
  };

  const addCustomUSP = (usp: USP) => {
    setUSPs([...usps, { ...usp, id: generateUniqueId('custom-usp'), isCustomAdded: true }]);
  };

  const addCustomGeography = (geo: Geography) => {
    setGeographies([...geographies, { ...geo, id: generateUniqueId('custom-geo'), isCustomAdded: true }]);
  };

  const addCustomKeyword = (keyword: Keyword) => {
    setKeywords([...keywords, { ...keyword, id: generateUniqueId('custom-kw'), isCustomAdded: true }]);
  };

  const addCustomContentIdea = (idea: ContentIdea) => {
    setContentIdeas([...contentIdeas, { ...idea, id: generateUniqueId('custom-content'), isCustomAdded: true, published: false }]);
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
        addCustomUSP,
        geographies,
        setGeographies,
        addCustomGeography,
        keywords,
        setKeywords,
        addCustomKeyword,
        contentIdeas,
        setContentIdeas,
        addCustomContentIdea,
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
