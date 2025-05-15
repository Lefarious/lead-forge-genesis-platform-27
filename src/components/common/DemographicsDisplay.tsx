
import React from 'react';

export interface DemographicsData {
  companySize?: string;
  industries?: string[];
  regions?: string[];
  jobTitles?: string[];
  technologyAdoption?: string;
}

export const DemographicsDisplay = ({ data }: { data: DemographicsData }) => {
  return (
    <div className="space-y-1.5">
      {data.companySize && (
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-xs font-medium">Company Size:</span>
          <span className="text-xs">{data.companySize}</span>
        </div>
      )}
      
      {data.industries && data.industries.length > 0 && (
        <div className="flex items-start gap-2">
          <span className="text-gray-600 text-xs font-medium">Industries:</span>
          <div className="flex flex-wrap gap-1">
            {Array.isArray(data.industries) ? 
              data.industries.map((industry: string, i: number) => (
                <span 
                  key={i} 
                  className="inline-flex items-center rounded-md bg-gray-100 px-1.5 py-0.5 text-xs"
                >
                  {industry}
                </span>
              )) : 
              <span className="text-xs">{data.industries}</span>
            }
          </div>
        </div>
      )}
      
      {data.regions && data.regions.length > 0 && (
        <div className="flex items-start gap-2">
          <span className="text-gray-600 text-xs font-medium">Regions:</span>
          <div className="flex flex-wrap gap-1">
            {Array.isArray(data.regions) ? 
              data.regions.map((region: string, i: number) => (
                <span 
                  key={i} 
                  className="inline-flex items-center rounded-md bg-gray-100 px-1.5 py-0.5 text-xs"
                >
                  {region}
                </span>
              )) : 
              <span className="text-xs">{data.regions}</span>
            }
          </div>
        </div>
      )}
      
      {data.jobTitles && data.jobTitles.length > 0 && (
        <div className="flex items-start gap-2">
          <span className="text-gray-600 text-xs font-medium">Job Titles:</span>
          <div className="flex flex-wrap gap-1">
            {Array.isArray(data.jobTitles) ? 
              data.jobTitles.map((title: string, i: number) => (
                <span 
                  key={i} 
                  className="inline-flex items-center rounded-md bg-gray-100 px-1.5 py-0.5 text-xs"
                >
                  {title}
                </span>
              )) : 
              <span className="text-xs">{data.jobTitles}</span>
            }
          </div>
        </div>
      )}
      
      {data.technologyAdoption && (
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-xs font-medium">Tech Adoption:</span>
          <span className="text-xs">{data.technologyAdoption}</span>
        </div>
      )}
    </div>
  );
};
