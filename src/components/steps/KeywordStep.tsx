import React, { useState, useMemo } from 'react';
import { useMarketingTool } from '@/contexts/MarketingToolContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Search, Plus, RefreshCw, SortAsc, SortDesc, List } from 'lucide-react';
import { Keyword } from '@/contexts/MarketingToolContext';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateKeywords } from '@/utils/generators/keywordGenerator';
import ApiKeyInput from '@/components/common/ApiKeyInput';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import KeywordOptimizer from '@/components/keywords/KeywordOptimizer';
import KeywordDataVisualizer from '@/components/keywords/KeywordDataVisualizer';
import { fetchKeywordStats, generateMoreSynonyms } from '@/services/keywordsApiService';

interface KeywordStepProps {}

const getDifficultyColor = (difficulty: string) => {
  if (!difficulty) return 'bg-gray-100 text-gray-800';
  if (difficulty.toLowerCase().includes('low')) return 'bg-green-100 text-green-800';
  if (difficulty.toLowerCase().includes('high')) return 'bg-red-100 text-red-800';
  return 'bg-amber-100 text-amber-800';
};

const getRelevanceColor = (relevance: string) => {
  if (!relevance) return 'bg-gray-100 text-gray-800';
  if (relevance.toLowerCase() === 'high') return 'bg-green-100 text-green-800';
  if (relevance.toLowerCase() === 'low') return 'bg-gray-100 text-gray-800';
  return 'bg-blue-100 text-blue-800';
};

const getCompetitorUsageColor = (usage: string) => {
  if (!usage) return 'bg-gray-100 text-gray-800';
  if (usage.toLowerCase() === 'high') return 'bg-red-100 text-red-800';
  if (usage.toLowerCase() === 'low') return 'bg-green-100 text-green-800';
  return 'bg-blue-100 text-blue-800';
};

