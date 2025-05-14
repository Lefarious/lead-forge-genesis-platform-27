import React, { useState } from 'react';
import { useMarketingTool } from '@/contexts/MarketingToolContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy } from 'lucide-react';
import { ContentIdea, LandingPage } from '@/contexts/MarketingToolContext';

const PublishStep: React.FC = () => {
  const { 
    contentIdeas, landingPage, updateLandingPage, 
    setCurrentStep, business
  } = useMarketingTool();
  const [formData, setFormData] = useState<LandingPage>(landingPage);
  const [previewTab, setPreviewTab] = useState<'desktop' | 'mobile'>('desktop');
  
  const publishedContent = contentIdeas.filter(content => content.published);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    updateLandingPage({ [name]: value });
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'purple') => {
    setFormData(prev => ({ ...prev, theme }));
    updateLandingPage({ theme });
  };

  const copyShareLink = (content: ContentIdea) => {
    navigator.clipboard.writeText(content.publishLink || '');
    toast.success('Share link copied to clipboard!');
  };

  const themeButtonClass = (theme: string) => {
    const baseClass = "w-8 h-8 rounded-full cursor-pointer transition-all border-2";
    
    if (theme === 'light') {
      return `${baseClass} bg-white ${formData.theme === 'light' ? "border-marketing-500 scale-110" : "border-gray-200"}`;
    }
    
    if (theme === 'dark') {
      return `${baseClass} bg-gray-900 ${formData.theme === 'dark' ? "border-marketing-500 scale-110" : "border-gray-600"}`;
    }
    
    return `${baseClass} bg-marketing-600 ${formData.theme === 'purple' ? "border-marketing-300 scale-110" : "border-marketing-500"}`;
  };

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-2">Publishing & Lead Generation</h1>
      <p className="text-center text-gray-600 mb-8">
        Customize your landing page and share your content to generate leads
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Landing Page Customization</CardTitle>
              <CardDescription>
                Customize the lead generation form that will gate your content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Page title (appears in browser tab)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  name="headline"
                  value={formData.headline}
                  onChange={handleInputChange}
                  placeholder="Main headline on landing page"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the content offer"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ctaText">Call-to-Action Text</Label>
                <Input
                  id="ctaText"
                  name="ctaText"
                  value={formData.ctaText}
                  onChange={handleInputChange}
                  placeholder="Text for the submission button"
                />
              </div>
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex gap-3 items-center">
                  <div 
                    className={themeButtonClass('light')}
                    onClick={() => handleThemeChange('light')}
                  ></div>
                  <div 
                    className={themeButtonClass('dark')}
                    onClick={() => handleThemeChange('dark')}
                  ></div>
                  <div 
                    className={themeButtonClass('purple')}
                    onClick={() => handleThemeChange('purple')}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Published Content</CardTitle>
              <CardDescription>
                Share links to your published content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {publishedContent.length === 0 ? (
                <p className="text-gray-600 text-center py-4">
                  No content published yet. Go back to the Content step to publish content.
                </p>
              ) : (
                <div className="space-y-4">
                  {publishedContent.map((content) => (
                    <div 
                      key={content.id} 
                      className="flex justify-between items-center border p-3 rounded-md hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium">{content.title}</p>
                        <p className="text-sm text-gray-600">{content.type}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyShareLink(content)}
                        className="flex items-center gap-1"
                      >
                        <Copy className="h-4 w-4" />
                        Copy Link
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <div className="mb-4">
            <Tabs 
              value={previewTab} 
              onValueChange={(val: string) => setPreviewTab(val as 'desktop' | 'mobile')}
            >
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Landing Page Preview</CardTitle>
                <TabsList>
                  <TabsTrigger value="desktop">Desktop</TabsTrigger>
                  <TabsTrigger value="mobile">Mobile</TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </div>
          
          <div className={`border rounded-md overflow-hidden ${previewTab === 'mobile' ? 'max-w-[375px] mx-auto' : ''}`}>
            <LandingPagePreview landingPage={formData} previewMode={previewTab} />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => setCurrentStep(6)}>
          Back
        </Button>
        <Button 
          onClick={() => toast.success('All done! Your marketing toolkit is ready to use.')} 
          className="bg-marketing-600 hover:bg-marketing-700"
        >
          Finish
        </Button>
      </div>
    </div>
  );
};

interface LandingPagePreviewProps {
  landingPage: LandingPage;
  previewMode: 'desktop' | 'mobile';
}

const LandingPagePreview: React.FC<LandingPagePreviewProps> = ({ landingPage, previewMode }) => {
  const { theme, headline, description, ctaText, businessName } = landingPage;
  
  const getThemeClasses = () => {
    if (theme === 'dark') {
      return 'bg-gray-900 text-white';
    }
    if (theme === 'purple') {
      return 'bg-gradient-to-br from-marketing-700 to-marketing-900 text-white';
    }
    return 'bg-white text-gray-900';
  };
  
  const getInputClasses = () => {
    if (theme === 'dark') {
      return 'bg-gray-800 border-gray-700 text-white';
    }
    if (theme === 'purple') {
      return 'bg-marketing-800/30 border-marketing-500 text-white';
    }
    return 'bg-white border-gray-300 text-gray-900';
  };

  const getButtonClasses = () => {
    if (theme === 'dark') {
      return 'bg-white text-gray-900 hover:bg-gray-100';
    }
    if (theme === 'purple') {
      return 'bg-white text-marketing-800 hover:bg-gray-100';
    }
    return 'bg-marketing-600 text-white hover:bg-marketing-700';
  };
  
  return (
    <div className={`min-h-[600px] ${getThemeClasses()}`}>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="font-bold text-xl mb-2">
            {businessName || 'Your Company'}
          </div>
        </div>
        
        {/* Main content */}
        <div className={`max-w-md mx-auto ${previewMode === 'mobile' ? 'px-4' : 'px-0'}`}>
          <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-center">
            {headline || 'Download Our Exclusive Content'}
          </h1>
          
          <p className="text-center mb-8 opacity-80">
            {description || 'Fill out the form below to access valuable insights for your business.'}
          </p>
          
          <div className={`bg-opacity-10 rounded-lg p-6 ${theme === 'light' ? 'bg-gray-100' : 'bg-white'}`}>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme !== 'light' ? 'text-white' : ''}`}>
                  Full Name
                </label>
                <input 
                  type="text" 
                  placeholder="John Smith" 
                  className={`w-full px-3 py-2 rounded-md border ${getInputClasses()}`}
                  disabled
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme !== 'light' ? 'text-white' : ''}`}>
                  Email Address
                </label>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  className={`w-full px-3 py-2 rounded-md border ${getInputClasses()}`}
                  disabled
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme !== 'light' ? 'text-white' : ''}`}>
                  Company
                </label>
                <input 
                  type="text" 
                  placeholder="Acme Inc." 
                  className={`w-full px-3 py-2 rounded-md border ${getInputClasses()}`}
                  disabled
                />
              </div>
              
              <button 
                className={`w-full mt-2 py-2 px-4 rounded-md font-medium ${getButtonClasses()}`}
                disabled
              >
                {ctaText || 'Download Now'}
              </button>
              
              <p className={`text-xs text-center mt-4 ${theme !== 'light' ? 'text-white/70' : 'text-gray-500'}`}>
                By submitting, you agree to our privacy policy and terms of service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishStep;
