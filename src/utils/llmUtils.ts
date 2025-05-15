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

/**
 * Generate Ideal Customer Profiles (ICPs) based on business information
 * @param business Business information object
 * @param count Optional number of ICPs to generate (default: 3)
 * @param existingICPs Optional array of existing ICPs to avoid duplicates
 * @returns Promise with array of generated ICPs
 */
export const generateICPs = async (
  business: any,
  count: number = 3,
  existingICPs: any[] = []
): Promise<any[]> => {
  try {
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
      throw new Error('API key not found');
    }

    // Extract existing ICP titles to avoid duplicates
    const existingTitles = existingICPs.map(icp => icp.title.toLowerCase());

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
            content: `You are an expert marketer tasked with identifying ideal customer profiles (ICPs) for a business.
            Based on the provided business information, create ${count} distinct and detailed ICPs.
            For each ICP, provide:
            - Title (a descriptive name for this customer segment)
            - Description (brief overview of this customer type)
            - Demographics (age, gender, location, job titles, income level, company size, etc., as relevant)
            - Pain Points (list of 3-5 specific problems or challenges this ICP faces that the business can solve)
            - Goals (list of 3-5 specific objectives or desires this ICP has that the business can help achieve)
            If existing ICPs are provided, ensure your new profiles are distinct from them.
            Respond in JSON format only with an array of ICP objects.`
          },
          {
            role: 'user',
            content: `Business Name: ${business.name || 'N/A'}
            Industry: ${business.industry || 'N/A'}
            Description: ${business.description || 'N/A'}
            Problem: ${business.problem || 'N/A'}${existingTitles.length > 0 ? `\n\nExisting ICP Titles (do not duplicate): ${existingTitles.join(', ')}` : ''}`
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
    console.log('ICP generation response:', responseData);

    const contentString = responseData.choices[0].message.content;
    const parsedContent = JSON.parse(contentString);
    
    // Ensure proper array format
    let icps = Array.isArray(parsedContent) ? parsedContent : [parsedContent];
    
    // Filter out ICPs with titles that already exist in existingICPs
    if (existingTitles.length > 0) {
      icps = icps.filter(icp => 
        !existingTitles.includes((icp.title || '').toLowerCase())
      );
    }

    // Format and return the ICPs with IDs
    return icps.map((icp: any, index: number) => ({
      id: `gen-icp-${Date.now()}-${index}`,
      title: icp.title,
      description: icp.description,
      demographics: icp.demographics,
      painPoints: Array.isArray(icp.painPoints) ? icp.painPoints : [icp.painPoints],
      goals: Array.isArray(icp.goals) ? icp.goals : [icp.goals],
      isCustomAdded: false
    }));
  } catch (error) {
    console.error('ICP generation error:', error);
    throw error;
  }
};

/**
 * Generate Unique Selling Points (USPs) based on business information and ICPs
 * @param business Business information object
 * @param icps Array of Ideal Customer Profiles
 * @param existingUSPs Optional array of existing USPs to avoid duplicates
 * @returns Promise with array of generated USPs
 */
export const generateUSPs = async (
  business: any,
  icps: any[],
  existingUSPs: any[] = []
): Promise<any[]> => {
  try {
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
      throw new Error('API key not found');
    }

    // Extract existing USP titles to avoid duplicates
    const existingTitles = existingUSPs.map(usp => usp.title.toLowerCase());
    
    // Create prompts from data
    const businessPrompt = `Business Name: ${business.name || 'N/A'}\nIndustry: ${business.industry || 'N/A'}\nDescription: ${business.description || 'N/A'}\nProblem: ${business.problem || 'N/A'}`;
    
    const icpPrompt = icps.map(icp => 
      `ICP: ${icp.title}\nDescription: ${icp.description}\nPain Points: ${icp.painPoints.join(', ')}\nGoals: ${icp.goals.join(', ')}`
    ).join('\n\n');

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
            content: `You are an expert marketer tasked with identifying unique selling points (USPs) for a business.
            Based on the provided business information and ICPs, create 3-4 distinct and compelling USPs.
            For each USP, provide:
            - Title (a short, compelling phrase)
            - Description (brief explanation of this USP)
            - Target ICP (which ICP this USP most appeals to)
            - Value Proposition (how this USP specifically addresses the pain points or goals of the target ICP)
            If existing USPs are provided, ensure your new USPs are distinct from them.
            Respond in JSON format only with an array of USP objects.`
          },
          {
            role: 'user',
            content: `${businessPrompt}\n\n${icpPrompt}${existingTitles.length > 0 ? `\n\nExisting USP Titles (do not duplicate): ${existingTitles.join(', ')}` : ''}`
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
    console.log('USP generation response:', responseData);

    const contentString = responseData.choices[0].message.content;
    const parsedContent = JSON.parse(contentString);
    
    // Ensure proper array format
    let usps = Array.isArray(parsedContent) ? parsedContent : [parsedContent];
    
    // Filter out USPs with titles that already exist
    if (existingTitles.length > 0) {
      usps = usps.filter(usp => 
        !existingTitles.includes((usp.title || '').toLowerCase())
      );
    }

    // Format and return the USPs with IDs
    return usps.map((usp: any, index: number) => ({
      id: `gen-usp-${Date.now()}-${index}`,
      title: usp.title,
      description: usp.description,
      targetICP: usp.targetICP || usp.target_icp || usp.target,
      valueProposition: usp.valueProposition || usp.value_proposition,
      isCustomAdded: false
    }));
  } catch (error) {
    console.error('USP generation error:', error);
    throw error;
  }
};

