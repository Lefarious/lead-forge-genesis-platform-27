
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely tries to parse a JSON string and returns the parsed object,
 * or the original string if parsing fails
 */
export function safeParseJSON<T>(jsonString: string): T | string {
  if (!jsonString) return jsonString;
  
  try {
    return JSON.parse(jsonString) as T;
  } catch (e) {
    return jsonString;
  }
}

/**
 * Formats a demographics object or string into a readable format
 */
export function formatDemographics(demographics: string): JSX.Element | string {
  if (!demographics) return '';
  
  try {
    // Try to parse as JSON if it's a string
    const parsed = typeof demographics === 'string' ? 
      safeParseJSON<Record<string, any>>(demographics) : 
      demographics;
      
    // If parsing failed, return the original string
    if (typeof parsed === 'string') return parsed;
    
    // Generate formatted output
    return (
      <div className="space-y-1.5">
        {parsed.companySize && (
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-xs font-medium">Company Size:</span>
            <span className="text-xs">{parsed.companySize}</span>
          </div>
        )}
        
        {parsed.industries && parsed.industries.length > 0 && (
          <div className="flex items-start gap-2">
            <span className="text-gray-600 text-xs font-medium">Industries:</span>
            <div className="flex flex-wrap gap-1">
              {Array.isArray(parsed.industries) ? 
                parsed.industries.map((industry: string, i: number) => (
                  <span 
                    key={i} 
                    className="inline-flex items-center rounded-md bg-gray-100 px-1.5 py-0.5 text-xs"
                  >
                    {industry}
                  </span>
                )) : 
                <span className="text-xs">{parsed.industries}</span>
              }
            </div>
          </div>
        )}
        
        {parsed.regions && parsed.regions.length > 0 && (
          <div className="flex items-start gap-2">
            <span className="text-gray-600 text-xs font-medium">Regions:</span>
            <div className="flex flex-wrap gap-1">
              {Array.isArray(parsed.regions) ? 
                parsed.regions.map((region: string, i: number) => (
                  <span 
                    key={i} 
                    className="inline-flex items-center rounded-md bg-gray-100 px-1.5 py-0.5 text-xs"
                  >
                    {region}
                  </span>
                )) : 
                <span className="text-xs">{parsed.regions}</span>
              }
            </div>
          </div>
        )}
        
        {parsed.jobTitles && parsed.jobTitles.length > 0 && (
          <div className="flex items-start gap-2">
            <span className="text-gray-600 text-xs font-medium">Job Titles:</span>
            <div className="flex flex-wrap gap-1">
              {Array.isArray(parsed.jobTitles) ? 
                parsed.jobTitles.map((title: string, i: number) => (
                  <span 
                    key={i} 
                    className="inline-flex items-center rounded-md bg-gray-100 px-1.5 py-0.5 text-xs"
                  >
                    {title}
                  </span>
                )) : 
                <span className="text-xs">{parsed.jobTitles}</span>
              }
            </div>
          </div>
        )}
        
        {parsed.technologyAdoption && (
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-xs font-medium">Tech Adoption:</span>
            <span className="text-xs">{parsed.technologyAdoption}</span>
          </div>
        )}
      </div>
    );
  } catch (e) {
    // If anything fails, return the original string
    return demographics;
  }
}
