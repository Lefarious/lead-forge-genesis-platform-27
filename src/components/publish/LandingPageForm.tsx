
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LandingPage } from '@/contexts/MarketingToolContext';

interface LandingPageFormProps {
  formData: LandingPage;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onThemeChange: (theme: 'light' | 'dark' | 'purple') => void;
}

const LandingPageForm: React.FC<LandingPageFormProps> = ({ 
  formData, 
  onInputChange, 
  onThemeChange 
}) => {
  
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
            onChange={onInputChange}
            placeholder="Page title (appears in browser tab)"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="headline">Headline</Label>
          <Input
            id="headline"
            name="headline"
            value={formData.headline}
            onChange={onInputChange}
            placeholder="Main headline on landing page"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onInputChange}
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
            onChange={onInputChange}
            placeholder="Text for the submission button"
          />
        </div>
        <div className="space-y-2">
          <Label>Theme</Label>
          <div className="flex gap-3 items-center">
            <div 
              className={themeButtonClass('light')}
              onClick={() => onThemeChange('light')}
            ></div>
            <div 
              className={themeButtonClass('dark')}
              onClick={() => onThemeChange('dark')}
            ></div>
            <div 
              className={themeButtonClass('purple')}
              onClick={() => onThemeChange('purple')}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LandingPageForm;
