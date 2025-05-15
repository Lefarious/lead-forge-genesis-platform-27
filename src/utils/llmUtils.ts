
// LLM API utilities for generating marketing content

// Core OpenAI API function
export const callOpenAI = async (messages: any[], options: {
  model?: string;
  temperature?: number;
  maxTokens?: number;
} = {}): Promise<any> => {
  const apiKey = localStorage.getItem('openai_api_key');
  if (!apiKey) {
    throw new Error('API key not found');
  }

  const {
    model = 'gpt-4o-mini',
    temperature = 0.7,
    maxTokens = 1200
  } = options;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
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
        - Region (country name)
        - Market Size (in USD)
        - Growth Rate (% annually)
        - Competition Level (High, Medium, Low)
        - A brief explanation of why this country is a good target (Why Target)
        - A strategic recommendation for this market (Recommendation)
        - Pricing Power (Strong, Moderate, Weak) - how much pricing leverage the business would have in this market
        - Profitability Rating (High, Medium, Low) - expected profitability in this market
        - Brand Personality (brief description) - what brand traits would resonate best in this market
        Ensure the countries are diverse and not already in the existing list.
        Respond in JSON format only.`
      },
      {
        role: 'user',
        content: `Business Name: ${business.name}\nIndustry: ${business.industry}\nDescription: ${business.description}\nTarget Market: ${business.targetMarket}`
      }
    ];

    const responseData = await callOpenAI(messages);
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
      pricingPower: geo['Pricing Power'] || geo.pricingPower,
      profitabilityRating: geo['Profitability Rating'] || geo.profitabilityRating,
      brandPersonality: geo['Brand Personality'] || geo.brandPersonality,
      isCustomAdded: false
    }));
  } catch (error) {
    console.error('Geography generation error:', error);
    throw error;
  }
};

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
        - Title (concise name for this customer segment)
        - Description (2-3 sentences about this customer type)
        - Demographics (as a JSON object with companySize, industries, regions, jobTitles, and technologyAdoption)
        - BlueOceanScore (a number from 1-10, where 1 is a "red ocean" with high competition and 10 is a "blue ocean" with little competition)
        - ReachMethods (3-5 specific channels or methods to effectively reach this ICP)
        - ProductSuggestions (3-5 specific ways to tailor or tweak products to better meet this ICP's needs)
        - Pain Points (3-5 specific problems this ICP faces that the business could solve)
        - Goals (3-5 key objectives this ICP is trying to achieve)
        Ensure these are diverse, focused profiles that don't overlap too much with each other.
        Make sure none of the ICPs duplicate existing ones.
        ALWAYS provide complete demographic information, even if it needs to be generalized.
        IMPORTANT: Return a valid JSON array only, with no additional text or markdown formatting.`
      },
      {
        role: 'user',
        content: `Business Name: ${business.name}
        Industry: ${business.industry}
        Description: ${business.description}
        Main Problem: ${business.mainProblem || 'Not specified'}`
      }
    ];

    const responseData = await callOpenAI(messages, { maxTokens: 1500 });
    console.log('ICP generation response:', responseData);

    const contentString = responseData.choices[0].message.content;
    console.log('Raw ICP content:', contentString);
    
    // Remove any markdown formatting or extra characters that might be in the response
    const cleanedContentString = contentString
      .replace(/```json|```/g, '') // Remove markdown code blocks
      .replace(/^\s*\[|\]\s*$/g, '[,]') // Ensure we have opening and closing brackets
      .trim();
    
    console.log('Cleaned content:', cleanedContentString);
    
    // Attempt to parse the cleaned JSON
    let parsedContent;
    try {
      // Handle both array and object formats
      if (cleanedContentString.trim().startsWith('[')) {
        parsedContent = JSON.parse(cleanedContentString);
      } else {
        // Try to parse as a single object
        parsedContent = JSON.parse(`[${cleanedContentString}]`);
      }
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      
      // More aggressive cleaning if parsing fails
      try {
        // Try to extract just the JSON part using regex
        const jsonMatch = contentString.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Could not find valid JSON in the response');
        }
      } catch (secondParseError) {
        console.error('Second parse attempt failed:', secondParseError);
        console.log('Raw content for debugging:', contentString);
        
        // As a last resort, create a basic ICP from the business information
        return [{
          id: `gen-icp-${Date.now()}-0`,
          title: `${business.industry} Customer`,
          description: `A typical customer in the ${business.industry} industry that could benefit from ${business.name}'s services.`,
          demographics: JSON.stringify({
            companySize: "Various sizes",
            industries: [business.industry || "Multiple industries"],
            regions: ["Global"],
            jobTitles: ["Decision makers"],
            technologyAdoption: "Mixed"
          }),
          blueOceanScore: 5,
          reachMethods: ["Industry events", "LinkedIn marketing", "Email campaigns"],
          productSuggestions: ["Customized solutions", "Mobile integration", "Analytics dashboard"],
          painPoints: ["Lack of expertise", "Inefficient processes", "Difficulty tracking results"],
          goals: ["Improve efficiency", "Increase revenue", "Better customer experience"],
          isCustomAdded: false
        }];
      }
    }
    
    // Handle different response formats
    let icps = [];
    if (Array.isArray(parsedContent)) {
      icps = parsedContent;
    } else if (parsedContent && typeof parsedContent === 'object') {
      if (parsedContent.idealCustomerProfiles) {
        icps = parsedContent.idealCustomerProfiles;
      } else if (parsedContent.icps) {
        icps = parsedContent.icps;
      } else {
        // If we can't find an array of ICPs, use the whole object as a single ICP
        icps = [parsedContent];
      }
    }
    
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
      title: icp.title || icp.Title || `Customer Profile ${index + 1}`,
      description: icp.description || icp.Description || `Customer profile for ${business.name}`,
      demographics: typeof icp.demographics === 'string' ? 
        icp.demographics : 
        JSON.stringify(icp.demographics || icp.Demographics || {
          companySize: "Various",
          industries: [business.industry || "Multiple"],
          regions: ["Global"],
          jobTitles: ["Various roles"],
          technologyAdoption: "Mixed"
        }),
      blueOceanScore: icp.blueOceanScore || icp.BlueOceanScore || 5,
      reachMethods: Array.isArray(icp.reachMethods || icp.ReachMethods) ? 
        (icp.reachMethods || icp.ReachMethods) : 
        [(icp.reachMethods || icp.ReachMethods || "Digital marketing")],
      productSuggestions: Array.isArray(icp.productSuggestions || icp.ProductSuggestions) ? 
        (icp.productSuggestions || icp.ProductSuggestions) : 
        [(icp.productSuggestions || icp.ProductSuggestions || "Customized solution")],
      painPoints: Array.isArray(icp.painPoints || icp.PainPoints) ? 
        (icp.painPoints || icp.PainPoints) : 
        [(icp.painPoints || icp.PainPoints || "Industry challenges")],
      goals: Array.isArray(icp.goals || icp.Goals) ? 
        (icp.goals || icp.Goals) : 
        [(icp.goals || icp.Goals || "Business improvement")],
      isCustomAdded: false
    }));
  } catch (error) {
    console.error('ICP generation error:', error);
    throw error;
  }
};

