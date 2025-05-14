
import React, { useState } from 'react';
import { useMarketingTool } from '@/contexts/MarketingToolContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const BusinessInfoStep: React.FC = () => {
  const { business, setBusinessInfo, setCurrentStep } = useMarketingTool();
  const [formData, setFormData] = useState({
    name: business.name,
    industry: business.industry,
    description: business.description,
    mainProblem: business.mainProblem,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.industry || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setBusinessInfo(formData);
    setCurrentStep(2);
    toast.success('Business information saved!');
  };

  return (
    <div className="container py-8 max-w-3xl animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-8">Tell us about your business</h1>
      <p className="text-center text-gray-600 mb-8">
        We'll use this information to generate targeted marketing research
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>Business Details</CardTitle>
          <CardDescription>
            Provide details about your business to help us understand your needs
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Acme Corp"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Input
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  placeholder="Technology, Healthcare, etc."
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Business Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what your business does..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mainProblem">Main Problem You Solve</Label>
              <Textarea
                id="mainProblem"
                name="mainProblem"
                value={formData.mainProblem}
                onChange={handleInputChange}
                placeholder="What problem does your business solve?"
                rows={2}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="bg-marketing-600 hover:bg-marketing-700">Continue</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default BusinessInfoStep;
