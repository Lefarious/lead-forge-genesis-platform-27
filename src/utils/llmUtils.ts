export const generateGeographies = async (business: any, existingGeographies: any[] = []): Promise<any[]> => {
  try {
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
      throw new Error('API key not found');
    }

    const existingRegions = existingGeographies.map(geo => geo.region.toLowerCase());

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert marketing strategist helping a business identify the best target countries for expansion.
            Given the following business information, analyze and recommend 2-3 countries to target.
            For each country, provide:
            - Region (country name)
            - Market Size (in USD)
            - Growth Rate (% annually)
            - Competition Level (High, Medium, Low)
            - A brief explanation of why this country is a good target (Why Target)
            - A strategic recommendation for this market (Recommendation)
            Ensure the countries are diverse and not already in the existing list.
            Respond in JSON format only.`
          },
          {
            role: 'user',
            content: `Business Name: ${business.name}\nIndustry: ${business.industry}\nDescription: ${business.description}\nTarget Market: ${business.targetMarket}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('Geography generation response:', responseData);

    const contentString = responseData.choices[0].message.content;
    const parsedContent = JSON.parse(contentString);

    let geographies = Array.isArray(parsedContent) ? parsedContent : [parsedContent];

    // Filter out existing regions
    geographies = geographies.filter(geo => !existingRegions.includes(geo.region.toLowerCase()));

    return geographies.map((geo: any, index: number) => ({
      id: `gen-geo-${Date.now()}-${index}`,
      region: geo.Region || geo.region,
      marketSize: geo['Market Size'] || geo.marketSize,
      growthRate: geo['Growth Rate'] || geo.growthRate,
      competitionLevel: geo.Competition || geo.competitionLevel,
      whyTarget: geo['Why Target'] || geo.whyTarget,
      recommendation: geo.Recommendation || geo.recommendation,
      isCustomAdded: false
    }));
  } catch (error) {
    console.error('Geography generation error:', error);
    throw error;
  }
};

export const generateContentIdeas = async (
  business: any,
  icps: any[],
  keywords: any[],
  usps: any[] = [],
  geographies: any[] = [],
  existingIdeas: any[] = []
): Promise<any[]> => {
  try {
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
      throw new Error('API key not found');
    }

    const existingTitles = existingIdeas.map(idea => idea.title.toLowerCase());
    
    // Create prompts from data
    const businessPrompt = `Business Name: ${business.name}\nIndustry: ${business.industry}\nDescription: ${business.description}\nTarget Market: ${business.targetMarket}`;
    
    const icpPrompt = icps.map(icp => 
      `ICP: ${icp.title}\nDescription: ${icp.description}\nPain Points: ${icp.painPoints}\nGoals: ${icp.goals}`
    ).join('\n\n');
    
    const keywordPrompt = `Keywords: ${keywords.map(k => k.keyword).join(', ')}`;
    
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

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert content strategist helping a business create valuable marketing content. 
            Generate 2-3 unique, high-value content ideas based on the provided business information, ICPs, USPs, target geographies, and keywords. 
            Each content idea should include: title, content type (Blog Post, White Paper, eBook, Webinar, Case Study, Infographic, Video), 
            target ICP, target keywords (2-3 from provided list), a detailed outline (5-7 points), and estimated value (Low, Medium, High).
            Make sure titles are catchy, specific, and include keywords. Content should address pain points and goals.
            DO NOT DUPLICATE any existing content titles.
            Respond in JSON format only.`
          },
          {
            role: 'user',
            content: `${businessPrompt}\n\n${icpPrompt}\n\n${keywordPrompt}\n\n${uspPrompt}\n\n${geoPrompt}\n\n${existingContentPrompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('Content generation response:', responseData);

    const contentString = responseData.choices[0].message.content;
    const parsedContent = JSON.parse(contentString);
    
    // Ensure proper array format and add IDs
    let contentIdeas = Array.isArray(parsedContent) ? parsedContent : [parsedContent];
    
    return contentIdeas.map((idea: any, index: number) => ({
      id: `gen-content-${Date.now()}-${index}`,
      title: idea.title,
      type: idea.type || idea.contentType,
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