const KeywordStep: React.FC<KeywordStepProps> = () => {
  const { 
    business, icps, usps, geographies, keywords, setKeywords, addCustomKeyword, 
    setCurrentStep, isGenerating, setIsGenerating, keywordStats, setKeywordStats,
    selectedKeywordStats, setSelectedKeywordStats
  } = useMarketingTool();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newKeyword, setNewKeyword] = useState<Partial<Keyword>>({
    term: '',
    searchVolume: '',
    difficulty: 'Medium',
    relevance: 'Medium',
    relatedICP: icps.length > 0 ? icps[0].title : '',
    competitorUsage: 'Medium'
  });
  
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Keyword,
    direction: 'asc' | 'desc'
  }>({
    key: 'term',
    direction: 'asc'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  
  // Function to handle sorting
  const requestSort = (key: keyof Keyword) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Apply sorting and filtering to keywords
  const sortedKeywords = useMemo(() => {
    // Filter keywords based on search term
    const filteredKeywords = keywords.filter(keyword => 
      keyword.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (keyword.relatedICP && keyword.relatedICP.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    // Sort filtered keywords
    return [...filteredKeywords].sort((a, b) => {
      if (!a[sortConfig.key] && !b[sortConfig.key]) return 0;
      if (!a[sortConfig.key]) return 1;
      if (!b[sortConfig.key]) return -1;
      
      const aValue = String(a[sortConfig.key] || '').toLowerCase();
      const bValue = String(b[sortConfig.key] || '').toLowerCase();
      
      // For numeric values like search volume
      if (sortConfig.key === 'searchVolume') {
        const aNum = parseInt(aValue.replace(/[^0-9]/g, '')) || 0;
        const bNum = parseInt(bValue.replace(/[^0-9]/g, '')) || 0;
        return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
      }
      
      // For string values
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [keywords, sortConfig, searchTerm]);

  // Get frequency of each ICP in keywords to determine opacity
  const icpFrequency = useMemo(() => {
    const frequency: Record<string, number> = {};
    keywords.forEach(keyword => {
      const icp = keyword.relatedICP;
      frequency[icp] = (frequency[icp] || 0) + 1;
    });
    return frequency;
  }, [keywords]);
  
  // Get max frequency for normalization
  const maxFrequency = useMemo(() => {
    return Math.max(...Object.values(icpFrequency), 1);
  }, [icpFrequency]);
  
  // Calculate opacity based on frequency
  const getIcpOpacity = (icp: string) => {
    const frequency = icpFrequency[icp] || 0;
    return Math.max(0.4, frequency / maxFrequency);
  };

  const handleGenerateKeywords = async () => {
    if (!localStorage.getItem('developer_token')) {
      toast.error('Please set your Developer Token first');
      return;
    }

    setIsGenerating(true);
    try {
      const generatedKeywords = await generateKeywords(business, icps, usps, [], geographies);
      setKeywords(generatedKeywords);
      toast.success('Keywords generated!');
    } catch (error) {
      toast.error('Failed to generate keywords');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMoreKeywords = async () => {
    if (!localStorage.getItem('developer_token')) {
      toast.error('Please set your Developer Token first');
      return;
    }

    setIsGenerating(true);
    try {
      // Pass existing keywords to avoid duplicates, along with ICPs, USPs, and geographies
      const moreKeywords = await generateKeywords(business, icps, usps, keywords, geographies);
      setKeywords([...keywords, ...moreKeywords]);
      toast.success('Additional keywords generated!');
    } catch (error) {
      toast.error('Failed to generate additional keywords');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddCustomKeyword = () => {
    if (!newKeyword.term || !newKeyword.searchVolume || !newKeyword.difficulty || 
        !newKeyword.relevance || !newKeyword.relatedICP) {
      toast.error('Please fill all fields');
      return;
    }

    addCustomKeyword(newKeyword as Keyword);
    setIsAddDialogOpen(false);
    setNewKeyword({
      term: '',
      searchVolume: '',
      difficulty: 'Medium',
      relevance: 'Medium',
      relatedICP: icps.length > 0 ? icps[0].title : '',
      competitorUsage: 'Medium'
    });
    toast.success('Custom keyword added successfully');
  };

  const handleContinue = () => {
    if (keywords.length === 0) {
      toast.error('Please generate keywords first');
      return;
    }
    setCurrentStep(6);
  };

  const handleKeywordClick = async (keyword: Keyword) => {
    setIsLoadingStats(true);
    setSelectedKeywordStats(null);

    try {
      // Check if we already have stats for this keyword
      const existingStat = keywordStats.find(stat => stat.term === keyword.term);
      
      if (existingStat) {
        setSelectedKeywordStats(existingStat);
      } else {
        // If not, fetch new stats
        const token = localStorage.getItem('developer_token');
        if (!token) {
          toast.error('Please set your Developer Token first');
          setIsLoadingStats(false);
          return;
        }
        
        const stats = await fetchKeywordStats(keyword, token);
        // Fix the type mismatch
        const updatedStats = [...keywordStats, stats];
        setKeywordStats(updatedStats);
        setSelectedKeywordStats(stats);
      }
    } catch (error) {
      console.error('Failed to fetch keyword stats:', error);
      toast.error('Failed to fetch keyword data');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleGenerateMoreSynonyms = async () => {
    if (!selectedKeywordStats) return;
    
    try {
      const token = localStorage.getItem('developer_token');
      if (!token) {
        toast.error('Please set your Developer Token first');
        return;
      }
      
      const newSynonyms = await generateMoreSynonyms(selectedKeywordStats.term, token);
      
      // Update the selected keyword stats with new synonyms
      const updatedStats = {
        ...selectedKeywordStats,
        synonyms: [...new Set([...selectedKeywordStats.synonyms, ...newSynonyms])]
      };
      
      // Update the keyword stats array
      const updatedKeywordStats = keywordStats.map(stat => 
        stat.id === selectedKeywordStats.id ? updatedStats : stat
      );
      
      setKeywordStats(updatedKeywordStats);
      setSelectedKeywordStats(updatedStats);
      
      toast.success('Generated new synonyms');
    } catch (error) {
      console.error('Failed to generate synonyms:', error);
      toast.error('Failed to generate synonyms');
    }
  };

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-2">Keyword Research</h1>
      <p className="text-center text-gray-600 mb-8">
        Discover high-value keywords for your content and SEO strategy
      </p>

      {keywords.length === 0 ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Generate Keywords</CardTitle>
            <CardDescription>
              We'll analyze your business, ICPs, USPs, and geographies to identify valuable keywords
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Our system will generate a list of keywords tailored to your business and target audience using Manager Customer ID: <span className="font-mono">981-519-4690</span>
            </p>
            <div className="flex justify-between items-center">
              <Button 
                onClick={() => setCurrentStep(4)} 
                variant="outline"
              >
                Back to Geographies
              </Button>
              <div className="flex items-center gap-2">
                <ApiKeyInput />
                <Button 
                  onClick={handleGenerateKeywords} 
                  className="bg-marketing-600 hover:bg-marketing-700 text-white transition-colors"
                  disabled={isGenerating}
                >
                  {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Keywords
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Keyword Data Visualizer - show when a keyword is selected */}
          <KeywordDataVisualizer 
            keywordStats={selectedKeywordStats}
            isLoading={isLoadingStats}
            onGenerateSynonyms={handleGenerateMoreSynonyms}
            onClose={() => setSelectedKeywordStats(null)}
          />
          
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center">
                    <Search className="h-5 w-5 mr-2 text-marketing-600" />
                    Keywords for Your Content Strategy
                  </CardTitle>
                  <CardDescription>
                    Use these keywords in your content, website, and advertising to improve visibility
                  </CardDescription>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Input 
                    placeholder="Search keywords..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-auto"
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <List className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => requestSort('term')}>
                        Sort by Term {sortConfig.key === 'term' && 
                          (sortConfig.direction === 'asc' ? <SortAsc className="ml-2 h-4 w-4" /> : <SortDesc className="ml-2 h-4 w-4" />)}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => requestSort('searchVolume')}>
                        Sort by Search Volume {sortConfig.key === 'searchVolume' && 
                          (sortConfig.direction === 'asc' ? <SortAsc className="ml-2 h-4 w-4" /> : <SortDesc className="ml-2 h-4 w-4" />)}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => requestSort('difficulty')}>
                        Sort by Difficulty {sortConfig.key === 'difficulty' && 
                          (sortConfig.direction === 'asc' ? <SortAsc className="ml-2 h-4 w-4" /> : <SortDesc className="ml-2 h-4 w-4" />)}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => requestSort('relevance')}>
                        Sort by Relevance {sortConfig.key === 'relevance' && 
                          (sortConfig.direction === 'asc' ? <SortAsc className="ml-2 h-4 w-4" /> : <SortDesc className="ml-2 h-4 w-4" />)}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => requestSort('relatedICP')}>
                        Sort by ICP {sortConfig.key === 'relatedICP' && 
                          (sortConfig.direction === 'asc' ? <SortAsc className="ml-2 h-4 w-4" /> : <SortDesc className="ml-2 h-4 w-4" />)}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => requestSort('competitorUsage')}>
                        Sort by Competitor Usage {sortConfig.key === 'competitorUsage' && 
                          (sortConfig.direction === 'asc' ? <SortAsc className="ml-2 h-4 w-4" /> : <SortDesc className="ml-2 h-4 w-4" />)}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <KeywordOptimizer onGenerateMore={handleGenerateMoreKeywords} />
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer" onClick={() => requestSort('term')}>
                        Keyword {sortConfig.key === 'term' && (sortConfig.direction === 'asc' ? <SortAsc className="inline h-4 w-4" /> : <SortDesc className="inline h-4 w-4" />)}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => requestSort('searchVolume')}>
                        Search Volume {sortConfig.key === 'searchVolume' && (sortConfig.direction === 'asc' ? <SortAsc className="inline h-4 w-4" /> : <SortDesc className="inline h-4 w-4" />)}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => requestSort('difficulty')}>
                        Difficulty {sortConfig.key === 'difficulty' && (sortConfig.direction === 'asc' ? <SortAsc className="inline h-4 w-4" /> : <SortDesc className="inline h-4 w-4" />)}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => requestSort('relevance')}>
                        Relevance {sortConfig.key === 'relevance' && (sortConfig.direction === 'asc' ? <SortAsc className="inline h-4 w-4" /> : <SortDesc className="inline h-4 w-4" />)}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => requestSort('competitorUsage')}>
                        Competitor Usage {sortConfig.key === 'competitorUsage' && (sortConfig.direction === 'asc' ? <SortAsc className="inline h-4 w-4" /> : <SortDesc className="inline h-4 w-4" />)}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => requestSort('relatedICP')}>
                        Related ICP {sortConfig.key === 'relatedICP' && (sortConfig.direction === 'asc' ? <SortAsc className="inline h-4 w-4" /> : <SortDesc className="inline h-4 w-4" />)}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedKeywords.map((keyword) => (
                      <TableRow 
                        key={keyword.id} 
                        className={`${keyword.isCustomAdded ? "bg-marketing-50/30" : ""} cursor-pointer hover:bg-gray-100`}
                        onClick={() => handleKeywordClick(keyword)}
                      >
                        <TableCell className="font-medium">{keyword.term}</TableCell>
                        <TableCell>{keyword.searchVolume || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getDifficultyColor(keyword.difficulty)}>
                            {keyword.difficulty || 'Not set'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getRelevanceColor(keyword.relevance)}>
                            {keyword.relevance || 'Not set'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getCompetitorUsageColor(keyword.competitorUsage)}>
                            {keyword.competitorUsage || 'Not set'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span style={{ opacity: keyword.relatedICP ? getIcpOpacity(keyword.relatedICP) : 0.5 }}>
                            {keyword.relatedICP || 'Not set'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Button 
              variant="outline"
              className="border-dashed border-2 border-gray-300 hover:border-marketing-400 flex flex-col items-center justify-center min-h-[200px] p-6"
              onClick={handleGenerateMoreKeywords}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-12 w-12 text-gray-400 mb-4 animate-spin" />
              ) : (
                <RefreshCw className="h-12 w-12 text-gray-400 mb-4" />
              )}
              <p className="text-gray-600 font-medium">Generate More Keywords</p>
            </Button>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Card className="border-dashed border-2 border-gray-300 hover:border-marketing-400 cursor-pointer flex flex-col items-center justify-center min-h-[200px]">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Plus className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium">Add Custom Keyword</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
            </Dialog>
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(4)}
              className="hover:bg-gray-100 transition-colors"
            >
              Back
            </Button>
            <Button 
              onClick={handleContinue} 
              className="bg-marketing-600 hover:bg-marketing-700 text-white transition-colors"
            >
              Continue to Content Ideas
            </Button>
          </div>
        </>
      )}
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Custom Keyword</DialogTitle>
            <DialogDescription>
              Add a custom keyword for your SEO and content strategy.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="term" className="text-right">
                Keyword Term
              </Label>
              <Input
                id="term"
                value={newKeyword.term}
                onChange={(e) => setNewKeyword({ ...newKeyword, term: e.target.value })}
                className="col-span-3"
                placeholder="e.g., business process automation"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="searchVolume" className="text-right">
                Search Volume
              </Label>
              <Input
                id="searchVolume"
                value={newKeyword.searchVolume}
                onChange={(e) => setNewKeyword({ ...newKeyword, searchVolume: e.target.value })}
                className="col-span-3"
                placeholder="e.g., 5,400/mo"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="difficulty" className="text-right">
                Difficulty
              </Label>
              <Select
                value={newKeyword.difficulty}
                onValueChange={(value) => setNewKeyword({ ...newKeyword, difficulty: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium-Low">Medium-Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Medium-High">Medium-High</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="relevance" className="text-right">
                Relevance
              </Label>
              <Select
                value={newKeyword.relevance}
                onValueChange={(value) => setNewKeyword({ ...newKeyword, relevance: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select relevance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="competitorUsage" className="text-right">
                Competitor Usage
              </Label>
              <Select
                value={newKeyword.competitorUsage}
                onValueChange={(value) => setNewKeyword({ ...newKeyword, competitorUsage: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select competitor usage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="relatedICP" className="text-right">
                Related ICP
              </Label>
              <Select
                value={newKeyword.relatedICP}
                onValueChange={(value) => setNewKeyword({ ...newKeyword, relatedICP: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select related ICP" />
                </SelectTrigger>
                <SelectContent>
                  {icps.map((icp) => (
                    <SelectItem key={icp.id} value={icp.title}>{icp.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="hover:bg-gray-100 transition-colors">
              Cancel
            </Button>
            <Button onClick={handleAddCustomKeyword} className="bg-marketing-600 hover:bg-marketing-700 text-white transition-colors">
              Add Keyword
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KeywordStep;
