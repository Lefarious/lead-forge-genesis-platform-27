
import React from 'react';
import { useMarketingTool } from '@/contexts/MarketingToolContext';
import { cn } from '@/lib/utils';

type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { currentStep } = useMarketingTool();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-gray-100">
      <header className="border-b bg-white shadow-sm py-4">
        <div className="container flex justify-between items-center">
          <div className="flex items-center">
            <div className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-marketing-600 to-marketing-800">
              MarketGen
            </div>
            <div className="hidden md:flex ml-10 gap-2">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={cn(
                    "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                    currentStep === index + 1 
                      ? "bg-marketing-100 text-marketing-700" 
                      : currentStep > index + 1 
                        ? "text-gray-700" 
                        : "text-gray-400"
                  )}
                >
                  {index + 1}. {step}
                </div>
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Your Marketing Research Tool
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-white border-t py-4">
        <div className="container text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} MarketGen. All rights reserved.
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
