import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MapPin, Clock, DollarSign, Shield, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PaymentDisclaimer } from '@/components/PaymentDisclaimer';

interface BookingCreationFlowProps {
  offerId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface BookingData {
  location: string;
  totalAmount: number;
  paymentMethod: string;
  eventDate: string;
  notes?: string;
}

export const BookingCreationFlow: React.FC<BookingCreationFlowProps> = ({
  offerId,
  onSuccess,
  onCancel,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    location: '',
    totalAmount: 0,
    paymentMethod: '',
    eventDate: '',
    notes: '',
  });

  const handleCreateBooking = async () => {
    if (!user?.id || !offerId) return;

    try {
      setLoading(true);

      const { data: offer, error: offerError } = await supabase
        .from('offers')
        .select('*')
        .eq('id', offerId)
        .eq('status', 'accepted')
        .single();

      if (offerError || !offer) {
        toast({
          title: "Erro",
          description: "Oferta não encontrada ou não aceita",
          variant: "destructive",
        });
        return;
      }

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          offer_id: offerId,
          client_id: offer.client_id,
          freelancer_id: offer.freelancer_id,
          location: bookingData.location,
          event_date: bookingData.eventDate,
          total_amount: bookingData.totalAmount,
          deposit_amount: 0, // No platform-managed deposits
          status: 'confirmed',
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      toast({
        title: "Contrato criado com sucesso!",
        description: "Entre em contato diretamente com o freelancer para acertar os detalhes do pagamento.",
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Erro ao criar contrato",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <PaymentDisclaimer />
            
            <div className="space-y-2">
              <Label htmlFor="location">Local do Evento *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="Endereço completo do evento"
                  value={bookingData.location}
                  onChange={(e) => setBookingData(prev => ({ ...prev, location: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDate">Data do Evento *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="eventDate"
                  type="datetime-local"
                  value={bookingData.eventDate}
                  onChange={(e) => setBookingData(prev => ({ ...prev, eventDate: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalAmount">Valor Acordado (R$)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="totalAmount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={bookingData.totalAmount || ''}
                    onChange={(e) => setBookingData(prev => ({ 
                      ...prev, 
                      totalAmount: parseFloat(e.target.value) || 0 
                    }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Forma de Pagamento Combinada</Label>
                <Input
                  id="paymentMethod"
                  placeholder="Ex: PIX, Dinheiro, Transferência"
                  value={bookingData.paymentMethod}
                  onChange={(e) => setBookingData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações do Contrato</Label>
              <Textarea
                id="notes"
                placeholder="Detalhes sobre horários, equipamentos, forma de pagamento..."
                value={bookingData.notes}
                onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h4 className="font-semibold">Resumo do Contrato</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Local:</span>
                  <span className="font-medium">{bookingData.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Data:</span>
                  <span className="font-medium">
                    {new Date(bookingData.eventDate).toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Valor Acordado:</span>
                  <span className="font-medium">R$ {bookingData.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pagamento:</span>
                  <span className="font-medium">{bookingData.paymentMethod}</span>
                </div>
              </div>
            </div>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Após confirmar, entre em contato diretamente com o freelancer 
                para acertar todos os detalhes do pagamento e execução do serviço.
              </AlertDescription>
            </Alert>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return bookingData.location && bookingData.eventDate;
      case 2:
        return bookingData.totalAmount > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Criar Contrato - Etapa {step} de 3
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderStep()}

        <div className="flex gap-2">
          {step > 1 && (
            <Button 
              variant="outline" 
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              Voltar
            </Button>
          )}
          
          {onCancel && (
            <Button 
              variant="ghost" 
              onClick={onCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
          )}

          {step < 3 ? (
            <Button 
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex-1"
            >
              Próximo
            </Button>
          ) : (
            <Button 
              onClick={handleCreateBooking}
              disabled={loading || !canProceed()}
              className="flex-1"
            >
              {loading ? 'Criando...' : 'Confirmar Contrato'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};