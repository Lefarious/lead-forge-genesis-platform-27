
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

export const generateICPs = async (business: any, existingICPs: any[] = []): Promise<any[]> => {
  try {
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
      throw new Error('API key not found');
    }
    
    // Extract existing titles to avoid duplicates
    const existingTitles = existingICPs.map(icp => icp.title.toLowerCase());
    
    // Include products in the prompt
    const productsPrompt = business.products && business.products.length > 0 
      ? `Products/Services: ${business.products.join(', ')}` 
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
            content: `You are an expert marketing strategist helping a business identify their ideal customer profiles (ICPs).
            Based on the business information provided, generate 2-3 detailed ICPs that would be ideal targets for their products/services.
            For each ICP provide:
            - Title (concise name for this customer segment)
            - Description (2-3 sentences about this customer type)
            - Demographics (as a JSON object with companySize, industries, regions, jobTitles, and technologyAdoption)
            - Pain Points (3-5 specific problems this ICP faces that the business could solve)
            - Goals (3-5 key objectives this ICP is trying to achieve)
            Ensure these are diverse, focused profiles that don't overlap too much with each other.
            Make sure none of the ICPs duplicate existing ones.
            Respond in JSON format only.`
          },
          {
            role: 'user',
            content: `Business Name: ${business.name}
            Industry: ${business.industry}
            Description: ${business.description}
            Main Problem: ${business.mainProblem || 'Not specified'}
            ${productsPrompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('ICP generation response:', responseData);

    const contentString = responseData.choices[0].message.content;
    const parsedContent = JSON.parse(contentString);
    
    // Ensure we have an array of ICPs
    let icps = Array.isArray(parsedContent) ? parsedContent : [parsedContent];
    
    // Filter out any ICPs that duplicate existing ones
    icps = icps.filter(icp => !existingTitles.includes(icp.title.toLowerCase()));
    
    return icps.map((icp: any, index: number) => ({
      id: `gen-icp-${Date.now()}-${index}`,
      title: icp.title,
      description: icp.description,
      demographics: JSON.stringify(icp.demographics),
      painPoints: Array.isArray(icp.painPoints) ? icp.painPoints : [icp.painPoints],
      goals: Array.isArray(icp.goals) ? icp.goals : [icp.goals],
      isCustomAdded: false
    }));
  } catch (error) {
    console.error('ICP generation error:', error);
    throw error;
  }
};

export const generateUSPs = async (business: any, icps: any[], existingUSPs: any[] = []): Promise<any[]> => {
  try {
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
      throw new Error('API key not found');
    }
    
    // Extract existing titles to avoid duplicates
    const existingTitles = existingUSPs.map(usp => usp.title.toLowerCase());
    
    // Include ICPs in the prompt
    const icpPrompt = icps.length > 0 
      ? `ICPs: ${icps.map(icp => `${icp.title} - ${icp.description}`).join('\n')}` 
      : 'No ICPs provided.';
    
    // Include products in the prompt
    const productsPrompt = business.products && business.products.length > 0 
      ? `Products/Services: ${business.products.join(', ')}` 
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
            content: `You are an expert marketing strategist helping a business identify their unique selling propositions (USPs).
            Based on the business information and ICPs provided, generate 2-3 strong USPs that would appeal to their ideal customers.
            For each USP provide:
            - Title (concise name for this USP)
            - Description (2-3 sentences explaining this USP)
            - Target ICP (which ICP from the provided list this USP primarily targets)
            - Value Proposition (clear statement of the value delivered)
            Ensure these are compelling differentiators that are meaningful to the target audience.
            Make sure none of the USPs duplicate existing ones.
            Respond in JSON format only.`
          },
          {
            role: 'user',
            content: `Business Name: ${business.name}
            Industry: ${business.industry}
            Description: ${business.description}
            Main Problem: ${business.mainProblem || 'Not specified'}
            ${productsPrompt}
            
            ${icpPrompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1200
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('USP generation response:', responseData);

    const contentString = responseData.choices[0].message.content;
    const parsedContent = JSON.parse(contentString);
    
    // Ensure we have an array of USPs
    let usps = Array.isArray(parsedContent) ? parsedContent : [parsedContent];
    
    // Filter out any USPs that duplicate existing ones
    usps = usps.filter(usp => !existingTitles.includes(usp.title.toLowerCase()));
    
    return usps.map((usp: any, index: number) => ({
      id: `gen-usp-${Date.now()}-${index}`,
      title: usp.title,
      description: usp.description,
      targetICP: usp.targetICP,
      valueProposition: usp.valueProposition,
      isCustomAdded: false
    }));
  } catch (error) {
    console.error('USP generation error:', error);
    throw error;
  }
};

