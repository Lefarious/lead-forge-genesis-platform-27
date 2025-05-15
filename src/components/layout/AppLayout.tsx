
import React from 'react';
import { useMarketingTool } from '@/contexts/MarketingToolContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Layout, LayoutGrid, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { currentStep, setCurrentStep, business } = useMarketingTool();
  const { isDarkMode, toggleTheme } = useTheme();

  const canNavigateToStep = (stepIndex: number): boolean => {
    // Always allow navigation to current or previous steps
    if (stepIndex <= currentStep) return true;
    
    // Check dependencies for each step
    if (stepIndex > 1) {
      // Step 2 (ICP) requires business info to be filled out
      if (stepIndex >= 2 && (!business.name || !business.industry || !business.description)) {
        return false;
      }
    }
    
    // Only allow navigation to exactly one step ahead
    return stepIndex === currentStep + 1;
  };

  const handleStepClick = (stepIndex: number) => {
    if (canNavigateToStep(stepIndex)) {
      setCurrentStep(stepIndex);
    } else {
      // Show toast message indicating why navigation is blocked
      toast.error('Please complete the current step first');
    }
  };

  return (
    <div className={cn("min-h-screen flex flex-col w-full font-inter", 
      isDarkMode 
        ? "bg-gradient-to-br from-black to-gray-900" 
        : "bg-gradient-to-br from-slate-50 to-gray-100")}>
      <header className={cn("border-b py-3 w-full backdrop-blur-md sticky top-0 z-50", 
        isDarkMode 
          ? "bg-black/80 border-gray-800" 
          : "bg-white/80 border-gray-100")}>
        <div className="container flex justify-between items-center w-full max-w-full px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className={cn("font-bold text-2xl", 
              "text-gradient")}>
              Marketing AI
            </div>
            <div className="hidden md:flex ml-10 gap-2">
              {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isClickable = canNavigateToStep(stepNumber);
                
                return (
                  <button 
                    key={index}
                    onClick={() => handleStepClick(stepNumber)}
                    disabled={!isClickable}
                    title={!isClickable ? "Complete previous steps first" : step}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2",
                      isDarkMode
                        ? currentStep === stepNumber 
                          ? "bg-purple-900/50 text-purple-100 backdrop-blur-sm shadow-lg shadow-purple-900/20" 
                          : currentStep > stepNumber 
                            ? "text-gray-300 hover:bg-gray-800/50 hover:backdrop-blur-sm" 
                            : isClickable
                              ? "text-gray-400 hover:bg-gray-800/50 hover:backdrop-blur-sm"
                              : "text-gray-600 cursor-not-allowed opacity-60"
                        : currentStep === stepNumber 
                          ? "bg-marketing-100 text-marketing-700 shadow-lg shadow-purple-300/20" 
                          : currentStep > stepNumber 
                            ? "text-gray-700 hover:bg-marketing-50" 
                            : isClickable
                              ? "text-gray-600 hover:bg-marketing-50"
                              : "text-gray-400 cursor-not-allowed opacity-60"
                    )}
                  >
                    <span className={cn(
                      "flex items-center justify-center w-5 h-5 rounded-lg text-xs",
                      currentStep === stepNumber
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    )}>
                      {stepNumber}
                    </span>
                    <span>{step}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => toast.info('Layout toggled!')}
              className={cn("rounded-xl transition-all duration-300",
                isDarkMode ? "hover:bg-white/10" : "hover:bg-black/5")}
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>

            <Button 
              variant="outline" 
              size="icon"
              onClick={toggleTheme}
              className={cn("rounded-xl transition-all duration-300",
                isDarkMode ? "hover:bg-white/10" : "hover:bg-black/5")}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 w-full">
        {children}
      </main>
      
      <footer className={cn("border-t py-6 w-full", 
        isDarkMode ? "bg-black border-gray-800" : "bg-white border-gray-100")}>
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-left">
              <h3 className="font-semibold text-lg mb-3 text-gradient">Marketing AI</h3>
              <p className={cn("text-sm", 
                isDarkMode ? "text-gray-400" : "text-gray-600")}>
                Elevating your marketing strategy with artificial intelligence.
              </p>
            </div>
            <div className="text-left md:text-center">
              <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
              <div className="flex flex-col gap-2">
                {steps.slice(0, 4).map((step, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleStepClick(i + 1)}
                    className={cn("text-sm hover:text-purple-500 transition-colors",
                      isDarkMode ? "text-gray-400" : "text-gray-600")}
                  >
                    {step}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-left md:text-right">
              <h3 className="font-semibold text-lg mb-3">Resources</h3>
              <div className="flex flex-col gap-2">
                <a href="#" className={cn("text-sm hover:text-purple-500 transition-colors",
                  isDarkMode ? "text-gray-400" : "text-gray-600")}>
                  Documentation
                </a>
                <a href="#" className={cn("text-sm hover:text-purple-500 transition-colors",
                  isDarkMode ? "text-gray-400" : "text-gray-600")}>
                  Templates
                </a>
                <a href="#" className={cn("text-sm hover:text-purple-500 transition-colors",
                  isDarkMode ? "text-gray-400" : "text-gray-600")}>
                  Support
                </a>
              </div>
            </div>
          </div>
          <div className={cn("mt-8 pt-6 border-t text-center text-sm", 
            isDarkMode ? "text-gray-400 border-gray-800" : "text-gray-500 border-gray-100")}>
            &copy; {new Date().getFullYear()} Marketing AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

const steps = [
  "Business Info",
  "ICPs",
  "USPs",
  "Geographies",
  "Keywords",
  "Content",
  "Publishing",
];

export default AppLayout;
