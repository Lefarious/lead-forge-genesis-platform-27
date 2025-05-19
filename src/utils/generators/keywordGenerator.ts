
import { callOpenAI } from '../api/openaiApi';
import { parseJsonResponse, ensureArray } from '../parsers/jsonParser';

export const generateKeywords = async (
  business: any, 
  icps: any[] = [], 
  usps: any[] = [], 
  existingKeywords: any[] = [],
  geographies: any[] = []
): Promise<any[]> => {
  try {
    // Extract existing terms to avoid duplicates
    const existingTerms = existingKeywords.map(kw => kw.term.toLowerCase());
    
    // Prepare all business data as key-value pairs
    const businessData = {
      name: business.name,
      industry: business.industry,
      description: business.description,
      mainProblem: business.mainProblem || 'Not specified',
      mainSolution: business.mainSolution || 'Not specified',
      targetAudience: business.targetAudience || 'Not specified',
      existingCustomers: business.existingCustomers || 'Not specified'
    };
    
    // Prepare ICP data
    const icpData = icps.map(icp => ({
      title: icp.title,
      description: icp.description,
      painPoints: Array.isArray(icp.painPoints) ? icp.painPoints : [icp.painPoints],
      goals: Array.isArray(icp.goals) ? icp.goals : [icp.goals],
      demographics: typeof icp.demographics === 'string' ? icp.demographics : JSON.stringify(icp.demographics),
      blueOceanScore: icp.blueOceanScore
    }));
    
    // Prepare USP data
    const uspData = usps.map(usp => ({
      title: usp.title,
      description: usp.description,
      targetICP: usp.targetICP,
      valueProposition: usp.valueProposition
    }));
    
    // Prepare geography data
    const geoData = geographies.map(geo => ({
      region: geo.region,
      marketSize: geo.marketSize,
      growthRate: geo.growthRate,
      competitionLevel: geo.competitionLevel,
      whyTarget: geo.whyTarget,
      pricingPower: geo.pricingPower,
      profitabilityRating: geo.profitabilityRating,
      brandPersonality: geo.brandPersonality
    }));
    
    // Include existing keywords to avoid duplication
    const existingKeywordPrompt = existingTerms.length > 0
      ? `Existing Keywords (DO NOT DUPLICATE): ${existingTerms.join(', ')}` 
      : '';

    const messages = [
      {
        role: 'system',
        content: `You are an expert SEO strategist helping a business identify valuable keywords.
        Based on all the provided business data, generate EXACTLY 15 highly relevant keywords.
        For each keyword provide:
        - term (the actual search term or phrase)
        - searchVolume (estimated monthly searches, e.g., "1,000-5,000")
        - difficulty (Low, Medium-Low, Medium, Medium-High, High)
        - relevance (Low, Medium, High)
        - relatedICP (which ICP from the provided list this keyword primarily targets)
        - competitorUsage (Low, Medium, High - how frequently competitors are using this keyword)
        
        Ensure keywords are varied, specific, and have commercial intent where appropriate.
        Include some long-tail keywords with lower competition.
        Generate keywords that cover all geographic regions and ICPs, but prioritize those with higher profitability.
        DO NOT INCLUDE ANY KEYWORDS THAT ARE ALREADY IN THE EXISTING LIST.
        Respond in JSON format only, using exactly these field names, all in lowercase.`
      },
      {
        role: 'user',
        content: JSON.stringify({
          business: businessData,
          icps: icpData,
          usps: uspData,
          geographies: geoData,
          existingKeywords: existingKeywordPrompt
        })
      }
    ];

    const responseData = await callOpenAI(messages, { maxTokens: 2000 });
    console.log('Keywords generation response:', responseData);

    const contentString = responseData.choices[0].message.content;
    const parsedContent = parseJsonResponse(contentString);
    
    // Ensure we have an array of keywords
    let keywords = ensureArray(parsedContent);
    
    // Validate that we have data
    if (!keywords || keywords.length === 0) {
      throw new Error('No valid keywords found in response');
    }
    
    // Filter out any keywords that duplicate existing ones
    keywords = keywords.filter(kw => 
      !existingTerms.includes((kw.term || '').toLowerCase())
    );
    
    return keywords.map((keyword: any, index: number) => ({
      id: `gen-kw-${Date.now()}-${index}`,
      term: keyword.term,
      searchVolume: keyword.searchVolume,
      difficulty: keyword.difficulty,
      relevance: keyword.relevance,
      relatedICP: keyword.relatedICP,
      competitorUsage: keyword.competitorUsage,
      isCustomAdded: false
    }));
  } catch (error) {
    console.error('Keywords generation error:', error);
    throw error;
  }
};
