
import React from 'react';
import { LandingPage } from '@/contexts/MarketingToolContext';

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

export default LandingPagePreview;
