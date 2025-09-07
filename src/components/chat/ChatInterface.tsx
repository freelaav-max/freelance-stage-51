
import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { sendMessage, getMessages, markMessageAsRead, NewMessageData } from '@/lib/messages';
import { getAvatarUrl } from '@/lib/storage';
import { Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';

const messageSchema = z.object({
  content: z.string().min(1, 'Mensagem não pode estar vazia'),
});

interface ChatInterfaceProps {
  offerId: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  offerId,
  receiverId,
  receiverName,
  receiverAvatar
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<{ content: string }>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: '' }
  });

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', offerId],
    queryFn: () => getMessages(offerId),
  });

  // Set up Realtime subscription for new messages
  useEffect(() => {
    if (!user || !offerId) return;

    console.log('Setting up realtime subscription for offer:', offerId);

    const channel = supabase
      .channel(`messages-${offerId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `offer_id=eq.${offerId}`,
        },
        (payload) => {
          console.log('New message received via realtime:', payload);
          
          // Invalidate and refetch messages
          queryClient.invalidateQueries({ queryKey: ['messages', offerId] });
          
          // Show toast for received messages (not sent by current user)
          if (payload.new.sender_id !== user.id) {
            toast({
              title: 'Nova mensagem',
              description: 'Você recebeu uma nova mensagem',
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [user, offerId, queryClient]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (messageData: NewMessageData) => sendMessage(messageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', offerId] });
      form.reset();
      // Auto-scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast({
        title: 'Erro ao enviar mensagem',
        description: 'Não foi possível enviar a mensagem. Tente novamente.',
        variant: 'destructive',
      });
    }
  });

  const onSubmit = (data: { content: string }) => {
    if (!user) return;

    const messageData: NewMessageData = {
      offer_id: offerId,
      receiver_id: receiverId,
      content: data.content.trim()
    };

    sendMessageMutation.mutate(messageData);
  };

  // Auto-scroll to bottom when messages change and mark received messages as read
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Mark unread received messages as read
    if (user && messages.length > 0) {
      const unreadReceivedMessages = messages.filter((message: any) => 
        message.receiver_id === user.id && !message.read_at
      );
      
      unreadReceivedMessages.forEach((message: any) => {
        markMessageAsRead(message.id).catch(console.error);
      });
      
      if (unreadReceivedMessages.length > 0) {
        // Invalidate messages query to refresh the data
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['messages', offerId] });
        }, 1000);
      }
    }
  }, [messages, user, offerId, queryClient]);

  if (isLoading) {
    return (
      <Card className="h-[500px] flex items-center justify-center">
        <div>Carregando mensagens...</div>
      </Card>
    );
  }

  return (
    <Card className="h-[500px] md:h-[70vh] min-h-[calc(100dvh-var(--header-height,4rem)-var(--safe-area-bottom,0px))] md:min-h-0 flex flex-col">
      <CardHeader className="pb-3 shrink-0">
        <CardTitle className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={getAvatarUrl(receiverAvatar)} alt={receiverName} />
            <AvatarFallback>{receiverName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-lg">{receiverName}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 px-4 min-h-0">
          <div className="space-y-4 py-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Nenhuma mensagem ainda. Inicie a conversa!
              </div>
            ) : (
              messages.map((message: any) => {
                const isOwnMessage = message.sender_id === user?.id;
                const messageTime = format(new Date(message.sent_at), 'HH:mm', { locale: ptBR });

                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-3 py-2 ${
                        isOwnMessage
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        isOwnMessage 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {messageTime}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t p-4 shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Digite sua mensagem..."
                        {...field}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            form.handleSubmit(onSubmit)();
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="min-h-11 min-w-11 p-3"
                disabled={sendMessageMutation.isPending || !form.watch('content')?.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};
