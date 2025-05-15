import { toast } from '@/components/ui/use-toast';
import { Business, ICP, USP, Geography, Keyword, ContentIdea } from '@/contexts/MarketingToolContext';

// Base LLM request function
async function makeLLMRequest(prompt: string) {
  const apiKey = localStorage.getItem('openai_api_key') || '';
  if (!apiKey) {
    throw new Error('API key not found');
  }

  try {
    console.log('Making API request to OpenAI...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        messages: [
          {
            role: 'system',
            content: 'You are a marketing assistant that helps businesses with their marketing strategy. Respond with JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: {
          "type": "json_object"
        },
        temperature: 0.7
      })
    });

    console.log('API response status:', response.status);
    
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('API error response:', errorBody);
      
      // Handle common status codes
      if (response.status === 401) {
        throw new Error('API key is invalid or expired');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later');
      } else {
        throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
      }
    }

    const data = await response.json();
    console.log('API response received successfully');
    
    // Extract content from the response
    const content = data.choices[0].message.content;
    console.log('Raw response content:', content);
    
    try {
      // Parse the JSON content
      const parsed = JSON.parse(content);
      console.log('Parsed response:', parsed);
      return parsed;
    } catch (parseError) {
      // If we can use the content directly (it's already parsed by response.json())
      if (typeof content === 'object') {
        console.log('Content is already an object, using directly');
        return content;
      }
      console.error('Failed to parse response as JSON:', content);
      throw new Error('Failed to parse AI response as JSON');
    }
  } catch (error) {
    console.error('LLM request failed:', error);
    throw error;
  }
}

// Generate ICPs based on business info
export async function generateICPs(business: Business, count = 3, existingICPs: ICP[] = []): Promise<ICP[]> {
  const existingTitles = existingICPs.map(icp => icp.title).join(", ");
  const prompt = `Generate ${count} detailed Ideal Customer Profiles (ICPs) for a ${business.industry} business named "${business.name}" that ${business.description}. Their main problem to solve is "${business.mainProblem}".

  ${existingICPs.length > 0 ? `They already have these ICPs: ${existingTitles}. Generate NEW ones that are different from these.` : ''}

  Each ICP should include:
  - A title (e.g., "Enterprise IT Decision Makers")
  - A description
  - Demographics information
  - At least 3 pain points
  - At least 3 goals

  Format the response as a JSON array with the following structure:
  [
    {
      "id": "1",
      "title": "Title here",
      "description": "Description here",
      "demographics": "Demographics here",
      "painPoints": ["Pain point 1", "Pain point 2", "Pain point 3"],
      "goals": ["Goal 1", "Goal 2", "Goal 3"]
    }
  ]
  `;

  try {
    const response = await makeLLMRequest(prompt);
    console.log('ICP response structure:', response);
    
    // Get the ICPs array, which might be directly in the response
    // or nested under an "ICPs" property
    let icpsArray;
    
    if (response.ICPs) {
      // Handle capitalized "ICPs" property
      console.log('Found ICPs property (capitalized)');
      icpsArray = response.ICPs;
    } else if (response.icps) {
      // Handle lowercase "icps" property
      console.log('Found icps property (lowercase)');
      icpsArray = response.icps;
    } else if (Array.isArray(response)) {
      // Handle direct array response
      console.log('Response is directly an array');
      icpsArray = response;
    } else {
      // If none of the above, log the response keys to help debugging
      console.error('Could not find ICPs array in response. Keys:', Object.keys(response));
      throw new Error('Invalid response format: Could not find ICPs array');
    }
    
    // Ensure we have an array to work with
    if (!Array.isArray(icpsArray)) {
      console.error('Expected an array but got:', typeof icpsArray, icpsArray);
      throw new Error('Invalid response format: Expected an array of ICPs');
    }
    
    return icpsArray.map((icp: any, index: number) => ({
      ...icp,
      id: icp.id || `llm-${Date.now()}-${index}`,
      // Ensure demographics is a string if it's an object
      demographics: typeof icp.demographics === 'object' 
        ? JSON.stringify(icp.demographics) 
        : icp.demographics,
    }));
  } catch (error: any) {
    const errorMessage = error?.message || 'Unknown error occurred';
    console.error('Failed to generate ICPs:', errorMessage);
    toast.error(`Failed to generate ICPs: ${errorMessage}`);
    throw error;
  }
}

