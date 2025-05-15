
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LandingPage } from '@/contexts/MarketingToolContext';
import { Moon, Sun, Palette } from 'lucide-react';

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
    const baseClass = "flex items-center justify-center w-12 h-12 rounded-xl cursor-pointer transition-all duration-300";
    
    if (theme === 'light') {
      return `${baseClass} bg-white shadow-md ${formData.theme === 'light' ? "ring-2 ring-marketing-500 scale-110" : "ring-1 ring-gray-200"}`;
    }
    
    if (theme === 'dark') {
      return `${baseClass} bg-gray-900 shadow-md ${formData.theme === 'dark' ? "ring-2 ring-marketing-500 scale-110" : "ring-1 ring-gray-600"}`;
    }
    
    return `${baseClass} bg-marketing-600 shadow-md ${formData.theme === 'purple' ? "ring-2 ring-marketing-300 scale-110" : "ring-1 ring-marketing-500"}`;
  };

  return (
    <Card className="mb-6 overflow-hidden rounded-2xl shadow-lg border-0">
      <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Landing Page Customization</CardTitle>
        <CardDescription className="text-base">
          Customize the lead generation form that will gate your content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-base">Page Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            placeholder="Page title (appears in browser tab)"
            className="py-3 px-4 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="headline" className="text-base">Headline</Label>
          <Input
            id="headline"
            name="headline"
            value={formData.headline}
            onChange={onInputChange}
            placeholder="Main headline on landing page"
            className="py-3 px-4 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description" className="text-base">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onInputChange}
            placeholder="Brief description of the content offer"
            rows={3}
            className="py-3 px-4 rounded-xl resize-none"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ctaText" className="text-base">Call-to-Action Text</Label>
          <Input
            id="ctaText"
            name="ctaText"
            value={formData.ctaText}
            onChange={onInputChange}
            placeholder="Text for the submission button"
            className="py-3 px-4 rounded-xl"
          />
        </div>
        <div className="space-y-3">
          <Label className="text-base">Theme</Label>
          <div className="flex gap-4 items-center">
            <div 
              className={themeButtonClass('light')}
              onClick={() => onThemeChange('light')}
            >
              <Sun className="w-5 h-5 text-gray-800" />
            </div>
            <div 
              className={themeButtonClass('dark')}
              onClick={() => onThemeChange('dark')}
            >
              <Moon className="w-5 h-5 text-white" />
            </div>
            <div 
              className={themeButtonClass('purple')}
              onClick={() => onThemeChange('purple')}
            >
              <Palette className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LandingPageForm;
