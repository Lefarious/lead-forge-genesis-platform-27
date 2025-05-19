
import { callOpenAI } from '../api/openaiApi';
import { parseJsonResponse } from '../parsers/jsonParser';

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
    const parsedContent = parseJsonResponse(contentString);
    
    return {
      isValid: parsedContent.isValid,
      feedback: parsedContent.feedback
    };
  } catch (error) {
    console.error('ICP validation error:', error);
    throw error;
  }
};
