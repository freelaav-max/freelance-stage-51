import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { updateOfferStatus, UpdateOfferStatusData, Offer } from '@/lib/offers';
import { CheckCircle, XCircle, DollarSign } from 'lucide-react';

const counterOfferSchema = z.object({
  counter_price: z.number().min(1, 'Valor deve ser maior que zero'),
});

const rejectionSchema = z.object({
  rejection_reason: z.string().min(1, 'Motivo é obrigatório'),
});

interface OfferActionsProps {
  offer: Offer;
  userType: 'client' | 'freelancer';
}

export const OfferActions: React.FC<OfferActionsProps> = ({ offer, userType }) => {
  const queryClient = useQueryClient();
  const [isCounterOfferOpen, setIsCounterOfferOpen] = useState(false);
  const [isRejectionOpen, setIsRejectionOpen] = useState(false);

  const counterOfferForm = useForm<{ counter_price: number }>({
    resolver: zodResolver(counterOfferSchema),
    defaultValues: { counter_price: offer.budget }
  });

  const rejectionForm = useForm<{ rejection_reason: string }>({
    resolver: zodResolver(rejectionSchema),
    defaultValues: { rejection_reason: '' }
  });

  const updateStatusMutation = useMutation({
    mutationFn: (statusData: UpdateOfferStatusData) => updateOfferStatus(offer.id, statusData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      toast({
        title: 'Status atualizado!',
        description: 'O status da oferta foi atualizado com sucesso.',
      });
      setIsCounterOfferOpen(false);
      setIsRejectionOpen(false);
    },
    onError: (error) => {
      console.error('Error updating offer status:', error);
      toast({
        title: 'Erro ao atualizar status',
        description: 'Não foi possível atualizar o status da oferta. Tente novamente.',
        variant: 'destructive',
      });
    }
  });

  const handleAccept = () => {
    updateStatusMutation.mutate({ status: 'accepted' });
  };

  const handleCounterOffer = (data: { counter_price: number }) => {
    updateStatusMutation.mutate({
      status: 'counter_offer',
      counter_price: data.counter_price
    });
  };

  const handleReject = (data: { rejection_reason: string }) => {
    updateStatusMutation.mutate({
      status: 'rejected',
      rejection_reason: data.rejection_reason
    });
  };

  // Only show actions if the offer is pending and user is the freelancer
  if (offer.status !== 'pending' || userType !== 'freelancer') {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações da Oferta</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3">
          <Button 
            onClick={handleAccept}
            disabled={updateStatusMutation.isPending}
            className="w-full"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {updateStatusMutation.isPending ? 'Processando...' : 'Aceitar Oferta'}
          </Button>

          <Dialog open={isCounterOfferOpen} onOpenChange={setIsCounterOfferOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <DollarSign className="h-4 w-4 mr-2" />
                Fazer Contraproposta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Fazer Contraproposta</DialogTitle>
              </DialogHeader>
              <Form {...counterOfferForm}>
                <form onSubmit={counterOfferForm.handleSubmit(handleCounterOffer)} className="space-y-4">
                  <FormField
                    control={counterOfferForm.control}
                    name="counter_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Novo Valor (R$)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Digite o novo valor"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={updateStatusMutation.isPending}
                  >
                    {updateStatusMutation.isPending ? 'Enviando...' : 'Enviar Contraproposta'}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={isRejectionOpen} onOpenChange={setIsRejectionOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <XCircle className="h-4 w-4 mr-2" />
                Recusar Oferta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Recusar Oferta</DialogTitle>
              </DialogHeader>
              <Form {...rejectionForm}>
                <form onSubmit={rejectionForm.handleSubmit(handleReject)} className="space-y-4">
                  <FormField
                    control={rejectionForm.control}
                    name="rejection_reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motivo da Recusa</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Explique o motivo da recusa..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    variant="destructive"
                    className="w-full"
                    disabled={updateStatusMutation.isPending}
                  >
                    {updateStatusMutation.isPending ? 'Processando...' : 'Confirmar Recusa'}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};