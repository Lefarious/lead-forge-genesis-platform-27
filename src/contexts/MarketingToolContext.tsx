import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { KeywordStats } from '@/components/keywords/KeywordDataVisualizer';

// Define the interface types here instead of importing them
export interface BusinessInfo {
  name: string;
  industry: string;
  description: string;  // Added this property
  mainProblem: string;  // Added this property
  products: string[];   // Added this property
  targetAudience: string;
  mainSolution: string;
  existingCustomers: string;
  missionStatement?: string;
  companyDescription?: string;
}

export interface ICP {
  id: string;
  title: string;
  description: string;
  demographics?: string;
  needs?: string;
  painPoints?: string;
  goals?: string;
  isCustomAdded?: boolean;
}

export interface USP {
  id: string;
  title: string;
  description: string;
  targetICP: string;
  valueProposition: string;
  isCustomAdded?: boolean;
}

export interface Geography {
  id: string;
  name: string;
  type: string;
  marketSize: string;
  competitionLevel: string;
  targetICPs: string[];
  isCustomAdded?: boolean;
  // Add missing properties
  region: string;
  growthRate: string;
  recommendation: string;
  whyTarget?: string;
  profitabilityRating?: string;
  pricingPower?: string;
  brandPersonality?: string;
}

export interface ContentIdea {
  id: string;
  title: string;
  description: string;
  type: string;
  targetICP: string;
  keywords: string[];
  published?: boolean;
  publishLink?: string;
  isCustomAdded?: boolean;
  // Add missing properties
  targetKeywords: string[];
  outline: string[];
  estimatedValue: string;
}

export interface PublishedContent {
  id: string;
  title: string;
  type: string;
  description: string;
  publishDate: string;
  link: string;
}

export interface LandingPage {
  title: string;
  headline: string;
  description: string;
  ctaText: string;
  theme: 'light' | 'dark' | 'purple';
  businessName: string;
}

export interface Competitor {
  id: string;
  name: string;
  url: string;
  description: string;
}

export interface Keyword {
  id: string;
  term: string;
  searchVolume: string;
  difficulty: string;
  relevance: string;
  relatedICP: string;
  competitorUsage?: string;
  isCustomAdded?: boolean;
}

const initialBusinessInfo: BusinessInfo = {
  name: '',
  industry: '',
  description: '',
  mainProblem: '',
  products: [],
  targetAudience: '',
  mainSolution: '',
  existingCustomers: '',
  missionStatement: '',
  companyDescription: '',
};

const initialLandingPage: LandingPage = {
  title: '',
  headline: '',
  description: '',
  ctaText: 'Download Now',
  theme: 'light',
  businessName: '',
};

export interface MarketingToolContextType {
  business: BusinessInfo;
  setBusiness: (business: BusinessInfo) => void;
  competitors: Competitor[];
  setCompetitors: (competitors: Competitor[]) => void;
  addCompetitor: (competitor: Omit<Competitor, 'id'>) => void;
  updateCompetitor: (id: string, updates: Partial<Competitor>) => void;
  deleteCompetitor: (id: string) => void;
  icps: ICP[];
  setIcps: (icps: ICP[]) => void;
  addIcp: (icp: Omit<ICP, 'id'>) => void;
  updateIcp: (id: string, updates: Partial<ICP>) => void;
  deleteIcp: (id: string) => void;
  usps: USP[];
  setUsps: (usps: USP[]) => void;
  addUsp: (usp: Omit<USP, 'id'>) => void;
  updateUsp: (id: string, updates: Partial<USP>) => void;
  deleteUsp: (id: string) => void;
  geographies: Geography[];
  setGeographies: (geographies: Geography[]) => void;
  addGeography: (geography: Omit<Geography, 'id'>) => void;
  updateGeography: (id: string, updates: Partial<Geography>) => void;
  deleteGeography: (id: string) => void;
  keywords: Keyword[];
  setKeywords: (keywords: Keyword[]) => void;
  addCustomKeyword: (keyword: Omit<Keyword, 'id'>) => void;
  contentIdeas: ContentIdea[];
  setContentIdeas: (contentIdeas: ContentIdea[]) => void;
  addContentIdea: (contentIdea: Omit<ContentIdea, 'id'>) => void;
  updateContentIdea: (id: string, updates: Partial<ContentIdea>) => void;
  deleteContentIdea: (id: string) => void;
  publishedContent: PublishedContent[];
  setPublishedContent: (publishedContent: PublishedContent[]) => void;
  addPublishedContent: (publishedContent: Omit<PublishedContent, 'id'>) => void;
  updatePublishedContent: (id: string, updates: Partial<PublishedContent>) => void;
  deletePublishedContent: (id: string) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  isStorageLoaded: boolean;
  setIsStorageLoaded: (loaded: boolean) => void;
  keywordStats: KeywordStats[];
  selectedKeywordStats: KeywordStats | null;
  setKeywordStats: (stats: KeywordStats[]) => void;
  setSelectedKeywordStats: (stats: KeywordStats | null) => void;
  // Add these missing methods to fix the errors
  setBusinessInfo: (businessInfo: BusinessInfo) => void;
  setICPs: (icps: ICP[]) => void;
  addCustomICP: (icp: Omit<ICP, 'id'>) => void;
  setUSPs: (usps: USP[]) => void;
  addCustomUSP: (usp: Omit<USP, 'id'>) => void;
  addCustomGeography: (geography: Omit<Geography, 'id'>) => void;
  addCustomContentIdea: (contentIdea: Omit<ContentIdea, 'id'>) => void;
  publishContent: (id: string, publishLink?: string) => void;
  landingPage: LandingPage;
  updateLandingPage: (updates: Partial<LandingPage>) => void;
}