/**
 * Generate keywords based on business information, ICPs, USPs, and optionally geographies
 * @param business Business information object
 * @param icps Array of Ideal Customer Profiles
 * @param usps Array of Unique Selling Points
 * @param existingKeywords Optional array of existing keywords to avoid duplicates
 * @param geographies Optional array of target geographies
 * @returns Promise with array of generated keywords
 */
export const generateKeywords = async (
  business: any,
  icps: any[],
  usps: any[] = [],
  existingKeywords: any[] = [],
  geographies: any[] = []
): Promise<any[]> => {
  try {
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
      throw new Error('API key not found');
    }

    // Extract existing keyword terms to avoid duplicates
    const existingTerms = existingKeywords.map(keyword => keyword.term.toLowerCase());
    
    // Create prompts from data
    const businessPrompt = `Business Name: ${business.name || 'N/A'}\nIndustry: ${business.industry || 'N/A'}\nDescription: ${business.description || 'N/A'}\nProblem: ${business.problem || 'N/A'}`;
    
    const icpPrompt = icps.map(icp => 
      `ICP: ${icp.title}\nDescription: ${icp.description}\nPain Points: ${icp.painPoints.join(', ')}\nGoals: ${icp.goals.join(', ')}`
    ).join('\n\n');
    
    const uspPrompt = usps.length > 0 
      ? `USPs: ${usps.map(usp => `${usp.title} - ${usp.description}`).join('\n')}`
      : '';
    
    const geoPrompt = geographies.length > 0
      ? `Target Geographies: ${geographies.map(geo => geo.region).join(', ')}`
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
            content: `You are an expert SEO strategist tasked with identifying valuable keywords for a business.
            Based on the provided business information, ICPs, USPs, and geographies, create 8-10 high-value keywords.
            For each keyword, provide:
            - Term (the actual keyword or phrase)
            - Search Volume (estimated monthly searches, e.g., "5,400/mo" or "Low/Medium/High")
            - Difficulty (competition level: Low, Medium-Low, Medium, Medium-High, or High)
            - Relevance (how relevant this keyword is to the business: Low, Medium, or High)
            - Related ICP (which ICP would most likely use this search term)
            If existing keywords are provided, ensure your new keywords are distinct from them.
            Respond in JSON format only with an array of keyword objects.`
          },
          {
            role: 'user',
            content: `${businessPrompt}\n\n${icpPrompt}\n\n${uspPrompt}\n\n${geoPrompt}${existingTerms.length > 0 ? `\n\nExisting Keyword Terms (do not duplicate): ${existingTerms.join(', ')}` : ''}`
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
    console.log('Keyword generation response:', responseData);

    const contentString = responseData.choices[0].message.content;
    const parsedContent = JSON.parse(contentString);
    
    // Ensure proper array format
    let keywords = Array.isArray(parsedContent) ? parsedContent : [parsedContent];
    
    // Filter out keywords that already exist
    if (existingTerms.length > 0) {
      keywords = keywords.filter(keyword => 
        !existingTerms.includes((keyword.term || '').toLowerCase())
      );
    }

    // Format and return the keywords with IDs
    return keywords.map((keyword: any, index: number) => ({
      id: `gen-keyword-${Date.now()}-${index}`,
      term: keyword.term,
      searchVolume: keyword.searchVolume || keyword.search_volume || keyword.volume,
      difficulty: keyword.difficulty,
      relevance: keyword.relevance,
      relatedICP: keyword.relatedICP || keyword.related_icp || keyword.icp,
      isCustomAdded: false
    }));
  } catch (error) {
    console.error('Keyword generation error:', error);
    throw error;
  }
};
