
import { callOpenAI } from '../api/openaiApi';
import { parseJsonResponse } from '../parsers/jsonParser';

export const generateCompetitiveAnalysis = async (business: any, usp: any): Promise<any> => {
  try {
    const messages = [
      {
        role: 'system',
        content: `You are an expert market analyst helping a business understand the competitive landscape for one of their Unique Selling Points (USPs).
        Based on the business information and USP provided, generate a competitive analysis that includes:
        1. marketsubstitutes: List 2-3 closest substitutes or competitors in the market
        2. competitoradvantages: What advantages these competitors have over the business
        3. businessadvantages: What advantages the business has over these competitors
        4. pricingstrategy: Recommended pricing strategy for this USP (e.g., premium, value, freemium, subscription)
        5. monetizationplan: Specific monetization suggestions for this USP
        6. usphealth: An overall assessment of the USP's strength (Strong, Moderate, Needs Improvement)
        7. healthreasoning: Brief explanation of the USP health assessment
        
        Respond in JSON format using exactly these field names, all in lowercase.`
      },
      {
        role: 'user',
        content: `Business Name: ${business.name}
        Industry: ${business.industry}
        Description: ${business.description}
        
        USP Title: ${usp.title || 'Not specified'}
        USP Description: ${usp.description || 'Not specified'}
        Target ICP: ${usp.targetICP || 'Not specified'}
        Value Proposition: ${usp.valueProposition || 'Not specified'}`
      }
    ];

    const responseData = await callOpenAI(messages);
    console.log('Competitive analysis response:', responseData);

    const contentString = responseData.choices[0].message.content;
    const parsedContent = parseJsonResponse(contentString);
    
    // Validate that we have data
    if (!parsedContent) {
      throw new Error('No valid competitive analysis found in response');
    }
    
    return parsedContent;
  } catch (error) {
    console.error('Competitive analysis error:', error);
    throw error;
  }
};