export const MarketingToolContext = createContext<MarketingToolContextType | undefined>(undefined);

export const MarketingToolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [business, setBusiness] = useState<BusinessInfo>(initialBusinessInfo);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [icps, setIcps] = useState<ICP[]>([]);
  const [usps, setUsps] = useState<USP[]>([]);
  const [geographies, setGeographies] = useState<Geography[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [publishedContent, setPublishedContent] = useState<PublishedContent[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isStorageLoaded, setIsStorageLoaded] = useState<boolean>(false);
  const [keywordStats, setKeywordStats] = useState<KeywordStats[]>([]);
  const [selectedKeywordStats, setSelectedKeywordStats] = useState<KeywordStats | null>(null);
  const [landingPage, setLandingPage] = useState<LandingPage>(initialLandingPage);

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  const addCompetitor = (competitor: Omit<Competitor, 'id'>) => {
    const newCompetitor: Competitor = { ...competitor, id: uuidv4() };
    setCompetitors([...competitors, newCompetitor]);
  };

  // Add alias methods to fix the errors
  const setBusinessInfo = (businessInfo: BusinessInfo) => {
    setBusiness(businessInfo);
  };

  const setICPs = (newIcps: ICP[]) => {
    setIcps(newIcps);
  };

  const addCustomICP = (icp: Omit<ICP, 'id'>) => {
    const newIcp: ICP = { ...icp, id: uuidv4(), isCustomAdded: true };
    setIcps([...icps, newIcp]);
  };

  const setUSPs = (newUsps: USP[]) => {
    setUsps(newUsps);
  };

  const addCustomUSP = (usp: Omit<USP, 'id'>) => {
    const newUsp: USP = { ...usp, id: uuidv4(), isCustomAdded: true };
    setUsps([...usps, newUsp]);
  };

  const addCustomGeography = (geography: Omit<Geography, 'id'>) => {
    const newGeography: Geography = { ...geography, id: uuidv4(), isCustomAdded: true };
    setGeographies([...geographies, newGeography]);
  };

  const addCustomContentIdea = (contentIdea: Omit<ContentIdea, 'id'>) => {
    const newContentIdea: ContentIdea = { ...contentIdea, id: uuidv4(), isCustomAdded: true };
    setContentIdeas([...contentIdeas, newContentIdea]);
  };

  const publishContent = (id: string, publishLink: string = '') => {
    setContentIdeas(contentIdeas.map(content => 
      content.id === id ? { ...content, published: true, publishLink } : content
    ));
  };

  const updateLandingPage = (updates: Partial<LandingPage>) => {
    setLandingPage(prev => ({ ...prev, ...updates }));
  };

  // Keep the existing methods
  const updateCompetitor = (id: string, updates: Partial<Competitor>) => {
    setCompetitors(competitors.map(competitor => competitor.id === id ? { ...competitor, ...updates } : competitor));
  };

  const deleteCompetitor = (id: string) => {
    setCompetitors(competitors.filter(competitor => competitor.id !== id));
  };

  const addIcp = (icp: Omit<ICP, 'id'>) => {
    const newIcp: ICP = { ...icp, id: uuidv4() };
    setIcps([...icps, newIcp]);
  };

  const updateIcp = (id: string, updates: Partial<ICP>) => {
    setIcps(icps.map(icp => icp.id === id ? { ...icp, ...updates } : icp));
  };

  const deleteIcp = (id: string) => {
    setIcps(icps.filter(icp => icp.id !== id));
  };

  const addUsp = (usp: Omit<USP, 'id'>) => {
    const newUsp: USP = { ...usp, id: uuidv4() };
    setUsps([...usps, newUsp]);
  };

  const updateUsp = (id: string, updates: Partial<USP>) => {
    setUsps(usps.map(usp => usp.id === id ? { ...usp, ...updates } : usp));
  };

  const deleteUsp = (id: string) => {
    setUsps(usps.filter(usp => usp.id !== id));
  };

  const addGeography = (geography: Omit<Geography, 'id'>) => {
    const newGeography: Geography = { ...geography, id: uuidv4() };
    setGeographies([...geographies, newGeography]);
  };

  const updateGeography = (id: string, updates: Partial<Geography>) => {
    setGeographies(geographies.map(geography => geography.id === id ? { ...geography, ...updates } : geography));
  };

  const deleteGeography = (id: string) => {
    setGeographies(geographies.filter(geography => geography.id !== id));
  };

  const addCustomKeyword = (keyword: Omit<Keyword, 'id'>) => {
    const newKeyword: Keyword = { ...keyword, id: uuidv4(), isCustomAdded: true };
    setKeywords([...keywords, newKeyword]);
  };

  const addContentIdea = (contentIdea: Omit<ContentIdea, 'id'>) => {
    const newContentIdea: ContentIdea = { ...contentIdea, id: uuidv4() };
    setContentIdeas([...contentIdeas, newContentIdea]);
  };

  const updateContentIdea = (id: string, updates: Partial<ContentIdea>) => {
    setContentIdeas(contentIdeas.map(contentIdea => contentIdea.id === id ? { ...contentIdea, ...updates } : contentIdea));
  };

  const deleteContentIdea = (id: string) => {
    setContentIdeas(contentIdeas.filter(contentIdea => contentIdea.id !== id));
  };

  const addPublishedContent = (content: Omit<PublishedContent, 'id'>) => {
    const newContent: PublishedContent = { ...content, id: uuidv4() };
    setPublishedContent([...publishedContent, newContent]);
  };

  const updatePublishedContent = (id: string, updates: Partial<PublishedContent>) => {
    setPublishedContent(publishedContent.map(content => content.id === id ? { ...content, ...updates } : content));
  };

  const deletePublishedContent = (id: string) => {
    setPublishedContent(publishedContent.filter(content => content.id !== id));
  };

  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem('marketingToolData');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setBusiness(parsed.business || initialBusinessInfo);
        setCompetitors(parsed.competitors || []);
        setIcps(parsed.icps || []);
        setUsps(parsed.usps || []);
        setGeographies(parsed.geographies || []);
        setKeywords(parsed.keywords || []);
        setContentIdeas(parsed.contentIdeas || []);
        setPublishedContent(parsed.publishedContent || []);
        setKeywordStats(parsed.keywordStats || []);
        setLandingPage(parsed.landingPage || initialLandingPage);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    } finally {
      setIsStorageLoaded(true);
    }
  };

  const saveToLocalStorage = () => {
    try {
      const dataToSave = {
        business,
        competitors,
        icps,
        usps,
        geographies,
        keywords,
        contentIdeas,
        publishedContent,
        keywordStats,
        landingPage
      };
      localStorage.setItem('marketingToolData', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  };

  useEffect(() => {
    if (isStorageLoaded) {
      saveToLocalStorage();
    }
  }, [
    business, 
    competitors, 
    icps, 
    usps, 
    geographies, 
    keywords, 
    contentIdeas, 
    publishedContent,
    keywordStats,
    landingPage,
    isStorageLoaded
  ]);

  const contextValue: MarketingToolContextType = {
    business,
    setBusiness,
    competitors,
    setCompetitors,
    addCompetitor,
    updateCompetitor,
    deleteCompetitor,
    icps,
    setIcps,
    addIcp,
    updateIcp,
    deleteIcp,
    usps,
    setUsps,
    addUsp,
    updateUsp,
    deleteUsp,
    geographies,
    setGeographies,
    addGeography,
    updateGeography,
    deleteGeography,
    keywords,
    setKeywords,
    addCustomKeyword,
    contentIdeas,
    setContentIdeas,
    addContentIdea,
    updateContentIdea,
    deleteContentIdea,
    publishedContent,
    setPublishedContent,
    addPublishedContent,
    updatePublishedContent,
    deletePublishedContent,
    currentStep,
    setCurrentStep,
    isGenerating,
    setIsGenerating,
    isStorageLoaded,
    setIsStorageLoaded,
    keywordStats,
    selectedKeywordStats,
    setKeywordStats,
    setSelectedKeywordStats,
    // Add these to the context value
    setBusinessInfo,
    setICPs,
    addCustomICP,
    setUSPs,
    addCustomUSP,
    addCustomGeography,
    addCustomContentIdea,
    publishContent,
    landingPage,
    updateLandingPage,
  };

  return (
    <MarketingToolContext.Provider value={contextValue}>
      {children}
    </MarketingToolContext.Provider>
  );
};

export const useMarketingTool = () => {
  const context = useContext(MarketingToolContext);
  if (!context) {
    throw new Error('useMarketingTool must be used within a MarketingToolProvider');
  }
  return context;
};
