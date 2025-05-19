
import { callOpenAI } from '../api/openaiApi';
import { parseJsonResponse, ensureArray } from '../parsers/jsonParser';

const GENERATION_TIMEOUT = 30000; // 30 seconds timeout

export const generateICPs = async (business: any, existingICPs: any[] = []): Promise<any[]> => {
  try {
    // Extract existing titles to avoid duplicates
    const existingTitles = existingICPs.map(icp => icp.title.toLowerCase());
    
    const messages = [
      {
        role: 'system',
        content: `You are an expert marketing strategist helping a business identify their ideal customer profiles (ICPs).
        Based on the business information provided, generate 2-3 detailed ICPs that would be ideal targets for their products/services.
        For each ICP provide:
        - title (concise name for this customer segment)
        - description (2-3 sentences about this customer type)
        - demographics (as a JSON object with companySize, industries, regions, jobTitles, and technologyAdoption)
        - blueOceanScore (a number from 1-10, where 1 is a "red ocean" with high competition and 10 is a "blue ocean" with little competition)
        - reachMethods (3-5 specific channels or methods to effectively reach this ICP)
        - productSuggestions (3-5 specific ways to tailor or tweak products to better meet this ICP's needs)
        - painPoints (3-5 specific problems this ICP faces that the business could solve)
        - goals (3-5 key objectives this ICP is trying to achieve)
        Ensure these are diverse, focused profiles that don't overlap too much with each other.
        Make sure none of the ICPs duplicate existing ones.
        ALWAYS provide complete demographic information, even if it needs to be generalized.
        IMPORTANT: Return a valid JSON array only, with no additional text or markdown formatting.
        Use exactly these field names in your response, all in lowercase.`
      },
      {
        role: 'user',
        content: `Business Name: ${business.name}
        Industry: ${business.industry}
        Description: ${business.description}
        Main Problem: ${business.mainProblem || 'Not specified'}`
      }
    ];

    // Create an AbortController for the timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GENERATION_TIMEOUT);

    try {
      const responseData = await callOpenAI(messages, { 
        maxTokens: 1500,
        signal: controller.signal 
      });
      
      // Clear the timeout since we got a response
      clearTimeout(timeoutId);
      
      console.log('ICP generation response:', responseData);

      const contentString = responseData.choices[0].message.content;
      console.log('Raw ICP content:', contentString);
      
      const parsedContent = parseJsonResponse(contentString);
      let icps = ensureArray(parsedContent);
      
      // Validate that we have data
      if (!icps || icps.length === 0) {
        throw new Error('No valid ICPs found in response');
      }
      
      console.log('Parsed ICPs:', icps);
      
      // Filter out any ICPs that duplicate existing ones
      icps = icps.filter(icp => !existingTitles.includes((icp.title || '').toLowerCase()));
      
      // Format the ICPs into our standard structure
      return icps.map((icp: any, index: number) => ({
        id: `gen-icp-${Date.now()}-${index}`,
        title: icp.title,
        description: icp.description,
        demographics: typeof icp.demographics === 'string' ? 
          icp.demographics : 
          JSON.stringify(icp.demographics || {}),
        blueOceanScore: icp.blueOceanScore || 5,
        reachMethods: Array.isArray(icp.reachMethods) ? 
          icp.reachMethods : 
          [icp.reachMethods || ""],
        productSuggestions: Array.isArray(icp.productSuggestions) ? 
          icp.productSuggestions : 
          [icp.productSuggestions || ""],
        painPoints: Array.isArray(icp.painPoints) ? 
          icp.painPoints : 
          [icp.painPoints || ""],
        goals: Array.isArray(icp.goals) ? 
          icp.goals : 
          [icp.goals || ""],
        isCustomAdded: false
      }));
    } catch (error) {
      // Make sure to clear the timeout to avoid memory leaks
      clearTimeout(timeoutId);
      
      // Check if this was a timeout abortion
      if (error.name === 'AbortError') {
        throw new Error('ICP generation request timed out. Please try again.');
      }
      
      throw error;
    }
  } catch (error) {
    console.error('ICP generation error:', error);
    throw error;
  }
};
