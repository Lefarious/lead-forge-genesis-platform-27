
import { toast } from 'sonner';

// Constants
const MANAGER_CUSTOMER_ID = '981-519-4690';
const API_ENDPOINT = 'https://api.adplatform.mock/v1';

/**
 * Create a customer account based on business information
 */
const createCustomer = async (business: any): Promise<string> => {
  try {
    console.log('Creating customer with business info:', business.name);
    
    // In a real implementation, this would be an actual API call
    // Simulating API request for customer creation
    const response = await simulateApiCall({
      endpoint: `${API_ENDPOINT}/customers/create`,
      method: 'POST',
      data: {
        managerCustomerId: MANAGER_CUSTOMER_ID,
        customerName: business.name,
        industry: business.industry,
        timezone: getTimezoneFromCountry(business.country || 'United States'),
        businessCountry: business.country || 'United States'
      }
    });
    
    return response.customerId;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw new Error('Failed to create customer account');
  }
};

/**
 * Create an ad campaign for a given customer
 */
const createCampaign = async (customerId: string, business: any): Promise<string> => {
  try {
    console.log('Creating campaign for customer:', customerId);
    
    // Simulating API request for campaign creation
    const response = await simulateApiCall({
      endpoint: `${API_ENDPOINT}/campaigns/create`,
      method: 'POST',
      data: {
        customerId,
        campaignName: `${business.name} - Main Campaign`,
        campaignObjective: 'SALES',
        dailyBudget: 100.00,
        targetCountry: business.country || 'United States',
        industry: business.industry
      }
    });
    
    return response.campaignId;
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw new Error('Failed to create ad campaign');
  }
};

/**
 * Generate keywords based on business USPs
 */
const generateKeywordsForUSP = async (
  customerId: string,
  campaignId: string,
  usp: any
): Promise<any[]> => {
  try {
    console.log('Generating keywords for USP:', usp.title);
    
    // Simulating API request for keyword generation
    const response = await simulateApiCall({
      endpoint: `${API_ENDPOINT}/keywords/generate`,
      method: 'POST',
      data: {
        customerId,
        campaignId,
        matchType: 'EXACT',
        uspTitle: usp.title,
        uspDescription: usp.description,
        valueProposition: usp.valueProposition,
        targetAudience: usp.targetICP,
        maxKeywords: 10
      }
    });
    
    return response.keywords || [];
  } catch (error) {
    console.error('Error generating keywords for USP:', error);
    return [];
  }
};

/**
 * Get keyword statistics for a set of keywords
 */
const getKeywordStatistics = async (
  customerId: string,
  campaignId: string,
  keywordIds: string[]
): Promise<any[]> => {
  try {
    console.log('Fetching statistics for keywords');
    
    // Simulating API request for keyword statistics
    const response = await simulateApiCall({
      endpoint: `${API_ENDPOINT}/keywords/statistics`,
      method: 'POST',
      data: {
        customerId,
        campaignId,
        keywordIds,
        timeRange: 'LAST_30_DAYS'
      }
    });
    
    return response.keywordStats || [];
  } catch (error) {
    console.error('Error fetching keyword statistics:', error);
    return [];
  }
};

/**
 * Main function to generate keywords
 */
export const generateKeywords = async (
  business: any, 
  icps: any[] = [], 
  usps: any[] = [], 
  existingKeywords: any[] = [],
  geographies: any[] = []
): Promise<any[]> => {
  try {
    // Check if we have a developer token
    const developerToken = localStorage.getItem('developer_token');
    if (!developerToken) {
      toast.error('Please set your Developer Token first');
      throw new Error('Developer token not found');
    }

    // Create a customer using business information
    console.log('Initiating keyword generation process with MANAGER_CUSTOMER_ID:', MANAGER_CUSTOMER_ID);
    const customerId = await createCustomer(business);
    console.log('Customer created with ID:', customerId);
    
    // Create an ad campaign
    const campaignId = await createCampaign(customerId, business);
    console.log('Campaign created with ID:', campaignId);
    
    // Extract existing terms to avoid duplicates
    const existingTerms = existingKeywords.map(kw => kw.term.toLowerCase());
    
    // Generate keywords for each USP
    let allKeywords: any[] = [];
    for (const usp of usps) {
      const uspKeywords = await generateKeywordsForUSP(customerId, campaignId, usp);
      allKeywords = [...allKeywords, ...uspKeywords];
    }
    
    // Ensure we don't exceed 20 keywords
    allKeywords = allKeywords.slice(0, 20);
    
    // Get statistics for generated keywords
    const keywordIds = allKeywords.map(kw => kw.keywordId);
    const keywordStats = await getKeywordStatistics(customerId, campaignId, keywordIds);
    
    // Merge keyword data with statistics
    const finalKeywords = allKeywords.map((keyword, index) => {
      const stats = keywordStats.find(stat => stat.keywordId === keyword.keywordId) || {};
      
      return {
        id: `api-kw-${Date.now()}-${index}`,
        term: keyword.text,
        searchVolume: formatSearchVolume(stats.searchVolume),
        difficulty: mapCompetitionToDifficulty(stats.competition),
        relevance: mapRelevanceScore(stats.relevanceScore),
        relatedICP: mapKeywordToICP(keyword.text, icps),
        competitorUsage: mapCompetitorPresence(stats.competitorPresence),
        isCustomAdded: false
      };
    });
    
    // Filter out any keywords that duplicate existing ones
    const uniqueKeywords = finalKeywords.filter(kw => 
      !existingTerms.includes((kw.term || '').toLowerCase())
    );
    
    return uniqueKeywords;
  } catch (error) {
    console.error('Keywords generation error:', error);
    throw error;
  }
};

