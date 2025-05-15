
import React from 'react';
import { useMarketingTool } from '@/contexts/MarketingToolContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
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
    <div className={cn("min-h-screen flex flex-col w-full", 
      isDarkMode ? "bg-gradient-to-br from-black to-gray-900" : "bg-gradient-to-br from-slate-50 to-gray-100")}>
      <header className={cn("border-b py-4 w-full", 
        isDarkMode ? "bg-black border-gray-800" : "bg-white border-gray-100")}>
        <div className="container flex justify-between items-center w-full max-w-full px-4 md:px-6 lg:px-8">
          <div className="flex items-center">
            <div className={cn("font-bold text-2xl bg-clip-text text-transparent", 
              "bg-gradient-to-r from-purple-400 to-purple-600")}>
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
                      "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                      isDarkMode
                        ? currentStep === stepNumber 
                          ? "bg-purple-900/50 text-purple-100 backdrop-blur-sm" 
                          : currentStep > stepNumber 
                            ? "text-gray-300 hover:bg-gray-800/50 hover:backdrop-blur-sm" 
                            : isClickable
                              ? "text-gray-400 hover:bg-gray-800/50 hover:backdrop-blur-sm"
                              : "text-gray-600 cursor-not-allowed opacity-60"
                        : currentStep === stepNumber 
                          ? "bg-marketing-100 text-marketing-700" 
                          : currentStep > stepNumber 
                            ? "text-gray-700 hover:bg-marketing-50" 
                            : isClickable
                              ? "text-gray-600 hover:bg-marketing-50"
                              : "text-gray-400 cursor-not-allowed opacity-60"
                    )}
                  >
                    {stepNumber}. {step}
                  </button>
                );
              })}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme}
            className={cn("rounded-full transition-all duration-300",
              isDarkMode ? "hover:bg-white/10" : "hover:bg-black/5")}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>
      <main className="flex-1 w-full">
        {children}
      </main>
      <footer className={cn("border-t py-4 w-full", 
        isDarkMode ? "bg-black border-gray-800" : "bg-white border-gray-100")}>
        <div className={cn("container text-center text-sm w-full max-w-full px-4", 
          isDarkMode ? "text-gray-400" : "text-gray-500")}>
          &copy; {new Date().getFullYear()} Marketing AI. All rights reserved.
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
