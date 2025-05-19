
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
    const existingTitles = existingIdeas.map(idea => idea.title.toLowerCase());
    
    // Create prompts from data
    const businessPrompt = `Business Name: ${business.name}\nIndustry: ${business.industry}\nDescription: ${business.description}\nTarget Market: ${business.targetMarket}`;
    
    const icpPrompt = icps.map(icp => 
      `ICP: ${icp.title}\nDescription: ${icp.description}\nPain Points: ${icp.painPoints}\nGoals: ${icp.goals}`
    ).join('\n\n');
    
    const keywordPrompt = `Keywords: ${keywords.map(k => k.term).join(', ')}`;
    
    // Include USPs in prompt
    const uspPrompt = usps.length > 0 
      ? `USPs: ${usps.map(usp => `${usp.title} - ${usp.description}`).join('\n')}`
      : '';
    
    // Include Geographies in prompt
    const geoPrompt = geographies.length > 0
      ? `Target Geographies: ${geographies.map(geo => `${geo.region} (${geo.marketSize}, ${geo.growthRate} growth)`).join('\n')}`
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
    
    return contentIdeas.map((idea: any, index: number) => ({
      id: `gen-content-${Date.now()}-${index}`,
      title: idea.title,
      type: idea.type,
      targetICP: idea.targetICP,
      targetKeywords: idea.targetKeywords,
      outline: idea.outline,
      estimatedValue: idea.estimatedValue,
      published: false
    }));
  } catch (error) {
    console.error('Content generation error:', error);
    throw error;
  }
};
