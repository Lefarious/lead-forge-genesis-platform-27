
/**
 * Utility functions for parsing JSON responses from LLMs
 */

/**
 * Parses and cleans JSON content from LLM responses
 */
export const parseJsonResponse = (contentString: string): any => {
  console.log('Raw content:', contentString);
  
  try {
    // First attempt: Try to parse directly
    const cleanedContentString = contentString
      .replace(/```json|```/g, '') // Remove markdown code blocks
      .trim();
    
    console.log('Cleaned content:', cleanedContentString);
    return JSON.parse(cleanedContentString);
  } catch (parseError) {
    console.error('Error parsing JSON response:', parseError);
    
    // More aggressive cleaning if parsing fails
    try {
      // Try to extract just the JSON part using regex
      const jsonMatch = contentString.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not find valid JSON in the response');
      }
    } catch (secondParseError) {
      console.error('Second parse attempt failed:', secondParseError);
      console.log('Raw content for debugging:', contentString);
      throw new Error('Failed to parse response. The AI response could not be properly parsed.');
    }
  }
};

/**
 * Ensures the parsed content is an array
 */
export const ensureArray = (parsedContent: any): any[] => {
  if (Array.isArray(parsedContent)) {
    return parsedContent;
  } else if (parsedContent && typeof parsedContent === 'object') {
    // Handle case where response is an object with a property that contains the array
    for (const key in parsedContent) {
      if (Array.isArray(parsedContent[key])) {
        return parsedContent[key];
      }
    }
    // If we can't find an array, use the whole object as a single item
    return [parsedContent];
  }
  
  return [];
};