export const generateKeywords = async (
  business: any, 
  icps: any[] = [], 
  usps: any[] = [], 
  geographies: any[] = [],
  existingKeywords: any[] = []
): Promise<any[]> => {
  try {
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
      throw new Error('API key not found');
    }

    // Extract existing terms to avoid duplicates
    const existingTerms = existingKeywords.map(kw => kw.term.toLowerCase());
    
    // Include ICPs in the prompt
    const icpPrompt = icps.length > 0 
      ? `ICPs: ${icps.map(icp => `${icp.title} - ${icp.description}`).join('\n')}` 
      : 'No ICPs provided.';
    
    // Include USPs in the prompt
    const uspPrompt = usps.length > 0 
      ? `USPs: ${usps.map(usp => `${usp.title} - ${usp.description}`).join('\n')}` 
      : 'No USPs provided.';
    
    // Include Geographies in the prompt
    const geoPrompt = geographies.length > 0
      ? `Target Geographies: ${geographies.map(geo => geo.region).join(', ')}` 
      : 'No target geographies provided.';
    
    // Include products in the prompt
    const productsPrompt = business.products && business.products.length > 0 
      ? `Products/Services: ${business.products.join(', ')}` 
      : '';
    
    // Include existing keywords to avoid duplication
    const existingKeywordPrompt = existingTerms.length > 0
      ? `Existing Keywords (DO NOT DUPLICATE): ${existingTerms.join(', ')}` 
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
            content: `You are an expert SEO strategist helping a business identify valuable keywords.
            Based on the business information, ICPs, USPs, and target geographies provided, generate 5-7 highly relevant keywords.
            For each keyword provide:
            - Term (the actual search term or phrase)
            - Search Volume (estimated monthly searches, e.g., "1,000-5,000")
            - Difficulty (Low, Medium, High)
            - Relevance (Low, Medium, High)
            - Related ICP (which ICP from the provided list this keyword primarily targets)
            Ensure keywords are varied, specific, and have commercial intent where appropriate.
            DO NOT INCLUDE ANY KEYWORDS THAT ARE ALREADY IN THE EXISTING LIST.
            Respond in JSON format only.`
          },
          {
            role: 'user',
            content: `Business Name: ${business.name}
            Industry: ${business.industry}
            Description: ${business.description}
            Main Problem: ${business.mainProblem || 'Not specified'}
            ${productsPrompt}
            
            ${icpPrompt}
            
            ${uspPrompt}
            
            ${geoPrompt}
            
            ${existingKeywordPrompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1200
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('Keywords generation response:', responseData);

    const contentString = responseData.choices[0].message.content;
    const parsedContent = JSON.parse(contentString);
    
    // Ensure we have an array of keywords
    let keywords = Array.isArray(parsedContent) ? parsedContent : [parsedContent];
    
    // Filter out any keywords that duplicate existing ones
    keywords = keywords.filter(kw => 
      !existingTerms.includes((kw.term || kw.Term || '').toLowerCase())
    );
    
    return keywords.map((keyword: any, index: number) => ({
      id: `gen-kw-${Date.now()}-${index}`,
      term: keyword.term || keyword.Term,
      searchVolume: keyword.searchVolume || keyword['Search Volume'],
      difficulty: keyword.difficulty || keyword.Difficulty,
      relevance: keyword.relevance || keyword.Relevance,
      relatedICP: keyword.relatedICP || keyword['Related ICP'],
      isCustomAdded: false
    }));
  } catch (error) {
    console.error('Keywords generation error:', error);
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
    
    const keywordPrompt = `Keywords: ${keywords.map(k => k.term).join(', ')}`;
    
    // Include USPs in prompt
    const uspPrompt = usps.length > 0 
      ? `USPs: ${usps.map(usp => `${usp.title} - ${usp.description}`).join('\n')}`
      : '';
    
    // Include Geographies in prompt
    const geoPrompt = geographies.length > 0
      ? `Target Geographies: ${geographies.map(geo => `${geo.region} (${geo.marketSize}, ${geo.growthRate} growth)`).join('\n')}`
      : '';
    
    // Include products in the prompt
    const productsPrompt = business.products && business.products.length > 0 
      ? `Products/Services: ${business.products.join(', ')}` 
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
            content: `${businessPrompt}\n\n${icpPrompt}\n\n${keywordPrompt}\n\n${uspPrompt}\n\n${geoPrompt}\n\n${productsPrompt}\n\n${existingContentPrompt}`
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
