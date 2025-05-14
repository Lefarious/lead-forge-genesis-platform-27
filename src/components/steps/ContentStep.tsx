
import React, { useState } from 'react';
import { useMarketingTool } from '@/contexts/MarketingToolContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, FileText, BookOpen, BookmarkCheck, PenTool } from 'lucide-react';
import { ContentIdea } from '@/contexts/MarketingToolContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const mockGenerateContent = (business: any, icps: any[], keywords: any[]): Promise<ContentIdea[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          title: 'The Future of Workflow Automation: AI-Driven Approaches for Enterprise',
          type: 'White Paper',
          targetICP: 'Enterprise IT Decision Makers',
          targetKeywords: ['AI workflow automation', 'enterprise workflow management'],
          outline: [
            'Introduction to AI in workflow automation',
            'Current challenges in enterprise workflows',
            'How AI transforms automation capabilities',
            'Case studies: 3 enterprises that increased efficiency by 70%+',
            'Implementation roadmap for enterprise IT leaders',
            'ROI calculation methodology'
          ],
          estimatedValue: 'High - Lead generation for enterprise clients',
          published: false
        },
        {
          id: '2',
          title: '5 Ways No-Code Automation is Transforming Startup Operations',
          type: 'Blog Post',
          targetICP: 'Startup Founders',
          targetKeywords: ['no-code automation tool', 'startup automation tools'],
          outline: [
            'The startup time crunch: Why automation matters',
            '1. Customer onboarding automation',
            '2. Marketing and sales process automation',
            '3. Financial reporting automation',
            '4. HR and recruitment automation',
            '5. Customer support automation',
            'How to start with limited resources'
          ],
          estimatedValue: 'Medium - SEO and awareness building',
          published: false
        },
        {
          id: '3',
          title: 'The Complete Guide to Business Process Integration for Mid-Market Companies',
          type: 'eBook',
          targetICP: 'Mid-Market Operations Managers',
          targetKeywords: ['business process automation software', 'workflow integration platform'],
          outline: [
            'The mid-market integration challenge',
            'Mapping your current process landscape',
            'Identifying integration priorities',
            'Selecting the right integration approach',
            'Implementation strategies that won't disrupt operations',
            'Measuring success: KPIs for integration projects',
            'Future-proofing your integration architecture'
          ],
          estimatedValue: 'High - Lead generation and thought leadership',
          published: false
        },
        {
          id: '4',
          title: 'ROI Calculator: Automation Value Assessment',
          type: 'Interactive Tool',
          targetICP: 'Mid-Market Operations Managers',
          targetKeywords: ['business automation ROI', 'workflow integration platform'],
          outline: [
            'Input current process metrics',
            'Select automation opportunities',
            'Calculate time and cost savings',
            'Generate implementation roadmap',
            'Recommended solutions based on profile',
            'Shareable results for stakeholder buy-in'
          ],
          estimatedValue: 'Very High - Lead qualification and sales enablement',
          published: false
        },
        {
          id: '5',
          title: 'AI-Powered Business Transformation: A CIO's Guide',
          type: 'Webinar',
          targetICP: 'Enterprise IT Decision Makers',
          targetKeywords: ['AI-powered business automation', 'enterprise workflow management'],
          outline: [
            'The current state of AI in business processes',
            'Common implementation challenges',
            'Live demo of AI workflow automation',
            'Security and compliance considerations',
            'Q&A with industry experts',
            'Implementation roadmap and resources'
          ],
          estimatedValue: 'High - Lead generation and thought leadership',
          published: false
        },
      ]);
    }, 2000);
  });
};

const ContentStep: React.FC = () => {
  const { 
    business, icps, keywords, contentIdeas, setContentIdeas, 
    publishContent, setCurrentStep, isGenerating, setIsGenerating
  } = useMarketingTool();
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedContent, setSelectedContent] = useState<ContentIdea | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    try {
      const generatedContent = await mockGenerateContent(business, icps, keywords);
      setContentIdeas(generatedContent);
      toast.success('Content ideas generated!');
    } catch (error) {
      toast.error('Failed to generate content ideas');
    } finally {
      setIsGenerating(false);
    }
  };

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

  const filterContent = () => {
    if (selectedTab === 'all') return contentIdeas;
    if (selectedTab === 'published') return contentIdeas.filter(item => item.published);
    return contentIdeas.filter(item => !item.published);
  };

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
        Generate high-value content ideas based on your ICPs and keywords
      </p>

      {contentIdeas.length === 0 ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Generate Content Ideas</CardTitle>
            <CardDescription>
              We'll analyze your business, ICPs, and keywords to suggest impactful content
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
              >
                Back to Keywords
              </Button>
              <Button 
                onClick={handleGenerateContent} 
                className="bg-marketing-600 hover:bg-marketing-700"
                disabled={isGenerating}
              >
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Content Ideas
              </Button>
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
                className="bg-marketing-600 hover:bg-marketing-700"
              >
                Continue to Publishing
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
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(5)}>
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
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="bg-marketing-600 hover:bg-marketing-700">
              Save Edit Notes
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
    <Card className={content.published ? "border-marketing-200 bg-marketing-50/30" : ""}>
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
                <li key={idx}>{point}</li>
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
        <Button variant="outline" onClick={() => onEdit(content)}>
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
            className="bg-marketing-600 hover:bg-marketing-700"
          >
            Publish
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ContentStep;
