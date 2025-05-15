
import { KeywordStats } from '@/components/keywords/KeywordDataVisualizer';
import { Keyword } from '@/contexts/MarketingToolContext';

// Function to get mock data while we don't have real API access
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

// Function to simulate API call to Google Keyword Planner
export const fetchKeywordStats = async (
  keyword: Keyword, 
  apiKey: string
): Promise<KeywordStats> => {
  // In a real implementation, this would make an actual API call to Google's API
  console.log(`Fetching keyword stats for ${keyword.term} with API key: ${apiKey.substring(0, 3)}...`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // For demonstration, generate mock data
  return generateMockKeywordStats(keyword);
};

// Function to simulate getting keyword suggestions based on seed keywords
export const optimizeKeywords = async (
  keywords: Keyword[],
  apiKey: string
): Promise<KeywordStats[]> => {
  console.log(`Optimizing ${keywords.length} keywords with API key: ${apiKey.substring(0, 3)}...`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // For demonstration, generate mock data for each keyword
  return keywords.map(keyword => generateMockKeywordStats(keyword));
};

// Function to generate more synonyms for a keyword
export const generateMoreSynonyms = async (
  keyword: string,
  apiKey: string
): Promise<string[]> => {
  console.log(`Generating more synonyms for ${keyword} with API key: ${apiKey.substring(0, 3)}...`);
  
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
};
