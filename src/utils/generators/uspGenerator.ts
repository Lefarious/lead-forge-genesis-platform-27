
import { callOpenAI } from '../api/openaiApi';
import { parseJsonResponse, ensureArray } from '../parsers/jsonParser';

export const generateUSPs = async (business: any, icps: any[], existingUSPs: any[] = []): Promise<any[]> => {
  try {
    // Extract existing titles to avoid duplicates
    const existingTitles = existingUSPs.map(usp => usp.title ? usp.title.toLowerCase() : '');
    
    // Include ICPs in the prompt
    const icpPrompt = icps.length > 0 
      ? `ICPs: ${icps.map(icp => `${icp.title} - ${icp.description}`).join('\n')}` 
      : 'No ICPs provided.';

    // Include business country if available
    const countryPrompt = business.country 
      ? `Origin Country: ${business.country}` 
      : 'Origin country not specified.';
    
    const messages = [
      {
        role: 'system',
        content: `You are an expert marketing strategist helping a business identify their unique selling propositions (USPs).
        Based on the business information and ICPs provided, generate 2-3 strong USPs that would appeal to their ideal customers.
        For each USP provide:
        - title (concise name for this USP)
        - description (2-3 sentences explaining this USP)
        - targetICP (which ICP from the provided list this USP primarily targets, must be exact match of ICP title)
        - valueProposition (clear statement of the value delivered)
        - competitorComparison (how this USP compares to competitors' offerings - 1-2 sentences)
        Ensure these are compelling differentiators that are meaningful to the target audience.
        Make sure none of the USPs duplicate existing ones.
        VERY IMPORTANT: Return a valid JSON ARRAY only, with no additional text or markdown formatting.
        Use exactly these field names with this exact capitalization: title, description, targetICP, valueProposition, competitorComparison.`
      },
      {
        role: 'user',
        content: `Business Name: ${business.name}
        Industry: ${business.industry}
        Description: ${business.description}
        Main Problem: ${business.mainProblem || 'Not specified'}
        ${countryPrompt}
        
        ${icpPrompt}`
      }
    ];

    const responseData = await callOpenAI(messages);
    console.log('USP generation response:', responseData);

    const contentString = responseData.choices[0].message.content;
    console.log('Raw USP content:', contentString);
    
    const parsedContent = parseJsonResponse(contentString);
    let usps = ensureArray(parsedContent);
    
    console.log('Parsed USPs:', usps);
    
    // Filter out any USPs that duplicate existing ones - adding null check
    usps = usps.filter(usp => {
      if (!usp.title) return true; // Keep items without title
      const title = (usp.title || '').toLowerCase();
      return !existingTitles.includes(title);
    });
    
    // Map the response to match our expected schema, ensuring consistency with field names
    return usps.map((usp: any, index: number) => ({
      id: `gen-usp-${Date.now()}-${index}`,
      title: usp.title || 'Untitled USP',
      description: usp.description || 'No description provided',
      targetICP: usp.targetICP || '', // Using correct case
      valueProposition: usp.valueProposition || '', // Using correct case
      competitorComparison: usp.competitorComparison || 'No competitor comparison provided',
      isCustomAdded: false
    }));
  } catch (error) {
    console.error('USP generation error:', error);
    throw error;
  }
};
