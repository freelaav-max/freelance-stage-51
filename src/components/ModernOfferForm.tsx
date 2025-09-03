import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { createOffer, CreateOfferData } from '@/lib/offers';
import { Calendar, MapPin, Clock, DollarSign } from 'lucide-react';

const modernOfferSchema = z.object({
  freelancer_id: z.string().min(1, 'Freelancer é obrigatório'),
  title: z.string().min(1, 'Título do evento é obrigatório'),
  start_date: z.string().min(1, 'Data de início é obrigatória'),
  end_date: z.string().min(1, 'Data de fim é obrigatória'),
  location: z.string().min(1, 'Localização é obrigatória'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  payment_type: z.enum(['total', 'daily']).refine((val) => val !== undefined, {
    message: 'Forma de pagamento é obrigatória',
  }),
  amount: z.number().min(1, 'Valor deve ser maior que zero'),
  payment_date: z.string().min(1, 'Data de pagamento é obrigatória'),
});

type ModernOfferFormData = z.infer<typeof modernOfferSchema>;

interface ModernOfferFormProps {
  freelancerId: string;
  specialty?: string;
  onSuccess?: () => void;
}

export const ModernOfferForm: React.FC<ModernOfferFormProps> = ({ 
  freelancerId, 
  specialty = 'video',
  onSuccess 
}) => {
  const queryClient = useQueryClient();
  const [paymentType, setPaymentType] = useState<'total' | 'daily'>('total');
  
  const form = useForm<ModernOfferFormData>({
    resolver: zodResolver(modernOfferSchema),
    defaultValues: {
      freelancer_id: freelancerId,
      title: '',
      start_date: '',
      end_date: '',
      location: '',
      description: '',
      payment_type: 'total',
      amount: 0,
      payment_date: '',
    }
  });

  const createOfferMutation = useMutation({
    mutationFn: createOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      toast({
        title: 'Oferta enviada com sucesso!',
        description: 'O freelancer receberá uma notificação sobre sua oferta.',
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Error creating offer:', error);
      toast({
        title: 'Erro ao enviar oferta',
        description: 'Não foi possível enviar a oferta. Tente novamente.',
        variant: 'destructive',
      });
    }
  });

  const onSubmit = (data: ModernOfferFormData) => {
    // Adaptar os dados para o formato esperado pela API
    const offerData: CreateOfferData = {
      freelancer_id: data.freelancer_id,
      specialty: specialty as any,
      title: data.title,
      description: data.description,
      event_date: data.start_date,
      event_time: '',
      location: data.location,
      duration: calculateDuration(data.start_date, data.end_date),
      budget: Number(data.amount)
    };
    
    createOfferMutation.mutate(offerData);
  };

  const calculateDuration = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * 8; // Assumindo 8 horas por dia
  };

  const getAmountLabel = () => {
    return paymentType === 'daily' ? 'Cachê por Dia (R$)' : 'Valor Total (R$)';
  };

  // Configurar data mínima para hoje
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full max-w-2xl mx-auto bg-background rounded-xl shadow-lg border">
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Enviar Nova Oferta
          </h1>
          <p className="text-muted-foreground">
            Preencha os detalhes abaixo para contratar um freelancer.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Título do Evento */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">
                    Título do Evento/Trabalho
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="Ex: Operador de Câmera para Evento Corporativo"
                      className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Datas de Início e Fim */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Data de Início
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        type="date"
                        min={today}
                        className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition"
                        onChange={(e) => {
                          field.onChange(e);
                          // Atualizar data mínima do fim
                          const endDateField = form.getValues('end_date');
                          if (endDateField && endDateField < e.target.value) {
                            form.setValue('end_date', e.target.value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Data de Fim
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        type="date"
                        min={form.watch('start_date') || today}
                        className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition"
                        onChange={(e) => {
                          field.onChange(e);
                          // Atualizar data mínima do pagamento
                          const paymentDateField = form.getValues('payment_date');
                          if (paymentDateField && paymentDateField < e.target.value) {
                            form.setValue('payment_date', e.target.value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Localização */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Localização
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="Ex: Centro de Convenções, Rio de Janeiro - RJ"
                      className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Descrição Detalhada */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">
                    Descrição Detalhada
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      rows={4}
                      placeholder="Descreva as responsabilidades, equipamentos necessários, horários, etc."
                      className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Opções de Pagamento */}
            <FormField
              control={form.control}
              name="payment_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">
                    Forma de Pagamento
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        setPaymentType(value as 'total' | 'daily');
                      }}
                      defaultValue={field.value}
                      className="flex items-center gap-x-6 bg-muted p-3 rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="total" id="payment-total" />
                        <Label htmlFor="payment-total" className="text-sm text-foreground cursor-pointer">
                          Valor Total pelo Evento
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="daily" id="payment-daily" />
                        <Label htmlFor="payment-daily" className="text-sm text-foreground cursor-pointer">
                          Cachê por Dia
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Valor do Pagamento */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    {getAmountLabel()}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground">
                        R$
                      </span>
                      <Input 
                        {...field}
                        type="number"
                        placeholder="1500,00"
                        step="0.01"
                        min="0"
                        className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Data Prevista para Pagamento */}
            <FormField
              control={form.control}
              name="payment_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Data Prevista para Pagamento
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      type="date"
                      min={form.watch('end_date') || today}
                      className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botão de Envio */}
            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={createOfferMutation.isPending}
                className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                {createOfferMutation.isPending ? 'Enviando Oferta...' : 'Enviar Oferta'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};