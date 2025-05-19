
// Constants
const MANAGER_CUSTOMER_ID = '981-519-4690';
const API_ENDPOINT = 'https://api.adplatform.mock/v1';

import { KeywordStats } from '@/components/keywords/KeywordDataVisualizer';
import { Keyword } from '@/contexts/MarketingToolContext';

// Function to generate mock keyword statistics for development/demo
export const generateMockKeywordStats = (keyword: Keyword): KeywordStats => {
  const dates = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const forecastData = dates.map(date => ({
    date,
    searches: Math.floor(Math.random() * 10000) + 1000,
    clicks: Math.floor(Math.random() * 5000) + 500,
  }));

  const historicalData = dates.map(date => ({
    date,
    searches: Math.floor(Math.random() * 8000) + 2000,
    clicks: Math.floor(Math.random() * 4000) + 1000,
  }));

  // Generate random synonyms
  const baseSynonyms = [
    `best ${keyword.term}`,
    `${keyword.term} service`,
    `${keyword.term} online`,
    `${keyword.term} near me`,
    `affordable ${keyword.term}`,
    `${keyword.term} software`,
    `${keyword.term} tools`,
    `${keyword.term} platforms`,
  ];
  
  // Shuffle and take a subset
  const synonyms = [...baseSynonyms]
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 4) + 3);

  // Mock competitor data
  const competitors = ['Competitor A', 'Competitor B', 'Competitor C', 'Competitor D', 'Your Company'];
  const competitorRankings = competitors.map(competitor => ({
    competitor,
    position: Math.floor(Math.random() * 10) + 1,
  })).sort((a, b) => a.position - b.position);

  return {
    id: keyword.id,
    term: keyword.term,
    forecastData,
    historicalData,
    synonyms,
    competition: Math.random(),
    suggestedBid: `$${(Math.random() * 5 + 0.5).toFixed(2)}`,
    competitorRankings,
  };
};

/**
 * Simulates a customer creation API call (for development)
 */
const createCustomer = async (keyword: Keyword, token: string) => {
  console.log(`Creating customer for keyword: ${keyword.term} using token: ${token.substring(0, 3)}...`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    customerId: `cust_${Math.random().toString(36).substring(2, 10)}`,
    customerName: "Dynamically Generated Customer",
    creationDate: new Date().toISOString()
  };
};

/**
 * Simulates creating an ad campaign (for development)
 */
const createCampaign = async (customerId: string, keyword: Keyword) => {
  console.log(`Creating campaign for customer: ${customerId}, keyword: ${keyword.term}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    campaignId: `camp_${Math.random().toString(36).substring(2, 10)}`,
    campaignName: `Campaign for ${keyword.term}`,
    creationDate: new Date().toISOString()
  };
};

// Function to simulate API call to fetch keyword stats
export const fetchKeywordStats = async (
  keyword: Keyword, 
  token: string
): Promise<KeywordStats> => {
  // Log operation with token preview (for security)
  console.log(`Fetching keyword stats for ${keyword.term} with token: ${token.substring(0, 3)}...`);
  
  try {
    // Create a customer first
    const customer = await createCustomer(keyword, token);
    console.log(`Customer created: ${customer.customerId}`);
    
    // Create a campaign
    const campaign = await createCampaign(customer.customerId, keyword);
    console.log(`Campaign created: ${campaign.campaignId}`);
    
    // Simulate API response delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock data
    return generateMockKeywordStats(keyword);
  } catch (error) {
    console.error('Error fetching keyword stats:', error);
    throw new Error('Failed to fetch keyword statistics');
  }
};

// Function to simulate optimizing keywords
export const optimizeKeywords = async (
  keywords: Keyword[],
  token: string
): Promise<KeywordStats[]> => {
  console.log(`Optimizing ${keywords.length} keywords with token: ${token.substring(0, 3)}...`);
  
  try {
    if (keywords.length === 0) {
      return [];
    }
    
    // Create a customer for this batch
    const customer = await createCustomer(keywords[0], token);
    console.log(`Customer created for batch: ${customer.customerId}`);
    
    // Create a campaign
    const campaign = await createCampaign(customer.customerId, keywords[0]);
    console.log(`Campaign created for batch: ${campaign.campaignId}`);
    
    // Simulate network delay for batch processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate stats for each keyword
    const stats: KeywordStats[] = [];
    for (const keyword of keywords) {
      stats.push(generateMockKeywordStats(keyword));
      // Small delay between each keyword to simulate real API behavior
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`Optimization complete for ${keywords.length} keywords`);
    return stats;
  } catch (error) {
    console.error('Error optimizing keywords:', error);
    throw new Error('Failed to optimize keywords');
  }
};

// Function to generate more synonyms for a keyword
export const generateMoreSynonyms = async (
  keyword: string,
  token: string
): Promise<string[]> => {
  console.log(`Generating more synonyms for ${keyword} with token: ${token.substring(0, 3)}...`);
  
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate some random synonyms
    const potentialSynonyms = [
      `${keyword} service provider`,
      `top ${keyword}`,
      `${keyword} solutions`,
      `enterprise ${keyword}`,
      `${keyword} management`,
      `${keyword} strategy`,
      `${keyword} consulting`,
      `${keyword} analytics`,
      `${keyword} software`,
      `${keyword} platform`,
      `professional ${keyword}`,
      `${keyword} agency`,
    ];
    
    // Shuffle and take 5-8 synonyms
    return [...potentialSynonyms]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 4) + 5);
  } catch (error) {
    console.error('Error generating synonyms:', error);
    throw new Error('Failed to generate additional synonyms');
  }
};
