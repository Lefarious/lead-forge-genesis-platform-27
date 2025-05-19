
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { USP } from '@/contexts/MarketingToolContext';

interface USPCardProps {
  usp: USP;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const USPCard: React.FC<USPCardProps> = ({
  usp,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  return (
    <Card className="h-full flex flex-col border-2 transition-all hover:shadow-md dark:hover:shadow-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex justify-between items-start gap-2">
          <span>{usp.title}</span>
          {usp.isCustomAdded && (
            <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Custom
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 dark:text-gray-300 mb-4">{usp.description}</p>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Target ICP</h4>
            <p className="text-sm">{usp.targetICP}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Value Proposition</h4>
            <p className="text-sm">{usp.valueProposition}</p>
          </div>
        </div>
      </CardContent>
      
      {showActions && (
        <CardFooter className="border-t bg-gray-50 dark:bg-gray-800 flex justify-end space-x-2 pt-3">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(usp.id)}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="outline" size="sm" onClick={() => onDelete(usp.id)}>
              Delete
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default USPCard;
