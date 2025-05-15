
import React from 'react';

interface BlueOceanScoreProps {
  score: number;
}

export const BlueOceanScore: React.FC<BlueOceanScoreProps> = ({ score }) => {
  // Ensure score is within 1-10 range
  const normalizedScore = Math.max(1, Math.min(10, score));
  
  // Calculate percentage for gradient positioning (0-100%)
  const percentage = (normalizedScore - 1) * (100 / 9);
  
  return (
    <div className="flex items-center gap-2">
      <div 
        className="w-6 h-6 rounded-full relative" 
        style={{
          background: `linear-gradient(135deg, #ea384c ${100 - percentage}%, #0EA5E9 ${percentage}%)`
        }}
        title={`Blue Ocean Score: ${score}/10`}
      />
      <span className="text-sm font-medium">{score}/10</span>
      <span className="text-xs text-gray-500">
        {score <= 3 ? 'Red Ocean (Highly Competitive)' : 
         score >= 8 ? 'Blue Ocean (Low Competition)' : 
         'Mixed Market'}
      </span>
    </div>
  );
};
