import React, { createContext, useContext, useState, useEffect } from 'react';

export type Business = {
  name: string;
  industry: string;
  description: string;
  targetAudience: string;
  mainProblem: string;
  mainSolution: string;
  existingCustomers: string;
  products: string[];
};

export type ICP = {
  id: string;
  title: string;
  description: string;
  demographics: string;
  blueOceanScore?: number;
  reachMethods?: string[];
  productSuggestions?: string[];
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
  whyTarget?: string;
  recommendation: string;
  profitabilityRating?: string;
  pricingPower?: string;
  brandPersonality?: string;
  isCustomAdded?: boolean;
};

export type Keyword = {
  id: string;
  term: string;
  searchVolume: string;
  difficulty: string;
  relevance: string;
  relatedICP: string;
  competitorUsage?: string;
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
  products: [],
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

// Storage keys for localStorage
const STORAGE_KEYS = {
  CURRENT_STEP: 'marketing_tool_current_step',
  BUSINESS: 'marketing_tool_business',
  ICPS: 'marketing_tool_icps',
  USPS: 'marketing_tool_usps',
  GEOGRAPHIES: 'marketing_tool_geographies',
  KEYWORDS: 'marketing_tool_keywords',
  CONTENT_IDEAS: 'marketing_tool_content_ideas',
  LANDING_PAGE: 'marketing_tool_landing_page',
};

export const MarketingToolContext = createContext<MarketingToolContextType | undefined>(undefined);

export const MarketingToolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with data from localStorage or defaults
  const [currentStep, setCurrentStep] = useState<number>(() => {
    const savedStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
    return savedStep ? parseInt(savedStep, 10) : 1;
  });
  
  const [business, setBusiness] = useState<Business>(() => {
    const savedBusiness = localStorage.getItem(STORAGE_KEYS.BUSINESS);
    return savedBusiness ? JSON.parse(savedBusiness) : defaultBusiness;
  });
  
  const [icps, setICPs] = useState<ICP[]>(() => {
    const savedICPs = localStorage.getItem(STORAGE_KEYS.ICPS);
    return savedICPs ? JSON.parse(savedICPs) : [];
  });
  
  const [usps, setUSPs] = useState<USP[]>(() => {
    const savedUSPs = localStorage.getItem(STORAGE_KEYS.USPS);
    return savedUSPs ? JSON.parse(savedUSPs) : [];
  });
  
  const [geographies, setGeographies] = useState<Geography[]>(() => {
    const savedGeos = localStorage.getItem(STORAGE_KEYS.GEOGRAPHIES);
    return savedGeos ? JSON.parse(savedGeos) : [];
  });
  
  const [keywords, setKeywords] = useState<Keyword[]>(() => {
    const savedKeywords = localStorage.getItem(STORAGE_KEYS.KEYWORDS);
    return savedKeywords ? JSON.parse(savedKeywords) : [];
  });
  
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>(() => {
    const savedContent = localStorage.getItem(STORAGE_KEYS.CONTENT_IDEAS);
    return savedContent ? JSON.parse(savedContent) : [];
  });
  
  const [landingPage, setLandingPage] = useState<LandingPage>(() => {
    const savedLandingPage = localStorage.getItem(STORAGE_KEYS.LANDING_PAGE);
    return savedLandingPage ? JSON.parse(savedLandingPage) : defaultLandingPage;
  });
  
  const [isGenerating, setIsGenerating] = useState(false);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, currentStep.toString());
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(business));
  }, [business]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ICPS, JSON.stringify(icps));
  }, [icps]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USPS, JSON.stringify(usps));
  }, [usps]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GEOGRAPHIES, JSON.stringify(geographies));
  }, [geographies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.KEYWORDS, JSON.stringify(keywords));
  }, [keywords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTENT_IDEAS, JSON.stringify(contentIdeas));
  }, [contentIdeas]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANDING_PAGE, JSON.stringify(landingPage));
  }, [landingPage]);

  const setBusinessInfo = (info: Partial<Business>) => {
    // Auto-generate missing fields based on provided information
    const completeInfo = {
      ...business, // Start with existing business data
      ...info, // Add new info
      targetAudience: info.targetAudience || generateTargetAudience(info),
      mainSolution: info.mainSolution || generateSolution(info),
      existingCustomers: info.existingCustomers || generateExistingCustomers(info),
      products: info.products || business.products || [],
    };
    
    setBusiness(completeInfo);
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
    const updatedICPs = [...icps, { ...icp, id: generateUniqueId('custom-icp'), isCustomAdded: true }];
    setICPs(updatedICPs);
  };

  const addCustomUSP = (usp: USP) => {
    const updatedUSPs = [...usps, { ...usp, id: generateUniqueId('custom-usp'), isCustomAdded: true }];
    setUSPs(updatedUSPs);
  };

  const addCustomGeography = (geo: Geography) => {
    const updatedGeos = [...geographies, { ...geo, id: generateUniqueId('custom-geo'), isCustomAdded: true }];
    setGeographies(updatedGeos);
  };

  const addCustomKeyword = (keyword: Keyword) => {
    const updatedKeywords = [...keywords, { ...keyword, id: generateUniqueId('custom-kw'), isCustomAdded: true }];
    setKeywords(updatedKeywords);
  };

  const addCustomContentIdea = (idea: ContentIdea) => {
    const updatedIdeas = [...contentIdeas, { ...idea, id: generateUniqueId('custom-content'), isCustomAdded: true, published: false }];
    setContentIdeas(updatedIdeas);
  };

  const publishContent = (id: string) => {
    const updatedContent = contentIdeas.map(idea => 
      idea.id === id 
        ? { ...idea, published: true, publishLink: `https://yourapp.com/content/${idea.id}` } 
        : idea
    );
    setContentIdeas(updatedContent);
  };

  const updateLandingPage = (page: Partial<LandingPage>) => {
    setLandingPage(prev => ({ ...prev, ...page }));
  };

  const resetAll = () => {
    // Clear both state and localStorage
    setCurrentStep(1);
    setBusiness(defaultBusiness);
    setICPs([]);
    setUSPs([]);
    setGeographies([]);
    setKeywords([]);
    setContentIdeas([]);
    setLandingPage(defaultLandingPage);
    
    // Clear localStorage
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
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
