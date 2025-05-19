
import { callOpenAI } from '../api/openaiApi';
import { parseJsonResponse, ensureArray } from '../parsers/jsonParser';

// Helper function to standardize market size
const standardizeMarketSize = (marketSize: string): string => {
  if (!marketSize) return '';
  
  // Check if already in standardized format
  if (/^\d+(\.\d+)?[KMB]$/i.test(marketSize)) {
    return marketSize.toUpperCase();
  }
  
  // Convert market size to standardized format
  const cleanedValue = marketSize.replace(/[^\d.]/g, '');
  const numValue = parseFloat(cleanedValue);
  
  if (isNaN(numValue)) return marketSize;
  
  if (marketSize.toLowerCase().includes('billion') || marketSize.toLowerCase().includes('b')) {
    return `${numValue}B`;
  } else if (marketSize.toLowerCase().includes('million') || marketSize.toLowerCase().includes('m')) {
    return `${numValue}M`;
  } else if (marketSize.toLowerCase().includes('thousand') || marketSize.toLowerCase().includes('k')) {
    return `${numValue}K`;
  }
  
  // If the number is large enough, convert to appropriate unit
  if (numValue >= 1_000_000_000) {
    return `${(numValue / 1_000_000_000).toFixed(1)}B`;
  } else if (numValue >= 1_000_000) {
    return `${(numValue / 1_000_000).toFixed(1)}M`;
  } else if (numValue >= 1_000) {
    return `${(numValue / 1_000).toFixed(1)}K`;
  }
  
  return marketSize;
};

export const generateGeographies = async (business: any, existingGeographies: any[] = []): Promise<any[]> => {
  try {
    const existingRegions = existingGeographies.map(geo => geo.region.toLowerCase());

    const messages = [
      {
        role: 'system',
        content: `You are an expert marketing strategist helping a business identify the best target countries for expansion.
        Given the following business information, analyze and recommend 2-3 countries to target.
        For each country, provide:
        - region (country name)
        - marketSize (in USD, use standardized formats like 5B, 100M, 500K)
        - growthRate (% annually)
        - competitionLevel (High, Medium, Low)
        - whyTarget (a brief explanation of why this country is a good target)
        - recommendation (a strategic recommendation for this market)
        - pricingPower (Strong, Moderate, Weak) - how much pricing leverage the business would have in this market
        - profitabilityRating (High, Medium, Low) - expected profitability in this market
        - brandPersonality (brief description) - what brand traits would resonate best in this market
        Ensure the countries are diverse and not already in the existing list.
        Respond in JSON format only, using exactly these field names.`
      },
      {
        role: 'user',
        content: `Business Name: ${business.name}\nIndustry: ${business.industry}\nDescription: ${business.description}\nTarget Market: ${business.targetMarket}`
      }
    ];

    const responseData = await callOpenAI(messages);
    console.log('Geography generation response:', responseData);

    const contentString = responseData.choices[0].message.content;
    const parsedContent = parseJsonResponse(contentString);

    let geographies = ensureArray(parsedContent);

    // Filter out existing regions
    geographies = geographies.filter(geo => !existingRegions.includes(geo.region?.toLowerCase()));

    if (geographies.length === 0) {
      throw new Error('No new geography recommendations could be generated');
    }

    return geographies.map((geo: any, index: number) => ({
      id: `gen-geo-${Date.now()}-${index}`,
      region: geo.region,
      marketSize: standardizeMarketSize(geo.marketSize),
      growthRate: geo.growthRate,
      competitionLevel: geo.competitionLevel,
      whyTarget: geo.whyTarget,
      recommendation: geo.recommendation,
      pricingPower: geo.pricingPower,
      profitabilityRating: geo.profitabilityRating,
      brandPersonality: geo.brandPersonality,
      isCustomAdded: false
    }));
  } catch (error) {
    console.error('Geography generation error:', error);
    throw error;
  }
};
