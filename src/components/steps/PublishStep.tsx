
import React, { useState } from 'react';
import { useMarketingTool } from '@/contexts/MarketingToolContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LandingPage } from '@/contexts/MarketingToolContext';
import LandingPagePreview from '@/components/publish/LandingPagePreview';
import LandingPageForm from '@/components/publish/LandingPageForm';
import PublishedContentList from '@/components/publish/PublishedContentList';
import { ArrowRight, Download } from 'lucide-react';

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

  const handleExportData = () => {
    try {
      const marketingToolData = {
        business,
        contentIdeas,
        landingPage,
        // Including all other data
        date: new Date().toISOString(),
      };
      
      // Create a Blob containing the JSON data
      const blob = new Blob([JSON.stringify(marketingToolData, null, 2)], { type: 'application/json' });
      
      // Create a download link and trigger the download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${business.name || 'marketing'}_toolkit_data.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Marketing toolkit data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export marketing toolkit data');
    }
  };

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-2">Publishing & Lead Generation</h1>
      <p className="text-center text-gray-600 mb-8">
        Customize your landing page and share your content to generate leads
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <LandingPageForm 
            formData={formData}
            onInputChange={handleInputChange}
            onThemeChange={handleThemeChange}
          />
          <PublishedContentList publishedContent={publishedContent} />
        </div>
        
        <div>
          <div className="mb-4">
            <Tabs 
              value={previewTab} 
              onValueChange={(val: string) => setPreviewTab(val as 'desktop' | 'mobile')}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Landing Page Preview</h2>
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
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleExportData}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button 
            onClick={() => toast.success('All done! Your marketing toolkit is ready to use.')} 
            className="bg-marketing-600 hover:bg-marketing-700 transition-all duration-300 flex items-center gap-2 group"
          >
            Finish
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublishStep;
