
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateCompetitiveAnalysis } from '@/utils/analyzers/competitiveAnalyzer';
import { useToast } from '@/hooks/use-toast';

interface CompetitiveAnalysisProps {
  business: any;
  usp: any;
}

const CompetitiveAnalysis: React.FC<CompetitiveAnalysisProps> = ({ business, usp }) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Auto-generate analysis on component mount
  useEffect(() => {
    const generateAnalysis = async () => {
      if (!localStorage.getItem('openai_api_key')) {
        return;
      }

      setIsLoading(true);
      try {
        const result = await generateCompetitiveAnalysis(business, usp);
        setAnalysis(result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to generate competitive analysis";
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    generateAnalysis();
  }, [business, usp]);

  // Helper function to determine health badge color
  const getHealthBadgeColor = (health: string) => {
    switch (health?.toLowerCase()) {
      case 'strong':
        return 'bg-green-500 hover:bg-green-600';
      case 'moderate':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'needs improvement':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  if (!analysis) {
    return null;
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <h4 className="font-medium text-marketing-700">USP Strength:</h4>
        {analysis.usphealth && (
          <Badge className={getHealthBadgeColor(analysis.usphealth)}>
            {analysis.usphealth}
          </Badge>
        )}
        <span className="text-sm text-gray-500">
          {analysis.healthreasoning || ""}
        </span>
      </div>

      {/* Competitor Section */}
      <div className="space-y-2">
        <h4 className="font-medium text-marketing-700">Potential Competitors</h4>
        <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
          {Array.isArray(analysis.marketsubstitutes) ? 
            analysis.marketsubstitutes.map((substitute: string, i: number) => (
              <li key={i}>{substitute}</li>
            )) : 
            <li>{analysis.marketsubstitutes}</li>
          }
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-50 p-3 rounded-md">
          <h4 className="font-medium mb-2 text-red-700">Competitor Advantages</h4>
          <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
            {Array.isArray(analysis.competitoradvantages) ? 
              analysis.competitoradvantages.map((advantage: string, i: number) => (
                <li key={i}>{advantage}</li>
              )) : 
              <li>{analysis.competitoradvantages}</li>
            }
          </ul>
        </div>
        
        <div className="bg-green-50 p-3 rounded-md">
          <h4 className="font-medium mb-2 text-green-700">Our Advantages</h4>
          <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
            {Array.isArray(analysis.businessadvantages) ? 
              analysis.businessadvantages.map((advantage: string, i: number) => (
                <li key={i}>{advantage}</li>
              )) : 
              <li>{analysis.businessadvantages}</li>
            }
          </ul>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2 text-marketing-700">Recommended Strategy</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-sm font-semibold mb-1">Pricing Strategy</h5>
            <p className="text-sm">{analysis.pricingstrategy}</p>
          </div>
          <div>
            <h5 className="text-sm font-semibold mb-1">Monetization Plan</h5>
            <p className="text-sm">{Array.isArray(analysis.monetizationplan) ? 
              analysis.monetizationplan.join(", ") : 
              analysis.monetizationplan}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitiveAnalysis;