// Helper functions

/**
 * Helper function to simulate API calls (for development)
 */
const simulateApiCall = async ({ endpoint, method, data }: { 
  endpoint: string; 
  method: string; 
  data: any;
}): Promise<any> => {
  console.log(`Simulating ${method} request to ${endpoint}`, data);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate mock responses based on the endpoint
  if (endpoint.includes('/customers/create')) {
    return {
      success: true,
      customerId: `cust_${Math.random().toString(36).substring(2, 10)}`
    };
  }
  
  if (endpoint.includes('/campaigns/create')) {
    return {
      success: true,
      campaignId: `camp_${Math.random().toString(36).substring(2, 10)}`
    };
  }
  
  if (endpoint.includes('/keywords/generate')) {
    // Generate mock keywords based on USP
    const keywords = [];
    const usp = data.uspTitle.toLowerCase();
    const baseKeywords = [
      `best ${usp}`,
      `${usp} service`,
      `affordable ${usp}`,
      `${usp} solutions`,
      `professional ${usp}`,
      `${usp} company`,
      `top ${usp} provider`,
      `${usp} experts`,
      `${usp} consulting`,
      `${usp} management`
    ];
    
    // Create keyword objects
    for (let i = 0; i < baseKeywords.length; i++) {
      keywords.push({
        keywordId: `kw_${Math.random().toString(36).substring(2, 10)}`,
        text: baseKeywords[i],
        matchType: 'EXACT'
      });
    }
    
    return {
      success: true,
      keywords
    };
  }
  
  if (endpoint.includes('/keywords/statistics')) {
    // Generate statistics for each keyword
    const stats = data.keywordIds.map((id: string) => {
      return {
        keywordId: id,
        searchVolume: Math.floor(Math.random() * 10000) + 500,
        competition: Math.random(),
        relevanceScore: Math.random() * 5,
        competitorPresence: Math.random(),
        averageCpc: (Math.random() * 5 + 0.5).toFixed(2),
      };
    });
    
    return {
      success: true,
      keywordStats: stats
    };
  }
  
  // Default response
  return { success: false, error: 'Invalid endpoint' };
};

/**
 * Format search volume as a string range
 */
const formatSearchVolume = (volume: number): string => {
  if (!volume) return '1,000-5,000';
  
  if (volume < 1000) {
    return `${volume}-${volume + 500}`;
  } else if (volume < 5000) {
    return `${Math.floor(volume / 1000)}K-${Math.ceil(volume / 1000) + 2}K`;
  } else {
    return `${Math.floor(volume / 1000)}K-${Math.ceil(volume / 1000) + 5}K`;
  }
};

/**
 * Map competition score to difficulty level
 */
const mapCompetitionToDifficulty = (competition: number): string => {
  if (!competition && competition !== 0) return 'Medium';
  
  if (competition < 0.3) return 'Low';
  if (competition < 0.5) return 'Medium-Low';
  if (competition < 0.7) return 'Medium';
  if (competition < 0.9) return 'Medium-High';
  return 'High';
};

/**
 * Map relevance score to relevance level
 */
const mapRelevanceScore = (score: number): string => {
  if (!score && score !== 0) return 'Medium';
  
  if (score < 2) return 'Low';
  if (score < 4) return 'Medium';
  return 'High';
};

/**
 * Map keyword to most relevant ICP
 */
const mapKeywordToICP = (keyword: string, icps: any[]): string => {
  if (!icps || icps.length === 0) return 'General';
  
  // In a real implementation, we would use ML to match keywords to ICPs
  // For now, randomly assign to an ICP
  const randomIndex = Math.floor(Math.random() * icps.length);
  return icps[randomIndex].title;
};

/**
 * Map competitor presence to usage level
 */
const mapCompetitorPresence = (presence: number): string => {
  if (!presence && presence !== 0) return 'Medium';
  
  if (presence < 0.3) return 'Low';
  if (presence < 0.7) return 'Medium';
  return 'High';
};

/**
 * Get timezone from country name
 */
const getTimezoneFromCountry = (country: string): string => {
  const countryTimezones: Record<string, string> = {
    'United States': 'America/New_York',
    'Canada': 'America/Toronto',
    'United Kingdom': 'Europe/London',
    'Australia': 'Australia/Sydney',
    'Germany': 'Europe/Berlin',
    'France': 'Europe/Paris',
    'Japan': 'Asia/Tokyo',
    'China': 'Asia/Shanghai',
    'India': 'Asia/Kolkata',
    'Brazil': 'America/Sao_Paulo'
    // Add more countries as needed
  };
  
  return countryTimezones[country] || 'UTC';
};
