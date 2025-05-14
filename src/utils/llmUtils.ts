
import { toast } from '@/components/ui/use-toast';
import { Business, ICP, USP, Geography } from '@/contexts/MarketingToolContext';

// Base LLM request function
async function makeLLMRequest(prompt: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('openai_api_key') || ''}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
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
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('LLM request failed:', error);
    throw error;
  }
}

// Generate ICPs based on business info
export async function generateICPs(business: Business, count = 3): Promise<ICP[]> {
  const prompt = `Generate ${count} detailed Ideal Customer Profiles (ICPs) for a ${business.industry} business named "${business.name}" that ${business.description}. Their main problem to solve is "${business.mainProblem}".

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
    const icps = await makeLLMRequest(prompt);
    return icps.map((icp: any, index: number) => ({
      ...icp,
      id: icp.id || `llm-${Date.now()}-${index}`,
    }));
  } catch (error) {
    toast.error('Failed to generate ICPs. Check your API key and try again.');
    throw error;
  }
}

// Generate USPs based on business and ICPs
export async function generateUSPs(business: Business, icps: ICP[]): Promise<USP[]> {
  const icpTitles = icps.map(icp => icp.title).join(", ");
  const prompt = `Generate 4 Unique Selling Points (USPs) for a ${business.industry} business named "${business.name}" that ${business.description}. 
  Their main problem to solve is "${business.mainProblem}" and they've identified these ideal customer profiles: ${icpTitles}.

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
    const usps = await makeLLMRequest(prompt);
    return usps.map((usp: any, index: number) => ({
      ...usp,
      id: usp.id || `llm-${Date.now()}-${index}`,
    }));
  } catch (error) {
    toast.error('Failed to generate USPs. Check your API key and try again.');
    throw error;
  }
}

// Generate Geographies based on business info
export async function generateGeographies(business: Business): Promise<Geography[]> {
  const prompt = `Generate 4 target geographical markets for a ${business.industry} business named "${business.name}" that ${business.description}. 
  Their main problem to solve is "${business.mainProblem}".

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
    const geographies = await makeLLMRequest(prompt);
    return geographies.map((geo: any, index: number) => ({
      ...geo,
      id: geo.id || `llm-${Date.now()}-${index}`,
    }));
  } catch (error) {
    toast.error('Failed to generate geographies. Check your API key and try again.');
    throw error;
  }
}
