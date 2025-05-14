
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
  const [isValidating, setIsValidating] = useState(false);
  const [hasStoredKey, setHasStoredKey] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    setHasStoredKey(!!storedKey);
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const validateApiKey = async (key: string): Promise<boolean> => {
    try {
      setIsValidating(true);
      console.log('Validating API key...');
      
      // Make a simple request to the OpenAI API to check if the key is valid
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`,
        },
      });
      
      console.log('Validation response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('API validation error:', errorData);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('API key validation error:', error);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    // Check if the API key starts with "sk-" (standard format for OpenAI keys)
    if (!apiKey.trim().startsWith('sk-')) {
      toast.error('Invalid API key format. OpenAI keys should start with "sk-"');
      return;
    }

    // Validate the API key
    const isValid = await validateApiKey(apiKey.trim());
    
    if (!isValid) {
      toast.error('Invalid API key. Please check your key and try again.');
      return;
    }

    localStorage.setItem('openai_api_key', apiKey.trim());
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
              <p className="text-xs text-gray-500">
                API keys must start with "sk-" and should be from OpenAI
              </p>
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
                <Button 
                  onClick={handleSave}
                  disabled={isValidating}
                >
                  {isValidating ? 'Validating...' : 'Save Key'}
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
