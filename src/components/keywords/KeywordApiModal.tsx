
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface KeywordApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

/**
 * KeywordApiModal Component
 * 
 * A modal dialog for entering and saving a Google Keyword Planner API key
 * The API key is used for keyword optimization features
 * 
 * @param isOpen - Whether the modal is currently displayed
 * @param onClose - Function to call when the modal is closed
 * @param onSave - Function to call with the API key when it's saved
 */
const KeywordApiModal: React.FC<KeywordApiModalProps> = ({ isOpen, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  /**
   * Handle saving the API key
   * Performs basic validation before calling the onSave callback
   */
  const handleSave = async () => {
    if (!apiKey.trim()) {
      return;
    }

    setIsValidating(true);
    try {
      // Simple validation - in a real app, you might want to validate this properly
      if (apiKey.length < 10) {
        throw new Error('API key is too short');
      }
      
      onSave(apiKey.trim());
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Google Keyword Planner API Key</DialogTitle>
          <DialogDescription>
            Enter your Google Keyword Planner API key to optimize keywords. 
            Your key will be stored locally in your browser.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Google Keyword API key"
            />
            <p className="text-xs text-gray-500">
              This key will only be stored in your browser's local storage and is not sent to our servers.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isValidating || !apiKey.trim()}
          >
            {isValidating ? 'Validating...' : 'Save & Optimize'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KeywordApiModal;
