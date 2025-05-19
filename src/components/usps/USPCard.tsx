
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { USP } from '@/contexts/MarketingToolContext';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';

interface USPCardProps {
  usp: USP;
  business: any;
}

const USPCard: React.FC<USPCardProps> = ({ usp, business }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <Card key={usp.id} className={usp.isCustomAdded ? "border-marketing-300 bg-marketing-50/30 dark:bg-gray-800/30 dark:border-marketing-800/50" : ""}>
      <CardHeader>
        <CardTitle className="text-xl">{usp.title}</CardTitle>
        <CardDescription>Target: {usp.targetICP || "Not specified"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{usp.description}</p>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-marketing-50'} p-3 rounded-md`}>
          <h4 className={`font-medium text-sm mb-1 ${isDarkMode ? 'text-marketing-400' : 'text-marketing-700'}`}>Value Proposition:</h4>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{usp.valueProposition || "Not specified"}</p>
        </div>
        
        <div className="space-y-3">
          <h4 className={`font-medium ${isDarkMode ? 'text-marketing-400' : 'text-marketing-700'}`}>Competitive Analysis</h4>
          
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {usp.competitorComparison || "No competitor comparison provided"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default USPCard;
