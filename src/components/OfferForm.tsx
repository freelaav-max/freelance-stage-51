
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { createOffer, CreateOfferData } from '@/lib/offers';
import { SPECIALTIES } from '@/lib/freelancer';

const offerSchema = z.object({
  freelancer_id: z.string().min(1, 'Freelancer é obrigatório'),
  specialty: z.string().min(1, 'Especialidade é obrigatória'),
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  event_date: z.string().min(1, 'Data do evento é obrigatória'),
  event_time: z.string().optional(),
  location: z.string().min(1, 'Local é obrigatório'),
  duration: z.number().optional(),
  budget: z.number().min(1, 'Orçamento deve ser maior que zero')
});

type OfferFormData = z.infer<typeof offerSchema>;

interface OfferFormProps {
  freelancerId: string;
  onSuccess?: () => void;
}

export const OfferForm: React.FC<OfferFormProps> = ({ freelancerId, onSuccess }) => {
  const queryClient = useQueryClient();
  
  const form = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      freelancer_id: freelancerId,
      specialty: '',
      title: '',
      description: '',
      event_date: '',
      event_time: '',
      location: '',
      duration: undefined,
      budget: 0
    }
  });

  const createOfferMutation = useMutation({
    mutationFn: createOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      toast({
        title: 'Oferta enviada!',
        description: 'Sua oferta foi enviada com sucesso. O freelancer receberá uma notificação.',
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

  const onSubmit = (data: OfferFormData) => {
    const offerData: CreateOfferData = {
      ...data,
      specialty: data.specialty as any, // Type assertion for enum
      budget: Number(data.budget)
    };
    
    createOfferMutation.mutate(offerData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enviar Oferta</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especialidade</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a especialidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SPECIALTIES.map((specialty) => (
                        <SelectItem key={specialty.value} value={specialty.value}>
                          {specialty.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Evento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Casamento João e Maria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva os detalhes do evento e o que você precisa..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="event_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data do Evento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local</FormLabel>
                  <FormControl>
                    <Input placeholder="Endereço do evento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração (horas)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Ex: 8"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormDescription>Duração estimada em horas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orçamento (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Ex: 1500"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={createOfferMutation.isPending}
            >
              {createOfferMutation.isPending ? 'Enviando...' : 'Enviar Oferta'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
