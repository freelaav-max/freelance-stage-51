import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ModernOfferForm } from '@/components/ModernOfferForm';

interface MobileOfferSheetProps {
  freelancerId: string;
  specialty: string;
  children?: React.ReactNode;
}

const MobileOfferSheet = ({ freelancerId, specialty, children }: MobileOfferSheetProps) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleOpenOffer = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setOpen(true);
  };

  const handleSuccess = () => {
    setOpen(false);
  };

  const triggerButton = children || (
    <Button className="flex-1 btn-gradient">
      <MessageCircle className="mr-2 h-4 w-4" />
      Enviar Oferta
    </Button>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <div onClick={handleOpenOffer}>
            {triggerButton}
          </div>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[90vh]">
          <SheetHeader>
            <SheetTitle>Enviar Oferta</SheetTitle>
          </SheetHeader>
          <div className="mt-6 h-[calc(100%-4rem)] overflow-y-auto">
            <ModernOfferForm
              freelancerId={freelancerId}
              specialty={specialty}
              onSuccess={handleSuccess}
            />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div onClick={handleOpenOffer}>
          {triggerButton}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enviar Oferta</DialogTitle>
        </DialogHeader>
        <ModernOfferForm
          freelancerId={freelancerId}
          specialty={specialty}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MobileOfferSheet;