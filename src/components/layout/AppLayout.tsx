
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
    <div className={cn("min-h-screen flex flex-col", isDarkMode ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-slate-50 to-gray-100")}>
      <header className={cn("border-b shadow-sm py-4", isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white")}>
        <div className="container flex justify-between items-center">
          <div className="flex items-center">
            <div className={cn("font-bold text-2xl bg-clip-text text-transparent", 
              isDarkMode ? "bg-gradient-to-r from-purple-400 to-pink-400" : "bg-gradient-to-r from-marketing-600 to-marketing-800")}>
              Quantum Forge
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
                          ? "bg-purple-900 text-purple-100" 
                          : currentStep > stepNumber 
                            ? "text-gray-300 hover:bg-gray-800" 
                            : isClickable
                              ? "text-gray-400 hover:bg-gray-800"
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
            className="rounded-full"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className={cn("border-t py-4", isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white")}>
        <div className={cn("container text-center text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
          &copy; {new Date().getFullYear()} Quantum Forge. All rights reserved.
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
