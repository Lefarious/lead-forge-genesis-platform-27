
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type DemographicsData } from "@/components/common/DemographicsDisplay"

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
 * Returns the parsed demographics data or the original string if parsing fails
 */
export function formatDemographics(demographics: string): DemographicsData | string {
  if (!demographics) return '';
  
  try {
    // Try to parse as JSON if it's a string
    const parsed = typeof demographics === 'string' ? 
      safeParseJSON<Record<string, any>>(demographics) : 
      demographics;
      
    // If parsing failed, return the original string
    if (typeof parsed === 'string') return parsed;
    
    return {
      companySize: parsed.companySize,
      industries: parsed.industries,
      regions: parsed.regions,
      jobTitles: parsed.jobTitles,
      technologyAdoption: parsed.technologyAdoption
    };
  } catch (e) {
    // If anything fails, return the original string
    return demographics;
  }
}