// Generate USPs based on business and ICPs
export async function generateUSPs(business: Business, icps: ICP[], existingUSPs: USP[] = []): Promise<USP[]> {
  const icpTitles = icps.map(icp => icp.title).join(", ");
  const existingTitles = existingUSPs.map(usp => usp.title).join(", ");
  const prompt = `Generate 3 Unique Selling Points (USPs) for a ${business.industry} business named "${business.name}" that ${business.description}. 
  Their main problem to solve is "${business.mainProblem}" and they've identified these ideal customer profiles: ${icpTitles}.

  ${existingUSPs.length > 0 ? `They already have these USPs: ${existingTitles}. Generate NEW ones that are different from these.` : ''}

  Each USP should include:
  - A title (e.g., "AI-Powered Automation")
  - A description
  - The target ICP (choose from the provided ICPs)
  - A value proposition statement

  Format the response as a JSON array with the following structure:
  [
    {
      "id": "1",
      "title": "Title here",
      "description": "Description here",
      "targetICP": "One of the ICP titles",
      "valueProposition": "Value proposition here"
    }
  ]
  `;

  try {
    const response = await makeLLMRequest(prompt);
    console.log('USP response structure:', response);
    
    // Get the USPs array, which might be directly in the response
    // or nested under a "USPs" property (case-insensitive)
    let uspsArray;
    
    if (response.USPs) {
      console.log('Found USPs property (capitalized)');
      uspsArray = response.USPs;
    } else if (response.usps) {
      console.log('Found usps property (lowercase)');
      uspsArray = response.usps;
    } else if (Array.isArray(response)) {
      console.log('Response is directly an array');
      uspsArray = response;
    } else {
      console.error('Could not find USPs array in response. Keys:', Object.keys(response));
      throw new Error('Invalid response format: Could not find USPs array');
    }
    
    // Ensure we have an array to work with
    if (!Array.isArray(uspsArray)) {
      console.error('Expected an array but got:', typeof uspsArray, uspsArray);
      throw new Error('Invalid response format: Expected an array of USPs');
    }
    
    return uspsArray.map((usp: any, index: number) => ({
      ...usp,
      id: usp.id || `llm-${Date.now()}-${index}`,
    }));
  } catch (error: any) {
    const errorMessage = error?.message || 'Unknown error occurred';
    console.error('Failed to generate USPs:', errorMessage);
    toast.error(`Failed to generate USPs: ${errorMessage}`);
    throw error;
  }
}

// Generate Geographies based on business info
export async function generateGeographies(business: Business, existingGeographies: Geography[] = []): Promise<Geography[]> {
  const existingRegions = existingGeographies.map(geo => geo.region).join(", ");
  const prompt = `Generate 3 target geographical markets for a ${business.industry} business named "${business.name}" that ${business.description}. 
  Their main problem to solve is "${business.mainProblem}".

  ${existingGeographies.length > 0 ? `They already have these regions: ${existingRegions}. Generate NEW ones that are different from these.` : ''}

  Each geography should include:
  - A region name (e.g., "North America")
  - The market size
  - Growth rate
  - Competition level
  - A strategic recommendation for entering that market

  Format the response as a JSON array with the following structure:
  [
    {
      "id": "1",
      "region": "Region name here",
      "marketSize": "Market size here",
      "growthRate": "Growth rate here",
      "competitionLevel": "Competition level here",
      "recommendation": "Recommendation here"
    }
  ]
  `;

  try {
    const response = await makeLLMRequest(prompt);
    console.log('Geography response structure:', response);
    
    // Get the geographies array, which might be directly in the response
    // or nested under different property names ("geographies", "markets", etc.)
    let geographiesArray;
    
    if (response.Geographies) {
      console.log('Found Geographies property (capitalized)');
      geographiesArray = response.Geographies;
    } else if (response.geographies) {
      console.log('Found geographies property (lowercase)');
      geographiesArray = response.geographies;
    } else if (response.Markets) {
      console.log('Found Markets property (capitalized)');
      geographiesArray = response.Markets;
    } else if (response.markets) {
      console.log('Found markets property (lowercase)');
      geographiesArray = response.markets;
    } else if (Array.isArray(response)) {
      console.log('Response is directly an array');
      geographiesArray = response;
    } else {
      // Check all keys and log them for debugging
      console.error('Could not find geographies array in response. Keys:', Object.keys(response));
      
      // Check if any other key might contain an array with region properties
      for (const key of Object.keys(response)) {
        if (Array.isArray(response[key]) && response[key].length > 0 && response[key][0].region) {
          console.log(`Found array with region properties in key: ${key}`);
          geographiesArray = response[key];
          break;
        }
      }
      
      // If we still couldn't find a suitable array
      if (!geographiesArray) {
        throw new Error('Invalid response format: Could not find geographies array');
      }
    }
    
    // Ensure we have an array to work with
    if (!Array.isArray(geographiesArray)) {
      console.error('Expected an array but got:', typeof geographiesArray, geographiesArray);
      throw new Error('Invalid response format: Expected an array of geographies');
    }
    
    // Generate unique IDs and filter out any potential duplicates based on region name
    const existingRegionNames = new Set(existingGeographies.map(geo => geo.region.toLowerCase().trim()));
    
    const newGeographies = geographiesArray
      .filter(geo => !existingRegionNames.has(geo.region.toLowerCase().trim()))
      .map((geo, index) => ({
        ...geo,
        id: `llm-${Date.now()}-${index}`,
      }));
    
    console.log(`Generated ${newGeographies.length} new unique geographies`);
    return newGeographies;
  } catch (error: any) {
    const errorMessage = error?.message || 'Unknown error occurred';
    console.error('Failed to generate geographies:', errorMessage);
    toast.error(`Failed to generate geographies: ${errorMessage}`);
    throw error;
  }
}

