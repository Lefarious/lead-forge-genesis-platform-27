
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { USP } from '@/contexts/MarketingToolContext';
import CompetitiveAnalysis from './CompetitiveAnalysis';

interface USPCardProps {
  usp: USP;
  business: any;
}

const USPCard: React.FC<USPCardProps> = ({ usp, business }) => {
  return (
    <Card key={usp.id} className={usp.isCustomAdded ? "border-marketing-300 bg-marketing-50/30" : ""}>
      <CardHeader>
        <CardTitle className="text-xl">{usp.title}</CardTitle>
        <CardDescription>Target: {usp.targetICP || "Not specified"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-gray-600">{usp.description}</p>
        </div>
        <div className="bg-marketing-50 p-3 rounded-md">
          <h4 className="font-medium text-sm mb-1 text-marketing-700">Value Proposition:</h4>
          <p className="text-sm text-gray-700">{usp.valueProposition || "Not specified"}</p>
        </div>
        
        <CompetitiveAnalysis business={business} usp={usp} />
      </CardContent>
    </Card>
  );
};

export default USPCard;
