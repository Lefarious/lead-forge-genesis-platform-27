
import { callOpenAI } from '../api/openaiApi';
import { parseJsonResponse, ensureArray } from '../parsers/jsonParser';

export const generateContentIdeas = async (
  business: any,
  icps: any[],
  keywords: any[],
  usps: any[] = [],
  geographies: any[] = [],
  existingIdeas: any[] = []
): Promise<any[]> => {
  try {
    const existingTitles = existingIdeas.map(idea => (idea.title || '').toLowerCase());
    
    // Create prompts from data
    const businessPrompt = `Business Name: ${business.name || 'Not specified'}\nIndustry: ${business.industry || 'Not specified'}\nDescription: ${business.description || 'Not specified'}\nTarget Market: ${business.targetMarket || 'Not specified'}`;
    
    const icpPrompt = icps.map(icp => 
      `ICP: ${icp.title || 'Untitled'}\nDescription: ${icp.description || 'No description'}\nPain Points: ${Array.isArray(icp.painPoints) ? icp.painPoints.join(', ') : (icp.painPoints || 'Not specified')}\nGoals: ${Array.isArray(icp.goals) ? icp.goals.join(', ') : (icp.goals || 'Not specified')}`
    ).join('\n\n');
    
    const keywordPrompt = `Keywords: ${keywords.map(k => k.term || 'Unknown').join(', ')}`;
    
    // Include USPs in prompt
    const uspPrompt = usps.length > 0 
      ? `USPs: ${usps.map(usp => `${usp.title || 'Untitled'} - ${usp.description || 'No description'}`).join('\n')}`
      : '';
    
    // Include Geographies in prompt
    const geoPrompt = geographies.length > 0
      ? `Target Geographies: ${geographies.map(geo => `${geo.region || 'Unknown region'} (${geo.marketSize || 'Unknown size'}, ${geo.growthRate || 'Unknown'} growth)`).join('\n')}`
      : '';
    
    // Include existing content titles to avoid duplication
    const existingContentPrompt = existingTitles.length > 0
      ? `Existing Content (DO NOT DUPLICATE): ${existingTitles.join(', ')}`
      : '';

    const messages = [
      {
        role: 'system',
        content: `You are an expert content strategist helping a business create valuable marketing content. 
        Generate 2-3 unique, high-value content ideas based on the provided business information, ICPs, USPs, target geographies, and keywords. 
        Each content idea should include: 
        - title (catchy title for the content)
        - type (Blog Post, White Paper, eBook, Webinar, Case Study, Infographic, Video)
        - targetICP (which ICP from the provided list this content primarily targets)
        - targetKeywords (2-3 from provided list)
        - outline (5-7 points as an array)
        - estimatedValue (Low, Medium, High)
        Make sure titles are catchy, specific, and include keywords. Content should address pain points and goals.
        DO NOT DUPLICATE any existing content titles.
        Respond in JSON format only using exactly these field names, all in lowercase.`
      },
      {
        role: 'user',
        content: `${businessPrompt}\n\n${icpPrompt}\n\n${keywordPrompt}\n\n${uspPrompt}\n\n${geoPrompt}\n\n${existingContentPrompt}`
      }
    ];

    const responseData = await callOpenAI(messages, { maxTokens: 2000 });
    console.log('Content generation response:', responseData);

    const contentString = responseData.choices[0].message.content;
    const parsedContent = parseJsonResponse(contentString);
    
    // Ensure proper array format and add IDs
    let contentIdeas = ensureArray(parsedContent);
    
    // Validate that we have data
    if (!contentIdeas || contentIdeas.length === 0) {
      throw new Error('No valid content ideas found in response');
    }
    
    return contentIdeas.map((idea: any, index: number) => {
      // Ensure each idea has all required fields with defaults for missing values
      return {
        id: `gen-content-${Date.now()}-${index}`,
        title: idea.title || 'Untitled Content',
        type: idea.type || 'Blog Post',
        targetICP: idea.targetICP || (icps.length > 0 ? icps[0].title : 'General Audience'),
        targetKeywords: Array.isArray(idea.targetKeywords) ? idea.targetKeywords : [idea.targetKeywords || 'general'],
        outline: Array.isArray(idea.outline) ? idea.outline : [idea.outline || 'Introduction'],
        estimatedValue: idea.estimatedValue || 'Medium',
        published: false,
        isCustomAdded: false
      };
    });
  } catch (error) {
    console.error('Content generation error:', error);
    throw error;
  }
};