// Generate keywords based on business, ICPs, and USPs
export async function generateKeywords(business: Business, icps: ICP[], usps: USP[], existingKeywords: Keyword[] = []): Promise<Keyword[]> {
  const existingTerms = existingKeywords.map(kw => kw.term).join(", ");
  const prompt = `Generate 3 target keywords for a ${business.industry} business named "${business.name}" that ${business.description}. 
  Their main problem to solve is "${business.mainProblem}".

  ${existingKeywords.length > 0 ? `They already have these keywords: ${existingTerms}. Generate NEW ones that are different from these.` : ''}

  Each keyword should include:
  - The term (e.g., "AI Marketing Solutions")
  - Estimated search volume
  - Keyword difficulty
  - Relevance to business
  - Related ICP

  Format the response as a JSON array with the following structure:
  [
    {
      "id": "1",
      "term": "Keyword term here",
      "searchVolume": "Search volume here",
      "difficulty": "Difficulty level here",
      "relevance": "Relevance rating here",
      "relatedICP": "Related ICP here"
    }
  ]
  `;

  try {
    const response = await makeLLMRequest(prompt);
    console.log('Keywords response structure:', response);
    
    // Get the keywords array
    let keywordsArray;
    
    if (response.Keywords) {
      console.log('Found Keywords property (capitalized)');
      keywordsArray = response.Keywords;
    } else if (response.keywords) {
      console.log('Found keywords property (lowercase)');
      keywordsArray = response.keywords;
    } else if (Array.isArray(response)) {
      console.log('Response is directly an array');
      keywordsArray = response;
    } else {
      console.error('Could not find keywords array in response. Keys:', Object.keys(response));
      throw new Error('Invalid response format: Could not find keywords array');
    }
    
    // Ensure we have an array to work with
    if (!Array.isArray(keywordsArray)) {
      console.error('Expected an array but got:', typeof keywordsArray, keywordsArray);
      throw new Error('Invalid response format: Expected an array of keywords');
    }
    
    return keywordsArray.map((keyword: any, index: number) => ({
      ...keyword,
      id: keyword.id || `llm-${Date.now()}-${index}`,
    }));
  } catch (error: any) {
    const errorMessage = error?.message || 'Unknown error occurred';
    console.error('Failed to generate keywords:', errorMessage);
    toast.error(`Failed to generate keywords: ${errorMessage}`);
    throw error;
  }
}

// Generate content ideas based on business, ICPs, and keywords
export async function generateContentIdeas(business: Business, icps: ICP[], keywords: Keyword[], existingIdeas: ContentIdea[] = []): Promise<ContentIdea[]> {
  const existingTitles = existingIdeas.map(idea => idea.title).join(", ");
  const prompt = `Generate 3 content ideas for a ${business.industry} business named "${business.name}" that ${business.description}. 
  Their main problem to solve is "${business.mainProblem}".

  ${existingIdeas.length > 0 ? `They already have these content ideas: ${existingTitles}. Generate NEW ones that are different from these.` : ''}

  Each content idea should include:
  - A catchy title
  - Content type (e.g., Blog Post, Whitepaper, Case Study)
  - Target ICP (choose from: ${icps.map(icp => icp.title).join(", ")})
  - Target keywords (2-3 relevant keywords)
  - Content outline (3-5 main points)
  - Estimated value to audience (e.g., High, Medium, Low)

  Format the response as a JSON array with the following structure:
  [
    {
      "id": "1",
      "title": "Title here",
      "type": "Content type here",
      "targetICP": "Target ICP here",
      "targetKeywords": ["Keyword 1", "Keyword 2"],
      "outline": ["Point 1", "Point 2", "Point 3"],
      "estimatedValue": "Value estimation here"
    }
  ]
  `;

  try {
    const response = await makeLLMRequest(prompt);
    console.log('Content ideas response structure:', response);
    
    // Get the content ideas array
    let ideasArray;
    
    if (response.ContentIdeas) {
      console.log('Found ContentIdeas property (capitalized)');
      ideasArray = response.ContentIdeas;
    } else if (response.contentIdeas) {
      console.log('Found contentIdeas property (lowercase)');
      ideasArray = response.contentIdeas;
    } else if (Array.isArray(response)) {
      console.log('Response is directly an array');
      ideasArray = response;
    } else {
      console.error('Could not find content ideas array in response. Keys:', Object.keys(response));
      throw new Error('Invalid response format: Could not find content ideas array');
    }
    
    // Ensure we have an array to work with
    if (!Array.isArray(ideasArray)) {
      console.error('Expected an array but got:', typeof ideasArray, ideasArray);
      throw new Error('Invalid response format: Expected an array of content ideas');
    }
    
    return ideasArray.map((idea: any, index: number) => ({
      ...idea,
      id: idea.id || `llm-${Date.now()}-${index}`,
      published: false,
    }));
  } catch (error: any) {
    const errorMessage = error?.message || 'Unknown error occurred';
    console.error('Failed to generate content ideas:', errorMessage);
    toast.error(`Failed to generate content ideas: ${errorMessage}`);
    throw error;
  }
}
