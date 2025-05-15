
import React, { useState, useEffect } from 'react';
import { useMarketingTool } from '@/contexts/MarketingToolContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, FileText, BookOpen, BookmarkCheck, PenTool, Plus, ArrowRight, RefreshCw } from 'lucide-react';
import { ContentIdea, Keyword } from '@/contexts/MarketingToolContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ApiKeyInput from '@/components/common/ApiKeyInput';
import { generateContentIdeas } from '@/utils/llmUtils';

interface ContentStepProps {
  autoGenerate?: boolean;
}

// Move this function outside of the component to make it available to all components in the file
const contentTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'white paper':
      return <FileText className="h-5 w-5 text-blue-600" />;
    case 'blog post':
      return <PenTool className="h-5 w-5 text-green-600" />;
    case 'ebook':
      return <BookOpen className="h-5 w-5 text-purple-600" />;
    case 'webinar':
      return <BookmarkCheck className="h-5 w-5 text-red-600" />;
    default:
      return <FileText className="h-5 w-5 text-gray-600" />;
  }
};

const ContentStep: React.FC<ContentStepProps> = ({ autoGenerate = false }) => {
  const { 
    business, icps, keywords, geographies, usps, contentIdeas, setContentIdeas, addCustomContentIdea,
    publishContent, setCurrentStep, isGenerating, setIsGenerating
  } = useMarketingTool();
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedContent, setSelectedContent] = useState<ContentIdea | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const [newContent, setNewContent] = useState<Partial<ContentIdea>>({
    title: '',
    type: 'Blog Post',
    targetICP: icps.length > 0 ? icps[0].title : '',
    targetKeywords: [],
    outline: [''],
    estimatedValue: 'Medium',
    published: false,
  });

  const [currentOutlineItem, setCurrentOutlineItem] = useState('');
  const [currentKeyword, setCurrentKeyword] = useState('');

  const handleGenerateContent = async () => {
    if (!localStorage.getItem('openai_api_key')) {
      toast.error('Please set your OpenAI API key first');
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Generating content ideas using:', {
        business,
        icps,
        keywords,
        usps,
        geographies,
        existingIdeas: contentIdeas
      });
      
      const generatedContent = await generateContentIdeas(business, icps, keywords, usps, geographies, contentIdeas);
      setContentIdeas([...contentIdeas, ...generatedContent]); // Append new content ideas
      toast.success('Content ideas generated!');
    } catch (error) {
      console.error('Content generation error:', error);
      toast.error('Failed to generate content ideas');
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-generate on first visit
  useEffect(() => {
    if (autoGenerate && contentIdeas.length === 0 && localStorage.getItem('openai_api_key') && !isGenerating) {
      handleGenerateContent();
    }
  }, [autoGenerate]);

  const handlePublish = (id: string) => {
    publishContent(id);
    toast.success('Content published! Share link is now available.');
  };

  const handleEdit = (content: ContentIdea) => {
    setSelectedContent(content);
    setEditNotes('');
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedContent) return;
    
    toast.success('Edit notes saved! These would be sent to your content team.');
    setIsEditDialogOpen(false);
  };
  
  const handleAddOutlineItem = () => {
    if (!currentOutlineItem.trim()) return;
    
    setNewContent({
      ...newContent,
      outline: [...(newContent.outline || []), currentOutlineItem]
    });
    setCurrentOutlineItem('');
  };
  
  const handleRemoveOutlineItem = (index: number) => {
    const updatedOutline = [...(newContent.outline || [])];
    updatedOutline.splice(index, 1);
    setNewContent({...newContent, outline: updatedOutline});
  };
  
  const handleAddKeyword = () => {
    if (!currentKeyword.trim()) return;
    
    setNewContent({
      ...newContent,
      targetKeywords: [...(newContent.targetKeywords || []), currentKeyword]
    });
    setCurrentKeyword('');
  };
  
  const handleRemoveKeyword = (index: number) => {
    const updatedKeywords = [...(newContent.targetKeywords || [])];
    updatedKeywords.splice(index, 1);
    setNewContent({...newContent, targetKeywords: updatedKeywords});
  };
  
  const handleAddCustomContent = () => {
    if (!newContent.title || !newContent.type || !newContent.targetICP || 
        !newContent.targetKeywords?.length || !newContent.outline?.length || !newContent.estimatedValue) {
      toast.error('Please fill all fields');
      return;
    }
    
    addCustomContentIdea(newContent as ContentIdea);
    setIsAddDialogOpen(false);
    setNewContent({
      title: '',
      type: 'Blog Post',
      targetICP: icps.length > 0 ? icps[0].title : '',
      targetKeywords: [],
      outline: [''],
      estimatedValue: 'Medium',
      published: false,
    });
    setCurrentOutlineItem('');
    setCurrentKeyword('');
    toast.success('Custom content idea added successfully');
  };

  const filterContent = () => {
    if (selectedTab === 'all') return contentIdeas;
    if (selectedTab === 'published') return contentIdeas.filter(item => item.published);
    return contentIdeas.filter(item => !item.published);
  };

  const handleContinue = () => {
    if (contentIdeas.length === 0) {
      toast.error('Please generate content ideas first');
      return;
    }
    
    if (!contentIdeas.some(content => content.published)) {
      toast.error('Please publish at least one content piece');
      return;
    }
    
    setCurrentStep(7);
  };

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-2">Content Ideas</h1>
      <p className="text-center text-gray-600 mb-8">
        Generate high-value content ideas based on your ICPs, USPs, geographies and keywords
      </p>

      {contentIdeas.length === 0 ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Generate Content Ideas</CardTitle>
            <CardDescription>
              We'll analyze your business, ICPs, USPs, geographies, and keywords to suggest impactful content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Our AI will generate content ideas tailored to your target audience and marketing goals.
            </p>
            <div className="flex justify-between">
              <Button 
                onClick={() => setCurrentStep(5)} 
                variant="outline"
                className="hover:bg-gray-100 transition-colors"
              >
                Back to Keywords
              </Button>
              <div className="flex items-center gap-2">
                <ApiKeyInput />
                <Button 
                  onClick={handleGenerateContent} 
                  variant="default"
                  className="bg-marketing-600 hover:bg-marketing-700 text-white transition-all duration-300 flex items-center gap-2 group"
                  disabled={isGenerating}
                >
                  {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Content Ideas
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">All Ideas</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="unpublished">Unpublished</TabsTrigger>
              </TabsList>
              
              <Button 
                onClick={handleContinue} 
                className="bg-marketing-600 hover:bg-marketing-700 text-white transition-all duration-300 flex items-center gap-2 group"
              >
                Continue to Publishing
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 gap-6">
                {filterContent().map((content) => (
                  <ContentCard 
                    key={content.id} 
                    content={content} 
                    onPublish={handlePublish} 
                    onEdit={handleEdit} 
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="published" className="mt-0">
              <div className="grid grid-cols-1 gap-6">
                {filterContent().map((content) => (
                  <ContentCard 
                    key={content.id} 
                    content={content} 
                    onPublish={handlePublish} 
                    onEdit={handleEdit} 
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="unpublished" className="mt-0">
              <div className="grid grid-cols-1 gap-6">
                {filterContent().map((content) => (
                  <ContentCard 
                    key={content.id} 
                    content={content} 
                    onPublish={handlePublish} 
                    onEdit={handleEdit} 
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Card className="border-dashed border-2 border-gray-300 hover:border-marketing-400 cursor-pointer flex flex-col items-center justify-center min-h-[200px] transition-all duration-300">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Plus className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium">Add Custom Content Idea</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                  <DialogTitle>Add Custom Content Idea</DialogTitle>
                  <DialogDescription>
                    Create a custom content idea for your marketing strategy.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[500px] overflow-y-auto pr-2">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={newContent.title}
                      onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., How to Automate Your Business Processes"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contentType" className="text-right">
                      Content Type
                    </Label>
                    <select
                      id="contentType"
                      value={newContent.type}
                      onChange={(e) => setNewContent({ ...newContent, type: e.target.value })}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Blog Post">Blog Post</option>
                      <option value="White Paper">White Paper</option>
                      <option value="eBook">eBook</option>
                      <option value="Webinar">Webinar</option>
                      <option value="Case Study">Case Study</option>
                      <option value="Infographic">Infographic</option>
                      <option value="Video">Video</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="targetICP" className="text-right">
                      Target ICP
                    </Label>
                    <select
                      id="targetICP"
                      value={newContent.targetICP}
                      onChange={(e) => setNewContent({ ...newContent, targetICP: e.target.value })}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {icps.map((icp) => (
                        <option key={icp.id} value={icp.title}>{icp.title}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="targetKeywords" className="text-right pt-2">
                      Target Keywords
                    </Label>
                    <div className="col-span-3 space-y-3">
                      <div className="flex gap-2">
                        <Input
                          id="targetKeywords"
                          value={currentKeyword}
                          onChange={(e) => setCurrentKeyword(e.target.value)}
                          placeholder="Enter a keyword"
                        />
                        <Button 
                          type="button" 
                          variant="outline"
                          className="hover:bg-gray-100 transition-colors"
                          onClick={handleAddKeyword}
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {newContent.targetKeywords?.map((keyword, idx) => (
                          <Badge key={idx} variant="outline" className="flex items-center gap-1 bg-gray-100">
                            {keyword}
                            <button 
                              type="button" 
                              onClick={() => handleRemoveKeyword(idx)}
                              className="ml-1 hover:text-red-500 text-xs"
                            >
                              ✕
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="outline" className="text-right pt-2">
                      Content Outline
                    </Label>
                    <div className="col-span-3 space-y-3">
                      <div className="flex gap-2">
                        <Input
                          id="outline"
                          value={currentOutlineItem}
                          onChange={(e) => setCurrentOutlineItem(e.target.value)}
                          placeholder="Enter an outline point"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="hover:bg-gray-100 transition-colors"
                          onClick={handleAddOutlineItem}
                        >
                          Add
                        </Button>
                      </div>
                      <ul className="list-disc pl-4">
                        {newContent.outline?.map((item, idx) => (
                          <li key={idx} className="flex items-center justify-between">
                            <span>{item}</span>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveOutlineItem(idx)}
                              className="ml-2 hover:text-red-500"
                            >
                              ✕
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="estimatedValue" className="text-right">
                      Estimated Value
                    </Label>
                    <select
                      id="estimatedValue"
                      value={newContent.estimatedValue}
                      onChange={(e) => setNewContent({ ...newContent, estimatedValue: e.target.value })}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Very High">Very High</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="hover:bg-gray-100 transition-colors">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddCustomContent} 
                    className="bg-marketing-600 hover:bg-marketing-700 text-white transition-all duration-300 flex items-center gap-2 group"
                  >
                    Add Content Idea
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Card className="border-dashed border-2 border-gray-300 hover:border-marketing-400 cursor-pointer flex flex-col items-center justify-center min-h-[200px] transition-all duration-300">
              <CardContent className="flex flex-col items-center justify-center p-6" onClick={handleGenerateContent}>
                {isGenerating ? (
                  <Loader2 className="h-12 w-12 text-gray-400 mb-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-12 w-12 text-gray-400 mb-4 hover:rotate-180 transition-transform duration-500" />
                )}
                <div className="flex items-center gap-2">
                  <ApiKeyInput />
                </div>
                <p className="text-gray-600 font-medium mt-2">Generate More Content Ideas</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(5)} className="hover:bg-gray-100 transition-colors">
              Back
            </Button>
          </div>
        </>
      )}
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Content: {selectedContent?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Content Details</h3>
              <p><span className="font-medium">Type:</span> {selectedContent?.type}</p>
              <p><span className="font-medium">Target Audience:</span> {selectedContent?.targetICP}</p>
              <div className="mt-2">
                <span className="font-medium">Outline:</span>
                <ul className="list-disc pl-5 mt-1">
                  {selectedContent?.outline.map((item, idx) => (
                    <li key={idx} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="font-medium">Edit Notes for Your Content Team</label>
              <Textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add your instructions or changes for the content team..."
                rows={5}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="hover:bg-gray-100 transition-colors">
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEdit} 
              className="bg-marketing-600 hover:bg-marketing-700 text-white transition-all duration-300 flex items-center gap-2 group"
            >
              Save Edit Notes
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ContentCardProps {
  content: ContentIdea;
  onPublish: (id: string) => void;
  onEdit: (content: ContentIdea) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, onPublish, onEdit }) => {
  return (
    <Card className={`${content.published ? "border-marketing-200 bg-marketing-50/30" : ""} ${content.isCustomAdded ? "border-marketing-300" : ""} transition-all duration-300 hover:shadow-md`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex gap-2 items-center">
            {contentTypeIcon(content.type)}
            <Badge variant="outline" className="bg-gray-100">
              {content.type}
            </Badge>
          </div>
          {content.published && (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              Published
            </Badge>
          )}
          {content.isCustomAdded && (
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
              Custom
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl mt-2">{content.title}</CardTitle>
        <CardDescription>Target: {content.targetICP}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Target Keywords:</h4>
            <div className="flex flex-wrap gap-2">
              {content.targetKeywords.map((keyword, idx) => (
                <Badge key={idx} variant="outline" className="bg-marketing-50 text-marketing-700">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">Outline:</h4>
            <ul className="text-sm text-gray-600 pl-5 list-disc">
              {content.outline.slice(0, 3).map((point, idx) => (
                <li key={idx} className="text-sm">{point}</li>
              ))}
              {content.outline.length > 3 && (
                <li className="text-marketing-600 font-medium">
                  +{content.outline.length - 3} more sections
                </li>
              )}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">Estimated Value:</h4>
            <p className="text-sm text-gray-600">{content.estimatedValue}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          onClick={() => onEdit(content)} 
          className="hover:bg-gray-100 transition-colors"
        >
          Edit Notes
        </Button>
        {content.published ? (
          <div className="flex items-center gap-2">
            <Checkbox id={`published-${content.id}`} checked={true} disabled />
            <label htmlFor={`published-${content.id}`} className="text-sm font-medium text-gray-600">
              Published
            </label>
          </div>
        ) : (
          <Button 
            onClick={() => onPublish(content.id)} 
            className="bg-marketing-600 hover:bg-marketing-700 text-white transition-all duration-300 flex items-center gap-2 group"
          >
            Publish
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ContentStep;
