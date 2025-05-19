
/**
 * Utility to standardize market size formats
 */

/**
 * Standardizes market size strings to K, M, B format
 * @param marketSize Original market size string
 * @returns Standardized market size string
 */
export const standardizeMarketSize = (marketSize: string): string => {
  if (!marketSize) return '';
  
  // Check if already in standardized format
  if (/^\d+(\.\d+)?[KMB]$/i.test(marketSize)) {
    return marketSize.toUpperCase();
  }
  
  // Convert market size to standardized format
  const cleanedValue = marketSize.replace(/[^\d.]/g, '');
  const numValue = parseFloat(cleanedValue);
  
  if (isNaN(numValue)) return marketSize;
  
  // Check if the string already contains K, M, B indicators
  if (marketSize.toLowerCase().includes('billion') || marketSize.toLowerCase().includes('b')) {
    return `${numValue}B`;
  } else if (marketSize.toLowerCase().includes('million') || marketSize.toLowerCase().includes('m')) {
    return `${numValue}M`;
  } else if (marketSize.toLowerCase().includes('thousand') || marketSize.toLowerCase().includes('k')) {
    return `${numValue}K`;
  }
  
  // If the number is large enough, convert to appropriate unit
  if (numValue >= 1_000_000_000) {
    return `${(numValue / 1_000_000_000).toFixed(1)}B`;
  } else if (numValue >= 1_000_000) {
    return `${(numValue / 1_000_000).toFixed(1)}M`;
  } else if (numValue >= 1_000) {
    return `${(numValue / 1_000).toFixed(1)}K`;
  }
  
  return marketSize;
};

/**
 * Formats a market size for display, with optional units
 * @param marketSize Original market size string or number
 * @param includeUnit Whether to include the full unit name
 * @returns Formatted market size string
 */
export const formatMarketSize = (marketSize: string | number, includeUnit: boolean = false): string => {
  if (marketSize === undefined || marketSize === null) return 'Unknown';
  
  const standardized = typeof marketSize === 'string' ? standardizeMarketSize(marketSize) : marketSize.toString();
  
  if (!includeUnit) return standardized;
  
  // Add full unit names for display
  if (standardized.endsWith('B')) {
    return standardized.replace('B', ' Billion');
  } else if (standardized.endsWith('M')) {
    return standardized.replace('M', ' Million');
  } else if (standardized.endsWith('K')) {
    return standardized.replace('K', ' Thousand');
  }
  
  return standardized;
};
