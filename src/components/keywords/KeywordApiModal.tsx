
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface KeywordApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (token: string) => void;
}

const KeywordApiModal: React.FC<KeywordApiModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    if (!token) return;
    
    setIsLoading(true);
    // Simulate API token verification
    setTimeout(() => {
      onSave(token);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Developer Token Required</DialogTitle>
          <DialogDescription>
            Please enter your developer token to access the keyword optimization features.
            This token is used for API authentication to generate and optimize keywords.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="token">Developer Token</Label>
            <Input 
              id="token" 
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your developer token"
            />
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Your token is stored locally and never sent to our servers.</p>
            <p>Manager Customer ID: <span className="font-mono">981-519-4690</span></p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!token || isLoading}
          >
            {isLoading ? 'Verifying...' : 'Save Token'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KeywordApiModal;
