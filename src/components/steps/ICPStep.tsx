
import React, { useState } from 'react';
import { useMarketingTool } from '@/contexts/MarketingToolContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Plus, Edit, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ICP } from '@/contexts/MarketingToolContext';

const mockGenerate = (business: any): Promise<ICP[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          title: 'Enterprise IT Decision Makers',
          description: 'Senior IT professionals in large companies who make technology purchasing decisions.',
          demographics: 'Age 35-55, Technical background, 10+ years in IT, Budget authority > $100k',
          painPoints: ['Legacy system integration challenges', 'Security concerns', 'Budget constraints'],
          goals: ['Improve operational efficiency', 'Reduce IT maintenance costs', 'Enhance security posture'],
        },
        {
          id: '2',
          title: 'Mid-Market Operations Managers',
          description: 'Operations leaders in medium-sized businesses looking to optimize processes.',
          demographics: 'Age 30-45, Operations background, 5+ years management experience',
          painPoints: ['Manual processes causing bottlenecks', 'Lack of visibility into operations', 'Growing too fast for current systems'],
          goals: ['Automate routine tasks', 'Get better reporting and analytics', 'Scale operations without adding headcount'],
        },
        {
          id: '3',
          title: 'Startup Founders',
          description: 'Founders of early-stage companies looking to establish efficient systems from the start.',
          demographics: 'Age 25-40, Entrepreneurial, Tech-savvy, Limited budget',
          painPoints: ['Limited resources', 'Need for rapid scaling', 'Competing priorities'],
          goals: ['Get to market quickly', 'Establish efficient processes early', 'Maximize limited resources'],
        },
      ]);
    }, 2000);
  });
};

const ICPStep: React.FC = () => {
  const { business, icps, setICPs, addCustomICP, setCurrentStep, isGenerating, setIsGenerating } = useMarketingTool();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingICP, setEditingICP] = useState<ICP | null>(null);
  const [formData, setFormData] = useState<Omit<ICP, 'id'>>({
    title: '',
    description: '',
    demographics: '',
    painPoints: [''],
    goals: [''],
  });

  const handleGenerateICPs = async () => {
    setIsGenerating(true);
    try {
      const generatedICPs = await mockGenerate(business);
      setICPs(generatedICPs);
      toast.success('Ideal Customer Profiles generated!');
    } catch (error) {
      toast.error('Failed to generate ICPs');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (field: 'painPoints' | 'goals', index: number, value: string) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: 'painPoints' | 'goals') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (field: 'painPoints' | 'goals', index: number) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      toast.error('Please provide at least a title and description');
      return;
    }

    // Filter out empty array items
    const cleanedFormData = {
      ...formData,
      painPoints: formData.painPoints.filter(item => item.trim() !== ''),
      goals: formData.goals.filter(item => item.trim() !== ''),
    };

    if (editingICP) {
      // Create a new array instead of using a function updater
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

    setFormData({
      title: '',
      description: '',
      demographics: '',
      painPoints: [''],
      goals: [''],
    });
    setEditingICP(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (icp: ICP) => {
    setEditingICP(icp);
    setFormData({
      title: icp.title,
      description: icp.description,
      demographics: icp.demographics,
      painPoints: icp.painPoints.length ? icp.painPoints : [''],
      goals: icp.goals.length ? icp.goals : [''],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    // Create a new array instead of using a function updater
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
          <CardFooter className="flex justify-between">
            <Button 
              onClick={() => setCurrentStep(1)} 
              variant="outline"
            >
              Back to Business Info
            </Button>
            <Button 
              onClick={handleGenerateICPs} 
              className="bg-marketing-600 hover:bg-marketing-700"
              disabled={isGenerating}
            >
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate ICPs
            </Button>
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
                  <div>
                    <h4 className="font-medium text-sm mb-1">Demographics:</h4>
                    <p className="text-sm text-gray-600">{icp.demographics}</p>
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
                </CardContent>
              </Card>
            ))}
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Card className="border-dashed border-2 border-gray-300 hover:border-marketing-400 cursor-pointer flex flex-col items-center justify-center min-h-[200px]">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Plus className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium">Add Custom ICP</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editingICP ? 'Edit ICP' : 'Add Custom ICP'}</DialogTitle>
                </DialogHeader>
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
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => {
                    setIsDialogOpen(false);
                    setEditingICP(null);
                    setFormData({
                      title: '',
                      description: '',
                      demographics: '',
                      painPoints: [''],
                      goals: [''],
                    });
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} className="bg-marketing-600 hover:bg-marketing-700">
                    {editingICP ? 'Update ICP' : 'Add ICP'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              Back
            </Button>
            <Button 
              onClick={handleContinue} 
              className="bg-marketing-600 hover:bg-marketing-700"
            >
              Continue to USPs
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ICPStep;
