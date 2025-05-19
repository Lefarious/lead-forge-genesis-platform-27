import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ICP } from '@/contexts/MarketingToolContext';
import { toast } from '@/components/ui/use-toast';

interface AddUSPDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  icps: ICP[];
  onAddUSP: (newUSP: {
    title: string;
    description: string;
    targetICP: string;
    valueProposition: string;
  }) => void;
}

const AddUSPDialog: React.FC<AddUSPDialogProps> = ({ isOpen, onOpenChange, icps, onAddUSP }) => {
  const [newUSP, setNewUSP] = useState<{
    title: string;
    description: string;
    targetICP: string;
    valueProposition: string;
  }>({
    title: '',
    description: '',
    targetICP: icps.length > 0 ? icps[0].title : '',
    valueProposition: ''
  });

  const handleAddCustomUSP = () => {
    if (!newUSP.title || !newUSP.description || !newUSP.targetICP || !newUSP.valueProposition) {
      toast.error("Please fill all fields");
      return;
    }

    onAddUSP(newUSP);
    onOpenChange(false);
    setNewUSP({
      title: '',
      description: '',
      targetICP: icps.length > 0 ? icps[0].title : '',
      valueProposition: ''
    });
    toast.success("Custom USP added successfully");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add Custom Unique Selling Point</DialogTitle>
          <DialogDescription>
            Create a custom USP for your marketing strategy.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={newUSP.title}
              onChange={(e) => setNewUSP({ ...newUSP, title: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="targetICP" className="text-right">
              Target ICP
            </Label>
            <select
              id="targetICP"
              value={newUSP.targetICP}
              onChange={(e) => setNewUSP({ ...newUSP, targetICP: e.target.value })}
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {icps.map((icp) => (
                <option key={icp.id} value={icp.title}>{icp.title}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={newUSP.description}
              onChange={(e) => setNewUSP({ ...newUSP, description: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="valueProposition" className="text-right">
              Value Proposition
            </Label>
            <Textarea
              id="valueProposition"
              value={newUSP.valueProposition}
              onChange={(e) => setNewUSP({ ...newUSP, valueProposition: e.target.value })}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddCustomUSP}
            className="bg-marketing-600 hover:bg-marketing-700 transition-colors"
          >
            Add USP
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUSPDialog;
