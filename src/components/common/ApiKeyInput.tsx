
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Key } from 'lucide-react';

const ApiKeyInput: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [hasStoredKey, setHasStoredKey] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    setHasStoredKey(!!storedKey);
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    localStorage.setItem('openai_api_key', apiKey);
    setHasStoredKey(true);
    setIsOpen(false);
    toast.success('API key saved successfully!');
  };

  const handleRemove = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setHasStoredKey(false);
    toast.success('API key removed');
  };

  return (
    <>
      <Button 
        variant={hasStoredKey ? "outline" : "default"}
        size="sm"
        className={hasStoredKey ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800" : ""}
        onClick={() => setIsOpen(true)}
      >
        <Key className="h-4 w-4 mr-2" />
        {hasStoredKey ? "API Key Set" : "Set API Key"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>OpenAI API Key</DialogTitle>
            <DialogDescription>
              Your API key is stored locally in your browser and never sent to our servers.
              You'll need an OpenAI API key to generate marketing content.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="apiKey">OpenAI API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <div className="flex justify-between w-full">
              {hasStoredKey && (
                <Button variant="outline" onClick={handleRemove} className="text-red-500 hover:text-red-600">
                  Remove Key
                </Button>
              )}
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Key
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApiKeyInput;
