
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { ContentIdea } from '@/contexts/MarketingToolContext';

interface PublishedContentListProps {
  publishedContent: ContentIdea[];
}

const PublishedContentList: React.FC<PublishedContentListProps> = ({ publishedContent }) => {
  const copyShareLink = (content: ContentIdea) => {
    navigator.clipboard.writeText(content.publishLink || '');
    toast.success('Share link copied to clipboard!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Published Content</CardTitle>
        <CardDescription>
          Share links to your published content
        </CardDescription>
      </CardHeader>
      <CardContent>
        {publishedContent.length === 0 ? (
          <p className="text-gray-600 text-center py-4">
            No content published yet. Go back to the Content step to publish content.
          </p>
        ) : (
          <div className="space-y-4">
            {publishedContent.map((content) => (
              <div 
                key={content.id} 
                className="flex justify-between items-center border p-3 rounded-md hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">{content.title}</p>
                  <p className="text-sm text-gray-600">{content.type}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyShareLink(content)}
                  className="flex items-center gap-1"
                >
                  <Copy className="h-4 w-4" />
                  Copy Link
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PublishedContentList;
