
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus } from 'lucide-react';

export interface KeywordStats {
  id: string;
  term: string;
  forecastData: {
    date: string;
    searches: number;
    clicks: number;
  }[];
  historicalData: {
    date: string;
    searches: number;
    clicks: number;
  }[];
  synonyms: string[];
  competition: number;
  suggestedBid: string;
  competitorRankings: {
    competitor: string;
    position: number;
  }[];
}

interface KeywordDataVisualizerProps {
  keywordStats: KeywordStats | null;
  isLoading: boolean;
  onGenerateSynonyms: () => void;
  onClose: () => void;
}

const KeywordDataVisualizer: React.FC<KeywordDataVisualizerProps> = ({ 
  keywordStats, 
  isLoading,
  onGenerateSynonyms,
  onClose 
}) => {
  if (!keywordStats && !isLoading) return null;

  return (
    <Card className="w-full mb-8 animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              Keyword Data: {isLoading ? (
                <span className="ml-2 animate-pulse">Loading...</span>
              ) : (
                <span className="ml-2 font-bold">{keywordStats?.term}</span>
              )}
            </CardTitle>
            <CardDescription>
              Detailed performance metrics and forecasts
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="h-12 w-12 text-gray-400 animate-spin" />
          </div>
        ) : keywordStats ? (
          <Tabs defaultValue="forecast">
            <TabsList className="mb-4">
              <TabsTrigger value="forecast">Forecast</TabsTrigger>
              <TabsTrigger value="historical">Historical</TabsTrigger>
              <TabsTrigger value="competition">Competition</TabsTrigger>
              <TabsTrigger value="synonyms">Synonyms</TabsTrigger>
            </TabsList>
            
            <TabsContent value="forecast">
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Search Volume Forecast</h3>
                <div className="h-64">
                  <ChartContainer config={{
                    searches: { color: "#7c3aed" },
                    clicks: { color: "#60a5fa" }
                  }}>
                    <AreaChart data={keywordStats.forecastData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 border rounded shadow">
                                <p className="font-medium">{payload[0].payload.date}</p>
                                <p className="text-[#7c3aed]">Searches: {payload[0].value}</p>
                                <p className="text-[#60a5fa]">Clicks: {payload[1].value}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area type="monotone" dataKey="searches" stroke="#7c3aed" fillOpacity={0.2} fill="#7c3aed" />
                      <Area type="monotone" dataKey="clicks" stroke="#60a5fa" fillOpacity={0.2} fill="#60a5fa" />
                    </AreaChart>
                  </ChartContainer>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="historical">
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Historical Search Trends</h3>
                <div className="h-64">
                  <ChartContainer config={{
                    searches: { color: "#7c3aed" },
                    clicks: { color: "#60a5fa" }
                  }}>
                    <LineChart data={keywordStats.historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 border rounded shadow">
                                <p className="font-medium">{payload[0].payload.date}</p>
                                <p className="text-[#7c3aed]">Searches: {payload[0].value}</p>
                                <p className="text-[#60a5fa]">Clicks: {payload[1].value}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line type="monotone" dataKey="searches" stroke="#7c3aed" />
                      <Line type="monotone" dataKey="clicks" stroke="#60a5fa" />
                    </LineChart>
                  </ChartContainer>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="competition">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Competition Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Competition Level</p>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-marketing-600 rounded-full" 
                          style={{ width: `${keywordStats.competition * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Suggested Bid</p>
                      <p className="text-xl font-medium">{keywordStats.suggestedBid}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Competitor Rankings</h3>
                  <div className="h-64">
                    <ChartContainer config={{
                      position: { color: "#7c3aed" }
                    }}>
                      <BarChart data={keywordStats.competitorRankings} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="competitor" type="category" />
                        <Tooltip />
                        <Bar dataKey="position" fill="#7c3aed" />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="synonyms">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium">Related Keywords & Synonyms</h3>
                  <Button 
                    size="sm" 
                    onClick={onGenerateSynonyms}
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Generate More
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {keywordStats.synonyms.map((synonym, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="bg-gray-100 hover:bg-gray-200 cursor-pointer"
                    >
                      {synonym}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center text-gray-500">
            Select a keyword to view detailed analytics
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordDataVisualizer;
