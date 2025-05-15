
import React, { useState } from 'react';
import { useMarketingTool } from '@/contexts/MarketingToolContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Plus, Edit, Trash, RefreshCw, List, Lightbulb } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { ICP } from '@/contexts/MarketingToolContext';
import { generateICPs, validateCustomICP } from '@/utils/llmUtils';
import ApiKeyInput from '@/components/common/ApiKeyInput';
import { formatDemographics } from '@/lib/utils';
import { DemographicsDisplay } from '@/components/common/DemographicsDisplay';
import { BlueOceanScore } from '@/components/common/BlueOceanScore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ICPStepProps {}

const ICPStep: React.FC<ICPStepProps> = () => {
  const { business, icps, setICPs, addCustomICP, setCurrentStep, isGenerating, setIsGenerating } = useMarketingTool();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingICP, setEditingICP] = useState<ICP | null>(null);
  const [validating, setValidating] = useState(false);
  const [validationFeedback, setValidationFeedback] = useState<{isValid: boolean, feedback: string} | null>(null);
  const [formData, setFormData] = useState<Omit<ICP, 'id'>>({
    title: '',
    description: '',
    demographics: '',
    blueOceanScore: 5,
    reachMethods: [''],
    productSuggestions: [''],
    painPoints: [''],
    goals: [''],
  });

  const handleGenerateICPs = async () => {
    if (!localStorage.getItem('openai_api_key')) {
      toast.error('Please set your OpenAI API key first');
      return;
    }

    setIsGenerating(true);
    try {
      const generatedICPs = await generateICPs(business);
      setICPs(generatedICPs);
      toast.success('Ideal Customer Profiles generated!');
    } catch (error) {
      toast.error('Failed to generate ICPs');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMoreICPs = async () => {
    if (!localStorage.getItem('openai_api_key')) {
      toast.error('Please set your OpenAI API key first');
      return;
    }

    setIsGenerating(true);
    try {
      const moreICPs = await generateICPs(business, icps);
      setICPs([...icps, ...moreICPs]);
      toast.success('Additional ICPs generated!');
    } catch (error) {
      toast.error('Failed to generate additional ICPs');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (field: 'painPoints' | 'goals' | 'reachMethods' | 'productSuggestions', index: number, value: string) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: 'painPoints' | 'goals' | 'reachMethods' | 'productSuggestions') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (field: 'painPoints' | 'goals' | 'reachMethods' | 'productSuggestions', index: number) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  const validateICP = async () => {
    if (!localStorage.getItem('openai_api_key')) {
      toast.error('Please set your OpenAI API key first');
      return;
    }
    
    setValidating(true);
    setValidationFeedback(null);
    
    try {
      const result = await validateCustomICP(formData, business);
      setValidationFeedback(result);
      
      if (result.isValid) {
        toast.success('ICP validation passed!');
      } else {
        toast.error('ICP validation failed. See feedback.');
      }
    } catch (error) {
      console.error('Validation error:', error);
      toast.error('Failed to validate ICP');
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      toast.error('Please provide at least a title and description');
      return;
    }

    // Ensure demographics isn't blank
    if (!formData.demographics || formData.demographics.trim() === '') {
      setFormData(prev => ({
        ...prev,
        demographics: JSON.stringify({
          companySize: "Various sizes",
          industries: [business.industry || "Multiple industries"],
          regions: ["Global"],
          jobTitles: ["Decision makers"],
          technologyAdoption: "Mixed"
        })
      }));
    }

    // Filter out empty array items
    const cleanedFormData = {
      ...formData,
      painPoints: formData.painPoints.filter(item => item.trim() !== ''),
      goals: formData.goals.filter(item => item.trim() !== ''),
      reachMethods: formData.reachMethods.filter(item => item.trim() !== ''),
      productSuggestions: formData.productSuggestions.filter(item => item.trim() !== '')
    };

    if (editingICP) {
      const updatedICPs = icps.map(icp => 
        icp.id === editingICP.id ? { ...cleanedFormData, id: editingICP.id } : icp
      );
      setICPs(updatedICPs);
      toast.success('ICP updated successfully!');
    } else {
      addCustomICP({
        ...cleanedFormData,
        id: `custom-${Date.now()}`,
      });
      toast.success('Custom ICP added!');
    }

    resetForm();
    setValidationFeedback(null);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      demographics: '',
      blueOceanScore: 5,
      reachMethods: [''],
      productSuggestions: [''],
      painPoints: [''],
      goals: [''],
    });
    setEditingICP(null);
    setIsDialogOpen(false);
    setValidationFeedback(null);
  };

  const handleEdit = (icp: ICP) => {
    setEditingICP(icp);
    setFormData({
      title: icp.title,
      description: icp.description,
      demographics: icp.demographics,
      blueOceanScore: icp.blueOceanScore || 5,
      reachMethods: icp.reachMethods?.length ? icp.reachMethods : [''],
      productSuggestions: icp.productSuggestions?.length ? icp.productSuggestions : [''],
      painPoints: icp.painPoints.length ? icp.painPoints : [''],
      goals: icp.goals.length ? icp.goals : [''],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const filteredICPs = icps.filter(icp => icp.id !== id);
    setICPs(filteredICPs);
    toast.success('ICP removed');
  };

  const handleContinue = () => {
    if (icps.length === 0) {
      toast.error('Please generate or add at least one ICP');
      return;
    }
    setCurrentStep(3);
  };

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-2">Ideal Customer Profiles (ICPs)</h1>
      <p className="text-center text-gray-600 mb-8">
        Generate and customize profiles of your ideal customers
      </p>

      {icps.length === 0 ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Generate ICPs</CardTitle>
            <CardDescription>
              We'll analyze your business information to identify ideal customer profiles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Our AI will generate suggested ICPs based on your business details. You can customize these later.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Button 
              onClick={() => setCurrentStep(1)} 
              variant="outline"
            >
              Back to Business Info
            </Button>
            <div className="flex items-center gap-2">
              <ApiKeyInput />
              <Button 
                onClick={handleGenerateICPs} 
                className="bg-marketing-600 hover:bg-marketing-700"
                disabled={isGenerating}
              >
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate ICPs
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {icps.map((icp) => (
              <Card key={icp.id} className={icp.isCustomAdded ? "border-marketing-300" : ""}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{icp.title}</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(icp)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(icp.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{icp.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {icp.blueOceanScore !== undefined && (
                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-1">Market Competition:</h4>
                      <BlueOceanScore score={icp.blueOceanScore} />
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-sm mb-1">Demographics:</h4>
                    <div className="text-sm text-gray-600">
                      {typeof icp.demographics === 'string' ? (
                        (() => {
                          const formattedData = formatDemographics(icp.demographics);
                          return typeof formattedData === 'string' ? (
                            formattedData
                          ) : (
                            <DemographicsDisplay data={formattedData} />
                          );
                        })()
                      ) : (
                        'No demographics data'
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Pain Points:</h4>
                    <ul className="text-sm text-gray-600 pl-5 list-disc">
                      {icp.painPoints.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Goals:</h4>
                    <ul className="text-sm text-gray-600 pl-5 list-disc">
                      {icp.goals.map((goal, idx) => (
                        <li key={idx}>{goal}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {icp.reachMethods && icp.reachMethods.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-1 flex items-center gap-1">
                        <List className="h-4 w-4" /> 
                        How to Reach:
                      </h4>
                      <ul className="text-sm text-gray-600 pl-5 list-disc">
                        {icp.reachMethods.map((method, idx) => (
                          <li key={idx}>{method}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {icp.productSuggestions && icp.productSuggestions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-1 flex items-center gap-1">
                        <Lightbulb className="h-4 w-4" /> 
                        Product Recommendations:
                      </h4>
                      <ul className="text-sm text-gray-600 pl-5 list-disc">
                        {icp.productSuggestions.map((suggestion, idx) => (
                          <li key={idx}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            <Button 
              variant="outline"
              className="border-dashed border-2 border-gray-300 hover:border-marketing-400 flex flex-col items-center justify-center min-h-[200px] p-6"
              onClick={handleGenerateMoreICPs}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-12 w-12 text-gray-400 mb-4 animate-spin" />
              ) : (
                <RefreshCw className="h-12 w-12 text-gray-400 mb-4" />
              )}
              <p className="text-gray-600 font-medium">Generate More ICPs</p>
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Card className="border-dashed border-2 border-gray-300 hover:border-marketing-400 cursor-pointer flex flex-col items-center justify-center min-h-[200px]">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Plus className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium">Add Custom ICP</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingICP ? 'Edit ICP' : 'Add Custom ICP'}</DialogTitle>
                </DialogHeader>
                
                {validationFeedback && !validationFeedback.isValid && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Validation Warning</AlertTitle>
                    <AlertDescription className="text-sm">
                      {validationFeedback.feedback}
                    </AlertDescription>
                  </Alert>
                )}
                
                {validationFeedback && validationFeedback.isValid && (
                  <Alert className="mb-4 border-green-200 bg-green-50">
                    <AlertTitle>Validation Passed</AlertTitle>
                    <AlertDescription className="text-sm">
                      {validationFeedback.feedback}
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">ICP Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Enterprise IT Decision Makers"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Brief description of this customer profile"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="demographics">Demographics</Label>
                    <Textarea
                      id="demographics"
                      name="demographics"
                      value={formData.demographics}
                      onChange={handleInputChange}
                      placeholder="Age range, job titles, industry, etc."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blueOceanScore">Competition Level (Red Ocean to Blue Ocean)</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-500">High Competition</span>
                      <input
                        type="range"
                        id="blueOceanScore"
                        name="blueOceanScore"
                        min="1"
                        max="10"
                        value={formData.blueOceanScore}
                        onChange={(e) => setFormData(prev => ({ ...prev, blueOceanScore: parseInt(e.target.value) }))}
                        className="flex-1"
                      />
                      <span className="text-xs text-blue-500">Low Competition</span>
                      <span className="text-sm font-medium ml-2">{formData.blueOceanScore}/10</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Pain Points</Label>
                    {formData.painPoints.map((point, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={point}
                          onChange={(e) => handleArrayInputChange('painPoints', index, e.target.value)}
                          placeholder="e.g., Limited budget"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          type="button"
                          onClick={() => removeArrayItem('painPoints', index)}
                          disabled={formData.painPoints.length <= 1}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      type="button"
                      onClick={() => addArrayItem('painPoints')}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Pain Point
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Goals</Label>
                    {formData.goals.map((goal, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={goal}
                          onChange={(e) => handleArrayInputChange('goals', index, e.target.value)}
                          placeholder="e.g., Increase efficiency"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          type="button"
                          onClick={() => removeArrayItem('goals', index)}
                          disabled={formData.goals.length <= 1}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      type="button"
                      onClick={() => addArrayItem('goals')}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Goal
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>How to Reach This ICP</Label>
                    {formData.reachMethods.map((method, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={method}
                          onChange={(e) => handleArrayInputChange('reachMethods', index, e.target.value)}
                          placeholder="e.g., LinkedIn advertising"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          type="button"
                          onClick={() => removeArrayItem('reachMethods', index)}
                          disabled={formData.reachMethods.length <= 1}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      type="button"
                      onClick={() => addArrayItem('reachMethods')}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Reach Method
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Product Recommendations</Label>
                    {formData.productSuggestions.map((suggestion, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={suggestion}
                          onChange={(e) => handleArrayInputChange('productSuggestions', index, e.target.value)}
                          placeholder="e.g., Add mobile support"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          type="button"
                          onClick={() => removeArrayItem('productSuggestions', index)}
                          disabled={formData.productSuggestions.length <= 1}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      type="button"
                      onClick={() => addArrayItem('productSuggestions')}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Product Recommendation
                    </Button>
                  </div>
                </div>
                <DialogFooter>
                  <div className="flex flex-col sm:flex-row gap-2 w-full justify-between sm:justify-end">
                    <Button 
                      variant="outline" 
                      onClick={validateICP}
                      className="flex-1 sm:flex-none"
                      disabled={validating || !formData.title || !formData.description}
                    >
                      {validating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Validate ICP
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSubmit} 
                        className="bg-marketing-600 hover:bg-marketing-700"
                        disabled={validationFeedback && !validationFeedback.isValid}
                      >
                        {editingICP ? 'Update ICP' : 'Add ICP'}
                      </Button>
                    </div>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              Back
            </Button>
            <div className="flex items-center gap-2">
              <ApiKeyInput />
              <Button 
                onClick={handleContinue} 
                className="bg-marketing-600 hover:bg-marketing-700"
              >
                Continue to USPs
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ICPStep;