export const generateUSPs = async (business: any, icps: any[], existingUSPs: any[] = []): Promise<any[]> => {
  try {
    // Extract existing titles to avoid duplicates
    const existingTitles = existingUSPs.map(usp => usp.title.toLowerCase());
    
    // Include ICPs in the prompt
    const icpPrompt = icps.length > 0 
      ? `ICPs: ${icps.map(icp => `${icp.title} - ${icp.description}`).join('\n')}` 
      : 'No ICPs provided.';
    
    const messages = [
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
        
        ${icpPrompt}`
      }
    ];

    const responseData = await callOpenAI(messages);
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
        - Term (the actual search term or phrase)
        - Search Volume (estimated monthly searches, e.g., "1,000-5,000")
        - Difficulty (Low, Medium-Low, Medium, Medium-High, High)
        - Relevance (Low, Medium, High)
        - Related ICP (which ICP from the provided list this keyword primarily targets)
        - Competitor Usage (Low, Medium, High - how frequently competitors are using this keyword)
        
        Ensure keywords are varied, specific, and have commercial intent where appropriate.
        Include some long-tail keywords with lower competition.
        Generate keywords that cover all geographic regions and ICPs, but prioritize those with higher profitability.
        DO NOT INCLUDE ANY KEYWORDS THAT ARE ALREADY IN THE EXISTING LIST.
        Respond in JSON format only.`
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
      competitorUsage: keyword.competitorUsage || keyword['Competitor Usage'],
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
    ];

    const responseData = await callOpenAI(messages, { maxTokens: 2000 });
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

export const validateCustomICP = async (icp: any, business: any): Promise<{isValid: boolean, feedback: string}> => {
  try {
    const messages = [
      {
        role: 'system',
        content: `You are an expert marketing strategist who evaluates proposed Ideal Customer Profiles (ICPs) for businesses.
        Your task is to determine if a proposed ICP is viable and realistic for the given business.
        Consider the following criteria:
        1. Alignment with the business's products/services
        2. Market size and accessibility
        3. Coherence of the ICP's characteristics
        4. Feasibility of targeting this segment
        
        Return a JSON object with:
        - isValid: boolean (true if the ICP seems valid, false if it's extremely improbable)
        - feedback: string (constructive feedback explaining your assessment)
        
        Be conservative in rejecting ICPs - only mark as invalid if there are serious problems.`
      },
      {
        role: 'user',
        content: `Business Information:
        Name: ${business.name}
        Industry: ${business.industry}
        Description: ${business.description}
        
        Proposed ICP:
        Title: ${icp.title}
        Description: ${icp.description}
        Demographics: ${icp.demographics}
        Pain Points: ${icp.painPoints.join(', ')}
        Goals: ${icp.goals.join(', ')}
        `
      }
    ];

    const responseData = await callOpenAI(messages, { maxTokens: 500 });
    console.log('ICP validation response:', responseData);

    const contentString = responseData.choices[0].message.content;
    const parsedContent = JSON.parse(contentString);
    
    return {
      isValid: parsedContent.isValid,
      feedback: parsedContent.feedback
    };
  } catch (error) {
    console.error('ICP validation error:', error);
    // Default to valid in case of error
    return {
      isValid: true,
      feedback: "Couldn't validate due to an error, proceeding with caution."
    };
  }
};

export const generateCompetitiveAnalysis = async (business: any, usp: any): Promise<any> => {
  try {
    const messages = [
      {
        role: 'system',
        content: `You are an expert market analyst helping a business understand the competitive landscape for one of their Unique Selling Points (USPs).
        Based on the business information and USP provided, generate a competitive analysis that includes:
        1. Market Substitutes: List 2-3 closest substitutes or competitors in the market
        2. Competitor Advantages: What advantages these competitors have over the business
        3. Business Advantages: What advantages the business has over these competitors
        4. Pricing Strategy: Recommended pricing strategy for this USP (e.g., premium, value, freemium, subscription)
        5. Monetization Plan: Specific monetization suggestions for this USP
        6. USP Health: An overall assessment of the USP's strength (Strong, Moderate, Needs Improvement)
        7. Health Reasoning: Brief explanation of the USP health assessment
        
        Respond in JSON format with these exact keys.`
      },
      {
        role: 'user',
        content: `Business Name: ${business.name}
        Industry: ${business.industry}
        Description: ${business.description}
        
        USP Title: ${usp.title}
        USP Description: ${usp.description}
        Target ICP: ${usp.targetICP}
        Value Proposition: ${usp.valueProposition}`
      }
    ];

    const responseData = await callOpenAI(messages);
    console.log('Competitive analysis response:', responseData);

    const contentString = responseData.choices[0].message.content;
    return JSON.parse(contentString);
  } catch (error) {
    console.error('Competitive analysis error:', error);
    throw error;
  }
};
