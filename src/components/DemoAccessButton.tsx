
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PlayCircle } from 'lucide-react';
import { DemoGuide } from './DemoGuide';

export const DemoAccessButton: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="fixed bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white border-orange-500 shadow-lg z-50"
        >
          <PlayCircle className="h-4 w-4 mr-2" />
          Demo Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DemoGuide />
      </DialogContent>
    </Dialog>
  );
};
